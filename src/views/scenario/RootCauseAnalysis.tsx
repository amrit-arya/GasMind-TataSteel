import React from 'react';
import { useGasData } from '../../context/GasDataContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Flame,
  Zap,
  Factory,
  ArrowDownRight,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { ParticleCard } from '../../components/MagicBento';

interface ConsumerBreakdown {
  name: string;
  gasType: string;
  consumption: number;
  share: number;
}

const bfConsumers: ConsumerBreakdown[] = [
  { name: 'BF Stoves (I, H, G, F, C, E)', gasType: 'BF Gas', consumption: 536000, share: 0 },
  { name: 'Power House #6', gasType: 'BF Gas', consumption: 300000, share: 0 },
  { name: 'Coke Plant Heating', gasType: 'BF Gas', consumption: 270000, share: 0 },
  { name: 'Power House #3', gasType: 'BF Gas', consumption: 190000, share: 0 },
  { name: 'Power House #4', gasType: 'BF Gas', consumption: 150000, share: 0 },
  { name: 'Power House #5', gasType: 'BF Gas', consumption: 130000, share: 0 },
  { name: 'HSM Reheating Furnace', gasType: 'BF Gas', consumption: 75000, share: 0 },
  { name: 'Pelletizing Plant', gasType: 'BF Gas', consumption: 60000, share: 0 },
  { name: 'Other / Misc BF Consumers', gasType: 'BF Gas', consumption: 25000, share: 0 },
];

const coConsumers: ConsumerBreakdown[] = [
  { name: 'HSM Reheating Furnace', gasType: 'CO Gas', consumption: 30000, share: 0 },
  { name: 'Power House #4', gasType: 'CO Gas', consumption: 22000, share: 0 },
  { name: 'Pelletizing Plant', gasType: 'CO Gas', consumption: 18000, share: 0 },
  { name: 'CRM Heat Treatment', gasType: 'CO Gas', consumption: 15000, share: 0 },
  { name: 'Sinter Plant Ignition', gasType: 'CO Gas', consumption: 12000, share: 0 },
  { name: 'Lime & Dolomite Kilns', gasType: 'CO Gas', consumption: 10000, share: 0 },
  { name: 'Power House #6', gasType: 'CO Gas', consumption: 3000, share: 0 },
  { name: 'Power House #3', gasType: 'CO Gas', consumption: 1100, share: 0 },
  { name: 'Power House #5', gasType: 'CO Gas', consumption: 2000, share: 0 },
  { name: 'Other / Misc CO Consumers', gasType: 'CO Gas', consumption: 21500, share: 0 },
];

interface RootCauseFactor {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  icon: React.ReactNode;
}

export const RootCauseAnalysis: React.FC = () => {
  const { gasMetrics } = useGasData();

  const bf = gasMetrics.find(m => m.id === 'bf-gas')!;
  const co = gasMetrics.find(m => m.id === 'co-gas')!;
  const ld = gasMetrics.find(m => m.id === 'ld-gas')!;

  const totalBfConsumption = bfConsumers.reduce((s, c) => s + c.consumption, 0);
  const totalCoConsumption = coConsumers.reduce((s, c) => s + c.consumption, 0);

  const bfWithShares = bfConsumers.map(c => ({
    ...c,
    share: (c.consumption / totalBfConsumption) * 100
  })).sort((a, b) => b.consumption - a.consumption);

  const coWithShares = coConsumers.map(c => ({
    ...c,
    share: (c.consumption / totalCoConsumption) * 100
  })).sort((a, b) => b.consumption - a.consumption);

  const rootCauseFactors: RootCauseFactor[] = [
    {
      id: 'rc-1',
      title: 'High BF Stove Internal Consumption',
      description: 'Blast Furnace stoves consume ~536k Nm³/h internally (31% of total BF generation), leaving only 1,185k Nm³/h for external distribution.',
      severity: 'critical',
      impact: '-536,000 Nm³/h locked',
      icon: <Flame className="w-5 h-5" />
    },
    {
      id: 'rc-2',
      title: 'Concentrated Power House Demand',
      description: 'Power Houses #3, #4, #5, #6 together consume 770k Nm³/h of BF Gas — 44% of total consumption. Any spike in power demand amplifies the deficit.',
      severity: 'critical',
      impact: '770,000 Nm³/h demand block',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'rc-3',
      title: 'LD Gas Under-Utilization',
      description: '150,000 Nm³/h of LD Gas generated but 0 Nm³/h consumed directly. Entire volume buffers in holder or gets flared. Cross-firing potential untapped.',
      severity: 'warning',
      impact: '150,000 Nm³/h wasted potential',
      icon: <Factory className="w-5 h-5" />
    },
    {
      id: 'rc-4',
      title: 'Insufficient CO Gas Cross-Firing',
      description: 'CO Gas surplus of +7,400 Nm³/h could partially offset BF deficit if rerouted to dual-fuel consumers (PH #4, HSM), but cross-firing infrastructure is limited.',
      severity: 'info',
      impact: '7,400 Nm³/h untapped offset',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  // Chart data for generation vs consumption comparison
  const comparisonChartData = {
    labels: ['BF Gas', 'CO Gas', 'LD Gas'],
    datasets: [
      {
        label: 'Generation (Nm³/h)',
        data: [bf.generation, co.generation, ld.generation],
        backgroundColor: '#FFFFFF',
        borderColor: '#E4E4E7',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Consumption (Nm³/h)',
        data: [bf.consumption, co.consumption, ld.consumption],
        backgroundColor: '#52525B',
        borderColor: '#3F3F46',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const comparisonChartOptions = {
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
          label: (ctx: any) => `${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(1)}k Nm³/h`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'Inter, monospace', size: 11 }, color: '#A1A1AA' } },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          font: { family: 'Inter, monospace', size: 10 },
          color: '#A1A1AA',
          callback: (v: any) => `${(v / 1000).toFixed(0)}k`
        }
      }
    }
  };

  // Doughnut for BF gas consumer breakdown
  const bfDoughnutData = {
    labels: bfWithShares.slice(0, 6).map(c => c.name),
    datasets: [{
      data: bfWithShares.slice(0, 6).map(c => c.consumption),
      backgroundColor: [
        '#FFFFFF', '#E4E4E7', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B'
      ],
      borderWidth: 2,
      borderColor: '#000000',
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { family: 'Inter, monospace', size: 10, weight: 600 }, color: '#FFFFFF', boxWidth: 12, padding: 8 }
      },
      tooltip: {
        backgroundColor: '#18181B',
        borderColor: '#3F3F46',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#FAFAFA',
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${(ctx.raw / 1000).toFixed(0)}k Nm³/h (${((ctx.raw / totalBfConsumption) * 100).toFixed(1)}%)`
        }
      }
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Deficit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'BF Gas', gas: bf, color: '#FFFFFF' },
          { label: 'CO Gas', gas: co, color: '#FFFFFF' },
          { label: 'LD Gas', gas: ld, color: '#FFFFFF' },
        ].map(item => (
          <ParticleCard key={item.label} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{item.label} Balance</p>
                <p className="text-2xl font-mono font-extrabold mt-1 text-white">
                  {item.gas.balance > 0 ? '+' : ''}{(item.gas.balance / 1000).toFixed(1)}k
                  <span className="text-sm font-mono font-normal text-zinc-400 ml-1">Nm³/h</span>
                </p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
                {item.gas.balance < 0 ? (
                  <ArrowDownRight className="w-5 h-5 text-white" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black p-2 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px]">Generation</span>
                <span className="font-bold text-white">{(item.gas.generation / 1000).toFixed(1)}k</span>
              </div>
              <div className="bg-black p-2 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px]">Consumption</span>
                <span className="font-bold text-zinc-300">{(item.gas.consumption / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
                {item.gas.status}
              </span>
            </div>
          </ParticleCard>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Generation vs Consumption Bar Chart */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-white" />
            Deficit Breakdown — Generation vs Consumption
          </h3>
          <div style={{ height: 280 }}>
            <Bar data={comparisonChartData} options={comparisonChartOptions} />
          </div>
        </ParticleCard>

        {/* BF Gas Consumer Share Doughnut */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-white" />
            BF Gas Consumer Breakdown (Top 6)
          </h3>
          <div style={{ height: 280 }}>
            <Doughnut data={bfDoughnutData} options={doughnutOptions} />
          </div>
        </ParticleCard>
      </div>

      {/* Root Cause Factor Cards */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-white" />
          Root Cause Factors Contributing to Deficit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rootCauseFactors.map(factor => (
            <div key={factor.id} className="p-4 rounded-xl border border-zinc-800 bg-black/80 transition-all hover:border-zinc-600">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white shrink-0">
                  {factor.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-mono font-bold text-sm text-white">{factor.title}</h4>
                  <p className="text-xs font-mono text-zinc-400 mt-1 leading-relaxed">{factor.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-white bg-zinc-900 border border-zinc-700">
                      {factor.severity}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Impact: {factor.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ParticleCard>

      {/* Major Contributors Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BF Gas Contributors */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-white" />
            BF Gas — Major Consumer Contributors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-bold">Consumer</th>
                  <th className="text-right py-2 px-2 text-zinc-400 font-bold">Flow (Nm³/h)</th>
                  <th className="text-right py-2 px-2 text-zinc-400 font-bold">Share %</th>
                  <th className="py-2 px-2 text-zinc-400 font-bold w-24">Load</th>
                </tr>
              </thead>
              <tbody>
                {bfWithShares.map((c, i) => (
                  <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
                    <td className="py-2 px-2 text-white font-semibold">{c.name}</td>
                    <td className="py-2 px-2 text-right text-zinc-300">{(c.consumption / 1000).toFixed(0)}k</td>
                    <td className="py-2 px-2 text-right font-bold text-white">{c.share.toFixed(1)}%</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-white"
                          style={{ width: `${c.share}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ParticleCard>

        {/* CO Gas Contributors */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-white" />
            CO Gas — Major Consumer Contributors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-bold">Consumer</th>
                  <th className="text-right py-2 px-2 text-zinc-400 font-bold">Flow (Nm³/h)</th>
                  <th className="text-right py-2 px-2 text-zinc-400 font-bold">Share %</th>
                  <th className="py-2 px-2 text-zinc-400 font-bold w-24">Load</th>
                </tr>
              </thead>
              <tbody>
                {coWithShares.map((c, i) => (
                  <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
                    <td className="py-2 px-2 text-white font-semibold">{c.name}</td>
                    <td className="py-2 px-2 text-right text-zinc-300">{(c.consumption / 1000).toFixed(1)}k</td>
                    <td className="py-2 px-2 text-right font-bold text-white">{c.share.toFixed(1)}%</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-zinc-300"
                          style={{ width: `${Math.min(c.share * 3, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ParticleCard>
      </div>
    </div>
  );
};

export default RootCauseAnalysis;
