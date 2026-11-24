import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Layers,
  X,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Disc,
  Wind,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { CrossCarPartSwapper, DonorPartDefinition } from '@autoverse/vehicle-generation-engine';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { BrandBadge } from '../ui/BrandBadge';

export const GlobalPartsDrawer: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    componentOverrides,
    updateComponentOverride,
    resetComponentOverride
  } = useVehicleStore();

  const {
    isPartsDrawerOpen,
    togglePartsDrawer,
    setPartsDrawerOpen,
    isOrbitDragging
  } = useUiStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [justInstalledId, setJustInstalledId] = useState<string | null>(null);

  // Store previous override snapshot for transient hover preview
  const previousOverrideSnapshot = useRef<{ slot: string; prev: any } | null>(null);

  const activeVehicleSpec = useMemo(() => {
    return activeConfig.parametricSpec || activeConfig;
  }, [activeConfig]);

  const allParts = useMemo(() => {
    try {
      return CrossCarPartSwapper.getDonorParts();
    } catch {
      return [];
    }
  }, []);

  const categories = ['All', 'Aero', 'Wheels', 'Body', 'Exhaust'];

  const filteredParts = useMemo(() => {
    if (selectedCategory === 'All') return allParts;
    return allParts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [allParts, selectedCategory]);

  // Global 'P' keyboard shortcut to toggle parts drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePartsDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePartsDrawer]);

  // Check if a part is currently installed
  const isPartInstalled = (partId: string): boolean => {
    return Object.values(componentOverrides).some(ov => ov.donorComponentId === partId);
  };

  // Hover transient preview
  const handleMouseEnter = (part: DonorPartDefinition) => {
    const slot = part.semanticType;
    previousOverrideSnapshot.current = {
      slot,
      prev: componentOverrides[slot] ? { ...componentOverrides[slot] } : null
    };

    const fitment = CrossCarPartSwapper.evaluateFitment(part, activeVehicleSpec);
    if (!fitment.passed) return;

    // Apply preview without marking dirty
    updateComponentOverride(
      slot,
      {
        donorVehicleId: part.sourceVehicleId,
        donorVehicleName: part.sourceVehicleName,
        donorComponentId: part.id,
        donorComponentName: part.name,
        fitmentType: fitment.status,
        adapterScale: fitment.scaleAdjustment,
        adapterOffset: fitment.mountingOffsetDelta,
        visible: true
      },
      false
    );
  };

  const handleMouseLeave = (part: DonorPartDefinition) => {
    if (previousOverrideSnapshot.current) {
      const { slot, prev } = previousOverrideSnapshot.current;
      if (prev) {
        updateComponentOverride(slot, prev, false);
      } else {
        resetComponentOverride(slot);
      }
      previousOverrideSnapshot.current = null;
    }
  };

  // Install part permanently
  const handleInstall = (part: DonorPartDefinition) => {
    // Clear preview snapshot so leave won't revert it
    previousOverrideSnapshot.current = null;

    const fitment = CrossCarPartSwapper.evaluateFitment(part, activeVehicleSpec);
    if (!fitment.passed) return;

    const targetSlot = part.semanticType;

    updateComponentOverride(
      targetSlot,
      {
        donorVehicleId: part.sourceVehicleId,
        donorVehicleName: part.sourceVehicleName,
        donorComponentId: part.id,
        donorComponentName: part.name,
        fitmentType: fitment.status,
        fitmentNotes: fitment.reasons[0] || fitment.adapterKitDescription,
        adapterScale: fitment.scaleAdjustment,
        adapterOffset: fitment.mountingOffsetDelta,
        materialRef: part.defaultMaterialRef,
        visible: true
      },
      true
    );

    // If wheel, install on all 4 corners
    if (part.category === 'Wheels') {
      const corners = [
        'wheel_front_left',
        'wheel_front_right',
        'wheel_rear_left',
        'wheel_rear_right',
        'wheel_fl',
        'wheel_fr',
        'wheel_rl',
        'wheel_rr'
      ];
      corners.forEach(corner => {
        updateComponentOverride(
          corner,
          {
            donorVehicleId: part.sourceVehicleId,
            donorVehicleName: part.sourceVehicleName,
            donorComponentId: part.id,
            donorComponentName: part.name,
            fitmentType: fitment.status,
            adapterScale: fitment.scaleAdjustment,
            adapterOffset: fitment.mountingOffsetDelta,
            visible: true
          },
          false
        );
      });
    }

    setJustInstalledId(part.id);
    setTimeout(() => setJustInstalledId(null), 2500);
  };

  // Uninstall part
  const handleUninstall = (part: DonorPartDefinition) => {
    previousOverrideSnapshot.current = null;
    Object.entries(componentOverrides).forEach(([slot, ov]) => {
      if (ov.donorComponentId === part.id) {
        resetComponentOverride(slot);
      }
    });
  };

  return (
    <>
      {/* Floating Toggle Capsule (Shown when drawer is collapsed) */}
      {!isPartsDrawerOpen && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-25 transition-all duration-300 pointer-events-auto ${
            isOrbitDragging ? 'opacity-20 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            onClick={togglePartsDrawer}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gt-basalt/90 hover:bg-gt-graphite border border-gt-border backdrop-blur-xl text-xs font-mono text-white shadow-2xl hover:border-gt-accent transition-all cursor-pointer group"
            title="Open Global Parts Library Drawer (Press P)"
          >
            <div className="w-5 h-5 rounded-full bg-gt-accent/20 border border-gt-accent/40 flex items-center justify-center text-gt-accent group-hover:scale-110 transition-transform">
              <Layers className="w-3 h-3" />
            </div>
            <span className="font-heading font-semibold tracking-wide">PARTS LIBRARY</span>
            <span className="px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-zinc-400 font-mono">
              P
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-gt-graphite border border-white/10 text-[10px] font-mono text-gt-accent font-bold">
              {allParts.length}
            </span>
          </button>
        </div>
      )}

      {/* Sliding Bottom Parts Drawer Container */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Global OEM Parts Library Cross-Car Swapper"
        className={`fixed bottom-0 left-0 right-0 md:left-24 md:right-auto md:w-[calc(100%-480px)] phone-landscape:left-12 phone-landscape:w-[calc(100%-310px)] md:left-[80px] z-30 transition-all duration-300 ease-out pointer-events-auto ${
          isPartsDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        } ${
          isOrbitDragging ? 'opacity-20 pointer-events-none' : ''
        }`}
      >
        <div className="m-3 md:m-4 phone-landscape:m-1 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col phone-landscape:max-h-[160px]">
          {/* Drawer Header */}
          <div className="px-4 py-3 phone-landscape:py-1.5 phone-landscape:px-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gt-accent/20 border border-gt-accent/40 flex items-center justify-center text-gt-accent" aria-hidden="true">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-heading font-bold text-white tracking-wide flex items-center gap-2">
                  <span>GLOBAL OEM PARTS LIBRARY</span>
                  <span className="text-[10px] font-mono font-normal text-zinc-400">
                    Cross-Car Swapper
                  </span>
                </h3>
                <p className="text-[10px] font-mono text-zinc-400">
                  Hover to preview on active chassis • Click to install
                </p>
              </div>
            </div>

            {/* Category Tabs */}
            <div role="tablist" aria-label="Part categories" className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-[11px] font-mono">
              {categories.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gt-accent text-white font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Close Drawer Button */}
            <button
              onClick={() => setPartsDrawerOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close Parts Drawer (P)"
              aria-label="Close Parts Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal Component Cards Carousel */}
          <div role="region" aria-label="Available donor parts" className="p-3 overflow-x-auto flex gap-3 no-scrollbar scroll-smooth">
            {filteredParts.length === 0 ? (
              <div className="w-full py-8 text-center text-xs font-mono text-zinc-500">
                No donor components available for category "{selectedCategory}".
              </div>
            ) : (
              filteredParts.map(part => {
                const installed = isPartInstalled(part.id);
                const justInstalled = justInstalledId === part.id;
                const fitment = CrossCarPartSwapper.evaluateFitment(part, activeVehicleSpec);

                // Compatibility styling
                let fitmentColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
                let fitmentLabel = 'DIRECT FIT';
                if (fitment.status === 'ADAPTABLE') {
                  fitmentColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
                  fitmentLabel = 'ADAPTABLE';
                } else if (fitment.status === 'INCOMPATIBLE') {
                  fitmentColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10';
                  fitmentLabel = 'INCOMPATIBLE';
                }

                return (
                  <div
                    key={part.id}
                    onMouseEnter={() => handleMouseEnter(part)}
                    onMouseLeave={() => handleMouseLeave(part)}
                    className={`shrink-0 w-64 rounded-xl border p-3 flex flex-col justify-between transition-all select-none ${
                      installed
                        ? 'bg-gt-accent/10 border-gt-accent shadow-lg shadow-gt-accent/10'
                        : 'bg-gt-basalt/60 hover:bg-gt-graphite/70 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      {/* Top Row: Donor Brand & Fitment Pill */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[120px]">
                          {part.sourceVehicleName}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${fitmentColor}`}
                        >
                          {fitmentLabel}
                        </span>
                      </div>

                      {/* Part Name */}
                      <h4 className="text-xs font-heading font-bold text-white truncate mb-1">
                        {part.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mb-2">
                        {part.description}
                      </p>

                      {/* Engineering Metrics Delta */}
                      <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-lg bg-black/40 border border-white/5 text-[9px] font-mono mb-2">
                        <div className="text-zinc-400">
                          MASS: <span className="text-zinc-200">{part.massKg ? `${part.massKg} kg` : 'OEM'}</span>
                        </div>
                        <div className="text-zinc-400">
                          SLOT: <span className="text-zinc-200 capitalize">{part.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-1">
                      {installed ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 py-1 rounded bg-gt-accent text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>INSTALLED</span>
                          </div>
                          <button
                            onClick={() => handleUninstall(part)}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-[10px] transition-colors cursor-pointer"
                            title="Revert to OEM default part"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInstall(part)}
                          disabled={!fitment.passed}
                          className={`w-full py-1.5 rounded text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            justInstalled
                              ? 'bg-emerald-500 text-white'
                              : fitment.passed
                              ? 'bg-white/10 hover:bg-gt-accent text-white hover:shadow-md'
                              : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          {justInstalled ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>INSTALLED</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-gt-accent group-hover:text-white" />
                              <span>INSTALL PART</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};
