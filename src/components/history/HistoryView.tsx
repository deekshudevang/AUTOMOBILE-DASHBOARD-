import React from 'react';
import {
  History,
  RotateCcw,
  Undo2,
  Redo2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Car
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';

export const HistoryView: React.FC = () => {
  const {
    activeConfig,
    activeFile,
    activeModel,
    history,
    historyIndex,
    undo,
    redo,
    resetConfig,
    updateConfig,
    setActiveView
  } = useVehicleStore();

  const handleJumpToHistory = (index: number) => {
    const target = history[index];
    if (!target) return;
    useVehicleStore.setState({
      activeConfig: target,
      historyIndex: index,
      isDirty: true
    });
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-autoverse-bg overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-autoverse-surface border border-autoverse-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-elevated text-autoverse-cyan font-bold border border-autoverse-borderLight">
              CONFIG AUDIT TRAIL
            </span>
            <span className="text-xs text-autoverse-muted">• Active: {activeFile}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">Configuration History Stack</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Audit trail of vehicle customizations. Revert to any prior tuning state or redo modifications instantly.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-3 py-2 rounded bg-autoverse-elevated hover:bg-autoverse-overlay disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition-colors border border-autoverse-border flex items-center gap-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-2 rounded bg-autoverse-elevated hover:bg-autoverse-overlay disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-200 transition-colors border border-autoverse-border flex items-center gap-1.5"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>
          <button
            onClick={resetConfig}
            className="px-3 py-2 rounded bg-autoverse-elevated hover:bg-autoverse-overlay text-xs font-semibold text-autoverse-rose transition-colors border border-autoverse-border flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Timeline List of Snapshots */}
      <div className="p-5 rounded-lg bg-autoverse-surface border border-autoverse-border space-y-4">
        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-autoverse-cyan" />
          <span>Timeline Snapshots ({history.length} states recorded)</span>
        </h2>

        <div className="relative border-l-2 border-autoverse-border ml-4 space-y-6 py-2">
          {history.map((snapshot, idx) => {
            const isCurrent = idx === historyIndex;
            return (
              <div key={idx} className="relative pl-6">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                    isCurrent
                      ? 'bg-autoverse-cyan border-slate-950 scale-125'
                      : 'bg-autoverse-surface border-slate-500'
                  }`}
                />

                <div
                  onClick={() => handleJumpToHistory(idx)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-autoverse-elevated border-autoverse-cyan/60 shadow-md'
                      : 'bg-autoverse-elevated/40 border-autoverse-border hover:bg-autoverse-elevated hover:border-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">
                        {idx === 0 ? 'Baseline Specification (Original Import)' : `Snapshot State #${idx}`}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-autoverse-cyan/10 text-autoverse-cyan font-bold border border-autoverse-cyan/20">
                          Active State
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                      <span>Primary Paint: <strong className="text-slate-200">#{snapshot.primaryColor}</strong></span>
                      <span>•</span>
                      <span>Wheel Type: <strong className="text-slate-200">{snapshot.wheelType}</strong></span>
                      <span>•</span>
                      <span>Plate: <strong className="text-slate-200">{snapshot.plateText || 'NONE'}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToHistory(idx);
                      setActiveView('studio');
                    }}
                    className="text-xs text-autoverse-cyan hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Restore & View 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

