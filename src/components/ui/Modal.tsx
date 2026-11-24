import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Focus trap & Escape dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Semi-transparent dark blur backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${maxWidthClasses} rounded-xl hud-glass-raised p-5 space-y-4 shadow-2xl z-10 animate-fade-in border border-gt-border`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gt-border pb-3">
          <div>
            <h3 id="modal-title" className="font-display text-base font-bold tracking-wide text-gt-text-primary">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gt-text-secondary mt-0.5">{description}</p>
            )}
          </div>
          <IconButton
            icon={<X className="w-4 h-4 text-gt-text-secondary hover:text-white" />}
            aria-label="Close dialog"
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
