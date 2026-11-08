import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES } from '../android-source/nativeProjectFiles';
import { generateAndDownloadAndroidZip } from '../services/zipExporter';
import { FolderGit2, FileCode, Download, Copy, Check, Search, X, Layers, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredFiles = ANDROID_PROJECT_FILES.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadAndroidZip();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-6xl h-[90vh] bg-[#151D30] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Android Studio Native Source Codebase</h2>
              <p className="text-xs text-slate-400">
                12 Modular Kotlin & Gradle DSL components — Production-grade ready to build
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Bundling ZIP...' : 'Download Project (.ZIP)'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: File Tree */}
          <div className="w-80 border-r border-slate-800 bg-[#0B1020]/60 flex flex-col">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter files or modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#151D30] border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredFiles.map((file, idx) => {
                const isSelected = ANDROID_PROJECT_FILES.indexOf(file) === selectedFileIndex;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(ANDROID_PROJECT_FILES.indexOf(file))}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {file.module}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{ANDROID_PROJECT_FILES.length} Files</span>
              <span className="text-emerald-400">Kotlin 2.0 / Compose</span>
            </div>
          </div>

          {/* Right Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#070b16]">
            {/* File Info Bar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-[#0B1020] flex items-center justify-between">
              <div>
                <div className="font-mono text-sm font-semibold text-blue-400">{currentFile.path}</div>
                <div className="text-xs text-slate-400">{currentFile.description}</div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 select-text">
              <pre>
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
