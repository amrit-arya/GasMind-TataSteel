import React, { useState } from 'react';
import {
  GitBranch,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ParticleCard } from '../../../components';

interface ConsumerDependency {
  id: string;
  name: string;
  bfGas: number;
  coGas: number;
  ldGas: number;
  natGas: number;
  total: number;
  fuelCount: number;
}

interface GasDependency {
  gasType: string;
  color: string;
  totalGeneration: number;
  consumers: { name: string; flow: number; share: number }[];
}

const consumerDeps: ConsumerDependency[] = [
  { id: 'c-ph6', name: 'Power House #6', bfGas: 300000, coGas: 3000, ldGas: 0, natGas: 0, total: 303000, fuelCount: 2 },
  { id: 'c-coke', name: 'Coke Plant Heating', bfGas: 270000, coGas: 0, ldGas: 0, natGas: 0, total: 270000, fuelCount: 1 },
  { id: 'c-ph3', name: 'Power House #3', bfGas: 190000, coGas: 1100, ldGas: 0, natGas: 0, total: 191100, fuelCount: 2 },
  { id: 'c-ph4', name: 'Power House #4', bfGas: 150000, coGas: 22000, ldGas: 0, natGas: 0, total: 172000, fuelCount: 2 },
  { id: 'c-ph5', name: 'Power House #5', bfGas: 130000, coGas: 2000, ldGas: 0, natGas: 0, total: 132000, fuelCount: 2 },
  { id: 'c-hsm', name: 'HSM Reheating Furnace', bfGas: 75000, coGas: 30000, ldGas: 0, natGas: 0, total: 105000, fuelCount: 2 },
  { id: 'c-pellet', name: 'Pelletizing Plant', bfGas: 60000, coGas: 18000, ldGas: 0, natGas: 0, total: 78000, fuelCount: 2 },
  { id: 'c-stove', name: 'BF Stoves (Internal)', bfGas: 536000, coGas: 0, ldGas: 0, natGas: 0, total: 536000, fuelCount: 1 },
  { id: 'c-crm', name: 'CRM Heat Treatment', bfGas: 0, coGas: 15000, ldGas: 0, natGas: 0, total: 15000, fuelCount: 1 },
  { id: 'c-sinter', name: 'Sinter Plant Ignition', bfGas: 0, coGas: 12000, ldGas: 0, natGas: 0, total: 12000, fuelCount: 1 },
  { id: 'c-lime', name: 'Lime & Dolomite Kilns', bfGas: 0, coGas: 10000, ldGas: 0, natGas: 0, total: 10000, fuelCount: 1 },
  { id: 'c-nat', name: 'Natural Gas Buffer Consumers', bfGas: 0, coGas: 0, ldGas: 0, natGas: 115000, total: 115000, fuelCount: 1 },
];

const gasDeps: GasDependency[] = [
  {
    gasType: 'BF Gas',
    color: '#FFFFFF',
    totalGeneration: 1721200,
    consumers: [
      { name: 'BF Stoves (Internal)', flow: 536000, share: 30.8 },
      { name: 'Power House #6', flow: 300000, share: 17.3 },
      { name: 'Coke Plant Heating', flow: 270000, share: 15.6 },
      { name: 'Power House #3', flow: 190000, share: 10.9 },
      { name: 'Power House #4', flow: 150000, share: 8.6 },
      { name: 'Power House #5', flow: 130000, share: 7.5 },
      { name: 'HSM Reheating Furnace', flow: 75000, share: 4.3 },
      { name: 'Pelletizing Plant', flow: 60000, share: 3.5 },
    ]
  },
  {
    gasType: 'CO Gas',
    color: '#E4E4E7',
    totalGeneration: 142000,
    consumers: [
      { name: 'HSM Reheating Furnace', flow: 30000, share: 22.3 },
      { name: 'Power House #4', flow: 22000, share: 16.4 },
      { name: 'Pelletizing Plant', flow: 18000, share: 13.4 },
      { name: 'CRM Heat Treatment', flow: 15000, share: 11.2 },
      { name: 'Sinter Plant Ignition', flow: 12000, share: 8.9 },
      { name: 'Lime & Dolomite Kilns', flow: 10000, share: 7.5 },
      { name: 'Power House #6', flow: 3000, share: 2.2 },
      { name: 'Power House #5', flow: 2000, share: 1.5 },
      { name: 'Power House #3', flow: 1100, share: 0.8 },
    ]
  },
  {
    gasType: 'LD Gas',
    color: '#D4D4D8',
    totalGeneration: 150000,
    consumers: [
      { name: 'No direct consumers — holder buffer only', flow: 0, share: 0 },
    ]
  },
  {
    gasType: 'Natural Gas',
    color: '#A1A1AA',
    totalGeneration: 115000,
    consumers: [
      { name: 'Natural Gas Buffer Consumers', flow: 115000, share: 100 },
    ]
  }
];

type ViewTab = 'matrix' | 'reverse' | 'heatmap';

export const DependencyAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('matrix');
  const [expandedGas, setExpandedGas] = useState<string | null>('BF Gas');

  const gasTypes = ['BF Gas', 'CO Gas', 'LD Gas', 'Nat. Gas'] as const;

  const getHeatColor = (value: number, maxValue: number) => {
    if (value === 0) return 'bg-black text-zinc-600 border border-zinc-900';
    const intensity = value / maxValue;
    if (intensity > 0.5) return 'bg-white text-black font-bold';
    if (intensity > 0.25) return 'bg-zinc-200 text-black font-bold';
    if (intensity > 0.1) return 'bg-zinc-400 text-black font-bold';
    return 'bg-zinc-700 text-white font-bold';
  };

  const maxFlow = Math.max(...consumerDeps.map(c => Math.max(c.bfGas, c.coGas, c.ldGas, c.natGas)));

  const tabBtns: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'matrix', label: 'Consumer → Gas', icon: <ArrowRight className="w-3.5 h-3.5" /> },
    { id: 'reverse', label: 'Gas → Consumer', icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: 'heatmap', label: 'Dependency Heatmap', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5 text-white">
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 w-fit">
        {tabBtns.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Consumer → Gas Matrix */}
      {activeTab === 'matrix' && (
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
            <ArrowRight className="w-4 h-4 text-white" />
            Consumer → Gas Type Dependency Matrix
          </h3>
          <p className="text-xs font-mono text-zinc-400 mb-4">
            Shows which gas types each consumer depends on. Multi-fuel consumers have higher resilience to single-gas disruptions.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-3 text-zinc-400 font-bold">Consumer</th>
                  <th className="text-center py-3 px-2 text-white font-bold">BF Gas</th>
                  <th className="text-center py-3 px-2 text-zinc-300 font-bold">CO Gas</th>
                  <th className="text-center py-3 px-2 text-zinc-300 font-bold">LD Gas</th>
                  <th className="text-center py-3 px-2 text-zinc-400 font-bold">Nat Gas</th>
                  <th className="text-center py-3 px-2 text-white font-bold">Total</th>
                  <th className="text-center py-3 px-2 text-white font-bold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {consumerDeps.map(c => (
                  <tr key={c.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
                    <td className="py-2.5 px-3 text-white font-semibold">{c.name}</td>
                    <td className="py-2.5 px-2 text-center">
                      {c.bfGas > 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-zinc-900 text-white border border-zinc-700 rounded font-bold">
                          {(c.bfGas / 1000).toFixed(0)}k
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {c.coGas > 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-zinc-900 text-zinc-200 border border-zinc-700 rounded font-bold">
                          {(c.coGas / 1000).toFixed(1)}k
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {c.ldGas > 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded font-bold">
                          {(c.ldGas / 1000).toFixed(0)}k
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {c.natGas > 0 ? (
                        <span className="inline-block px-2 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-700 rounded font-bold">
                          {(c.natGas / 1000).toFixed(0)}k
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-white">
                      {(c.total / 1000).toFixed(0)}k
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {c.fuelCount === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-white border border-zinc-600 rounded text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-white" />
                          Single-Source
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-white" />
                          Multi-Fuel
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Risk Summary */}
          <div className="mt-4 flex items-center gap-4 text-xs font-mono p-3 bg-black rounded border border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-white" />
              <span className="text-white font-bold">
                {consumerDeps.filter(c => c.fuelCount === 1).length} Single-Source Risk
              </span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-300" />
              <span className="text-zinc-300 font-bold">
                {consumerDeps.filter(c => c.fuelCount > 1).length} Multi-Fuel Resilient
              </span>
            </div>
          </div>
        </ParticleCard>
      )}

      {/* Gas → Consumer Reverse Mapping */}
      {activeTab === 'reverse' && (
        <div className="space-y-3">
          {gasDeps.map(gas => (
            <ParticleCard key={gas.gasType} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setExpandedGas(expandedGas === gas.gasType ? null : gas.gasType)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 rounded-full bg-white" />
                  <div className="text-left">
                    <h4 className="font-mono font-bold text-sm text-white">{gas.gasType}</h4>
                    <p className="text-[10px] font-mono text-zinc-400">
                      Total Generation: {(gas.totalGeneration / 1000).toFixed(1)}k Nm³/h · {gas.consumers.length} consumer{gas.consumers.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {gas.consumers.filter(c => c.flow > 0).length} active
                  </span>
                  {expandedGas === gas.gasType ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </button>

              {expandedGas === gas.gasType && (
                <div className="px-4 pb-4 border-t border-zinc-800">
                  <div className="mt-3 space-y-2">
                    {gas.consumers.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-black rounded border border-zinc-800">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono font-semibold text-white truncate">{c.name}</span>
                            <span className="text-xs font-mono font-bold text-white">
                              {c.flow > 0 ? `${(c.flow / 1000).toFixed(1)}k Nm³/h` : '—'}
                            </span>
                          </div>
                          {c.flow > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                                <div
                                  className="h-full rounded-full transition-all duration-500 bg-white"
                                  style={{ width: `${c.share}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">{c.share.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ParticleCard>
          ))}
        </div>
      )}

      {/* Dependency Heatmap */}
      {activeTab === 'heatmap' && (
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-white" />
            Dependency Intensity Heatmap
          </h3>
          <p className="text-xs font-mono text-zinc-400 mb-4">
            Darker/lighter intensity indicates higher gas dependency. Empty cells mean no dependency on that gas type.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr>
                  <th className="text-left py-3 px-3 text-zinc-400 font-bold bg-black border-b border-zinc-800">Consumer</th>
                  {gasTypes.map(g => (
                    <th key={g} className="text-center py-3 px-4 text-zinc-400 font-bold bg-black border-b border-zinc-800">{g}</th>
                  ))}
                  <th className="text-center py-3 px-3 text-zinc-400 font-bold bg-black border-b border-zinc-800">Fuels</th>
                </tr>
              </thead>
              <tbody>
                {consumerDeps.map((c, i) => {
                  const values = [c.bfGas, c.coGas, c.ldGas, c.natGas];
                  return (
                    <tr key={c.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/60">
                      <td className="py-2.5 px-3 text-white font-semibold border-r border-zinc-800">{c.name}</td>
                      {values.map((v, j) => (
                        <td key={j} className="p-1.5 text-center">
                          <div className={`py-2 px-3 rounded font-bold text-[11px] ${getHeatColor(v, maxFlow)} transition-all`}>
                            {v > 0 ? `${(v / 1000).toFixed(0)}k` : '—'}
                          </div>
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded font-bold border ${
                          c.fuelCount >= 2 ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-zinc-900 border-white text-white font-black'
                        }`}>
                          {c.fuelCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ParticleCard>
      )}
    </div>
  );
};

export default DependencyAnalysis;
