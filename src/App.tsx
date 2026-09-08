import React, { useState } from 'react';
import { GasDataProvider, useGasData } from './context/GasDataContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './views/OverviewDashboard';
import { GasGenerationView } from './views/GasGenerationView';
import { GasConsumptionView } from './views/GasConsumptionView';
import { GasBalanceView } from './views/GasBalanceView';
import { GasNetworkView } from './views/GasNetworkView';
import { SimulationWorkspace } from './views/SimulationWorkspace';
import { ScenarioAnalysisView } from './views/ScenarioAnalysisView';
import { AlertsConsoleView } from './views/AlertsConsoleView';
import { ReportsView } from './views/ReportsView';
import { EventTimelineView } from './views/EventTimelineView';
import { AuditTrailView } from './views/AuditTrailView';

const MainContent: React.FC<{ 
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}> = ({ setMobileOpen, isCollapsed, setIsCollapsed }) => {
  const { currentView } = useGasData();

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewDashboard />;
      case 'generation':
        return <GasGenerationView />;
      case 'consumption':
        return <GasConsumptionView />;
      case 'balance':
        return <GasBalanceView />;
      case 'network':
        return <GasNetworkView />;
      case 'simulation':
        return <SimulationWorkspace />;
      case 'scenario':
        return <ScenarioAnalysisView />;
      case 'alerts':
        return <AlertsConsoleView />;
      case 'reports':
        return <ReportsView />;
      case 'timeline':
        return <EventTimelineView />;
      case 'audit':
        return <AuditTrailView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className={`
      flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
      ${isCollapsed ? 'md:ml-[68px]' : 'md:ml-[280px]'}
    `}>
      <Header 
        setMobileOpen={setMobileOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      <main className="flex-1 mt-16 p-4 md:p-6 bg-[#F8F9FA] overflow-x-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <GasDataProvider>
      <div className="flex h-full min-h-screen bg-[#F8F9FA] text-[#0F172A]">
        <Sidebar 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
        <MainContent 
          setMobileOpen={setMobileOpen} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
        />
      </div>
    </GasDataProvider>
  );
};

export default App;
