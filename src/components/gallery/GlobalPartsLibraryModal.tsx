/**
 * AUTOVERSE 3D — Global Swappable Vehicle Parts & Donor Component Library
 * Allows browsing, searching, and 1-click cross-car installation of genuine
 * donor components (Lamborghini SVJ, Ferrari 488 Pista, Porsche GT3 RS, etc.)
 * with live kinematic/aerodynamic compatibility checks (DIRECT FIT / ADAPTABLE / INCOMPATIBLE).
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Disc,
  Wind
} from 'lucide-react';
import { CrossCarPartSwapper, DonorPartDefinition } from '@autoverse/vehicle-generation-engine';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toCanonicalSchema2Id } from '../../geometry/components/canonicalComponentMap';

interface GlobalPartsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlotId?: string | null;
}

export const GlobalPartsLibraryModal: React.FC<GlobalPartsLibraryModalProps> = ({
  isOpen,
  onClose,
  targetSlotId
}) => {
  const {
    activeConfig,
    activeModel,
    componentOverrides,
    updateComponentOverride,
    resetComponentOverride
  } = useVehicleStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDonorVehicle, setSelectedDonorVehicle] = useState<string>('all');
  const [justInstalledId, setJustInstalledId] = useState<string | null>(null);

  const activeVehicleSpec = useMemo(() => {
    return activeConfig.parametricSpec || activeConfig;
  }, [activeConfig]);

  const activeVehicleId = activeVehicleSpec?.vehicle?.id || activeModel?.codeName || 'target_vehicle';
  const activeVehicleName = activeModel?.displayName || activeVehicleSpec?.vehicle?.model || 'Current Vehicle';

  // Retrieve and filter donor parts
  const allParts = useMemo(() => {
    return CrossCarPartSwapper.getDonorParts();
  }, []);

  const filteredParts = useMemo(() => {
    return allParts.filter(part => {
      // Category filter
      if (selectedCategory !== 'All' && part.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Donor vehicle filter
      if (selectedDonorVehicle !== 'all' && part.sourceVehicleId !== selectedDonorVehicle) {
        return false;
      }
      // Target slot filter (if opened from a specific component inspector)
      if (targetSlotId) {
        const canonicalSlot = toCanonicalSchema2Id(targetSlotId);
        if (part.semanticType !== canonicalSlot && !targetSlotId.includes(part.semanticType)) {
          // Allow cross-wheel slot matching
          if (targetSlotId.startsWith('wheel_') && part.semanticType.startsWith('wheel_')) {
            // ok
          } else {
            return false;
          }
        }
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = part.name.toLowerCase().includes(q);
        const matchVehicle = part.sourceVehicleName.toLowerCase().includes(q);
        const matchDesc = part.description.toLowerCase().includes(q);
        const matchCategory = part.category.toLowerCase().includes(q);
        if (!matchName && !matchVehicle && !matchDesc && !matchCategory) return false;
      }
      return true;
    });
  }, [allParts, selectedCategory, selectedDonorVehicle, targetSlotId, searchQuery]);

  // Unique donor vehicles list for dropdown
  const donorVehicles = useMemo(() => {
    const map = new Map<string, string>();
    allParts.forEach(p => map.set(p.sourceVehicleId, p.sourceVehicleName));
    return Array.from(map.entries());
  }, [allParts]);

  // Handle installation of a donor part onto the active vehicle
  const handleInstallPart = (part: DonorPartDefinition) => {
    const fitment = CrossCarPartSwapper.evaluateFitment(part, activeVehicleSpec);
    if (!fitment.passed) return;

    // Resolve target component slot
    let targetSlot = targetSlotId;
    if (!targetSlot) {
      targetSlot = part.semanticType;
    }

    // Apply installation override
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

    // If wheel, install on all 4 corners for consistency unless a single corner was clicked
    if (part.category === 'Wheels' && (!targetSlotId || targetSlotId === 'wheels')) {
      const corners = ['wheel_front_left', 'wheel_front_right', 'wheel_rear_left', 'wheel_rear_right', 'wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'];
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

  // Check if a part is currently installed
  const isPartInstalled = (partId: string): boolean => {
    return Object.values(componentOverrides).some(ov => ov.donorComponentId === partId);
  };

  const handleUninstallPart = (part: DonorPartDefinition) => {
    Object.entries(componentOverrides).forEach(([slot, ov]) => {
      if (ov.donorComponentId === part.id) {
        resetComponentOverride(slot);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-5xl h-[88vh] bg-[#0A0C10] border border-[#1E2533] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 bg-[#11141C] border-b border-[#1E2533] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">
                AutoVerse 3D — Global Swappable Parts Library
              </h2>
              <div className="text-[11px] text-slate-400">
                Target Vehicle: <span className="text-[#00F0FF] font-semibold">{activeVehicleName}</span>
                {targetSlotId && <span> · Target Slot: <code className="text-amber-400">{targetSlotId}</code></span>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E2533] transition-colors"
            title="Close Library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#0E1118] border-b border-[#1E2533] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Aero', 'Body', 'Wheels', 'Exhaust'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00F0FF] text-slate-950 shadow-sm'
                    : 'bg-[#161C28] text-slate-300 hover:text-white hover:bg-[#1E2533] border border-[#1E2533]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Donor Car Filter Dropdown & Search */}
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={selectedDonorVehicle}
              onChange={e => setSelectedDonorVehicle(e.target.value)}
              className="bg-[#161C28] border border-[#1E2533] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="all">All Donor Vehicles</option>
              {donorVehicles.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#161C28] border border-[#1E2533] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>
        </div>

        {/* Parts Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParts.map(part => {
            const fitment = CrossCarPartSwapper.evaluateFitment(part, activeVehicleSpec);
            const isInstalled = isPartInstalled(part.id);
            const isJustInstalled = justInstalledId === part.id;

            return (
              <div
                key={part.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isInstalled
                    ? 'bg-[#111A24] border-[#00F0FF]/50 ring-1 ring-[#00F0FF]/30'
                    : 'bg-[#11141C] border-[#1E2533] hover:border-slate-600'
                }`}
              >
                {/* Part Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161C28] text-slate-300 border border-[#1E2533]">
                      {part.category} · {part.semanticType}
                    </span>

                    {/* Fitment Status Badge */}
                    {fitment.status === 'DIRECT_FIT' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        DIRECT FIT
                      </span>
                    )}
                    {fitment.status === 'ADAPTABLE' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/80 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        ADAPTABLE ({fitment.score}%)
                      </span>
                    )}
                    {fitment.status === 'INCOMPATIBLE' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/80 flex items-center gap-1">
                        <X className="w-3 h-3 text-rose-400" />
                        INCOMPATIBLE
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-100 leading-snug">{part.name}</h3>
                    <div className="text-[11px] text-[#00F0FF] font-medium mt-0.5">
                      Donor: {part.sourceVehicleName}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {part.description}
                  </p>
                </div>

                {/* Automotive Specs & Fitment Details */}
                <div className="my-3 pt-3 border-t border-[#1E2533] space-y-2 text-[11px] font-mono">
                  <div className="grid grid-cols-3 gap-1 text-slate-400">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500">Mass</span>
                      <span className="text-slate-200 font-semibold">{part.massKg} kg</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500">Downforce</span>
                      <span className="text-slate-200 font-semibold">
                        {part.downforceKgAt200Kmh > 0 ? `+${part.downforceKgAt200Kmh} kg` : '0 kg'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500">Drag Δ</span>
                      <span className="text-slate-200 font-semibold">
                        {part.dragCdDelta > 0 ? `+${part.dragCdDelta}` : `${part.dragCdDelta}`}
                      </span>
                    </div>
                  </div>

                  {/* Fitment Notes */}
                  {fitment.requiresAdapterKit && fitment.adapterKitDescription && (
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40 text-amber-300/90 text-[10px] font-sans">
                      ⚠️ {fitment.adapterKitDescription}
                    </div>
                  )}
                  {fitment.status === 'INCOMPATIBLE' && fitment.reasons[0] && (
                    <div className="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-300/90 text-[10px] font-sans">
                      🛑 {fitment.reasons[0]}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {isInstalled ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Installed on Car</span>
                      </div>
                      <button
                        onClick={() => handleUninstallPart(part)}
                        className="py-1.5 px-3 rounded-lg bg-[#161C28] hover:bg-rose-900/30 text-rose-400 border border-[#1E2533] hover:border-rose-800 text-xs font-semibold transition-colors"
                        title="Uninstall and restore OEM baseline"
                      >
                        Restore OEM
                      </button>
                    </div>
                  ) : isJustInstalled ? (
                    <div className="w-full py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Successfully Swapped!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInstallPart(part)}
                      disabled={!fitment.passed}
                      className={`w-full py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        fitment.passed
                          ? 'bg-[#00F0FF] hover:bg-[#00D4E0] text-slate-950 font-bold shadow'
                          : 'bg-[#161C28] text-slate-600 border border-[#1E2533] cursor-not-allowed'
                      }`}
                    >
                      {fitment.passed ? (
                        <>
                          <span>Install on Vehicle</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <span>Incompatible with Vehicle</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="h-12 px-6 bg-[#11141C] border-t border-[#1E2533] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div>
            Showing <span className="text-[#00F0FF] font-semibold">{filteredParts.length}</span> donor components ready for cross-car installation.
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
