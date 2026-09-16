import React, { useState } from 'react';
import { Factory, Filter } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ParticleCard } from '../../components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { PLANT_GENERATORS } from '../../data/plantData';

export const GasGenerationView: React.FC = () => {
  const [filterGas, setFilterGas] = useState<'ALL' | 'BF Gas' | 'CO Gas' | 'LD Gas'>('ALL');

  const allGenerationUnits = PLANT_GENERATORS.map(g => ({
    name: g.name,
    gas: g.gasType,
    output: g.grossCapacity,
    maxCapacity: Math.round(g.grossCapacity * 1.08),
    efficiency: g.gasType === 'BF Gas' ? 95.8 : g.gasType === 'CO Gas' ? 96.0 : 89.5,
    status: 'Normal',
    pressure: `${g.pressure} kPa`,
    temp: g.gasType === 'BF Gas' ? '180°C' : g.gasType === 'CO Gas' ? '820°C' : '1240°C'
  }));

  const filteredUnits = filterGas === 'ALL'
    ? allGenerationUnits
    : allGenerationUnits.filter(u => u.gas === filterGas);

  const totalOutput = filteredUnits.reduce((acc, u) => acc + u.output, 0);

  const chartData = {
    labels: filteredUnits.map(u => u.name),
    datasets: [
      {
        label: 'Current Production (Nm³/h)',
        data: filteredUnits.map(u => u.output),
        backgroundColor: '#FFFFFF',
        borderColor: '#E4E4E7',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        label: 'Max Nameplate Capacity (Nm³/h)',
        data: filteredUnits.map(u => u.maxCapacity),
        backgroundColor: '#3F3F46',
        borderColor: '#27272A',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#FFFFFF', font: { family: 'Agrandir, sans-serif', size: 11, weight: 600 } } },
      tooltip: { backgroundColor: '#18181B', borderColor: '#3F3F46', borderWidth: 1, titleColor: '#FFFFFF', bodyColor: '#FAFAFA', titleFont: { family: 'Agrandir, sans-serif' }, bodyFont: { family: 'Roboto Mono, monospace' } }
    },
    scales: {
      x: { ticks: { color: '#A1A1AA', font: { family: 'Roboto Mono, monospace', size: 10 } }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: '#A1A1AA', font: { family: 'Roboto Mono, monospace', size: 10 } }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Title & Filter Options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Factory className="w-6 h-6 text-white" />
            Gas Generation Intelligence
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Real-time volumetric generation output from primary iron & steelmaking units (Filtered Output: {(totalOutput / 1000).toFixed(1)}k Nm³/h).
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 p-1 rounded-lg font-mono text-xs shadow-sm">
          <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
          <button
            onClick={() => setFilterGas('ALL')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterGas === 'ALL' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Streams ({allGenerationUnits.length})
          </button>
          <button
            onClick={() => setFilterGas('BF Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterGas === 'BF Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            BF Gas (6)
          </button>
          <button
            onClick={() => setFilterGas('CO Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterGas === 'CO Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            CO Gas (2)
          </button>
          <button
            onClick={() => setFilterGas('LD Gas')}
            className={`px-3 py-1 rounded cursor-pointer transition-colors font-bold ${
              filterGas === 'LD Gas' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            LD Gas (2)
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-mono text-base font-bold text-white">
            Unit Generation Output vs Nameplate Capacity ({filterGas === 'ALL' ? 'All Gas Streams' : filterGas})
          </h3>
          <span className="text-xs font-mono text-white font-bold px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-md">
            Total Active Generation: {totalOutput.toLocaleString()} Nm³/h
          </span>
        </div>
        <div className="h-[260px] w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </ParticleCard>

      {/* Unit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map((unit, idx) => (
          <ParticleCard key={idx} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 relative hover:border-white transition-all shadow-lg text-white">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-mono font-bold text-white text-sm">{unit.name}</h4>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                  {unit.gas}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 text-white border border-zinc-700">
                {unit.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono mt-4">
              <div className="flex justify-between text-zinc-400">
                <span>Volumetric Output:</span>
                <span className="text-white font-bold">{(unit.output / 1000).toFixed(1)}k Nm³/h</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Operating Efficiency:</span>
                <span className="text-zinc-200 font-bold">{unit.efficiency}%</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Header Pressure:</span>
                <span className="text-white font-bold">{unit.pressure}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Clean Gas Temp:</span>
                <span className="text-white font-bold">{unit.temp}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>Load Factor</span>
                <span>{((unit.output / unit.maxCapacity) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden border border-zinc-800">
                <div 
                  className="bg-white h-full rounded transition-all duration-500" 
                  style={{ width: `${(unit.output / unit.maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </ParticleCard>
        ))}
      </div>
    </div>
  );
};

export default GasGenerationView;
