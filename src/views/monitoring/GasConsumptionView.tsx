import React, { useState } from 'react';
import { Flame, Filter } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ParticleCard } from '../../components';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ConsumerItem {
  name: string;
  primaryGas: 'BF Gas' | 'CO Gas' | 'LD Gas' | 'Mixed';
  flow: number;
  status: 'Optimal' | 'High Consumption' | 'Buffer Standard' | 'Holder Storage Only';
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
  { name: 'Power House #3 (CO Gas)', primaryGas: 'CO Gas', flow: 1100, status: 'Buffer Standard' },

  // LD Gas Destination
  { name: 'LD Gasholder 50k Storage (Direct Line Consumption: 0)', primaryGas: 'LD Gas', flow: 150000, status: 'Holder Storage Only' }
];

export const GasConsumptionView: React.FC = () => {
  const [filterStream, setFilterStream] = useState<'ALL' | 'BF Gas' | 'CO Gas' | 'LD Gas'>('ALL');

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
          '#FFFFFF',
          '#E4E4E7',
          '#D4D4D8',
          '#A1A1AA',
          '#71717A',
          '#52525B',
          '#3F3F46',
          '#27272A'
        ],
        borderColor: '#000000',
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right' as const, 
        labels: { 
          color: '#FFFFFF', 
          font: { family: 'Agrandir, sans-serif', size: 12, weight: 600 },
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
        titleFont: { family: 'Agrandir, sans-serif', size: 12, weight: 700 },
        bodyFont: { family: 'Roboto Mono, monospace', size: 11 }
      }
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-white" />
            Gas Consumption Intelligence
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Plant-wide industrial consumer breakdown from Excel telemetry data (Filtered Total: {(totalConsumption / 1000).toFixed(1)}k Nm³/h).
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 p-1 rounded-lg font-mono text-xs shadow-sm">
          <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
          <button 
            onClick={() => setFilterStream('ALL')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'ALL' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Streams ({allConsumers.length})
          </button>
          <button 
            onClick={() => setFilterStream('BF Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'BF Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            BF Gas (10)
          </button>
          <button 
            onClick={() => setFilterStream('CO Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'CO Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            CO Gas (18)
          </button>
          <button 
            onClick={() => setFilterStream('LD Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterStream === 'LD Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            LD Gas (1)
          </button>
        </div>
      </div>

      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-base font-bold text-white mb-4">
          Consumer Allocation Distribution ({filterStream === 'ALL' ? 'All Streams' : filterStream})
        </h3>
        <div className="h-[300px] w-full">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </ParticleCard>

      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-mono text-base font-bold text-white">
            Plant Industrial Consumer Units Breakdown ({filteredConsumers.length} Items)
          </h3>
          <span className="text-xs font-mono text-white font-bold px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-md">
            Total Stream Flow: {(totalConsumption).toLocaleString()} Nm³/h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase">
              <tr>
                <th className="pb-3 font-bold">Consumer Plant Area</th>
                <th className="pb-3 font-bold">Fuel Gas Type</th>
                <th className="pb-3 font-bold">Consumption (Nm³/h)</th>
                <th className="pb-3 font-bold">Stream Share</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-white">
              {filteredConsumers.map((item, i) => {
                const share = ((item.flow / totalConsumption) * 100).toFixed(1);
                return (
                  <tr key={i} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="py-3 font-bold text-white">{item.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-white">
                        {item.primaryGas}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-zinc-200">{item.flow.toLocaleString()} Nm³/h</td>
                    <td className="py-3 text-zinc-400">{share}%</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        item.status === 'Optimal' ? 'bg-zinc-900 border-zinc-600 text-white' :
                        item.status === 'High Consumption' ? 'bg-zinc-900 border-white text-white font-black' :
                        item.status === 'Holder Storage Only' ? 'bg-zinc-900 border-zinc-700 text-zinc-300' :
                        'bg-zinc-900 border-zinc-700 text-zinc-400'
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
      </ParticleCard>
    </div>
  );
};

export default GasConsumptionView;
