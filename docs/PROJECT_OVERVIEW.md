# 📘 PROJECT OVERVIEW — GASMIND AI

## 1. System Purpose & Industrial Context

In an integrated steel plant (such as Tata Steel), massive volumes of combustible byproduct gases are continuously generated as byproducts of ironmaking, cokemaking, and steelmaking processes:

1. **Blast Furnace Gas (BF Gas)**: Low calorific value gas (~920 kcal/Nm³) produced during iron ore reduction in Blast Furnaces (BF-I, BF-H, BF-G, BF-F, BF-C, BF-E). Serves as the primary fuel for Power House boilers and battery heating.
2. **Coke Oven Gas (CO Gas)**: High calorific value gas (~4,250 kcal/Nm³) produced during coal carbonization in Byproduct Recovery Plant (BPP) Batteries. Essential for high-temperature reheat furnaces (Hot Strip Mill, Pelletizing Plant, CRM).
3. **Linz-Donawitz Converter Gas (LD Gas)**: Medium calorific value gas (~2,100 kcal/Nm³) recovered from Steel Melting Shop oxygen converters during steel refining.
4. **Imported Natural Gas (Buffer)**: High calorific value gas (~8,500 kcal/Nm³) purchased to compensate for extreme byproduct gas deficits and maintain plant thermal equilibrium.

### The Challenge
A sudden trip of a Blast Furnace (e.g., BF-I producing 465,000 Nm³/h) instantly triggers a massive plant-wide **BF Gas deficit** (-479,800 Nm³/h). Without real-time telemetry and decision support, gasholder buffers deplete within minutes, forcing emergency flaring, boiler trips, or catastrophic thermal outages.

### The Solution: GASMIND AI
GASMIND AI provides a real-time digital twin and decision support platform that monitors live gas balances, simulates contingency events, logs operator audit records, and auto-calculates optimal priority-based gas redistribution strategies.

---

## 2. Comprehensive Navigation Modules & Views

### 2.1 Overview Dashboard (`/overview`)
- High-level KPIs: Total Byproduct Generation (2.01M Nm³/h), Total Plant Consumption (1.87M Nm³/h), Net Byproduct Surplus (+142.6k Nm³/h), Overall Gas Utilization Efficiency (98.2%).
- Real-time stream balance cards with status badges (*Deficit*, *Surplus*, *Balanced*).
- Interactive Chart.js telemetry timeline chart showing historical and real-time generation vs. consumption curves.
- AI Optimization Insights card for automated gas rerouting recommendations.

### 2.2 Gas Generation View (`/generation`)
- Comprehensive generator registry covering 10 major furnace and converter units.
- **Gas Type Filter Tabs**: View **CO Gas**, **BF Gas**, **LD Gas**, or **All Gas Streams** at the same time.
- Detailed metrics per generator: Flow rate (Nm³/h), Internal Consumption deduction, Net Available Output, Pressure (kPa), Operating Load %, and Status.

### 2.3 Gas Consumption View (`/consumption`)
- Downstream consumer registry covering Power Houses (#3, #4, #5, #6), Coke Plant Underfiring, Hot Strip Mill (HSM), Pelletizing Plant, Mergemills, CRM, and LCP.
- **Gas Type Filter Tabs**: Separate options to inspect consumers by gas stream or view all simultaneously.
- Co-firing breakdown: Displays primary gas stream requirement alongside secondary/backup fuel mix.

### 2.4 Gas Balance View (`/balance`)
- Stream-by-stream balance matrix comparing total generation against total consumption.
- Gasholder Inventory Buffer Gauges:
  - **100k BF Gasholder**: 68,000 m³ stock (68% capacity, 14.2 kPa pressure).
  - **80k CO Gasholder**: 67,200 m³ stock (84% capacity, 28.5 kPa pressure).
  - **50k LD Gasholder**: 22,500 m³ stock (45% capacity, 18.0 kPa pressure).
- Depletion/Fill rate forecasts based on real-time stream net balance.

### 2.5 Gas Sankey Flow Network (`/network`)
- Full SVG Sankey flow visualization connecting **Sources** → **Headers & Storage** → **Downstream Consumers**.
- Interactive ribbon highlighting on hover: Visualizes exact volumetric flow paths and gas types.
- Gas stream filter options to isolate BF Gas, CO Gas, or LD Gas pipelines.

### 2.6 Simulation Workspace (`/simulation`)
- Interactive contingency sandbox allowing operators to simulate:
  - Generator failures (e.g., Blast Furnace I shutdown).
  - Consumer shutdowns (e.g., Power House #6 drop).
  - Plant generation scaling (50%–100%).
  - Plant consumption demand scaling (100%–150%).
- **Mandatory Operator Registration**: Requires Operator Name, Designation, and Department before running simulations.
- **Smart Gas Redistribution Engine**: Calculates priority allocation (1. Critical Heating → 2. Rolling Mills → 3. Power Boilers) and displays buffer depletion windows.

### 2.7 Multi-Dimensional Scenario Analysis (`/scenario`)
Contains 4 dedicated navigation sub-views:
1. **Root Cause Analysis**: Pinpoints exact factors contributing to gas deficits (e.g., BF-I outage contributing 96.9% of total deficit).
2. **Dependency Analysis**: Interactive matrix showing which consumers depend on which gas streams and vice versa.
3. **Criticality Analysis**: Ranks generators by failure impact, showing lost volume and percentage impact on total plant supply.
4. **Scenario Comparison**: Side-by-side comparison of Nominal baseline vs. Partial load drops (10%, 15%, 20%) vs. Full shutdown.

### 2.8 Operational Alerts Console (`/alerts`)
- Context-aware alert engine generating real-time alarms:
  - **Critical**: BF Gas Deficit (-14,800 Nm³/h), Equipment Failure.
  - **Warning**: CO Gas Holder High (84%), LD Gas Underutilization.
  - **Info**: Simulation Completed, Shift Change.
- **Web Audio API Sound Engine**: Plays distinct audible alarm tones for critical, warning, info, and success events. Includes interactive sound test buttons and mute toggle.

### 2.9 Reports & Exports (`/reports`)
- User-defined report generator supporting Daily Gas Report, Gas Balance Report, Generation Report, Consumption Report, Simulation Report, Incident Impact Report, and Executive Summary.
- Export options to **PDF** (rendered report document) or **Excel/CSV** raw dataset downloads.

### 2.10 Event Timeline (`/timeline`)
- Chronological historical log register tracking system events with exact dates and timestamps.
- Sortable on **Daily**, **Weekly**, and **Monthly** timeframes.

### 2.11 Departmental Audit Trail Register (`/audit`)
- Immutable governance register recording:
  - **Who** ran a simulation or exported a report (Name, Designation, Department).
  - **When** the action occurred (UTC timestamp).
  - **What parameters** were configured.
  - **What results & redistribution ideas** were produced.
- Includes single-click **Audit Certificate** text downloads and CSV export options.

---

## 3. Priority Gas Redistribution Logic

When a gas deficit occurs, GASMIND AI enforces a strict industrial priority rule:

$$\text{Priority 1: Core Process Heating} \longrightarrow \text{Priority 2: High-Value Rolling Mills} \longrightarrow \text{Priority 3: Power Boilers}$$

1. **Protect Battery Underfiring & Furnaces**: Coke Plant underfiring and Blast Furnace stoves must never starve of gas to prevent structural refractory damage.
2. **Switch Rolling Mills to CO Gas**: Reheat furnaces (HSM, Pellet Plant) switch from BF Gas co-firing to CO Gas surplus.
3. **Throttle Power House Boilers**: Power House boilers (#3, #4, #5) reduce gas consumption by substituting imported coal or grid power.
