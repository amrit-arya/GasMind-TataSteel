import React from 'react';
import { useGasData } from '../../context';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  Factory, 
  Flame, 
  Scale, 
  Network, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Clock,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
}

interface NavSection {
  category: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen, 
  setMobileOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const { currentView, setCurrentView, alerts } = useGasData();

  const unacknowledgedCritical = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  const navSections: NavSection[] = [
    {
      category: 'Real-Time Telemetry',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'generation', label: 'Gas Generation', icon: Factory },
        { id: 'consumption', label: 'Gas Consumption', icon: Flame },
        { id: 'balance', label: 'Gas Balance', icon: Scale },
        { id: 'network', label: 'Gas Sankey Flow', icon: Network }
      ]
    },
    {
      category: 'Intelligence & Optimization',
      items: [
        { id: 'simulation', label: 'Simulation Workspace', icon: Sliders },
        { id: 'scenario', label: 'Scenario Analysis', icon: TrendingUp }
      ]
    },
    {
      category: 'Diagnostics & Events',
      items: [
        { id: 'alerts', label: 'Operational Alerts', icon: AlertTriangle, badge: unacknowledgedCritical },
        { id: 'timeline', label: 'Event Timeline', icon: Clock }
      ]
    },
    {
      category: 'Governance & Compliance',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: FileText },
        { id: 'audit', label: 'Audit Trail', icon: ClipboardCheck }
      ]
    }
  ];

  const isAboutActive = currentView === 'about';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full bg-[#09090B] text-white flex flex-col py-5 border-r border-zinc-800 z-40
        transition-all duration-300 ease-in-out shadow-2xl
        ${isCollapsed ? 'md:w-[68px]' : 'md:w-[280px]'}
        ${mobileOpen ? 'w-[280px] translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header & Desktop Collapse Toggle */}
        <div className={`px-4 mb-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <img src="/gasmind_logo.jpg" alt="GasMind Official Logo" className="w-9 h-9 rounded-full object-cover border border-zinc-700 shadow-md shrink-0" />
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="font-heading text-lg font-extrabold tracking-wide text-white">
                  GASMIND
                </h1>
                <p className="text-[11px] text-zinc-400 font-mono">Intelligent Gas Management</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Live System Indicator */}
        {!isCollapsed ? (
          <div className="mx-3 mb-4 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse glow-flame" />
              <span className="text-xs font-mono text-zinc-200 font-bold">GAS MONITORING ACTIVE</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">v1.0.0</span>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse glow-flame" title="Gas Monitoring Active" />
          </div>
        )}

        {/* Navigation List grouped by Category */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-4 custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={section.category || sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
                  <span>{section.category}</span>
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-lg text-xs font-bold transition-all duration-150 group cursor-pointer
                      ${isActive 
                        ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md font-extrabold' 
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-black rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    ) : isCollapsed && item.badge ? (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Featured "About GASMIND" Section */}
        <div className="px-2 pt-3 mt-2 border-t border-zinc-850">
          {!isCollapsed ? (
            <button
              onClick={() => {
                setCurrentView('about');
                setMobileOpen(false);
              }}
              className={`
                w-full text-left p-3 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden
                ${isAboutActive
                  ? 'bg-zinc-850 border-2 border-white shadow-xl ring-2 ring-white/20'
                  : 'bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-black border border-zinc-750 hover:border-zinc-500 hover:shadow-2xl hover:-translate-y-0.5'}
              `}
            >
              {/* Subtle background glow effect */}
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10 transition-colors" />

              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg transition-colors ${isAboutActive ? 'bg-white text-black' : 'bg-zinc-800 text-white group-hover:bg-zinc-700'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-heading font-extrabold tracking-wide text-white block">
                      About GASMIND
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono block">Tata Steel Project</span>
                  </div>
                </div>
                <ArrowUpRight className={`w-4 h-4 transition-transform ${isAboutActive ? 'text-white translate-x-0.5 -translate-y-0.5' : 'text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
              </div>

              <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="truncate">By AMRIT ARYA</span>
                <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">Docs & Tech →</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentView('about');
                setMobileOpen(false);
              }}
              title="About GASMIND - Tata Steel Internship Project"
              className={`
                w-full flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 group cursor-pointer relative
                ${isAboutActive
                  ? 'bg-white text-black ring-2 ring-white/50 shadow-lg'
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-750 hover:bg-zinc-800 hover:text-white hover:border-zinc-500'}
              `}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              {isAboutActive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
