import React from 'react';
import { Flame } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GasConsumptionView: React.FC = () => {
  const consumers = [
    { name: 'Thermal Power Plant (Boilers 1-4)', primaryGas: 'BF Gas / CO Mix', flow: 520000, share: 30.1, status: 'Optimal' },
    { name: 'Hot Strip Mill Reheating Furnace', primaryGas: 'CO Gas', flow: 340000, share: 19.7, status: 'Optimal' },
    { name: 'Sintering Plant 3', primaryGas: 'BF Gas', flow: 240000, share: 13.9, status: 'Optimal' },
    { name: 'Pelletizing Plant', primaryGas: 'CO Gas', flow: 210000, share: 12.2, status: 'Optimal' },
    { name: 'Coke Oven Heating System', primaryGas: 'BF Gas', flow: 260000, share: 15.1, status: 'Optimal' },
    { name: 'Auxiliary Boilers & Flare Stack', primaryGas: 'Natural Gas / Mixed', flow: 155400, share: 9.0, status: 'Low Efficiency' }
  ];

  const doughnutData = {
    labels: consumers.map(c => c.name),
    datasets: [
      {
        data: consumers.map(c => c.flow),
        backgroundColor: [
          '#FF6B00',
          '#FF3D00',
          '#D97706',
          '#059669',
          '#EC4899',
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
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FF6B00]" />
            Gas Consumption Intelligence
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Consumer breakdown, thermal firing rates, and calorific heat load allocation.</p>
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">Plant-Wide Consumption Share</h3>
        <div className="h-[280px] w-full">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">Industrial Consumer Units Breakdown</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
              <tr>
                <th className="pb-3 font-bold">Consumer Unit</th>
                <th className="pb-3 font-bold">Fuel Mix</th>
                <th className="pb-3 font-bold">Consumption Rate</th>
                <th className="pb-3 font-bold">Share</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {consumers.map((item, i) => (
                <tr key={i} className="hover:bg-[#F8F9FA]">
                  <td className="py-3.5 font-bold text-[#0F172A]">{item.name}</td>
                  <td className="py-3.5 text-[#FF6B00] font-bold">{item.primaryGas}</td>
                  <td className="py-3.5 font-bold">{(item.flow / 1000).toFixed(1)}k Nm³/h</td>
                  <td className="py-3.5 text-[#475569]">{item.share}%</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      item.status === 'Optimal' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
