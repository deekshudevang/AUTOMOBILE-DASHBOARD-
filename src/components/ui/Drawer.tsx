import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  position?: 'right' | 'bottom';
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
  children,
  width = 'w-96',
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (position === 'bottom') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-drawer hud-glass border-t border-gt-border p-4 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gt-border mb-3">
          <h3 className="font-display text-sm font-bold text-gt-text-primary uppercase tracking-wider">{title}</h3>
          <IconButton
            icon={<X className="w-4 h-4" />}
            aria-label="Close drawer"
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`fixed inset-y-0 right-0 z-drawer ${width} hud-glass-raised border-l border-gt-border p-4 shadow-2xl flex flex-col justify-between animate-fade-in`}>
      <div className="flex items-center justify-between pb-3 border-b border-gt-border mb-3 shrink-0">
        <h3 className="font-display text-sm font-bold text-gt-text-primary uppercase tracking-wider">{title}</h3>
        <IconButton
          icon={<X className="w-4 h-4" />}
          aria-label="Close drawer"
          size="sm"
          variant="ghost"
          onClick={onClose}
        />
      </div>
      <div className="flex-1 overflow-y-auto pr-1">{children}</div>
    </div>
  );
};
