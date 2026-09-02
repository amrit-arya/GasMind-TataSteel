import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { Search, Bell, Download, Menu, PanelLeftClose, PanelLeftOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setMobileOpen, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    isLive, 
    setIsLive, 
    alerts, 
    triggerExport, 
    exportNotification,
    setCurrentView
  } = useGasData();

  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);

  const unacknowledged = alerts.filter(a => !a.acknowledged);

  return (
    <header className={`
      h-16 fixed top-0 right-0 left-0 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 z-20 shadow-sm
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'md:left-[68px]' : 'md:left-[280px]'}
    `}>
      {/* Search and Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-[#0F172A] p-2 hover:bg-[#F1F3F5] rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-2 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3F5] rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        <div className="relative hidden sm:block w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parameters, sensors, units..."
            className="w-full pl-9 pr-4 py-1.5 border border-[#CBD5E1] rounded-md bg-[#F8F9FA] text-xs font-mono text-[#0F172A] placeholder-[#64748B] focus:border-[#FF6B00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
          />
        </div>
      </div>

      {/* Actions and Notifications */}
      <div className="flex items-center gap-3">
        {/* Live Simulation Pulse */}
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono font-bold transition-colors ${
            isLive 
              ? 'bg-[#FFF3E0] text-[#FF6B00] border-[#FF6B00]/40 hover:bg-[#FFE0B2]' 
              : 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30 hover:bg-[#FDE68A]'
          }`}
          title="Toggle live telemetry stream"
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#FF6B00] animate-pulse glow-flame' : 'bg-[#D97706]'}`} />
          <span className="hidden sm:inline">{isLive ? 'FIRE STREAM LIVE' : 'PAUSED'}</span>
        </button>

        {/* Global Export Trigger with Flame Gradient */}
        <button 
          onClick={triggerExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-flame-gradient text-white rounded text-xs font-bold hover:opacity-90 transition-opacity shadow-md glow-flame cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Telemetry</span>
        </button>

        {/* Operational Alerts Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setAlertsMenuOpen(!alertsMenuOpen)}
            className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3F5] rounded-lg transition-colors cursor-pointer relative"
          >
            <Bell className="w-5 h-5" />
            {unacknowledged.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-ping glow-rose" />
            )}
          </button>

          {alertsMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#CBD5E1] rounded-lg shadow-2xl z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                  <h3 className="text-sm font-bold text-[#0F172A]">Operational Alerts</h3>
                </div>
                <button 
                  onClick={() => {
                    setCurrentView('alerts');
                    setAlertsMenuOpen(false);
                  }}
                  className="text-xs text-[#FF6B00] hover:underline font-mono font-bold"
                >
                  View Console ({alerts.length})
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {alerts.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2.5 bg-[#F8F9FA] border border-[#E2E8F0] rounded text-xs">
                    <div className="flex items-center justify-between text-[#64748B] mb-1 font-mono">
                      <span className="text-[#DC2626] font-bold uppercase">{a.severity}</span>
                      <span>{a.timestamp}</span>
                    </div>
                    <p className="font-bold text-[#0F172A] mb-0.5">{a.title}</p>
                    <p className="text-[#475569] text-[11px] line-clamp-2">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Notification Toast */}
      {exportNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-flame-gradient text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce glow-flame font-mono text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{exportNotification}</span>
        </div>
      )}
    </header>
  );
};
