import React from 'react';
import { Modal } from '../ui/Modal';
import { Kbd } from '../ui/Kbd';
import { useUiStore } from '../../state/useUiStore';

export const ShortcutHelpModal: React.FC = () => {
  const { isShortcutHelpOpen, setShortcutHelpOpen } = useUiStore();

  const SHORTCUT_GROUPS = [
    {
      group: 'Workspace Navigation',
      shortcuts: [
        { keys: ['1'], description: 'Switch to Atelier (Showroom & Customization)' },
        { keys: ['2'], description: 'Switch to Telemetry (Dynamics & Wind Tunnel)' },
        { keys: ['3'], description: 'Switch to Engineering (B-Rep CAD & CFD Lab)' },
        { keys: ['Ctrl', 'K'], description: 'Open Global Command Dispatcher' },
        { keys: ['?'], description: 'Toggle this keyboard shortcut guide' },
        { keys: ['Esc'], description: 'Deselect component / Close modal / Dismiss drawer' },
      ],
    },
    {
      group: 'Car Studio & 3D Controls',
      shortcuts: [
        { keys: ['W'], description: 'Toggle polygon wireframe mesh' },
        { keys: ['1', '–', '6'], description: 'Camera presets (1: 3/4 Iso, 2: Front, 3: Rear, 4: Left, 5: Right, 6: Top)' },
        { keys: ['7'], description: 'Wheel stance camera angle' },
        { keys: ['8'], description: 'Cockpit / Interior cabin inspection view' },
        { keys: ['Ctrl', 'Z'], description: 'Undo last component customization' },
        { keys: ['Ctrl', 'Y'], description: 'Redo last component customization' },
      ],
    },
    {
      group: 'Category Tabs & Sliders',
      shortcuts: [
        { keys: ['←', '→'], description: 'Cycle through customization category tabs' },
        { keys: ['Double Click'], description: 'Reset slider thumb to OEM factory default' },
      ],
    },
  ];

  return (
    <Modal
      isOpen={isShortcutHelpOpen}
      onClose={() => setShortcutHelpOpen(false)}
      title="KEYBOARD SHORTCUTS REFERENCE"
      description="High-speed navigation shortcuts for the Gran Turismo Workstation"
      maxWidth="xl"
    >
      <div className="space-y-5 text-xs select-none">
        {SHORTCUT_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-2">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-gt-accent border-b border-gt-border pb-1">
              {grp.group}
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {grp.shortcuts.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-gt-graphite/40 border border-gt-border/60"
                >
                  <span className="text-gt-text-primary">{sc.description}</span>
                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    {sc.keys.map((k, ki) => (
                      <Kbd key={ki}>{k}</Kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
