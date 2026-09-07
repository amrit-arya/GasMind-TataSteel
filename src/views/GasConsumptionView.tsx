import React, { useState } from 'react';
import { Flame, Filter } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ConsumerItem {
  name: string;
  primaryGas: 'BF Gas' | 'CO Gas' | 'LD Gas' | 'Mixed';
  flow: number;
  status: 'Optimal' | 'High Consumption' | 'Buffer Standard';
}

const allConsumers: ConsumerItem[] = [
  // BF Gas Consumers (Total 1,736,000 Nm³/h)
  { name: 'BF Internal Consumption (Furnaces I, H, G, F, E, C)', primaryGas: 'BF Gas', flow: 536000, status: 'Optimal' },
  { name: 'Power House #6', primaryGas: 'BF Gas', flow: 300000, status: 'Optimal' },
  { name: 'Coke Plant Heating', primaryGas: 'BF Gas', flow: 270000, status: 'Optimal' },
  { name: 'Power House #3', primaryGas: 'BF Gas', flow: 190000, status: 'Optimal' },
  { name: 'Power House #4', primaryGas: 'BF Gas', flow: 150000, status: 'Optimal' },
  { name: 'Power House #5', primaryGas: 'BF Gas', flow: 130000, status: 'Optimal' },
  { name: 'HSM Mill (BF Gas)', primaryGas: 'BF Gas', flow: 75000, status: 'Optimal' },
  { name: 'Pellet Plant (BF Gas)', primaryGas: 'BF Gas', flow: 60000, status: 'Optimal' },
  { name: 'LCP (Lime Calcining Plant)', primaryGas: 'BF Gas', flow: 15000, status: 'Buffer Standard' },
  { name: 'TSCR (BF Gas)', primaryGas: 'BF Gas', flow: 10000, status: 'Buffer Standard' },

  // CO Gas Consumers (Total 134,600 Nm³/h)
  { name: 'HSM Mill (CO Gas)', primaryGas: 'CO Gas', flow: 30000, status: 'Optimal' },
  { name: 'Power House #4 (CO Gas)', primaryGas: 'CO Gas', flow: 22000, status: 'High Consumption' },
  { name: 'Pellet Plant (CO Gas)', primaryGas: 'CO Gas', flow: 18000, status: 'Optimal' },
  { name: 'Mergemill (8-9)', primaryGas: 'CO Gas', flow: 8000, status: 'Optimal' },
  { name: 'TSCR (CO Gas)', primaryGas: 'CO Gas', flow: 8000, status: 'Optimal' },
  { name: 'CRM (Cold Rolling Mill)', primaryGas: 'CO Gas', flow: 7000, status: 'Optimal' },
  { name: 'TPL (Tinplate Line)', primaryGas: 'CO Gas', flow: 7000, status: 'Optimal' },
  { name: 'CAPL (Continuous Annealing)', primaryGas: 'CO Gas', flow: 6000, status: 'Optimal' },
  { name: 'Power House #7', primaryGas: 'CO Gas', flow: 5000, status: 'Optimal' },
  { name: 'BF Tuyeres Total (800 x 6)', primaryGas: 'CO Gas', flow: 4800, status: 'Optimal' },
  { name: 'MM (Merchant Mill)', primaryGas: 'CO Gas', flow: 4000, status: 'Buffer Standard' },
  { name: 'Mergemill (1-7)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard' },
  { name: 'WRM (Wire Rod Mill)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard' },
  { name: 'Power House #6 (CO Gas)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard' },
  { name: 'Power House #5 (CO Gas)', primaryGas: 'CO Gas', flow: 2000, status: 'Buffer Standard' },
  { name: 'Tube Division', primaryGas: 'CO Gas', flow: 1500, status: 'Buffer Standard' },
  { name: 'SP (Sinter Plant 1-4)', primaryGas: 'CO Gas', flow: 1200, status: 'Buffer Standard' },
  { name: 'Power House #3 (CO Gas)', primaryGas: 'CO Gas', flow: 1100, status: 'Buffer Standard' }
];

export const GasConsumptionView: React.FC = () => {
  const [filterStream, setFilterStream] = useState<'ALL' | 'BF Gas' | 'CO Gas'>('ALL');

  const filteredConsumers = filterStream === 'ALL' 
    ? allConsumers 
    : allConsumers.filter(c => c.primaryGas === filterStream);

  const totalConsumption = filteredConsumers.reduce((acc, c) => acc + c.flow, 0);

  // Top consumers for chart visualization
  const chartItems = filteredConsumers.slice(0, 7);
  const otherTotal = filteredConsumers.slice(7).reduce((acc, c) => acc + c.flow, 0);

  const labels = [...chartItems.map(c => c.name), ...(otherTotal > 0 ? ['Other Plant Consumers'] : [])];
  const chartDataValues = [...chartItems.map(c => c.flow), ...(otherTotal > 0 ? [otherTotal] : [])];

  const doughnutData = {
    labels,
    datasets: [
      {
        data: chartDataValues,
        backgroundColor: [
          '#FF6B00',
          '#FF3D00',
          '#D97706',
          '#059669',
          '#EC4899',
          '#3B82F6',
          '#8B5CF6',
          '#64748B'
        ],
        borderColor: '#FFFFFF',
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#0F172A', font: { family: 'Inter', size: 11, weight: 600 } } },
      tooltip: { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderWidth: 1, titleColor: '#0F172A', bodyColor: '#0F172A' }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FF6B00]" />
            Gas Consumption Intelligence
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">
            Plant-wide industrial consumer breakdown from Excel telemetry data (Total: {(totalConsumption / 1000).toFixed(1)}k Nm³/h).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#CBD5E1] p-1 rounded font-mono text-xs shadow-sm">
          <Filter className="w-3.5 h-3.5 text-[#64748B] ml-2" />
          <button 
            onClick={() => setFilterStream('ALL')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'ALL' ? 'bg-[#FF6B00] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Consumers ({allConsumers.length})
          </button>
          <button 
            onClick={() => setFilterStream('BF Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'BF Gas' ? 'bg-[#FF6B00] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            BF Gas Stream
          </button>
          <button 
            onClick={() => setFilterStream('CO Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'CO Gas' ? 'bg-[#FF6B00] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            CO Gas Stream
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">
          Consumer Allocation Distribution ({filterStream === 'ALL' ? 'All Streams' : filterStream})
        </h3>
        <div className="h-[280px] w-full">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-base font-bold text-[#0F172A]">
            Plant Industrial Consumer Units Breakdown ({filteredConsumers.length} Units)
          </h3>
          <span className="text-xs font-mono text-[#FF6B00] font-bold">
            Total Stream Cons: {(totalConsumption).toLocaleString()} Nm³/h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
              <tr>
                <th className="pb-3 font-bold">Consumer Plant Area</th>
                <th className="pb-3 font-bold">Fuel Gas Type</th>
                <th className="pb-3 font-bold">Consumption (Nm³/h)</th>
                <th className="pb-3 font-bold">Stream Share</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {filteredConsumers.map((item, i) => {
                const share = ((item.flow / totalConsumption) * 100).toFixed(1);
                return (
                  <tr key={i} className="hover:bg-[#F8F9FA]">
                    <td className="py-3 font-bold text-[#0F172A]">{item.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.primaryGas === 'BF Gas' ? 'bg-[#FFF3E0] text-[#FF6B00]' : 'bg-[#D1FAE5] text-[#059669]'
                      }`}>
                        {item.primaryGas}
                      </span>
                    </td>
                    <td className="py-3 font-bold">{item.flow.toLocaleString()} Nm³/h</td>
                    <td className="py-3 text-[#475569]">{share}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        item.status === 'Optimal' ? 'bg-[#D1FAE5] text-[#059669]' :
                        item.status === 'High Consumption' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                        'bg-[#FEF3C7] text-[#D97706]'
                      }`}>
                        {item.status}
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
