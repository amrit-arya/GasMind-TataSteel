import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Flame, 
  Factory, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  User,
  UserCheck,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface GeneratorOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  lossRate: number; // Nm³/h
}

interface ConsumerOption {
  id: string;
  name: string;
  gasType: 'BF Gas' | 'CO Gas' | 'LD Gas';
  reductionRate: number; // Nm³/h
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

      const genText = genObj ? genObj.name : 'Nominal Baseline';
      const consText = consObj ? consObj.name : 'Nominal Baseline';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#FF6B00]" />
            Simulation & Smart Gas Redistribution Sandbox
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">
            Simulate generator failures, consumer outages, load changes, and inspect priority-based gas redistribution logic.
          </p>
        </div>
      </div>

      {/* Grid Layout: Control Panel (Left) & Live Impact Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-lg p-5 space-y-5 shadow-sm">
          {/* Operator Credentials (Mandatory for Audit Trail) */}
          <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#FF6B00]" />
                Mandatory Operator Credentials
              </span>
              <span className="px-1.5 py-0.5 bg-[#FF6B00]/10 text-[#FF6B00] text-[9px] font-mono font-bold rounded uppercase">
                Audit Required
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <label className="text-[#64748B] text-[10px] uppercase font-bold block mb-0.5">Operator Name *</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-2 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#FF6B00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#64748B] text-[10px] uppercase font-bold block mb-0.5">Designation *</label>
                  <input
                    type="text"
                    value={operatorDesignation}
                    onChange={(e) => setOperatorDesignation(e.target.value)}
                    placeholder="e.g. Shift In-Charge"
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#FF6B00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#64748B] text-[10px] uppercase font-bold block mb-0.5">Department / Emp ID</label>
                  <input
                    type="text"
                    value={operatorDept}
                    onChange={(e) => setOperatorDept(e.target.value)}
                    placeholder="e.g. Energy Management"
                    className="w-full p-2 bg-white border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:border-[#FF6B00] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {validationError && (
              <div className="p-2 bg-[#FEE2E2] border border-[#DC2626]/30 rounded flex items-center gap-2 text-[#DC2626] text-[11px] font-mono font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6B00]" />
              Event Contingency Triggers
            </h3>
            <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold">Interactive Sandbox</span>
          </div>

          {/* 1. Generator Failure */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-[#FF6B00]" />
              Generator Outage / Trip Event
            </label>
            <select
              value={selectedGenerator}
              onChange={(e) => setSelectedGenerator(e.target.value)}
              className="w-full p-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded text-xs font-mono text-[#0F172A] focus:border-[#FF6B00] focus:outline-none cursor-pointer"
            >
              <option value="none">-- No Generator Outage (Nominal Baseline) --</option>
              {generators.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* 2. Consumer Stop */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[#0F172A] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D97706]" />
              Consumer Shutdown / Stop Event
            </label>
            <select
              value={selectedConsumer}
              onChange={(e) => setSelectedConsumer(e.target.value)}
              className="w-full p-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded text-xs font-mono text-[#0F172A] focus:border-[#FF6B00] focus:outline-none cursor-pointer"
            >
              <option value="none">-- No Consumer Shutdown (Nominal Baseline) --</option>
              {consumers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 3. Plant Generation Scale */}
          <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#0F172A] font-bold">Plant Generation Rate Scale</span>
              <span className="text-[#FF6B00] font-bold">{generationScale}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              value={generationScale}
              onChange={(e) => setGenerationScale(Number(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
          </div>

          {/* 4. Plant Consumption Scale */}
          <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#0F172A] font-bold">Plant Consumption Demand Scale</span>
              <span className="text-[#D97706] font-bold">{consumptionScale}%</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="150" 
              value={consumptionScale}
              onChange={(e) => setConsumptionScale(Number(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleRunSimulation}
              disabled={isComputing}
              className="flex-1 py-2.5 bg-flame-gradient text-white rounded font-mono text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md glow-flame"
            >
              <Play className="w-4 h-4" />
              {isComputing ? 'Computing Redistribution Engine...' : 'Run Simulation & Redistribution'}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2.5 bg-[#F1F3F5] text-[#334155] border border-[#CBD5E1] rounded font-mono text-xs font-bold hover:bg-[#E9ECEF] transition-colors cursor-pointer"
              title="Reset Parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Cascade & Buffer Impact Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-lg p-5 space-y-4 shadow-sm flex flex-col justify-between">
          {simulationRun && lastAuditId && (
            <div className="p-3 bg-[#ECFDF5] border border-[#059669]/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#059669]" />
                <div className="text-xs font-mono">
                  <span className="font-bold text-[#059669]">Audit Trail Record Created: </span>
                  <span className="font-mono text-[#0F172A] font-bold">{lastAuditId}</span>
                  <p className="text-[10px] text-[#64748B]">Logged by {operatorName} ({operatorDesignation})</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('audit')}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#059669] text-white rounded text-[10px] font-mono font-bold hover:bg-[#047857] transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3 h-3" />
                View Audit Trail
              </button>
            </div>
          )}

          <div className="pb-2 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="font-display text-base font-bold text-[#0F172A]">
              Simulated Stream Balances & Buffer Windows
            </h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              simulationRun ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEF3C7] text-[#D97706]'
            }`}>
              {simulationRun ? 'Simulation Active' : 'Live Preview'}
            </span>
          </div>

          {/* 3 Stream Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            {/* BF Gas Impact */}
            <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg relative overflow-hidden">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">BF Gas Stream</span>
              <p className={`text-lg font-bold mt-1 ${simBfBal < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                {simBfBal > 0 ? `+${(simBfBal / 1000).toFixed(1)}k` : `${(simBfBal / 1000).toFixed(1)}k`} Nm³/h
              </p>
              <p className="text-[10px] text-[#64748B] mt-1">
                {simBfBal < 0 
                  ? `Holder Buffer: ${bfDepletionHours.toFixed(1)} hrs left` 
                  : 'Buffer Stock Accumulating'}
              </p>
            </div>

            {/* CO Gas Impact */}
            <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg relative overflow-hidden">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">CO Gas Stream</span>
              <p className={`text-lg font-bold mt-1 ${simCoBal < 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                {simCoBal > 0 ? `+${(simCoBal / 1000).toFixed(1)}k` : `${(simCoBal / 1000).toFixed(1)}k`} Nm³/h
              </p>
              <p className="text-[10px] text-[#64748B] mt-1">
                {simCoBal < 0 
                  ? `Holder Buffer: ${coDepletionHours.toFixed(1)} hrs left` 
                  : 'Surplus to 80k Holder'}
              </p>
            </div>

            {/* LD Gas Impact */}
            <div className="p-3.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg relative overflow-hidden">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">LD Gas Recovery</span>
              <p className="text-lg font-bold text-[#8B5CF6] mt-1">
                +{(simLdGen / 1000).toFixed(1)}k Nm³/h
              </p>
              <p className="text-[10px] text-[#64748B] mt-1">Available Co-Firing Supply</p>
            </div>
          </div>

          {/* Quick Summary Banner */}
          <div className="p-3 bg-[#FFF3E0] border border-[#FF6B00]/30 rounded text-xs font-mono">
            <p className="text-[#FF6B00] font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {selectedGenerator !== 'none' || selectedConsumer !== 'none' || generationScale !== 100 || consumptionScale !== 100
                  ? `Simulated Net Byproduct Shift: ${((simBfBal + simCoBal + simLdGen) / 1000).toFixed(1)}k Nm³/h net gas flow.`
                  : 'Operating at Nominal Baseline. Click "Run Simulation & Redistribution" to trigger prescription.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Priority Allocation & Redistribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority-Based Allocation Protocol Table */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 space-y-3 shadow-sm">
          <div className="pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              Priority-Based Gas Allocation Protocol
            </h3>
            <span className="text-xs font-mono text-[#059669] font-bold">Plant Rule Engine</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Priority 1 */}
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded text-[10px] font-bold uppercase">
                  Priority 1: Critical (Zero Interruption)
                </span>
                <span className="text-[#0F172A] font-bold">274,800 Nm³/h Protected</span>
              </div>
              <p className="text-[#0F172A] font-bold mt-1">Coke Oven Battery Underfiring & Blast Furnace Tuyeres</p>
              <p className="text-[#64748B] text-[11px] mt-0.5">
                Must maintain 100% fuel supply at all times to prevent battery silica refractory collapse and furnace chill.
              </p>
            </div>

            {/* Priority 2 */}
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] rounded text-[10px] font-bold uppercase">
                  Priority 2: High Value Rolling Mills
                </span>
                <span className="text-[#0F172A] font-bold">112,000 Nm³/h Standard</span>
              </div>
              <p className="text-[#0F172A] font-bold mt-1">Hot Strip Mill Reheating Furnace & Cold Rolling Mill</p>
              <p className="text-[#64748B] text-[11px] mt-0.5">
                Draw from 80k CO Gasholder buffer; throttle up to 15% before initiating standby heavy oil firing.
              </p>
            </div>

            {/* Priority 3 */}
            <div className="p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded text-[10px] font-bold uppercase">
                  Priority 3: Flexible Utilities (Boiler Switch)
                </span>
                <span className="text-[#0F172A] font-bold">1,100,000 Nm³/h Flexible</span>
              </div>
              <p className="text-[#0F172A] font-bold mt-1">Power Houses #3, #4, #5, #6 & Sinter Plant</p>
              <p className="text-[#64748B] text-[11px] mt-0.5">
                Co-fire with available LD Gas surplus (+150k Nm³/h) or switch boilers to Imported Natural Gas buffer.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Gas Redistribution Simulation Output */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#FF6B00]" />
              Smart Gas Redistribution Simulation Execution
            </h3>
            <span className="text-xs font-mono text-[#FF6B00] font-bold">Automated Protocol</span>
          </div>

          <div className="space-y-3 font-mono text-xs my-3 flex-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <p className="text-[#0F172A] font-bold">Contingency Event Detection</p>
                <p className="text-[#64748B] text-[11px]">
                  {selectedGenerator !== 'none' 
                    ? `Generator Trip Detected: ${generators.find(g => g.id === selectedGenerator)?.name}.`
                    : selectedConsumer !== 'none'
                    ? `Consumer Shutdown Detected: ${consumers.find(c => c.id === selectedConsumer)?.name}.`
                    : 'System operating at nominal baseline.'}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <span className="w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <p className="text-[#0F172A] font-bold">Gasholder Buffer Deployment</p>
                <p className="text-[#64748B] text-[11px]">
                  {simBfBal < 0 
                    ? `Drawing ${Math.abs(simBfBal).toLocaleString()} Nm³/h from BF 100k Gasholder (Depletion window: ${bfDepletionHours.toFixed(1)} hrs).` 
                    : 'BF Gasholder stock stable.'}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
              <div>
                <p className="text-[#0F172A] font-bold">Priority Protection & LD Gas Co-Firing Rerouting</p>
                <p className="text-[#64748B] text-[11px]">
                  {simBfBal < 0 
                    ? `Rerouting +150,000 Nm³/h LD Gas surplus to Power House #6 boilers. Priority 1 Coke Underfiring protected at 100%.`
                    : 'Priority 1, 2, and 3 consumers receiving full contracted gas rates.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg">
              <span className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
              <div>
                <p className="text-[#0F172A] font-bold">Natural Gas Buffer Fuel Switch & Stabilization</p>
                <p className="text-[#64748B] text-[11px]">
                  {simBfBal < -150000 
                    ? `Initiated Natural Gas buffer fuel-switch (+${(Math.abs(simBfBal + 150000) / 1000).toFixed(0)}k Nm³/h equiv) at Boiler #4.`
                    : 'Plant thermal equilibrium maintained with zero production downtime penalty.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#D1FAE5] border border-[#059669]/30 rounded text-xs font-mono text-[#059669] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Redistribution Protocol Status: Optimal & Active</span>
            </span>
            <span>0% Thermal Outage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
