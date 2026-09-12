import React, { useState } from 'react';
import { useGasData } from '../../context';
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
import { playCriticalAlert, playWarningAlert, playInfoAlert } from '../../utils';
import { ParticleCard } from '../../components';

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
    <div className="space-y-5 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-white" />
            Operational Alerts Console
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Real-time alert dispatching with sound notifications, event logging, and response coordination.
          </p>
        </div>

        {/* Sound Toggle & Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </button>
        </div>
      </div>

      {/* Sound Notification Legend */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <BellRing className="w-4 h-4 text-white" />
          <h3 className="font-mono text-sm font-bold text-white">Alert Sound Notifications</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-700 ${
            soundEnabled ? 'text-white' : 'text-zinc-500'
          }`}>
            {soundEnabled ? 'ACTIVE' : 'MUTED'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Critical */}
          <div className="flex items-center justify-between p-2.5 bg-black border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-white">Critical</p>
                <p className="text-[9px] font-mono text-zinc-400">Triple alarm beep</p>
              </div>
            </div>
            <button
              onClick={() => playCriticalAlert()}
              className="px-3 py-1 bg-white text-black rounded text-[10px] font-mono font-bold hover:bg-zinc-200 shadow cursor-pointer transition-all active:scale-95"
            >
              Test
            </button>
          </div>

          {/* Warning */}
          <div className="flex items-center justify-between p-2.5 bg-black border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-white">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-white">Warning</p>
                <p className="text-[9px] font-mono text-zinc-400">Double tone alert</p>
              </div>
            </div>
            <button
              onClick={() => playWarningAlert()}
              className="px-3 py-1 bg-white text-black rounded text-[10px] font-mono font-bold hover:bg-zinc-200 shadow cursor-pointer transition-all active:scale-95"
            >
              Test
            </button>
          </div>

          {/* Info */}
          <div className="flex items-center justify-between p-2.5 bg-black border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-white">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-white">Info</p>
                <p className="text-[9px] font-mono text-zinc-400">Single soft chime</p>
              </div>
            </div>
            <button
              onClick={() => playInfoAlert()}
              className="px-3 py-1 bg-white text-black rounded text-[10px] font-mono font-bold hover:bg-zinc-200 shadow cursor-pointer transition-all active:scale-95"
            >
              Test
            </button>
          </div>
        </div>

        {/* Alert Rules Info */}
        <div className="mt-3 p-2.5 bg-black rounded border border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
            <span className="font-bold text-white">Auto-Alert Rules:</span>{' '}
            <span className="text-white font-bold">CRITICAL</span> — Gas deficit detected, holder critically low, equipment failure{' · '}
            <span className="text-zinc-300 font-bold">WARNING</span> — Utilization approaching threshold, holder high, pressure deviation, surplus underutilized{' · '}
            <span className="text-zinc-400 font-bold">INFO</span> — Simulation completed, report exported, optimization applied, system nominal
          </p>
        </div>
      </ParticleCard>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Alerts', value: alerts.length, icon: <Bell className="w-4 h-4 text-white" /> },
          { label: 'Critical', value: criticalCount, icon: <AlertTriangle className="w-4 h-4 text-white" /> },
          { label: 'Warnings', value: warningCount, icon: <ShieldAlert className="w-4 h-4 text-zinc-300" /> },
          { label: 'Unacknowledged', value: unackedCount, icon: <Clock className="w-4 h-4 text-zinc-400" /> },
        ].map(stat => (
          <ParticleCard key={stat.label} clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 shadow-lg">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded bg-zinc-900 border border-zinc-700">
                {stat.icon}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">{stat.label}</span>
            </div>
            <p className="text-xl font-mono font-extrabold text-white">{stat.value}</p>
          </ParticleCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-zinc-400" />
        <div className="flex gap-1.5 bg-zinc-950 p-1 border border-zinc-800 rounded-lg text-xs font-mono shadow-sm">
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
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
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
          <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-sm font-mono text-zinc-300">
              No active alerts matching the selected filter.
            </p>
            <p className="text-xs font-mono text-zinc-500 mt-1">Network telemetry is nominal.</p>
          </ParticleCard>
        ) : (
          filteredAlerts.map((alt) => (
            <ParticleCard
              key={alt.id}
              clickEffect={true}
              glowColor="255, 255, 255"
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative transition-all shadow-lg hover:border-white"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded bg-zinc-900 border border-zinc-700 text-white">
                    {alt.severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> :
                     alt.severity === 'warning' ? <ShieldAlert className="w-5 h-5" /> :
                     <Info className="w-5 h-5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-mono font-bold text-white text-sm">{alt.title}</h4>
                      <span className="text-[10px] font-mono text-zinc-400">[{alt.timestamp}]</span>
                      <span className="text-[10px] font-mono font-bold text-white bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded">
                        {alt.gasType}
                      </span>
                      {!alt.acknowledged && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-black bg-white px-1.5 py-0.5 rounded animate-pulse">
                          <Volume2 className="w-2.5 h-2.5" />
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-1">{alt.description}</p>
                    {alt.actionRequired && (
                      <p className="text-[11px] text-zinc-300 font-mono mt-1 font-semibold">
                        <span className="text-white">Recommended Action: </span>
                        {alt.actionRequired}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!alt.acknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="px-3 py-1.5 bg-white text-black rounded text-xs font-mono font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Acknowledge
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-zinc-900 text-zinc-400 border border-zinc-700 rounded text-xs font-mono font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      Acknowledged
                    </span>
                  )}
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ParticleCard>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsConsoleView;
