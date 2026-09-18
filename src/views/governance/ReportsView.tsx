import React, { useState } from 'react';
import { useGasData } from '../../context';
import { 
  FileText, 
  Download, 
  Settings2, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  FileBarChart,
  FilePieChart,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { generateGasMindPDFReport } from '../../utils';
import { ParticleCard } from '../../components';

interface GeneratedReport {
  id: string;
  name: string;
  format: 'pdf' | 'csv';
  date: string;
  time: string;
  size: string;
  status: 'completed' | 'generating';
}

type ReportType = 'executive' | 'shift' | 'incident' | 'consumption' | 'audit';
type ExportFormat = 'pdf' | 'csv';

interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: React.ReactNode;
  sections: string[];
  color: string;
}

const reportConfigs: ReportConfig[] = [
  {
    id: 'executive',
    name: 'Executive Gas Balance Summary',
    description: 'High-level executive report covering overall plant production vs demand, net balance metrics, holder inventory, and financial impact matrix.',
    icon: <FileBarChart className="w-4 h-4 text-white" />,
    color: '#FFFFFF',
    sections: ['KPI Summary', 'Gas Balance Matrix', 'Gasholder Stocks', 'Financial Impact']
  },
  {
    id: 'shift',
    name: 'Shift Operations Log',
    description: 'Detailed 8-hour shift report tracking hourly production per furnace, consumer unit draw rates, holder fluctuations, and operator shift notes.',
    icon: <Clock className="w-4 h-4 text-white" />,
    color: '#FFFFFF',
    sections: ['Shift Metadata', 'Hourly Telemetry', 'Unit Performance', 'Shift Operator Notes']
  },
  {
    id: 'incident',
    name: 'Incident & Deficit Analysis Report',
    description: 'Specialized diagnostic report analyzing deficit events, root causes, generator trip impact, and priority allocation execution logs.',
    icon: <FilePieChart className="w-4 h-4 text-white" />,
    color: '#FFFFFF',
    sections: ['Deficit Timeline', 'Root Cause Breakdown', 'Priority Allocations', 'Remediation Actions']
  },
  {
    id: 'consumption',
    name: 'Industrial Consumer Units Breakdown',
    description: 'Granular breakdown of all 29 industrial consumer units across BF, CO, and LD gas streams with fuel share percentages.',
    icon: <FileText className="w-4 h-4 text-white" />,
    color: '#FFFFFF',
    sections: ['Consumer Matrix', 'Stream Share %', 'Efficiency Ratings', 'Fuel Type Distribution']
  },
  {
    id: 'audit',
    name: 'Departmental Security Audit Trail',
    description: 'Official audit log listing operator credentials, setpoint adjustments, simulation runs, and configuration changes for compliance.',
    icon: <FileSpreadsheet className="w-4 h-4 text-white" />,
    color: '#FFFFFF',
    sections: ['Audit Log Records', 'Operator ID Matrix', 'Parameter Revisions', 'Security Compliance']
  }
];

export const ReportsView: React.FC = () => {
  const { gasMetrics, nodes, auditLogs, addAuditLog } = useGasData();
  const [selectedReport, setSelectedReport] = useState<ReportType>('executive');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-09-01', to: '2026-09-08' });
  const [shift, setShift] = useState<string>('all');

  // Mandatory Operator Credentials State
  const [operatorName, setOperatorName] = useState<string>('Rajesh Kumar');
  const [employeeId, setEmployeeId] = useState<string>('EMP-4819');
  const [operatorDesignation, setOperatorDesignation] = useState<string>('Shift In-Charge / Sr. Energy Engineer');
  const [operatorDept, setOperatorDept] = useState<string>('Energy Management Division');
  const [validationError, setValidationError] = useState<string | null>(null);

  const activeConfig = reportConfigs.find(r => r.id === selectedReport) || reportConfigs[0];
  const [selectedSections, setSelectedSections] = useState<string[]>(activeConfig.sections);

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    { id: 'rep-1', name: 'Executive Gas Balance Summary (PDF)', format: 'pdf', date: '2026-09-08', time: '21:12 IST', size: '2.4 MB', status: 'completed' },
    { id: 'rep-2', name: 'Incident Failure Impact Logs (CSV)', format: 'csv', date: '2026-09-08', time: '17:05 IST', size: '840 KB', status: 'completed' },
    { id: 'rep-3', name: 'Shift Operations Log - Morning (PDF)', format: 'pdf', date: '2026-09-07', time: '14:02 IST', size: '1.8 MB', status: 'completed' },
  ]);

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleGenerate = () => {
    // Validate mandatory operator credentials
    if (!operatorName.trim() || !employeeId.trim() || !operatorDesignation.trim() || !operatorDept.trim()) {
      setValidationError('All operator credentials (Name, Employee ID, Designation, Department) are mandatory to export report and register audit entry.');
      return;
    }

    setValidationError(null);
    setIsGenerating(true);

    if (exportFormat === 'pdf') {
      setTimeout(async () => {
        let pdfBytes = 0;
        try {
          pdfBytes = await generateGasMindPDFReport({
            metrics: gasMetrics,
            nodes,
            auditLogs,
            reportTitle: activeConfig.name,
            dateRange: `${dateRange.from} to ${dateRange.to}`,
            shiftFilter: shift,
            selectedSections: selectedSections,
            operatorName: operatorName,
            employeeId: employeeId,
            operatorDesignation: operatorDesignation,
            operatorDept: operatorDept
          });
        } catch (e) {
          console.error(e);
          setIsGenerating(false);
          return;
        }
        setIsGenerating(false);

        const now = new Date();

        const newRep: GeneratedReport = {
          id: `rep-${Date.now()}`,
          name: `${activeConfig.name} (${exportFormat.toUpperCase()})`,
          format: exportFormat,
          date: now.toISOString().split('T')[0],
          time: now.toISOString(),
          size: formatBytes(pdfBytes),
          status: 'completed'
        };
        setGeneratedReports(prev => [newRep, ...prev]);

        // Register official audit log record with operator credentials
        addAuditLog({
          category: 'report_export',
          userName: operatorName,
          userDesignation: operatorDesignation,
          userDepartment: `${operatorDept} (Emp ID: ${employeeId})`,
          actionTitle: `Exported Official Report: ${activeConfig.name}`,
          details: {
            exportFormat: 'PDF',
            reportType: activeConfig.name,
            resultsProduced: `Generated official PDF report for period ${dateRange.from} to ${dateRange.to}. Included sections: ${selectedSections.join(', ')}.`
          }
        });
      }, 300);
    } else {
      setTimeout(() => {
        const now = new Date();
        const isoTimestamp = now.toISOString();
        const metaHeader = [
          `# ================================================================================`,
          `# GASMIND OFFICIAL EXPORTED REPORT DATASET`,
          `# Report Title      : ${activeConfig.name}`,
          `# Date Range        : ${dateRange.from} to ${dateRange.to}`,
          `# Shift Filter      : ${shift.toUpperCase()}`,
          `# Operator Name     : ${operatorName}`,
          `# Employee ID       : ${employeeId}`,
          `# Shift Designation : ${operatorDesignation}`,
          `# Department        : ${operatorDept}`,
          `# Timestamp (UTC)   : ${isoTimestamp}`,
          `# ================================================================================`
        ].join('\n');

        const sanitizeCSV = (val: any) => {
          if (val === null || val === undefined) return '""';
          let str = String(val);
          str = str.replace(/"/g, '""');
          if (/^[=+\-@\t\r]/.test(str)) {
            str = `'${str}`;
          }
          return `"${str}"`;
        };

        const headers = ['Metric ID', 'Gas Stream Name', 'Generation (Nm3/h)', 'Consumption (Nm3/h)', 'Net Balance (Nm3/h)', 'Holder Level (%)', 'Status'];
        const rows = gasMetrics.map(m => [
          sanitizeCSV(m.id),
          sanitizeCSV(m.name),
          sanitizeCSV(m.generation),
          sanitizeCSV(m.consumption),
          sanitizeCSV(m.balance),
          sanitizeCSV(m.holderLevel),
          sanitizeCSV(m.status)
        ]);
        const csvContent = [metaHeader, headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const sizeFormatted = formatBytes(blob.size);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `GASMIND_${activeConfig.id}_${dateRange.from}_to_${dateRange.to}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsGenerating(false);

        const newRep: GeneratedReport = {
          id: `rep-${Date.now()}`,
          name: `${activeConfig.name} (${exportFormat.toUpperCase()})`,
          format: exportFormat,
          date: now.toISOString().split('T')[0],
          time: isoTimestamp,
          size: sizeFormatted,
          status: 'completed'
        };
        setGeneratedReports(prev => [newRep, ...prev]);

        // Register official audit log record with operator credentials
        addAuditLog({
          category: 'report_export',
          userName: operatorName,
          userDesignation: operatorDesignation,
          userDepartment: `${operatorDept} (Emp ID: ${employeeId})`,
          actionTitle: `Exported Official CSV Telemetry: ${activeConfig.name}`,
          details: {
            exportFormat: 'CSV',
            reportType: activeConfig.name,
            resultsProduced: `Exported raw CSV dataset for period ${dateRange.from} to ${dateRange.to} with operator metadata header.`
          }
        });
      }, 800);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Page Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="font-mono text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-white" />
          Reports & Exports Center
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Generate, customize, and export operational reports with mandatory operator credentials and audit logging.
        </p>
      </div>

      {/* Mandatory Operator Credentials Section */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-white" />
            <h3 className="font-mono text-sm font-bold text-white">
              Mandatory Operator Credentials & Audit Tracking
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white text-[10px] font-mono font-bold rounded uppercase">
            Audit Security Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Operator Full Name *</label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Employee ID *</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. EMP-4819"
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Shift Designation *</label>
            <input
              type="text"
              value={operatorDesignation}
              onChange={(e) => setOperatorDesignation(e.target.value)}
              placeholder="e.g. Shift In-Charge"
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-[10px] uppercase font-bold block mb-1">Department *</label>
            <input
              type="text"
              value={operatorDept}
              onChange={(e) => setOperatorDept(e.target.value)}
              placeholder="e.g. Energy Management"
              className="w-full p-2.5 bg-black border border-zinc-800 rounded text-xs text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {validationError && (
          <div className="mt-3 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center gap-2 text-white text-xs font-mono font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            <span>{validationError}</span>
          </div>
        )}
      </ParticleCard>

      {/* Report Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Report Type Selector */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-4">
            <FilePieChart className="w-4 h-4 text-white" />
            Select Report Type
          </h3>
          <div className="space-y-1.5">
            {reportConfigs.map(config => {
              const isActive = selectedReport === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => {
                    setSelectedReport(config.id);
                    setSelectedSections(config.sections);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {config.icon}
                  {config.name}
                </button>
              );
            })}
          </div>
        </ParticleCard>

        {/* Center: Configuration */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-2">
            <Settings2 className="w-4 h-4 text-white" />
            Report Configuration
          </h3>

          {/* Report Description */}
          <div className="p-3 bg-black border border-zinc-800 rounded-lg">
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">{activeConfig.description}</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full p-2 bg-black border border-zinc-800 text-white rounded text-xs font-mono focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full p-2 bg-black border border-zinc-800 text-white rounded text-xs font-mono focus:border-white focus:outline-none"
              />
            </div>
          </div>

          {/* Shift Selector */}
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Shift Filter</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full p-2 bg-black border border-zinc-800 text-white rounded text-xs font-mono focus:border-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning (06:00 – 14:00)</option>
              <option value="afternoon">Afternoon (14:00 – 22:00)</option>
              <option value="night">Night (22:00 – 06:00)</option>
            </select>
          </div>

          {/* Sections Included */}
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-2">Sections to Include</label>
            <div className="space-y-1">
              {activeConfig.sections.map(section => (
                <label key={section} className="flex items-center gap-2 px-2.5 py-1.5 bg-black rounded border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={() => toggleSection(section)}
                    className="accent-white w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white">{section}</span>
                </label>
              ))}
            </div>
          </div>
        </ParticleCard>

        {/* Right: Export Actions */}
        <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 relative overflow-hidden">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-white" />
            Export Format & Generate
          </h3>

          {/* Format Selector */}
          <div className="space-y-1.5">
            {[
              { id: 'pdf' as ExportFormat, label: 'PDF Report', desc: 'Professional formatted report with tables and branding', icon: <FileText className="w-4 h-4 text-white" /> },
              { id: 'csv' as ExportFormat, label: 'CSV / Excel', desc: 'Raw data export for spreadsheet analysis', icon: <FileSpreadsheet className="w-4 h-4 text-zinc-300" /> },
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setExportFormat(fmt.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  exportFormat === fmt.id
                    ? 'border-white bg-zinc-900'
                    : 'border-zinc-800 bg-black hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {fmt.icon}
                  <div>
                    <p className="text-xs font-mono font-bold text-white">{fmt.label}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{fmt.desc}</p>
                  </div>
                  {exportFormat === fmt.id && (
                    <CheckCircle2 className="w-4 h-4 ml-auto text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Preview Summary */}
          <div className="p-3 bg-black rounded-lg border border-zinc-800 space-y-1.5 text-[10px] font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>Report:</span>
              <span className="font-bold text-white">{activeConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Operator:</span>
              <span className="font-bold text-white">{operatorName || 'Not Set'} ({employeeId || 'No ID'})</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-bold text-white uppercase">{exportFormat}</span>
            </div>
            <div className="flex justify-between">
              <span>Sections:</span>
              <span className="font-bold text-white">{selectedSections.length} / {activeConfig.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Date Range:</span>
              <span className="font-bold text-white">{dateRange.from} → {dateRange.to}</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedSections.length === 0}
            className={`w-full py-3 rounded-lg text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : selectedSections.length === 0
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate & Download {exportFormat.toUpperCase()}
              </>
            )}
          </button>

          {selectedSections.length === 0 && (
            <p className="text-[10px] font-mono text-zinc-400 text-center">Select at least one section to generate.</p>
          )}
        </ParticleCard>
      </div>

      {/* Generated Reports History */}
      <ParticleCard clickEffect={true} glowColor="255, 255, 255" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-white" />
            Generated Reports Archive
          </h3>
          <span className="text-[10px] font-mono text-zinc-400">{generatedReports.length} reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2.5 px-3 text-zinc-400 font-bold">Report</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Format</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Date</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Time</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Size</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Status</th>
                <th className="text-center py-2.5 px-2 text-zinc-400 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedReports.map(report => (
                <tr key={report.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      {report.format === 'pdf' ? (
                        <FileText className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                      )}
                      <span className="font-semibold text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-900 border border-zinc-700 text-white">
                      {report.format}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-zinc-400">{report.date}</td>
                  <td className="py-2.5 px-2 text-center text-zinc-400">{report.time}</td>
                  <td className="py-2.5 px-2 text-center text-zinc-400">{report.size}</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white rounded text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      Done
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={handleGenerate}
                      className="text-white hover:underline font-bold flex items-center gap-1 cursor-pointer mx-auto"
                    >
                      <Download className="w-3 h-3" />
                      Re-download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ParticleCard>
    </div>
  );
};

export default ReportsView;
