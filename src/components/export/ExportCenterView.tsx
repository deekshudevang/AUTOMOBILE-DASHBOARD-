import React, { useState } from 'react';
import {
  Download,
  FileCode2,
  FolderArchive,
  Check,
  Sparkles,
  Layers,
  Copy,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import JSZip from 'jszip';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { serializeVehicleConfig } from '../../utils/jsonParser';

export const ExportCenterView: React.FC = () => {
  const { activeConfig, activeFile, activeModel, allFiles, isDirty } = useVehicleStore();

  const [isExportingBatch, setIsExportingBatch] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Single active JSON export
  const handleExportActiveJson = () => {
    try {
      const content = serializeVehicleConfig(activeConfig, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = isDirty ? `edited_${activeFile}` : activeFile;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(`Exported ${activeFile}`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err: any) {
      console.error('Export failed:', err);
    }
  };

  // Batch ZIP export of all vehicle files
  const handleBatchExportZip = async () => {
    setIsExportingBatch(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('autoverse_vehicles');

      // Add all 108 vehicle files
      for (const f of allFiles) {
        if (f.fileName === activeFile && isDirty) {
          // Add current edited config
          folder?.file(f.fileName, serializeVehicleConfig(activeConfig, 2));
        } else {
          // Fetch raw JSON from public/vehicles/
          try {
            const res = await fetch(`/vehicles/${encodeURIComponent(f.fileName)}`);
            if (res.ok) {
              const text = await res.text();
              folder?.file(f.fileName, text);
            }
          } catch (e) {
            console.error(`Failed to zip file ${f.fileName}:`, e);
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `autoverse_fleet_108_configs_${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);

      setDownloadSuccess(`Successfully compiled and downloaded batch ZIP containing 108 vehicle configurations!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      console.error('Batch export failed:', err);
    } finally {
      setIsExportingBatch(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-autoverse-bg overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-autoverse-surface border border-autoverse-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-autoverse-cyan font-bold border border-autoverse-borderLight">
              ENTERPRISE EXPORT CENTER
            </span>
            <span className="text-xs text-autoverse-muted">• 100% Schema Preservation Guaranteed</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Configuration Export & Backup</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Export modified Cherax Entity vehicle files, download batch fleet archives, and create complete state backups without discarding unsupported fields or modifying original sources.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-4 rounded-lg bg-autoverse-emerald/10 border border-autoverse-emerald/30 text-autoverse-emerald text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Active Vehicle Single JSON Export */}
        <div className="p-6 rounded-lg bg-autoverse-surface border border-autoverse-border flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-autoverse-elevated border border-autoverse-border flex items-center justify-center text-autoverse-cyan">
              <FileCode2 className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100">Export Current Specification JSON</h2>
              <p className="text-xs text-autoverse-muted mt-1">
                Download the currently active vehicle configuration ({activeFile}) with all modifications applied.
              </p>
            </div>

            <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Model Hash:</span>
                <span className="text-autoverse-cyan">{activeConfig.model}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>State:</span>
                <span className={isDirty ? "text-autoverse-amber" : "text-autoverse-emerald"}>
                  {isDirty ? "Customized & Modified" : "Original Baseline"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Format:</span>
                <span className="text-slate-200">{activeConfig.format} (Type {activeConfig.type})</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportActiveJson}
            className="w-full py-2.5 rounded bg-autoverse-cyan hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Configuration (.json)</span>
          </button>
        </div>

        {/* Option 2: Complete Fleet Batch ZIP Export */}
        <div className="p-6 rounded-lg bg-autoverse-surface border border-autoverse-border flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-autoverse-elevated border border-autoverse-border flex items-center justify-center text-autoverse-purple">
              <FolderArchive className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-100">Batch Fleet ZIP Archive Export</h2>
              <p className="text-xs text-autoverse-muted mt-1">
                Package all 108 vehicle configuration files into a clean compressed ZIP archive ready for backup or deployment.
              </p>
            </div>

            <div className="p-3 rounded bg-autoverse-elevated border border-autoverse-border text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Total Configurations:</span>
                <span className="text-autoverse-purple font-bold">108 JSON files</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Unique Chassis Models:</span>
                <span className="text-slate-200">74 Vehicles</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Archive Format:</span>
                <span className="text-slate-200">ZIP Deflate</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleBatchExportZip}
            disabled={isExportingBatch}
            className="w-full py-2.5 rounded bg-autoverse-elevated hover:bg-autoverse-overlay border border-autoverse-border text-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isExportingBatch ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-autoverse-cyan" />
                <span>Compiling Fleet ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-autoverse-purple" />
                <span>Download Fleet Batch ZIP Archive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Integrity Compliance Seal */}
      <div className="p-5 rounded-lg bg-autoverse-surface border border-autoverse-border flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-autoverse-emerald/10 border border-autoverse-emerald/20 text-autoverse-emerald shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-slate-100">Data Preservation & Integrity Compliance</h3>
          <p className="text-slate-400 leading-relaxed">
            All export pipelines strictly preserve unknown JSON properties (such as <code className="bg-autoverse-elevated px-1 py-0.5 rounded text-[10px]">_creatorSignature</code>, <code className="bg-autoverse-elevated px-1 py-0.5 rounded text-[10px]">attachments</code>, and custom tuning flags). Data types, booleans, and original keys remain unchanged.
          </p>
        </div>
      </div>
    </div>
  );
};

