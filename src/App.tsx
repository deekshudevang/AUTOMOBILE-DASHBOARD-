import React from 'react';
import { NavigationSidebar } from './components/sidebar/NavigationSidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { VehicleLibraryView } from './components/library/VehicleLibraryView';
import { StudioView } from './components/studio/StudioView';
import { CustomizationPanel } from './components/customizer/CustomizationPanel';
import { ComparisonView } from './components/comparison/ComparisonView';
import { JsonExplorerView } from './components/explorer/JsonExplorerView';
import { AssetManagerView } from './components/assetManager/AssetManagerView';
import { HistoryView } from './components/history/HistoryView';
import { ExportCenterView } from './components/export/ExportCenterView';
import { SettingsView } from './components/settings/SettingsView';

// AutoVerse Modular Engineering Views
import { ProjectsView } from './components/views/ProjectsView';
import { ComponentLibraryView } from './components/views/ComponentLibraryView';
import { ComponentEditorView } from './components/views/ComponentEditorView';
import { AssemblyView } from './components/views/AssemblyView';
import { CadDesignerView } from './components/views/CadDesignerView';
import { GeometryEditorView } from './components/views/GeometryEditorView';
import { MaterialStudioView } from './components/views/MaterialStudioView';
import { AeroStudioView } from './components/views/AeroStudioView';
import { MeshGeneratorView } from './components/views/MeshGeneratorView';
import { CfdLabView } from './components/views/CfdLabView';
import { VehicleDynamicsView } from './components/views/VehicleDynamicsView';
import { ResultsView } from './components/views/ResultsView';
import { ReportsView } from './components/views/ReportsView';
import { LearningCentreView } from './components/views/LearningCentreView';

import { useVehicleStore } from './hooks/useVehicleStore';

export const App: React.FC = () => {
  const { activeView } = useVehicleStore();

  return (
    <div className="flex w-screen h-screen bg-autoverse-bg text-slate-100 overflow-hidden font-sans">
      {/* 19-Module Navigation Sidebar with Student/Advanced Mode Switch */}
      <NavigationSidebar />

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 h-screen overflow-hidden relative">
        {/* Workspace Modules */}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'library' && <VehicleLibraryView />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'studio' && <StudioView />}

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

        {/* Legacy / Direct Tool Views */}
        {activeView === 'customizer' && <CustomizationPanel />}
        {activeView === 'comparison' && <ComparisonView />}
        {activeView === 'explorer' && <JsonExplorerView />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'export' && <ExportCenterView />}
      </main>
    </div>
  );
};

export default App;
