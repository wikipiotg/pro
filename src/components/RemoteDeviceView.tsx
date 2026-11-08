import React, { useState, useEffect, useRef } from 'react';
import { deviceStore } from '../services/deviceStore';
import { PairedDevice, StreamApprovalRequest } from '../types';
import { IncomingApprovalModal } from './IncomingApprovalModal';
import {
  Smartphone,
  Video,
  Mic,
  Battery,
  BatteryCharging,
  Wifi,
  Signal,
  Shield,
  ShieldAlert,
  AlertTriangle,
  StopCircle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface Props {
  adminEmail: string;
}

export const RemoteDeviceView: React.FC<Props> = ({ adminEmail }) => {
  const [localDevice, setLocalDevice] = useState<PairedDevice | null>(null);
  const [pendingApproval, setPendingApproval] = useState<StreamApprovalRequest | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [chargingSource, setChargingSource] = useState<'AC' | 'USB' | 'WIRELESS' | 'BATTERY'>('AC');
  const [temperature, setTemperature] = useState<number>(31.4);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);

  useEffect(() => {
    const syncState = () => {
      const devices = deviceStore.getDevices();
      // Use the first device or local device
      const current = devices[0] || null;
      setLocalDevice(current);
      setPendingApproval(deviceStore.getPendingApproval());

      if (current) {
        setBatteryLevel(current.battery.level);
        setIsCharging(current.battery.isCharging);
        setChargingSource(current.battery.chargingSource);
        setTemperature(current.battery.temperature);
        setIsFrontCamera(current.cameraFacing === 'FRONT');
      }
    };

    syncState();
    const unsub = deviceStore.subscribe(syncState);
    return () => unsub();
  }, []);

  const handleApprove = (sessionId: string) => {
    deviceStore.approveSession(sessionId);
  };

  const handleReject = (sessionId: string) => {
    deviceStore.rejectSession(sessionId);
  };

  const handleStopStreaming = () => {
    if (localDevice) {
      deviceStore.terminateSession(localDevice.id);
    }
  };

  const handleBatteryChange = (newLevel: number) => {
    setBatteryLevel(newLevel);
    if (localDevice) {
      deviceStore.updateBattery(localDevice.id, { level: newLevel });
    }
  };

  const handleChargingToggle = () => {
    const nextState = !isCharging;
    setIsCharging(nextState);
    const source = nextState ? 'AC' : 'BATTERY';
    setChargingSource(source);
    if (localDevice) {
      deviceStore.updateBattery(localDevice.id, {
        isCharging: nextState,
        chargingSource: source,
      });
    }
  };

  const isActivelyStreaming = localDevice?.isStreamingCamera || localDevice?.isStreamingAudio;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Incoming Approval Dialog Modal */}
      {pendingApproval && (
        <IncomingApprovalModal
          request={pendingApproval}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Android Device Mock Frame */}
      <div className="bg-[#0B1020] border-4 border-slate-700/80 rounded-[40px] shadow-2xl p-4 overflow-hidden relative text-white">
        {/* Android Punch Hole & Speaker */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-950/80"></div>
          </div>
        </div>

        {/* Android Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-300 px-3 py-1 font-mono">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1 font-sans text-[11px]">
              <span>{batteryLevel}%</span>
              {isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              ) : (
                <Battery className="w-4 h-4 text-slate-300" />
              )}
            </div>
          </div>
        </div>

        {/* Persistent Visible Notification & Camera Indicator (Mandatory Security Rule) */}
        {isActivelyStreaming && (
          <div className="mt-3 p-3.5 bg-red-950/70 border-2 border-red-500 rounded-2xl animate-pulse space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-red-300 tracking-wide">
                  ACTIVE STREAMING IN PROGRESS
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-red-200/90 leading-tight">
              Camera & microphone are actively streaming to administrator ({adminEmail}).
            </p>
            <button
              onClick={handleStopStreaming}
              className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              STOP STREAMING IMMEDIATELY
            </button>
          </div>
        )}

        {/* App Main UI inside Device */}
        <div className="mt-4 p-4 bg-[#151D30] rounded-3xl border border-slate-800 space-y-4">
          {/* Identity Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{localDevice?.name || 'Local Remote Device'}</h4>
                <p className="text-[11px] text-slate-400">{localDevice?.model || 'Android 15 Client'}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Enrolled
            </span>
          </div>

          {/* Pairing Info */}
          <div className="p-3 bg-[#0B1020] rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Paired Administrator</div>
            <div className="text-white font-medium">{adminEmail}</div>
            <div className="text-[11px] text-slate-400">Zero-Trust Mutual Authorization</div>
          </div>

          {/* Live Camera Sensor Status */}
          <div className="p-3 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Selected Sensor</span>
              <span className="text-blue-400 font-semibold">{isFrontCamera ? 'Front (Selfie)' : 'Back (Main 50MP)'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Media State</span>
              <span className={isActivelyStreaming ? 'text-red-400 font-bold' : 'text-slate-400'}>
                {isActivelyStreaming ? 'Broadcasting WebRTC' : 'Idle / Standby'}
              </span>
            </div>
          </div>

          {/* Privacy & Security Enforcement Badge */}
          <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-xl text-xs flex items-start gap-2.5 text-blue-300">
            <Lock className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <p className="text-[11px]">
              No media can be activated secretly. Every stream request requires explicit manual approval on this screen.
            </p>
          </div>
        </div>

        {/* BatteryManager Interactive Hardware Telemetry Sim */}
        <div className="mt-4 p-4 bg-[#151D30] rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Battery Telemetry Controls
            </span>
            <button
              onClick={handleChargingToggle}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                isCharging
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isCharging ? 'Unplug Charger' : 'Plug In AC Charger'}
            </button>
          </div>

          {/* Battery Level Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Simulate Battery Level:</span>
              <span className="font-mono text-white font-bold">{batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={batteryLevel}
              onChange={(e) => handleBatteryChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Temp: {temperature}°C</span>
            <span>Charging Source: {chargingSource}</span>
            <span className="text-emerald-400 font-semibold">Live BatteryManager</span>
          </div>
        </div>

        {/* Android Navigation Pill */}
        <div className="mt-4 flex justify-center pb-1">
          <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
