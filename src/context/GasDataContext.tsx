import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ViewMode, GasTypeMetrics, NetworkNode, NetworkPipeline, AlertItem, SimulationParams, AIInsight } from '../types';
import { playAlertSound, playSuccessSound, setMuted as setSoundMuted, getMuted } from '../utils/soundNotifications';

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
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const initialMetrics: GasTypeMetrics[] = [
  {
    id: 'bf-gas',
    name: 'BF Gas',
    fullName: 'Blast Furnace Gas',
    generation: 1721200,
    consumption: 1736000,
    balance: -14800,
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
    generation: 142000,
    consumption: 134600,
    balance: 7400,
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
    generation: 150000,
    consumption: 0,
    balance: 150000,
    status: 'Surplus',
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
  { id: 'bf-i', name: 'Blast Furnace I', type: 'generator', gasType: 'BF Gas', flowRate: 465000, pressure: 14.8, status: 'normal', x: 100, y: 100, details: 'Generation: 465k Nm³/h, Internal Cons: 194k Nm³/h. Net output: 271k Nm³/h.' },
  { id: 'bf-h', name: 'Blast Furnace H', type: 'generator', gasType: 'BF Gas', flowRate: 450000, pressure: 14.5, status: 'normal', x: 100, y: 200, details: 'Generation: 450k Nm³/h, Internal Cons: 115k Nm³/h. Net output: 335k Nm³/h.' },
  { id: 'bf-g', name: 'Blast Furnace G', type: 'generator', gasType: 'BF Gas', flowRate: 322000, pressure: 14.2, status: 'normal', x: 100, y: 300, details: 'Generation: 322k Nm³/h, Internal Cons: 90k Nm³/h. Net output: 232k Nm³/h.' },
  { id: 'bf-f', name: 'Blast Furnace F', type: 'generator', gasType: 'BF Gas', flowRate: 240000, pressure: 13.9, status: 'warning', x: 100, y: 400, details: 'Generation: 240k Nm³/h, Internal Cons: 80k Nm³/h.' },
  { id: 'bf-c', name: 'Blast Furnace C', type: 'generator', gasType: 'BF Gas', flowRate: 162000, pressure: 13.8, status: 'normal', x: 100, y: 500, details: 'Generation: 162k Nm³/h, Internal Cons: 32k Nm³/h.' },
  { id: 'bf-e', name: 'Blast Furnace E', type: 'generator', gasType: 'BF Gas', flowRate: 82200, pressure: 13.5, status: 'normal', x: 100, y: 600, details: 'Generation: 82.2k Nm³/h, Internal Cons: 25k Nm³/h.' },
  
  { id: 'co-old', name: 'Old BPP (Batt 8 & 9)', type: 'generator', gasType: 'CO Gas', flowRate: 62000, pressure: 29.0, status: 'normal', x: 100, y: 680, details: 'Generation: 62k Nm³/h from Batteries 8 & 9.' },
  { id: 'co-new', name: 'New BPP (Batt 10 & 11)', type: 'generator', gasType: 'CO Gas', flowRate: 80000, pressure: 28.5, status: 'normal', x: 100, y: 740, details: 'Generation: 80k Nm³/h from Batteries 10 & 11.' },
  
  { id: 'holder-bf', name: 'BF Gasholder 100k', type: 'holder', gasType: 'BF Gas', flowRate: 0, pressure: 14.2, status: 'normal', x: 450, y: 250, details: 'Current stock: 68,000 m³ (68% capacity).' },
  { id: 'holder-co', name: 'CO Gasholder 80k', type: 'holder', gasType: 'CO Gas', flowRate: 0, pressure: 28.5, status: 'normal', x: 450, y: 500, details: 'Current stock: 67,200 m³ (84% capacity).' },
  { id: 'holder-ld', name: 'LD Gasholder 50k', type: 'holder', gasType: 'LD Gas', flowRate: 0, pressure: 18.0, status: 'normal', x: 450, y: 720, details: 'Current stock: 22,500 m³ (45% capacity).' },
  
  { id: 'ph6', name: 'Power House #6', type: 'consumer', gasType: 'BF Gas', flowRate: 303000, pressure: 12.8, status: 'normal', x: 800, y: 120, details: 'BF Gas: 300,000 Nm³/h + CO Gas: 3,000 Nm³/h.' },
  { id: 'coke-plant', name: 'Coke Plant Heating', type: 'consumer', gasType: 'BF Gas', flowRate: 270000, pressure: 13.0, status: 'normal', x: 800, y: 220, details: 'BF Gas consumption for battery underfiring.' },
  { id: 'ph3', name: 'Power House #3', type: 'consumer', gasType: 'BF Gas', flowRate: 191100, pressure: 12.9, status: 'normal', x: 800, y: 320, details: 'BF Gas: 190,000 Nm³/h + CO Gas: 1,100 Nm³/h.' },
  { id: 'ph4', name: 'Power House #4', type: 'consumer', gasType: 'BF Gas', flowRate: 172000, pressure: 13.1, status: 'normal', x: 800, y: 420, details: 'BF Gas: 150,000 Nm³/h + CO Gas: 22,000 Nm³/h.' },
  { id: 'ph5', name: 'Power House #5', type: 'consumer', gasType: 'BF Gas', flowRate: 132000, pressure: 13.0, status: 'normal', x: 800, y: 520, details: 'BF Gas: 130,000 Nm³/h + CO Gas: 2,000 Nm³/h.' },
  { id: 'hsm', name: 'HSM Mill', type: 'consumer', gasType: 'CO Gas', flowRate: 105000, pressure: 26.5, status: 'normal', x: 800, y: 620, details: 'BF Gas: 75,000 Nm³/h + CO Gas: 30,000 Nm³/h.' },
  { id: 'pellet', name: 'Pelletizing Plant', type: 'consumer', gasType: 'CO Gas', flowRate: 78000, pressure: 27.0, status: 'normal', x: 800, y: 720, details: 'BF Gas: 60,000 Nm³/h + CO Gas: 18,000 Nm³/h.' }
];

const initialPipelines: NetworkPipeline[] = [
  { id: 'p1', fromId: 'bf-i', toId: 'holder-bf', flowRate: 465000, capacity: 500000, gasType: 'BF Gas', status: 'active' },
  { id: 'p2', fromId: 'bf-h', toId: 'holder-bf', flowRate: 450000, capacity: 500000, gasType: 'BF Gas', status: 'active' },
  { id: 'p3', fromId: 'bf-g', toId: 'holder-bf', flowRate: 322000, capacity: 400000, gasType: 'BF Gas', status: 'active' },
  { id: 'p4', fromId: 'holder-bf', toId: 'ph6', flowRate: 300000, capacity: 350000, gasType: 'BF Gas', status: 'active' },
  { id: 'p5', fromId: 'holder-bf', toId: 'coke-plant', flowRate: 270000, capacity: 300000, gasType: 'BF Gas', status: 'active' },
  { id: 'p6', fromId: 'co-old', toId: 'holder-co', flowRate: 62000, capacity: 100000, gasType: 'CO Gas', status: 'active' },
  { id: 'p7', fromId: 'co-new', toId: 'holder-co', flowRate: 80000, capacity: 120000, gasType: 'CO Gas', status: 'active' },
  { id: 'p8', fromId: 'holder-co', toId: 'hsm', flowRate: 30000, capacity: 50000, gasType: 'CO Gas', status: 'active' },
  { id: 'p9', fromId: 'holder-co', toId: 'ph4', flowRate: 22000, capacity: 35000, gasType: 'CO Gas', status: 'active' }
];

const initialAlerts: AlertItem[] = [
  {
    id: 'alt-101',
    timestamp: '01:14:22 UTC',
    severity: 'critical',
    title: 'BF Gas Network Deficit Alarm (-14,800 Nm³/h)',
    location: 'Blast Furnace Gas Main Trunk',
    gasType: 'BF Gas',
    description: 'Total BF Gas generation (1,721,200 Nm³/h) is below total plant demand (1,736,000 Nm³/h). Deficit: -14,800 Nm³/h.',
    acknowledged: false,
    actionRequired: 'Reroute CO Gas surplus (+7,400 Nm³/h) to boilers or draw from 100k BF Gasholder.'
  },
  {
    id: 'alt-102',
    timestamp: '00:52:10 UTC',
    severity: 'warning',
    title: 'LD Gas Generation Surplus (+150,000 Nm³/h)',
    location: 'Steel Melting Shop (LD-1, LD-2, LD-3)',
    gasType: 'LD Gas',
    description: '150,000 Nm³/h available LD Gas generation. 0 Nm³/h direct line consumption. Holder buffering active.',
    acknowledged: false,
    actionRequired: 'Review recovery system to maximize power plant co-firing.'
  },
  {
    id: 'alt-103',
    timestamp: '00:30:00 UTC',
    severity: 'info',
    title: 'CO Gas Holder High Buffer Warning',
    location: 'Gasholder Compound 80k',
    gasType: 'CO Gas',
    description: 'Volume reached 84% capacity (+7,400 Nm³/h net surplus). Headroom 12,800 m³ remaining.',
    acknowledged: true,
    actionRequired: 'Increase Power House #4 CO gas firing rate.'
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

// Helper: generate timestamp string
function nowTimestamp(): string {
  const d = new Date();
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
}

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
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  const [simParams, setSimParams] = useState<SimulationParams>({
    bf1Shutdown: false,
    cob2Maintenance: false,
    rollingMillRampUp: 100,
    flareLossReduction: 85,
    externalGasPrice: 8.5
  });

  // Track which auto-alert IDs have already been triggered to prevent duplicate sounds
  const triggeredAlertIds = useRef<Set<string>>(new Set(['alt-101', 'alt-102', 'alt-103']));

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    setSoundMuted(!enabled);
  }, []);

  // Auto-alert engine: monitors gasMetrics and generates alerts based on real conditions
  useEffect(() => {
    if (!isLive) return;

    const bf = gasMetrics.find(m => m.id === 'bf-gas');
    const co = gasMetrics.find(m => m.id === 'co-gas');
    const ld = gasMetrics.find(m => m.id === 'ld-gas');
    if (!bf || !co || !ld) return;

    const newAlerts: AlertItem[] = [];

    // CRITICAL: BF Gas deficit (consumption > generation)
    if (bf.balance < -5000) {
      const alertId = `auto-bf-deficit-${Math.abs(Math.round(bf.balance / 5000) * 5000)}`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'critical',
          title: `BF Gas Deficit Alarm (${(bf.balance / 1000).toFixed(1)}k Nm³/h)`,
          location: 'Blast Furnace Gas Main Trunk',
          gasType: 'BF Gas',
          description: `BF Gas generation (${(bf.generation / 1000).toFixed(0)}k) below demand (${(bf.consumption / 1000).toFixed(0)}k). Deficit: ${(bf.balance / 1000).toFixed(1)}k Nm³/h. Gasholder draw-down active.`,
          acknowledged: false,
          actionRequired: 'Draw from BF Gasholder buffer or reroute CO Gas surplus to dual-fuel consumers.'
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // CRITICAL: Holder level critically low (< 30%)
    if (bf.holderLevel < 30) {
      const alertId = `auto-bf-holder-crit-${Math.round(bf.holderLevel / 5) * 5}`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'critical',
          title: `BF Gasholder Critical Low (${bf.holderLevel}%)`,
          location: 'BF Gasholder 100k m³',
          gasType: 'BF Gas',
          description: `BF Gasholder dropped to ${bf.holderLevel}% capacity. Buffer nearing exhaustion — emergency protocols may be required.`,
          acknowledged: false,
          actionRequired: 'Reduce non-essential BF Gas consumers or activate emergency natural gas supply.'
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // WARNING: CO Holder approaching capacity (> 85%)
    if (co.holderLevel > 85) {
      const alertId = `auto-co-holder-high-${Math.round(co.holderLevel / 5) * 5}`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'warning',
          title: `CO Gasholder High Level (${co.holderLevel}%)`,
          location: 'CO Gasholder 80k m³',
          gasType: 'CO Gas',
          description: `CO Gasholder at ${co.holderLevel}% — approaching overflow threshold. Surplus: +${(co.balance / 1000).toFixed(1)}k Nm³/h.`,
          acknowledged: false,
          actionRequired: 'Increase PH#4 CO Gas firing rate or divert to HSM reheating furnace.'
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // WARNING: LD Gas utilization at 0%
    if (ld.consumption === 0 && ld.generation > 100000) {
      const alertId = `auto-ld-underutil`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'warning',
          title: `LD Gas Under-Utilization (${(ld.generation / 1000).toFixed(0)}k Nm³/h wasted)`,
          location: 'Steel Melting Shop',
          gasType: 'LD Gas',
          description: `LD Gas generation at ${(ld.generation / 1000).toFixed(0)}k Nm³/h but 0 Nm³/h direct consumption. Cross-firing potential untapped.`,
          acknowledged: false,
          actionRequired: 'Review LD Gas recovery pipeline for co-firing opportunities.'
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // WARNING: High pressure deviation
    if (bf.pressure > 16.0 || bf.pressure < 12.0) {
      const alertId = `auto-bf-pressure-${Math.round(bf.pressure)}`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'warning',
          title: `BF Gas Pressure ${bf.pressure > 16.0 ? 'High' : 'Low'} (${bf.pressure.toFixed(1)} kPa)`,
          location: 'BF Gas Network Main Line',
          gasType: 'BF Gas',
          description: `BF Gas pressure at ${bf.pressure.toFixed(1)} kPa — ${bf.pressure > 16.0 ? 'above' : 'below'} nominal range (12.5–15.5 kPa).`,
          acknowledged: false,
          actionRequired: `${bf.pressure > 16.0 ? 'Open safety relief valves or increase consumer demand.' : 'Check for pipeline leaks or reduce consumer draw.'}`
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // INFO: CO Gas balance surplus healthy
    if (co.balance > 10000 && co.balance < 15000) {
      const alertId = `auto-co-optimal`;
      if (!triggeredAlertIds.current.has(alertId)) {
        newAlerts.push({
          id: alertId,
          timestamp: nowTimestamp(),
          severity: 'info',
          title: `CO Gas Operating in Optimal Surplus (+${(co.balance / 1000).toFixed(1)}k Nm³/h)`,
          location: 'Coke Oven Gas Network',
          gasType: 'CO Gas',
          description: `CO Gas network is operating with a healthy surplus margin. No action required.`,
          acknowledged: false
        });
        triggeredAlertIds.current.add(alertId);
      }
    }

    // Add new alerts and trigger sounds
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev]);

      // Play sound for the highest severity alert
      const hasCritical = newAlerts.some(a => a.severity === 'critical');
      const hasWarning = newAlerts.some(a => a.severity === 'warning');

      if (hasCritical) {
        playAlertSound('critical');
      } else if (hasWarning) {
        playAlertSound('warning');
      } else {
        playAlertSound('info');
      }
    }
  }, [gasMetrics, isLive]);

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
    playSuccessSound();
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const applyInsight = (id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, applied: true } : i));
    setExportNotification('AI Optimization Applied: CO Gas rerouted to Boiler Unit 4 successfully.');
    playSuccessSound();
    setTimeout(() => setExportNotification(null), 4000);
  };

  const triggerExport = () => {
    setExportNotification('Exporting GASMIND Command Center Telemetry Report (PDF/CSV)...');
    playInfoAlert();
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
      exportNotification,
      soundEnabled,
      setSoundEnabled
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

// Re-export for direct use
function playInfoAlert() {
  playAlertSound('info');
}
