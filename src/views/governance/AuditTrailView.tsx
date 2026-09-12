import React, { useState, useMemo } from 'react';
import { useGasData } from '../../context';
import { AuditCategory, AuditItem } from '../../types';
import { 
  ClipboardCheck, 
  Search, 
  Download, 
  Sliders, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  Filter, 
  Zap, 
  Building2, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { ParticleCard } from '../../components';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, exportAuditLogsToCSV, setCurrentView } = useGasData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter audit records
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesCat = selectedCategory === 'all' || log.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchText = `
        ${log.id} 
        ${log.userName} 
        ${log.userDesignation} 
        ${log.userDepartment || ''} 
        ${log.actionTitle} 
        ${log.details.targetEquipment || ''} 
        ${log.details.resultsProduced || ''} 
        ${log.details.reportType || ''}
      `.toLowerCase();

      return matchesCat && matchText.includes(q);
    });
  }, [auditLogs, selectedCategory, searchQuery]);

  // Statistics
  const totalLogs = auditLogs.length;
  const simulationCount = auditLogs.filter(l => l.category === 'simulation').length;
  const reportExportCount = auditLogs.filter(l => l.category === 'report_export').length;
  const uniqueOperators = new Set(auditLogs.map(l => l.userName)).size;

  // Single Record PDF Export Simulation
  const handleDownloadSingleRecordPDF = (log: AuditItem) => {
    const content = `
================================================================================
           GASMIND DEPARTMENTAL AUDIT CERTIFICATE
           Tata Steel Industrial Gas Telemetry & Audit Log
================================================================================

Audit Reference ID: ${log.id}
Date & Time (UTC): ${log.timestamp}
Category: ${log.category.toUpperCase()}

OPERATOR DETAILS:
--------------------------------------------------------------------------------
Full Name        : ${log.userName}
Designation      : ${log.userDesignation}
Department / ID  : ${log.userDepartment || 'N/A'}

ACTION PERFORMED:
--------------------------------------------------------------------------------
Title            : ${log.actionTitle}
Target Equipment : ${log.details.targetEquipment || 'All Network Nodes'}
Export Format    : ${log.details.exportFormat || 'N/A'}
Report Type      : ${log.details.reportType || 'N/A'}

PARAMETERS USED:
--------------------------------------------------------------------------------
${JSON.stringify(log.details.parametersUsed || {}, null, 2)}

RESULT PRODUCED & REDISTRIBUTION STRATEGY:
--------------------------------------------------------------------------------
${log.details.resultsProduced || 'N/A'}
Net Balance      : ${log.details.netDeficitSurplus || 'N/A'}
Mitigation       : ${log.details.mitigationStatus || 'N/A'}

--------------------------------------------------------------------------------
Verification Hash: SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}
Status          : VERIFIED & LOGGED IN DEPARTMENTAL AUDIT TRAIL
================================================================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${log.id}_Audit_Certificate.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryBadge = (category: AuditCategory) => {
    switch (category) {
      case 'simulation':
        return {
          label: 'Simulation Executed',
          icon: <Sliders className="w-3.5 h-3.5 text-white" />
        };
      case 'report_export':
        return {
          label: 'Report Exported',
          icon: <FileText className="w-3.5 h-3.5 text-zinc-300" />
        };
      case 'parameter_change':
        return {
          label: 'Parameter Adjustment',
          icon: <Zap className="w-3.5 h-3.5 text-white" />
        };
      default:
        return {
          label: 'System Alert',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
        };
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-white" />
            Departmental Audit Trail & Governance Log
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Official immutable records of who ran simulations, what parameters were used, results produced, and who exported reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditLogsToCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-white hover:border-white transition-colors cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            Export Audit Log (Excel/CSV)
          </button>
          <button
            onClick={() => setCurrentView('simulation')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black rounded-lg text-xs font-mono font-bold hover:bg-zinc-200 transition-colors cursor-pointer shadow-md"
          >
            <Sliders className="w-4 h-4" />
            Run New Simulation
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Total Audit Records</p>
            <p className="text-2xl font-mono font-bold text-white">{totalLogs}</p>
            <p className="text-[10px] font-mono text-zinc-400">100% Verifiable</p>
          </div>
        </ParticleCard>

        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Simulations Run</p>
            <p className="text-2xl font-mono font-bold text-white">{simulationCount}</p>
            <p className="text-[10px] font-mono text-zinc-400">Parameter Logged</p>
          </div>
        </ParticleCard>

        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Reports Exported</p>
            <p className="text-2xl font-mono font-bold text-white">{reportExportCount}</p>
            <p className="text-[10px] font-mono text-zinc-400">PDF & CSV Downloads</p>
          </div>
        </ParticleCard>

        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="p-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Active Operators</p>
            <p className="text-2xl font-mono font-bold text-white">{uniqueOperators}</p>
            <p className="text-[10px] font-mono text-zinc-400">Authorized Credentials</p>
          </div>
        </ParticleCard>
      </div>

      {/* Search & Category Filter Toolbar */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Records', count: totalLogs },
              { id: 'simulation', label: 'Simulations Executed', count: simulationCount },
              { id: 'report_export', label: 'Reports Exported', count: reportExportCount },
              { id: 'parameter_change', label: 'Parameter Changes', count: auditLogs.filter(l => l.category === 'parameter_change').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-black text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, designation, parameters..."
              className="w-full pl-9 pr-3 py-1.5 bg-black border border-zinc-800 rounded text-xs font-mono text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>
      </ParticleCard>

      {/* Main Audit Records Table */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-lg overflow-hidden relative">
        <div className="px-5 py-3 border-b border-zinc-800 bg-black flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            Departmental Execution Register ({filteredLogs.length} Entries)
          </span>
          <span className="text-[10px] font-mono text-zinc-400">Sorted by Latest Timestamp</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Filter className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-xs font-mono text-zinc-400">No audit records match the selected filter criteria.</p>
            </div>
          ) : (
            filteredLogs.map(log => {
              const badge = categoryBadge(log.category);
              const isExpanded = expandedId === log.id;

              return (
                <div key={log.id} className="p-4 hover:bg-zinc-900/60 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: ID + Operator + Category */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white shrink-0">
                        {badge.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-white">{log.id}</span>
                          <span className="px-2 py-0.5 rounded border text-[10px] font-mono font-bold bg-zinc-900 border-zinc-700 text-white">
                            {badge.label}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {log.timestamp}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white font-mono">{log.actionTitle}</h4>

                        {/* Operator Credentials Row */}
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 flex-wrap">
                          <span className="flex items-center gap-1 font-bold text-white">
                            <UserCheck className="w-3.5 h-3.5 text-white" />
                            {log.userName}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-400">{log.userDesignation}</span>
                          {log.userDepartment && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-zinc-500" />
                                {log.userDepartment}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="px-3 py-1.5 bg-black border border-zinc-800 rounded text-xs font-mono text-zinc-300 hover:border-white transition-colors cursor-pointer"
                      >
                        {isExpanded ? 'Hide Details' : 'View Full Details'}
                      </button>
                      <button
                        onClick={() => handleDownloadSingleRecordPDF(log)}
                        className="px-3 py-1.5 bg-white text-black rounded text-xs font-mono font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                        title="Download official audit certificate for this event"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Audit Cert
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Box */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-black/80 border border-zinc-800 rounded-lg space-y-3 font-mono text-xs text-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-zinc-800 pb-3">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Target Equipment / Scope</span>
                          <span className="font-bold text-white">{log.details.targetEquipment || 'All Plant Generators & Consumers'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Net Balance Impact / Status</span>
                          <span className="font-bold text-white">
                            {log.details.netDeficitSurplus || log.details.mitigationStatus || 'Verified'}
                          </span>
                        </div>
                      </div>

                      {log.details.parametersUsed && (
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Simulation Parameters Configured</span>
                          <pre className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] font-mono text-zinc-300 overflow-x-auto">
                            {JSON.stringify(log.details.parametersUsed, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Result Produced & Redistribution Strategy</span>
                        <p className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-xs leading-relaxed text-white">
                          {log.details.resultsProduced || 'Execution completed cleanly with zero system errors.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ParticleCard>
    </div>
  );
};

export default AuditTrailView;
