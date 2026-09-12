# 📊 PLANT DATA & TELEMETRY BASELINES — GASMIND AI

This document contains the complete industrial byproduct gas baseline dataset for the steel manufacturing facility monitored by GASMIND AI.

---

## 1. Byproduct Gas Stream Summary Table

| Gas Stream | Full Name | Total Generation | Total Consumption | Net Balance | Status | Pressure | Calorific Value | Gasholder Capacity | Gasholder Stock |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BF Gas** | Blast Furnace Gas | 1,721,200 Nm³/h | 1,736,000 Nm³/h | **-14,800 Nm³/h** | **Deficit** | 14.2 kPa | 920 kcal/Nm³ | 100,000 m³ | 68,000 m³ (68%) |
| **CO Gas** | Coke Oven Gas | 142,000 Nm³/h | 134,600 Nm³/h | **+7,400 Nm³/h** | **Surplus** | 28.5 kPa | 4,250 kcal/Nm³ | 80,000 m³ | 67,200 m³ (84%) |
| **LD Gas** | Linz-Donawitz Gas | 150,000 Nm³/h | 0 Nm³/h (Direct) | **+150,000 Nm³/h** | **Buffer** | 18.0 kPa | 2,100 kcal/Nm³ | 50,000 m³ | 22,500 m³ (45%) |
| **Nat Gas**| Natural Gas Buffer | 115,000 Nm³/h | 115,000 Nm³/h | **0 Nm³/h** | **Balanced** | 45.0 kPa | 8,500 kcal/Nm³ | 200,000 m³ | 184,000 m³ (92%) |
| **TOTAL**  | **Combined Facility**| **2,128,200 Nm³/h**| **1,985,600 Nm³/h**| **+142,600 Nm³/h**| **Net Surplus**| — | — | **430,000 m³** | **341,700 m³ (79%)** |

---

## 2. Gas Generation Breakdown by Unit

### 2.1 Blast Furnace Gas (BF Gas Generators)

| Unit Name | Gas Type | Gross Generation | Internal Consumption | Net Available Output | Pressure | Status | Details / Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Blast Furnace I** | BF Gas | 465,000 Nm³/h | 194,000 Nm³/h | 271,000 Nm³/h | 14.8 kPa | Normal | Iron Making Zone · Stoves & Top Pressure Recovery |
| **Blast Furnace H** | BF Gas | 450,000 Nm³/h | 115,000 Nm³/h | 335,000 Nm³/h | 14.5 kPa | Normal | Iron Making Zone · Stoves Underfiring |
| **Blast Furnace G** | BF Gas | 322,000 Nm³/h | 90,000 Nm³/h | 232,000 Nm³/h | 14.2 kPa | Normal | Iron Making Zone · Baseline Output |
| **Blast Furnace F** | BF Gas | 240,000 Nm³/h | 80,000 Nm³/h | 160,000 Nm³/h | 13.9 kPa | Warning | Iron Making Zone · Tuyere Pressure Dip |
| **Blast Furnace C** | BF Gas | 162,000 Nm³/h | 32,000 Nm³/h | 130,000 Nm³/h | 13.8 kPa | Normal | Iron Making Zone · Secondary Furnace |
| **Blast Furnace E** | BF Gas | 82,200 Nm³/h | 25,000 Nm³/h | 57,200 Nm³/h | 13.5 kPa | Normal | Iron Making Zone · Auxiliary Unit |
| **BF TOTAL** | **BF Gas** | **1,721,200 Nm³/h**| **536,000 Nm³/h** | **1,185,200 Nm³/h**| **14.2 kPa** | **Deficit** | **Primary Plant Gas Backbone** |

### 2.2 Coke Oven Gas (CO Gas Generators)

| Unit Name | Gas Type | Generation Output | Operating Pressure | Status | Details / Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **New BPP (Batteries 10 & 11)** | CO Gas | 80,000 Nm³/h | 28.5 kPa | Normal | Byproduct Recovery Plant · High-yield recovery |
| **Old BPP (Batteries 8 & 9)** | CO Gas | 62,000 Nm³/h | 29.0 kPa | Normal | Byproduct Recovery Plant · Legacy batteries |
| **CO TOTAL** | **CO Gas** | **142,000 Nm³/h** | **28.5 kPa** | **Surplus** | **High CV Fuel Source (4,250 kcal/Nm³)** |

### 2.3 Linz-Donawitz Converter Gas (LD Gas Generators)

| Unit Name | Gas Type | Generation Output | Operating Pressure | Status | Details / Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LD-1 & LD-3 Converter** | LD Gas | 85,000 Nm³/h | 18.2 kPa | Normal | Steel Melting Shop · Cyclic Oxygen Blow Recovery |
| **LD-2 Converter** | LD Gas | 65,000 Nm³/h | 17.8 kPa | Normal | Steel Melting Shop · Converter Recovery |
| **LD TOTAL** | **LD Gas** | **150,000 Nm³/h** | **18.0 kPa** | **Buffer** | **Buffered into 50k Holder** |

---

## 3. Gas Consumption Breakdown by Downstream Consumer

| Consumer Unit Name | Primary Fuel | Consumption (BF Gas) | Consumption (CO Gas) | Total Requirement | Pressure | Location / Zone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BF Internal Stoves** | BF Gas | 536,000 Nm³/h | 0 Nm³/h | 536,000 Nm³/h | 14.8 kPa | Iron Making Division |
| **Power House #6** | BF Gas | 300,000 Nm³/h | 3,000 Nm³/h | 303,000 Nm³/h | 12.8 kPa | Power Generation Station |
| **Coke Plant Underfiring** | BF Gas | 270,000 Nm³/h | 0 Nm³/h | 270,000 Nm³/h | 13.0 kPa | Coke Oven Division |
| **Power House #3** | BF Gas | 190,000 Nm³/h | 1,100 Nm³/h | 191,100 Nm³/h | 12.9 kPa | Power Generation Station |
| **Power House #4** | BF Gas | 150,000 Nm³/h | 22,000 Nm³/h | 172,000 Nm³/h | 13.1 kPa | Power Generation Station |
| **Power House #5** | BF Gas | 130,000 Nm³/h | 2,000 Nm³/h | 132,000 Nm³/h | 13.0 kPa | Power Generation Station |
| **Hot Strip Mill (HSM)** | CO Gas | 75,000 Nm³/h | 30,000 Nm³/h | 105,000 Nm³/h | 26.5 kPa | Hot Rolling Mills Complex |
| **Pelletizing Plant** | CO Gas | 60,000 Nm³/h | 18,000 Nm³/h | 78,000 Nm³/h | 27.0 kPa | Pelletizing Plant Complex |
| **Mergemills (1 to 9)** | CO Gas | 0 Nm³/h | 11,000 Nm³/h | 11,000 Nm³/h | 28.0 kPa | Merchant Rolling Mills |
| **CRM & TPL Lines** | CO Gas | 0 Nm³/h | 14,000 Nm³/h | 14,000 Nm³/h | 28.2 kPa | Cold Rolling Mill Division |
| **Auxiliary CO Units** | CO Gas | 0 Nm³/h | 39,600 Nm³/h | 39,600 Nm³/h | 28.0 kPa | Auxiliary Utilities |
| **LCP & TSCR Plants** | BF Gas | 25,000 Nm³/h | 0 Nm³/h | 25,000 Nm³/h | 13.5 kPa | Lime Plant & TSCR |
| **TOTAL CONSUMPTION** | — | **1,736,000 Nm³/h**| **134,600 Nm³/h**| **1,870,600 Nm³/h**| — | **Plant-Wide Demand** |

---

## 4. Gasholder Inventory Baseline

| Holder Name | Gas Type | Max Capacity | Current Stock | Level % | Operating Pressure | Depletion / Fill Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BF Gasholder 100k** | BF Gas | 100,000 m³ | 68,000 m³ | 68% | 14.2 kPa | Depleting at -14,800 m³/h (Window: 4.59 hours) |
| **CO Gasholder 80k** | CO Gas | 80,000 m³ | 67,200 m³ | 84% | 28.5 kPa | Filling at +7,400 m³/h (Headroom: 12,800 m³) |
| **LD Gasholder 50k** | LD Gas | 50,000 m³ | 22,500 m³ | 45% | 18.0 kPa | Buffering at +150,000 m³/h |
| **Natural Gas Buffer**| NG | 200,000 m³ | 184,000 m³ | 92% | 45.0 kPa | Buffer Standby |
