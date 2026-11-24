import React from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'ok' | 'warn' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantClasses = {
    neutral: 'bg-gt-graphite text-gt-text-secondary border-gt-border',
    accent: 'bg-red-950/60 text-red-200 border-red-700/60',
    ok: 'bg-emerald-950/60 text-emerald-200 border-emerald-700/60',
    warn: 'bg-amber-950/60 text-amber-200 border-amber-700/60',
    info: 'bg-blue-950/60 text-blue-200 border-blue-700/60',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border select-none ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
