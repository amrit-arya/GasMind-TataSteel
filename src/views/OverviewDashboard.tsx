import React from 'react';
import { useGasData } from '../context/GasDataContext';
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
        label: 'Total Generation (Nm³/h)',
        data: [1680000, 1710000, 1695000, 1730000, 1725000, 1740000, 1715000, 1720000, totalGen],
        borderColor: '#FF6B00',
        backgroundColor: 'rgba(255, 107, 0, 0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 3
      },
      {
        label: 'Total Consumption (Nm³/h)',
        data: [1690000, 1700000, 1710000, 1725000, 1730000, 1735000, 1725000, 1730000, totalCons],
        borderColor: '#D97706',
        backgroundColor: 'rgba(217, 119, 6, 0.04)',
        fill: true,
        tension: 0.35,
        pointRadius: 3
      },
      {
        label: 'Net Balance (Nm³/h)',
        data: [-10000, 10000, -15000, 5000, -5000, 5000, -10000, -10000, netBal],
        borderColor: '#DC2626',
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
          color: '#334155',
          font: { family: 'JetBrains Mono', size: 11, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#CBD5E1',
        borderWidth: 1,
        titleColor: '#0F172A',
        bodyColor: '#0F172A',
        titleFont: { family: 'Inter', size: 12, weight: 700 },
        bodyFont: { family: 'JetBrains Mono', size: 12 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } },
        grid: { color: '#E2E8F0' }
      },
      y: {
        ticks: { 
          color: '#64748B', 
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`
        },
        grid: { color: '#E2E8F0' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FF6B00]" />
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
        <div className="bg-white p-5 border border-[#CBD5E1] rounded-lg relative overflow-hidden group hover:border-[#FF6B00] transition-all shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B00]" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold">Total Generation</h3>
            <span className="p-1.5 rounded bg-[#FFF3E0] text-[#FF6B00]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#0F172A] tracking-tight">
              {(totalGen / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs font-mono text-[#64748B]">Nm³/h</span>
          </div>
          <p className="text-[11px] text-[#FF6B00] font-mono mt-2 font-bold">
            +2.4% vs last hour
          </p>
        </div>

        {/* Total Consumption */}
        <div className="bg-white p-5 border border-[#CBD5E1] rounded-lg relative overflow-hidden group hover:border-[#D97706] transition-all shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D97706]" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold">Total Consumption</h3>
            <span className="p-1.5 rounded bg-[#FEF3C7] text-[#D97706]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#0F172A] tracking-tight">
              {(totalCons / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs font-mono text-[#64748B]">Nm³/h</span>
          </div>
          <p className="text-[11px] text-[#D97706] font-mono mt-2 font-bold">
            +1.8% vs last hour
          </p>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 border border-[#CBD5E1] rounded-lg relative overflow-hidden group hover:border-[#DC2626] transition-all shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#DC2626]" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold">Net Balance</h3>
            <span className="p-1.5 rounded bg-[#FEE2E2] text-[#DC2626]">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-mono font-bold tracking-tight ${netBal < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
              {netBal > 0 ? `+${netBal.toLocaleString()}` : netBal.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-[#64748B]">Nm³/h</span>
          </div>
          <p className="text-[11px] text-[#DC2626] font-mono mt-2 font-bold">
            Critical network deficit
          </p>
        </div>

        {/* Global Utilization */}
        <div className="bg-white p-5 border border-[#CBD5E1] rounded-lg relative overflow-hidden group hover:border-[#FF6B00] transition-all shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6B00]" />
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-bold">Global Utilization</h3>
            <span className="p-1.5 rounded bg-[#FFF3E0] text-[#FF6B00]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#0F172A] tracking-tight">{globalUtil}%</span>
          </div>
          <p className="text-[11px] text-[#059669] font-mono mt-2 font-bold">
            Optimal plant load distribution
          </p>
        </div>
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
