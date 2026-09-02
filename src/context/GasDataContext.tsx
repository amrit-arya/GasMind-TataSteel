import React, { createContext, useContext, useState, useEffect } from 'react';
import { ViewMode, GasTypeMetrics, NetworkNode, NetworkPipeline, AlertItem, SimulationParams, AIInsight } from '../types';

interface GasDataContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  gasMetrics: GasTypeMetrics[];
  nodes: NetworkNode[];
  pipelines: NetworkPipeline[];
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  insights: AIInsight[];
  applyInsight: (id: string) => void;
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerExport: () => void;
  exportNotification: string | null;
}

const initialMetrics: GasTypeMetrics[] = [
  {
    id: 'bf-gas',
    name: 'BF Gas',
    fullName: 'Blast Furnace Gas',
    generation: 850000,
    consumption: 862000,
    balance: -12000,
    status: 'Deficit',
    pressure: 14.2,
    calorificValue: 920,
    holderLevel: 68,
    holderCapacity: 100000
  },
  {
    id: 'co-gas',
    name: 'CO Gas',
    fullName: 'Coke Oven Gas',
    generation: 620000,
    consumption: 612000,
    balance: 8000,
    status: 'Surplus',
    pressure: 28.5,
    calorificValue: 4250,
    holderLevel: 84,
    holderCapacity: 80000
  },
  {
    id: 'ld-gas',
    name: 'LD Gas',
    fullName: 'Linz-Donawitz Converter Gas',
    generation: 250000,
    consumption: 253400,
    balance: -3400,
    status: 'Deficit',
    pressure: 18.0,
    calorificValue: 2100,
    holderLevel: 45,
    holderCapacity: 50000
  },
  {
    id: 'nat-gas',
    name: 'Natural Gas',
    fullName: 'Imported Natural Gas (Buffer)',
    generation: 115000,
    consumption: 115000,
    balance: 0,
    status: 'Balanced',
    pressure: 45.0,
    calorificValue: 8500,
    holderLevel: 92,
    holderCapacity: 200000
  }
];

const initialNodes: NetworkNode[] = [
  { id: 'bf1', name: 'Blast Furnace 1', type: 'generator', gasType: 'BF Gas', flowRate: 430000, pressure: 14.5, status: 'normal', x: 100, y: 150, details: 'Operating at 96% capacity. Clean gas temperature 180°C.' },
  { id: 'bf2', name: 'Blast Furnace 2', type: 'generator', gasType: 'BF Gas', flowRate: 420000, pressure: 13.9, status: 'warning', x: 100, y: 320, details: 'Minor pressure drop detected in scrubber unit.' },
  { id: 'cob1', name: 'Coke Battery 1', type: 'generator', gasType: 'CO Gas', flowRate: 310000, pressure: 29.0, status: 'normal', x: 100, y: 490, details: 'Gas booster compressor A running nominally.' },
  { id: 'cob2', name: 'Coke Battery 2', type: 'generator', gasType: 'CO Gas', flowRate: 310000, pressure: 28.0, status: 'normal', x: 100, y: 650, details: 'Gas booster compressor B running nominally.' },
  
  { id: 'holder1', name: 'BF Gasholder 100k', type: 'holder', gasType: 'BF Gas', flowRate: 0, pressure: 14.2, status: 'normal', x: 450, y: 230, details: 'Current stock: 68,000 m³ (68% capacity).' },
  { id: 'holder2', name: 'CO Gasholder 80k', type: 'holder', gasType: 'CO Gas', flowRate: 0, pressure: 28.5, status: 'normal', x: 450, y: 570, details: 'Current stock: 67,200 m³ (84% capacity).' },
  
  { id: 'powerplant', name: 'Thermal Power Plant', type: 'consumer', gasType: 'BF Gas', flowRate: 520000, pressure: 12.8, status: 'normal', x: 800, y: 120, details: 'Boilers 1-4 consuming mixed gas fuel.' },
  { id: 'hotstrip', name: 'Hot Strip Mill', type: 'consumer', gasType: 'CO Gas', flowRate: 340000, pressure: 26.5, status: 'normal', x: 800, y: 280, details: 'Reheating furnace 2 active.' },
  { id: 'sinter', name: 'Sinter Plant 3', type: 'consumer', gasType: 'BF Gas', flowRate: 240000, pressure: 13.1, status: 'normal', x: 800, y: 440, details: 'Ignition furnace running on BF/CO mix.' },
  { id: 'pellet', name: 'Pelletizing Plant', type: 'consumer', gasType: 'CO Gas', flowRate: 210000, pressure: 27.0, status: 'normal', x: 800, y: 600, details: 'Burners operating at 88% efficiency.' }
];

const initialPipelines: NetworkPipeline[] = [
  { id: 'p1', fromId: 'bf1', toId: 'holder1', flowRate: 430000, capacity: 500000, gasType: 'BF Gas', status: 'active' },
  { id: 'p2', fromId: 'bf2', toId: 'holder1', flowRate: 420000, capacity: 500000, gasType: 'BF Gas', status: 'active' },
  { id: 'p3', fromId: 'holder1', toId: 'powerplant', flowRate: 520000, capacity: 600000, gasType: 'BF Gas', status: 'active' },
  { id: 'p4', fromId: 'holder1', toId: 'sinter', flowRate: 240000, capacity: 300000, gasType: 'BF Gas', status: 'active' },
  
  { id: 'p5', fromId: 'cob1', toId: 'holder2', flowRate: 310000, capacity: 400000, gasType: 'CO Gas', status: 'active' },
  { id: 'p6', fromId: 'cob2', toId: 'holder2', flowRate: 310000, capacity: 400000, gasType: 'CO Gas', status: 'active' },
  { id: 'p7', fromId: 'holder2', toId: 'hotstrip', flowRate: 340000, capacity: 450000, gasType: 'CO Gas', status: 'active' },
  { id: 'p8', fromId: 'holder2', toId: 'pellet', flowRate: 210000, capacity: 300000, gasType: 'CO Gas', status: 'active' }
];

const initialAlerts: AlertItem[] = [
  {
    id: 'alt-101',
    timestamp: '01:14:22 UTC',
    severity: 'critical',
    title: 'BF Gas Network Deficit Alarm',
    location: 'Blast Furnace Gas Main Trunk B',
    gasType: 'BF Gas',
    description: 'Predicted -12,000 Nm³/h deficit due to unexpected dust collector bypass at BF-2.',
    acknowledged: false,
    actionRequired: 'Reroute 15,000 Nm³/h from Gasholder 100k or switch Boiler 3 to CO Gas mix.'
  },
  {
    id: 'alt-102',
    timestamp: '00:52:10 UTC',
    severity: 'warning',
    title: 'LD Gas Scrubber Pressure Fluctuating',
    location: 'Steel Melting Shop #2',
    gasType: 'LD Gas',
    description: 'Telemetry jitter on differential pressure sensor PT-804 (±2.4 kPa).',
    acknowledged: false,
    actionRequired: 'Dispatch field technician for calibration.'
  },
  {
    id: 'alt-103',
    timestamp: '00:30:00 UTC',
    severity: 'info',
    title: 'CO Gas Holder High Level Warning',
    location: 'Gasholder Compound 80k',
    gasType: 'CO Gas',
    description: 'Volume reached 84% capacity. Buffer headroom 12,800 m³ remaining.',
    acknowledged: true,
    actionRequired: 'Increase Power Plant CO firing rate if level exceeds 88%.'
  }
];

const initialInsights: AIInsight[] = [
  {
    id: 'ins-1',
    type: 'Deficit Forecast',
    severity: 'critical',
    title: 'BF Gas Deficit Warning',
    description: 'Predicted -10,000 Nm³/h deficit in BF Gas network within 2 hours due to Scheduled Maintenance on Plant B.',
    actionLabel: 'View Scenario',
    impact: 'Potential $4,500/hr in emergency natural gas purchasing.'
  },
  {
    id: 'ins-2',
    type: 'Optimization Opportunity',
    severity: 'success',
    title: 'CO Gas Rerouting Recommendation',
    description: 'Rerouting excess CO Gas to Boiler Unit 4 could reduce external natural gas consumption by 12%.',
    actionLabel: 'Apply Recommendation',
    impact: 'Estimated savings: $1,250 / shift, 4.2 tCO2e reduction.',
    applied: false
  }
];

const GasDataContext = createContext<GasDataContextType | undefined>(undefined);

export const GasDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [gasMetrics, setGasMetrics] = useState<GasTypeMetrics[]>(initialMetrics);
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [pipelines] = useState<NetworkPipeline[]>(initialPipelines);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const [simParams, setSimParams] = useState<SimulationParams>({
    bf1Shutdown: false,
    cob2Maintenance: false,
    rollingMillRampUp: 100,
    flareLossReduction: 85,
    externalGasPrice: 8.5
  });

  // Live telemetry pulse animation & random minor variations
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setGasMetrics(prev => prev.map(m => {
        const deltaGen = (Math.random() - 0.48) * 1500;
        const deltaCons = (Math.random() - 0.48) * 1400;
        const newGen = Math.round(m.generation + deltaGen);
        const newCons = Math.round(m.consumption + deltaCons);
        const newBal = newGen - newCons;
        return {
          ...m,
          generation: newGen,
          consumption: newCons,
          balance: newBal,
          status: newBal > 2000 ? 'Surplus' : newBal < -2000 ? 'Deficit' : 'Balanced'
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const applyInsight = (id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, applied: true } : i));
    setExportNotification('AI Optimization Applied: CO Gas rerouted to Boiler Unit 4 successfully.');
    setTimeout(() => setExportNotification(null), 4000);
  };

  const triggerExport = () => {
    setExportNotification('Exporting GASMIND Command Center Telemetry Report (PDF/CSV)...');
    setTimeout(() => {
      setExportNotification('Report successfully exported and saved to downloads.');
      setTimeout(() => setExportNotification(null), 4000);
    }, 1500);
  };

  return (
    <GasDataContext.Provider value={{
      currentView,
      setCurrentView,
      gasMetrics,
      nodes,
      pipelines,
      alerts,
      acknowledgeAlert,
      dismissAlert,
      insights,
      applyInsight,
      simParams,
      setSimParams,
      isLive,
      setIsLive,
      searchQuery,
      setSearchQuery,
      triggerExport,
      exportNotification
    }}>
      {children}
    </GasDataContext.Provider>
  );
};

export const useGasData = () => {
  const context = useContext(GasDataContext);
  if (!context) {
    throw new Error('useGasData must be used within a GasDataProvider');
  }
  return context;
};
