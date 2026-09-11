import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Power,
  AlertTriangle,
  Clock,
  TrendingDown,
  Zap,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';
import { ParticleCard } from '../../components/MagicBento';

interface Generator {
  id: string;
  name: string;
  type: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  capacity: number;
  totalGasTypeGeneration: number;
  contributionPercent: number;
  holderCapacity: number;
  holderLevel: number;
}

interface FailureImpact {
  generator: Generator;
  deficitCreated: number;
  consumersAffected: number;
  cascadeRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  holderDepletionMinutes: number;
  costPenaltyPerHour: number;
  affectedConsumerNames: string[];
}

const generators: Generator[] = [
  { id: 'bf-i', name: 'Blast Furnace I', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 465000, totalGasTypeGeneration: 1721200, contributionPercent: 27.0, holderCapacity: 100000, holderLevel: 68 },
  { id: 'bf-h', name: 'Blast Furnace H', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 450000, totalGasTypeGeneration: 1721200, contributionPercent: 26.1, holderCapacity: 100000, holderLevel: 68 },
  { id: 'bf-g', name: 'Blast Furnace G', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 322000, totalGasTypeGeneration: 1721200, contributionPercent: 18.7, holderCapacity: 100000, holderLevel: 68 },
  { id: 'bf-f', name: 'Blast Furnace F', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 240000, totalGasTypeGeneration: 1721200, contributionPercent: 13.9, holderCapacity: 100000, holderLevel: 68 },
  { id: 'bf-c', name: 'Blast Furnace C', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 162000, totalGasTypeGeneration: 1721200, contributionPercent: 9.4, holderCapacity: 100000, holderLevel: 68 },
  { id: 'bf-e', name: 'Blast Furnace E', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 82200, totalGasTypeGeneration: 1721200, contributionPercent: 4.8, holderCapacity: 100000, holderLevel: 68 },
  { id: 'co-new', name: 'New BPP (Batt 10, 11)', type: 'Coke Battery', gasType: 'CO Gas', capacity: 80000, totalGasTypeGeneration: 142000, contributionPercent: 56.3, holderCapacity: 80000, holderLevel: 84 },
  { id: 'co-old', name: 'Old BPP (Batt 8, 9)', type: 'Coke Battery', gasType: 'CO Gas', capacity: 62000, totalGasTypeGeneration: 142000, contributionPercent: 43.7, holderCapacity: 80000, holderLevel: 84 },
  { id: 'ld-13', name: 'LD-1 & LD-3 Converter', type: 'Converter', gasType: 'LD Gas', capacity: 85000, totalGasTypeGeneration: 150000, contributionPercent: 56.7, holderCapacity: 50000, holderLevel: 45 },
  { id: 'ld-2', name: 'LD-2 Converter', type: 'Converter', gasType: 'LD Gas', capacity: 65000, totalGasTypeGeneration: 150000, contributionPercent: 43.3, holderCapacity: 50000, holderLevel: 45 },
];

const bfConsumerNames = [
  'BF Stoves (Internal)', 'Power House #6', 'Coke Plant Heating',
  'Power House #3', 'Power House #4', 'Power House #5',
  'HSM Reheating Furnace', 'Pelletizing Plant'
];

const coConsumerNames = [
  'HSM Reheating Furnace', 'Power House #4', 'Pelletizing Plant',
  'CRM Heat Treatment', 'Sinter Plant Ignition', 'Lime & Dolomite Kilns',
  'Power House #6', 'Power House #3', 'Power House #5'
];

const ldConsumerNames = ['No direct consumers (holder buffer)'];

function computeImpact(gen: Generator): FailureImpact {
  const bfConsumption = 1736000;
  const coConsumption = 134600;

  let deficitCreated: number;
  let consumersAffected: number;
  let affectedConsumerNames: string[];

  if (gen.gasType === 'BF Gas') {
    const remainingGen = gen.totalGasTypeGeneration - gen.capacity;
    deficitCreated = bfConsumption - remainingGen;
    consumersAffected = gen.contributionPercent > 20 ? 8 : gen.contributionPercent > 10 ? 6 : 4;
    affectedConsumerNames = bfConsumerNames.slice(0, consumersAffected);
  } else if (gen.gasType === 'CO Gas') {
    const remainingGen = gen.totalGasTypeGeneration - gen.capacity;
    deficitCreated = coConsumption - remainingGen;
    consumersAffected = gen.contributionPercent > 50 ? 9 : 5;
    affectedConsumerNames = coConsumerNames.slice(0, consumersAffected);
  } else {
    deficitCreated = gen.capacity;
    consumersAffected = 0;
    affectedConsumerNames = ldConsumerNames;
  }

  const holderStock = gen.holderCapacity * (gen.holderLevel / 100);
  const holderDepletionMinutes = deficitCreated > 0 ? Math.round((holderStock / deficitCreated) * 60) : 999;

  const cascadeRisk: 'Low' | 'Medium' | 'High' | 'Critical' =
    gen.contributionPercent > 25 ? 'Critical' :
    gen.contributionPercent > 15 ? 'High' :
    gen.contributionPercent > 8 ? 'Medium' : 'Low';

  const costPenaltyPerHour = Math.max(0, deficitCreated * 0.008);

  return {
    generator: gen,
    deficitCreated: Math.max(0, deficitCreated),
    consumersAffected,
    cascadeRisk,
    holderDepletionMinutes,
    costPenaltyPerHour,
    affectedConsumerNames,
  };
}

export const CriticalityAnalysis: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'contribution' | 'deficit' | 'depletion'>('contribution');

  const impacts = useMemo(() => {
    const results = generators.map(g => computeImpact(g));
    if (sortBy === 'contribution') return results.sort((a, b) => b.generator.contributionPercent - a.generator.contributionPercent);
    if (sortBy === 'deficit') return results.sort((a, b) => b.deficitCreated - a.deficitCreated);
    return results.sort((a, b) => a.holderDepletionMinutes - b.holderDepletionMinutes);
  }, [sortBy]);

  return (
    <div className="space-y-5 text-white">
      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Generators', value: generators.length, icon: <Power className="w-4 h-4 text-white" /> },
          { label: 'Critical Risk', value: impacts.filter(i => i.cascadeRisk === 'Critical').length, icon: <ShieldAlert className="w-4 h-4 text-white" /> },
          { label: 'High Risk', value: impacts.filter(i => i.cascadeRisk === 'High').length, icon: <AlertTriangle className="w-4 h-4 text-zinc-300" /> },
          { label: 'Low-Medium Risk', value: impacts.filter(i => i.cascadeRisk === 'Low' || i.cascadeRisk === 'Medium').length, icon: <BarChart3 className="w-4 h-4 text-zinc-400" /> },
        ].map(card => (
          <ParticleCard key={card.label} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700">
                {card.icon}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-mono font-extrabold text-white">{card.value}</p>
          </ParticleCard>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-400">Sort by:</span>
        {[
          { id: 'contribution' as const, label: 'Contribution %' },
          { id: 'deficit' as const, label: 'Deficit Impact' },
          { id: 'depletion' as const, label: 'Depletion Time' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSortBy(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              sortBy === opt.id
                ? 'bg-white text-black shadow-sm'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Generator Failure Impact Cards */}
      <div className="space-y-3">
        {impacts.map((impact, rank) => {
          const isExpanded = expandedId === impact.generator.id;

          return (
            <ParticleCard
              key={impact.generator.id}
              clickEffect={true}
              glowColor="255, 255, 255"
              className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg overflow-hidden transition-all"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : impact.generator.id)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 text-white">
                    #{rank + 1}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-mono font-bold text-sm text-white">{impact.generator.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-700 text-white">
                        {impact.generator.gasType}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400">
                      {impact.generator.type} · Output: {(impact.generator.capacity / 1000).toFixed(0)}k Nm³/h · {impact.generator.contributionPercent.toFixed(1)}% of total {impact.generator.gasType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
                    {impact.cascadeRisk}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

              {/* Expanded Impact Details */}
              {isExpanded && (
                <div className="border-t border-zinc-800 p-4 bg-black/60">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingDown className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Deficit Created</span>
                      </div>
                      <p className="text-lg font-mono font-extrabold text-white">
                        {impact.deficitCreated > 0 ? `-${(impact.deficitCreated / 1000).toFixed(0)}k` : '0'}
                        <span className="text-[10px] font-mono font-normal text-zinc-400 ml-1">Nm³/h</span>
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Consumers Hit</span>
                      </div>
                      <p className="text-lg font-mono font-extrabold text-white">
                        {impact.consumersAffected}
                        <span className="text-[10px] font-mono font-normal text-zinc-400 ml-1">units</span>
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-300" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Holder Buffer</span>
                      </div>
                      <p className="text-lg font-mono font-extrabold text-white">
                        {impact.holderDepletionMinutes < 999 ? `${impact.holderDepletionMinutes}` : '∞'}
                        <span className="text-[10px] font-mono font-normal text-zinc-400 ml-1">min</span>
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Cost Penalty</span>
                      </div>
                      <p className="text-lg font-mono font-extrabold text-white">
                        ${(impact.costPenaltyPerHour).toFixed(0)}
                        <span className="text-[10px] font-mono font-normal text-zinc-400 ml-1">/hr</span>
                      </p>
                    </div>
                  </div>

                  {/* Affected Consumers List */}
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Affected Downstream Consumers
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {impact.affectedConsumerNames.map((name, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-900 text-white rounded text-[10px] font-mono font-bold border border-zinc-700">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contribution Bar */}
                  <div className="mt-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-zinc-400">Contribution to {impact.generator.gasType} Generation</span>
                      <span className="font-bold text-white">{impact.generator.contributionPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full rounded-full transition-all duration-700 bg-white"
                        style={{ width: `${impact.generator.contributionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </ParticleCard>
          );
        })}
      </div>

      {/* Impact Severity Matrix */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-white" />
          Impact Severity Summary Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2.5 px-3 text-zinc-400">Generator</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Gas Type</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Output</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Contribution</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Deficit</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Consumers</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Buffer (min)</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Risk</th>
              </tr>
            </thead>
            <tbody>
              {impacts.map((impact) => (
                <tr key={impact.generator.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
                  <td className="py-2 px-3 font-semibold text-white">{impact.generator.name}</td>
                  <td className="py-2 px-2 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-white">
                      {impact.generator.gasType}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center text-zinc-300">{(impact.generator.capacity / 1000).toFixed(0)}k</td>
                  <td className="py-2 px-2 text-center font-bold text-white">
                    {impact.generator.contributionPercent.toFixed(1)}%
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="font-bold text-white">
                      {impact.deficitCreated > 0 ? `-${(impact.deficitCreated / 1000).toFixed(0)}k` : '0'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-zinc-200">{impact.consumersAffected}</td>
                  <td className="py-2 px-2 text-center">
                    <span className="font-bold text-white">
                      {impact.holderDepletionMinutes < 999 ? `${impact.holderDepletionMinutes}m` : '∞'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-white">
                      {impact.cascadeRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParticleCard>
    </div>
  );
};

export default CriticalityAnalysis;
