import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Box,
  FileCode2,
  SlidersHorizontal,
  GitCompare,
  FolderArchive,
  History,
  Download,
  Settings,
  ChevronRight,
  Car
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { toHex32 } from '../../utils/joaat';

interface NavItem {
  id: 'dashboard' | 'library' | 'studio' | 'explorer' | 'customizer' | 'comparison' | 'assetManager' | 'history' | 'export' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'library', label: 'Vehicle Library', icon: Layers, badge: '108' },
  { id: 'studio', label: '3D Studio', icon: Box },
  { id: 'customizer', label: 'Customization', icon: SlidersHorizontal },
  { id: 'comparison', label: 'Comparison Studio', icon: GitCompare },
  { id: 'explorer', label: 'JSON Explorer', icon: FileCode2 },
  { id: 'assetManager', label: 'Asset Manager', icon: FolderArchive },
  { id: 'history', label: 'History Stack', icon: History },
  { id: 'export', label: 'Export Center', icon: Download },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const NavigationSidebar: React.FC = () => {
  const { activeView, setActiveView, activeFile, activeModel, isDirty, allFiles } = useVehicleStore();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden sm:flex flex-col justify-between w-14 md:w-64 h-screen bg-autoverse-surface border-r border-autoverse-border select-none z-30 shrink-0">
        {/* Brand Header */}
        <div>
          <div className="h-14 md:h-16 px-3 md:px-5 flex items-center justify-center md:justify-start gap-3 border-b border-autoverse-border">
            <div className="w-8 h-8 rounded bg-autoverse-elevated border border-autoverse-border flex items-center justify-center text-autoverse-cyan shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm text-slate-100">AUTOVERSE</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-autoverse-elevated border border-autoverse-border text-autoverse-cyan">
                  3D
                </span>
              </div>
              <p className="text-[11px] text-autoverse-muted tracking-tight">Automotive Configurator</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2 md:p-3 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`w-full flex items-center justify-center md:justify-between px-2 md:px-3 py-2 rounded text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-autoverse-elevated text-slate-100 border border-autoverse-borderLight shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-autoverse-cyan' : 'text-slate-400'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </span>
                    <span className="hidden md:inline">{item.label}</span>
                  </div>
                  {item.id === 'library' ? (
                    <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-overlay text-slate-300">
                      {allFiles.length}
                    </span>
                  ) : item.badge ? (
                    <span className="hidden md:inline text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-overlay text-slate-300">
                      {item.badge}
                    </span>
                  ) : null}
                  {isActive && item.id !== 'library' && !item.badge && (
                    <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-autoverse-cyan" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Vehicle Status Footer */}
        <div className="hidden md:block p-3 border-t border-autoverse-border bg-autoverse-elevated/40">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
            <span>Active Spec</span>
            {isDirty && (
              <span className="text-autoverse-amber font-mono font-medium flex items-center gap-1">
                ● Modified
              </span>
            )}
          </div>
          <div className="p-2.5 rounded bg-autoverse-elevated border border-autoverse-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 truncate" title={activeModel?.displayName || activeFile}>
                {activeModel?.displayName || activeFile.replace('.json', '')}
              </h4>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span className="truncate">{activeModel?.manufacturer || 'Vehicle'}</span>
              <span className="font-mono text-[10px] text-autoverse-cyan shrink-0">
                {activeModel ? toHex32(activeModel.hash) : '0x00'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar (<640px) */}
      <nav className="sm:hidden fixed top-0 left-0 right-0 h-12 bg-autoverse-surface/95 backdrop-blur-md border-b border-autoverse-border z-40 flex items-center justify-around px-2 text-slate-400">
        <button
          onClick={() => setActiveView('studio')}
          aria-label="3D Studio"
          className={`p-2 rounded-lg transition-colors ${activeView === 'studio' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Box className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('customizer')}
          aria-label="Customization"
          className={`p-2 rounded-lg transition-colors ${activeView === 'customizer' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('library')}
          aria-label="Vehicle Library"
          className={`p-2 rounded-lg transition-colors ${activeView === 'library' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <Layers className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('comparison')}
          aria-label="Comparison Studio"
          className={`p-2 rounded-lg transition-colors ${activeView === 'comparison' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <GitCompare className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          aria-label="Dashboard"
          className={`p-2 rounded-lg transition-colors ${activeView === 'dashboard' ? 'text-autoverse-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
};

