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

  const cascadeColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return { bg: 'bg-[#DC2626]', text: 'text-white' };
      case 'High': return { bg: 'bg-[#FF6B00]', text: 'text-white' };
      case 'Medium': return { bg: 'bg-[#D97706]', text: 'text-white' };
      default: return { bg: 'bg-[#059669]', text: 'text-white' };
    }
  };

  const gasColor = (g: string) =>
    g === 'BF Gas' ? '#DC2626' : g === 'CO Gas' ? '#7C3AED' : '#2563EB';

  return (
    <div className="space-y-5">
      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Generators', value: generators.length, icon: <Power className="w-4 h-4" />, color: '#FF6B00' },
          { label: 'Critical Risk', value: impacts.filter(i => i.cascadeRisk === 'Critical').length, icon: <ShieldAlert className="w-4 h-4" />, color: '#DC2626' },
          { label: 'High Risk', value: impacts.filter(i => i.cascadeRisk === 'High').length, icon: <AlertTriangle className="w-4 h-4" />, color: '#FF6B00' },
          { label: 'Low-Medium Risk', value: impacts.filter(i => i.cascadeRisk === 'Low' || i.cascadeRisk === 'Medium').length, icon: <BarChart3 className="w-4 h-4" />, color: '#059669' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded" style={{ backgroundColor: `${card.color}15` }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-display font-extrabold text-[#0F172A]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-[#64748B]">Sort by:</span>
        {[
          { id: 'contribution' as const, label: 'Contribution %' },
          { id: 'deficit' as const, label: 'Deficit Impact' },
          { id: 'depletion' as const, label: 'Depletion Time' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSortBy(opt.id)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
              sortBy === opt.id
                ? 'bg-[#FF6B00] text-white shadow-sm'
                : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] border border-[#CBD5E1]'
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
          const colors = cascadeColor(impact.cascadeRisk);
          const gColor = gasColor(impact.generator.gasType);

          return (
            <div
              key={impact.generator.id}
              className="bg-white border border-[#CBD5E1] rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : impact.generator.id)}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[#FAFBFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    rank < 2 ? 'bg-[#DC2626] text-white' : rank < 4 ? 'bg-[#FF6B00] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    #{rank + 1}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-[#0F172A]">{impact.generator.name}</h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold" style={{ backgroundColor: `${gColor}15`, color: gColor }}>
                        {impact.generator.gasType}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#64748B]">
                      {impact.generator.type} · Output: {(impact.generator.capacity / 1000).toFixed(0)}k Nm³/h · {impact.generator.contributionPercent.toFixed(1)}% of total {impact.generator.gasType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase ${colors.bg} ${colors.text}`}>
                    {impact.cascadeRisk}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
                </div>
              </button>

              {/* Expanded Impact Details */}
              {isExpanded && (
                <div className="border-t border-[#E2E8F0] p-4 bg-[#FAFBFC]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingDown className="w-3.5 h-3.5 text-[#DC2626]" />
                        <span className="text-[10px] font-mono text-[#64748B] uppercase">Deficit Created</span>
                      </div>
                      <p className="text-lg font-display font-extrabold text-[#DC2626]">
                        {impact.deficitCreated > 0 ? `-${(impact.deficitCreated / 1000).toFixed(0)}k` : '0'}
                        <span className="text-[10px] font-mono font-normal text-[#64748B] ml-1">Nm³/h</span>
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span className="text-[10px] font-mono text-[#64748B] uppercase">Consumers Hit</span>
                      </div>
                      <p className="text-lg font-display font-extrabold text-[#FF6B00]">
                        {impact.consumersAffected}
                        <span className="text-[10px] font-mono font-normal text-[#64748B] ml-1">units</span>
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="text-[10px] font-mono text-[#64748B] uppercase">Holder Buffer</span>
                      </div>
                      <p className="text-lg font-display font-extrabold text-[#D97706]">
                        {impact.holderDepletionMinutes < 999 ? `${impact.holderDepletionMinutes}` : '∞'}
                        <span className="text-[10px] font-mono font-normal text-[#64748B] ml-1">min</span>
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                        <span className="text-[10px] font-mono text-[#64748B] uppercase">Cost Penalty</span>
                      </div>
                      <p className="text-lg font-display font-extrabold text-[#DC2626]">
                        ${(impact.costPenaltyPerHour).toFixed(0)}
                        <span className="text-[10px] font-mono font-normal text-[#64748B] ml-1">/hr</span>
                      </p>
                    </div>
                  </div>

                  {/* Affected Consumers List */}
                  <div className="p-3 bg-white rounded-lg border border-[#E2E8F0]">
                    <p className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-2">
                      Affected Downstream Consumers
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {impact.affectedConsumerNames.map((name, i) => (
                        <span key={i} className="px-2 py-1 bg-[#FEE2E2] text-[#DC2626] rounded text-[10px] font-mono font-bold border border-[#DC2626]/20">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contribution Bar */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-[#E2E8F0]">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-[#64748B]">Contribution to {impact.generator.gasType} Generation</span>
                      <span className="font-bold" style={{ color: gColor }}>{impact.generator.contributionPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#F1F3F5] h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${impact.generator.contributionPercent}%`, backgroundColor: gColor }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Impact Severity Matrix */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-[#FF6B00]" />
          Impact Severity Summary Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-[#E2E8F0]">
                <th className="text-left py-2.5 px-3 text-[#64748B]">Generator</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Gas Type</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Output</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Contribution</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Deficit</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Consumers</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Buffer (min)</th>
                <th className="text-center py-2.5 px-2 text-[#64748B]">Risk</th>
              </tr>
            </thead>
            <tbody>
              {impacts.map((impact, i) => {
                const colors = cascadeColor(impact.cascadeRisk);
                return (
                  <tr key={impact.generator.id} className={`border-b border-[#F1F5F9] ${i % 2 === 0 ? '' : 'bg-[#FAFBFC]'} hover:bg-[#F8F9FA]`}>
                    <td className="py-2 px-3 font-semibold text-[#0F172A]">{impact.generator.name}</td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${gasColor(impact.generator.gasType)}15`, color: gasColor(impact.generator.gasType) }}>
                        {impact.generator.gasType}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-[#0F172A]">{(impact.generator.capacity / 1000).toFixed(0)}k</td>
                    <td className="py-2 px-2 text-center font-bold" style={{ color: gasColor(impact.generator.gasType) }}>
                      {impact.generator.contributionPercent.toFixed(1)}%
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`font-bold ${impact.deficitCreated > 100000 ? 'text-[#DC2626]' : impact.deficitCreated > 0 ? 'text-[#D97706]' : 'text-[#059669]'}`}>
                        {impact.deficitCreated > 0 ? `-${(impact.deficitCreated / 1000).toFixed(0)}k` : '0'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-[#FF6B00]">{impact.consumersAffected}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`font-bold ${impact.holderDepletionMinutes < 10 ? 'text-[#DC2626]' : impact.holderDepletionMinutes < 30 ? 'text-[#D97706]' : 'text-[#059669]'}`}>
                        {impact.holderDepletionMinutes < 999 ? `${impact.holderDepletionMinutes}m` : '∞'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                        {impact.cascadeRisk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
