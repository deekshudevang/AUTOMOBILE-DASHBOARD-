import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCode2,
  Search,
  Upload,
  Check,
  AlertTriangle,
  GitCompare,
  Copy,
  Download,
  Eye,
  RefreshCw,
  FolderUp,
  FileCheck2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { SceneCanvas } from '../3d/SceneCanvas';
import { serializeVehicleConfig, parseVehicleJson, compareConfigs } from '../../utils/jsonParser';

export const JsonExplorerView: React.FC = () => {
  const {
    activeConfig,
    activeFile,
    activeModel,
    allFiles,
    updateConfig,
    importCustomJson,
    loadVehicleByFile
  } = useVehicleStore();

  const [mode, setMode] = useState<'editor' | 'tree' | 'diff'>('editor');
  const [jsonText, setJsonText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Compare diff files
  const [diffTargetFile, setDiffTargetFile] = useState(allFiles[1]?.fileName || '');
  const [targetConfig, setTargetConfig] = useState<any>(null);

  // Synchronize JSON text whenever activeConfig changes from outside
  useEffect(() => {
    try {
      const formatted = serializeVehicleConfig(activeConfig, 2);
      setJsonText(formatted);
      setParseError(null);
    } catch (e: any) {
      setParseError(e.message);
    }
  }, [activeConfig]);

  // Load target diff config when diffTargetFile changes
  useEffect(() => {
    if (mode === 'diff' && diffTargetFile) {
      fetch(`/vehicles/${encodeURIComponent(diffTargetFile)}`)
        .then(r => r.json())
        .then(d => setTargetConfig(d))
        .catch(() => setTargetConfig(null));
    }
  }, [mode, diffTargetFile]);

  // Handle direct text edits in the JSON editor (Two-way sync)
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonText(val);

    try {
      const parsed = parseVehicleJson(val);
      if (parsed.success && parsed.config) {
        setParseError(null);
        // Push update to store without pushing to history every keystroke
        updateConfig(() => parsed.config!, false);
      } else {
        setParseError(parsed.error || 'Invalid JSON syntax');
      }
    } catch (err: any) {
      setParseError(err.message);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      importCustomJson(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      importCustomJson(content, file.name);
    };
    reader.readAsText(file);
  };

  // Diff entries
  const diffEntries = useMemo(() => {
    if (!targetConfig) return [];
    return compareConfigs(activeConfig, targetConfig);
  }, [activeConfig, targetConfig]);

  return (
    <div className="h-full flex flex-col md:flex-row bg-autoverse-bg overflow-hidden">
      {/* Left Pane: JSON Editor, Tree Inspector, or Diff Studio */}
      <div className="w-full md:w-1/2 h-full flex flex-col border-r border-autoverse-border bg-autoverse-surface">
        {/* Header Toolbar */}
        <div className="p-4 border-b border-autoverse-border bg-autoverse-elevated/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{activeFile}</span>
              </h2>
              <p className="text-[11px] text-autoverse-muted">Two-way Synchronized Schema Editor</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-autoverse-elevated border border-autoverse-border text-xs">
            <button
              onClick={() => setMode('editor')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                mode === 'editor' ? 'bg-autoverse-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Editor
            </button>
            <button
              onClick={() => setMode('diff')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                mode === 'diff' ? 'bg-autoverse-cyan text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitCompare className="w-3 h-3" />
              <span>Diff Compare</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Actions & Drag/Drop Status */}
        <div className="px-4 py-2 border-b border-autoverse-border/60 bg-autoverse-surface flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            {parseError ? (
              <span className="text-autoverse-rose flex items-center gap-1 text-[11px] font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{parseError}</span>
              </span>
            ) : (
              <span className="text-autoverse-emerald flex items-center gap-1 text-[11px] font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Valid Cherax Entity JSON</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="p-1 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-slate-300 transition-colors border border-autoverse-border"
              title="Copy JSON to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-autoverse-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <label className="p-1 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-slate-300 transition-colors border border-autoverse-border cursor-pointer" title="Upload Custom JSON">
              <Upload className="w-3.5 h-3.5 text-autoverse-cyan" />
              <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
            </label>
          </div>
        </div>

        {/* Editor Body or Diff Body */}
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className="flex-1 relative overflow-hidden"
        >
          {dragActive && (
            <div className="absolute inset-0 z-30 bg-autoverse-surface/90 backdrop-blur-sm border-2 border-dashed border-autoverse-cyan flex flex-col items-center justify-center text-autoverse-cyan gap-2">
              <FolderUp className="w-8 h-8 animate-bounce" />
              <p className="text-sm font-bold">Drop Vehicle JSON Configuration Here</p>
            </div>
          )}

          {mode === 'editor' ? (
            <textarea
              value={jsonText}
              onChange={handleTextChange}
              spellCheck={false}
              className="w-full h-full p-4 bg-[#0A0C10] font-mono text-xs text-slate-200 outline-none resize-none leading-relaxed selection:bg-autoverse-cyan/30"
            />
          ) : (
            /* Diff Comparison Mode */
            <div className="h-full flex flex-col p-4 space-y-3 overflow-y-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Compare against:</span>
                <select
                  value={diffTargetFile}
                  onChange={e => setDiffTargetFile(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-autoverse-elevated border border-autoverse-border text-xs text-slate-200 outline-none cursor-pointer"
                >
                  {allFiles.map(f => (
                    <option key={f.fileName} value={f.fileName}>
                      {f.fileName} ({f.realWorldModel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 border border-autoverse-border rounded-lg overflow-hidden bg-autoverse-elevated/40">
                <div className="p-2 border-b border-autoverse-border bg-autoverse-elevated text-[11px] font-mono flex items-center justify-between text-slate-400">
                  <span>Detected Differences: {diffEntries.length}</span>
                  <span className="text-autoverse-cyan">{activeFile} vs {diffTargetFile}</span>
                </div>

                <div className="divide-y divide-autoverse-border/50 overflow-y-auto max-h-[500px]">
                  {diffEntries.length === 0 ? (
                    <div className="p-6 text-center text-xs text-autoverse-emerald">
                      Both configurations are identical!
                    </div>
                  ) : (
                    diffEntries.map((d, i) => (
                      <div key={i} className="p-2.5 text-xs font-mono flex items-center justify-between">
                        <span className="text-slate-300 font-semibold">{d.path}</span>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-autoverse-rose bg-autoverse-rose/10 px-1.5 py-0.5 rounded">
                            {JSON.stringify(d.leftValue)}
                          </span>
                          <span className="text-slate-500">→</span>
                          <span className="text-autoverse-emerald bg-autoverse-emerald/10 px-1.5 py-0.5 rounded">
                            {JSON.stringify(d.rightValue)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Live 3D Viewport Synchronized in Real-Time */}
      <div className="w-full md:w-1/2 h-full relative">
        <SceneCanvas />

        {/* Floating Quick Swatch Bar in 3D Preview */}
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-autoverse-surface/90 backdrop-blur-md border border-autoverse-border flex items-center justify-between text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-autoverse-emerald animate-pulse" />
            <span className="text-slate-200 font-medium">Live 3D Render Sync Active</span>
          </div>

          <span className="text-[11px] font-mono text-autoverse-cyan">
            Changes in JSON immediately re-render 3D car
          </span>
        </div>
      </div>
    </div>
  );
};

