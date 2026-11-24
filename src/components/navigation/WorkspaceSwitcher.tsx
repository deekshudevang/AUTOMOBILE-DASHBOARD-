import React, { useEffect } from 'react';
import { Palette, Activity, Wrench } from 'lucide-react';
import { useUiStore, Workspace } from '../../state/useUiStore';
import { useVehicleStore, ActiveView } from '../../hooks/useVehicleStore';

interface WorkspaceConfig {
  id: Workspace;
  label: string;
  hotkey: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultView: ActiveView;
}

const WORKSPACES: WorkspaceConfig[] = [
  { id: 'atelier', label: 'Atelier', hotkey: '1', icon: Palette, defaultView: 'studio' },
  { id: 'telemetry', label: 'Telemetry', hotkey: '2', icon: Activity, defaultView: 'dynamics' },
  { id: 'engineering', label: 'Engineering', hotkey: '3', icon: Wrench, defaultView: 'cadDesigner' },
];

export const WorkspaceSwitcher: React.FC = () => {
  const { activeWorkspace, setActiveWorkspace } = useUiStore();
  const { activeView, setActiveView } = useVehicleStore();

  const handleSwitch = (ws: WorkspaceConfig) => {
    setActiveWorkspace(ws.id);
    // Switch to workspace's primary view unless already inside that workspace
    const isAtelierView = ['studio', 'library', 'dashboard', 'customizer', 'materialStudio'].includes(activeView);
    const isTelemetryView = ['dynamics', 'aeroStudio', 'results', 'comparison'].includes(activeView);
    const isEngineeringView = [
      'cadDesigner',
      'componentLibrary',
      'componentEditor',
      'assembly',
      'geometryEditor',
      'meshGenerator',
      'cfdLab',
      'reports',
      'explorer'
    ].includes(activeView);

    if (ws.id === 'atelier' && !isAtelierView) {
      setActiveView(ws.defaultView);
    } else if (ws.id === 'telemetry' && !isTelemetryView) {
      setActiveView(ws.defaultView);
    } else if (ws.id === 'engineering' && !isEngineeringView) {
      setActiveView(ws.defaultView);
    }
  };

  // Keyboard shortcut listener for 1, 2, 3 (ignoring when focused inside input fields)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

      const target = WORKSPACES.find((w) => w.hotkey === e.key);
      if (target) {
        e.preventDefault();
        handleSwitch(target);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView]);

  return (
    <div
      role="tablist"
      aria-label="Gran Turismo Workstations"
      className="inline-flex items-center p-1 rounded-lg bg-gt-graphite/90 border border-gt-border shadow-inner select-none backdrop-blur-md"
    >
      {WORKSPACES.map((ws) => {
        const Icon = ws.icon;
        const isActive = activeWorkspace === ws.id;

        return (
          <button
            key={ws.id}
            role="tab"
            id={`workspace-tab-${ws.id}`}
            aria-selected={isActive}
            aria-controls={`workspace-panel-${ws.id}`}
            aria-label={`Switch to ${ws.label} Workspace (Hotkey ${ws.hotkey})`}
            onClick={() => handleSwitch(ws)}
            title={`Switch to ${ws.label} Workspace (Hotkey ${ws.hotkey})`}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-md text-xs font-sans transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-b from-[#2A313D] to-[#1A1F26] text-white font-bold border border-white/10 shadow-sm'
                : 'text-gt-text-secondary hover:text-gt-text-primary hover:bg-white/[0.04] border border-transparent font-medium'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gt-accent' : 'text-gt-text-secondary'}`} />
            <span>{ws.label}</span>
            <span
              className={`hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded ${
                isActive ? 'bg-black/40 text-gt-text-secondary border border-white/10' : 'text-slate-500'
              }`}
            >
              {ws.hotkey}
            </span>
          </button>
        );
      })}
    </div>
  );
};
