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
        backgroundColor: 'rgba(5, 150, 105, 0.75)',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Consumption (Nm³/h)',
        data: [bf.consumption, co.consumption, ld.consumption],
        backgroundColor: 'rgba(220, 38, 38, 0.75)',
        borderColor: '#DC2626',
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
        labels: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: '#475569' }
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${(ctx.raw / 1000).toFixed(1)}k Nm³/h`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 }, color: '#64748B' } },
      y: {
        grid: { color: '#E2E8F0' },
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          color: '#64748B',
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
        '#DC2626', '#FF6B00', '#D97706', '#059669', '#2563EB', '#7C3AED'
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { family: 'JetBrains Mono, monospace', size: 10 }, color: '#475569', boxWidth: 12, padding: 8 }
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${(ctx.raw / 1000).toFixed(0)}k Nm³/h (${((ctx.raw / totalBfConsumption) * 100).toFixed(1)}%)`
        }
      }
    }
  };

  const sevColor = (s: string) =>
    s === 'critical' ? { bg: 'bg-[#FEE2E2]', border: 'border-[#DC2626]/30', text: 'text-[#DC2626]', icon: 'bg-[#DC2626]' } :
    s === 'warning' ? { bg: 'bg-[#FEF3C7]', border: 'border-[#D97706]/30', text: 'text-[#D97706]', icon: 'bg-[#D97706]' } :
    { bg: 'bg-[#DBEAFE]', border: 'border-[#2563EB]/30', text: 'text-[#2563EB]', icon: 'bg-[#2563EB]' };

  return (
    <div className="space-y-6">
      {/* Deficit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'BF Gas', gas: bf, color: bf.balance < 0 ? '#DC2626' : '#059669' },
          { label: 'CO Gas', gas: co, color: co.balance < 0 ? '#DC2626' : '#059669' },
          { label: 'LD Gas', gas: ld, color: ld.balance < 0 ? '#DC2626' : '#059669' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5`} style={{ backgroundColor: item.color }} />
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-mono text-[#64748B] uppercase tracking-wider">{item.label} Balance</p>
                <p className="text-2xl font-display font-extrabold mt-1" style={{ color: item.color }}>
                  {item.gas.balance > 0 ? '+' : ''}{(item.gas.balance / 1000).toFixed(1)}k
                  <span className="text-sm font-mono font-normal text-[#64748B] ml-1">Nm³/h</span>
                </p>
              </div>
              <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${item.color}15` }}>
                {item.gas.balance < 0 ? (
                  <ArrowDownRight className="w-5 h-5" style={{ color: item.color }} />
                ) : (
                  <ArrowUpRight className="w-5 h-5" style={{ color: item.color }} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#F8F9FA] p-2 rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">Generation</span>
                <span className="font-bold text-[#059669]">{(item.gas.generation / 1000).toFixed(1)}k</span>
              </div>
              <div className="bg-[#F8F9FA] p-2 rounded border border-[#E2E8F0]">
                <span className="text-[#64748B] block text-[10px]">Consumption</span>
                <span className="font-bold text-[#DC2626]">{(item.gas.consumption / 1000).toFixed(1)}k</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                item.gas.status === 'Deficit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                item.gas.status === 'Surplus' ? 'bg-[#D1FAE5] text-[#059669]' :
                'bg-[#FEF3C7] text-[#D97706]'
              }`}>
                {item.gas.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Generation vs Consumption Bar Chart */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-[#FF6B00]" />
            Deficit Breakdown — Generation vs Consumption
          </h3>
          <div style={{ height: 280 }}>
            <Bar data={comparisonChartData} options={comparisonChartOptions} />
          </div>
        </div>

        {/* BF Gas Consumer Share Doughnut */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-[#DC2626]" />
            BF Gas Consumer Breakdown (Top 6)
          </h3>
          <div style={{ height: 280 }}>
            <Doughnut data={bfDoughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Root Cause Factor Cards */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[#FF6B00]" />
          Root Cause Factors Contributing to Deficit
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rootCauseFactors.map(factor => {
            const colors = sevColor(factor.severity);
            return (
              <div key={factor.id} className={`p-4 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:shadow-md`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.icon} text-white shrink-0`}>
                    {factor.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-display font-bold text-sm ${colors.text}`}>{factor.title}</h4>
                    <p className="text-xs font-mono text-[#475569] mt-1 leading-relaxed">{factor.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${colors.text} bg-white/60 border ${colors.border}`}>
                        {factor.severity}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B]">Impact: {factor.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Major Contributors Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BF Gas Contributors */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#2563EB]" />
            BF Gas — Major Consumer Contributors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left py-2 px-2 text-[#64748B] font-bold">Consumer</th>
                  <th className="text-right py-2 px-2 text-[#64748B] font-bold">Flow (Nm³/h)</th>
                  <th className="text-right py-2 px-2 text-[#64748B] font-bold">Share %</th>
                  <th className="py-2 px-2 text-[#64748B] font-bold w-24">Load</th>
                </tr>
              </thead>
              <tbody>
                {bfWithShares.map((c, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-2 px-2 text-[#0F172A] font-semibold">{c.name}</td>
                    <td className="py-2 px-2 text-right text-[#0F172A]">{(c.consumption / 1000).toFixed(0)}k</td>
                    <td className="py-2 px-2 text-right font-bold text-[#FF6B00]">{c.share.toFixed(1)}%</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-[#F1F3F5] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${c.share}%`,
                            backgroundColor: c.share > 20 ? '#DC2626' : c.share > 10 ? '#FF6B00' : '#059669'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CO Gas Contributors */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#7C3AED]" />
            CO Gas — Major Consumer Contributors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left py-2 px-2 text-[#64748B] font-bold">Consumer</th>
                  <th className="text-right py-2 px-2 text-[#64748B] font-bold">Flow (Nm³/h)</th>
                  <th className="text-right py-2 px-2 text-[#64748B] font-bold">Share %</th>
                  <th className="py-2 px-2 text-[#64748B] font-bold w-24">Load</th>
                </tr>
              </thead>
              <tbody>
                {coWithShares.map((c, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8F9FA] transition-colors">
                    <td className="py-2 px-2 text-[#0F172A] font-semibold">{c.name}</td>
                    <td className="py-2 px-2 text-right text-[#0F172A]">{(c.consumption / 1000).toFixed(1)}k</td>
                    <td className="py-2 px-2 text-right font-bold text-[#7C3AED]">{c.share.toFixed(1)}%</td>
                    <td className="py-2 px-2">
                      <div className="w-full bg-[#F1F3F5] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(c.share * 3, 100)}%`,
                            backgroundColor: c.share > 20 ? '#7C3AED' : c.share > 10 ? '#FF6B00' : '#059669'
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
