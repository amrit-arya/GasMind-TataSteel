import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  GitBranch,
  ShieldAlert,
  GitCompareArrows,
} from 'lucide-react';
import { RootCauseAnalysis } from './scenario/RootCauseAnalysis';
import { DependencyAnalysis } from './scenario/DependencyAnalysis';
import { CriticalityAnalysis } from './scenario/CriticalityAnalysis';
import { ScenarioComparison } from './scenario/ScenarioComparison';

type ScenarioTab = 'root-cause' | 'dependency' | 'criticality' | 'comparison';

const tabs: { id: ScenarioTab; label: string; shortLabel: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  {
    id: 'root-cause',
    label: 'Root Cause Analysis',
    shortLabel: 'Root Cause',
    icon: Search,
    description: 'Deficit identification, major contributors & driving factors'
  },
  {
    id: 'dependency',
    label: 'Dependency Analysis',
    shortLabel: 'Dependencies',
    icon: GitBranch,
    description: 'Consumer ↔ gas type mapping, single-source risk assessment'
  },
  {
    id: 'criticality',
    label: 'Criticality Analysis',
    shortLabel: 'Criticality',
    icon: ShieldAlert,
    description: 'Generator failure impact ranking & cascade risk scoring'
  },
  {
    id: 'comparison',
    label: 'Scenario Comparison',
    shortLabel: 'Comparison',
    icon: GitCompareArrows,
    description: 'Side-by-side scenario modeling with adjustable parameters'
  }
];

export const ScenarioAnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScenarioTab>('root-cause');

  const activeTabData = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="pb-4 border-b border-[#CBD5E1]">
        <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#FF6B00]" />
          Scenario Analysis
        </h2>
        <p className="text-xs text-[#475569] font-mono mt-1">
          Deep-dive into gas network root causes, dependencies, criticality, and what-if scenario modeling.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-[#CBD5E1] rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-[#E2E8F0] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer relative
                  ${isActive
                    ? 'text-[#FF6B00] bg-[#FFF7ED]'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8F9FA]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF6B00]' : 'text-[#94A3B8]'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF6B00] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Description */}
        <div className="px-5 py-3 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center gap-2">
          <activeTabData.icon className="w-4 h-4 text-[#FF6B00] shrink-0" />
          <span className="text-xs font-mono text-[#475569]">{activeTabData.description}</span>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'root-cause' && <RootCauseAnalysis />}
        {activeTab === 'dependency' && <DependencyAnalysis />}
        {activeTab === 'criticality' && <CriticalityAnalysis />}
        {activeTab === 'comparison' && <ScenarioComparison />}
      </div>
    </div>
  );
};
