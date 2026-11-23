import React, { useState, useEffect } from 'react';
import { Database, Download, CheckCircle, AlertTriangle, X, RefreshCw, Trash2 } from 'lucide-react';
import { LegacyStorageMigrator, MigrationSummary } from '../../services/legacyMigration';
import { CustomBuild, useVehicleStore } from '../../hooks/useVehicleStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LegacyMigrationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [localBuilds, setLocalBuilds] = useState<CustomBuild[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [summary, setSummary] = useState<MigrationSummary | null>(null);
  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const { syncBuildsWithBackend } = useVehicleStore();

  useEffect(() => {
    if (isOpen) {
      const discovered = LegacyStorageMigrator.discoverLocalBuilds();
      setLocalBuilds(discovered);
      setSummary(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const ok = LegacyStorageMigrator.downloadBackupFile();
    if (ok) setBackupDownloaded(true);
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const res = await LegacyStorageMigrator.migrateToServer();
      setSummary(res);
      await syncBuildsWithBackend();
    } catch (e) {
      console.error('Migration failed:', e);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearLocal = () => {
    LegacyStorageMigrator.clearLocalBuilds();
    setLocalBuilds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Legacy Local Storage Migration</h2>
              <p className="text-xs text-slate-400">Migrate browser localStorage builds to PostgreSQL/SQLite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-200 font-medium">Browser Storage is Ephemeral</p>
              <p className="text-slate-400 mt-0.5">
                Builds stored exclusively in browser localStorage can be wiped if cache is cleared. Migrating them to the backend database guarantees persistence and cross-device synchronization.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-200">Discovered Local Builds ({localBuilds.length})</span>
              {localBuilds.length > 0 && (
                <button
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{backupDownloaded ? 'Backup Downloaded' : 'Download Backup JSON'}</span>
                </button>
              )}
            </div>

            {localBuilds.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center text-slate-400">
                No unmigrated builds found in local storage.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {localBuilds.map(b => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-medium text-slate-200">{b.name}</span>
                      <span className="text-slate-500 font-mono ml-2">({b.baseVehicleFile})</span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {Object.keys(b.componentOverrides || {}).length} overrides
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {summary && (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-900/60 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Migration Complete</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-slate-500 block text-[10px]">Migrated</span>
                  <span className="text-emerald-400 text-sm font-semibold">{summary.migratedCount}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-slate-500 block text-[10px]">Skipped (Duplicate)</span>
                  <span className="text-slate-300 text-sm font-semibold">{summary.skippedCount}</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80">
                  <span className="text-slate-500 block text-[10px]">Failed</span>
                  <span className="text-rose-400 text-sm font-semibold">{summary.failedCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {summary && summary.migratedCount > 0 ? (
            <button
              onClick={handleClearLocal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage Cache</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Close
            </button>
            {localBuilds.length > 0 && (
              <button
                disabled={isMigrating}
                onClick={handleMigrate}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isMigrating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Migrating...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    <span>Migrate {localBuilds.length} Builds to Database</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
