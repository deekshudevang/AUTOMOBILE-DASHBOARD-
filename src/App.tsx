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
import { useVehicleStore } from './hooks/useVehicleStore';

export const App: React.FC = () => {
  const { activeView } = useVehicleStore();

  return (
    <div className="flex w-screen h-screen bg-autoverse-bg text-slate-100 overflow-hidden font-sans">
      {/* 10-Module Navigation Sidebar */}
      <NavigationSidebar />

      {/* Main Dynamic Viewport Container */}
      <main className="flex-1 h-screen overflow-hidden relative">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'library' && <VehicleLibraryView />}
        {activeView === 'studio' && <StudioView />}
        {activeView === 'customizer' && <CustomizationPanel />}
        {activeView === 'comparison' && <ComparisonView />}
        {activeView === 'explorer' && <JsonExplorerView />}
        {activeView === 'assetManager' && <AssetManagerView />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'export' && <ExportCenterView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default App;

