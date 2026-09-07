import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { Sliders, Play, RotateCcw, DollarSign, Leaf, Activity } from 'lucide-react';

export const SimulationWorkspace: React.FC = () => {
  const { simParams, setSimParams } = useGasData();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{
    netBalanceDelta: number;
    hourlyCostDelta: number;
    carbonDelta: number;
    depletionHours: number;
  } | null>(null);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      let balanceDelta = 0;
      if (simParams.bf1Shutdown) balanceDelta -= 465000;
      if (simParams.cob2Maintenance) balanceDelta -= 62000;
      balanceDelta -= (simParams.rollingMillRampUp - 100) * 3400;
      balanceDelta += (simParams.flareLossReduction - 85) * 1200;

      const hourlyCost = Math.abs(balanceDelta) * (simParams.externalGasPrice / 10000);
      const carbon = Math.abs(balanceDelta) * 0.00018;

      setSimResults({
        netBalanceDelta: balanceDelta,
        hourlyCostDelta: hourlyCost,
        carbonDelta: carbon,
        depletionHours: balanceDelta < 0 ? Math.abs(68000 / balanceDelta) : 999
      });
      setIsSimulating(false);
    }, 800);
  };

  const handleReset = () => {
    setSimParams({
      bf1Shutdown: false,
      cob2Maintenance: false,
      rollingMillRampUp: 100,
      flareLossReduction: 85,
      externalGasPrice: 8.5
    });
    setSimResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#FF6B00]" />
            Simulation Workspace & What-If Sandbox
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Simulate unit outages, production ramp-ups, gas flare mitigation, and economic impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 space-y-5 shadow-sm">
          <h3 className="font-display text-base font-bold text-[#0F172A] pb-2 border-b border-[#E2E8F0]">
            Simulation Variables & Contingency Controls
          </h3>

          <div className="flex items-center justify-between p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Blast Furnace I (BF-I) Emergency Outage</p>
              <p className="text-[10px] font-mono text-[#64748B]">Simulate -465,000 Nm³/h BF Gas loss</p>
            </div>
            <input 
              type="checkbox" 
              checked={simParams.bf1Shutdown}
              onChange={(e) => setSimParams({ ...simParams, bf1Shutdown: e.target.checked })}
              className="w-4 h-4 accent-[#FF6B00] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Old BPP (Batt 8 & 9) Maintenance Outage</p>
              <p className="text-[10px] font-mono text-[#64748B]">Simulate -62,000 Nm³/h CO Gas loss</p>
            </div>
            <input 
              type="checkbox" 
              checked={simParams.cob2Maintenance}
              onChange={(e) => setSimParams({ ...simParams, cob2Maintenance: e.target.checked })}
              className="w-4 h-4 accent-[#FF6B00] cursor-pointer"
            />
          </div>

          <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#0F172A] font-bold">Rolling Mill Production Demand Rate</span>
              <span className="text-[#FF6B00] font-bold">{simParams.rollingMillRampUp}%</span>
            </div>
            <input 
              type="range"
              min="50"
              max="150"
              value={simParams.rollingMillRampUp}
              onChange={(e) => setSimParams({ ...simParams, rollingMillRampUp: Number(e.target.value) })}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
          </div>

          <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#0F172A] font-bold">Flare Gas Recovery Efficiency</span>
              <span className="text-[#059669] font-bold">{simParams.flareLossReduction}%</span>
            </div>
            <input 
              type="range"
              min="50"
              max="98"
              value={simParams.flareLossReduction}
              onChange={(e) => setSimParams({ ...simParams, flareLossReduction: Number(e.target.value) })}
              className="w-full accent-[#059669] cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex-1 py-2.5 bg-flame-gradient text-white rounded font-mono text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md glow-flame"
            >
              <Play className="w-4 h-4" />
              {isSimulating ? 'Computing Neural Model...' : 'Run Simulation Model'}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2.5 bg-[#F1F3F5] text-[#334155] border border-[#CBD5E1] rounded font-mono text-xs font-bold hover:bg-[#E9ECEF] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col shadow-sm">
          <h3 className="font-display text-base font-bold text-[#0F172A] pb-2 border-b border-[#E2E8F0] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF6B00]" />
            Simulated Contingency Impact Matrix
          </h3>

          {simResults ? (
            <div className="space-y-4 mt-4 flex-1">
              <div className="p-4 bg-[#F8F9FA] border border-[#DC2626]/40 rounded-lg">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold">Net Supply Balance Shift</span>
                <p className={`text-2xl font-mono font-bold mt-1 ${simResults.netBalanceDelta < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                  {simResults.netBalanceDelta > 0 ? `+${simResults.netBalanceDelta.toLocaleString()}` : simResults.netBalanceDelta.toLocaleString()} Nm³/h
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
                  <div className="flex items-center gap-1 text-[#D97706] text-xs font-mono mb-1 font-bold">
                    <DollarSign className="w-4 h-4" />
                    <span>Hourly Cost Delta</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-[#0F172A]">${simResults.hourlyCostDelta.toFixed(0)} / hr</p>
                </div>

                <div className="p-4 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
                  <div className="flex items-center gap-1 text-[#059669] text-xs font-mono mb-1 font-bold">
                    <Leaf className="w-4 h-4" />
                    <span>Carbon Impact</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-[#0F172A]">{simResults.carbonDelta.toFixed(1)} tCO2e/hr</p>
                </div>
              </div>

              <div className="p-4 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
                <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold">Estimated Gasholder Buffer Depletion Window</span>
                <p className="text-base font-mono font-bold text-[#D97706] mt-1">
                  {simResults.depletionHours < 900 ? `${simResults.depletionHours.toFixed(1)} hours remaining` : 'Holder level stable'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#64748B] font-mono text-xs border border-dashed border-[#CBD5E1] rounded mt-4">
              <Sliders className="w-8 h-8 text-[#CBD5E1] mb-2" />
              <span>Adjust simulation parameters on the left and click "Run Simulation Model" to preview impacts.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
