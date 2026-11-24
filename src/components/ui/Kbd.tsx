import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-gt-graphite border border-gt-border text-gt-text-secondary shadow-inner select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
