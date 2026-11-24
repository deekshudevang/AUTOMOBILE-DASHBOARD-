import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'iconPosition'> {
  'aria-label': string; // Required for accessibility (WCAG AA)
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = '', size = 'md', ...props }, ref) => {
    const iconSizeClasses = {
      sm: 'w-8 h-8 p-0',
      md: 'w-10 h-10 p-0',
      lg: 'w-12 h-12 p-0',
    }[size];

    return (
      <Button
        ref={ref}
        size={size}
        className={`!px-0 ${iconSizeClasses} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
