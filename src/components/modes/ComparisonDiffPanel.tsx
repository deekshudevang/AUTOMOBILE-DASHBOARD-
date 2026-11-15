import React, { useMemo } from 'react';
import {
  GitCompare,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Sliders,
  Palette,
  Disc,
  Wind
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { resolveVehicleColor } from '../../utils/colorUtils';

export const ComparisonDiffPanel: React.FC = () => {
  const {
    activeConfig,
    originalConfig,
    activeModel,
    componentOverrides,
    resetAllComponentOverrides,
    setPresentationMode
  } = useVehicleStore();

  const rawSpec = (activeConfig.parametricSpec || activeConfig) as any;

  // Build diff rows between original baseline and current customization
  const diffs = useMemo(() => {
    const list: {
      category: string;
      parameter: string;
      baseline: string;
      customized: string;
      hasChanged: boolean;
    }[] = [];

    // 1. Exterior Paint
    const baselinePaint = resolveVehicleColor(
      originalConfig.isPrimaryColorCustom,
      originalConfig.customPrimaryColor,
      originalConfig.primaryColor
    );
    const customPaint = resolveVehicleColor(
      activeConfig.isPrimaryColorCustom,
      activeConfig.customPrimaryColor,
      activeConfig.primaryColor
    );
    const paintChanged = baselinePaint.hex.toLowerCase() !== customPaint.hex.toLowerCase();
    list.push({
      category: 'Exterior',
      parameter: 'Primary Paint Finish',
      baseline: `${baselinePaint.name} (${baselinePaint.hex})`,
      customized: `${customPaint.name} (${customPaint.hex})`,
      hasChanged: paintChanged
    });

    // 2. Wheel Stance / Drop
    const baselineDrop = originalConfig.mods?.mod15?.index ?? 0;
    const customDrop = activeConfig.mods?.mod15?.index ?? 0;
    list.push({
      category: 'Suspension',
      parameter: 'Suspension Stance (Ride Height)',
      baseline: baselineDrop === 0 ? 'OEM Factory Height' : `Dropped Level ${baselineDrop}`,
      customized: customDrop === 0 ? 'OEM Factory Height' : `Dropped Level ${customDrop} (-${(customDrop * 15)}mm)`,
      hasChanged: baselineDrop !== customDrop
    });

    // 3. Wheel Finish & Rims
    const baselineWheelColor = originalConfig.wheelColor ?? 0;
    const customWheelColor = activeConfig.wheelColor ?? 0;
    list.push({
      category: 'Wheels',
      parameter: 'Rim Coating & Finish',
      baseline: `Palette Code #${baselineWheelColor}`,
      customized: `Palette Code #${customWheelColor}`,
      hasChanged: baselineWheelColor !== customWheelColor
    });

    // 4. Component Overrides (Schema 2.0 components: wing, wheels, hood, etc.)
    const overrideKeys = Object.keys(componentOverrides);
    if (overrideKeys.length > 0) {
      overrideKeys.forEach(id => {
        const ovr = componentOverrides[id];
        if (ovr.materialFinish || ovr.customColorHex) {
          list.push({
            category: 'Component',
            parameter: `${id} Finish`,
            baseline: 'OEM Standard Spec',
            customized: `${ovr.materialFinish || 'Custom'} (${ovr.customColorHex || 'Custom'})`,
            hasChanged: true
          });
        }
        if (ovr.visible === false) {
          list.push({
            category: 'Component',
            parameter: `${id} Visibility`,
            baseline: 'Visible',
            customized: 'Hidden',
            hasChanged: true
          });
        }
      });
    }

    if (overrideKeys.length === 0 && !paintChanged && baselineDrop === customDrop && baselineWheelColor === customWheelColor) {
      list.push({
        category: 'Status',
        parameter: 'All Components',
        baseline: 'Factory Baseline',
        customized: 'Identical to OEM Baseline',
        hasChanged: false
      });
    }

    return list;
  }, [activeConfig, originalConfig, componentOverrides]);

  const changedCount = diffs.filter(d => d.hasChanged).length;

  return (
    <div className="absolute top-16 right-4 bottom-8 w-96 bg-[#0A0C10]/95 backdrop-blur-md border border-[#222A38] rounded-xl shadow-2xl z-30 flex flex-col overflow-hidden text-slate-100 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#222A38] flex items-center justify-between bg-[#12161F]">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-[#00F0FF]" />
          <h2 className="text-xs font-bold text-slate-100 tracking-wide">
            Configuration Diff Matrix
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-semibold">
            {changedCount} {changedCount === 1 ? 'Delta' : 'Deltas'}
          </span>
          <button
            onClick={() => setPresentationMode('studio')}
            className="p-1 rounded hover:bg-[#1A202C] text-slate-400 hover:text-white transition-colors"
            title="Exit Comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div className="px-3.5 py-2 bg-[#0E1118] border-b border-[#222A38] flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="text-slate-300 font-semibold">OEM Baseline</span>
        <ArrowRight className="w-3 h-3 text-[#00F0FF]" />
        <span className="text-[#00F0FF] font-semibold">Active Customization</span>
      </div>

      {/* Diff Table List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs">
        {diffs.map((d, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border transition-all ${
              d.hasChanged
                ? 'bg-[#12161F] border-[#00F0FF]/40 shadow-sm'
                : 'bg-[#0E1118] border-[#222A38] opacity-75'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {d.category} • {d.parameter}
              </span>
              {d.hasChanged ? (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-bold">
                  MODIFIED
                </span>
              ) : (
                <span className="text-[9px] font-mono text-slate-500">
                  MATCH
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-1.5 rounded bg-[#0A0C10] border border-[#222A38] text-slate-400 truncate">
                <span className="text-[9px] text-slate-500 block">Baseline:</span>
                <span className="truncate">{d.baseline}</span>
              </div>
              <div
                className={`p-1.5 rounded border truncate ${
                  d.hasChanged
                    ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF] font-semibold'
                    : 'bg-[#0A0C10] border-[#222A38] text-slate-400'
                }`}
              >
                <span className="text-[9px] text-slate-500 block">Customized:</span>
                <span className="truncate">{d.customized}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#222A38] bg-[#12161F] flex items-center gap-2">
        <button
          onClick={resetAllComponentOverrides}
          className="flex-1 py-2 rounded-lg bg-[#1E2533] hover:bg-[#2A3448] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert to Baseline</span>
        </button>
        <button
          onClick={() => setPresentationMode('studio')}
          className="flex-1 py-2 rounded-lg bg-[#00F0FF] hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Keep Changes</span>
        </button>
      </div>
    </div>
  );
};
