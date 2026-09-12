# 📋 REQUIREMENTS DOCUMENT — GASMIND AI

This document specifies the system prerequisites, functional requirements, and non-functional requirements for the **GASMIND AI Industrial Gas Telemetry & Smart Redistribution Command Center**.

---

## 1. System Prerequisites

### 1.1 Host Environment
- **Node.js**: Version `18.0.0` or higher.
- **npm**: Version `9.0.0` or higher.
- **Operating System**: Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+).

### 1.2 Web Browser Requirements
- Google Chrome `v100+`, Microsoft Edge `v100+`, Mozilla Firefox `v100+`, or Safari `v15+`.
- **HTML5 Web Audio API** support enabled.
- **HTML5 Canvas & SVG** rendering support enabled.
- JavaScript enabled.

---

## 2. Functional Requirements (FR)

| Requirement ID | Module / Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Live Telemetry Stream** | The system shall display live generation, consumption, and net balance metrics for BF Gas, CO Gas, LD Gas, and Natural Gas, updated every 3 seconds when LIVE mode is toggled ON. | **High** |
| **FR-02** | **Gas Stream Filtering** | The system shall provide individual selection options in Generation and Consumption views to filter data by **CO Gas**, **BF Gas**, **LD Gas**, or view **All Streams** simultaneously. | **High** |
| **FR-03** | **Sankey Network Canvas** | The system shall render an interactive SVG Sankey flow diagram mapping generating furnaces to headers/gasholders and downstream industrial consumers with ribbon highlighting on hover. | **High** |
| **FR-04** | **Contingency Simulation** | The system shall allow operators to simulate generator trips (e.g., Blast Furnace I failure), consumer shutdowns, and generation/consumption load scaling (50%–150%). | **High** |
| **FR-05** | **Smart Redistribution** | The system shall automatically compute net stream balances, gasholder depletion windows in hours, and recommended gas redistribution actions based on priority rules. | **High** |
| **FR-06** | **Mandatory Operator Credentials** | The system shall enforce mandatory input of **Operator Name** and **Designation** before executing any simulation sandbox run. | **High** |
| **FR-07** | **Departmental Audit Trail** | The system shall maintain an immutable register of all simulation runs, parameter configurations, results produced, and report exports with date, time, and operator credentials. | **High** |
| **FR-08** | **Audit Export & Certificate** | The system shall allow exporting the full audit trail to Excel/CSV and downloading individual single-event **Audit Certificates**. | **Medium** |
| **FR-09** | **Web Audio Sound Alarms** | The system shall play distinct audible tones synthesized via Web Audio API for Critical (triple-beep alarm), Warning (double tone), Info (chime), and Success notifications. | **High** |
| **FR-10** | **Scenario Analysis** | The system shall provide 4 separate analytical subviews: **Root Cause Analysis**, **Dependency Analysis**, **Criticality Analysis**, and **Scenario Comparison**. | **High** |
| **FR-11** | **Custom Report Exports** | The system shall generate user-defined reports (Daily Gas, Balance, Generation, Consumption, Simulation, Incident, Executive Summary) downloadable as **PDF** or **Excel/CSV**. | **High** |
| **FR-12** | **⌘K Global Search** | The system shall provide a global command palette searching nav pages, generators/consumers (with exact Nm³/h flow rates and locations), gas types, and active alerts. | **High** |

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Speed (NFR-01)
- Initial application load time shall be under **1.5 seconds** on a standard broadband connection.
- Simulation computations and stream balance updates shall process in under **100 milliseconds**.

### 3.2 Universal Responsiveness & Display Support (NFR-02)
- The application interface shall automatically adjust layout parameters across all screen widths from **320px** (smartphones) up to **4K ultra-wide monitors** (3840px+).
- Touch devices shall feature slide-over navigation drawers with dark backdrop dismissal.

### 3.3 Audio Reliability & Offline Availability (NFR-03)
- Sound notifications shall be synthesized entirely in browser memory without requiring external `.mp3` or `.wav` audio asset downloads.
- Audio context shall automatically unlock upon initial user gesture (`click`, `keydown`, `touchstart`).

### 3.4 Data Integrity & Precision (NFR-04)
- Flow rates shall be maintained at exact integer precision in Nm³/h.
- Gasholder levels shall be tracked as exact percentages and volume in cubic meters ($m^3$).

### 3.5 Security & Departmental Auditability (NFR-05)
- Every contingency simulation and file export operation shall be tagged with operator identity attributes for compliance auditing.

### 3.6 Usability & UX Design (NFR-06)
- High contrast HSL fire-themed color palette conforming to industrial control room design best practices.
- Zero generic placeholder text or dummy components.
