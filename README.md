# ⚡ GASMIND AI — Industrial Gas Telemetry & Smart Redistribution Command Center

[![GasMind CI Pipeline](https://github.com/amrit-arya/GasMind-TataSteel/actions/workflows/ci.yml/badge.svg)](https://github.com/amrit-arya/GasMind-TataSteel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple)](https://vitejs.dev/)

> **Tata Steel Industrial Byproduct Gas Network Management & Decision Support Platform**

GASMIND AI is an enterprise-grade, real-time industrial gas telemetry, contingency simulation, and smart redistribution command center designed for integrated steel plants. It monitors, analyzes, and optimizes the generation, consumption, balance, and pipeline distribution of **Blast Furnace Gas (BF Gas)**, **Coke Oven Gas (CO Gas)**, and **Linz-Donawitz Converter Gas (LD Gas)**.

---

## 🌟 Key Features & Capabilities

- 📊 **Real-Time Telemetry & Live Stream**: Continuously monitors total plant byproduct gas generation (2.01M Nm³/h) and consumption (1.87M Nm³/h) with instant live telemetry toggle.
- 🏭 **Gas Stream Breakdown (CO, BF, LD & All)**: Dedicated options in Generation and Consumption views to analyze individual gas streams independently or simultaneously.
- 🧪 **Contingency Simulation Sandbox**: Simulates generator trips (e.g., Blast Furnace 1 failure), consumer load changes, and auto-calculates gasholder depletion windows with priority-based gas redistribution physics.
- 📋 **Departmental Audit Trail Register**: Immutable audit logging requiring mandatory operator credentials (Name, Designation, Department) before executing simulations or exporting reports. Includes single-click **Audit Certificate** text downloads and CSV exports.
- 🔊 **Web Audio API Sound Alarm Engine**: Distinct synthesized audio alarms for **Critical** (triple ascending beep alarm), **Warning** (dual descending tone), **Info** (chime), and **Success** notifications with automatic browser gesture unlocking.
- 📈 **Multi-Dimensional Scenario Analysis**:
  - **Root Cause Analysis**: Identifies exact volumetric deficit contributors.
  - **Dependency Analysis**: Maps furnace-to-gas relationships.
  - **Criticality Analysis**: Calculates furnace outage impact percentages.
  - **Scenario Comparison**: Side-by-side comparison of baseline, partial drop (10%, 15%, 20%), and full shutdown.
- 📑 **Custom Reports & Export Engine**: User-defined report generator for Daily Gas, Gas Balance, Generation, Consumption, Simulation, Incident, and Executive Summaries exported to **PDF** (via dynamic `jsPDF` + `jspdf-autotable`) or **Excel/CSV**.
- ⛓️ **Deep-Linkable Hash Router & Error Boundary**: Native URL hash synchronization (`/#overview`, `/#simulation`, `/#reports`) surviving page reloads and browser navigation, wrapped with industrial dark `ErrorBoundary` resilience.
- ♿ **Full Accessibility & Color-Blind Safety**: High-visibility alarm severity badges, distinct icons, `aria-label` tags, modal dialog keyboard traps, and accessible SVG diagram titles.
- ⏳ **Chronological Event Timeline**: Complete historical incident register filterable on Daily, Weekly, and Monthly basis.
- 🔍 **⌘K / Ctrl+K Global Search**: Command palette searching pages, generators, consumers (with exact flow rates in Nm³/h & plant locations), gas types, and active alerts.

---

## 🛠️ Technology Stack

- **Core Framework**: [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Testing Framework**: [Vitest 3](https://vitest.dev/) + [jsdom](https://github.com/jsdom/jsdom)
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/ci.yml`)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom Industrial Dark Theme
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) + [React-ChartJS-2](https://react-chartjs-2.js.org/)
- **Audio Engine**: Pure HTML5 Web Audio API (Zero external media assets required)
- **PDF & Export Engine**: Dynamic async `jsPDF` + `jspdf-autotable` vector engine & Native Blob CSV generation

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js **v18.0.0+** (v20+ or v22 recommended)
- npm **v9.0.0+**

### Installation & Execution

```bash
# 1. Clone or navigate to the repository
cd GasMind

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev

# 4. Run unit test suite (Vitest)
npm test

# 5. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Directory Structure

```text
GasMind/
├── .eslintrc.cjs                # ESLint configuration
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD Pipeline
├── .prettierrc                  # Prettier code formatting rules
├── docs/                        # Architecture & Data documentation
│   ├── DATA.md
│   ├── PROJECT_OVERVIEW.md
│   ├── PROJECT_REPORT.md
│   ├── REQUIREMENTS.md
│   └── SYSTEM_ARCHITECTURE.md
├── index.html                   # HTML5 Entry point & viewport meta
├── LICENSE                      # MIT License
├── package.json                 # Project dependencies & npm scripts
├── src/
│   ├── main.tsx                 # React DOM Root initialization
│   ├── App.tsx                  # Primary Layout, Hash Router & ErrorBoundary
│   ├── index.css                # Custom CSS tokens & industrial theme
│   ├── config/
│   │   └── assumptions.ts       # Plant operational assumptions
│   ├── data/
│   │   └── plantData.ts         # Centralized plant equipment data model
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── context/
│   │   └── GasDataContext.tsx   # Centralized Context Provider & Telemetry Engine
│   ├── test/
│   │   ├── setup.ts
│   │   └── simulation.test.ts   # Simulation module unit tests (Vitest)
│   ├── utils/
│   │   ├── pdfReportGenerator.ts # Dynamic async jsPDF report generator
│   │   └── soundNotifications.ts # Web Audio API sound synthesis module
│   ├── components/
│   │   ├── common/
│   │   │   └── ErrorBoundary.tsx# Industrial dark ErrorBoundary fallback UI
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Global Command Search (⌘K), Audio & Export Bar
│   │   │   └── Sidebar.tsx      # Collapsible Navigation Drawer
│   │   └── ui/
│   │       └── MagicBento.tsx   # Interactive ParticleCard UI component
│   └── views/
│       ├── monitoring/          # Overview, Generation, Consumption, Balance, Network
│       ├── analytics/           # Simulation Workspace & Scenario Analysis
│       ├── governance/         # Operational Alerts, Reports, Audit Trail
│       ├── timeline/            # Event Timeline Register
│       └── about/               # About View
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Vitest test runner configuration
```

---

## 📄 License & Governance

Licensed under the [MIT License](LICENSE). Developed for industrial utility monitoring and gas balance optimization.
