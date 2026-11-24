import React, { useState, useRef } from 'react';

export interface TechnicalSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  onChange: (value: number) => void;
  detents?: number[]; // Values where a subtle tick is rendered
  disabled?: boolean;
  formatValue?: (val: number) => string;
}

export const TechnicalSlider: React.FC<TechnicalSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  defaultValue,
  unit = '',
  onChange,
  detents = [],
  disabled = false,
  formatValue,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const displayVal = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;

  const handleDoubleClick = () => {
    if (defaultValue !== undefined && !disabled) {
      onChange(defaultValue);
    }
  };

  return (
    <div
      className="space-y-1.5 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Header: Label and Tabular Numerical Readout */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gt-text-primary truncate">{label}</span>
        <button
          type="button"
          onClick={handleDoubleClick}
          title={defaultValue !== undefined ? `Double-click to reset (${defaultValue}${unit})` : undefined}
          className="font-mono text-xs font-semibold tabular-nums text-gt-text-primary px-1.5 py-0.5 rounded bg-gt-graphite border border-gt-border hover:border-gt-accent transition-colors"
        >
          {displayVal}
        </button>
      </div>

      {/* Slider Track & Underneath Native Input */}
      <div className="relative flex items-center h-5" ref={trackRef}>
        {/* Machined Slot Track Background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-gt-obsidian border border-gt-border overflow-hidden">
          {/* Active Fill Track */}
          <div
            className="h-full bg-gradient-to-r from-red-700 to-gt-accent transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Detent Tick Marks */}
        {detents.map((detentVal) => {
          const detentPct = ((detentVal - min) / (max - min)) * 100;
          return (
            <div
              key={detentVal}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-gt-border pointer-events-none"
              style={{ left: `${detentPct}%` }}
            />
          );
        })}

        {/* Floating Value Tooltip on Drag/Hover */}
        {(isDragging || isHovered) && (
          <div
            className="absolute -top-7 -translate-x-1/2 pointer-events-none px-1.5 py-0.5 rounded bg-gt-graphite border border-gt-border shadow-lg font-mono text-[10px] font-bold text-white tabular-nums z-20"
            style={{ left: `${percentage}%` }}
          >
            {displayVal}
          </div>
        )}

        {/* Real Accessible Native Range Input Overlay */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onDoubleClick={handleDoubleClick}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayVal}
          className="w-full absolute inset-0 opacity-0 cursor-pointer h-full z-10 disabled:cursor-not-allowed"
        />

        {/* Knurled Rectangular Thumb Visual Indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-4 rounded-sm bg-gradient-to-b from-slate-200 to-slate-400 border border-white shadow-md pointer-events-none transition-transform flex items-center justify-center gap-0.5 ${
            isDragging ? 'scale-110 shadow-gt-accent/40' : ''
          }`}
          style={{ left: `${percentage}%` }}
        >
          {/* 3 Knurled Grip Lines */}
          <span className="w-[1px] h-2 bg-slate-600" />
          <span className="w-[1px] h-2 bg-slate-600" />
          <span className="w-[1px] h-2 bg-slate-600" />
        </div>
      </div>
    </div>
  );
};
