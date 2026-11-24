import React from 'react';

export type TelemetryState = 'optimal' | 'warning' | 'error' | 'info' | 'neutral';

export interface TelemetryIndicatorProps {
  state?: TelemetryState;
  label?: string;
  className?: string;
}

export const TelemetryIndicator: React.FC<TelemetryIndicatorProps> = ({
  state = 'optimal',
  label,
  className = '',
}) => {
  const stateConfig = {
    optimal: { dot: 'bg-gt-ok', border: 'border-emerald-600/50', text: 'text-emerald-400' },
    warning: { dot: 'bg-gt-warn', border: 'border-amber-600/50', text: 'text-amber-400' },
    error: { dot: 'bg-gt-error', border: 'border-red-600/50', text: 'text-red-400' },
    info: { dot: 'bg-gt-info', border: 'border-blue-600/50', text: 'text-blue-400' },
    neutral: { dot: 'bg-slate-500', border: 'border-slate-700', text: 'text-slate-400' },
  }[state];

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <span className="relative flex h-2 w-2">
        {state === 'optimal' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stateConfig.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${stateConfig.dot}`} />
      </span>
      {label && (
        <span className={`font-mono text-[11px] font-medium tracking-tight ${stateConfig.text}`}>
          {label}
        </span>
      )}
    </div>
  );
};
