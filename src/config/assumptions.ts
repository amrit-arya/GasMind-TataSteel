/**
 * GASMIND Operational Assumptions & Baseline Parameters
 * 
 * Provenance Note:
 * The values below represent plant engineering specifications, vessel vessel stock baselines,
 * or SCADA telemetry setpoints not directly provided in the primary Excel flow rate dataset.
 */

export const HOLDER_ASSUMPTIONS = {
  // Provenance: SCADA Gasholder Compound Specification (Vessel #1)
  BF_HOLDER_CAPACITY: 100000, // m³ Max Capacity
  BF_HOLDER_INITIAL_LEVEL: 68, // % SCADA Operating Level (68,000 m³)

  // Provenance: SCADA Gasholder Compound Specification (Vessel #2)
  CO_HOLDER_CAPACITY: 80000,  // m³ Max Capacity
  CO_HOLDER_INITIAL_LEVEL: 84, // % SCADA Operating Level (67,200 m³)

  // Provenance: Steel Melting Shop Converter Recovery Vessel Specification
  LD_HOLDER_CAPACITY: 50000,  // m³ Max Capacity
  LD_HOLDER_INITIAL_LEVEL: 45, // % SCADA Operating Level (22,500 m³)

  // Provenance: Plant Boundary Natural Gas Station Compound Specification
  NAT_HOLDER_CAPACITY: 200000, // m³ Max Capacity
  NAT_HOLDER_INITIAL_LEVEL: 92 // % Standby Capacity Level (184,000 m³)
};

export const GAS_PROPERTIES = {
  // Provenance: Fuel Management Dept Baseline Operating Parameters
  BF_GAS_PRESSURE: 14.2,      // kPa, Blast Furnace Trunk Main Pressure
  BF_GAS_CALORIFIC_VAL: 920,   // kcal/Nm³

  CO_GAS_PRESSURE: 28.5,      // kPa, Coke Battery Distribution Main Pressure
  CO_GAS_CALORIFIC_VAL: 4250,  // kcal/Nm³

  LD_GAS_PRESSURE: 18.0,      // kPa, Steel Melting Shop Recovery Pressure
  LD_GAS_CALORIFIC_VAL: 2100,  // kcal/Nm³

  NAT_GAS_PRESSURE: 45.0,     // kPa, High-Pressure Gas Grid Connection
  NAT_GAS_CALORIFIC_VAL: 8500 // kcal/Nm³
};
