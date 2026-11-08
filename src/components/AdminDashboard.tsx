import React, { useState, useEffect, useRef } from 'react';
import { PairedDevice, StreamSession } from '../types';
import { deviceStore } from '../services/deviceStore';
import { WebRtcEngine } from '../services/webrtcService';
import {
  Smartphone,
  Video,
  Mic,
  BatteryCharging,
  Battery,
  Wifi,
  Radio,
  Signal,
  MoreVertical,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volume2,
  VolumeX,
  XCircle,
  ExternalLink,
  Edit2,
  Trash2,
  Activity,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onOpenPairing: () => void;
  adminEmail: string;
}

export const AdminDashboard: React.FC<Props> = ({ onOpenPairing, adminEmail }) => {
  const [devices, setDevices] = useState<PairedDevice[]>(deviceStore.getDevices());
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<StreamSession | null>(null);
  const [isRenamingId, setIsRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [stats, setStats] = useState({ bitrateKbps: 2150, latencyMs: 22, fps: 30, resolution: '1280x720 HD' });

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const webrtcEngineRef = useRef<WebRtcEngine | null>(null);

  useEffect(() => {
    const unsub = deviceStore.subscribe(() => {
      const updatedDevices = deviceStore.getDevices();
      setDevices(updatedDevices);

      if (selectedDeviceId) {
        const sess = deviceStore.getActiveSession(selectedDeviceId);
        setActiveSession(sess || null);
      }
    });

    return () => unsub();
  }, [selectedDeviceId]);

  // Handle active session media stream
  useEffect(() => {
    if (activeSession && activeSession.status === 'ACTIVE') {
      const engine = new WebRtcEngine();
      webrtcEngineRef.current = engine;

      engine.onRemoteStreamReady = (stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
      };

      engine.onStatsUpdate = (newStats) => {
        setStats(newStats);
      };

      // Acquire media (facing mode depends on device state)
      const dev = deviceStore.getDeviceById(activeSession.deviceId);
      const facing = dev?.cameraFacing === 'FRONT' ? 'user' : 'environment';
      engine.acquireMedia(facing, activeSession.type !== 'CAMERA').then((stream) => {
        engine.startPeerConnection(stream);
      });

      return () => {
        engine.stop();
        webrtcEngineRef.current = null;
      };
    } else {
      if (webrtcEngineRef.current) {
        webrtcEngineRef.current.stop();
        webrtcEngineRef.current = null;
      }
    }
  }, [activeSession?.status, activeSession?.id, activeSession?.cameraFacing]);

  const handleRequestMedia = (deviceId: string, type: 'CAMERA' | 'AUDIO' | 'BOTH') => {
    setSelectedDeviceId(deviceId);
    const session = deviceStore.requestMediaSession(deviceId, 'Administrator', adminEmail, type);
    setActiveSession(session);
  };

  const handleTerminateStream = (deviceId: string) => {
    deviceStore.terminateSession(deviceId);
    setActiveSession(null);
  };

  const handleToggleCamera = (deviceId: string) => {
    deviceStore.toggleCameraFacing(deviceId);
  };

  const handleRename = (deviceId: string) => {
    if (newName.trim()) {
      deviceStore.renameDevice(deviceId, newName.trim());
      setIsRenamingId(null);
      setNewName('');
    }
  };

  const handleRevoke = (deviceId: string) => {
    if (confirm('Revoke and unpair this device?')) {
      deviceStore.removeDevice(deviceId);
      if (selectedDeviceId === deviceId) {
        setSelectedDeviceId(null);
        setActiveSession(null);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Metrics calculation
  const totalCount = devices.length;
  const onlineCount = devices.filter((d) => d.isOnline).length;
  const offlineCount = totalCount - onlineCount;
  const activeStreamsCount = devices.filter((d) => d.isStreamingCamera || d.isStreamingAudio).length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#151D30] border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            <Smartphone className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Android 14/15 Fleet</div>
        </div>

        <div className="p-4 bg-[#151D30] border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Online & Reachable</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{onlineCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Wi-Fi & 5G Cellular</div>
        </div>

        <div className="p-4 bg-[#151D30] border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Offline</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-400">{offlineCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Standby mode</div>
        </div>

        <div className="p-4 bg-[#151D30] border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Live Sessions</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400">{activeStreamsCount}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Real-time WebRTC P2P</div>
        </div>
      </div>

      {/* Active Live Streaming Screen Stage (When session is accepted) */}
      {activeSession && (
        <div
          ref={videoContainerRef}
          className="bg-[#151D30] border-2 border-blue-500/40 rounded-2xl overflow-hidden shadow-2xl transition-all"
        >
          {/* Stream Header */}
          <div className="px-5 py-3.5 bg-[#0B1020] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">
                    Live Stream: {devices.find((d) => d.id === activeSession.deviceId)?.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {activeSession.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Sensor: {activeSession.cameraFacing} Camera</span>
                  <span>•</span>
                  <span>Latency: {stats.latencyMs}ms</span>
                  <span>•</span>
                  <span>Bitrate: {stats.bitrateKbps} kbps</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {activeSession.status === 'ACTIVE' && (
                <>
                  <button
                    onClick={() => handleToggleCamera(activeSession.deviceId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Switch Remote Camera"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Flip Cam ({activeSession.cameraFacing})
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </>
              )}
              <button
                onClick={() => handleTerminateStream(activeSession.deviceId)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-red-600/30 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Terminate Stream
              </button>
            </div>
          </div>

          {/* Media Player Container */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {activeSession.status === 'PENDING_APPROVAL' ? (
              <div className="text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto"></div>
                <div className="text-base font-semibold text-white">Waiting for Remote Approval...</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  An access approval prompt has been dispatched to the remote Android device. Streaming begins once approved.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-contain"
                />

                {/* Live Stream Telemetry HUD Overlay */}
                <div className="absolute top-4 left-4 p-2.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    WEBRTC P2P / STUN RELAY
                  </div>
                  <div>FPS: {stats.fps} | RES: {stats.resolution}</div>
                  <div>BITRATE: {stats.bitrateKbps} KBPS</div>
                  <div>RTT LATENCY: {stats.latencyMs} MS</div>
                </div>

                {/* Security Tag */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-slate-400">
                  Secured by Smart Remote Connect Pro ABAC
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Paired Devices Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Enrolled Android Devices</h2>
            <p className="text-xs text-slate-400">Manage connectivity, telemetry, and live camera sessions</p>
          </div>
          <button
            onClick={onOpenPairing}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            + Enroll New Phone
          </button>
        </div>

        {devices.length === 0 ? (
          <div className="p-12 text-center bg-[#151D30] rounded-2xl border border-slate-800 space-y-3">
            <Smartphone className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Paired Devices Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Enroll remote Android devices using QR code pairing or a secure 6-digit one-time PIN.
            </p>
            <button
              onClick={onOpenPairing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Start Pairing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => {
              const isStreaming = device.isStreamingCamera || device.isStreamingAudio;
              return (
                <div
                  key={device.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isStreaming
                      ? 'bg-[#151D30] border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-[#151D30] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Device Name & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {isRenamingId === device.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={device.name}
                            className="px-2 py-1 bg-[#0B1020] border border-blue-500 rounded text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(device.id)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsRenamingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-300"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 group">
                          <h3 className="font-bold text-sm text-white truncate">{device.name}</h3>
                          <button
                            onClick={() => {
                              setIsRenamingId(device.id);
                              setNewName(device.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-slate-400 truncate mt-0.5">{device.model}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          device.isOnline
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${device.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
                        ></span>
                        {device.isOnline ? 'Online' : 'Offline'}
                      </span>

                      <button
                        onClick={() => handleRevoke(device.id)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                        title="Unpair Device"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Battery & Telemetry Meter */}
                  <div className="mt-4 p-3 bg-[#0B1020] rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        {device.battery.isCharging ? (
                          <BatteryCharging className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Battery className="w-4 h-4 text-blue-400" />
                        )}
                        <span>{device.battery.level}% Battery</span>
                        {device.battery.isCharging && (
                          <span className="text-[10px] text-emerald-400 uppercase font-mono">
                            ({device.battery.chargingSource})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{device.battery.temperature}°C</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          device.battery.level < 20
                            ? 'bg-red-500'
                            : device.battery.level < 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${device.battery.level}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{device.networkType} ({device.ipAddress})</span>
                      <span>Last seen: {device.battery.updatedAt}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Camera & Mic Session Request */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRequestMedia(device.id, 'CAMERA')}
                      disabled={!device.isOnline}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Request Camera
                    </button>
                    <button
                      onClick={() => handleRequestMedia(device.id, 'AUDIO')}
                      disabled={!device.isOnline}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold transition-all border border-slate-700/60 cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-indigo-400" />
                      Request Mic
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
