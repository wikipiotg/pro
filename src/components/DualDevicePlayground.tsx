import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { RemoteDeviceView } from './RemoteDeviceView';
import { Layers, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface Props {
  onOpenPairing: () => void;
  adminEmail: string;
}

export const DualDevicePlayground: React.FC<Props> = ({ onOpenPairing, adminEmail }) => {
  return (
    <div className="space-y-6">
      {/* Informative Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#151D30] border border-blue-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Interactive Dual-Device Testing Studio
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                P2P Loopback Active
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Test end-to-end device authorization: Click <strong>"Request Camera"</strong> on the Admin console to see the approval screen trigger on the Remote Android phone!
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Admin Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Admin Web Monitoring Console
            </span>
          </div>
          <AdminDashboard onOpenPairing={onOpenPairing} adminEmail={adminEmail} />
        </div>

        {/* Right Column: Remote Android Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Remote Android Device (Simulated Client)
            </span>
          </div>
          <RemoteDeviceView adminEmail={adminEmail} />
        </div>
      </div>
    </div>
  );
};
