import React from 'react';

export interface ValueReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaUnit?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ValueReadout: React.FC<ValueReadoutProps> = ({
  label,
  value,
  unit,
  delta,
  deltaUnit = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      label: 'text-[10px]',
      value: 'text-xs',
      unit: 'text-[10px]',
    },
    md: {
      label: 'text-xs',
      value: 'text-sm',
      unit: 'text-xs',
    },
    lg: {
      label: 'text-xs',
      value: 'text-xl',
      unit: 'text-sm',
    },
  }[size];

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <span className={`font-mono text-gt-text-secondary uppercase tracking-wider ${sizeClasses.label}`}>
        {label}
      </span>
      <div className="flex items-baseline gap-1 pt-0.5">
        <span className={`font-mono font-bold text-gt-text-primary tabular-nums ${sizeClasses.value}`}>
          {value}
        </span>
        {unit && (
          <span className={`font-mono font-medium text-gt-text-secondary ${sizeClasses.unit}`}>
            {unit}
          </span>
        )}
        {delta !== undefined && delta !== 0 && (
          <span
            className={`font-mono text-[10px] font-bold ml-1.5 tabular-nums ${
              delta > 0 ? 'text-gt-ok' : 'text-gt-accent'
            }`}
          >
            {delta > 0 ? `+${delta}` : delta}
            {deltaUnit}
          </span>
        )}
      </div>
    </div>
  );
};
