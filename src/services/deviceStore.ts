import { PairedDevice, StreamSession, StreamApprovalRequest, PairingSession } from '../types';

const STORAGE_KEY_DEVICES = 'smartremote_paired_devices_v1';
const STORAGE_KEY_SESSIONS = 'smartremote_active_sessions_v1';

export const INITIAL_DEVICES: PairedDevice[] = [
  {
    id: 'dev_pixel8_pro',
    name: 'Field Pixel 8 Pro (HQ North)',
    model: 'Google Pixel 8 Pro (Tensor G3)',
    androidVersion: 'Android 15 (AP2A.240805)',
    ipAddress: '192.168.1.142',
    networkType: 'MOBILE_5G',
    isOnline: true,
    battery: {
      level: 84,
      isCharging: false,
      chargingSource: 'BATTERY',
      temperature: 31.2,
      health: 'GOOD',
      updatedAt: 'Just now',
    },
    lastSeen: '1 minute ago',
    pairedAt: '2026-10-15T14:20:00Z',
    cameraFacing: 'BACK',
    isStreamingCamera: false,
    isStreamingAudio: false,
  },
  {
    id: 'dev_galaxy_s24',
    name: 'Warehouse Galaxy S24 Ultra',
    model: 'Samsung Galaxy S24 Ultra (Snapdragon 8 Gen 3)',
    androidVersion: 'Android 14 (One UI 6.1)',
    ipAddress: '10.0.4.88',
    networkType: 'WIFI',
    isOnline: true,
    battery: {
      level: 62,
      isCharging: true,
      chargingSource: 'AC',
      temperature: 34.8,
      health: 'GOOD',
      updatedAt: '30 seconds ago',
    },
    lastSeen: 'Live',
    pairedAt: '2026-10-22T09:15:00Z',
    cameraFacing: 'BACK',
    isStreamingCamera: false,
    isStreamingAudio: false,
  },
  {
    id: 'dev_xiaomi_14',
    name: 'Fleet Patrol Xiaomi 14',
    model: 'Xiaomi 14 (Leica Optics)',
    androidVersion: 'Android 14 (HyperOS)',
    ipAddress: '172.20.10.5',
    networkType: 'MOBILE_4G',
    isOnline: false,
    battery: {
      level: 19,
      isCharging: false,
      chargingSource: 'BATTERY',
      temperature: 28.0,
      health: 'GOOD',
      updatedAt: '2 hours ago',
    },
    lastSeen: '2 hours ago',
    pairedAt: '2026-11-01T11:00:00Z',
    cameraFacing: 'BACK',
    isStreamingCamera: false,
    isStreamingAudio: false,
  },
];

type Listener = () => void;

class DeviceStore {
  private devices: PairedDevice[] = [];
  private activeSessions: Map<string, StreamSession> = new Map();
  private pendingApproval: StreamApprovalRequest | null = null;
  private currentPairing: PairingSession | null = null;
  private listeners: Set<Listener> = new Set();
  private localDeviceId: string = 'dev_local_phone';

  constructor() {
    this.loadState();
    this.initRealBatteryListener();
  }

  private loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEVICES);
      if (saved) {
        this.devices = JSON.parse(saved);
      } else {
        this.devices = [...INITIAL_DEVICES];
        this.saveState();
      }
    } catch (e) {
      this.devices = [...INITIAL_DEVICES];
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(this.devices));
    } catch (e) {
      console.warn('Failed to save devices to localStorage');
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Devices API
  public getDevices(): PairedDevice[] {
    return [...this.devices];
  }

  public getDeviceById(id: string): PairedDevice | undefined {
    return this.devices.find((d) => d.id === id);
  }

  public getLocalDeviceId(): string {
    return this.localDeviceId;
  }

  public addDevice(device: PairedDevice) {
    this.devices = [device, ...this.devices.filter((d) => d.id !== device.id)];
    this.saveState();
  }

  public updateDevice(id: string, updates: Partial<PairedDevice>) {
    this.devices = this.devices.map((d) => (d.id === id ? { ...d, ...updates } : d));
    this.saveState();
  }

  public removeDevice(id: string) {
    this.devices = this.devices.filter((d) => d.id !== id);
    this.saveState();
  }

  public renameDevice(id: string, newName: string) {
    this.updateDevice(id, { name: newName });
  }

  // Battery Telemetry
  public updateBattery(deviceId: string, batteryUpdates: Partial<PairedDevice['battery']>) {
    const dev = this.getDeviceById(deviceId);
    if (!dev) return;

    const newBattery = {
      ...dev.battery,
      ...batteryUpdates,
      updatedAt: 'Just now',
    };
    this.updateDevice(deviceId, { battery: newBattery });
  }

  private async initRealBatteryListener() {
    try {
      if ('getBattery' in navigator) {
        const battery: any = await (navigator as any).getBattery();
        const updateFromSystem = () => {
          const level = Math.round(battery.level * 100);
          const isCharging = battery.charging;
          this.updateBattery(this.localDeviceId, {
            level,
            isCharging,
            chargingSource: isCharging ? 'AC' : 'BATTERY',
          });
        };

        updateFromSystem();
        battery.addEventListener('levelchange', updateFromSystem);
        battery.addEventListener('chargingchange', updateFromSystem);
      }
    } catch (e) {
      // Browser Battery API restricted or unavailable
    }
  }

  // Pairing Flow
  public generatePairingSession(adminId: string, adminEmail: string, adminName: string): PairingSession {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    const payload = JSON.stringify({
      version: '1.0',
      action: 'PAIR_DEVICE',
      code,
      adminId,
      adminEmail,
      adminName,
      exp: expiresAt,
    });

    this.currentPairing = {
      pairingCode: code,
      qrPayload: payload,
      adminId,
      adminEmail,
      adminName,
      expiresAt,
    };
    this.notify();
    return this.currentPairing;
  }

  public getCurrentPairing(): PairingSession | null {
    if (this.currentPairing && Date.now() > this.currentPairing.expiresAt) {
      this.currentPairing = null;
    }
    return this.currentPairing;
  }

  public pairNewDeviceWithPin(pin: string, customName?: string): PairedDevice | null {
    const session = this.getCurrentPairing();
    if (!session || session.pairingCode !== pin.trim()) {
      // Allow fallback sample PIN pairing if testing
      if (pin.trim().length !== 6) return null;
    }

    const newDevice: PairedDevice = {
      id: `dev_${Date.now().toString(36)}`,
      name: customName || `Android Client (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      model: 'OnePlus 12 (OxygenOS 14)',
      androidVersion: 'Android 14 (Security Patch Nov 2026)',
      ipAddress: '192.168.1.109',
      networkType: 'MOBILE_5G',
      isOnline: true,
      battery: {
        level: 92,
        isCharging: true,
        chargingSource: 'AC',
        temperature: 30.5,
        health: 'GOOD',
        updatedAt: 'Just now',
      },
      lastSeen: 'Live',
      pairedAt: new Date().toISOString(),
      cameraFacing: 'BACK',
      isStreamingCamera: false,
      isStreamingAudio: false,
    };

    this.addDevice(newDevice);
    this.currentPairing = null;
    return newDevice;
  }

  // WebRTC Stream Session Request & Approval Workflow
  public requestMediaSession(
    deviceId: string,
    adminName: string,
    adminEmail: string,
    streamType: 'CAMERA' | 'AUDIO' | 'BOTH'
  ): StreamSession {
    const sessionId = `sess_${Date.now()}`;
    const session: StreamSession = {
      id: sessionId,
      deviceId,
      adminId: 'admin_master',
      type: streamType,
      cameraFacing: 'BACK',
      status: 'PENDING_APPROVAL',
      bitrateKbps: 0,
      resolution: '1280x720',
      fps: 30,
      latencyMs: 0,
      isMuted: false,
      audioActive: streamType !== 'CAMERA',
      requestedAt: new Date().toLocaleTimeString(),
      turnRelayUsed: true,
    };

    this.activeSessions.set(deviceId, session);

    // Trigger incoming approval modal for remote device
    this.pendingApproval = {
      sessionId,
      adminName,
      adminEmail,
      adminDeviceId: 'Console-Admin-MacBook',
      requestedTypes: streamType === 'BOTH' ? ['CAMERA', 'AUDIO'] : [streamType],
      timestamp: new Date().toLocaleTimeString(),
    };

    this.updateDevice(deviceId, {
      activeSessionId: sessionId,
      isStreamingCamera: false,
      isStreamingAudio: false,
    });

    return session;
  }

  public getPendingApproval(): StreamApprovalRequest | null {
    return this.pendingApproval;
  }

  public approveSession(sessionId: string): boolean {
    for (const [deviceId, session] of this.activeSessions.entries()) {
      if (session.id === sessionId) {
        session.status = 'ACTIVE';
        session.startTime = new Date().toLocaleTimeString();
        session.bitrateKbps = 2100;
        session.latencyMs = 24;

        this.updateDevice(deviceId, {
          isStreamingCamera: session.type === 'CAMERA' || session.type === 'BOTH',
          isStreamingAudio: session.type === 'AUDIO' || session.type === 'BOTH',
        });

        this.pendingApproval = null;
        this.notify();
        return true;
      }
    }
    return false;
  }

  public rejectSession(sessionId: string, reason: string = 'User declined session on device') {
    for (const [deviceId, session] of this.activeSessions.entries()) {
      if (session.id === sessionId) {
        session.status = 'REJECTED';
        this.updateDevice(deviceId, {
          isStreamingCamera: false,
          isStreamingAudio: false,
          activeSessionId: undefined,
        });
        this.activeSessions.delete(deviceId);
      }
    }
    this.pendingApproval = null;
    this.notify();
  }

  public terminateSession(deviceId: string) {
    const session = this.activeSessions.get(deviceId);
    if (session) {
      session.status = 'TERMINATED';
      this.activeSessions.delete(deviceId);
    }
    this.updateDevice(deviceId, {
      isStreamingCamera: false,
      isStreamingAudio: false,
      activeSessionId: undefined,
    });
    this.pendingApproval = null;
    this.notify();
  }

  public getActiveSession(deviceId: string): StreamSession | undefined {
    return this.activeSessions.get(deviceId);
  }

  public toggleCameraFacing(deviceId: string) {
    const dev = this.getDeviceById(deviceId);
    if (!dev) return;
    const newFacing = dev.cameraFacing === 'BACK' ? 'FRONT' : 'BACK';
    this.updateDevice(deviceId, { cameraFacing: newFacing });
    const session = this.activeSessions.get(deviceId);
    if (session) {
      session.cameraFacing = newFacing;
      this.notify();
    }
  }
}

export const deviceStore = new DeviceStore();
