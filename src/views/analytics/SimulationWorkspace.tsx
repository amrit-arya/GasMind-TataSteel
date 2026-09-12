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
  AlertCircle
} from 'lucide-react';
import { ParticleCard } from '../../components';

interface GeneratorOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  lossRate: number;
}

interface ConsumerOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  reductionRate: number;
}

const generators: GeneratorOption[] = [
  { id: 'bf-i', name: 'Blast Furnace I (-465,000 Nm³/h)', gasType: 'BF Gas', lossRate: 465000 },
  { id: 'bf-h', name: 'Blast Furnace H (-450,000 Nm³/h)', gasType: 'BF Gas', lossRate: 450000 },
  { id: 'bf-g', name: 'Blast Furnace G (-322,000 Nm³/h)', gasType: 'BF Gas', lossRate: 322000 },
  { id: 'bf-f', name: 'Blast Furnace F (-240,000 Nm³/h)', gasType: 'BF Gas', lossRate: 240000 },
  { id: 'bf-c', name: 'Blast Furnace C (-162,000 Nm³/h)', gasType: 'BF Gas', lossRate: 162000 },
  { id: 'bf-e', name: 'Blast Furnace E (-82,200 Nm³/h)', gasType: 'BF Gas', lossRate: 82200 },
  { id: 'co-old', name: 'Old BPP Batt 8,9 (-62,000 Nm³/h)', gasType: 'CO Gas', lossRate: 62000 },
  { id: 'co-new', name: 'New BPP Batt 10,11 (-80,000 Nm³/h)', gasType: 'CO Gas', lossRate: 80000 },
  { id: 'ld-1-3', name: 'LD-1 & LD-3 Converter (-85,000 Nm³/h)', gasType: 'LD Gas', lossRate: 85000 },
  { id: 'ld-2', name: 'LD-2 Converter (-65,000 Nm³/h)', gasType: 'LD Gas', lossRate: 65000 }
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

  // Event state
  const [selectedGenerator, setSelectedGenerator] = useState<string>('none');
  const [selectedConsumer, setSelectedConsumer] = useState<string>('none');
  const [generationScale, setGenerationScale] = useState<number>(100);
  const [consumptionScale, setConsumptionScale] = useState<number>(100);

  const [isComputing, setIsComputing] = useState(false);
  const [simulationRun, setSimulationRun] = useState(false);
  const [lastAuditId, setLastAuditId] = useState<string | null>(null);

  // Baselines from Excel dataset
  const bfBaseGen = 1721200;
  const bfBaseCons = 1736000;
  const coBaseGen = 142000;
  const coBaseCons = 134600;
  const ldBaseGen = 150000;

  // Calculate simulated values
  const genLoss = selectedGenerator !== 'none' 
    ? generators.find(g => g.id === selectedGenerator)?.lossRate || 0 
    : 0;
  
  const genGasType = selectedGenerator !== 'none'
    ? generators.find(g => g.id === selectedGenerator)?.gasType
    : null;

  const consDrop = selectedConsumer !== 'none'
    ? consumers.find(c => c.id === selectedConsumer)?.reductionRate || 0
    : 0;

  const consGasType = selectedConsumer !== 'none'
    ? consumers.find(c => c.id === selectedConsumer)?.gasType
    : null;

  // Net streams after events
  let simBfGen = (bfBaseGen * (generationScale / 100)) - (genGasType === 'BF Gas' ? genLoss : 0);
  let simBfCons = (bfBaseCons * (consumptionScale / 100)) - (consGasType === 'BF Gas' ? consDrop : 0);
  let simBfBal = simBfGen - simBfCons;

  let simCoGen = (coBaseGen * (generationScale / 100)) - (genGasType === 'CO Gas' ? genLoss : 0);
  let simCoCons = (coBaseCons * (consumptionScale / 100)) - (consGasType === 'CO Gas' ? consDrop : 0);
  let simCoBal = simCoGen - simCoCons;

  let simLdGen = (ldBaseGen * (generationScale / 100)) - (genGasType === 'LD Gas' ? genLoss : 0);

  // Depletion windows
  const bfDepletionHours = simBfBal < 0 ? Math.abs(68000 / simBfBal) : 999;
  const coDepletionHours = simCoBal < 0 ? Math.abs(67200 / simCoBal) : 999;

  const handleRunSimulation = () => {
    if (!operatorName.trim() || !operatorDesignation.trim()) {
      setValidationError('Operator Name and Designation are mandatory to execute simulation and log audit record.');
      return;
    }

    setValidationError(null);
    setIsComputing(true);
    
    setTimeout(() => {
      setIsComputing(false);
      setSimulationRun(true);

      const genObj = generators.find(g => g.id === selectedGenerator);
      const consObj = consumers.find(c => c.id === selectedConsumer);

      const resultDesc = `Simulated Net BF Balance: ${simBfBal > 0 ? '+' : ''}${simBfBal.toLocaleString()} Nm³/h | Net CO Balance: ${simCoBal > 0 ? '+' : ''}${simCoBal.toLocaleString()} Nm³/h. ` +
        (simBfBal < 0 ? `BF Gasholder depletion window: ${bfDepletionHours.toFixed(2)} hours.` : `BF Gasholder buffer safe.`);

      addAuditLog({
        category: 'simulation',
        userName: operatorName,
        userDesignation: operatorDesignation,
        userDepartment: operatorDept,
        actionTitle: `Simulation Executed: Gen: ${selectedGenerator !== 'none' ? genObj?.name : 'Nominal'}, Cons: ${selectedConsumer !== 'none' ? consObj?.name : 'Nominal'}`,
        details: {
          targetEquipment: selectedGenerator !== 'none' ? genObj?.name : selectedConsumer !== 'none' ? consObj?.name : 'All Plant Nodes',
          parametersUsed: {
            outageGenerator: selectedGenerator,
            outageConsumer: selectedConsumer,
            generationScale: `${generationScale}%`,
            consumptionScale: `${consumptionScale}%`
          },
          resultsProduced: resultDesc,
          netDeficitSurplus: `${simBfBal > 0 ? '+' : ''}${simBfBal.toLocaleString()} Nm³/h (BF Gas)`,
          mitigationStatus: simBfBal < 0 ? 'Action Required: Priority Redistribution Generated' : 'Normal Operation Maintained'
        }
      });

      setLastAuditId(`AUD-SIM-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 600);
  };

  const handleReset = () => {
    setSelectedGenerator('none');
    setSelectedConsumer('none');
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
            Simulate generator failures, consumer outages, load changes, and inspect priority-based gas redistribution logic.
          </p>
        </div>
      </div>

      {/* Grid Layout: Control Panel (Left) & Live Impact Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-5 shadow-lg relative overflow-hidden">
          {/* Operator Credentials (Mandatory for Audit Trail) */}
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
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Interactive Sandbox</span>
          </div>

          {/* 1. Generator Failure */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-white" />
              Generator Outage / Trip Event
            </label>
            <select
              value={selectedGenerator}
              onChange={(e) => setSelectedGenerator(e.target.value)}
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs font-mono text-white focus:border-white focus:outline-none cursor-pointer"
            >
              <option value="none">-- No Generator Outage (Nominal Baseline) --</option>
              {generators.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Consumer Stop */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-zinc-300" />
              Consumer Shutdown / Stop Event
            </label>
            <select
              value={selectedConsumer}
              onChange={(e) => setSelectedConsumer(e.target.value)}
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs font-mono text-white focus:border-white focus:outline-none cursor-pointer"
            >
              <option value="none">-- No Consumer Shutdown (Nominal Baseline) --</option>
              {consumers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 3. Plant Generation Scale */}
          <div className="p-3 bg-black border border-zinc-800 rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Plant Generation Rate Scale</span>
              <span className="text-white font-bold">{generationScale}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              value={generationScale}
              onChange={(e) => setGenerationScale(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* 4. Plant Consumption Scale */}
          <div className="p-3 bg-black border border-zinc-800 rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-bold">Plant Consumption Demand Scale</span>
              <span className="text-zinc-300 font-bold">{consumptionScale}%</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="150" 
              value={consumptionScale}
              onChange={(e) => setConsumptionScale(Number(e.target.value))}
              className="w-full accent-zinc-300 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleRunSimulation}
              disabled={isComputing}
              className="flex-1 py-2.5 bg-white text-black rounded font-mono text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4" />
              {isComputing ? 'Computing Redistribution Engine...' : 'Run Simulation & Redistribution'}
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

        {/* Live Cascade & Buffer Impact Matrix (7 cols) */}
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
              {simulationRun ? 'Simulation Active' : 'Live Preview'}
            </span>
          </div>

          {/* 3 Stream Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            {/* BF Gas Impact */}
            <div className="p-3.5 bg-black border border-zinc-800 rounded-lg relative overflow-hidden">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">BF Gas Stream</span>
              <p className="text-lg font-bold mt-1 text-white">
                {simBfBal > 0 ? `+${(simBfBal / 1000).toFixed(1)}k` : `${(simBfBal / 1000).toFixed(1)}k`} Nm³/h
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">
                {simBfBal < 0 
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
                {simCoBal < 0 
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
                {selectedGenerator !== 'none' || selectedConsumer !== 'none' || generationScale !== 100 || consumptionScale !== 100
                  ? `Simulated Net Byproduct Shift: ${((simBfBal + simCoBal + simLdGen) / 1000).toFixed(1)}k Nm³/h net gas flow.`
                  : 'Operating at Nominal Baseline. Click "Run Simulation & Redistribution" to trigger prescription.'}
              </span>
            </p>
          </div>
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
                  {selectedGenerator !== 'none' 
                    ? `Generator Trip Detected: ${generators.find(g => g.id === selectedGenerator)?.name}.`
                    : selectedConsumer !== 'none'
                    ? `Consumer Shutdown Detected: ${consumers.find(c => c.id === selectedConsumer)?.name}.`
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
                  {simBfBal < 0 
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
