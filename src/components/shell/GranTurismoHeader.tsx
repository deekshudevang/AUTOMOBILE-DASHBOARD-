import React, { useState, useEffect } from 'react';
import {
  Car,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Wrench,
  Search,
  Database,
  HelpCircle,
  GitBranch,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useVehicleStore } from '../../hooks/useVehicleStore';
import { useUiStore } from '../../state/useUiStore';
import { WorkspaceSwitcher } from '../navigation/WorkspaceSwitcher';
import { VehicleSelectionModal } from '../gallery/VehicleSelectionModal';
import { LegacyMigrationModal } from '../modals/LegacyMigrationModal';
import { LegacyStorageMigrator } from '../../services/legacyMigration';
import { ProjectManager } from '../../projects/projectManager';
import { playToggleClick } from '../../utils/audioFeedback';

export const GranTurismoHeader: React.FC = () => {
  const {
    activeModel,
    activeFile,
    isDirty,
    engineeringMode,
    toggleEngineeringMode,
    backendStatus,
    backendDetails,
    refreshBackendHealth,
    syncBuildsWithBackend
  } = useVehicleStore();

  const {
    setCommandPaletteOpen,
    setShortcutHelpOpen,
    uiSoundsEnabled,
    toggleUiSounds
  } = useUiStore();

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [hasLocalBuilds, setHasLocalBuilds] = useState(false);
  const [activeProjectName, setActiveProjectName] = useState('Porsche GT3 RS Reference Spec');

  useEffect(() => {
    refreshBackendHealth();
    syncBuildsWithBackend();

    const local = LegacyStorageMigrator.discoverLocalBuilds();
    setHasLocalBuilds(local.length > 0);

    const interval = setInterval(() => {
      refreshBackendHealth();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const projects = ProjectManager.listProjects();
    if (projects.length > 0) {
      const latest = projects[projects.length - 1];
      setActiveProjectName(latest.meta.name);
    }
  }, []);

  const getStatusDisplay = () => {
    switch (backendStatus) {
      case 'ONLINE':
        return {
          dotClass: 'bg-gt-ok',
          text: 'ENGINE READY',
          tooltip: `FastAPI Active (${backendDetails?.database_engine || 'SQLite'} Connected, ${backendDetails?.database_latency_ms || 1.2}ms)`
        };
      case 'DEGRADED':
        return {
          dotClass: 'bg-gt-warn animate-pulse',
          text: 'DEGRADED',
          tooltip: 'Backend API Process Active, but Database Connection Degraded'
        };
      case 'CONNECTING':
        return {
          dotClass: 'bg-blue-400 animate-pulse',
          text: 'CONNECTING...',
          tooltip: 'Verifying Backend & Database Connectivity'
        };
      case 'OFFLINE':
      default:
        return {
          dotClass: 'bg-gt-error',
          text: 'OFFLINE (LOCAL)',
          tooltip: 'Authoritative Backend Offline — Running in Local Storage Mode'
        };
    }
  };

  const statusInfo = getStatusDisplay();
  const vehicleName = activeModel
    ? `${activeModel.manufacturer} ${activeModel.displayName}`
    : activeFile
    ? activeFile.replace('.json', '').replace(/_/g, ' ')
    : '50-Vehicle Fleet';

  return (
    <header role="banner" aria-label="Gran Turismo Workstation Header" className="h-12 phone-landscape:h-9 w-full hud-glass border-b border-gt-border px-3 md:px-5 phone-landscape:px-2 flex items-center justify-between shrink-0 select-none z-header text-xs phone-landscape-header">
      {/* Left: Brand Identity & Active Vehicle Switcher */}
      <div className="flex items-center gap-3 phone-landscape:gap-1.5">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-2 phone-landscape:gap-1">
          <div className="w-6 h-6 phone-landscape:w-5 phone-landscape:h-5 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-sm font-bold text-xs phone-landscape:text-[10px]" aria-hidden="true">
            A
          </div>
          <span className="font-display font-bold text-sm phone-landscape:text-xs tracking-wider text-gt-text-primary hidden sm:inline phone-landscape:inline">
            AUTOVERSE
          </span>
        </div>

        <div className="h-4 w-px bg-gt-border hidden md:block phone-landscape:hidden" />

        {/* 1-Click Vehicle Switcher Pill */}
        <button
          onClick={() => setIsVehicleModalOpen(true)}
          className="flex items-center gap-2 phone-landscape:gap-1.5 px-2.5 py-1.5 phone-landscape:py-0.5 phone-landscape:px-2 min-h-[36px] phone-landscape:min-h-[26px] rounded-md bg-gt-graphite/80 hover:bg-gt-raised border border-gt-border hover:border-gt-accent text-gt-text-primary transition-all cursor-pointer group"
          title="Click to switch vehicle (50 Schema 2.0 models available)"
          aria-label={`Switch vehicle, currently selected ${vehicleName}`}
        >
          <Car className="w-3.5 h-3.5 text-gt-accent group-hover:scale-110 transition-transform" />
          <span className="font-semibold truncate max-w-[140px] sm:max-w-[220px] phone-landscape:max-w-[120px] capitalize phone-landscape:text-[11px]">
            {vehicleName}
          </span>
          <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-gt-text-secondary border border-white/10 hidden sm:inline phone-landscape:hidden">
            50 FLEET
          </span>
        </button>

        {/* Dirty / Saved State */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] text-gt-text-secondary pl-1" aria-live="polite">
          {isDirty ? (
            <span className="flex items-center gap-1 text-gt-warn">
              <span className="w-1.5 h-1.5 rounded-full bg-gt-warn animate-pulse" />
              Unsaved
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-gt-ok" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Workstations (Atelier / Telemetry / Engineering) & Command Palette */}
      <div className="flex items-center gap-2">
        <WorkspaceSwitcher />

        {/* Global Command Palette Trigger Pill (Ctrl+K) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          title="Open Global Command Dispatcher (Ctrl+K)"
          aria-label="Open Command Search (Ctrl+K)"
          className="hidden md:flex phone-landscape:flex items-center gap-2 phone-landscape:gap-1.5 px-2.5 py-1.5 phone-landscape:py-0.5 phone-landscape:px-2 min-h-[36px] phone-landscape:min-h-[26px] rounded-md bg-gt-graphite/80 hover:bg-gt-raised border border-gt-border hover:border-slate-500 text-gt-text-secondary hover:text-gt-text-primary transition-all text-xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-gt-accent" />
          <span className="font-sans font-medium">Search</span>
          <kbd className="font-mono text-[10px] font-bold px-1 py-0.2 rounded bg-gt-obsidian border border-gt-border text-slate-400 hidden sm:inline phone-landscape:hidden">
            Ctrl+K
          </kbd>
        </button>

        {/* Mobile Command Palette Trigger Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          title="Search Views (Ctrl+K)"
          aria-label="Search Views"
          className="flex md:hidden phone-landscape:hidden items-center justify-center w-9 h-9 rounded-md bg-gt-graphite/80 hover:bg-gt-raised border border-gt-border text-gt-accent hover:text-white transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Diagnostics, Mode Toggle & Keyboard Help */}
      <div className="flex items-center gap-2 phone-landscape:gap-1.5">
        {/* Legacy Storage Migration Pill (if found) */}
        {hasLocalBuilds && (
          <button
            onClick={() => setIsMigrationModalOpen(true)}
            title="Local builds discovered in browser. Click to migrate to persistent database."
            aria-label="Migrate local builds to persistent database"
            className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-blue-950/70 border border-blue-800 text-blue-300 font-mono text-[10px]"
          >
            <Database className="w-3 h-3 text-blue-400" />
            <span>Migrate DB</span>
          </button>
        )}

        {/* Engineering Mode Switch */}
        <button
          onClick={toggleEngineeringMode}
          title="Toggle between Student Mode (guided explanations) and Advanced CAE (raw engineering parameters)"
          aria-label={`Toggle engineering mode, currently ${engineeringMode === 'student' ? 'Student' : 'Advanced CAE'}`}
          className={`px-2.5 py-1.5 phone-landscape:py-0.5 phone-landscape:px-2 min-h-[36px] phone-landscape:min-h-[26px] rounded-md flex items-center gap-1.5 font-medium transition-all border text-xs cursor-pointer ${
            engineeringMode === 'student'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-gt-graphite border-gt-border text-gt-text-primary hover:bg-gt-raised'
          }`}
        >
          {engineeringMode === 'student' ? (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline phone-landscape:hidden">Student</span>
            </>
          ) : (
            <>
              <Wrench className="w-3.5 h-3.5 text-gt-accent" />
              <span className="hidden sm:inline phone-landscape:hidden">Advanced CAE</span>
            </>
          )}
        </button>

        {/* Real Backend Engine Health Pill */}
        <button
          title={statusInfo.tooltip}
          onClick={() => refreshBackendHealth()}
          aria-label={`Backend status: ${statusInfo.text}. Click to refresh.`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 phone-landscape:py-0.5 phone-landscape:px-2 min-h-[36px] phone-landscape:min-h-[26px] rounded-md bg-gt-graphite border border-gt-border font-mono text-[10px] cursor-pointer hover:border-slate-500 transition-all select-none"
        >
          <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
          <span className="text-gt-text-primary hidden sm:inline font-semibold">
            {statusInfo.text}
          </span>
        </button>

        {/* Tactile Audio Feedback Toggle Button */}
        <button
          onClick={() => {
            toggleUiSounds();
            playToggleClick();
          }}
          title={uiSoundsEnabled ? 'Mute Mechanical Audio Feedback' : 'Enable Mechanical Audio Feedback'}
          aria-label={uiSoundsEnabled ? 'Mute mechanical sound effects' : 'Enable mechanical sound effects'}
          aria-pressed={uiSoundsEnabled}
          className={`w-9 h-9 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
            uiSoundsEnabled
              ? 'bg-gt-graphite border-gt-accent text-gt-accent shadow-sm'
              : 'bg-gt-graphite border-gt-border text-gt-text-secondary hover:text-white'
          }`}
        >
          {uiSoundsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Keyboard Shortcuts Help Button */}
        <button
          onClick={() => setShortcutHelpOpen(true)}
          title="Keyboard Shortcuts Guide (?)"
          aria-label="Open keyboard shortcuts and help guide"
          className="w-9 h-9 rounded-md bg-gt-graphite hover:bg-gt-raised border border-gt-border flex items-center justify-center text-gt-text-secondary hover:text-white transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* 50-Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      {/* Legacy Migration Modal */}
      <LegacyMigrationModal
        isOpen={isMigrationModalOpen}
        onClose={() => {
          setIsMigrationModalOpen(false);
          setHasLocalBuilds(LegacyStorageMigrator.discoverLocalBuilds().length > 0);
        }}
      />
    </header>
  );
};
