import React from 'react';

export type PaintFinishType = 'gloss' | 'metallic' | 'satin' | 'matte' | 'carbon';

export interface PaintColorDef {
  name: string;
  hex: string;
  brand?: string;
  finish: PaintFinishType;
}

interface PaintSpeedformSwatchProps {
  color: PaintColorDef;
  isSelected?: boolean;
  onSelect?: (color: PaintColorDef) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PaintSpeedformSwatch: React.FC<PaintSpeedformSwatchProps> = ({
  color,
  isSelected = false,
  onSelect,
  size = 'md',
  className = ''
}) => {
  const dimensions = {
    sm: { w: 44, h: 28 },
    md: { w: 56, h: 36 },
    lg: { w: 68, h: 44 }
  }[size];

  // Derive finish-specific lighting
  const isGloss = color.finish === 'gloss';
  const isMetallic = color.finish === 'metallic';
  const isMatte = color.finish === 'matte' || color.finish === 'satin';
  const isCarbon = color.finish === 'carbon';

  return (
    <button
      onClick={() => onSelect?.(color)}
      className={`group relative rounded-xl p-1 transition-all flex flex-col items-center cursor-pointer focus:outline-none ${className} ${
        isSelected
          ? 'scale-105 ring-2 ring-gt-accent shadow-lg shadow-red-950/40'
          : 'hover:scale-102 hover:ring-1 hover:ring-white/30'
      }`}
      title={`${color.name} (${color.finish.toUpperCase()})`}
      aria-label={`${color.name} ${color.finish}`}
    >
      {/* 3D Speedform Sculpted Automotive Silhouette */}
      <svg
        viewBox="0 0 80 50"
        className="w-full h-auto drop-shadow-md rounded-lg overflow-hidden"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Carbon Twill Weave Pattern */}
          <pattern id="carbonTwill" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#111111" />
            <path d="M0 3L3 0M3 6L6 3" stroke="#262626" strokeWidth="1" />
            <path d="M3 3L6 6M0 0L3 3" stroke="#1A1A1A" strokeWidth="1" />
          </pattern>

          {/* Speedform Ambient & Specular Lighting Gradient */}
          <linearGradient id={`grad_${color.hex.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={isGloss ? 0.65 : isMetallic ? 0.5 : 0.2} />
            <stop offset="25%" stopColor={color.hex} stopOpacity="1" />
            <stop offset="70%" stopColor={color.hex} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#050608" stopOpacity="0.95" />
          </linearGradient>

          {/* Metallic Sparkle Overlay */}
          <linearGradient id="metallicSheen" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity={isMetallic ? 0.45 : isGloss ? 0.7 : 0.15} />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Speedform Base Body (Aerodynamic Teardrop Silhouette) */}
        <path
          d="M 6 36 C 4 28, 12 10, 34 8 C 58 6, 74 16, 76 28 C 77 35, 70 42, 54 43 C 32 44, 8 42, 6 36 Z"
          fill={isCarbon ? 'url(#carbonTwill)' : `url(#grad_${color.hex.replace('#', '')})`}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />

        {/* Crown Shoulder Specular Light Streak (Simulating Studio Lightbox Reflection) */}
        <path
          d="M 16 20 C 26 12, 48 10, 68 22 C 54 18, 32 18, 16 20 Z"
          fill="url(#metallicSheen)"
          opacity={isMatte ? 0.3 : 0.9}
        />

        {/* Lower Body Undercut Shadow */}
        <path
          d="M 10 37 C 24 38, 52 40, 72 31 C 60 41, 26 42, 10 37 Z"
          fill="rgba(0,0,0,0.6)"
        />

        {/* Carbon Fiber Raw Tint Overlay */}
        {isCarbon && (
          <path
            d="M 6 36 C 4 28, 12 10, 34 8 C 58 6, 74 16, 76 28 C 77 35, 70 42, 54 43 C 32 44, 8 42, 6 36 Z"
            fill={color.hex}
            fillOpacity="0.3"
            style={{ mixBlendMode: 'color' }}
          />
        )}
      </svg>

      {/* Swatch Label & Brand Tag */}
      <span className="text-[10px] font-mono text-zinc-300 truncate w-full text-center mt-1 group-hover:text-white">
        {color.name}
      </span>
    </button>
  );
};
