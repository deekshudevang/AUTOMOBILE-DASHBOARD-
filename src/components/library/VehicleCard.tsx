import React from 'react';
import { Star, ArrowRight, Eye, ShieldCheck, Cpu } from 'lucide-react';
import { BrandBadge } from '../ui/BrandBadge';
import { VehicleTechnicalSilhouette } from './VehicleTechnicalSilhouette';
import { getManufacturerBrand } from '../../data/manufacturerBrands';
import { getVehicleTechnicalSpecs } from '../../data/vehicleTechnicalSpecs';
import { VehicleFileSummary } from '../../types/vehicle';

interface VehicleCardProps {
  vehicle: VehicleFileSummary;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    groundClearance?: number;
  };
  isCurrent?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (fileName: string, e: React.MouseEvent) => void;
  onInspect?: (vehicle: VehicleFileSummary) => void;
  onLaunch?: (fileName: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  dimensions = { length: 4.6, width: 1.95, height: 1.2, wheelbase: 2.65, groundClearance: 0.11 },
  isCurrent = false,
  isFavorite = false,
  onToggleFavorite,
  onInspect,
  onLaunch
}) => {
  const brand = getManufacturerBrand(vehicle.manufacturer);
  const specs = getVehicleTechnicalSpecs(vehicle.fileName || vehicle.modelCode);

  return (
    <div
      onClick={() => onLaunch?.(vehicle.fileName)}
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
        isCurrent
          ? 'bg-[#0E1218] border-gt-accent shadow-xl shadow-red-950/20 ring-1 ring-gt-accent'
          : 'bg-[#0B0E14] border-gt-border hover:border-zinc-500 hover:bg-[#0F131A] hover:shadow-2xl'
      }`}
    >
      {/* Top Heritage Accent Bar */}
      <div
        className="h-1 w-full shrink-0 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${brand.brandColor} 0%, ${brand.accentColor} 60%, transparent 100%)`,
          opacity: isCurrent ? 1 : 0.7
        }}
      />

      <div className="p-4 flex flex-col space-y-3.5">
        {/* Card Header: Brand, Category, Favorite */}
        <div className="flex items-center justify-between gap-2">
          <BrandBadge
            manufacturer={vehicle.manufacturer}
            size="sm"
            showWordmark={true}
            showCountry={true}
          />

          <div className="flex items-center gap-1.5">
            {isCurrent && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800 font-semibold">
                ACTIVE
              </span>
            )}

            <button
              onClick={e => onToggleFavorite?.(vehicle.fileName, e)}
              className="p-1.5 rounded text-zinc-500 hover:text-amber-400 hover:bg-white/5 transition-colors"
              title="Pin to Favorites"
              aria-label="Pin to Favorites"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Visual Blueprint / Technical Silhouette */}
        <div className="relative py-2 px-1 bg-black/40 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
          <VehicleTechnicalSilhouette
            dimensions={dimensions}
            category={vehicle.category}
            brandColor={brand.brandColor}
            doorMechanism={specs.doorMechanism}
          />

          {/* Door Mechanism Badge Overlay */}
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-zinc-300 border border-white/10 backdrop-blur-sm">
              {specs.doorMechanism}
            </span>
          </div>

          {/* Drivetrain Tag */}
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/70 text-gt-info border border-blue-500/30">
              {specs.drivetrain}
            </span>
          </div>
        </div>

        {/* Title & Model Information */}
        <div>
          <h3 className="text-base font-heading font-bold text-white group-hover:text-red-400 transition-colors truncate">
            {vehicle.realWorldModel || vehicle.displayName}
          </h3>
          <p className="text-xs text-zinc-400 truncate mt-0.5 font-mono">
            {specs.powertrain}
          </p>
        </div>

        {/* Hero Metrics Row: Tabular telemetry grid */}
        <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-lg bg-black/50 border border-white/5 text-center">
          <div>
            <span className="block text-[9px] text-zinc-500 font-mono uppercase">Power</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {specs.powerHp} <span className="text-[9px] font-normal text-zinc-400">HP</span>
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-zinc-500 font-mono uppercase">Top Speed</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {specs.topSpeedKmh} <span className="text-[9px] font-normal text-zinc-400">KMH</span>
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-zinc-500 font-mono uppercase">0-100</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {specs.zeroToHundredS}s
            </span>
          </div>
          <div>
            <span className="block text-[9px] text-zinc-500 font-mono uppercase">Weight</span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {specs.weightKg} <span className="text-[9px] font-normal text-zinc-400">KG</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 px-4 border-t border-gt-border bg-black/30 flex items-center justify-between text-xs">
        <button
          onClick={e => {
            e.stopPropagation();
            onInspect?.(vehicle);
          }}
          className="text-zinc-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px] px-2 py-1 rounded hover:bg-white/5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Technical Specs</span>
        </button>

        <button
          onClick={e => {
            e.stopPropagation();
            onLaunch?.(vehicle.fileName);
          }}
          className="px-3 py-1.5 rounded-md bg-gt-accent hover:bg-red-600 text-white font-medium flex items-center gap-1.5 text-xs transition-colors shadow-sm"
        >
          <span>3D Atelier</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
