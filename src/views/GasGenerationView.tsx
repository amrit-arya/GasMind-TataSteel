import React from 'react';
import { Factory } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const GasGenerationView: React.FC = () => {
  const generationUnits = [
    { name: 'Blast Furnace 1 (BF-1)', gas: 'BF Gas', output: 430000, maxCapacity: 450000, efficiency: 95.5, status: 'Normal', pressure: '14.5 kPa', temp: '180°C' },
    { name: 'Blast Furnace 2 (BF-2)', gas: 'BF Gas', output: 420000, maxCapacity: 450000, efficiency: 93.3, status: 'Warning', pressure: '13.9 kPa', temp: '175°C' },
    { name: 'Coke Oven Battery 1', gas: 'CO Gas', output: 310000, maxCapacity: 325000, efficiency: 95.3, status: 'Normal', pressure: '29.0 kPa', temp: '820°C' },
    { name: 'Coke Oven Battery 2', gas: 'CO Gas', output: 310000, maxCapacity: 325000, efficiency: 95.3, status: 'Normal', pressure: '28.0 kPa', temp: '815°C' },
    { name: 'LD Converter Plant (SMS-2)', gas: 'LD Gas', output: 250000, maxCapacity: 280000, efficiency: 89.2, status: 'Normal', pressure: '18.0 kPa', temp: '1250°C' }
  ];

  const chartData = {
    labels: generationUnits.map(u => u.name),
    datasets: [
      {
        label: 'Current Production (Nm³/h)',
        data: generationUnits.map(u => u.output),
        backgroundColor: '#FF6B00',
        borderRadius: 4
      },
      {
        label: 'Max Nameplate Capacity (Nm³/h)',
        data: generationUnits.map(u => u.maxCapacity),
        backgroundColor: '#E2E8F0',
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#334155', font: { family: 'JetBrains Mono', size: 11, weight: 600 } } },
      tooltip: { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderWidth: 1, titleColor: '#0F172A', bodyColor: '#0F172A' }
    },
    scales: {
      x: { ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }, grid: { color: '#E2E8F0' } },
      y: { ticks: { color: '#64748B', font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: '#E2E8F0' } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Factory className="w-6 h-6 text-[#FF6B00]" />
            Gas Generation Intelligence
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Real-time volumetric output from primary iron & steelmaking units.</p>
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">Unit Generation Output vs Nameplate Capacity</h3>
        <div className="h-[260px] w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generationUnits.map((unit, idx) => (
          <div key={idx} className="bg-white border border-[#CBD5E1] rounded-lg p-5 relative hover:border-[#FF6B00] transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-display font-bold text-[#0F172A] text-sm">{unit.name}</h4>
                <span className="text-xs font-mono text-[#FF6B00] font-semibold">{unit.gas}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                unit.status === 'Warning' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#D1FAE5] text-[#059669]'
              }`}>
                {unit.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono mt-4">
              <div className="flex justify-between text-[#475569]">
                <span>Volumetric Output:</span>
                <span className="text-[#0F172A] font-bold">{(unit.output / 1000).toFixed(0)}k Nm³/h</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Operating Efficiency:</span>
                <span className="text-[#059669] font-bold">{unit.efficiency}%</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Header Pressure:</span>
                <span className="text-[#0F172A] font-bold">{unit.pressure}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Clean Gas Temp:</span>
                <span className="text-[#0F172A] font-bold">{unit.temp}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              <div className="flex justify-between text-[10px] font-mono text-[#64748B] mb-1">
                <span>Load Factor</span>
                <span>{((unit.output / unit.maxCapacity) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#F1F3F5] h-2 rounded overflow-hidden border border-[#CBD5E1]">
                <div 
                  className="bg-flame-gradient h-full rounded transition-all duration-500" 
                  style={{ width: `${(unit.output / unit.maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
