import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Box,
  Palette,
  Activity,
  Wrench,
  Car,
  DoorOpen,
  DoorClosed,
  Grid,
  FileCode,
  FolderKanban,
  Download,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { useUiStore, Workspace } from '../../state/useUiStore';
import { useVehicleStore, ActiveView } from '../../hooks/useVehicleStore';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  hotkey?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveWorkspace,
    setShortcutHelpOpen,
    toggleEngineeringGrid
  } = useUiStore();

  const {
    setActiveView,
    openAllApertures,
    closeAllApertures,
    toggleWireframe,
    allFiles,
    loadVehicleByFile
  } = useVehicleStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Command items mapping across all 24 views and actions
  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // 1. Workspaces
      {
        id: 'ws-atelier',
        category: 'Workspaces',
        title: 'Switch to Atelier (Showroom & Customization)',
        subtitle: 'Bespoke materials, paint speedforms, 3D studio',
        icon: Palette,
        hotkey: '1',
        action: () => {
          setActiveWorkspace('atelier');
          setActiveView('studio');
        }
      },
      {
        id: 'ws-telemetry',
        category: 'Workspaces',
        title: 'Switch to Telemetry (Motorsport & Dynamics)',
        subtitle: 'Suspension kinematics, aero polar balance, tire slips',
        icon: Activity,
        hotkey: '2',
        action: () => {
          setActiveWorkspace('telemetry');
          setActiveView('dynamics');
        }
      },
      {
        id: 'ws-engineering',
        category: 'Workspaces',
        title: 'Switch to Engineering (CAD & Simulation)',
        subtitle: 'B-Rep solid kernel, STEP AP214 export, OpenFOAM CFD',
        icon: Wrench,
        hotkey: '3',
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('cadDesigner');
        }
      },

      // 2. Quick Actions
      {
        id: 'act-open-all',
        category: 'Quick Actions',
        title: 'Open Everything (All Doors, Hood & Boot)',
        subtitle: 'Kinematic servo inspection mode',
        icon: DoorOpen,
        action: () => openAllApertures()
      },
      {
        id: 'act-close-all',
        category: 'Quick Actions',
        title: 'Close Everything (Reset Driving Spec)',
        subtitle: 'Closes all vehicle apertures',
        icon: DoorClosed,
        action: () => closeAllApertures()
      },
      {
        id: 'act-wireframe',
        category: 'Quick Actions',
        title: 'Toggle Wireframe Mesh',
        subtitle: 'Inspect polygon surface topology',
        icon: Grid,
        hotkey: 'W',
        action: () => toggleWireframe()
      },
      {
        id: 'act-grid',
        category: 'Quick Actions',
        title: 'Toggle Engineering Ground Grid',
        subtitle: 'Switch between reflective onyx stage and CAD grid',
        icon: Grid,
        action: () => toggleEngineeringGrid()
      },
      {
        id: 'act-help',
        category: 'Quick Actions',
        title: 'Show Keyboard Shortcuts Guide',
        subtitle: 'View full keymap reference',
        icon: HelpCircle,
        hotkey: '?',
        action: () => setShortcutHelpOpen(true)
      },

      // 3. Core Views (All 24 Mapped Views)
      {
        id: 'view-studio',
        category: 'Atelier Views',
        title: '3D Car Studio Viewport',
        subtitle: 'Real-time WebGL stage & lighting',
        icon: Box,
        action: () => {
          setActiveWorkspace('atelier');
          setActiveView('studio');
        }
      },
      {
        id: 'view-gallery',
        category: 'Atelier Views',
        title: '50-Vehicle Fleet Gallery',
        subtitle: 'OEM supercar catalog & specifications',
        icon: Car,
        action: () => {
          setActiveWorkspace('atelier');
          setActiveView('library');
        }
      },
      {
        id: 'view-customizer',
        category: 'Atelier Views',
        title: 'Vehicle Studio Customizer',
        subtitle: 'Full component inspector blade',
        icon: Palette,
        action: () => {
          setActiveWorkspace('atelier');
          setActiveView('customizer');
        }
      },
      {
        id: 'view-materials',
        category: 'Atelier Views',
        title: 'Automotive PBR Material Studio',
        subtitle: 'Inspect metallic flake & carbon shaders',
        icon: Palette,
        action: () => {
          setActiveWorkspace('atelier');
          setActiveView('materialStudio');
        }
      },
      {
        id: 'view-dynamics',
        category: 'Telemetry Views',
        title: 'Vehicle Dynamics & Load Coupling',
        subtitle: 'Chassis roll center and tire friction',
        icon: Activity,
        action: () => {
          setActiveWorkspace('telemetry');
          setActiveView('dynamics');
        }
      },
      {
        id: 'view-aero',
        category: 'Telemetry Views',
        title: 'Aerodynamics Studio & Wind Tunnel',
        subtitle: 'Downforce balance and drag coefficients',
        icon: Activity,
        action: () => {
          setActiveWorkspace('telemetry');
          setActiveView('aeroStudio');
        }
      },
      {
        id: 'view-results',
        category: 'Telemetry Views',
        title: 'Results & Simulation Polar Analyzer',
        subtitle: 'Historical aerodynamic runs and telemetry',
        icon: Activity,
        action: () => {
          setActiveWorkspace('telemetry');
          setActiveView('results');
        }
      },
      {
        id: 'view-compare',
        category: 'Telemetry Views',
        title: 'Specification Comparison Tool',
        subtitle: 'Side-by-side vehicle parameter diffs',
        icon: Activity,
        action: () => {
          setActiveWorkspace('telemetry');
          setActiveView('comparison');
        }
      },
      {
        id: 'view-cad',
        category: 'Engineering Views',
        title: 'CAD Designer & B-Rep Solid Modeler',
        subtitle: 'ISO 10303-21 STEP AP214 export',
        icon: FileCode,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('cadDesigner');
        }
      },
      {
        id: 'view-comp-lib',
        category: 'Engineering Views',
        title: 'Component Library & Parts Browser',
        subtitle: '80+ swappable vehicle components',
        icon: Wrench,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('componentLibrary');
        }
      },
      {
        id: 'view-assembly',
        category: 'Engineering Views',
        title: 'Assembly Clearance & Kinematic Gates',
        subtitle: 'Multi-part collision verification',
        icon: Wrench,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('assembly');
        }
      },
      {
        id: 'view-cfd-lab',
        category: 'Engineering Views',
        title: 'OpenFOAM CFD Wind Tunnel Lab',
        subtitle: 'Supercomputing cluster & residuals monitor',
        icon: Wrench,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('cfdLab');
        }
      },
      {
        id: 'view-mesh',
        category: 'Engineering Views',
        title: 'Mesh Generator (snappyHexMesh)',
        subtitle: 'Boundary layer prism extrusion',
        icon: Grid,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('meshGenerator');
        }
      },
      {
        id: 'view-reports',
        category: 'Engineering Views',
        title: 'Engineering Reports Generator',
        subtitle: 'Export PDF & Markdown CAE reports',
        icon: FileCode,
        action: () => {
          setActiveWorkspace('engineering');
          setActiveView('reports');
        }
      },
      {
        id: 'view-projects',
        category: 'Global Views',
        title: 'Projects & Revisions DAG',
        subtitle: 'Version-controlled project tree',
        icon: FolderKanban,
        action: () => setActiveView('projects')
      },
      {
        id: 'view-history',
        category: 'Global Views',
        title: 'Revision History & Restore Points',
        subtitle: 'Timeline of saved vehicle modifications',
        icon: FolderKanban,
        action: () => setActiveView('history')
      },
      {
        id: 'view-export',
        category: 'Global Views',
        title: 'CAD & GLB Export Center',
        subtitle: 'Batch model export utilities',
        icon: Download,
        action: () => setActiveView('export')
      },
      {
        id: 'view-settings',
        category: 'Global Views',
        title: 'System & Solver Settings',
        subtitle: 'Graphics quality and solver endpoints',
        icon: Settings,
        action: () => setActiveView('settings')
      }
    ];

    // 4. Quick Vehicle Switching (Top 10 supercars)
    allFiles.slice(0, 10).forEach((v) => {
      list.push({
        id: `veh-${v.fileName}`,
        category: 'Vehicles',
        title: `Switch Vehicle: ${v.displayName}`,
        subtitle: `${v.manufacturer} • ${v.category || 'Supercar'}`,
        icon: Car,
        action: () => {
          loadVehicleByFile(v.fileName);
          setActiveWorkspace('atelier');
          setActiveView('studio');
        }
      });
    });

    return list;
  }, [allFiles]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          setCommandPaletteOpen(false);
        } else {
          previousActiveElement.current = document.activeElement as HTMLElement;
          setCommandPaletteOpen(true);
        }
      } else if (e.key === '?' && !isCommandPaletteOpen) {
        const activeEl = document.activeElement;
        if (
          !(activeEl instanceof HTMLInputElement) &&
          !(activeEl instanceof HTMLTextAreaElement) &&
          !(activeEl instanceof HTMLElement && activeEl.isContentEditable)
        ) {
          e.preventDefault();
          setShortcutHelpOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Focus trap, focus restoration, and keyboard navigation inside palette
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isCommandPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) {
        target.action();
        setCommandPaletteOpen(false);
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-palette flex items-start justify-center pt-20 p-4 select-none animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
        aria-hidden="true"
      />

      {/* Palette Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className="relative w-full max-w-2xl rounded-xl hud-glass-raised border border-gt-border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[70vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gt-border shrink-0 bg-gt-graphite/60">
          <Search className="w-4 h-4 text-gt-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, view, or vehicle (e.g. Atelier, CFD, Porsche, Doors)..."
            className="w-full bg-transparent text-sm text-gt-text-primary placeholder:text-gt-text-secondary focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-gt-text-secondary hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gt-obsidian border border-gt-border text-gt-text-secondary">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          role="listbox"
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-gt-border/40"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-gt-text-secondary">
              No commands or views found matching "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/70 to-gt-graphite text-white border border-red-500/50 shadow-sm'
                      : 'text-gt-text-primary hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-gt-accent border-red-400 text-white shadow-sm'
                          : 'bg-gt-graphite border-gt-border text-gt-text-secondary'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{item.title}</span>
                        <span className="text-[10px] font-mono text-gt-text-secondary px-1.5 py-0.2 rounded bg-gt-obsidian border border-gt-border shrink-0">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-gt-text-secondary truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.hotkey && (
                    <kbd className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gt-obsidian border border-gt-border text-gt-text-secondary shrink-0 ml-2">
                      {item.hotkey}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2 bg-gt-obsidian border-t border-gt-border flex items-center justify-between text-[11px] font-mono text-gt-text-secondary shrink-0">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[10px]">AutoVerse Command Dispatcher</span>
        </div>
      </div>
    </div>
  );
};
