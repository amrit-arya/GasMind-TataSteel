export type ViewMode = 
  | 'overview'
  | 'generation'
  | 'consumption'
  | 'balance'
  | 'network'
  | 'simulation'
  | 'scenario'
  | 'alerts'
  | 'reports'
  | 'timeline'
  | 'audit'
  | 'about';

export type AuditCategory = 'simulation' | 'report_export' | 'system_alert' | 'parameter_change';

export interface AuditItem {
  id: string;
  timestamp: string;
  category: AuditCategory;
  userName: string;
  userDesignation: string;
  userDepartment?: string;
  actionTitle: string;
  details: {
    targetEquipment?: string;
    parametersUsed?: Record<string, any>;
    resultsProduced?: string;
    exportFormat?: 'PDF' | 'CSV' | 'Excel';
    reportType?: string;
    mitigationStatus?: string;
    netDeficitSurplus?: string;
  };
}

export type GasType = 'BF Gas' | 'CO Gas' | 'LD Gas' | 'Natural Gas';

export interface GasTypeMetrics {
  id: string;
  name: string;
  fullName: string;
  generation: number; // Nm³/h
  consumption: number; // Nm³/h
  balance: number; // Nm³/h
  status: 'Surplus' | 'Deficit' | 'Balanced' | 'Offline';
  pressure: number; // kPa
  calorificValue: number; // kcal/Nm³
  holderLevel: number; // %
  holderCapacity: number; // m³
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'generator' | 'consumer' | 'holder' | 'mixer';
  gasType: GasType;
  flowRate: number; // Nm³/h
  pressure: number; // kPa
  status: 'normal' | 'warning' | 'critical' | 'offline';
  x: number;
  y: number;
  details?: string;
}

export interface NetworkPipeline {
  id: string;
  fromId: string;
  toId: string;
  flowRate: number;
  capacity: number;
  gasType: GasType;
  status: 'active' | 'throttled' | 'reversed' | 'closed';
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  location: string;
  gasType: GasType;
  description: string;
  acknowledged: boolean;
  actionRequired?: string;
}

export interface SimulationParams {
  bf1Shutdown: boolean;
  cob2Maintenance: boolean;
  rollingMillRampUp: number; // %
  flareLossReduction: number; // %
  externalGasPrice: number; // $/MMBtu
}

export interface AIInsight {
  id: string;
  type: 'Deficit Forecast' | 'Optimization Opportunity' | 'Safety Warning' | 'Efficiency Boost';
  severity: 'critical' | 'success' | 'warning' | 'info';
  title: string;
  description: string;
  actionLabel?: string;
  impact: string;
  applied?: boolean;
}

export interface DistributingFurnaceState {
  id: string;
  name: string;
  type: 'Blast Furnace' | 'Coke Battery' | 'Converter';
  gasType: GasType;
  capacity: number; // Nm³/h
  isOnline: boolean;
}

export interface ConsumerDisruptionImpact {
  id: string;
  name: string;
  primaryGasType: GasType;
  requiredFlow: number; // Nm³/h
  availableFlow: number; // Nm³/h
  operatingLoadPercentage: number; // %
  status: 'Nominal' | 'Throttled' | 'Fuel-Switched' | 'Critical Outage';
  actionTaken: string;
  costDelta: number; // $/hr
}
