import React from 'react';
import { Smartphone, Shield, Radio, Plus, Code, BookOpen, Layers, Laptop } from 'lucide-react';

interface Props {
  viewMode: 'ADMIN' | 'REMOTE' | 'DUAL';
  onSelectViewMode: (mode: 'ADMIN' | 'REMOTE' | 'DUAL') => void;
  onOpenPairing: () => void;
  onOpenCodeExplorer: () => void;
  onOpenDocs: () => void;
  adminEmail: string;
}

export const Header: React.FC<Props> = ({
  viewMode,
  onSelectViewMode,
  onOpenPairing,
  onOpenCodeExplorer,
  onOpenDocs,
  adminEmail,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-white">Smart Remote Connect Pro</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v1.0 Native Android
              </span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Multi-Device WebRTC Monitoring Suite</p>
          </div>
        </div>

        {/* View Mode Selector (Admin vs Remote Phone vs Dual Simulator) */}
        <div className="flex items-center bg-[#151D30] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onSelectViewMode('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'ADMIN'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Admin Mode
          </button>
          <button
            onClick={() => onSelectViewMode('REMOTE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'REMOTE'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Remote Device
          </button>
          <button
            onClick={() => onSelectViewMode('DUAL')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'DUAL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Split Simulator
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPairing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Pair Device
          </button>

          <button
            onClick={onOpenCodeExplorer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151D30] hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            Android Codebase
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            GitHub Build (APK)
          </button>
        </div>
      </div>
    </header>
  );
};
