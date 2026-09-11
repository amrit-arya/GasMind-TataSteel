import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGasData } from '../context/GasDataContext';
import { ViewMode } from '../types';
import {
  Search,
  Bell,
  Download,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  CheckCircle2,
  Volume2,
  VolumeX,
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
  ArrowRight,
  Command,
  X
} from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'navigation' | 'generator' | 'consumer' | 'holder' | 'alert' | 'gas-type';
  icon: React.ReactNode;
  action: () => void;
}

const navPageIcon: Record<string, React.ReactNode> = {
  overview: <LayoutDashboard className="w-4 h-4" />,
  generation: <Factory className="w-4 h-4" />,
  consumption: <Flame className="w-4 h-4" />,
  balance: <Scale className="w-4 h-4" />,
  network: <Network className="w-4 h-4" />,
  simulation: <Sliders className="w-4 h-4" />,
  scenario: <TrendingUp className="w-4 h-4" />,
  alerts: <AlertTriangle className="w-4 h-4" />,
  reports: <FileText className="w-4 h-4" />,
  timeline: <Clock className="w-4 h-4" />,
  audit: <ClipboardCheck className="w-4 h-4" />,
};

const navPages: { id: ViewMode; label: string; keywords: string[] }[] = [
  { id: 'overview', label: 'Overview Dashboard', keywords: ['dashboard', 'home', 'overview', 'main', 'kpi'] },
  { id: 'generation', label: 'Gas Generation', keywords: ['generation', 'generator', 'blast furnace', 'coke', 'ld', 'bpp', 'output'] },
  { id: 'consumption', label: 'Gas Consumption', keywords: ['consumption', 'consumer', 'power house', 'mill', 'pellet', 'demand'] },
  { id: 'balance', label: 'Gas Balance', keywords: ['balance', 'surplus', 'deficit', 'net', 'holder'] },
  { id: 'network', label: 'Gas Sankey Flow', keywords: ['network', 'sankey', 'flow', 'diagram', 'pipeline', 'pipes'] },
  { id: 'simulation', label: 'Simulation Workspace', keywords: ['simulation', 'simulate', 'what-if', 'outage', 'redistribute'] },
  { id: 'scenario', label: 'Scenario Analysis', keywords: ['scenario', 'analysis', 'root cause', 'dependency', 'criticality', 'comparison'] },
  { id: 'alerts', label: 'Operational Alerts', keywords: ['alerts', 'alarm', 'notification', 'warning', 'critical', 'sound'] },
  { id: 'reports', label: 'Reports & Exports', keywords: ['report', 'export', 'pdf', 'csv', 'download', 'generate'] },
  { id: 'timeline', label: 'Event Timeline', keywords: ['timeline', 'history', 'event', 'log', 'chronological'] },
  { id: 'audit', label: 'Departmental Audit Trail', keywords: ['audit', 'trail', 'governance', 'log', 'who', 'simulation', 'export', 'operator'] },
];

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
    setCurrentView,
    gasMetrics,
    nodes,
    soundEnabled,
    setSoundEnabled
  } = useGasData();

  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unacknowledged = alerts.filter(a => !a.acknowledged);

  // Build search results
  const searchResults: SearchResult[] = useMemo(() => {
    const q = localSearch.toLowerCase().trim();
    if (!q) {
      // Show nav pages as quick links when no query
      return navPages.map(page => ({
        id: `nav-${page.id}`,
        title: page.label,
        subtitle: 'Navigate to page',
        category: 'navigation' as const,
        icon: navPageIcon[page.id],
        action: () => { setCurrentView(page.id); setSearchOpen(false); setLocalSearch(''); }
      }));
    }

    const results: SearchResult[] = [];

    // Match navigation pages
    navPages.forEach(page => {
      const matches = page.label.toLowerCase().includes(q) ||
        page.keywords.some(k => k.includes(q));
      if (matches) {
        results.push({
          id: `nav-${page.id}`,
          title: page.label,
          subtitle: 'Navigate to page',
          category: 'navigation',
          icon: navPageIcon[page.id],
          action: () => { setCurrentView(page.id); setSearchOpen(false); setLocalSearch(''); }
        });
      }
    });

    // Match generators and consumers from nodes with detailed generation/consumption metrics & location
    nodes.forEach(node => {
      const isGen = node.type === 'generator';
      const isCons = node.type === 'consumer';
      const isHolder = node.type === 'holder';

      const typeLabel = isGen ? 'Generator' : isCons ? 'Consumer' : 'Holder';
      const flowFormatted = node.flowRate.toLocaleString() + ' Nm³/h';
      
      // Determine plant location from node name
      let location = 'Plant Main Facility';
      if (node.name.includes('Blast Furnace')) location = 'Iron Making Zone';
      else if (node.name.includes('BPP')) location = 'Coke Oven Battery Complex';
      else if (node.name.includes('Power House')) location = 'Power Generation Station';
      else if (node.name.includes('Coke Plant')) location = 'Coke Oven Division';
      else if (node.name.includes('HSM')) location = 'Hot Strip Mill Rolling Complex';
      else if (node.name.includes('Pellet')) location = 'Pelletizing Plant Complex';
      else if (isHolder) location = 'Gas Storage Compound';

      const matchText = `${node.name} ${node.gasType} ${node.type} ${location} ${node.details} ${isGen ? 'generated generation producer' : ''} ${isCons ? 'consumed consumption user' : ''}`.toLowerCase();

      if (matchText.includes(q)) {
        const rateLabel = isGen ? `Generated: ${flowFormatted}` : isCons ? `Consumed: ${flowFormatted}` : `Volume: ${node.details || flowFormatted}`;
        results.push({
          id: `node-${node.id}`,
          title: `${node.name} (${typeLabel})`,
          subtitle: `${rateLabel} · ${node.gasType} · ${location} · Status: ${node.status.toUpperCase()}`,
          category: isGen ? 'generator' : isCons ? 'consumer' : 'holder',
          icon: isGen ? <Factory className="w-4 h-4" /> : isCons ? <Flame className="w-4 h-4" /> : <Scale className="w-4 h-4" />,
          action: () => {
            setCurrentView(isGen ? 'generation' : isCons ? 'consumption' : 'balance');
            setSearchOpen(false);
            setLocalSearch('');
          }
        });
      }
    });

    // Match gas types
    gasMetrics.forEach(gas => {
      const matchText = `${gas.name} ${gas.fullName} ${gas.status} balance generation consumption`.toLowerCase();
      if (matchText.includes(q)) {
        results.push({
          id: `gas-${gas.id}`,
          title: `${gas.fullName} (${gas.name})`,
          subtitle: `Total Gen: ${gas.generation.toLocaleString()} Nm³/h · Total Cons: ${gas.consumption.toLocaleString()} Nm³/h · Net: ${gas.balance > 0 ? '+' : ''}${gas.balance.toLocaleString()} Nm³/h (${gas.status})`,
          category: 'gas-type',
          icon: <Scale className="w-4 h-4" />,
          action: () => { setCurrentView('balance'); setSearchOpen(false); setLocalSearch(''); }
        });
      }
    });

    // Match alerts
    alerts.forEach(alert => {
      const matchText = `${alert.title} ${alert.description} ${alert.gasType} ${alert.location} ${alert.severity}`.toLowerCase();
      if (matchText.includes(q)) {
        results.push({
          id: `alert-${alert.id}`,
          title: alert.title,
          subtitle: `${alert.severity.toUpperCase()} · ${alert.gasType} · ${alert.location} · ${alert.timestamp}`,
          category: 'alert',
          icon: <AlertTriangle className="w-4 h-4" />,
          action: () => { setCurrentView('alerts'); setSearchOpen(false); setLocalSearch(''); }
        });
      }
    });

    return results.slice(0, 20);
  }, [localSearch, nodes, gasMetrics, alerts, setCurrentView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setLocalSearch('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Arrow key navigation in results
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
        e.preventDefault();
        searchResults[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen, selectedIndex, searchResults]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [localSearch]);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setLocalSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'navigation': return { bg: 'bg-[#FF6B00]/10', text: 'text-[#FF6B00]' };
      case 'generator': return { bg: 'bg-[#059669]/10', text: 'text-[#059669]' };
      case 'consumer': return { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' };
      case 'holder': return { bg: 'bg-[#2563EB]/10', text: 'text-[#2563EB]' };
      case 'alert': return { bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' };
      case 'gas-type': return { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]' };
      default: return { bg: 'bg-[#64748B]/10', text: 'text-[#64748B]' };
    }
  };

  return (
    <>
      <header className={`
        h-16 fixed top-0 right-0 left-0 bg-[#09090B] border-b border-zinc-800 flex items-center justify-between px-2.5 sm:px-4 md:px-6 z-20 shadow-2xl text-white
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'md:left-[68px]' : 'md:left-[280px]'}
      `}>
        {/* Left: Mobile Toggle + Search Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 mr-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-zinc-300 p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <img src="/gasmind_logo.jpg" alt="GasMind Logo" className="w-8 h-8 rounded-full object-cover border border-zinc-700 shadow shrink-0" />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>

          {/* Global Search Trigger */}
          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-white hover:bg-zinc-800/80 transition-all cursor-pointer flex-1 max-w-[280px]"
          >
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-xs font-mono text-zinc-400 flex-1 text-left truncate">Search anything...</span>
            <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-mono text-zinc-400">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer ${
              soundEnabled
                ? 'text-zinc-200 hover:bg-zinc-800'
                : 'text-zinc-500 hover:bg-zinc-900'
            }`}
            title={soundEnabled ? 'Sound notifications ON' : 'Sound notifications OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Live Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded border text-[11px] font-mono font-bold transition-colors ${
              isLive
                ? 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
            }`}
            title="Toggle live telemetry stream"
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-white animate-pulse glow-flame' : 'bg-zinc-600'}`} />
            <span className="hidden sm:inline">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Export */}
          <button
            onClick={triggerExport}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-zinc-800 text-white border border-zinc-700 hover:border-white rounded text-[11px] sm:text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setAlertsMenuOpen(!alertsMenuOpen)}
              className="p-1.5 sm:p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unacknowledged.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white text-black rounded-full text-[8px] font-mono font-bold flex items-center justify-center animate-pulse glow-rose">
                  {unacknowledged.length}
                </span>
              )}
            </button>

            {alertsMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 p-4 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-white" />
                    <h3 className="text-sm font-bold text-white">Operational Alerts</h3>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('alerts');
                      setAlertsMenuOpen(false);
                    }}
                    className="text-xs text-zinc-300 hover:underline font-mono font-bold cursor-pointer"
                  >
                    View Console ({alerts.length})
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {alerts.slice(0, 4).map((a) => (
                    <div key={a.id} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
                      <div className="flex items-center justify-between text-zinc-400 mb-1 font-mono">
                        <span className="font-bold uppercase text-white">{a.severity}</span>
                        <span>{a.timestamp}</span>
                      </div>
                      <p className="font-bold text-white mb-0.5">{a.title}</p>
                      <p className="text-zinc-400 text-[11px] line-clamp-2">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => { setSearchOpen(false); setLocalSearch(''); }} />

          {/* Search Panel */}
          <div ref={searchRef} className="relative w-full max-w-2xl mx-4 bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden text-white">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <Search className="w-5 h-5 text-white shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search pages, generators, consumers, alerts, gas types..."
                className="flex-1 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none bg-transparent"
                autoFocus
              />
              <button
                onClick={() => { setSearchOpen(false); setLocalSearch(''); }}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto py-2">
              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Search className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs font-mono text-zinc-400">No results found for "{localSearch}"</p>
                </div>
              ) : (
                <>
                  {!localSearch && (
                    <p className="px-4 py-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Quick Navigation</p>
                  )}
                  {searchResults.map((result, i) => {
                    return (
                      <button
                        key={result.id}
                        onClick={result.action}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                          selectedIndex === i ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 text-zinc-300'
                        }`}
                      >
                        <div className="p-1.5 rounded bg-zinc-800 text-white shrink-0">
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-bold text-white truncate">{result.title}</p>
                          <p className="text-[10px] font-mono text-zinc-400 truncate">{result.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold capitalize bg-zinc-800 text-zinc-400">
                            {result.category.replace('-', ' ')}
                          </span>
                          {selectedIndex === i && <ArrowRight className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-white">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-white">↵</kbd> Select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-white">Esc</kbd> Close</span>
              </div>
              <span>{searchResults.length} results</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Notification Toast */}
      {exportNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-flame-gradient text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-white/20 animate-bounce glow-flame font-mono text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{exportNotification}</span>
        </div>
      )}
    </>
  );
};
