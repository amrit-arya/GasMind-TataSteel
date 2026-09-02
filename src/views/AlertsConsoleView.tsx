import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Trash2 } from 'lucide-react';

export const AlertsConsoleView: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert } = useGasData();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = filterSeverity === 'all' 
    ? alerts 
    : filterSeverity === 'unacknowledged' 
    ? alerts.filter(a => !a.acknowledged)
    : alerts.filter(a => a.severity === filterSeverity);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#DC2626]" />
            Operational Alerts Console v2
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Real-time alert dispatching, event logging, and technician response coordination.</p>
        </div>

        <div className="flex gap-2 bg-white p-1 border border-[#CBD5E1] rounded text-xs font-mono shadow-sm">
          {['all', 'unacknowledged', 'critical', 'warning', 'info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterSeverity(tab)}
              className={`px-3 py-1 rounded capitalize transition-colors cursor-pointer ${
                filterSeverity === tab 
                  ? 'bg-flame-gradient text-white font-bold glow-flame' 
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#CBD5E1] rounded-lg text-xs font-mono text-[#64748B]">
            No active alerts matching the selected filter. Network telemetry is nominal.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div 
              key={alt.id}
              className={`bg-white border rounded-lg p-4 relative transition-all shadow-sm ${
                alt.severity === 'critical' ? 'border-[#DC2626]/50' : alt.severity === 'warning' ? 'border-[#D97706]/50' : 'border-[#CBD5E1]'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l ${
                alt.severity === 'critical' ? 'bg-[#DC2626]' : alt.severity === 'warning' ? 'bg-[#D97706]' : 'bg-[#FF6B00]'
              }`} />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded ${
                    alt.severity === 'critical' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                    alt.severity === 'warning' ? 'bg-[#FEF3C7] text-[#D97706]' :
                    'bg-[#FFF3E0] text-[#FF6B00]'
                  }`}>
                    {alt.severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-[#0F172A] text-sm">{alt.title}</h4>
                      <span className="text-[10px] font-mono text-[#64748B]">[{alt.timestamp}]</span>
                      <span className="text-[10px] font-mono font-bold text-[#FF6B00] bg-[#FFF3E0] px-1.5 py-0.5 rounded">
                        {alt.gasType}
                      </span>
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
                    <span className="px-3 py-1.5 bg-[#F8F9FA] text-[#64748B] border border-[#CBD5E1] rounded text-xs font-mono font-semibold">
                      ✓ Acknowledged
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
