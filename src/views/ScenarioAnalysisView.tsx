import React, { useState } from 'react';
import { 
  TrendingUp, 
  Factory, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Power,
  ShieldAlert
} from 'lucide-react';
import { DistributingFurnaceState, ConsumerDisruptionImpact } from '../types';

const initialFurnaces: DistributingFurnaceState[] = [
  { id: 'bf-i', name: 'Blast Furnace I', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 465000, isOnline: true },
  { id: 'bf-h', name: 'Blast Furnace H', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 450000, isOnline: true },
  { id: 'bf-g', name: 'Blast Furnace G', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 322000, isOnline: true },
  { id: 'bf-f', name: 'Blast Furnace F', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 240000, isOnline: true },
  { id: 'bf-c', name: 'Blast Furnace C', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 162000, isOnline: true },
  { id: 'bf-e', name: 'Blast Furnace E', type: 'Blast Furnace', gasType: 'BF Gas', capacity: 82200, isOnline: true },
  { id: 'cob-new', name: 'New BPP (Batt 10, 11)', type: 'Coke Battery', gasType: 'CO Gas', capacity: 80000, isOnline: true },
  { id: 'cob-old', name: 'Old BPP (Batt 8, 9)', type: 'Coke Battery', gasType: 'CO Gas', capacity: 62000, isOnline: true },
  { id: 'ld-1-3', name: 'LD-1 & LD-3 Converter', type: 'Converter', gasType: 'LD Gas', capacity: 85000, isOnline: true },
  { id: 'ld-2', name: 'LD-2 Converter', type: 'Converter', gasType: 'LD Gas', capacity: 65000, isOnline: true }
];

export const ScenarioAnalysisView: React.FC = () => {
  const [furnaces, setFurnaces] = useState<DistributingFurnaceState[]>(initialFurnaces);

  const toggleFurnace = (id: string) => {
    setFurnaces(prev => prev.map(f => f.id === id ? { ...f, isOnline: !f.isOnline } : f));
  };

  const setAllFurnaces = (online: boolean) => {
    setFurnaces(prev => prev.map(f => ({ ...f, isOnline: online })));
  };

  const totalBfSupply = furnaces.filter(f => f.gasType === 'BF Gas' && f.isOnline).reduce((acc, f) => acc + f.capacity, 0);
  const totalCoSupply = furnaces.filter(f => f.gasType === 'CO Gas' && f.isOnline).reduce((acc, f) => acc + f.capacity, 0);

  const computeConsumerImpacts = (): ConsumerDisruptionImpact[] => {
    const bfRatio = totalBfSupply / 1721200;
    const coRatio = totalCoSupply / 142000;

    const hsmAvailable = Math.min(340000, 340000 * coRatio);
    const hsmLoad = Math.round((hsmAvailable / 340000) * 100);
    const hsmStatus = hsmLoad >= 98 ? 'Nominal' : hsmLoad >= 60 ? 'Throttled' : 'Critical Outage';
    const hsmAction = hsmLoad >= 98 
      ? 'Firing at 100% optimal rating.' 
      : hsmLoad >= 60 
      ? 'Furnace push speed reduced by 30%. Drawing CO Holder buffer.' 
      : 'Reheating furnace emergency shutdown initiated.';

    const ppRequired = 520000;
    const ppAvailableBf = Math.min(380000, 380000 * bfRatio);
    const ppAvailableCo = Math.min(140000, 140000 * coRatio);
    const ppTotalAvail = ppAvailableBf + ppAvailableCo;
    const ppDeficit = ppRequired - ppTotalAvail;
    const ppLoad = Math.round((ppTotalAvail / ppRequired) * 100);
    const ppStatus = ppDeficit <= 10000 ? 'Nominal' : ppDeficit < 150000 ? 'Fuel-Switched' : 'Throttled';
    const ppAction = ppDeficit <= 10000 
      ? 'Boilers operating nominally on mixed gas firing.' 
      : `Boiler 3 switched to Imported Natural Gas buffer (+${(ppDeficit / 1000).toFixed(0)}k Nm³/h equiv).`;

    const sinterAvail = Math.min(240000, 240000 * bfRatio);
    const sinterLoad = Math.round((sinterAvail / 240000) * 100);
    const sinterStatus = sinterLoad >= 95 ? 'Nominal' : sinterLoad >= 50 ? 'Throttled' : 'Critical Outage';
    const sinterAction = sinterLoad >= 95 
      ? 'Ignition hood firing nominally.' 
      : 'Sinter machine line speed reduced to match lower BF Gas pressure.';

    const pelletAvail = Math.min(210000, 210000 * coRatio);
    const pelletLoad = Math.round((pelletAvail / 210000) * 100);
    const pelletStatus = pelletLoad >= 95 ? 'Nominal' : 'Throttled';
    const pelletAction = pelletLoad >= 95 
      ? 'Induration furnace operating normally.' 
      : 'Burners operating at reduced thermal load. Supplementary oil firing standby.';

    return [
      {
        id: 'c-1',
        name: 'Hot Strip Mill Reheating Furnace',
        primaryGasType: 'CO Gas',
        requiredFlow: 340000,
        availableFlow: hsmAvailable,
        operatingLoadPercentage: hsmLoad,
        status: hsmStatus,
        actionTaken: hsmAction,
        costDelta: (340000 - hsmAvailable) * 0.008
      },
      {
        id: 'c-2',
        name: 'Thermal Power Plant (Boilers 1-4)',
        primaryGasType: 'BF Gas',
        requiredFlow: 520000,
        availableFlow: ppTotalAvail,
        operatingLoadPercentage: ppLoad,
        status: ppStatus,
        actionTaken: ppAction,
        costDelta: ppDeficit * 0.012
      },
      {
        id: 'c-3',
        name: 'Sintering Plant 3',
        primaryGasType: 'BF Gas',
        requiredFlow: 240000,
        availableFlow: sinterAvail,
        operatingLoadPercentage: sinterLoad,
        status: sinterStatus,
        actionTaken: sinterAction,
        costDelta: (240000 - sinterAvail) * 0.006
      },
      {
        id: 'c-4',
        name: 'Pelletizing Plant',
        primaryGasType: 'CO Gas',
        requiredFlow: 210000,
        availableFlow: pelletAvail,
        operatingLoadPercentage: pelletLoad,
        status: pelletStatus,
        actionTaken: pelletAction,
        costDelta: (210000 - pelletAvail) * 0.007
      }
    ];
  };

  const consumerImpacts = computeConsumerImpacts();
  const totalCostDelta = consumerImpacts.reduce((acc, c) => acc + c.costDelta, 0);

  return (
    <div className="space-y-6">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#FF6B00]" />
            Scenario Analysis & Real-Time Consumer Disruption Matrix
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">
            Simulate real-time cascade effects on downstream industrial consumers when distributing furnaces trip or resume operation.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAllFurnaces(true)}
            className="px-3 py-1.5 bg-[#D1FAE5] text-[#059669] border border-[#059669]/30 rounded text-xs font-mono font-bold hover:bg-[#A7F3D0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Bring All Online
          </button>
          <button 
            onClick={() => setAllFurnaces(false)}
            className="px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/30 rounded text-xs font-mono font-bold hover:bg-[#FCA5A5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Total Network Trip
          </button>
        </div>
      </div>

      {/* Distributing Furnaces Control Panel (Top Row) */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Factory className="w-5 h-5 text-[#FF6B00]" />
              Distributing Furnaces & Generation Units Control
            </h3>
            <p className="text-xs text-[#64748B] font-mono">Toggle unit operational states to view immediate downstream impacts.</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#059669] font-bold">Online: {furnaces.filter(f => f.isOnline).length} / {furnaces.length}</span>
            <span className="text-[#DC2626] font-bold">Tripped: {furnaces.filter(f => !f.isOnline).length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {furnaces.map((furnace) => (
            <div 
              key={furnace.id}
              onClick={() => toggleFurnace(furnace.id)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all duration-200 relative select-none flex flex-col justify-between
                ${furnace.isOnline 
                  ? 'bg-white border-[#CBD5E1] hover:border-[#FF6B00] shadow-sm' 
                  : 'bg-[#FEE2E2]/30 border-[#DC2626] ring-1 ring-[#DC2626] shadow-md'}
              `}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`p-1.5 rounded ${furnace.isOnline ? 'bg-[#FFF3E0] text-[#FF6B00]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                    <Power className="w-4 h-4" />
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    furnace.isOnline ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#DC2626] text-white animate-pulse'
                  }`}>
                    {furnace.isOnline ? 'ONLINE' : 'TRIPPED'}
                  </span>
                </div>

                <h4 className="font-display font-bold text-xs text-[#0F172A] mb-1 line-clamp-1">{furnace.name}</h4>
                <p className="text-[11px] font-mono text-[#FF6B00] font-bold">{furnace.gasType}</p>
                <p className="text-[11px] font-mono text-[#64748B] mt-1">{(furnace.capacity / 1000).toFixed(0)}k Nm³/h</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[10px] font-mono">
                <span className="text-[#64748B]">Click to Toggle</span>
                <span className={`font-bold ${furnace.isOnline ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                  {furnace.isOnline ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Affected Consumers Matrix */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#E2E8F0] gap-2">
          <div>
            <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF6B00]" />
              Real-Time Disruption Matrix Across Downstream Consumers
            </h3>
            <p className="text-xs text-[#64748B] font-mono">Live volumetric availability, load factors, and automatic emergency actions.</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono bg-[#F8F9FA] px-3 py-1.5 rounded border border-[#CBD5E1]">
            <span className="text-[#64748B]">Simulated Hourly Financial Impact:</span>
            <span className={`font-bold text-sm ${totalCostDelta > 0 ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
              {totalCostDelta > 0 ? `+$${totalCostDelta.toFixed(0)}/hr cost penalty` : '$0/hr (Optimal)'}
            </span>
          </div>
        </div>

        {/* Consumer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consumerImpacts.map((consumer) => {
            const statusBg = 
              consumer.status === 'Nominal' ? 'bg-[#D1FAE5] text-[#059669] border-[#059669]/30' :
              consumer.status === 'Fuel-Switched' ? 'bg-[#FFF3E0] text-[#FF6B00] border-[#FF6B00]/40' :
              consumer.status === 'Throttled' ? 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30' :
              'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30';

            return (
              <div 
                key={consumer.id}
                className="p-4 bg-white border border-[#CBD5E1] rounded-lg hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  consumer.status === 'Nominal' ? 'bg-[#059669]' :
                  consumer.status === 'Fuel-Switched' ? 'bg-[#FF6B00]' :
                  consumer.status === 'Throttled' ? 'bg-[#D97706]' : 'bg-[#DC2626]'
                }`} />

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0F172A]">{consumer.name}</h4>
                    <span className="text-xs font-mono text-[#FF6B00] font-bold">Primary Fuel: {consumer.primaryGasType}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${statusBg}`}>
                    {consumer.status}
                  </span>
                </div>

                {/* Operating Load Progress */}
                <div className="space-y-1 my-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#64748B]">Consumer Load Factor</span>
                    <span className="font-bold text-[#0F172A]">{consumer.operatingLoadPercentage}% Operating Load</span>
                  </div>
                  <div className="w-full bg-[#F1F3F5] h-2.5 rounded-full overflow-hidden border border-[#CBD5E1]">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        consumer.operatingLoadPercentage >= 95 ? 'bg-[#059669]' :
                        consumer.operatingLoadPercentage >= 60 ? 'bg-[#FF6B00]' : 'bg-[#DC2626]'
                      }`}
                      style={{ width: `${consumer.operatingLoadPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F8F9FA] p-2.5 rounded border border-[#E2E8F0] mb-3">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Required Demand</span>
                    <span className="font-bold text-[#0F172A]">{(consumer.requiredFlow / 1000).toFixed(0)}k Nm³/h</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Available Supply</span>
                    <span className={`font-bold ${consumer.availableFlow < consumer.requiredFlow ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                      {(consumer.availableFlow / 1000).toFixed(0)}k Nm³/h
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#FEF3C7]/30 border border-[#D97706]/30 rounded text-xs font-mono">
                  <p className="text-[#D97706] font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>Action Protocol: {consumer.actionTaken}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
