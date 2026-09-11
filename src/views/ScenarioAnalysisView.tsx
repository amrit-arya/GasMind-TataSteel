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
import { ParticleCard } from '../components/MagicBento';

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
    <div className="space-y-5 text-white">
      {/* Page Title */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-white" />
          Scenario Analysis
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Deep-dive into gas network root causes, dependencies, criticality, and what-if scenario modeling.
        </p>
      </div>

      {/* Tab Navigation */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg overflow-hidden relative">
        <div className="flex border-b border-zinc-800 overflow-x-auto">
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
                    ? 'text-white bg-zinc-900 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Description */}
        <div className="px-5 py-3 bg-black border-b border-zinc-800 flex items-center gap-2">
          <activeTabData.icon className="w-4 h-4 text-white shrink-0" />
          <span className="text-xs font-mono text-zinc-400">{activeTabData.description}</span>
        </div>
      </ParticleCard>

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

export default ScenarioAnalysisView;
