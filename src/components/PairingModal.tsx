import React, { useState, useEffect } from 'react';
import { deviceStore } from '../services/deviceStore';
import { generateQrDataUrl } from '../services/qrService';
import { QrCode, KeyRound, Smartphone, Copy, Check, Clock, ShieldCheck, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
}

export const PairingModal: React.FC<Props> = ({ isOpen, onClose, adminEmail }) => {
  const [activeTab, setActiveTab] = useState<'QR' | 'PIN' | 'QUICK'>('QR');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins in secs
  const [copied, setCopied] = useState<boolean>(false);
  const [customDeviceName, setCustomDeviceName] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const session = deviceStore.generatePairingSession('admin_master', adminEmail, 'Administrator');
    setPairingCode(session.pairingCode);

    generateQrDataUrl(session.qrPayload).then((url) => {
      setQrUrl(url);
    });

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        // Regenerate when expired
        const newSession = deviceStore.generatePairingSession('admin_master', adminEmail, 'Administrator');
        setPairingCode(newSession.pairingCode);
        generateQrDataUrl(newSession.qrPayload).then((url) => setQrUrl(url));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, adminEmail]);

  if (!isOpen) return null;

  const copyPin = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickPair = () => {
    deviceStore.pairNewDeviceWithPin(
      pairingCode,
      customDeviceName.trim() || `Android Client (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    );
    onClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-[#151D30] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pair New Android Device</h3>
              <p className="text-xs text-slate-400">Secure end-to-end device enrollment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#0B1020]/50 p-1.5">
          <button
            onClick={() => setActiveTab('QR')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'QR' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('PIN')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'PIN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            One-Time PIN
          </button>
          <button
            onClick={() => setActiveTab('QUICK')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'QUICK' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Quick Pair
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          {activeTab === 'QR' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-[#0B1020] rounded-2xl border border-blue-500/30 shadow-inner">
                {qrUrl ? (
                  <img src={qrUrl} alt="Pairing QR Code" className="w-48 h-48 rounded-xl object-contain" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-300">
                  Open <strong>Smart Remote Connect Pro</strong> on the remote Android phone and tap <em>Scan QR</em>.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PIN' && (
            <div className="flex flex-col items-center text-center space-y-5">
              <p className="text-xs text-slate-300">
                Enter this temporary 6-digit one-time PIN in the client app:
              </p>

              <div className="flex items-center gap-3">
                <div className="px-6 py-3.5 bg-[#0B1020] border-2 border-blue-500/50 rounded-xl font-mono text-3xl font-black tracking-widest text-blue-400 shadow-lg">
                  {pairingCode}
                </div>
                <button
                  onClick={copyPin}
                  className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Copy PIN"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Expires in: <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          )}

          {activeTab === 'QUICK' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Instantly provision and enroll a simulated Android remote device into this dashboard:
              </p>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Device Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Field Ops OnePlus 12"
                  value={customDeviceName}
                  onChange={(e) => setCustomDeviceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleQuickPair}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Enroll Simulated Device Now
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0B1020] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Admin: {adminEmail}</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Zero-Trust Pair
          </span>
        </div>
      </div>
    </div>
  );
};
