import React from 'react';

export interface SectionHeaderProps {
  title: string;
  badge?: string;
  action?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  badge,
  action,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`space-y-1 pb-2 border-b border-gt-border select-none ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-sm font-bold tracking-wider text-gt-text-primary uppercase">
            {title}
          </h2>
          {badge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-gt-graphite border border-gt-border text-gt-text-secondary">
              {badge}
            </span>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <p className="text-[11px] text-gt-text-secondary">{subtitle}</p>}
    </div>
  );
};
