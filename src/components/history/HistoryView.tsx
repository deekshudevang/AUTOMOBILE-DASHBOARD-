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
  Car,
  Layers,
  Sparkles,
  GitCommit
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';
import { BrandBadge } from '../ui/BrandBadge';

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
    <div className="h-full flex flex-col bg-gt-obsidian text-zinc-100 overflow-hidden select-none font-sans">
      {/* 1. Header Toolbar */}
      <header className="h-14 px-6 bg-gt-basalt/80 border-b border-gt-border backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gt-accent/15 border border-gt-accent/30 flex items-center justify-center text-gt-accent">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-heading font-bold text-white tracking-wide">
                CONFIGURATION REVISION TIMELINE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-gt-border text-gt-accent font-bold">
                {history.length} CHECKPOINTS
              </span>
              <span className="text-xs font-mono text-zinc-400">
                • {activeModel?.displayName || activeFile}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Audit trail of vehicle customizations • Instant rollback to any prior checkpoint
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gt-basalt hover:bg-gt-graphite disabled:opacity-30 disabled:pointer-events-none text-xs font-mono text-zinc-200 border border-gt-border transition-colors cursor-pointer"
            title="Undo Last Action (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gt-basalt hover:bg-gt-graphite disabled:opacity-30 disabled:pointer-events-none text-xs font-mono text-zinc-200 border border-gt-border transition-colors cursor-pointer"
            title="Redo Action (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>Redo</span>
          </button>
          <button
            onClick={resetConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gt-basalt hover:bg-rose-950/60 border border-gt-border hover:border-rose-800 text-xs font-mono text-zinc-300 hover:text-rose-400 transition-colors cursor-pointer"
            title="Reset to Factory OEM Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </header>

      {/* 2. Main Timeline Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="relative border-l-2 border-gt-border pl-6 space-y-6 my-4 font-mono">
          {history.map((cfg, idx) => {
            const isCurrent = idx === historyIndex;
            const primaryColor = cfg.primaryColor || '#E53935';

            return (
              <div
                key={idx}
                className={`relative p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gt-basalt/80 border-gt-accent shadow-xl ring-1 ring-gt-accent/40'
                    : 'bg-gt-basalt/40 hover:bg-gt-basalt/60 border-gt-border'
                }`}
              >
                {/* Node Dot on Timeline */}
                <div
                  className={`absolute -left-[31px] top-6 w-3 h-3 rounded-full border-2 ${
                    isCurrent
                      ? 'bg-gt-accent border-gt-obsidian ring-4 ring-gt-accent/20'
                      : 'bg-zinc-600 border-gt-obsidian'
                  }`}
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold text-white">
                      Revision #{idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gt-accent text-white">
                        ACTIVE STATE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Step {idx + 1} of {history.length}
                    </span>
                    {!isCurrent && (
                      <button
                        onClick={() => handleJumpToHistory(idx)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-gt-accent text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Rollback Here
                      </button>
                    )}
                  </div>
                </div>

                {/* State delta badges */}
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{
                        backgroundColor: typeof primaryColor === 'string' ? primaryColor : '#E53935'
                      }}
                    />
                    <span className="text-zinc-300">Paint Color</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-zinc-400">
                    <Sliders className="w-3 h-3 text-gt-accent" />
                    <span>Configuration Parameters</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
