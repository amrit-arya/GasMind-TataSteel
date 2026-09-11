import React from 'react';
import { useGasData } from '../context/GasDataContext';
import { ViewMode } from '../types';
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
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  mobileOpen, 
  setMobileOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const { currentView, setCurrentView, alerts } = useGasData();

  const unacknowledgedCritical = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'generation', label: 'Gas Generation', icon: Factory },
    { id: 'consumption', label: 'Gas Consumption', icon: Flame },
    { id: 'balance', label: 'Gas Balance', icon: Scale },
    { id: 'network', label: 'Gas Sankey Flow', icon: Network },
    { id: 'simulation', label: 'Simulation Workspace', icon: Sliders },
    { id: 'scenario', label: 'Scenario Analysis', icon: TrendingUp },
    { id: 'alerts', label: 'Operational Alerts', icon: AlertTriangle, badge: unacknowledgedCritical },
    { id: 'reports', label: 'Reports & Exports', icon: FileText },
    { id: 'timeline', label: 'Event Timeline', icon: Clock },
    { id: 'audit', label: 'Audit Trail', icon: ClipboardCheck },
    { id: 'about', label: 'About GASMIND', icon: Info }
  ];

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
        <div className={`px-4 mb-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <img src="/gasmind_logo.jpg" alt="GasMind Official Logo" className="w-9 h-9 rounded-full object-cover border border-zinc-700 shadow-md shrink-0" />
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="font-display text-lg font-extrabold tracking-wide text-white">
                  GASMIND
                </h1>
                <p className="text-[11px] text-zinc-400 font-mono">Industrial Fire Command</p>
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
          <div className="mx-3 mb-5 p-2.5 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse glow-flame" />
              <span className="text-xs font-mono text-zinc-200 font-bold">FIRE CONTROL ACTIVE</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">v1.0.0</span>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse glow-flame" title="Fire Control Active" />
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {navItems.map((item) => {
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
                  w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-lg text-xs font-bold transition-all duration-150 group cursor-pointer
                  ${isActive 
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-lg glow-flame font-extrabold' 
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
        </nav>
      </aside>
    </>
  );
};
