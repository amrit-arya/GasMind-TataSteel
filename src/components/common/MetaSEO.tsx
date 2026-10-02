import React, { useEffect } from 'react';
import { useGasData } from '../../context';
import { ViewMode } from '../../types';

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
}

const BASE_URL = 'https://gasmind.vercel.app';

const PAGE_METADATA: Record<ViewMode, PageMeta> = {
  overview: {
    title: 'GASMIND | Real-Time Telemetry Command Center',
    description: 'Live monitoring dashboard of total industrial gas generation (2.01M Nm³/h) and consumption (1.87M Nm³/h) for Blast Furnace, Coke Oven, and LD Converter gases.',
    canonical: `${BASE_URL}/#overview`,
    ogTitle: 'GASMIND — Real-Time Telemetry Command Center',
    ogDescription: 'Live monitoring dashboard of total industrial gas generation and consumption across Tata Steel plant operations.'
  },
  generation: {
    title: 'GASMIND | Gas Generation Telemetry & Stream Breakdown',
    description: 'Real-time volumetric telemetry and stream breakdown for Blast Furnaces (BF-I, H, G, F, C, E), Coke Oven Batteries, and Linz-Donawitz converters.',
    canonical: `${BASE_URL}/#generation`,
    ogTitle: 'GASMIND — Gas Generation Telemetry',
    ogDescription: 'Real-time volumetric generation rates, pressures, and calorific values for BF, CO, and LD gas streams.'
  },
  consumption: {
    title: 'GASMIND | Industrial Gas Consumption & Consumer Demand',
    description: 'Track real-time industrial consumer demand across Power House 6, 5, 4, 3, Coke Plant Underfiring, HSM Mill, and Pelletizing Plant.',
    canonical: `${BASE_URL}/#consumption`,
    ogTitle: 'GASMIND — Industrial Gas Consumption',
    ogDescription: 'Real-time demand tracking across major power houses, reheating furnaces, and coke batteries.'
  },
  balance: {
    title: 'GASMIND | Tri-Gas Balance & Gasholder Inventory',
    description: 'Monitor net gas surplus and deficit metrics, stock levels, and reserve capacities across 100k BF, 80k CO, and 50k LD gasholders.',
    canonical: `${BASE_URL}/#balance`,
    ogTitle: 'GASMIND — Tri-Gas Balance & Gasholder Inventory',
    ogDescription: 'Track net gas balances and gasholder buffer capacities for industrial byproduct gases.'
  },
  network: {
    title: 'GASMIND | Interactive Gas Sankey Pipeline Flow Topology',
    description: 'Visual Sankey flow diagram mapping volumetric gas transfers between generators, gasholder buffers, and consumer units.',
    canonical: `${BASE_URL}/#network`,
    ogTitle: 'GASMIND — Interactive Gas Sankey Flow Topology',
    ogDescription: 'Visual Sankey pipeline network diagram illustrating volumetric gas distribution flows.'
  },
  simulation: {
    title: 'GASMIND | Contingency Simulation Workspace & Physics Sandbox',
    description: 'Simulate blast furnace generator trips, consumer outages, gasholder depletion windows, and priority gas redistribution strategies.',
    canonical: `${BASE_URL}/#simulation`,
    ogTitle: 'GASMIND — Contingency Simulation Workspace',
    ogDescription: 'Industrial gas network contingency simulator modeling generator failures and gasholder depletion physics.'
  },
  scenario: {
    title: 'GASMIND | Multi-Dimensional Scenario Analysis & Root Cause',
    description: 'Deep analytics engine evaluating root cause contributors, furnace outage criticality percentages, and baseline vs shutdown scenario comparisons.',
    canonical: `${BASE_URL}/#scenario`,
    ogTitle: 'GASMIND — Multi-Dimensional Scenario Analysis',
    ogDescription: 'Advanced scenario analysis for furnace dependency, root cause deficit breakdown, and outage impact matrix.'
  },
  alerts: {
    title: 'GASMIND | Operational Alerts Console & Sound Alarm Engine',
    description: 'Real-time operational alarm register filterable by severity (Critical, Warning, Info, Success) with Web Audio API sound alerts.',
    canonical: `${BASE_URL}/#alerts`,
    ogTitle: 'GASMIND — Operational Alerts Console',
    ogDescription: 'Filterable operational alarms and synthesized audio notifications for industrial gas anomalies.'
  },
  timeline: {
    title: 'GASMIND | Chronological Event Timeline & Historical Register',
    description: 'Historical register tracking plant telemetry anomalies, equipment trips, and operator activities across daily, weekly, and monthly timeframes.',
    canonical: `${BASE_URL}/#timeline`,
    ogTitle: 'GASMIND — Event Timeline Register',
    ogDescription: 'Chronological event register filterable by timeframe for historical incident auditing.'
  },
  reports: {
    title: 'GASMIND | Custom Reports Builder & PDF / CSV Export Engine',
    description: 'Generate executive summaries, daily gas balance reports, and incident logs exported to dynamic vector PDF or raw CSV data.',
    canonical: `${BASE_URL}/#reports`,
    ogTitle: 'GASMIND — Reports & Export Engine',
    ogDescription: 'User-defined custom report builder supporting dynamic PDF generation and CSV exports.'
  },
  audit: {
    title: 'GASMIND | Departmental Audit Trail Register & Credentials Log',
    description: 'Immutable operator action log enforcing mandatory operator credentials (Name, Designation, Department) and downloadable audit certificates.',
    canonical: `${BASE_URL}/#audit`,
    ogTitle: 'GASMIND — Departmental Audit Trail Register',
    ogDescription: 'Mandatory operator action register with credential logging and downloadable audit certificates.'
  },
  about: {
    title: 'GASMIND | About Tata Steel Command Center & Technical Specs',
    description: 'Project overview, developer documentation, technology stack specifications, and operational assumptions for Tata Steel GasMind.',
    canonical: `${BASE_URL}/#about`,
    ogTitle: 'GASMIND — About & Technical Architecture',
    ogDescription: 'Technical architecture, developer specifications, and operational overview of the GASMIND command center.'
  }
};

const updateMetaTag = (attribute: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const updateCanonicalLink = (url: string) => {
  let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

export const MetaSEO: React.FC = () => {
  const { currentView } = useGasData();

  useEffect(() => {
    const meta = PAGE_METADATA[currentView] || PAGE_METADATA.overview;

    // Document Title
    document.title = meta.title;

    // Canonical URL
    updateCanonicalLink(meta.canonical);

    // Standard Description
    updateMetaTag('name', 'description', meta.description);

    // Open Graph Tags
    updateMetaTag('property', 'og:title', meta.ogTitle);
    updateMetaTag('property', 'og:description', meta.ogDescription);
    updateMetaTag('property', 'og:url', meta.canonical);

    // Twitter Card Tags
    updateMetaTag('name', 'twitter:title', meta.ogTitle);
    updateMetaTag('name', 'twitter:description', meta.ogDescription);
    updateMetaTag('name', 'twitter:url', meta.canonical);
  }, [currentView]);

  return null;
};
