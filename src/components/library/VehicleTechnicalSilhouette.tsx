import React from 'react';

interface VehicleDimensions {
  length: number;
  width: number;
  height: number;
  wheelbase: number;
  frontTrack?: number;
  rearTrack?: number;
  groundClearance?: number;
}

interface VehicleTechnicalSilhouetteProps {
  dimensions?: VehicleDimensions;
  category?: string;
  brandColor?: string;
  doorMechanism?: string;
  showDimensions?: boolean;
  className?: string;
}

export const VehicleTechnicalSilhouette: React.FC<VehicleTechnicalSilhouetteProps> = ({
  dimensions = { length: 4.6, width: 1.95, height: 1.2, wheelbase: 2.65, groundClearance: 0.11 },
  category = 'supercars',
  brandColor = '#E53935',
  doorMechanism,
  showDimensions = true,
  className = ''
}) => {
  // Normalize dimensions
  const lengthM = dimensions.length || 4.6;
  const heightM = dimensions.height || 1.2;
  const wheelbaseM = dimensions.wheelbase || 2.65;
  const clearanceM = dimensions.groundClearance || 0.11;

  // ViewBox: 380 wide × 160 high
  // Target vehicle display width inside SVG: 320px
  const scale = 310 / Math.max(lengthM, 4.2);
  const vWidth = lengthM * scale;
  const vHeight = heightM * scale;
  const groundY = 135;
  const startX = (380 - vWidth) / 2;
  const roofY = groundY - vHeight;

  // Wheel calculations
  const wheelRadius = Math.max(14, vHeight * 0.28);
  const rearOverhangRatio = (lengthM - wheelbaseM) * 0.45;
  const rearWheelX = startX + (rearOverhangRatio * scale) + wheelRadius;
  const frontWheelX = rearWheelX + (wheelbaseM * scale);
  const wheelCenterY = groundY - wheelRadius + 2;

  // Specific body profiles based on category
  const isTrack = category.includes('track') || category.includes('special');
  const isHyper = category.includes('hyper');
  const isLuxury = category.includes('luxury');

  // SVG Paths
  // Ground shadow & reference line
  const groundPath = `M 20 ${groundY} L 360 ${groundY}`;

  // Vehicle Body Contour (Side Profile)
  // Front splitter -> Nose -> Hood -> Windscreen -> Roof -> Rear Window -> Wing / Deck -> Rear Diffuser
  const noseX = frontWheelX + wheelRadius + (lengthM * 0.18 * scale);
  const rearTailX = startX;

  const bodyPath = `
    M ${rearTailX} ${groundY - 10}
    C ${rearTailX - 2} ${groundY - 20}, ${rearTailX + 10} ${roofY + (isTrack ? 18 : 24)}, ${rearTailX + 35} ${roofY + 16}
    L ${rearWheelX + 20} ${roofY + 8}
    C ${rearWheelX + 50} ${roofY + 6}, ${(rearWheelX + frontWheelX) / 2 - 20} ${roofY}, ${(rearWheelX + frontWheelX) / 2} ${roofY}
    C ${(rearWheelX + frontWheelX) / 2 + 40} ${roofY}, ${frontWheelX - 30} ${roofY + 12}, ${frontWheelX} ${roofY + 28}
    L ${noseX - 15} ${groundY - 26}
    C ${noseX} ${groundY - 24}, ${noseX + 4} ${groundY - 14}, ${noseX} ${groundY - 6}
    L ${noseX - 20} ${groundY - 5}
    L ${frontWheelX + wheelRadius + 4} ${groundY - 5}
    A ${wheelRadius + 3} ${wheelRadius + 3} 0 0 0 ${frontWheelX - wheelRadius - 4} ${groundY - 5}
    L ${rearWheelX + wheelRadius + 4} ${groundY - 5}
    A ${wheelRadius + 3} ${wheelRadius + 3} 0 0 0 ${rearWheelX - wheelRadius - 4} ${groundY - 5}
    L ${rearTailX + 8} ${groundY - 6}
    Z
  `;

  // Cockpit Greenhouse Line
  const glassPath = `
    M ${(rearWheelX + frontWheelX) / 2 - 25} ${roofY + 3}
    L ${(rearWheelX + frontWheelX) / 2 + 30} ${roofY + 3}
    C ${(rearWheelX + frontWheelX) / 2 + 50} ${roofY + 4}, ${frontWheelX - 25} ${roofY + 14}, ${frontWheelX - 5} ${roofY + 26}
    L ${(rearWheelX + frontWheelX) / 2 - 20} ${roofY + 26}
    Z
  `;

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 380 160"
        className="w-full h-auto max-h-40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle aerodynamic airflow gradient */}
          <linearGradient id="aeroStream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2979FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2979FF" stopOpacity="0" />
          </linearGradient>

          {/* Body gradient */}
          <linearGradient id="bodyShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#1F2937" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#111827" stopOpacity="0.9" />
          </linearGradient>

          {/* Wheel metal gradient */}
          <radialGradient id="wheelMetal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B5563" />
            <stop offset="70%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#0B0E14" />
          </radialGradient>
        </defs>

        {/* Studio Ground Shadow & Precision Grid Baseline */}
        <line
          x1="20"
          y1={groundY}
          x2="360"
          y2={groundY}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Ambient Ground Contact Shadow */}
        <ellipse
          cx={(rearWheelX + frontWheelX) / 2}
          cy={groundY + 2}
          rx={vWidth * 0.48}
          ry="4"
          fill="rgba(0,0,0,0.7)"
        />

        {/* Aerodynamic Airflow Streamlines */}
        <path
          d={`M ${noseX + 30} ${groundY - 24} C ${noseX - 20} ${roofY + 20}, ${(rearWheelX + frontWheelX) / 2} ${roofY - 8}, ${rearTailX - 25} ${roofY + 8}`}
          stroke="url(#aeroStream)"
          strokeWidth="1.2"
          strokeDasharray="8 4"
        />
        <path
          d={`M ${noseX + 15} ${groundY - 14} C ${noseX - 30} ${roofY + 35}, ${(rearWheelX + frontWheelX) / 2 + 10} ${roofY + 24}, ${rearTailX - 20} ${roofY + 36}`}
          stroke="url(#aeroStream)"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />

        {/* Vehicle Body Silhouette Fill & Stroke */}
        <path
          d={bodyPath}
          fill="url(#bodyShade)"
          stroke={brandColor}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Glasshouse Window Tint */}
        <path
          d={glassPath}
          fill="rgba(10, 15, 24, 0.85)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
        />

        {/* Rear Aerodynamic Wing / Spoiler (Track / Hypercars) */}
        {(isTrack || isHyper) && (
          <g>
            {/* Swan-neck wing strut */}
            <path
              d={`M ${rearTailX + 22} ${roofY + 16} L ${rearTailX + 18} ${roofY + 2}`}
              stroke="#6B7280"
              strokeWidth="1.5"
            />
            {/* Wing airfoil */}
            <path
              d={`M ${rearTailX + 8} ${roofY + 2} L ${rearTailX + 32} ${roofY + 4}`}
              stroke={brandColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Rear Wheel Assembly */}
        <g>
          {/* Tire */}
          <circle cx={rearWheelX} cy={wheelCenterY} r={wheelRadius} fill="#090C10" stroke="#2D3748" strokeWidth="2.5" />
          {/* Rim */}
          <circle cx={rearWheelX} cy={wheelCenterY} r={wheelRadius - 4} fill="url(#wheelMetal)" stroke="#4A5568" strokeWidth="0.8" />
          {/* Brake Caliper */}
          <path
            d={`M ${rearWheelX - wheelRadius + 6} ${wheelCenterY - 4} A 6 6 0 0 1 ${rearWheelX - wheelRadius + 6} ${wheelCenterY + 4}`}
            stroke={brandColor}
            strokeWidth="2"
            fill="none"
          />
          {/* Center Hub */}
          <circle cx={rearWheelX} cy={wheelCenterY} r="3" fill="#D1D5DB" />
        </g>

        {/* Front Wheel Assembly */}
        <g>
          {/* Tire */}
          <circle cx={frontWheelX} cy={wheelCenterY} r={wheelRadius} fill="#090C10" stroke="#2D3748" strokeWidth="2.5" />
          {/* Rim */}
          <circle cx={frontWheelX} cy={wheelCenterY} r={wheelRadius - 4} fill="url(#wheelMetal)" stroke="#4A5568" strokeWidth="0.8" />
          {/* Brake Caliper */}
          <path
            d={`M ${frontWheelX - wheelRadius + 6} ${wheelCenterY - 5} A 7 7 0 0 1 ${frontWheelX - wheelRadius + 6} ${wheelCenterY + 5}`}
            stroke={brandColor}
            strokeWidth="2.2"
            fill="none"
          />
          {/* Center Hub */}
          <circle cx={frontWheelX} cy={wheelCenterY} r="3" fill="#D1D5DB" />
        </g>

        {/* Wheelbase Dimension Caliper */}
        <line
          x1={rearWheelX}
          y1={groundY + 12}
          x2={frontWheelX}
          y2={groundY + 12}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.75"
        />
        <line x1={rearWheelX} y1={groundY + 8} x2={rearWheelX} y2={groundY + 16} stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
        <line x1={frontWheelX} y1={groundY + 8} x2={frontWheelX} y2={groundY + 16} stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />

        <text
          x={(rearWheelX + frontWheelX) / 2}
          y={groundY + 22}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontFamily="monospace"
          fontSize="8"
          className="tabular-nums font-mono"
        >
          WB {(wheelbaseM * 1000).toFixed(0)} mm
        </text>

        {/* Overall Length Dimension Tag */}
        {showDimensions && (
          <text
            x={startX + 6}
            y={roofY - 6}
            fill="rgba(255,255,255,0.4)"
            fontFamily="monospace"
            fontSize="8"
            className="tabular-nums font-mono"
          >
            L: {(lengthM * 1000).toFixed(0)} mm • H: {(heightM * 1000).toFixed(0)} mm
          </text>
        )}
      </svg>
    </div>
  );
};
