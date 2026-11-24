import React, { Suspense, lazy } from 'react';
import { NavigationSidebar } from './components/sidebar/NavigationSidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { VehicleLibraryView } from './components/library/VehicleLibraryView';
import { StudioView } from './components/studio/StudioView';
import { GranTurismoHeader } from './components/shell/GranTurismoHeader';
import { CommandPalette } from './components/navigation/CommandPalette';
import { ShortcutHelpModal } from './components/navigation/ShortcutHelpModal';
import { EngineeringModuleLoader } from './components/shell/EngineeringModuleLoader';
import { useVehicleStore } from './hooks/useVehicleStore';

// AutoVerse Dynamic Code-Splitting: Lazy-loaded CAD, CFD, Simulation, and Tooling Views
const ProjectsView = lazy(() => import('./components/views/ProjectsView').then(m => ({ default: m.ProjectsView })));
const ComponentLibraryView = lazy(() => import('./components/views/ComponentLibraryView').then(m => ({ default: m.ComponentLibraryView })));
const ComponentEditorView = lazy(() => import('./components/views/ComponentEditorView').then(m => ({ default: m.ComponentEditorView })));
const AssemblyView = lazy(() => import('./components/views/AssemblyView').then(m => ({ default: m.AssemblyView })));
const CadDesignerView = lazy(() => import('./components/views/CadDesignerView').then(m => ({ default: m.CadDesignerView })));
const GeometryEditorView = lazy(() => import('./components/views/GeometryEditorView').then(m => ({ default: m.GeometryEditorView })));
const MaterialStudioView = lazy(() => import('./components/views/MaterialStudioView').then(m => ({ default: m.MaterialStudioView })));
const AeroStudioView = lazy(() => import('./components/views/AeroStudioView').then(m => ({ default: m.AeroStudioView })));
const MeshGeneratorView = lazy(() => import('./components/views/MeshGeneratorView').then(m => ({ default: m.MeshGeneratorView })));
const CfdLabView = lazy(() => import('./components/views/CfdLabView').then(m => ({ default: m.CfdLabView })));
const VehicleDynamicsView = lazy(() => import('./components/views/VehicleDynamicsView').then(m => ({ default: m.VehicleDynamicsView })));
const ResultsView = lazy(() => import('./components/views/ResultsView').then(m => ({ default: m.ResultsView })));
const ReportsView = lazy(() => import('./components/views/ReportsView').then(m => ({ default: m.ReportsView })));
const LearningCentreView = lazy(() => import('./components/views/LearningCentreView').then(m => ({ default: m.LearningCentreView })));
const AssetManagerView = lazy(() => import('./components/assetManager/AssetManagerView').then(m => ({ default: m.AssetManagerView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));

// Specialized / Direct Tool Views
const CustomizationPanel = lazy(() => import('./components/customizer/CustomizationPanel').then(m => ({ default: m.CustomizationPanel })));
const ComparisonView = lazy(() => import('./components/comparison/ComparisonView').then(m => ({ default: m.ComparisonView })));
const JsonExplorerView = lazy(() => import('./components/explorer/JsonExplorerView').then(m => ({ default: m.JsonExplorerView })));
const HistoryView = lazy(() => import('./components/history/HistoryView').then(m => ({ default: m.HistoryView })));
const ExportCenterView = lazy(() => import('./components/export/ExportCenterView').then(m => ({ default: m.ExportCenterView })));

export const App: React.FC = () => {
  const { activeView } = useVehicleStore();

  return (
    <div className="flex w-full h-[100dvh] bg-gt-obsidian text-gt-text-primary overflow-hidden font-sans">
      {/* 24-Module Navigation Rail with Workspace Filters & Quick Search */}
      <NavigationSidebar />

      {/* Main Dynamic Viewport Container with Merged Gran Turismo Header */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative">
        <GranTurismoHeader />

        <main className="flex-1 overflow-hidden relative">
          <Suspense fallback={<EngineeringModuleLoader label="Loading Module" moduleName={activeView} />}>
            {/* Core Workstation Views */}
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'library' && <VehicleLibraryView />}
            {activeView === 'studio' && <StudioView />}

            {/* Project Management */}
            {activeView === 'projects' && <ProjectsView />}

            {/* CAD & Components Modules */}
            {activeView === 'componentLibrary' && <ComponentLibraryView />}
            {activeView === 'componentEditor' && <ComponentEditorView />}
            {activeView === 'assembly' && <AssemblyView />}
            {activeView === 'cadDesigner' && <CadDesignerView />}
            {activeView === 'geometryEditor' && <GeometryEditorView />}
            {activeView === 'materialStudio' && <MaterialStudioView />}

            {/* Simulation & Aero Modules */}
            {activeView === 'aeroStudio' && <AeroStudioView />}
            {activeView === 'meshGenerator' && <MeshGeneratorView />}
            {activeView === 'cfdLab' && <CfdLabView />}
            {activeView === 'dynamics' && <VehicleDynamicsView />}
            {activeView === 'results' && <ResultsView />}

            {/* Knowledge & System Modules */}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'learning' && <LearningCentreView />}
            {activeView === 'assetManager' && <AssetManagerView />}
            {activeView === 'settings' && <SettingsView />}

            {/* Specialized / Direct Tool Views */}
            {activeView === 'customizer' && <CustomizationPanel />}
            {activeView === 'comparison' && <ComparisonView />}
            {activeView === 'explorer' && <JsonExplorerView />}
            {activeView === 'history' && <HistoryView />}
            {activeView === 'export' && <ExportCenterView />}
          </Suspense>
        </main>
      </div>

      {/* Global Command Dispatcher (Ctrl+K) */}
      <CommandPalette />

      {/* Global Keyboard Shortcut Help Modal (?) */}
      <ShortcutHelpModal />
    </div>
  );
};

export default App;
