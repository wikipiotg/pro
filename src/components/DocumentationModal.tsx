import React, { useState } from 'react';
import { BookOpen, Shield, Flame, Radio, Wrench, X, CheckCircle, Smartphone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'FIREBASE' | 'WEBRTC' | 'RELEASE' | 'GITHUB' | 'PRIVACY'>('GITHUB');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl h-[85vh] bg-[#151D30] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Smart Remote Connect Pro — Technical Guide</h2>
              <p className="text-xs text-slate-400">Architecture, Firebase, WebRTC STUN/TURN & Security Blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#0B1020]/50 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveDoc('GITHUB')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeDoc === 'GITHUB'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            GitHub Actions CI/CD (বাংলা)
          </button>
          <button
            onClick={() => setActiveDoc('FIREBASE')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeDoc === 'FIREBASE'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            Firebase & Security Rules
          </button>
          <button
            onClick={() => setActiveDoc('WEBRTC')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeDoc === 'WEBRTC'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            WebRTC & STUN/TURN
          </button>
          <button
            onClick={() => setActiveDoc('RELEASE')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeDoc === 'RELEASE'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Android Studio & APK
          </button>
          <button
            onClick={() => setActiveDoc('PRIVACY')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeDoc === 'PRIVACY'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Zero-Trust Policy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          {activeDoc === 'GITHUB' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-400" />
                  GitHub Actions দিয়ে ক্লাউডে Android APK Build করুন
                </h3>
                <p className="text-xs text-slate-300">
                  আপনার পিসিতে Android Studio বা ভারী সফটওয়্যার না থাকলেও সরাসরি GitHub এর ক্লাউড সার্ভার দিয়ে স্বয়ংক্রিয়ভাবে APK তৈরি করে ডাউনলোড করা যাবে।
                </p>
              </div>

              {/* 4 Steps */}
              <div className="space-y-4">
                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">১</span>
                    প্রজেক্ট জিপ ফাইল ডাউনলোড করুন
                  </div>
                  <p className="text-xs text-slate-400">
                    উপরে ডানদিকের <strong>"Android Codebase"</strong> বাটনে ক্লিক করে <strong>"Download Project (.ZIP)"</strong> ডাউনলোড করে আনজিপ করুন। এর ভেতর ইতিমধ্যে <code>.github/workflows/android-build.yml</code> এবং সব Gradle ও Kotlin ফাইল সাজানো আছে।
                  </p>
                </div>

                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">২</span>
                    GitHub-এ নতুন Repository খুলে Push করুন
                  </div>
                  <p className="text-xs text-slate-400">
                    GitHub-এ একটি নতুন Repository (যেমন: <code>smart-remote-connect-pro</code>) তৈরি করুন এবং আপনার টার্মিনাল দিয়ে কোড পুশ করুন:
                  </p>
                  <pre className="p-3 bg-black/60 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto">
git init{'\n'}
git add .{'\n'}
git commit -m "feat: smart remote connect pro native android"{'\n'}
git branch -M main{'\n'}
git remote add origin https://github.com/YOUR_USERNAME/smart-remote-connect-pro.git{'\n'}
git push -u origin main
                  </pre>
                </div>

                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">৩</span>
                    স্বয়ংক্রিয় ক্লাউড বিল্ড (GitHub Actions)
                  </div>
                  <p className="text-xs text-slate-400">
                    কোড পুশ করার সাথে সাথে GitHub-এর <strong>Actions</strong> ট্যাবে <code>Build Smart Remote Connect Pro Android APK</code> ওয়ার্কফ্লোটি চালু হয়ে যাবে। এটি স্বয়ংক্রিয়ভাবে JDK 17, Android SDK 35 সেটআপ করে <code>./gradlew assembleDebug</code> রান করবে।
                  </p>
                </div>

                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">৪</span>
                    সরাসরি APK ডাউনলোড করুন
                  </div>
                  <p className="text-xs text-slate-400">
                    বিল্ড সম্পন্ন হলে ওয়ার্কফ্লো রানের নিচে <strong>Artifacts</strong> সেকশনে <strong>SmartRemoteConnectPro-Debug-APK</strong> পাবেন। সেখান থেকে এক ক্লিকে ডাউনলোড করে যেকোনো Android ফোনে ইন্সটল করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'FIREBASE' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Cloud Firestore & FCM Notification Setup
              </h3>
              <p>
                The backend utilizes <strong>Cloud Firestore</strong> for real-time device registry, battery updates, and WebRTC signaling exchange (SDP Offers, Answers, and ICE candidates).
              </p>

              <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase">Configured Firebase Environment</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Project ID: <span className="font-mono text-blue-400">citric-voyager-gfx4d</span></div>
                  <div>Region: <span className="font-mono text-emerald-400">asia-southeast1</span></div>
                  <div>Auth: <span className="text-slate-200">Google OAuth & Identity</span></div>
                  <div>Rules Version: <span className="font-mono text-slate-200">2 (ABAC Hardened)</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white">Firestore Security Guarantee</h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-300">
                  <li><strong>Default-Deny Catch-All:</strong> Any unauthorized path returns <code>PERMISSION_DENIED</code>.</li>
                  <li><strong>Role & Device Isolation:</strong> Administrators can only query and command devices they explicitly enrolled.</li>
                  <li><strong>Signaling Session Gates:</strong> Signaling messages can only be added to sessions where the requester is an authorized participant.</li>
                </ul>
              </div>
            </div>
          )}

          {activeDoc === 'WEBRTC' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-blue-400" />
                WebRTC Peer-to-Peer & Relayed TURN Architecture
              </h3>
              <p>
                Smart Remote Connect Pro establishes hardware-accelerated video & audio streams using Google’s official WebRTC Native SDK for Android and W3C RTCPeerConnection.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white text-xs">STUN Discovery</div>
                  <p className="text-xs text-slate-400">
                    Discovers reflexive external IP and port mapping through Google STUN servers (<code>stun:stun.l.google.com:19302</code>).
                  </p>
                </div>
                <div className="p-4 bg-[#0B1020] rounded-xl border border-slate-800 space-y-1">
                  <div className="font-semibold text-white text-xs">TURN Relay Fallback</div>
                  <p className="text-xs text-slate-400">
                    Bypasses symmetric NATs and carrier-grade cellular firewalls with encrypted UDP/TCP relaying.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-blue-300">CameraX VideoCapturer Bridge</div>
                <p className="text-slate-300">
                  Video frames captured by Android Camera2/CameraX are transferred directly to WebRTC's <code>SurfaceTextureHelper</code> as OpenGL textures without CPU pixel copying, maintaining 60fps at 720p/1080p with minimal thermal throttling.
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'RELEASE' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                Compilation & Signed APK Generation
              </h3>
              <p>
                Follow these instructions to compile the native Kotlin application in Android Studio:
              </p>

              <ol className="space-y-3 list-decimal list-inside text-xs text-slate-300">
                <li className="p-3 bg-[#0B1020] rounded-xl border border-slate-800">
                  <strong>Download Source:</strong> Click <em>Android Codebase</em> &gt; <em>Download Project (.ZIP)</em>.
                </li>
                <li className="p-3 bg-[#0B1020] rounded-xl border border-slate-800">
                  <strong>Open in Android Studio:</strong> File &gt; Open &gt; Select the unzipped folder. Gradle sync will automatically resolve all 12 modules.
                </li>
                <li className="p-3 bg-[#0B1020] rounded-xl border border-slate-800">
                  <strong>Generate Signed APK:</strong> Build &gt; Generate Signed Bundle / APK &gt; Select Keystore &gt; Build Release APK.
                </li>
              </ol>
            </div>
          )}

          {activeDoc === 'PRIVACY' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Anti-Surveillance & Explicit Consent Philosophy
              </h3>
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strict Ethical Operating Principles
                </div>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  <li><strong>Zero Stealth Mode:</strong> Camera or microphone will NEVER activate silently or in the background.</li>
                  <li><strong>Visible Heads-Up Screen:</strong> Every media request requires the remote user to tap "Approve".</li>
                  <li><strong>Persistent Streaming Notification:</strong> While active, Android displays an ongoing notification with a prominent "STOP STREAMING" button.</li>
                  <li><strong>Immediate Revocation:</strong> The remote device owner can terminate any session instantly with 1 tap.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
