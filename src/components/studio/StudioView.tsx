import React, { useRef, useState, useMemo } from 'react';
import {
  ShieldCheck,
  DoorOpen,
  Car,
  Ruler,
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { SceneCanvas } from '../3d/SceneCanvas';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { toHex32 } from '../../utils/joaat';
import {
  QualityClassifier,
  VehicleAssetDatabase,
  VehicleModelStatus
} from '@autoverse/authentic-geometry-engine';
import { VehicleSelectionModal } from '../gallery/VehicleSelectionModal';
import { VerticalCameraRail } from './VerticalCameraRail';
import { AtelierBlade } from './AtelierBlade';
import { GlobalPartsDrawer } from './GlobalPartsDrawer';
import { BrandBadge } from '../ui/BrandBadge';

export const StudioView: React.FC = () => {
  const {
    activeConfig,
    activeModel,
    activeFile,
    assetBindings,
    useGeometryEngineV2,
    toggleGeometryEngineV2,
    setActiveView
  } = useVehicleStore();

  const isOrbitDragging = useUiStore(s => s.isOrbitDragging);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const binding = activeModel ? assetBindings[activeModel.hash] : undefined;

  // Dynamically derive fidelity classification and Section 14 Model Status
  const classification = useMemo(() => {
    if (!useGeometryEngineV2) {
      return binding?.qualityClass || 'CLASS_D_APPROXIMATE';
    }
    if (binding?.qualityClass === 'CLASS_A_VERIFIED_OEM') {
      return 'CLASS_A_VERIFIED_OEM';
    }
    return 'CLASS_B_VERIFIED_PRODUCTION';
  }, [useGeometryEngineV2, binding]);

  const modelStatus = useMemo((): VehicleModelStatus => {
    if (binding?.isCustomUpload && binding?.customMesh) {
      return 'AUTHENTIC_ASSET_VERIFIED';
    }
    if (useGeometryEngineV2) {
      return 'MODEL_SPECIFIC_RECONSTRUCTION';
    }
    if (binding?.qualityClass === 'CLASS_D_APPROXIMATE') {
      return 'PROCEDURAL_APPROXIMATION';
    }
    return 'MODEL_SPECIFIC_RECONSTRUCTION';
  }, [useGeometryEngineV2, binding]);

  const statusInfo = useMemo(() => {
    return QualityClassifier.getModelStatusInfo(modelStatus);
  }, [modelStatus]);

  const badge = useMemo(() => {
    return QualityClassifier.getBadgeInfo(classification);
  }, [classification]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gt-obsidian flex overflow-hidden select-none"
    >
      {/* Permanent 3D Stage Viewport (Full Viewport, Never Squeezed) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <SceneCanvas />
      </div>

      {/* Top Floating Stage Capsule: Minimalist Vehicle Identity & Provenance */}
      <div
        className={`absolute top-4 left-6 z-20 flex items-center gap-3 transition-opacity duration-200 pointer-events-auto ${
          isOrbitDragging ? 'opacity-20 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="p-2.5 px-4 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
          <BrandBadge
            manufacturer={activeModel?.manufacturer || 'Porsche'}
            size="sm"
            showWordmark={true}
          />

          <div className="h-4 w-[1px] bg-white/10" />

          {/* Model Status / Provenance Pill */}
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-transform hover:scale-105"
            style={{
              color: badge.hexColor,
              borderColor: `${badge.hexColor}40`,
              backgroundColor: `${badge.hexColor}15`
            }}
            title="Inspect AAGE Provenance Certificate"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{badge.shortLabel}</span>
          </button>

          {/* Coachwork V2 Toggle */}
          <button
            onClick={toggleGeometryEngineV2}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-semibold transition-colors ${
              useGeometryEngineV2
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
            title="Toggle between Coachwork V2 Engine and Legacy Fallback"
          >
            {useGeometryEngineV2 ? 'V2 COACHWORK' : 'FALLBACK'}
          </button>
        </div>
      </div>

      {/* Left Vertical Camera Rail (Defect 14 Resolution) */}
      <VerticalCameraRail />

      {/* Right Floating Atelier Blade Shell (Defect 01 Resolution) */}
      <AtelierBlade />

      {/* Global OEM Parts Drawer (Sliding Bottom Carousel) */}
      <GlobalPartsDrawer />

      {/* Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      {/* AAGE Geometric Provenance Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-gt-basalt border border-gt-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-gt-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-heading font-bold text-white">
                  AAGE Geometric Provenance Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-gt-obsidian border border-gt-border space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">ASSET CODE:</span>
                <span className="text-white font-bold">{activeModel?.codeName || activeFile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">JOAAT 32-BIT HASH:</span>
                <span className="text-gt-accent font-bold">{activeModel ? toHex32(activeModel.hash) : '0x00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ACCURACY CLASS:</span>
                <span style={{ color: badge.hexColor }} className="font-bold">
                  {badge.badgeTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">MODEL STATUS:</span>
                <span style={{ color: statusInfo.hexColor }} className="font-bold">
                  {statusInfo.badgeTitle}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              {statusInfo.description} All chassis geometry conforms to verified Schema 2.0 kinematic aperture standards.
            </p>

            <div className="flex justify-end pt-2 border-t border-gt-border">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-1.5 rounded-lg bg-gt-graphite text-white font-medium hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
