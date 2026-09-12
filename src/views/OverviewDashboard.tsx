import React from 'react';
import { useGasData } from '../context/GasDataContext';
import { ParticleCard } from '../components/MagicBento';
import { 
  LayoutDashboard,
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Activity,
  AlertCircle
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
          color: '#FFFFFF',
          font: { family: 'Inter, monospace', size: 11, weight: 600 },
          boxWidth: 14,
          padding: 12
        }
      },
      tooltip: {
        backgroundColor: '#18181B',
        borderColor: '#3F3F46',
        borderWidth: 1,
        titleColor: '#FFFFFF',
        bodyColor: '#FAFAFA',
        titleFont: { family: 'Inter', size: 12, weight: 700 },
        bodyFont: { family: 'Inter, monospace', size: 11 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#A1A1AA', font: { family: 'Inter, monospace', size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { 
          color: '#A1A1AA', 
          font: { family: 'Inter, monospace', size: 10 },
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-white" />
            Overview Dashboard
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Real-time network telemetry and fire-command KPIs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 text-xs font-mono text-white font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Telemetry Feed
          </div>
          <button 
            onClick={() => setCurrentView('reports')}
            className="px-3.5 py-1.5 bg-white text-black font-mono rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Generation */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
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
          <p className="text-[11px] text-zinc-400 font-mono mt-2">
            +2.4% vs last hour
          </p>
        </ParticleCard>

        {/* Total Consumption */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
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
          <p className="text-[11px] text-zinc-400 font-mono mt-2">
            +1.8% vs last hour
          </p>
        </ParticleCard>

        {/* Net Balance */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group transition-all shadow-lg hover:border-white">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold font-mono">Net Byproduct Balance</h3>
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
          <p className="text-[11px] font-mono mt-2 text-zinc-400">
            {netBal >= 0 ? 'Net byproduct surplus' : 'Critical network deficit'}
          </p>
        </ParticleCard>

        {/* Global Utilization */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 p-5 border border-zinc-800 rounded-xl relative overflow-hidden group hover:border-white transition-all shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold font-mono">Global Utilization</h3>
            <span className="p-1.5 rounded bg-zinc-900 text-white">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">{globalUtil}%</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mt-2">
            Optimal plant load distribution
          </p>
        </ParticleCard>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 24H Trends Chart */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 pb-2 border-b border-zinc-800">
            <div>
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-white" />
                24H Network Telemetry Trends
              </h3>
              <p className="text-xs text-zinc-400 font-mono">Volumetric generation, consumption, and deficit tracking</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full mt-2">
            <Line data={chartData} options={chartOptions} />
          </div>
        </ParticleCard>

        {/* AI Insights Command Panel */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col relative overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
            <Zap className="w-5 h-5 text-white" />
            <h3 className="font-mono text-base font-bold text-white">AI Prescriptive Insights</h3>
          </div>

          <div className="space-y-4 flex-1">
            {insights.map((ins) => (
              <div 
                key={ins.id} 
                className="p-4 rounded-xl border border-zinc-800 bg-black/80 text-xs relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-white">
                    {ins.type}
                  </span>
                </div>

                <h4 className="font-mono font-bold text-white text-sm mb-1">{ins.title}</h4>
                <p className="text-zinc-400 text-xs leading-relaxed mb-2">{ins.description}</p>
                <p className="text-[11px] font-mono text-zinc-500 mb-3">{ins.impact}</p>

                {ins.actionLabel === 'View Scenario' ? (
                  <button 
                    onClick={() => setCurrentView('scenario')}
                    className="text-xs font-mono font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{ins.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => applyInsight(ins.id)}
                    disabled={ins.applied}
                    className={`w-full py-2 rounded-lg text-xs font-bold font-mono transition-colors shadow-sm cursor-pointer ${
                      ins.applied 
                        ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-zinc-200 font-bold'
                    }`}
                  >
                    {ins.applied ? '✓ Recommendation Applied' : ins.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </ParticleCard>
      </div>

      {/* Gas Type Status Summary */}
      <div>
        <h3 className="font-mono text-base font-bold text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-white" />
          Gas Type Status Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasMetrics.slice(0, 3).map((gas) => (
            <ParticleCard key={gas.id} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 relative shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-mono font-bold text-lg text-white">{gas.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{gas.fullName}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
                  {gas.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5 text-zinc-300">
                  <span>Generation:</span>
                  <span className="text-white font-bold">{(gas.generation / 1000).toFixed(0)}k Nm³/h</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5 text-zinc-300">
                  <span>Consumption:</span>
                  <span className="text-white font-bold">{(gas.consumption / 1000).toFixed(0)}k Nm³/h</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-zinc-400">Net Balance:</span>
                  <span className="font-bold text-sm text-white">
                    {gas.balance > 0 ? `+${(gas.balance / 1000).toFixed(1)}k` : `${(gas.balance / 1000).toFixed(1)}k`} Nm³/h
                  </span>
                </div>
              </div>
            </ParticleCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
