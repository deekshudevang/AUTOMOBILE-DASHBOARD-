/**
 * AUTOVERSE 3D — Saved Custom Builds & Spec Manager
 * Persists user custom builds to LocalStorage, handles JSON export/import,
 * build duplication, renaming, and 1-click loading.
 */

import React, { useState, useRef } from 'react';
import {
  X,
  FolderOpen,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Check,
  Edit2,
  Car,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useVehicleStore, CustomBuild } from '../../hooks/useVehicleStore';

interface SavedBuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedBuildsModal: React.FC<SavedBuildsModalProps> = ({ isOpen, onClose }) => {
  const {
    savedBuilds,
    configName,
    saveCurrentBuild,
    loadBuild,
    deleteBuild,
    duplicateBuild,
    renameBuild,
    exportBuildJson,
    importBuildJson
  } = useVehicleStore();

  const [newBuildName, setNewBuildName] = useState(configName || '');
  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 3000);
  };

  const handleSaveNew = () => {
    const name = newBuildName.trim() || 'Custom Vehicle Spec';
    saveCurrentBuild(name);
    showSuccess(`Saved build "${name}"!`);
  };

  const handleLoad = async (id: string, name: string) => {
    const success = await loadBuild(id);
    if (success) {
      showSuccess(`Loaded build "${name}"!`);
      setTimeout(() => onClose(), 600);
    } else {
      showError('Failed to load build');
    }
  };

  const handleExport = (build: CustomBuild) => {
    const jsonStr = exportBuildJson(build.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${build.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_spec.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess(`Exported "${build.name}" as JSON`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      if (!text) return;
      const res = importBuildJson(text);
      if (res.success) {
        showSuccess('Build successfully imported!');
        if (res.buildId) {
          loadBuild(res.buildId);
        }
      } else {
        showError(res.error || 'Failed to import build file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl max-h-[85vh] bg-[#0A0C10] border border-[#1E2533] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 bg-[#11141C] border-b border-[#1E2533] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                AutoVerse 3D — Custom Builds & Saved Specs
              </h2>
              <div className="text-[11px] text-slate-400">
                Manage, export, and load your custom vehicle engineering builds
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toasts */}
        {successToast && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 px-6 py-2 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
        {errorToast && (
          <div className="bg-rose-950/80 border-b border-rose-800 text-rose-300 px-6 py-2 text-xs flex items-center gap-2">
            <X className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* Save Current Build Bar */}
        <div className="p-4 bg-[#0E1118] border-b border-[#1E2533] flex items-center gap-3">
          <input
            type="text"
            value={newBuildName}
            onChange={e => setNewBuildName(e.target.value)}
            placeholder="Name your custom build (e.g. GT3 RS Track Attack)..."
            className="flex-1 bg-[#161C28] border border-[#1E2533] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
          />
          <button
            onClick={handleSaveNew}
            className="px-4 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#00D4E0] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Current Build</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Import Build JSON File"
          >
            <Upload className="w-3.5 h-3.5 text-slate-300" />
            <span>Import JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {/* Saved Builds List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedBuilds.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-slate-300 font-semibold text-xs">No saved custom builds yet</div>
              <p className="text-slate-500 text-[11px] max-w-sm mx-auto">
                Customize your car with donor parts and custom transforms, then click "Save Current Build" to create your first build slot.
              </p>
            </div>
          ) : (
            savedBuilds.map(build => {
              const overrideCount = Object.keys(build.componentOverrides || {}).length;
              const dateStr = new Date(build.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={build.id}
                  className="p-4 rounded-xl bg-[#11141C] border border-[#1E2533] hover:border-slate-600 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {editingBuildId === build.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingNameValue}
                            onChange={e => setEditingNameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                renameBuild(build.id, editingNameValue);
                                setEditingBuildId(null);
                              }
                            }}
                            className="bg-[#161C28] border border-[#00F0FF] rounded px-2 py-0.5 text-xs text-white"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              renameBuild(build.id, editingNameValue);
                              setEditingBuildId(null);
                            }}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-xs truncate">{build.name}</span>
                          <button
                            onClick={() => {
                              setEditingBuildId(build.id);
                              setEditingNameValue(build.name);
                            }}
                            className="text-slate-500 hover:text-slate-300"
                            title="Rename Build"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161C28] text-[#00F0FF] border border-[#1E2533]">
                        {overrideCount} {overrideCount === 1 ? 'part mod' : 'part mods'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-slate-500" />
                        {build.baseVehicleFile.replace('.json', '')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleLoad(build.id, build.name)}
                      className="px-3 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#00D4E0] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                      title="Load this build onto the 3D car"
                    >
                      <span>Load Build</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateBuild(build.id)}
                      className="p-2 rounded-lg bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533] transition-colors"
                      title="Duplicate Build"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleExport(build)}
                      className="p-2 rounded-lg bg-[#161C28] hover:bg-[#1E2533] text-slate-300 border border-[#1E2533] transition-colors"
                      title="Export Build as JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBuild(build.id)}
                      className="p-2 rounded-lg bg-[#161C28] hover:bg-rose-950/60 text-rose-400 border border-[#1E2533] hover:border-rose-900 transition-colors"
                      title="Delete Build"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="h-12 px-6 bg-[#11141C] border-t border-[#1E2533] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            Total Saved Builds: <span className="text-[#00F0FF] font-semibold">{savedBuilds.length}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#161C28] hover:bg-[#1E2533] text-slate-200 border border-[#1E2533] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
