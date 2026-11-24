import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  Paintbrush
} from 'lucide-react';
import { useVehicleStore, CustomBuild } from '../../hooks/useVehicleStore';
import { BrandBadge } from '../ui/BrandBadge';
import { VehicleTechnicalSilhouette } from '../library/VehicleTechnicalSilhouette';
import { toHex32, joaat } from '../../utils/joaat';
import { getBuildThumbnail } from '../../utils/thumbnailCache';

interface SavedBuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedBuildsModal: React.FC<SavedBuildsModalProps> = ({ isOpen, onClose }) => {
  const {
    savedBuilds,
    configName,
    activeModel,
    activeFile,
    saveCurrentBuild,
    loadBuild,
    deleteBuild,
    duplicateBuild,
    renameBuild,
    exportBuildJson,
    importBuildJson
  } = useVehicleStore();

  const [newBuildName, setNewBuildName] = useState(configName || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBuildId, setEditingBuildId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load cached thumbnails for saved builds
  useEffect(() => {
    if (!isOpen) return;
    savedBuilds.forEach(async (build) => {
      const thumb = await getBuildThumbnail(build.id);
      if (thumb) {
        setThumbnails(prev => ({ ...prev, [build.id]: thumb }));
      }
    });
  }, [isOpen, savedBuilds]);

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
    const name = newBuildName.trim() || `${activeModel?.displayName || 'Custom Spec'} Build`;
    saveCurrentBuild(name);
    showSuccess(`Saved spec "${name}"!`);
    setNewBuildName('');
  };

  const handleLoad = async (id: string, name: string) => {
    const success = await loadBuild(id);
    if (success) {
      showSuccess(`Loaded spec "${name}"!`);
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
        showSuccess('Imported custom build successfully!');
      } else {
        showError(res.error || 'Failed to parse build JSON');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredBuilds = savedBuilds.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.baseVehicleFile && b.baseVehicleFile.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[88vh] bg-gt-obsidian border border-gt-border rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans">
        {/* 1. Header Toolbar */}
        <div className="h-16 px-6 bg-gt-basalt/90 border-b border-gt-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gt-accent/15 border border-gt-accent/30 flex items-center justify-center text-gt-accent">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-heading font-bold text-white tracking-wide">
                  PADDOCK GARAGE & SAVED SPECS
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gt-accent/20 border border-gt-accent/40 text-gt-accent font-bold">
                  {savedBuilds.length} SAVED SPECS
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Persistent local garage slots • Cross-car configuration ledgers • JSON export/import
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search specs..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/50 border border-gt-border text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-gt-accent"
              />
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gt-basalt hover:bg-gt-graphite border border-gt-border flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Save Current Build Action Bar */}
        <div className="p-4 px-6 bg-gt-basalt/50 border-b border-gt-border flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={newBuildName}
            onChange={e => setNewBuildName(e.target.value)}
            placeholder={`Save current ${activeModel?.displayName || activeFile} spec...`}
            className="flex-1 bg-black/50 border border-gt-border rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-gt-accent"
          />

          <button
            onClick={handleSaveNew}
            className="px-4 py-2 rounded-xl bg-gt-accent hover:bg-gt-accent/90 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-gt-accent/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE CURRENT SPEC</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-gt-basalt hover:bg-gt-graphite text-zinc-300 border border-gt-border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Build JSON File"
          >
            <Upload className="w-3.5 h-3.5" />
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

        {/* Toast Alerts */}
        {successToast && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}
        {errorToast && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2">
            <X className="w-4 h-4" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* 3. Paddock Garage Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBuilds.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <FolderOpen className="w-12 h-12 text-zinc-600" />
              <div className="text-white font-heading font-bold text-sm">No Saved Custom Specs Found</div>
              <p className="text-zinc-400 text-xs font-mono max-w-sm">
                Customize colors, wheel fitment, and aerodynamics in Car Studio, then click "Save Current Spec" above to persist your build.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuilds.map(build => {
                const overrideCount = Object.keys(build.componentOverrides || {}).length;
                const dateStr = new Date(build.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const hashStr = toHex32(build.baseModelHash || joaat(build.name));
                const thumbData = thumbnails[build.id];
                const brandName = (build.baseVehicleFile || '').split('_')[0] || 'Porsche';

                return (
                  <div
                    key={build.id}
                    className="rounded-2xl bg-gt-basalt/60 hover:bg-gt-graphite/60 border border-gt-border hover:border-white/20 transition-all shadow-xl p-4 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Blueprint Silhouette / Thumbnail Preview */}
                      <div className="relative w-full h-32 rounded-xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center mb-3">
                        {thumbData ? (
                          <img
                            src={thumbData}
                            alt={build.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <VehicleTechnicalSilhouette
                            category="track"
                            showDimensions={false}
                          />
                        )}

                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] font-mono text-gt-accent font-bold">
                          {hashStr}
                        </div>
                      </div>

                      {/* Header: Brand & Spec Name */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <BrandBadge
                          manufacturer={brandName}
                          size="sm"
                          showWordmark={false}
                        />
                        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </span>
                      </div>

                      {editingBuildId === build.id ? (
                        <div className="flex items-center gap-1.5 my-1">
                          <input
                            type="text"
                            value={editingNameValue}
                            onChange={e => setEditingNameValue(e.target.value)}
                            className="flex-1 bg-black/60 border border-gt-accent rounded px-2 py-1 text-xs text-white font-mono"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              if (editingNameValue.trim()) {
                                renameBuild(build.id, editingNameValue.trim());
                                showSuccess('Renamed spec!');
                              }
                              setEditingBuildId(null);
                            }}
                            className="p-1 rounded bg-gt-accent text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group/title">
                          <h3 className="text-sm font-heading font-bold text-white truncate">
                            {build.name}
                          </h3>
                          <button
                            onClick={() => {
                              setEditingBuildId(build.id);
                              setEditingNameValue(build.name);
                            }}
                            className="opacity-0 group-hover/title:opacity-100 p-1 text-zinc-400 hover:text-white transition-opacity"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Modifications Ledger Tags */}
                      <div className="flex flex-wrap gap-1.5 my-3">
                        {build.customPrimaryColor ? (
                          <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full border border-white/20"
                              style={{
                                backgroundColor: `rgb(${build.customPrimaryColor.r}, ${build.customPrimaryColor.g}, ${build.customPrimaryColor.b})`
                              }}
                            />
                            <span>Custom Paint</span>
                          </div>
                        ) : build.primaryColor !== undefined ? (
                          <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full border border-white/20 bg-gt-accent"
                            />
                            <span>OEM Paint</span>
                          </div>
                        ) : null}

                        <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-gt-accent" />
                          <span>{overrideCount} Donor Parts</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-gt-border flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleLoad(build.id, build.name)}
                        className="flex-1 py-1.5 rounded-lg bg-gt-accent hover:bg-gt-accent/90 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-gt-accent/15 cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>LOAD SPEC</span>
                      </button>

                      <button
                        onClick={() => {
                          duplicateBuild(build.id);
                          showSuccess(`Duplicated "${build.name}"!`);
                        }}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-gt-graphite border border-gt-border text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Duplicate Spec"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleExport(build)}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-gt-graphite border border-gt-border text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Export JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete spec "${build.name}"?`)) {
                            deleteBuild(build.id);
                            showSuccess(`Deleted "${build.name}"`);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950/60 border border-gt-border hover:border-rose-800 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Spec"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
