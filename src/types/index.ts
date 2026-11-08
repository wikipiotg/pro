export type DeviceMode = 'ADMIN' | 'REMOTE_DEVICE';

export interface DeviceBattery {
  level: number; // 0 - 100
  isCharging: boolean;
  chargingSource: 'AC' | 'USB' | 'WIRELESS' | 'BATTERY';
  temperature: number; // in Celsius e.g. 29.5
  health: 'GOOD' | 'OVERHEAT' | 'DEAD' | 'OVER_VOLTAGE';
  updatedAt: string;
}

export interface PairedDevice {
  id: string;
  name: string;
  model: string;
  androidVersion: string;
  ipAddress: string;
  networkType: 'WIFI' | 'MOBILE_5G' | 'MOBILE_4G';
  isOnline: boolean;
  battery: DeviceBattery;
  lastSeen: string;
  pairedAt: string;
  cameraFacing: 'BACK' | 'FRONT';
  isStreamingCamera: boolean;
  isStreamingAudio: boolean;
  activeSessionId?: string;
  token?: string;
}

export interface PairingSession {
  pairingCode: string;
  qrPayload: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  expiresAt: number;
}

export interface StreamSession {
  id: string;
  deviceId: string;
  adminId: string;
  type: 'CAMERA' | 'AUDIO' | 'BOTH';
  cameraFacing: 'BACK' | 'FRONT';
  status: 'PENDING_APPROVAL' | 'ACCEPTED' | 'REJECTED' | 'ACTIVE' | 'TERMINATED';
  startTime?: string;
  bitrateKbps: number;
  resolution: string;
  fps: number;
  latencyMs: number;
  isMuted: boolean;
  audioActive: boolean;
  requestedAt: string;
  turnRelayUsed: boolean;
}

export interface StreamApprovalRequest {
  sessionId: string;
  adminName: string;
  adminEmail: string;
  adminDeviceId: string;
  requestedTypes: ('CAMERA' | 'AUDIO')[];
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'SUPER_ADMIN';
  organization: string;
  avatarUrl?: string;
}

export interface AndroidProjectFile {
  path: string;
  module: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'markdown' | 'json';
  content: string;
  description: string;
}
