/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdminDashboard } from './components/AdminDashboard';
import { RemoteDeviceView } from './components/RemoteDeviceView';
import { DualDevicePlayground } from './components/DualDevicePlayground';
import { PairingModal } from './components/PairingModal';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { DocumentationModal } from './components/DocumentationModal';
import { validateFirestoreConnection } from './services/firebase';
import { Shield, Sparkles, FolderGit2, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'ADMIN' | 'REMOTE' | 'DUAL'>('DUAL');
  const [isPairingOpen, setIsPairingOpen] = useState<boolean>(false);
  const [isCodeExplorerOpen, setIsCodeExplorerOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);

  const adminEmail = 'wikibinhelpdesk@gmail.com';

  useEffect(() => {
    validateFirestoreConnection().then((connected) => {
      setFirestoreConnected(connected);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onOpenPairing={() => setIsPairingOpen(true)}
        onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        adminEmail={adminEmail}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Announcement Banner */}
        <div className="p-4 bg-[#151D30]/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">Smart Remote Connect Pro Architecture</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Firebase & Firestore Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                12 Android Gradle modules, WebRTC P2P streaming, CameraX, BatteryManager telemetry, and ABAC security rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              GitHub দিয়ে APK Build (গাইড)
            </button>
            <button
              onClick={() => setIsCodeExplorerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Android Codebase & ZIP
            </button>
          </div>
        </div>

        {/* View Routing */}
        {viewMode === 'ADMIN' && (
          <AdminDashboard
            onOpenPairing={() => setIsPairingOpen(true)}
            adminEmail={adminEmail}
          />
        )}

        {viewMode === 'REMOTE' && (
          <div className="py-4">
            <RemoteDeviceView adminEmail={adminEmail} />
          </div>
        )}

        {viewMode === 'DUAL' && (
          <DualDevicePlayground
            onOpenPairing={() => setIsPairingOpen(true)}
            adminEmail={adminEmail}
          />
        )}
      </main>

      {/* Modals */}
      <PairingModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        adminEmail={adminEmail}
      />

      <CodeExplorerModal
        isOpen={isCodeExplorerOpen}
        onClose={() => setIsCodeExplorerOpen(false)}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0B1020] px-4 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Smart Remote Connect Pro — Zero-Trust Device Control & WebRTC Media</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Min SDK: 26</span>
            <span>Target SDK: 35</span>
            <span>Jetpack Compose</span>
            <span>Material 3</span>
            <span className="text-emerald-400">Cloud Firestore Connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
