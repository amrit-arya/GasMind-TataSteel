import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  GitCompareArrows,
  Settings2,
  Power,
  ArrowRight,
  Zap,
  DollarSign,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ParticleCard } from '../../components/MagicBento';

interface GeneratorConfig {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  baseCapacity: number;
}

interface ScenarioConfig {
  label: string;
  globalReduction: number;
  shutdownGenerators: string[];
}

interface ScenarioResult {
  bfGeneration: number;
  bfConsumption: number;
  bfBalance: number;
  coGeneration: number;
  coConsumption: number;
  coBalance: number;
  ldGeneration: number;
  ldConsumption: number;
  ldBalance: number;
  totalDeficit: number;
  consumersAffected: number;
  costPenalty: number;
  holderBufferMinutes: number;
}

interface ConsumerImpactDiff {
  name: string;
  gasType: string;
  requiredFlow: number;
  scenarioAStatus: string;
  scenarioALoad: number;
  scenarioBStatus: string;
  scenarioBLoad: number;
}

const allGenerators: GeneratorConfig[] = [
  { id: 'bf-i', name: 'Blast Furnace I', gasType: 'BF Gas', baseCapacity: 465000 },
  { id: 'bf-h', name: 'Blast Furnace H', gasType: 'BF Gas', baseCapacity: 450000 },
  { id: 'bf-g', name: 'Blast Furnace G', gasType: 'BF Gas', baseCapacity: 322000 },
  { id: 'bf-f', name: 'Blast Furnace F', gasType: 'BF Gas', baseCapacity: 240000 },
  { id: 'bf-c', name: 'Blast Furnace C', gasType: 'BF Gas', baseCapacity: 162000 },
  { id: 'bf-e', name: 'Blast Furnace E', gasType: 'BF Gas', baseCapacity: 82200 },
  { id: 'co-new', name: 'New BPP (Batt 10, 11)', gasType: 'CO Gas', baseCapacity: 80000 },
  { id: 'co-old', name: 'Old BPP (Batt 8, 9)', gasType: 'CO Gas', baseCapacity: 62000 },
  { id: 'ld-13', name: 'LD-1 & LD-3 Converter', gasType: 'LD Gas', baseCapacity: 85000 },
  { id: 'ld-2', name: 'LD-2 Converter', gasType: 'LD Gas', baseCapacity: 65000 },
];

const BF_CONSUMPTION = 1736000;
const CO_CONSUMPTION = 134600;
const LD_CONSUMPTION = 0;

const consumers = [
  { name: 'Power House #6', gasType: 'BF Gas', requiredFlow: 303000 },
  { name: 'Coke Plant Heating', gasType: 'BF Gas', requiredFlow: 270000 },
  { name: 'Power House #3', gasType: 'BF Gas', requiredFlow: 191100 },
  { name: 'Power House #4', gasType: 'BF/CO Gas', requiredFlow: 172000 },
  { name: 'Power House #5', gasType: 'BF Gas', requiredFlow: 132000 },
  { name: 'HSM Reheating Furnace', gasType: 'BF/CO Gas', requiredFlow: 105000 },
  { name: 'Pelletizing Plant', gasType: 'BF/CO Gas', requiredFlow: 78000 },
  { name: 'BF Stoves (Internal)', gasType: 'BF Gas', requiredFlow: 536000 },
];

function computeScenario(config: ScenarioConfig): ScenarioResult {
  const reductionFactor = 1 - (config.globalReduction / 100);

  let bfGen = 0, coGen = 0, ldGen = 0;
  allGenerators.forEach(g => {
    const isShutdown = config.shutdownGenerators.includes(g.id);
    const output = isShutdown ? 0 : g.baseCapacity * reductionFactor;
    if (g.gasType === 'BF Gas') bfGen += output;
    else if (g.gasType === 'CO Gas') coGen += output;
    else ldGen += output;
  });

  const bfBalance = bfGen - BF_CONSUMPTION;
  const coBalance = coGen - CO_CONSUMPTION;
  const ldBalance = ldGen - LD_CONSUMPTION;

  const totalDeficit = Math.abs(Math.min(0, bfBalance)) + Math.abs(Math.min(0, coBalance));

  const bfRatio = Math.min(1, bfGen / BF_CONSUMPTION);
  const coRatio = Math.min(1, coGen / CO_CONSUMPTION);
  const consumersAffected = (bfRatio < 0.95 ? 6 : 0) + (coRatio < 0.95 ? 3 : 0);

  const costPenalty = totalDeficit * 0.008;
  const holderStock = 100000 * 0.68 + 80000 * 0.84;
  const holderBufferMinutes = totalDeficit > 0 ? Math.round((holderStock / totalDeficit) * 60) : 999;

  return {
    bfGeneration: Math.round(bfGen),
    bfConsumption: BF_CONSUMPTION,
    bfBalance: Math.round(bfBalance),
    coGeneration: Math.round(coGen),
    coConsumption: CO_CONSUMPTION,
    coBalance: Math.round(coBalance),
    ldGeneration: Math.round(ldGen),
    ldConsumption: LD_CONSUMPTION,
    ldBalance: Math.round(ldBalance),
    totalDeficit: Math.round(totalDeficit),
    consumersAffected,
    costPenalty: Math.round(costPenalty),
    holderBufferMinutes,
  };
}

function getConsumerStatus(bfRatio: number, coRatio: number, consumer: typeof consumers[0]): { status: string; load: number } {
  let ratio: number;
  if (consumer.gasType === 'BF Gas') {
    ratio = bfRatio;
  } else if (consumer.gasType === 'BF/CO Gas') {
    ratio = (bfRatio * 0.7 + coRatio * 0.3);
  } else {
    ratio = coRatio;
  }
  const load = Math.round(Math.min(100, ratio * 100));
  const status = load >= 95 ? 'Nominal' : load >= 60 ? 'Throttled' : load >= 30 ? 'Degraded' : 'Critical';
  return { status, load };
}

const presetScenarios: { label: string; reduction: number; shutdowns: string[] }[] = [
  { label: 'Normal Operation', reduction: 0, shutdowns: [] },
  { label: '10% Reduction', reduction: 10, shutdowns: [] },
  { label: '15% Reduction', reduction: 15, shutdowns: [] },
  { label: '20% Reduction', reduction: 20, shutdowns: [] },
  { label: '30% Reduction', reduction: 30, shutdowns: [] },
  { label: 'BF-I Shutdown', reduction: 0, shutdowns: ['bf-i'] },
  { label: 'BF-H Shutdown', reduction: 0, shutdowns: ['bf-h'] },
  { label: 'New BPP Shutdown', reduction: 0, shutdowns: ['co-new'] },
  { label: 'Multiple BF Trip', reduction: 0, shutdowns: ['bf-i', 'bf-h'] },
];

export const ScenarioComparison: React.FC = () => {
  const [scenarioAIndex, setScenarioAIndex] = useState(0);
  const [scenarioBIndex, setScenarioBIndex] = useState(3);

  const [customAReduction, setCustomAReduction] = useState(0);
  const [customBReduction, setCustomBReduction] = useState(20);
  const [customAShutdowns, setCustomAShutdowns] = useState<string[]>([]);
  const [customBShutdowns, setCustomBShutdowns] = useState<string[]>([]);
  const [useCustom, setUseCustom] = useState(false);

  const scenarioA: ScenarioConfig = useMemo(() => {
    if (useCustom) return { label: 'Custom A', globalReduction: customAReduction, shutdownGenerators: customAShutdowns };
    const p = presetScenarios[scenarioAIndex];
    return { label: p.label, globalReduction: p.reduction, shutdownGenerators: p.shutdowns };
  }, [scenarioAIndex, useCustom, customAReduction, customAShutdowns]);

  const scenarioB: ScenarioConfig = useMemo(() => {
    if (useCustom) return { label: 'Custom B', globalReduction: customBReduction, shutdownGenerators: customBShutdowns };
    const p = presetScenarios[scenarioBIndex];
    return { label: p.label, globalReduction: p.reduction, shutdownGenerators: p.shutdowns };
  }, [scenarioBIndex, useCustom, customBReduction, customBShutdowns]);

  const resultA = useMemo(() => computeScenario(scenarioA), [scenarioA]);
  const resultB = useMemo(() => computeScenario(scenarioB), [scenarioB]);

  const consumerDiffs: ConsumerImpactDiff[] = useMemo(() => {
    const bfRatioA = Math.min(1, resultA.bfGeneration / BF_CONSUMPTION);
    const coRatioA = Math.min(1, resultA.coGeneration / CO_CONSUMPTION);
    const bfRatioB = Math.min(1, resultB.bfGeneration / BF_CONSUMPTION);
    const coRatioB = Math.min(1, resultB.coGeneration / CO_CONSUMPTION);

    return consumers.map(c => {
      const a = getConsumerStatus(bfRatioA, coRatioA, c);
      const b = getConsumerStatus(bfRatioB, coRatioB, c);
      return {
        name: c.name,
        gasType: c.gasType,
        requiredFlow: c.requiredFlow,
        scenarioAStatus: a.status,
        scenarioALoad: a.load,
        scenarioBStatus: b.status,
        scenarioBLoad: b.load,
      };
    });
  }, [resultA, resultB]);

  const comparisonChart = {
    labels: ['BF Gen', 'BF Cons', 'CO Gen', 'CO Cons', 'LD Gen'],
    datasets: [
      {
        label: useCustom ? 'Custom A' : presetScenarios[scenarioAIndex].label,
        data: [resultA.bfGeneration, resultA.bfConsumption, resultA.coGeneration, resultA.coConsumption, resultA.ldGeneration],
        backgroundColor: '#FFFFFF',
        borderColor: '#E4E4E7',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: useCustom ? 'Custom B' : presetScenarios[scenarioBIndex].label,
        data: [resultB.bfGeneration, resultB.bfConsumption, resultB.coGeneration, resultB.coConsumption, resultB.ldGeneration],
        backgroundColor: '#52525B',
        borderColor: '#3F3F46',
        borderWidth: 1,
        borderRadius: 4,
      },
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { family: 'Inter, monospace', size: 11, weight: 600 }, color: '#FFFFFF' }
      },
      tooltip: {
        backgroundColor: '#18181B',
        borderColor: '#3F3F46',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#FAFAFA',
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(0)}k Nm³/h`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter, monospace', size: 10 }, color: '#A1A1AA' } },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { font: { family: 'Inter, monospace', size: 10 }, color: '#A1A1AA', callback: (v: any) => `${(v / 1000).toFixed(0)}k` }
      }
    }
  };

  const statusColor = (status: string) =>
    status === 'Nominal' ? 'bg-zinc-900 border border-zinc-600 text-white' :
    status === 'Throttled' ? 'bg-zinc-900 border border-zinc-700 text-zinc-300' :
    status === 'Degraded' ? 'bg-zinc-900 border border-zinc-700 text-zinc-400' :
    'bg-zinc-900 border border-white text-white font-bold';

  const toggleShutdown = (id: string, scenario: 'A' | 'B') => {
    if (scenario === 'A') {
      setCustomAShutdowns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    } else {
      setCustomBShutdowns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
  };

  return (
    <div className="space-y-5 text-white">
      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setUseCustom(false)}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            !useCustom ? 'bg-white text-black shadow-md' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5 inline mr-1.5" />
          Preset Scenarios
        </button>
        <button
          onClick={() => setUseCustom(true)}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            useCustom ? 'bg-white text-black shadow-md' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5 inline mr-1.5" />
          Custom Builder
        </button>
      </div>

      {/* Scenario Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario A */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-white" />
            <h4 className="font-mono font-bold text-sm text-white">Scenario A (Baseline)</h4>
          </div>
          {!useCustom ? (
            <div className="space-y-1.5">
              {presetScenarios.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioAIndex(i)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all cursor-pointer ${
                    scenarioAIndex === i
                      ? 'bg-white text-black font-bold'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Global Reduction %</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={customAReduction}
                  onChange={e => setCustomAReduction(Number(e.target.value))}
                  className="w-full accent-white"
                />
                <span className="text-xs font-mono font-bold text-white">{customAReduction}% reduction</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Shutdown Generators</label>
                <div className="flex flex-wrap gap-1.5">
                  {allGenerators.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleShutdown(g.id, 'A')}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        customAShutdowns.includes(g.id)
                          ? 'bg-white text-black'
                          : 'bg-black text-zinc-400 border border-zinc-800 hover:border-zinc-500'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5 inline mr-0.5" />
                      {g.name.length > 15 ? g.name.slice(0, 15) + '…' : g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ParticleCard>

        {/* Scenario B */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <h4 className="font-mono font-bold text-sm text-white">Scenario B (Comparison)</h4>
          </div>
          {!useCustom ? (
            <div className="space-y-1.5">
              {presetScenarios.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioBIndex(i)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all cursor-pointer ${
                    scenarioBIndex === i
                      ? 'bg-zinc-200 text-black font-bold'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Global Reduction %</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={customBReduction}
                  onChange={e => setCustomBReduction(Number(e.target.value))}
                  className="w-full accent-zinc-400"
                />
                <span className="text-xs font-mono font-bold text-zinc-300">{customBReduction}% reduction</span>
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Shutdown Generators</label>
                <div className="flex flex-wrap gap-1.5">
                  {allGenerators.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleShutdown(g.id, 'B')}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                        customBShutdowns.includes(g.id)
                          ? 'bg-zinc-200 text-black'
                          : 'bg-black text-zinc-400 border border-zinc-800 hover:border-zinc-500'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5 inline mr-0.5" />
                      {g.name.length > 15 ? g.name.slice(0, 15) + '…' : g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ParticleCard>
      </div>

      {/* Side-by-Side Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Scenario A', result: resultA, color: '#FFFFFF', config: scenarioA },
          { label: 'Scenario B', result: resultB, color: '#A1A1AA', config: scenarioB },
        ].map(s => (
          <ParticleCard key={s.label} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
            <h4 className="font-mono font-bold text-sm text-white mb-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.config.label}
              {s.config.globalReduction > 0 && (
                <span className="text-[10px] font-mono text-zinc-400">({s.config.globalReduction}% reduction)</span>
              )}
            </h4>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: 'BF Gas Balance', value: s.result.bfBalance },
                { label: 'CO Gas Balance', value: s.result.coBalance },
                { label: 'LD Gas Balance', value: s.result.ldBalance },
                { label: 'Total Deficit', value: -s.result.totalDeficit },
              ].map(metric => (
                <div key={metric.label} className="p-2.5 bg-black rounded border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 block">{metric.label}</span>
                  <span className="text-sm font-mono font-extrabold text-white">
                    {metric.value >= 0 ? '+' : ''}{(metric.value / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-black rounded border border-zinc-800">
                <Zap className="w-3.5 h-3.5 mx-auto text-white mb-1" />
                <span className="text-[10px] font-mono text-zinc-400 block">Consumers Hit</span>
                <span className="text-sm font-mono font-bold text-white">{s.result.consumersAffected}</span>
              </div>
              <div className="p-2 bg-black rounded border border-zinc-800">
                <DollarSign className="w-3.5 h-3.5 mx-auto text-zinc-300 mb-1" />
                <span className="text-[10px] font-mono text-zinc-400 block">Cost/hr</span>
                <span className="text-sm font-mono font-bold text-white">${s.result.costPenalty}</span>
              </div>
              <div className="p-2 bg-black rounded border border-zinc-800">
                <Clock className="w-3.5 h-3.5 mx-auto text-zinc-400 mb-1" />
                <span className="text-[10px] font-mono text-zinc-400 block">Buffer</span>
                <span className="text-sm font-mono font-bold text-white">
                  {s.result.holderBufferMinutes < 999 ? `${s.result.holderBufferMinutes}m` : '∞'}
                </span>
              </div>
            </div>
          </ParticleCard>
        ))}
      </div>

      {/* Comparison Bar Chart */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
          <GitCompareArrows className="w-4 h-4 text-white" />
          Side-by-Side Generation & Consumption Comparison
        </h3>
        <div style={{ height: 300 }}>
          <Bar data={comparisonChart} options={chartOptions} />
        </div>
      </ParticleCard>

      {/* Consumer Impact Diff Table */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4 text-white" />
          Consumer Status Transition — Scenario A vs B
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2.5 px-3 text-zinc-400">Consumer</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Gas Type</th>
                <th className="text-center py-2.5 px-2 text-white">Scenario A</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">→</th>
                <th className="text-center py-2.5 px-2 text-zinc-300">Scenario B</th>
                <th className="text-center py-2.5 px-2 text-zinc-400">Load Δ</th>
              </tr>
            </thead>
            <tbody>
              {consumerDiffs.map((diff, i) => {
                const loadDelta = diff.scenarioBLoad - diff.scenarioALoad;
                const statusChanged = diff.scenarioAStatus !== diff.scenarioBStatus;
                return (
                  <tr key={i} className={`border-b border-zinc-800/60 ${statusChanged ? 'bg-zinc-900/80' : ''} hover:bg-zinc-900/60 transition-colors`}>
                    <td className="py-2 px-3 font-semibold text-white">{diff.name}</td>
                    <td className="py-2 px-2 text-center text-zinc-400">{diff.gasType}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor(diff.scenarioAStatus)}`}>
                        {diff.scenarioAStatus} ({diff.scenarioALoad}%)
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <ChevronRight className={`w-4 h-4 mx-auto ${statusChanged ? 'text-white' : 'text-zinc-600'}`} />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor(diff.scenarioBStatus)}`}>
                        {diff.scenarioBStatus} ({diff.scenarioBLoad}%)
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`font-bold ${loadDelta > 0 ? 'text-white' : loadDelta < 0 ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {loadDelta > 0 ? '+' : ''}{loadDelta}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-zinc-400 p-2 bg-black rounded border border-zinc-800">
          <span className="font-bold text-white">Status Key:</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-600 text-white rounded font-bold">Nominal</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded font-bold">Throttled</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded font-bold">Degraded</span>
          <span className="px-1.5 py-0.5 bg-zinc-900 border border-white text-white rounded font-bold">Critical</span>
          <span className="ml-auto">Highlighted rows = status change detected</span>
        </div>
      </ParticleCard>
    </div>
  );
};

export default ScenarioComparison;
