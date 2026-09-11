import React from 'react';
import { useGasData } from '../context/GasDataContext';
import { ParticleCard } from '../components/MagicBento';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  BrainCircuit, 
  ArrowRight, 
  Zap,
  Activity,
  AlertCircle,
  Flame
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const OverviewDashboard: React.FC = () => {
  const { gasMetrics, insights, applyInsight, setCurrentView } = useGasData();

  const totalGen = gasMetrics.reduce((acc, m) => acc + m.generation, 0);
  const totalCons = gasMetrics.reduce((acc, m) => acc + m.consumption, 0);
  const netBal = totalGen - totalCons;
  const globalUtil = 98.2;

  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'];
  
  const chartData = {
    labels: hours,
    datasets: [
      {
        label: 'Total Byproduct Generation (Nm³/h)',
        data: [1980000, 2005000, 1990000, 2020000, 2015000, 2030000, 2000000, 2010000, totalGen],
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 3
      },
      {
        label: 'Total Plant Consumption (Nm³/h)',
        data: [1850000, 1860000, 1855000, 1875000, 1870000, 1865000, 1860000, 1870000, totalCons],
        borderColor: '#A1A1AA',
        backgroundColor: 'rgba(161, 161, 170, 0.05)',
        fill: true,
        tension: 0.35,
        pointRadius: 3
      },
      {
        label: 'Net Byproduct Surplus (Nm³/h)',
        data: [130000, 145000, 135000, 145000, 145000, 165000, 140000, 140000, netBal],
        borderColor: '#71717A',
        borderDash: [5, 5],
        fill: false,
        tension: 0.35,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E4E4E7',
          font: { family: 'JetBrains Mono', size: 11, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: '#09090B',
        borderColor: '#27272A',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#FAFAFA',
        titleFont: { family: 'Inter', size: 12, weight: 700 },
        bodyFont: { family: 'JetBrains Mono', size: 12 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#A1A1AA', font: { family: 'JetBrains Mono', size: 10 } },
        grid: { color: '#27272A' }
      },
      y: {
        ticks: { 
          color: '#A1A1AA', 
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`
        },
        grid: { color: '#27272A' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <img src="/gasmind_logo.jpg" alt="GasMind Logo" className="w-7 h-7 rounded-full object-cover border border-zinc-700 shadow" />
            Overview Dashboard
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Real-time network telemetry and fire-command KPIs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white border border-[#CBD5E1] rounded flex items-center gap-2 text-xs font-mono text-[#0F172A] font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse glow-flame" />
            Live Telemetry Feed
          </div>
          <button 
            onClick={() => setCurrentView('reports')}
            className="px-3.5 py-1.5 bg-flame-gradient text-white rounded text-xs font-bold hover:opacity-90 transition-opacity shadow-sm glow-flame cursor-pointer"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Generation */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Total Generation</h3>
            <span className="p-1.5 rounded bg-zinc-900 text-white">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              {(totalGen / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs font-mono text-zinc-400">Nm³/h</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-mono mt-2 font-bold">
            +2.4% vs last hour
          </p>
        </ParticleCard>

        {/* Total Consumption */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-400" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Total Consumption</h3>
            <span className="p-1.5 rounded bg-zinc-900 text-zinc-200">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              {(totalCons / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs font-mono text-zinc-400">Nm³/h</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-mono mt-2 font-bold">
            +1.8% vs last hour
          </p>
        </ParticleCard>

        {/* Net Balance */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group transition-all shadow-lg hover:border-white">
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${netBal >= 0 ? 'bg-white' : 'bg-zinc-500'}`} />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Net Byproduct Balance</h3>
            <span className="p-1.5 rounded bg-zinc-900 text-white">
              {netBal >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold tracking-tight text-white">
              {netBal > 0 ? `+${netBal.toLocaleString()}` : netBal.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-400">Nm³/h</span>
          </div>
          <p className="text-[11px] font-mono mt-2 font-bold text-zinc-300">
            {netBal >= 0 ? 'Net byproduct surplus' : 'Critical network deficit'}
          </p>
        </ParticleCard>

        {/* Global Utilization */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">Global Utilization</h3>
            <span className="p-1.5 rounded bg-zinc-900 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">{globalUtil}%</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-mono mt-2 font-bold">
            Optimal plant load distribution
          </p>
        </ParticleCard>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 24H Trends Chart */}
        <div className="lg:col-span-2 bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 pb-2 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF6B00]" />
                24H Network Telemetry Trends
              </h3>
              <p className="text-xs text-[#64748B] font-mono">Volumetric generation, consumption, and deficit tracking</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full mt-2">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* AI Insights Command Panel */}
        <div className="bg-white border border-[#FF6B00]/40 rounded-lg p-5 flex flex-col relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
            <Zap className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="font-display text-base font-bold text-[#0F172A]">AI Prescriptive Insights</h3>
          </div>

          <div className="space-y-4 flex-1">
            {insights.map((ins) => (
              <div 
                key={ins.id} 
                className={`p-4 rounded border text-xs relative ${
                  ins.severity === 'critical' 
                    ? 'bg-[#FEE2E2]/30 border-[#DC2626]/40' 
                    : 'bg-[#FFF3E0] border-[#FF6B00]/40'
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${
                  ins.severity === 'critical' ? 'bg-[#DC2626]' : 'bg-[#FF6B00]'
                }`} />

                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    ins.severity === 'critical' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FFF3E0] text-[#FF6B00]'
                  }`}>
                    {ins.type}
                  </span>
                </div>

                <h4 className="font-bold text-[#0F172A] text-sm mb-1">{ins.title}</h4>
                <p className="text-[#334155] text-xs leading-relaxed mb-2">{ins.description}</p>
                <p className="text-[11px] font-mono text-[#64748B] mb-3">{ins.impact}</p>

                {ins.actionLabel === 'View Scenario' ? (
                  <button 
                    onClick={() => setCurrentView('scenario')}
                    className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{ins.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => applyInsight(ins.id)}
                    disabled={ins.applied}
                    className={`w-full py-2 rounded text-xs font-bold font-mono transition-colors shadow-sm cursor-pointer ${
                      ins.applied 
                        ? 'bg-[#F1F3F5] text-[#64748B] border border-[#CBD5E1] cursor-not-allowed' 
                        : 'bg-flame-gradient text-white hover:opacity-90 glow-flame'
                    }`}
                  >
                    {ins.applied ? '✓ Recommendation Applied' : ins.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gas Type Status Summary */}
      <div>
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
          Gas Type Status Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasMetrics.slice(0, 3).map((gas) => (
            <div key={gas.id} className="bg-white border border-[#CBD5E1] rounded-lg p-5 relative shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-display font-bold text-lg text-[#0F172A]">{gas.name}</h4>
                  <p className="text-xs text-[#64748B] font-mono">{gas.fullName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  gas.status === 'Deficit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                  gas.status === 'Surplus' ? 'bg-[#D1FAE5] text-[#059669]' :
                  'bg-[#FEF3C7] text-[#D97706]'
                }`}>
                  {gas.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-1.5 text-[#334155]">
                  <span>Generation:</span>
                  <span className="text-[#0F172A] font-bold">{(gas.generation / 1000).toFixed(0)}k Nm³/h</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-1.5 text-[#334155]">
                  <span>Consumption:</span>
                  <span className="text-[#0F172A] font-bold">{(gas.consumption / 1000).toFixed(0)}k Nm³/h</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-[#64748B]">Net Balance:</span>
                  <span className={`font-bold text-sm ${gas.balance < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                    {gas.balance > 0 ? `+${(gas.balance / 1000).toFixed(1)}k` : `${(gas.balance / 1000).toFixed(1)}k`} Nm³/h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
