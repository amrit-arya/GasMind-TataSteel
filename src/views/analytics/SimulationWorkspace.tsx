import React, { useState } from 'react';
import { useGasData } from '../../context';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Flame, 
  Factory, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Power
} from 'lucide-react';
import { ParticleCard } from '../../components';

interface GeneratorOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  lossRate: number;
  internalCons: number;
}

interface ConsumerOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  reductionRate: number;
}

const generators: GeneratorOption[] = [
  { id: 'bf-i', name: 'Blast Furnace I (-465k Nm³/h)', gasType: 'BF Gas', lossRate: 465000, internalCons: 194000 },
  { id: 'bf-h', name: 'Blast Furnace H (-450k Nm³/h)', gasType: 'BF Gas', lossRate: 450000, internalCons: 115000 },
  { id: 'bf-g', name: 'Blast Furnace G (-322k Nm³/h)', gasType: 'BF Gas', lossRate: 322000, internalCons: 90000 },
  { id: 'bf-f', name: 'Blast Furnace F (-240k Nm³/h)', gasType: 'BF Gas', lossRate: 240000, internalCons: 80000 },
  { id: 'bf-c', name: 'Blast Furnace C (-162k Nm³/h)', gasType: 'BF Gas', lossRate: 162000, internalCons: 32000 },
  { id: 'bf-e', name: 'Blast Furnace E (-82.2k Nm³/h)', gasType: 'BF Gas', lossRate: 82200, internalCons: 25000 },
  { id: 'co-old', name: 'Old BPP Batt 8,9 (-62k Nm³/h)', gasType: 'CO Gas', lossRate: 62000, internalCons: 0 },
  { id: 'co-new', name: 'New BPP Batt 10,11 (-80k Nm³/h)', gasType: 'CO Gas', lossRate: 80000, internalCons: 0 },
  { id: 'ld-1-3', name: 'LD-1 & LD-3 Converter (-85k Nm³/h)', gasType: 'LD Gas', lossRate: 85000, internalCons: 0 },
  { id: 'ld-2', name: 'LD-2 Converter (-65k Nm³/h)', gasType: 'LD Gas', lossRate: 65000, internalCons: 0 }
];

const consumers: ConsumerOption[] = [
  { id: 'ph6', name: 'Power House #6 (-300,000 Nm³/h)', gasType: 'BF Gas', reductionRate: 300000 },
  { id: 'coke', name: 'Coke Plant Heating (-270,000 Nm³/h)', gasType: 'BF Gas', reductionRate: 270000 },
  { id: 'ph3', name: 'Power House #3 (-190,000 Nm³/h)', gasType: 'BF Gas', reductionRate: 190000 },
  { id: 'ph4', name: 'Power House #4 (-150,000 Nm³/h)', gasType: 'BF Gas', reductionRate: 150000 },
  { id: 'ph5', name: 'Power House #5 (-130,000 Nm³/h)', gasType: 'BF Gas', reductionRate: 130000 },
  { id: 'hsm', name: 'HSM Mill (-105,000 Nm³/h)', gasType: 'CO Gas', reductionRate: 105000 },
  { id: 'pellet', name: 'Pellet Plant (-78,000 Nm³/h)', gasType: 'CO Gas', reductionRate: 78000 }
];

export const SimulationWorkspace: React.FC = () => {
  const { addAuditLog, setCurrentView } = useGasData();

  // Mandatory Operator Credentials
  const [operatorName, setOperatorName] = useState<string>('Rajesh Kumar');
  const [operatorDesignation, setOperatorDesignation] = useState<string>('Shift In-Charge / Sr. Energy Engineer');
  const [operatorDept, setOperatorDept] = useState<string>('Energy Management Division (EMP-4819)');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Event state: Multi-select arrays for simultaneous outages
  const [selectedGenerators, setSelectedGenerators] = useState<string[]>([]);
  const [selectedConsumers, setSelectedConsumers] = useState<string[]>([]);
  const [generationScale, setGenerationScale] = useState<number>(100);
  const [consumptionScale, setConsumptionScale] = useState<number>(100);

  const [simulationRun, setSimulationRun] = useState(false);
  const [lastAuditId, setLastAuditId] = useState<string | null>(null);

  // Baselines from Excel dataset
  const bfBaseGen = 1721200;
  const bfBaseCons = 1736000;
  const coBaseGen = 142000;
  const coBaseCons = 134600;
  const ldBaseGen = 150000;

  // Calculate outage & internal consumption drops
  let bfLoss = 0, bfInternalConsDrop = 0;
  let coLoss = 0, coInternalConsDrop = 0;
  let ldLoss = 0, ldInternalConsDrop = 0;

  selectedGenerators.forEach(genId => {
    const g = generators.find(item => item.id === genId);
    if (!g) return;
    if (g.gasType === 'BF Gas') {
      bfLoss += g.lossRate;
      bfInternalConsDrop += g.internalCons;
    } else if (g.gasType === 'CO Gas') {
      coLoss += g.lossRate;
      coInternalConsDrop += g.internalCons;
    } else if (g.gasType === 'LD Gas') {
      ldLoss += g.lossRate;
      ldInternalConsDrop += g.internalCons;
    }
  });

  let bfConsDrop = 0, coConsDrop = 0, ldConsDrop = 0;
  selectedConsumers.forEach(consId => {
    const c = consumers.find(item => item.id === consId);
    if (!c) return;
    if (c.gasType === 'BF Gas') bfConsDrop += c.reductionRate;
    else if (c.gasType === 'CO Gas') coConsDrop += c.reductionRate;
    else if (c.gasType === 'LD Gas') ldConsDrop += c.reductionRate;
  });

  // Reordered math: (base - outage) * scale
  let simBfGen = Math.max(0, (bfBaseGen - bfLoss) * (generationScale / 100));
  let simBfCons = Math.max(0, (bfBaseCons - bfInternalConsDrop - bfConsDrop) * (consumptionScale / 100));
  let simBfBal = simBfGen - simBfCons;

  let simCoGen = Math.max(0, (coBaseGen - coLoss) * (generationScale / 100));
  let simCoCons = Math.max(0, (coBaseCons - coInternalConsDrop - coConsDrop) * (consumptionScale / 100));
  let simCoBal = simCoGen - simCoCons;

  let simLdGen = Math.max(0, (ldBaseGen - ldLoss) * (generationScale / 100));

  // Depletion windows (using null instead of 999 sentinel)
  const bfDepletionHours: number | null = simBfBal < 0 ? Math.abs(68000 / simBfBal) : null;
  const coDepletionHours: number | null = simCoBal < 0 ? Math.abs(67200 / simCoBal) : null;

  const toggleGenerator = (id: string) => {
    setSelectedGenerators(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleConsumer = (id: string) => {
    setSelectedConsumers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Instant execution without fake 600ms setTimeout delay
  const handleRunSimulation = () => {
    if (!operatorName.trim() || !operatorDesignation.trim()) {
      setValidationError('Operator Name and Designation are mandatory to execute simulation and log audit record.');
      return;
    }

    setValidationError(null);
    setSimulationRun(true);

    const genNames = selectedGenerators.map(id => generators.find(g => g.id === id)?.name).filter(Boolean).join(', ');
    const consNames = selectedConsumers.map(id => consumers.find(c => c.id === id)?.name).filter(Boolean).join(', ');

    const resultDesc = `Simulated Net BF Balance: ${simBfBal > 0 ? '+' : ''}${simBfBal.toLocaleString()} Nm³/h | Net CO Balance: ${simCoBal > 0 ? '+' : ''}${simCoBal.toLocaleString()} Nm³/h. ` +
      (simBfBal < 0 && bfDepletionHours !== null ? `BF Gasholder depletion window: ${bfDepletionHours.toFixed(2)} hours.` : `BF Gasholder buffer safe.`);

    const createdLog = addAuditLog({
      category: 'simulation',
      userName: operatorName,
      userDesignation: operatorDesignation,
      userDepartment: operatorDept,
      actionTitle: `Simulation Executed: Gen Outages: [${genNames || 'None'}], Cons Shutdowns: [${consNames || 'None'}]`,
      details: {
        targetEquipment: genNames || consNames || 'All Plant Nodes',
        parametersUsed: {
          outageGenerators: selectedGenerators,
          outageConsumers: selectedConsumers,
          generationScale: `${generationScale}%`,
          consumptionScale: `${consumptionScale}%`
        },
        resultsProduced: resultDesc,
        netDeficitSurplus: `${simBfBal > 0 ? '+' : ''}${simBfBal.toLocaleString()} Nm³/h (BF Gas)`,
        mitigationStatus: simBfBal < 0 ? 'Action Required: Priority Redistribution Generated' : 'Normal Operation Maintained'
      }
    });

    setLastAuditId(createdLog.id);
  };

  const handleReset = () => {
    setSelectedGenerators([]);
    setSelectedConsumers([]);
    setGenerationScale(100);
    setConsumptionScale(100);
    setSimulationRun(false);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-white" />
            Simulation & Smart Gas Redistribution Sandbox
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Simulate simultaneous generator trips, consumer outages, load scaling, and inspect prescription gas redistribution logic.
          </p>
        </div>
      </div>

      {/* Grid Layout: Control Panel (Left) & Live Impact Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-5 shadow-lg relative overflow-hidden">
          {/* Operator Credentials */}
          <div className="p-3 bg-black border border-zinc-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-white" />
                Mandatory Operator Credentials
              </span>
              <span className="px-1.5 py-0.5 bg-zinc-900 text-white text-[9px] font-mono font-bold rounded border border-zinc-700 uppercase">
                Audit Required
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-0.5">Operator Name *</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-0.5">Designation *</label>
                  <input
                    type="text"
                    value={operatorDesignation}
                    onChange={(e) => setOperatorDesignation(e.target.value)}
                    placeholder="e.g. Shift In-Charge"
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-0.5">Department / Emp ID</label>
                  <input
                    type="text"
                    value={operatorDept}
                    onChange={(e) => setOperatorDept(e.target.value)}
                    placeholder="e.g. Energy Management"
                    className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {validationError && (
              <div className="p-2 bg-zinc-900 border border-zinc-700 rounded flex items-center gap-2 text-white text-[11px] font-mono font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-white" />
              Event Contingency Triggers
            </h3>
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Multi-Select Enabled</span>
          </div>

          {/* 1. Multi-Select Generator Failure */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-white" />
                Generator Outages / Trips
              </span>
              <span className="text-[10px] text-zinc-400">({selectedGenerators.length} active)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-black border border-zinc-800 rounded max-h-36 overflow-y-auto">
              {generators.map(g => {
                const isSelected = selectedGenerators.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGenerator(g.id)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Power className="w-2.5 h-2.5" />
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Multi-Select Consumer Shutdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-zinc-300" />
                Consumer Shutdowns / Stops
              </span>
              <span className="text-[10px] text-zinc-400">({selectedConsumers.length} active)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-black border border-zinc-800 rounded max-h-36 overflow-y-auto">
              {consumers.map(c => {
                const isSelected = selectedConsumers.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleConsumer(c.id)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-zinc-200 text-black font-extrabold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Flame className="w-2.5 h-2.5" />
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Plant Generation Scale Slider (Widened: 0% to 120%) */}
          <div className="p-3 bg-black border border-zinc-800 rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Plant Generation Rate Scale</span>
              <span className="text-white font-bold">{generationScale}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="120" 
              value={generationScale}
              onChange={(e) => setGenerationScale(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* 4. Plant Consumption Scale Slider (Widened: 50% to 200%) */}
          <div className="p-3 bg-black border border-zinc-800 rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Plant Consumption Demand Scale</span>
              <span className="text-zinc-300 font-bold">{consumptionScale}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="200" 
              value={consumptionScale}
              onChange={(e) => setConsumptionScale(Number(e.target.value))}
              className="w-full accent-zinc-300 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleRunSimulation}
              className="flex-1 py-2.5 bg-white text-black rounded font-mono text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4" />
              Run Simulation & Redistribution
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2.5 bg-zinc-900 text-white border border-zinc-700 rounded font-mono text-xs font-bold hover:border-white transition-colors cursor-pointer"
              title="Reset Parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </ParticleCard>

        {/* Live Cascade & Buffer Impact Matrix (7 cols) - Gated on simulationRun */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between relative overflow-hidden">
          {simulationRun && lastAuditId && (
            <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <div className="text-xs font-mono">
                  <span className="font-bold text-white">Audit Trail Record Created: </span>
                  <span className="font-mono text-white font-bold">{lastAuditId}</span>
                  <p className="text-[10px] text-zinc-400">Logged by {operatorName} ({operatorDesignation})</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('audit')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white text-black rounded text-[10px] font-mono font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3 h-3" />
                View Audit Trail
              </button>
            </div>
          )}

          <div className="pb-2 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-mono text-base font-bold text-white">
              Simulated Stream Balances & Buffer Windows
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
              {simulationRun ? 'Simulation Active' : 'Configure & Run Simulation'}
            </span>
          </div>

          {simulationRun ? (
            <>
              {/* 3 Stream Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                {/* BF Gas Impact */}
                <div className="p-3.5 bg-black border border-zinc-800 rounded-lg relative overflow-hidden">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">BF Gas Stream</span>
                  <p className="text-lg font-bold mt-1 text-white">
                    {simBfBal > 0 ? `+${(simBfBal / 1000).toFixed(1)}k` : `${(simBfBal / 1000).toFixed(1)}k`} Nm³/h
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {simBfBal < 0 && bfDepletionHours !== null
                      ? `Holder Buffer: ${bfDepletionHours.toFixed(1)} hrs left` 
                      : 'Buffer Stock Accumulating'}
                  </p>
                </div>

                {/* CO Gas Impact */}
                <div className="p-3.5 bg-black border border-zinc-800 rounded-lg relative overflow-hidden">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">CO Gas Stream</span>
                  <p className="text-lg font-bold mt-1 text-white">
                    {simCoBal > 0 ? `+${(simCoBal / 1000).toFixed(1)}k` : `${(simCoBal / 1000).toFixed(1)}k`} Nm³/h
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {simCoBal < 0 && coDepletionHours !== null
                      ? `Holder Buffer: ${coDepletionHours.toFixed(1)} hrs left` 
                      : 'Surplus to 80k Holder'}
                  </p>
                </div>

                {/* LD Gas Impact */}
                <div className="p-3.5 bg-black border border-zinc-800 rounded-lg relative overflow-hidden">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">LD Gas Recovery</span>
                  <p className="text-lg font-bold text-white mt-1">
                    +{(simLdGen / 1000).toFixed(1)}k Nm³/h
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Available Co-Firing Supply</p>
                </div>
              </div>

              {/* Quick Summary Banner */}
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono">
                <p className="text-white font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
                  <span>
                    Simulated Net Byproduct Shift: {((simBfBal + simCoBal + simLdGen) / 1000).toFixed(1)}k Nm³/h net gas flow.
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center space-y-3 font-mono">
              <Sliders className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-white">No Simulation Running</p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Configure generator outage triggers, consumer shutdowns, or rate sliders on the left and click 
                <span className="text-white font-bold"> "Run Simulation & Redistribution"</span> to calculate stream balances and audit logs.
              </p>
            </div>
          )}
        </ParticleCard>
      </div>

      {/* Priority Allocation & Redistribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority-Based Allocation Protocol Table */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-lg relative overflow-hidden">
          <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-white" />
              Priority-Based Gas Allocation Protocol
            </h3>
            <span className="text-xs font-mono text-zinc-400 font-bold">Plant Rule Engine</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Priority 1 */}
            <div className="p-3 bg-black border border-zinc-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white rounded text-[10px] font-bold uppercase">
                  Priority 1: Critical (Zero Interruption)
                </span>
                <span className="text-white font-bold">274,800 Nm³/h Protected</span>
              </div>
              <p className="text-white font-bold mt-1">Coke Oven Battery Underfiring & Blast Furnace Tuyeres</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Must maintain 100% fuel supply at all times to prevent battery silica refractory collapse and furnace chill.
              </p>
            </div>

            {/* Priority 2 */}
            <div className="p-3 bg-black border border-zinc-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded text-[10px] font-bold uppercase">
                  Priority 2: High Value Rolling Mills
                </span>
                <span className="text-white font-bold">112,000 Nm³/h Standard</span>
              </div>
              <p className="text-white font-bold mt-1">Hot Strip Mill Reheating Furnace & Cold Rolling Mill</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Draw from 80k CO Gasholder buffer; throttle up to 15% before initiating standby heavy oil firing.
              </p>
            </div>

            {/* Priority 3 */}
            <div className="p-3 bg-black border border-zinc-800 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded text-[10px] font-bold uppercase">
                  Priority 3: Flexible Utilities (Boiler Switch)
                </span>
                <span className="text-white font-bold">1,100,000 Nm³/h Flexible</span>
              </div>
              <p className="text-white font-bold mt-1">Power Houses #3, #4, #5, #6 & Sinter Plant</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Co-fire with available LD Gas surplus (+150k Nm³/h) or switch boilers to Imported Natural Gas buffer.
              </p>
            </div>
          </div>
        </ParticleCard>

        {/* Step-by-Step Gas Redistribution Simulation Output */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-white" />
              Smart Gas Redistribution Simulation Execution
            </h3>
            <span className="text-xs font-mono text-zinc-400 font-bold">Automated Protocol</span>
          </div>

          <div className="space-y-3 font-mono text-xs my-3 flex-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 bg-black border border-zinc-800 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">1</span>
              <div>
                <p className="text-white font-bold">Contingency Event Detection</p>
                <p className="text-zinc-400 text-[11px]">
                  {selectedGenerators.length > 0 
                    ? `Generator Trip(s) Detected: ${selectedGenerators.map(id => generators.find(g => g.id === id)?.name).join(', ')}.`
                    : selectedConsumers.length > 0
                    ? `Consumer Shutdown(s) Detected: ${selectedConsumers.map(id => consumers.find(c => c.id === id)?.name).join(', ')}.`
                    : 'System operating at nominal baseline.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 bg-black border border-zinc-800 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">2</span>
              <div>
                <p className="text-white font-bold">Gasholder Buffer Deployment</p>
                <p className="text-zinc-400 text-[11px]">
                  {simBfBal < 0 && bfDepletionHours !== null
                    ? `Drawing ${Math.abs(simBfBal).toLocaleString()} Nm³/h from BF 100k Gasholder (Depletion window: ${bfDepletionHours.toFixed(1)} hrs).` 
                    : 'BF Gasholder stock stable.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 bg-black border border-zinc-800 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">3</span>
              <div>
                <p className="text-white font-bold">Priority Protection & LD Gas Co-Firing Rerouting</p>
                <p className="text-zinc-400 text-[11px]">
                  {simBfBal < 0 
                    ? `Rerouting +150,000 Nm³/h LD Gas surplus to Power House #6 boilers. Priority 1 Coke Underfiring protected at 100%.`
                    : 'Priority 1, 2, and 3 consumers receiving full contracted gas rates.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 bg-black border border-zinc-800 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-zinc-700">4</span>
              <div>
                <p className="text-white font-bold">Natural Gas Buffer Fuel Switch & Stabilization</p>
                <p className="text-zinc-400 text-[11px]">
                  {simBfBal < -150000 
                    ? `Initiated Natural Gas buffer fuel-switch (+${(Math.abs(simBfBal + 150000) / 1000).toFixed(0)}k Nm³/h equiv) at Boiler #4.`
                    : 'Plant thermal equilibrium maintained with zero production downtime penalty.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-white font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Redistribution Protocol Status: Optimal & Active</span>
            </span>
            <span>0% Thermal Outage</span>
          </div>
        </ParticleCard>
      </div>
    </div>
  );
};

export default SimulationWorkspace;
