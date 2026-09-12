import React, { useState } from 'react';
import { GasDataProvider, useGasData } from './context';
import { Header, Sidebar } from './components';
import { 
  OverviewDashboard, 
  GasGenerationView, 
  GasConsumptionView, 
  GasBalanceView, 
  GasNetworkView, 
  SimulationWorkspace, 
  ScenarioAnalysisView, 
  AlertsConsoleView, 
  ReportsView, 
  EventTimelineView, 
  AuditTrailView, 
  AboutView 
} from './views';

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
      case 'about':
        return <AboutView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className={`
      flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out bg-black text-white
      ${isCollapsed ? 'md:ml-[68px]' : 'md:ml-[280px]'}
    `}>
      <Header 
        onMenuClick={() => setMobileOpen(true)} 
        isCollapsed={isCollapsed}
      />
      <main className="flex-1 pt-20 md:pt-24 pb-8 px-4 md:px-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <GasDataProvider>
      <div className="flex min-h-screen bg-black font-sans selection:bg-white selection:text-black">
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
}

export default App;
