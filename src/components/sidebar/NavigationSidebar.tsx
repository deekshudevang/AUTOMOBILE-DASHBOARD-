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
  const { activeView, setActiveView, activeFile, activeModel, isDirty } = useVehicleStore();

  return (
    <aside className="w-64 h-screen bg-autoverse-surface border-r border-autoverse-border flex flex-col justify-between select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-autoverse-border">
          <div className="w-8 h-8 rounded bg-autoverse-elevated border border-autoverse-border flex items-center justify-center text-autoverse-cyan">
            <Car className="w-5 h-5" />
          </div>
          <div>
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
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-autoverse-elevated text-slate-100 border border-autoverse-borderLight shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-autoverse-elevated/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-autoverse-cyan' : 'text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-autoverse-overlay text-slate-300">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <div className="w-1.5 h-1.5 rounded-full bg-autoverse-cyan" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Vehicle Status Footer */}
      <div className="p-3 border-t border-autoverse-border bg-autoverse-elevated/40">
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
  );
};

