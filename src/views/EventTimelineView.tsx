import React, { useState, useMemo } from 'react';
import {
  Clock,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Power,
  Factory,
  Flame,
  ShieldAlert,
  Settings2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

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

// Realistic event history spanning multiple days
const allEvents: TimelineEvent[] = [
  // Today (Sept 8)
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

  // Yesterday (Sept 7)
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
  },
  {
    id: 'ev-011', timestamp: '2026-09-07T12:15:00', date: '2026-09-07', time: '12:15',
    title: 'Power House #6 Load Peak',
    description: 'PH#6 BF Gas consumption peaked at 310,000 Nm³/h due to increased power demand. Returned to 300,000 Nm³/h by 13:00.',
    category: 'consumption', severity: 'warning', location: 'Power House #6', gasType: 'BF Gas',
    resolved: true, resolutionTime: '13:00', impact: '+10,000 Nm³/h BF Gas peak demand'
  },
  {
    id: 'ev-012', timestamp: '2026-09-07T06:00:00', date: '2026-09-07', time: '06:00',
    title: 'Shift Change: Morning Shift Commenced',
    description: 'Operational handover from Night to Morning shift. BF Gas deficit of -12,000 Nm³/h noted in handover log.',
    category: 'maintenance', severity: 'info', location: 'Central Control Room', gasType: 'All',
    resolved: true
  },

  // Sept 6
  {
    id: 'ev-013', timestamp: '2026-09-06T22:00:00', date: '2026-09-06', time: '22:00',
    title: 'BF-G Tuyere Replacement Completed',
    description: 'Emergency tuyere replacement on BF-G completed. Full generation capacity of 322,000 Nm³/h restored.',
    category: 'outage', severity: 'success', location: 'Blast Furnace G', gasType: 'BF Gas',
    resolved: true, resolutionTime: '22:00', impact: 'Generation fully restored'
  },
  {
    id: 'ev-014', timestamp: '2026-09-06T14:30:00', date: '2026-09-06', time: '14:30',
    title: 'BF-G Partial Outage: Tuyere Failure',
    description: 'Blast Furnace G reported tuyere failure. Generation reduced from 322,000 to 260,000 Nm³/h. Emergency repair crew dispatched.',
    category: 'outage', severity: 'critical', location: 'Blast Furnace G', gasType: 'BF Gas',
    resolved: true, resolutionTime: '22:00', impact: '-62,000 Nm³/h BF Gas for 7.5 hours'
  },
  {
    id: 'ev-015', timestamp: '2026-09-06T10:00:00', date: '2026-09-06', time: '10:00',
    title: 'Sinter Plant Ignition Hood Gas Adjustment',
    description: 'Sinter Plant ignition hood CO Gas supply adjusted from 14,000 to 12,000 Nm³/h to improve sintering efficiency.',
    category: 'optimization', severity: 'info', location: 'Sinter Plant', gasType: 'CO Gas',
    resolved: true, impact: '-2,000 Nm³/h CO Gas optimized'
  },

  // Sept 5
  {
    id: 'ev-016', timestamp: '2026-09-05T20:00:00', date: '2026-09-05', time: '20:00',
    title: 'LD Gasholder Level Critical Low',
    description: 'LD Gasholder dropped to 22% (11,000 m³). No converter blow scheduled for 4 hours.',
    category: 'alert', severity: 'critical', location: 'LD Gasholder', gasType: 'LD Gas',
    resolved: true, resolutionTime: '23:30', impact: 'LD Gas unavailable for cross-firing'
  },
  {
    id: 'ev-017', timestamp: '2026-09-05T16:00:00', date: '2026-09-05', time: '16:00',
    title: 'New BPP Generation Record',
    description: 'New BPP (Batt 10 & 11) achieved 82,000 Nm³/h output — new daily record. Attributed to improved coking coal quality.',
    category: 'generation', severity: 'success', location: 'New BPP (Batt 10 & 11)', gasType: 'CO Gas',
    resolved: true, impact: '+2,000 Nm³/h above normal baseline'
  },
  {
    id: 'ev-018', timestamp: '2026-09-05T08:00:00', date: '2026-09-05', time: '08:00',
    title: 'Pelletizing Plant Maintenance Window',
    description: 'Scheduled 4-hour maintenance window for Pelletizing Plant burner inspection. CO Gas demand reduced by 18,000 Nm³/h.',
    category: 'maintenance', severity: 'info', location: 'Pelletizing Plant', gasType: 'CO Gas',
    resolved: true, resolutionTime: '12:00', impact: '-18,000 Nm³/h CO Gas for 4 hours'
  },

  // Sept 4
  {
    id: 'ev-019', timestamp: '2026-09-04T17:30:00', date: '2026-09-04', time: '17:30',
    title: 'Emergency Gas Flaring Event',
    description: 'BF Gas surplus of +45,000 Nm³/h could not be absorbed. Emergency flaring activated for 2 hours.',
    category: 'alert', severity: 'critical', location: 'Flare Stack', gasType: 'BF Gas',
    resolved: true, resolutionTime: '19:30', impact: '90,000 Nm³ flared (estimated $720 loss)'
  },
  {
    id: 'ev-020', timestamp: '2026-09-04T10:00:00', date: '2026-09-04', time: '10:00',
    title: 'Coke Battery 10 Heating Wall Inspection',
    description: 'Routine inspection of Battery 10 heating walls. No defects found. Generation uninterrupted.',
    category: 'maintenance', severity: 'success', location: 'New BPP (Batt 10)', gasType: 'CO Gas',
    resolved: true
  },

  // Sept 2-3
  {
    id: 'ev-021', timestamp: '2026-09-03T14:00:00', date: '2026-09-03', time: '14:00',
    title: 'BF-E Planned Shutdown & Relining',
    description: 'BF-E commenced planned shutdown for relining. Expected downtime: 72 hours. BF Gas generation reduced by 82,200 Nm³/h.',
    category: 'outage', severity: 'warning', location: 'Blast Furnace E', gasType: 'BF Gas',
    resolved: true, resolutionTime: '2026-09-06 14:00', impact: '-82,200 Nm³/h for 72 hours'
  },
  {
    id: 'ev-022', timestamp: '2026-09-02T09:00:00', date: '2026-09-02', time: '09:00',
    title: 'Monthly Gas Audit Completed',
    description: 'September monthly gas audit completed. All flow meters calibrated. No discrepancies found.',
    category: 'maintenance', severity: 'success', location: 'All Gas Networks', gasType: 'All',
    resolved: true
  },
  {
    id: 'ev-023', timestamp: '2026-09-01T06:00:00', date: '2026-09-01', time: '06:00',
    title: 'September Operations Commenced',
    description: 'New month operations started. All generators and consumers nominal. Total BF Gas: 1,721,200 Nm³/h.',
    category: 'maintenance', severity: 'info', location: 'Plant-Wide', gasType: 'All',
    resolved: true
  },
];

const categoryConfig: Record<Exclude<EventCategory, 'all'>, { label: string; icon: React.ReactNode; color: string }> = {
  alert: { label: 'Alert', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#DC2626' },
  outage: { label: 'Outage', icon: <Power className="w-3.5 h-3.5" />, color: '#7C3AED' },
  generation: { label: 'Generation', icon: <Factory className="w-3.5 h-3.5" />, color: '#059669' },
  consumption: { label: 'Consumption', icon: <Flame className="w-3.5 h-3.5" />, color: '#FF6B00' },
  maintenance: { label: 'Maintenance', icon: <Settings2 className="w-3.5 h-3.5" />, color: '#2563EB' },
  optimization: { label: 'Optimization', icon: <TrendingUp className="w-3.5 h-3.5" />, color: '#059669' },
};

const sevConfig: Record<EventSeverity, { color: string; bg: string; border: string }> = {
  critical: { color: '#DC2626', bg: 'bg-[#FEE2E2]', border: 'border-[#DC2626]/30' },
  warning: { color: '#D97706', bg: 'bg-[#FEF3C7]', border: 'border-[#D97706]/30' },
  info: { color: '#2563EB', bg: 'bg-[#DBEAFE]', border: 'border-[#2563EB]/30' },
  success: { color: '#059669', bg: 'bg-[#D1FAE5]', border: 'border-[#059669]/30' },
};

export const EventTimelineView: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Category filter
    if (categoryFilter !== 'all') {
      events = events.filter(e => e.category === categoryFilter);
    }

    // Search filter
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

  // Group events by time filter
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};

    filteredEvents.forEach(event => {
      let key: string;
      const d = new Date(event.timestamp);

      if (timeFilter === 'daily') {
        key = event.date;
      } else if (timeFilter === 'weekly') {
        // Get Monday of the week
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
    <div className="space-y-5">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#CBD5E1]">
        <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#FF6B00]" />
          Event Timeline
        </h2>
        <p className="text-xs text-[#475569] font-mono mt-1">
          Complete operational history of the gas network — every event, alert, outage, and optimization logged with timestamps.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: totalEvents, icon: <Calendar className="w-4 h-4" />, color: '#FF6B00' },
          { label: 'Unresolved', value: unresolvedCount, icon: <ShieldAlert className="w-4 h-4" />, color: '#DC2626' },
          { label: 'Critical Events', value: criticalCount, icon: <AlertTriangle className="w-4 h-4" />, color: '#DC2626' },
          { label: 'Time Groups', value: Object.keys(groupedEvents).length, icon: <Filter className="w-4 h-4" />, color: '#2563EB' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded" style={{ backgroundColor: `${card.color}15` }}>
                <span style={{ color: card.color }}>{card.icon}</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-display font-extrabold text-[#0F172A]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* Time Filter */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#CBD5E1]">
            {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all capitalize cursor-pointer ${
                  timeFilter === tf
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
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
                categoryFilter === 'all' ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
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
                    ? 'text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
                }`}
                style={{
                  backgroundColor: categoryFilter === key ? config.color : undefined,
                }}
              >
                {config.icon}
                {config.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 lg:max-w-xs ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-8 pr-3 py-2 bg-[#F8F9FA] border border-[#CBD5E1] rounded text-xs font-mono text-[#0F172A] focus:border-[#FF6B00] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([groupLabel, events]) => (
          <div key={groupLabel}>
            {/* Group Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] text-white rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-mono font-bold">{groupLabel}</span>
              </div>
              <div className="flex-1 h-px bg-[#CBD5E1]" />
              <span className="text-[10px] font-mono text-[#64748B]">{events.length} events</span>
            </div>

            {/* Event Cards */}
            <div className="relative ml-4 border-l-2 border-[#E2E8F0] space-y-3 pl-6">
              {events.map(event => {
                const cat = categoryConfig[event.category];
                const sev = sevConfig[event.severity];
                const isExpanded = expandedId === event.id;

                return (
                  <div key={event.id} className="relative">
                    {/* Timeline Dot */}
                    <div
                      className="absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: sev.color }}
                    />

                    {/* Event Card */}
                    <div
                      className={`bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                        !event.resolved ? `border-[${sev.color}]/40 ring-1 ring-[${sev.color}]/20` : 'border-[#CBD5E1]'
                      }`}
                      style={{
                        borderColor: !event.resolved ? `${sev.color}60` : undefined,
                      }}
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : event.id)}
                        className="w-full text-left p-3.5 cursor-pointer hover:bg-[#FAFBFC] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Category Icon */}
                            <div className="p-1.5 rounded shrink-0 mt-0.5" style={{ backgroundColor: `${cat.color}15` }}>
                              <span style={{ color: cat.color }}>{cat.icon}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h4 className="font-display font-bold text-xs text-[#0F172A] truncate">{event.title}</h4>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono text-[#64748B]">{event.time}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${sev.bg} ${sev.border} border`}
                                  style={{ color: sev.color }}
                                >
                                  {event.severity}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                  {cat.label}
                                </span>
                                <span className="text-[10px] font-mono text-[#FF6B00] font-bold">{event.gasType}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {event.resolved ? (
                              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-[#E2E8F0] p-3.5 bg-[#FAFBFC] space-y-2.5">
                          <p className="text-xs font-mono text-[#475569] leading-relaxed">{event.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                              <span className="text-[9px] font-mono text-[#64748B] uppercase block">Location</span>
                              <span className="text-[11px] font-mono font-bold text-[#0F172A]">{event.location}</span>
                            </div>
                            <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                              <span className="text-[9px] font-mono text-[#64748B] uppercase block">Gas Type</span>
                              <span className="text-[11px] font-mono font-bold text-[#FF6B00]">{event.gasType}</span>
                            </div>
                            <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                              <span className="text-[9px] font-mono text-[#64748B] uppercase block">Status</span>
                              <span className={`text-[11px] font-mono font-bold ${event.resolved ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                                {event.resolved ? '✓ Resolved' : '● Active'}
                              </span>
                            </div>
                            {event.resolutionTime && (
                              <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                                <span className="text-[9px] font-mono text-[#64748B] uppercase block">Resolved At</span>
                                <span className="text-[11px] font-mono font-bold text-[#0F172A]">{event.resolutionTime}</span>
                              </div>
                            )}
                          </div>

                          {event.impact && (
                            <div className="p-2.5 bg-[#FEF3C7]/30 border border-[#D97706]/20 rounded flex items-start gap-2">
                              <Zap className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                              <span className="text-[11px] font-mono text-[#D97706] font-semibold">{event.impact}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {Object.keys(groupedEvents).length === 0 && (
          <div className="p-12 text-center bg-white border border-[#CBD5E1] rounded-lg">
            <Search className="w-8 h-8 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-sm font-mono text-[#64748B]">No events found matching your filters.</p>
            <button
              onClick={() => { setCategoryFilter('all'); setSearchQuery(''); }}
              className="mt-2 text-xs font-mono text-[#FF6B00] hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
