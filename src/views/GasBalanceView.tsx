import React from 'react';
import { useGasData } from '../context/GasDataContext';
import { Scale, Database, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const GasBalanceView: React.FC = () => {
  const { gasMetrics } = useGasData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#FF6B00]" />
            Gas Balance & Storage Intelligence
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Real-time supply vs demand matrix, gasholder level monitors, and buffer safety management.</p>
        </div>
      </div>

      <div>
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#FF6B00]" />
          Gasholder Storage Tanks Level
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasMetrics.slice(0, 3).map((gas) => (
            <div key={gas.id} className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-display font-bold text-[#0F172A] text-base">{gas.name} Holder</h4>
                  <p className="text-xs font-mono text-[#64748B]">Capacity: {(gas.holderCapacity / 1000).toFixed(0)}k m³</p>
                </div>
                <span className="text-lg font-mono font-bold text-[#FF6B00]">{gas.holderLevel}%</span>
              </div>

              <div className="w-full bg-[#F1F3F5] h-3 rounded-full overflow-hidden my-3 border border-[#CBD5E1]">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    gas.holderLevel > 80 ? 'bg-[#059669]' : gas.holderLevel > 40 ? 'bg-[#FF6B00]' : 'bg-[#DC2626]'
                  }`} 
                  style={{ width: `${gas.holderLevel}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-mono text-[#475569] pt-1">
                <span>Stored Volume:</span>
                <span className="text-[#0F172A] font-bold">{((gas.holderCapacity * gas.holderLevel) / 100).toLocaleString()} m³</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">Supply-Demand Balance Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
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
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {gasMetrics.map((g) => (
                <tr key={g.id} className="hover:bg-[#F8F9FA]">
                  <td className="py-3.5 font-bold text-[#0F172A] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                    {g.name}
                  </td>
                  <td className="py-3.5 font-mono font-bold">{(g.generation / 1000).toFixed(0)}k Nm³/h</td>
                  <td className="py-3.5 font-mono font-bold">{(g.consumption / 1000).toFixed(0)}k Nm³/h</td>
                  <td className="py-3.5 font-mono font-bold">
                    <span className={`flex items-center gap-1 ${g.balance < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                      {g.balance < 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      {(g.balance / 1000).toFixed(1)}k Nm³/h
                    </span>
                  </td>
                  <td className="py-3.5 text-[#475569]">{g.pressure} kPa</td>
                  <td className="py-3.5 text-[#475569]">{g.calorificValue} kcal/Nm³</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      g.status === 'Deficit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                      g.status === 'Surplus' ? 'bg-[#D1FAE5] text-[#059669]' :
                      'bg-[#FFF3E0] text-[#FF6B00]'
                    }`}>
                      {g.status}
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
