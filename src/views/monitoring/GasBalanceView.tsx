import React from 'react';
import { useGasData } from '../../context';
import { Scale, Database, ArrowUpRight, ArrowDownRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ParticleCard } from '../../components';

export const GasBalanceView: React.FC = () => {
  const { gasMetrics } = useGasData();

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'critical' || s === 'deficit') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-950 border border-red-800 text-red-400 inline-flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {status}
        </span>
      );
    }
    if (s === 'warning' || s === 'surplus' || s === 'high buffer') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-950 border border-amber-800 text-amber-400 inline-flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {status}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-900 border border-zinc-700 text-zinc-300 inline-flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 shrink-0 text-zinc-400" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-white" />
            Gas Balance & Storage Intelligence
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">Real-time supply vs demand matrix, gasholder level monitors, and buffer safety management.</p>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-base font-bold text-white mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-white" />
          Gasholder Storage Tanks Level
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasMetrics.slice(0, 3).map((gas) => (
            <ParticleCard key={gas.id} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-mono font-bold text-white text-base">{gas.name} Holder</h4>
                  <p className="text-xs font-mono text-zinc-400">Capacity: {(gas.holderCapacity / 1000).toFixed(0)}k m³</p>
                </div>
                <span className="text-lg font-mono font-bold text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700">{gas.holderLevel}%</span>
              </div>

              <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden my-3 border border-zinc-800">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-white" 
                  style={{ width: `${gas.holderLevel}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-mono text-zinc-400 pt-1">
                <span>Stored Volume:</span>
                <span className="text-white font-bold">{((gas.holderCapacity * gas.holderLevel) / 100).toLocaleString()} m³</span>
              </div>
            </ParticleCard>
          ))}
        </div>
      </div>

      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <h3 className="font-mono text-base font-bold text-white mb-4">Supply-Demand Balance Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase">
              <tr>
                <th className="pb-3 font-bold">Gas Stream</th>
                <th className="pb-3 font-bold">Generation</th>
                <th className="pb-3 font-bold">Consumption</th>
                <th className="pb-3 font-bold">Net Balance</th>
                <th className="pb-3 font-bold">Header Pressure</th>
                <th className="pb-3 font-bold">Calorific Value</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-white">
              {gasMetrics.map((g) => (
                <tr key={g.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    {g.name}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-zinc-200">{(g.generation / 1000).toFixed(0)}k Nm³/h</td>
                  <td className="py-3.5 font-mono font-bold text-zinc-200">
                    {typeof g.consumption === 'number' ? `${(g.consumption / 1000).toFixed(0)}k Nm³/h` : '—'}
                  </td>
                  <td className="py-3.5 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      {g.balance < 0 ? (
                        <ArrowDownRight className="w-4 h-4 text-red-400 font-bold" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                      )}
                      <span className={g.balance < 0 ? 'text-red-400 font-bold' : 'text-white'}>
                        {(g.balance / 1000).toFixed(1)}k Nm³/h
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 text-zinc-400">{g.pressure} kPa</td>
                  <td className="py-3.5 text-zinc-400">{g.calorificValue} kcal/Nm³</td>
                  <td className="py-3.5">
                    {renderStatusBadge(g.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParticleCard>
    </div>
  );
};

export default GasBalanceView;
