import React from 'react';
import { StreamApprovalRequest } from '../types';
import { ShieldAlert, Video, Mic, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  request: StreamApprovalRequest;
  onApprove: (sessionId: string) => void;
  onReject: (sessionId: string) => void;
}

export const IncomingApprovalModal: React.FC<Props> = ({ request, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#151D30] border-2 border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden p-6 text-white space-y-6">
        {/* Header with pulsing alert */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <ShieldAlert className="w-8 h-8 animate-pulse text-blue-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 mb-1 border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              Incoming Remote Access Request
            </div>
            <h2 className="text-xl font-bold tracking-tight">Media Stream Approval Required</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Received at {request.timestamp}
            </p>
          </div>
        </div>

        {/* Requester Identity Card */}
        <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Requesting Administrator
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              {request.adminName.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-white">{request.adminName}</div>
              <div className="text-xs text-slate-400">{request.adminEmail}</div>
            </div>
          </div>
        </div>

        {/* Requested Capabilities */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Requested Device Permissions
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
              <Video className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-slate-200">Camera Feed</div>
                <div className="text-[11px] text-slate-400">Back sensor 1080p</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
              <Mic className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm font-medium text-slate-200">Microphone</div>
                <div className="text-[11px] text-slate-400">Live WebRTC audio</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200/90 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Explicit consent is strictly enforced. While active, a persistent notification with a prominent
            <strong className="text-white font-semibold"> STOP STREAMING</strong> button will remain on this screen.
            No data is stored or recorded.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onReject(request.sessionId)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-sm transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            Reject Access
          </button>
          <button
            onClick={() => onApprove(request.sessionId)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Stream
          </button>
        </div>
      </div>
    </div>
  );
};
