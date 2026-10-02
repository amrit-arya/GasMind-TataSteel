import React, { useState, Suspense, lazy } from 'react';
import { GasDataProvider, useGasData } from './context';
import { Header, Sidebar, ErrorBoundary, MetaSEO } from './components';

// Code-split views dynamically to minimize initial bundle size and maximize mobile performance
const OverviewDashboard = lazy(() => import('./views/monitoring/OverviewDashboard').then(m => ({ default: m.OverviewDashboard })));
const GasGenerationView = lazy(() => import('./views/monitoring/GasGenerationView').then(m => ({ default: m.GasGenerationView })));
const GasConsumptionView = lazy(() => import('./views/monitoring/GasConsumptionView').then(m => ({ default: m.GasConsumptionView })));
const GasBalanceView = lazy(() => import('./views/monitoring/GasBalanceView').then(m => ({ default: m.GasBalanceView })));
const GasNetworkView = lazy(() => import('./views/monitoring/GasNetworkView').then(m => ({ default: m.GasNetworkView })));
const SimulationWorkspace = lazy(() => import('./views/analytics/SimulationWorkspace').then(m => ({ default: m.SimulationWorkspace })));
const ScenarioAnalysisView = lazy(() => import('./views/analytics/ScenarioAnalysisView').then(m => ({ default: m.ScenarioAnalysisView })));
const AlertsConsoleView = lazy(() => import('./views/diagnostics/AlertsConsoleView').then(m => ({ default: m.AlertsConsoleView })));
const ReportsView = lazy(() => import('./views/governance/ReportsView').then(m => ({ default: m.ReportsView })));
const EventTimelineView = lazy(() => import('./views/diagnostics/EventTimelineView').then(m => ({ default: m.EventTimelineView })));
const AuditTrailView = lazy(() => import('./views/governance/AuditTrailView').then(m => ({ default: m.AuditTrailView })));
const AboutView = lazy(() => import('./views/about/AboutView').then(m => ({ default: m.AboutView })));

const ViewFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center" aria-busy="true">
    <div className="w-10 h-10 border-4 border-zinc-700 border-t-white rounded-full animate-spin mb-4" />
    <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Loading Telemetry View...</span>
  </div>
);

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
        <ErrorBoundary key={currentView}>
          <Suspense fallback={<ViewFallback />}>
            {renderView()}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

export function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ErrorBoundary fallbackTitle="GasMind System Error">
      <GasDataProvider>
        <MetaSEO />
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
    </ErrorBoundary>
  );
}

export default App;
