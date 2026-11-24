import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Sizing: control heights 32/40/48 with 44px minimum touch target via invisible padding
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px]',
      md: 'h-10 px-4 text-xs gap-2 min-h-[44px] min-w-[44px] sm:min-h-[40px]',
      lg: 'h-12 px-5 text-sm gap-2.5 min-h-[48px]',
    }[size];

    // Variants: Gran Turismo Workstation styling
    const variantClasses = {
      primary:
        'bg-gradient-to-b from-[#EF4444] to-[#B91C1C] hover:from-[#F87171] hover:to-[#DC2626] text-white border border-[#F87171]/40 shadow-md shadow-red-950/40 font-bold',
      secondary:
        'bg-gradient-to-b from-[#1E242C] to-[#12161D] hover:from-[#28313D] hover:to-[#181D26] text-gt-text-primary border border-gt-border hover:border-slate-500/50 shadow-sm font-medium',
      ghost:
        'bg-transparent hover:bg-gt-raised/60 text-gt-text-secondary hover:text-gt-text-primary border border-transparent font-medium',
      danger:
        'bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/80 font-semibold',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-md font-sans tracking-tight transition-all duration-150 select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gt-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gt-obsidian disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!isLoading && icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
