import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  'aria-label': ariaLabel,
}) => {
  const generatedId = id || `toggle-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className="flex items-center justify-between gap-3 select-none">
      {(label || description) && (
        <label htmlFor={generatedId} className="flex flex-col cursor-pointer">
          {label && <span className="text-xs font-medium text-gt-text-primary">{label}</span>}
          {description && <span className="text-[11px] text-gt-text-secondary">{description}</span>}
        </label>
      )}

      <button
        id={generatedId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-gt-border transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gt-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gt-obsidian disabled:opacity-40 disabled:cursor-not-allowed ${
          checked ? 'bg-gt-accent border-red-500' : 'bg-gt-graphite border-gt-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[3px] ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
