import React, { useState, useMemo } from 'react';
import {
  Clock,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Power,
  Factory,
  Flame,
  ShieldAlert,
  Settings2,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { ParticleCard } from '../../components';

type EventCategory = 'all' | 'alert' | 'outage' | 'generation' | 'consumption' | 'maintenance' | 'optimization';
type TimeFilter = 'daily' | 'weekly' | 'monthly';
type EventSeverity = 'critical' | 'warning' | 'info' | 'success';

interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  title: string;
  description: string;
  category: Exclude<EventCategory, 'all'>;
  severity: EventSeverity;
  location: string;
  gasType: string;
  resolved: boolean;
  resolutionTime?: string;
  impact?: string;
}

const allEvents: TimelineEvent[] = [
  {
    id: 'ev-001', timestamp: '2026-09-08T22:15:00', date: '2026-09-08', time: '22:15',
    title: 'BF Gas Network Deficit Alarm Triggered',
    description: 'Total BF Gas generation (1,721,200 Nm³/h) dropped below demand (1,736,000 Nm³/h). Deficit: -14,800 Nm³/h. BF Gasholder draw-down initiated.',
    category: 'alert', severity: 'critical', location: 'BF Gas Main Trunk', gasType: 'BF Gas',
    resolved: false, impact: 'Holder buffer depleting at 14,800 Nm³/h deficit rate'
  },
  {
    id: 'ev-002', timestamp: '2026-09-08T20:30:00', date: '2026-09-08', time: '20:30',
    title: 'Power House #4 CO Gas Firing Rate Increased',
    description: 'CO Gas consumption at PH#4 increased from 18,000 to 22,000 Nm³/h to offset BF Gas supply constraints.',
    category: 'optimization', severity: 'info', location: 'Power House #4', gasType: 'CO Gas',
    resolved: true, resolutionTime: '20:45', impact: '+4,000 Nm³/h CO Gas demand shift'
  },
  {
    id: 'ev-003', timestamp: '2026-09-08T18:00:00', date: '2026-09-08', time: '18:00',
    title: 'Shift Change: Night Shift Commenced',
    description: 'Operational handover from Afternoon to Night shift. All systems nominal at handover.',
    category: 'maintenance', severity: 'info', location: 'Central Control Room', gasType: 'All',
    resolved: true
  },
  {
    id: 'ev-004', timestamp: '2026-09-08T16:42:00', date: '2026-09-08', time: '16:42',
    title: 'Blast Furnace F Pressure Drop Warning',
    description: 'BF-F gas output pressure dropped from 13.9 kPa to 12.8 kPa. Generation reduced by ~15,000 Nm³/h. Maintenance team notified.',
    category: 'alert', severity: 'warning', location: 'Blast Furnace F', gasType: 'BF Gas',
    resolved: true, resolutionTime: '17:20', impact: '-15,000 Nm³/h BF Gas (temporary)'
  },
  {
    id: 'ev-005', timestamp: '2026-09-08T14:00:00', date: '2026-09-08', time: '14:00',
    title: 'CO Gas Holder Level High Warning',
    description: 'CO Gasholder volume reached 84% capacity (67,200 m³). Surplus gas being buffered at +7,400 Nm³/h.',
    category: 'alert', severity: 'warning', location: 'CO Gasholder Compound', gasType: 'CO Gas',
    resolved: true, resolutionTime: '14:30', impact: 'Holder headroom: 12,800 m³ remaining'
  },
  {
    id: 'ev-006', timestamp: '2026-09-08T11:15:00', date: '2026-09-08', time: '11:15',
    title: 'LD-2 Converter Blow Completed',
    description: 'LD-2 converter completed steel blow cycle. LD Gas recovery: 65,000 Nm³/h captured and sent to LD Gasholder.',
    category: 'generation', severity: 'success', location: 'Steel Melting Shop', gasType: 'LD Gas',
    resolved: true, impact: '+65,000 Nm³/h LD Gas recovery'
  },
  {
    id: 'ev-007', timestamp: '2026-09-08T08:30:00', date: '2026-09-08', time: '08:30',
    title: 'HSM Rolling Mill Production Ramp-Up',
    description: 'Hot Strip Mill increased production rate. CO Gas demand increased from 25,000 to 30,000 Nm³/h.',
    category: 'consumption', severity: 'info', location: 'Hot Strip Mill', gasType: 'CO Gas',
    resolved: true, impact: '+5,000 Nm³/h CO Gas demand'
  },
  {
    id: 'ev-008', timestamp: '2026-09-07T23:50:00', date: '2026-09-07', time: '23:50',
    title: 'Blast Furnace I Stove Cycling Completed',
    description: 'BF-I hot blast stoves completed cycling. Internal consumption stabilized at 194,000 Nm³/h.',
    category: 'generation', severity: 'success', location: 'Blast Furnace I', gasType: 'BF Gas',
    resolved: true
  },
  {
    id: 'ev-009', timestamp: '2026-09-07T19:30:00', date: '2026-09-07', time: '19:30',
    title: 'Planned Maintenance: Coke Battery 9 Inspection',
    description: 'Scheduled inspection of Coke Battery 9 heating walls. Old BPP generation temporarily reduced by ~8,000 Nm³/h.',
    category: 'maintenance', severity: 'warning', location: 'Old BPP (Batt 8 & 9)', gasType: 'CO Gas',
    resolved: true, resolutionTime: '21:00', impact: '-8,000 Nm³/h CO Gas for 1.5 hours'
  },
  {
    id: 'ev-010', timestamp: '2026-09-07T15:00:00', date: '2026-09-07', time: '15:00',
    title: 'Gas Balance Optimization Applied',
    description: 'AI-recommended CO Gas rerouting to Boiler Unit 4 applied. External natural gas consumption reduced by 12%.',
    category: 'optimization', severity: 'success', location: 'Power House #4', gasType: 'CO Gas',
    resolved: true, impact: 'Savings: ~$1,250/shift, 4.2 tCO2e reduction'
  }
];

const categoryConfig: Record<Exclude<EventCategory, 'all'>, { label: string; icon: React.ReactNode }> = {
  alert: { label: 'Alert', icon: <AlertTriangle className="w-3.5 h-3.5 text-white" /> },
  outage: { label: 'Outage', icon: <Power className="w-3.5 h-3.5 text-zinc-300" /> },
  generation: { label: 'Generation', icon: <Factory className="w-3.5 h-3.5 text-white" /> },
  consumption: { label: 'Consumption', icon: <Flame className="w-3.5 h-3.5 text-white" /> },
  maintenance: { label: 'Maintenance', icon: <Settings2 className="w-3.5 h-3.5 text-zinc-400" /> },
  optimization: { label: 'Optimization', icon: <TrendingUp className="w-3.5 h-3.5 text-white" /> },
};

export const EventTimelineView: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    if (categoryFilter !== 'all') {
      events = events.filter(e => e.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.gasType.toLowerCase().includes(q)
      );
    }

    return events;
  }, [categoryFilter, searchQuery]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};

    filteredEvents.forEach(event => {
      let key: string;
      const d = new Date(event.timestamp);

      if (timeFilter === 'daily') {
        key = event.date;
      } else if (timeFilter === 'weekly') {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d);
        monday.setDate(diff);
        key = `Week of ${monday.toISOString().split('T')[0]}`;
      } else {
        key = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    return groups;
  }, [filteredEvents, timeFilter]);

  const totalEvents = filteredEvents.length;
  const unresolvedCount = filteredEvents.filter(e => !e.resolved).length;
  const criticalCount = filteredEvents.filter(e => e.severity === 'critical').length;

  return (
    <div className="space-y-5 text-white">
      {/* Page Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-white" />
          Event Timeline
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Complete operational history of the gas network — every event, alert, outage, and optimization logged with timestamps.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: totalEvents, icon: <Calendar className="w-4 h-4 text-white" /> },
          { label: 'Unresolved', value: unresolvedCount, icon: <ShieldAlert className="w-4 h-4 text-white" /> },
          { label: 'Critical Events', value: criticalCount, icon: <AlertTriangle className="w-4 h-4 text-white" /> },
          { label: 'Time Groups', value: Object.keys(groupedEvents).length, icon: <Filter className="w-4 h-4 text-zinc-300" /> },
        ].map(card => (
          <ParticleCard key={card.label} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700">
                {card.icon}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-mono font-extrabold text-white">{card.value}</p>
          </ParticleCard>
        ))}
      </div>

      {/* Filters Bar */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-zinc-800">
            {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all capitalize cursor-pointer ${
                  timeFilter === tf
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white text-black font-bold' : 'bg-black text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.entries(categoryConfig) as [Exclude<EventCategory, 'all'>, typeof categoryConfig['alert']][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  categoryFilter === key
                    ? 'bg-white text-black font-bold'
                    : 'bg-black text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {config.icon}
                {config.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 lg:max-w-xs ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-8 pr-3 py-2 bg-black border border-zinc-800 rounded text-xs font-mono text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>
      </ParticleCard>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([groupLabel, events]) => (
          <div key={groupLabel}>
            {/* Group Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-white rounded-lg font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{groupLabel}</span>
              </div>
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] font-mono text-zinc-400">{events.length} events</span>
            </div>

            {/* Event Cards */}
            <div className="relative ml-4 border-l-2 border-zinc-800 space-y-3 pl-6">
              {events.map(event => {
                const cat = categoryConfig[event.category];
                const isExpanded = expandedId === event.id;

                return (
                  <ParticleCard key={event.id} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg overflow-hidden transition-all">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : event.id)}
                      className="w-full text-left p-3.5 cursor-pointer hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-1.5 rounded bg-zinc-900 border border-zinc-700 shrink-0 mt-0.5">
                            {cat.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4 className="font-mono font-bold text-xs text-white truncate">{event.title}</h4>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono text-zinc-400">{event.time}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
                                {event.severity}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                                {cat.label}
                              </span>
                              <span className="text-[10px] font-mono text-white font-bold">{event.gasType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {event.resolved ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-zinc-800 p-3.5 bg-black/60 space-y-2.5">
                        <p className="text-xs font-mono text-zinc-400 leading-relaxed">{event.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Location</span>
                            <span className="text-[11px] font-mono font-bold text-white">{event.location}</span>
                          </div>
                          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Gas Type</span>
                            <span className="text-[11px] font-mono font-bold text-white">{event.gasType}</span>
                          </div>
                          <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase block">Status</span>
                            <span className="text-[11px] font-mono font-bold text-white">
                              {event.resolved ? '✓ Resolved' : '● Active'}
                            </span>
                          </div>
                          {event.resolutionTime && (
                            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                              <span className="text-[9px] font-mono text-zinc-400 uppercase block">Resolved At</span>
                              <span className="text-[11px] font-mono font-bold text-white">{event.resolutionTime}</span>
                            </div>
                          )}
                        </div>

                        {event.impact && (
                          <div className="p-2.5 bg-zinc-900 border border-zinc-700 rounded flex items-start gap-2">
                            <Zap className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                            <span className="text-[11px] font-mono text-white font-semibold">{event.impact}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </ParticleCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTimelineView;
