import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  Clock,
  Filter
} from 'lucide-react';
import { playCriticalAlert, playWarningAlert, playInfoAlert } from '../utils/soundNotifications';

export const AlertsConsoleView: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert, soundEnabled, setSoundEnabled } = useGasData();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = filterSeverity === 'all'
    ? alerts
    : filterSeverity === 'unacknowledged'
    ? alerts.filter(a => !a.acknowledged)
    : alerts.filter(a => a.severity === filterSeverity);

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;
  const unackedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#DC2626]" />
            Operational Alerts Console
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">
            Real-time alert dispatching with sound notifications, event logging, and response coordination.
          </p>
        </div>

        {/* Sound Toggle & Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#D1FAE5] text-[#059669] border-[#059669]/30 hover:bg-[#A7F3D0]'
                : 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30 hover:bg-[#FCA5A5]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </button>
        </div>
      </div>

      {/* Sound Notification Legend */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BellRing className="w-4 h-4 text-[#FF6B00]" />
          <h3 className="font-display text-sm font-bold text-[#0F172A]">Alert Sound Notifications</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            soundEnabled ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'
          }`}>
            {soundEnabled ? 'ACTIVE' : 'MUTED'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Critical */}
          <div className="flex items-center justify-between p-2.5 bg-[#FEE2E2]/30 border border-[#DC2626]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#DC2626] rounded text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-[#DC2626]">Critical</p>
                <p className="text-[9px] font-mono text-[#64748B]">Triple alarm beep</p>
              </div>
            </div>
            <button
              onClick={() => playCriticalAlert()}
              className="px-2 py-1 bg-[#DC2626] text-white rounded text-[10px] font-mono font-bold hover:bg-[#B91C1C] cursor-pointer transition-colors"
            >
              Test
            </button>
          </div>

          {/* Warning */}
          <div className="flex items-center justify-between p-2.5 bg-[#FEF3C7]/30 border border-[#D97706]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#D97706] rounded text-white">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-[#D97706]">Warning</p>
                <p className="text-[9px] font-mono text-[#64748B]">Double tone alert</p>
              </div>
            </div>
            <button
              onClick={() => playWarningAlert()}
              className="px-2 py-1 bg-[#D97706] text-white rounded text-[10px] font-mono font-bold hover:bg-[#B45309] cursor-pointer transition-colors"
            >
              Test
            </button>
          </div>

          {/* Info */}
          <div className="flex items-center justify-between p-2.5 bg-[#DBEAFE]/30 border border-[#2563EB]/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#2563EB] rounded text-white">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-[#2563EB]">Info</p>
                <p className="text-[9px] font-mono text-[#64748B]">Single soft chime</p>
              </div>
            </div>
            <button
              onClick={() => playInfoAlert()}
              className="px-2 py-1 bg-[#2563EB] text-white rounded text-[10px] font-mono font-bold hover:bg-[#1D4ED8] cursor-pointer transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        {/* Alert Rules Info */}
        <div className="mt-3 p-2.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]">
          <p className="text-[10px] font-mono text-[#64748B] leading-relaxed">
            <span className="font-bold text-[#0F172A]">Auto-Alert Rules:</span>{' '}
            <span className="text-[#DC2626] font-bold">CRITICAL</span> — Gas deficit detected, holder critically low, equipment failure{' · '}
            <span className="text-[#D97706] font-bold">WARNING</span> — Utilization approaching threshold, holder high, pressure deviation, surplus underutilized{' · '}
            <span className="text-[#2563EB] font-bold">INFO</span> — Simulation completed, report exported, optimization applied, system nominal
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Alerts', value: alerts.length, icon: <Bell className="w-4 h-4" />, color: '#FF6B00' },
          { label: 'Critical', value: criticalCount, icon: <AlertTriangle className="w-4 h-4" />, color: '#DC2626' },
          { label: 'Warnings', value: warningCount, icon: <ShieldAlert className="w-4 h-4" />, color: '#D97706' },
          { label: 'Unacknowledged', value: unackedCount, icon: <Clock className="w-4 h-4" />, color: '#7C3AED' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#CBD5E1] rounded-lg p-3.5 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded" style={{ backgroundColor: `${stat.color}15` }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">{stat.label}</span>
            </div>
            <p className="text-xl font-display font-extrabold text-[#0F172A]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#64748B]" />
        <div className="flex gap-1.5 bg-white p-1 border border-[#CBD5E1] rounded-lg text-xs font-mono shadow-sm">
          {[
            { key: 'all', label: 'All' },
            { key: 'unacknowledged', label: `Unacked (${unackedCount})` },
            { key: 'critical', label: `Critical (${criticalCount})` },
            { key: 'warning', label: `Warning (${warningCount})` },
            { key: 'info', label: `Info (${infoCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterSeverity(tab.key)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer font-bold ${
                filterSeverity === tab.key
                  ? 'bg-flame-gradient text-white glow-flame'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8F9FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#CBD5E1] rounded-lg">
            <CheckCircle2 className="w-8 h-8 text-[#059669] mx-auto mb-2" />
            <p className="text-sm font-mono text-[#64748B]">
              No active alerts matching the selected filter.
            </p>
            <p className="text-xs font-mono text-[#94A3B8] mt-1">Network telemetry is nominal.</p>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`bg-white border rounded-lg p-4 relative transition-all shadow-sm hover:shadow-md ${
                alt.severity === 'critical' ? 'border-[#DC2626]/50' :
                alt.severity === 'warning' ? 'border-[#D97706]/50' : 'border-[#CBD5E1]'
              } ${!alt.acknowledged && alt.severity === 'critical' ? 'ring-1 ring-[#DC2626]/20' : ''}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${
                alt.severity === 'critical' ? 'bg-[#DC2626]' :
                alt.severity === 'warning' ? 'bg-[#D97706]' : 'bg-[#2563EB]'
              }`} />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded ${
                    alt.severity === 'critical' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                    alt.severity === 'warning' ? 'bg-[#FEF3C7] text-[#D97706]' :
                    'bg-[#DBEAFE] text-[#2563EB]'
                  }`}>
                    {alt.severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> :
                     alt.severity === 'warning' ? <ShieldAlert className="w-5 h-5" /> :
                     <Info className="w-5 h-5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-[#0F172A] text-sm">{alt.title}</h4>
                      <span className="text-[10px] font-mono text-[#64748B]">[{alt.timestamp}]</span>
                      <span className="text-[10px] font-mono font-bold text-[#FF6B00] bg-[#FFF3E0] px-1.5 py-0.5 rounded">
                        {alt.gasType}
                      </span>
                      {!alt.acknowledged && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded animate-pulse">
                          <Volume2 className="w-2.5 h-2.5" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#334155] font-mono mt-1">{alt.description}</p>
                    {alt.actionRequired && (
                      <p className="text-[11px] text-[#D97706] font-mono mt-1 font-semibold">
                        <span>Recommended Action: </span>
                        {alt.actionRequired}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!alt.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="px-3 py-1.5 bg-[#059669] text-white rounded text-xs font-mono font-bold hover:bg-[#047857] transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Acknowledge
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-[#F8F9FA] text-[#64748B] border border-[#CBD5E1] rounded text-xs font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                      Acknowledged
                    </span>
                  )}
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
