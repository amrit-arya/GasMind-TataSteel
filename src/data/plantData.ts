import { GasType } from '../types';

export interface GeneratorModel {
  id: string;
  name: string;
  type: string;
  gasType: GasType;
  grossCapacity: number; // Nm³/h
  internalCons: number;  // Nm³/h
  netOutput: number;     // Nm³/h
  pressure: number;      // kPa
}

export interface ConsumerModel {
  id: string;
  name: string;
  primaryGas: GasType;
  flow: number; // Nm³/h
  status: 'Optimal' | 'High Consumption' | 'Buffer Standard' | 'Holder Storage Only';
  isDirectConsumption: boolean;
}

export const PLANT_GENERATORS: GeneratorModel[] = [
  { id: 'bf-i', name: 'Blast Furnace I', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 465000, internalCons: 194000, netOutput: 271000, pressure: 14.8 },
  { id: 'bf-h', name: 'Blast Furnace H', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 450000, internalCons: 115000, netOutput: 335000, pressure: 14.5 },
  { id: 'bf-g', name: 'Blast Furnace G', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 322000, internalCons: 90000, netOutput: 232000, pressure: 14.2 },
  { id: 'bf-f', name: 'Blast Furnace F', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 240000, internalCons: 80000, netOutput: 160000, pressure: 13.9 },
  { id: 'bf-c', name: 'Blast Furnace C', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 162000, internalCons: 32000, netOutput: 130000, pressure: 13.8 },
  { id: 'bf-e', name: 'Blast Furnace E', type: 'Blast Furnace', gasType: 'BF Gas', grossCapacity: 82200, internalCons: 25000, netOutput: 57200, pressure: 13.5 },
  { id: 'co-new', name: 'New BPP (Batteries 10 & 11)', type: 'Coke Battery', gasType: 'CO Gas', grossCapacity: 80000, internalCons: 0, netOutput: 80000, pressure: 28.5 },
  { id: 'co-old', name: 'Old BPP (Batteries 8 & 9)', type: 'Coke Battery', gasType: 'CO Gas', grossCapacity: 62000, internalCons: 0, netOutput: 62000, pressure: 29.0 },
  { id: 'ld-13', name: 'LD-1 & LD-3 Converter', type: 'Converter', gasType: 'LD Gas', grossCapacity: 85000, internalCons: 0, netOutput: 85000, pressure: 18.2 },
  { id: 'ld-2', name: 'LD-2 Converter', type: 'Converter', gasType: 'LD Gas', grossCapacity: 65000, internalCons: 0, netOutput: 65000, pressure: 17.8 }
];

export const PLANT_CONSUMERS: ConsumerModel[] = [
  // BF Gas Consumers (Total 1,736,000 Nm³/h)
  { id: 'cons-bf-stoves', name: 'BF Internal Consumption (Furnaces I, H, G, F, E, C)', primaryGas: 'BF Gas', flow: 536000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph6-bf', name: 'Power House #6', primaryGas: 'BF Gas', flow: 300000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-coke-plant', name: 'Coke Plant Heating', primaryGas: 'BF Gas', flow: 270000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph3-bf', name: 'Power House #3', primaryGas: 'BF Gas', flow: 190000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph4-bf', name: 'Power House #4', primaryGas: 'BF Gas', flow: 150000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph5-bf', name: 'Power House #5', primaryGas: 'BF Gas', flow: 130000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-hsm-bf', name: 'HSM Mill (BF Gas)', primaryGas: 'BF Gas', flow: 75000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-pellet-bf', name: 'Pellet Plant (BF Gas)', primaryGas: 'BF Gas', flow: 60000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-lcp-bf', name: 'LCP (Lime Calcining Plant)', primaryGas: 'BF Gas', flow: 15000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-tscr-bf', name: 'TSCR (BF Gas)', primaryGas: 'BF Gas', flow: 10000, status: 'Buffer Standard', isDirectConsumption: true },

  // CO Gas Consumers (Total 134,600 Nm³/h)
  { id: 'cons-hsm-co', name: 'HSM Mill (CO Gas)', primaryGas: 'CO Gas', flow: 30000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph4-co', name: 'Power House #4 (CO Gas)', primaryGas: 'CO Gas', flow: 22000, status: 'High Consumption', isDirectConsumption: true },
  { id: 'cons-pellet-co', name: 'Pellet Plant (CO Gas)', primaryGas: 'CO Gas', flow: 18000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-merge-89', name: 'Mergemill (8-9)', primaryGas: 'CO Gas', flow: 8000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-tscr-co', name: 'TSCR (CO Gas)', primaryGas: 'CO Gas', flow: 8000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-crm-co', name: 'CRM (Cold Rolling Mill)', primaryGas: 'CO Gas', flow: 7000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-tpl-co', name: 'TPL (Tinplate Line)', primaryGas: 'CO Gas', flow: 7000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-capl-co', name: 'CAPL (Continuous Annealing)', primaryGas: 'CO Gas', flow: 6000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-ph7-co', name: 'Power House #7', primaryGas: 'CO Gas', flow: 5000, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-tuyeres-co', name: 'BF Tuyeres Total (800 x 6)', primaryGas: 'CO Gas', flow: 4800, status: 'Optimal', isDirectConsumption: true },
  { id: 'cons-mm-co', name: 'MM (Merchant Mill)', primaryGas: 'CO Gas', flow: 4000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-merge-17', name: 'Mergemill (1-7)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-wrm-co', name: 'WRM (Wire Rod Mill)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-ph6-co', name: 'Power House #6 (CO Gas)', primaryGas: 'CO Gas', flow: 3000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-ph5-co', name: 'Power House #5 (CO Gas)', primaryGas: 'CO Gas', flow: 2000, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-tube-co', name: 'Tube Division', primaryGas: 'CO Gas', flow: 1500, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-sp-co', name: 'SP (Sinter Plant 1-4)', primaryGas: 'CO Gas', flow: 1200, status: 'Buffer Standard', isDirectConsumption: true },
  { id: 'cons-ph3-co', name: 'Power House #3 (CO Gas)', primaryGas: 'CO Gas', flow: 1100, status: 'Buffer Standard', isDirectConsumption: true },

  // LD Gas Storage Buffer (Direct Line Consumption: N/A)
  { id: 'cons-ld-storage', name: 'LD Gasholder 50k Storage (Buffer Stock Only)', primaryGas: 'LD Gas', flow: 150000, status: 'Holder Storage Only', isDirectConsumption: false }
];

export const STREAM_BASELINES = {
  BF: { generation: 1721200, consumption: 1736000, balance: -14800 },
  CO: { generation: 142000, consumption: 134600, balance: 7400 },
  LD: { generation: 150000, consumption: 'unavailable' as const, balance: 150000 },
  NAT: { generation: 0, consumption: 115000, balance: 0 }
};
