# ⚡ GASMIND AI — Industrial Gas Telemetry & Smart Redistribution Command Center

> **Tata Steel Industrial Byproduct Gas Network Management & Decision Support Platform**

GASMIND AI is an enterprise-grade, real-time industrial gas telemetry, contingency simulation, and smart redistribution command center designed for integrated steel plants. It monitors, analyzes, and optimizes the generation, consumption, balance, and pipeline distribution of **Blast Furnace Gas (BF Gas)**, **Coke Oven Gas (CO Gas)**, **Linz-Donawitz Converter Gas (LD Gas)**, and **Natural Gas (Buffer)**.

---

## 🌟 Key Features & Capabilities

- 📊 **Real-Time Telemetry & Live Stream**: Continuously monitors total plant byproduct gas generation (2.01M Nm³/h) and consumption (1.87M Nm³/h) with instant live telemetry toggle.
- 🏭 **Gas Stream Breakdown (CO, BF, LD & All)**: Dedicated options in Generation and Consumption views to analyze individual gas streams independently or simultaneously.
- 🧪 **Contingency Simulation Sandbox**: Simulates generator trips (e.g., Blast Furnace I failure), consumer load changes, and auto-calculates gasholder depletion windows with priority-based gas redistribution.
- 📋 **Departmental Audit Trail Register**: Immutable audit logging requiring mandatory operator credentials (Name, Designation, Department) before executing simulations or exporting reports. Includes single-click **Audit Certificate** text downloads and CSV exports.
- 🔊 **Web Audio API Sound Alarm Engine**: Distinct synthesized audio alarms for **Critical** (triple ascending beep alarm), **Warning** (dual descending tone), **Info** (chime), and **Success** notifications with automatic browser gesture unlocking.
- 📈 **Multi-Dimensional Scenario Analysis**:
  - **Root Cause Analysis**: Identifies exact volumetric deficit contributors.
  - **Dependency Analysis**: Maps furnace-to-gas relationships.
  - **Criticality Analysis**: Calculates furnace outage impact percentages.
  - **Scenario Comparison**: Side-by-side comparison of baseline, partial drop (10%, 15%, 20%), and full shutdown.
- 📑 **Custom Reports & Export Engine**: User-defined report generator for Daily Gas, Gas Balance, Generation, Consumption, Simulation, Incident, and Executive Summaries exported to **PDF** or **Excel/CSV**.
- ⏳ **Chronological Event Timeline**: Complete historical incident register filterable on Daily, Weekly, and Monthly basis.
- 🔍 **⌘K / Ctrl+K Global Search**: Command palette searching pages, generators, consumers (with exact flow rates in Nm³/h & plant locations), gas types, and active alerts.
- 📱 **Universal Responsiveness**: Fully optimized for phones (320px+), tablets, laptops, and 4K ultra-wide industrial monitors.

---

## 🛠️ Technology Stack

- **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Dev Server**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom HSL Fire Theme & CSS Modules
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) + [React-ChartJS-2](https://react-chartjs-2.js.org/)
- **Audio Engine**: Pure HTML5 Web Audio API (Zero external media assets required)
- **PDF & Export Engine**: `html2canvas` + `jspdf` + Native Blob CSV generation

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js **v18.0.0+**
- npm **v9.0.0+**

### Installation & Execution

```bash
# 1. Clone or navigate to the repository
cd GasMind

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev

# 4. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Directory Structure

```text
GasMind/
├── index.html                   # HTML5 Entry point & viewport meta
├── src/
│   ├── main.tsx                 # React DOM Root initialization
│   ├── App.tsx                  # Primary Layout & View Mode Router
│   ├── index.css                # Custom CSS tokens & animation utilities
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (GasMetrics, AuditItem, Node)
│   ├── context/
│   │   └── GasDataContext.tsx   # Centralized Context Provider & Telemetry Engine
│   ├── utils/
│   │   └── soundNotifications.ts # Web Audio API sound synthesis module
│   ├── components/
│   │   ├── Header.tsx           # Global Command Search (⌘K), Audio & Export Bar
│   │   └── Sidebar.tsx          # Collapsible Navigation Drawer
│   └── views/
│       ├── OverviewDashboard.tsx  # Executive Dashboard & Key KPIs
│       ├── GasGenerationView.tsx  # Generator Metrics & Gas Type Selector
│       ├── GasConsumptionView.tsx # Consumer Load Metrics & Breakdown
│       ├── GasBalanceView.tsx     # Stream Net Balances & Gasholder Inventory
│       ├── GasNetworkView.tsx     # Interactive Sankey Network Stream Canvas
│       ├── SimulationWorkspace.tsx # Contingency Sandbox & Audit Logger
│       ├── ScenarioAnalysisView.tsx# Scenario Root Cause, Dependency & Criticality
│       ├── AlertsConsoleView.tsx  # Operational Alerts & Sound Legend
│       ├── ReportsView.tsx        # User-Defined Report Generator (PDF/CSV)
│       ├── EventTimelineView.tsx  # Chronological Event Log Register
│       └── AuditTrailView.tsx     # Departmental Execution & Governance Register
├── README.md                    # Project README
├── PROJECT_OVERVIEW.md          # Comprehensive System Functional Overview
├── SYSTEM_ARCHITECTURE.md       # Technical Architecture & Data Flow
├── REQUIREMENTS.md              # Functional & Non-Functional Requirements
└── DATA.md                      # Plant Generation & Consumption Baseline Dataset
```

---

## 📄 License & Governance

Developed for industrial utility monitoring and gas balance optimization.
