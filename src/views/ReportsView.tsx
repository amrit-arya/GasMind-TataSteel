import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FilePieChart,
  CheckCircle2,
  Clock,
  Loader2,
  FileBarChart,
  ShieldAlert,
  Zap,
  Factory,
  Flame,
  Scale,
  TrendingUp,
  Settings2,
  CalendarDays
} from 'lucide-react';

type ReportType =
  | 'daily-gas'
  | 'gas-balance'
  | 'generation'
  | 'consumption'
  | 'simulation'
  | 'incident-impact'
  | 'executive-summary';

type ExportFormat = 'pdf' | 'csv' | 'excel';

interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  sections: string[];
}

interface GeneratedReport {
  id: string;
  type: ReportType;
  name: string;
  format: ExportFormat;
  date: string;
  time: string;
  size: string;
  status: 'completed' | 'generating';
}

const reportConfigs: ReportConfig[] = [
  {
    id: 'daily-gas',
    name: 'Daily Gas Report',
    description: 'Complete daily summary of all gas streams — generation, consumption, holder levels, and flaring data.',
    icon: <CalendarDays className="w-5 h-5" />,
    color: '#FF6B00',
    sections: ['Gas Generation Summary', 'Gas Consumption Summary', 'Holder Levels', 'Flaring Report', 'Daily Trends']
  },
  {
    id: 'gas-balance',
    name: 'Gas Balance Report',
    description: 'Net balance across BF, CO, LD, and Natural Gas streams with surplus/deficit analysis.',
    icon: <Scale className="w-5 h-5" />,
    color: '#2563EB',
    sections: ['Balance Overview', 'Surplus/Deficit Analysis', 'Cross-Firing Opportunities', 'Holder Buffer Status']
  },
  {
    id: 'generation',
    name: 'Generation Report',
    description: 'Detailed output report of all generators — blast furnaces, coke batteries, and LD converters.',
    icon: <Factory className="w-5 h-5" />,
    color: '#059669',
    sections: ['BF Generation (I, H, G, F, C, E)', 'CO Generation (Batt 8-11)', 'LD Generation', 'Efficiency Metrics']
  },
  {
    id: 'consumption',
    name: 'Consumption Report',
    description: 'Breakdown of all consumers — power houses, mills, plants — and their gas consumption rates.',
    icon: <Flame className="w-5 h-5" />,
    color: '#DC2626',
    sections: ['Power House Consumption', 'Mill & Plant Consumption', 'Internal Stove Usage', 'Consumer Efficiency']
  },
  {
    id: 'simulation',
    name: 'Simulation Report',
    description: 'Results of what-if scenario simulations — outage impacts, redistribution plans, and cost analysis.',
    icon: <Settings2 className="w-5 h-5" />,
    color: '#7C3AED',
    sections: ['Scenario Parameters', 'Impact Analysis', 'Redistribution Plan', 'Cost Projection']
  },
  {
    id: 'incident-impact',
    name: 'Incident / Failure Impact Report',
    description: 'Post-incident analysis of equipment failures, cascade effects, and recovery actions taken.',
    icon: <ShieldAlert className="w-5 h-5" />,
    color: '#DC2626',
    sections: ['Incident Timeline', 'Root Cause', 'Cascade Impact', 'Recovery Actions', 'Lessons Learned']
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview of plant gas operations for management review — KPIs, alerts, and recommendations.',
    icon: <TrendingUp className="w-5 h-5" />,
    color: '#FF6B00',
    sections: ['Key Metrics', 'Critical Alerts', 'Optimization Opportunities', 'Cost Summary', 'Recommendations']
  }
];

export const ReportsView: React.FC = () => {
  const { gasMetrics, nodes, alerts } = useGasData();
  const [selectedReport, setSelectedReport] = useState<ReportType>('daily-gas');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [dateRange, setDateRange] = useState({ from: '2026-09-01', to: '2026-09-08' });
  const [shift, setShift] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    { id: 'gen-1', type: 'daily-gas', name: 'Daily Gas Report', format: 'pdf', date: '2026-09-07', time: '18:30', size: '2.4 MB', status: 'completed' },
    { id: 'gen-2', type: 'executive-summary', name: 'Executive Summary', format: 'pdf', date: '2026-09-07', time: '14:00', size: '1.8 MB', status: 'completed' },
    { id: 'gen-3', type: 'incident-impact', name: 'BF-F Pressure Drop Incident', format: 'csv', date: '2026-09-06', time: '22:15', size: '0.9 MB', status: 'completed' },
    { id: 'gen-4', type: 'gas-balance', name: 'Gas Balance Report', format: 'pdf', date: '2026-09-06', time: '08:00', size: '3.1 MB', status: 'completed' },
    { id: 'gen-5', type: 'generation', name: 'Weekly Generation Summary', format: 'csv', date: '2026-09-05', time: '17:45', size: '1.2 MB', status: 'completed' },
  ]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const activeConfig = reportConfigs.find(r => r.id === selectedReport)!;

  // Initialize sections when report changes
  React.useEffect(() => {
    setSelectedSections(activeConfig.sections);
  }, [selectedReport]);

  const toggleSection = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const generateCSV = (): string => {
    let csv = '';

    if (selectedReport === 'daily-gas' || selectedReport === 'gas-balance') {
      csv = 'Gas Type,Generation (Nm³/h),Consumption (Nm³/h),Balance (Nm³/h),Status,Pressure (kPa),Holder Level (%)\n';
      gasMetrics.forEach(m => {
        csv += `${m.fullName},${m.generation},${m.consumption},${m.balance},${m.status},${m.pressure},${m.holderLevel}\n`;
      });
    } else if (selectedReport === 'generation') {
      csv = 'Generator,Gas Type,Flow Rate (Nm³/h),Pressure (kPa),Status\n';
      nodes.filter(n => n.type === 'generator').forEach(n => {
        csv += `${n.name},${n.gasType},${n.flowRate},${n.pressure},${n.status}\n`;
      });
    } else if (selectedReport === 'consumption') {
      csv = 'Consumer,Gas Type,Flow Rate (Nm³/h),Pressure (kPa),Status\n';
      nodes.filter(n => n.type === 'consumer').forEach(n => {
        csv += `${n.name},${n.gasType},${n.flowRate},${n.pressure},${n.status}\n`;
      });
    } else if (selectedReport === 'incident-impact') {
      csv = 'Alert ID,Severity,Title,Location,Gas Type,Description,Acknowledged\n';
      alerts.forEach(a => {
        csv += `${a.id},${a.severity},"${a.title}",${a.location},${a.gasType},"${a.description}",${a.acknowledged}\n`;
      });
    } else {
      csv = 'Metric,BF Gas,CO Gas,LD Gas,Natural Gas\n';
      csv += `Generation,${gasMetrics.map(m => m.generation).join(',')}\n`;
      csv += `Consumption,${gasMetrics.map(m => m.consumption).join(',')}\n`;
      csv += `Balance,${gasMetrics.map(m => m.balance).join(',')}\n`;
      csv += `Holder Level %,${gasMetrics.map(m => m.holderLevel).join(',')}\n`;
    }

    return csv;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const reportName = activeConfig.name;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42);
    doc.text('GASMIND AI', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Industrial Fire Command — Tata Steel', 14, 27);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(255, 107, 0);
    doc.text(reportName, 14, 40);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 47);
    doc.text(`Date Range: ${dateRange.from} to ${dateRange.to}`, 14, 53);
    doc.text(`Shift: ${shift === 'all' ? 'All Shifts' : shift}`, 14, 59);

    // Line separator
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 63, 196, 63);

    let yPos = 72;

    if (selectedReport === 'daily-gas' || selectedReport === 'gas-balance' || selectedReport === 'executive-summary') {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Gas Stream Summary', 14, yPos);
      yPos += 6;

      autoTable(doc, {
        startY: yPos,
        head: [['Gas Type', 'Generation', 'Consumption', 'Balance', 'Status', 'Holder %']],
        body: gasMetrics.map(m => [
          m.fullName,
          `${(m.generation / 1000).toFixed(1)}k Nm³/h`,
          `${(m.consumption / 1000).toFixed(1)}k Nm³/h`,
          `${m.balance > 0 ? '+' : ''}${(m.balance / 1000).toFixed(1)}k Nm³/h`,
          m.status,
          `${m.holderLevel}%`
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [255, 107, 0], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    if (selectedReport === 'generation' || selectedReport === 'daily-gas') {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Generator Output', 14, yPos);
      yPos += 6;

      const generators = nodes.filter(n => n.type === 'generator');
      autoTable(doc, {
        startY: yPos,
        head: [['Generator', 'Gas Type', 'Flow Rate', 'Pressure', 'Status']],
        body: generators.map(n => [
          n.name,
          n.gasType,
          `${(n.flowRate / 1000).toFixed(1)}k Nm³/h`,
          `${n.pressure} kPa`,
          n.status
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [5, 150, 105], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    if (selectedReport === 'consumption' || selectedReport === 'daily-gas') {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Consumer Demand', 14, yPos);
      yPos += 6;

      const consumers = nodes.filter(n => n.type === 'consumer');
      autoTable(doc, {
        startY: yPos,
        head: [['Consumer', 'Gas Type', 'Flow Rate', 'Pressure', 'Status']],
        body: consumers.map(n => [
          n.name,
          n.gasType,
          `${(n.flowRate / 1000).toFixed(1)}k Nm³/h`,
          `${n.pressure} kPa`,
          n.status
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [220, 38, 38], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    if (selectedReport === 'incident-impact') {
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('Incident & Alert Log', 14, yPos);
      yPos += 6;

      autoTable(doc, {
        startY: yPos,
        head: [['Severity', 'Title', 'Gas Type', 'Location', 'Acknowledged']],
        body: alerts.map(a => [
          a.severity.toUpperCase(),
          a.title,
          a.gasType,
          a.location,
          a.acknowledged ? 'Yes' : 'No'
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [220, 38, 38], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 249, 250] },
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`GASMIND AI — ${reportName} — Page ${i} of ${pageCount}`, 14, 290);
      doc.text('Confidential — Tata Steel Gas Operations', 196, 290, { align: 'right' });
    }

    doc.save(`GasMind_${selectedReport}_${dateRange.from}.pdf`);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      if (exportFormat === 'pdf') {
        generatePDF();
      } else {
        // CSV / Excel export
        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `GasMind_${selectedReport}_${dateRange.from}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      const newReport: GeneratedReport = {
        id: `gen-${Date.now()}`,
        type: selectedReport,
        name: activeConfig.name,
        format: exportFormat,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        size: exportFormat === 'pdf' ? '2.1 MB' : '0.6 MB',
        status: 'completed',
      };

      setGeneratedReports(prev => [newReport, ...prev]);
      setIsGenerating(false);
    }, 1200);
  };

  const formatBadgeColor = (f: ExportFormat) =>
    f === 'pdf' ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20' :
    'bg-[#059669]/10 text-[#059669] border-[#059669]/20';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#CBD5E1]">
        <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#FF6B00]" />
          Reports & Exports Center
        </h2>
        <p className="text-xs text-[#475569] font-mono mt-1">
          Generate, customize, and export operational reports in PDF or CSV/Excel format.
        </p>
      </div>

      {/* Report Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Report Type Selector */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
            <FilePieChart className="w-4 h-4 text-[#FF6B00]" />
            Select Report Type
          </h3>
          <div className="space-y-1.5">
            {reportConfigs.map(config => {
              const isActive = selectedReport === config.id;
              return (
                <button
                  key={config.id}
                  onClick={() => setSelectedReport(config.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-[#FF6B00] text-white font-bold shadow-md'
                      : 'bg-[#F8F9FA] text-[#475569] hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : ''}`} style={{ color: isActive ? 'white' : config.color }}>
                    {config.icon}
                  </span>
                  {config.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Configuration */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-2">
            <Settings2 className="w-4 h-4 text-[#FF6B00]" />
            Report Configuration
          </h3>

          {/* Report Description */}
          <div className="p-3 bg-[#FFF7ED] border border-[#FF6B00]/20 rounded-lg">
            <p className="text-xs font-mono text-[#475569] leading-relaxed">{activeConfig.description}</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded text-xs font-mono focus:border-[#FF6B00] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded text-xs font-mono focus:border-[#FF6B00] focus:outline-none"
              />
            </div>
          </div>

          {/* Shift Selector */}
          <div>
            <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">Shift Filter</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded text-xs font-mono focus:border-[#FF6B00] focus:outline-none"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning (06:00 – 14:00)</option>
              <option value="afternoon">Afternoon (14:00 – 22:00)</option>
              <option value="night">Night (22:00 – 06:00)</option>
            </select>
          </div>

          {/* Sections Included */}
          <div>
            <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-2">Sections to Include</label>
            <div className="space-y-1">
              {activeConfig.sections.map(section => (
                <label key={section} className="flex items-center gap-2 px-2 py-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0] cursor-pointer hover:bg-[#E2E8F0] transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={() => toggleSection(section)}
                    className="accent-[#FF6B00] w-3.5 h-3.5"
                  />
                  <span className="text-xs font-mono text-[#0F172A]">{section}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Export Actions */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-[#FF6B00]" />
            Export Format & Generate
          </h3>

          {/* Format Selector */}
          <div className="space-y-1.5">
            {[
              { id: 'pdf' as ExportFormat, label: 'PDF Report', desc: 'Professional formatted report with tables and branding', icon: <FileText className="w-4 h-4" />, color: '#DC2626' },
              { id: 'csv' as ExportFormat, label: 'CSV / Excel', desc: 'Raw data export for spreadsheet analysis', icon: <FileSpreadsheet className="w-4 h-4" />, color: '#059669' },
            ].map(fmt => (
              <button
                key={fmt.id}
                onClick={() => setExportFormat(fmt.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  exportFormat === fmt.id
                    ? `border-[${fmt.color}] bg-[${fmt.color}08]`
                    : 'border-[#E2E8F0] bg-[#F8F9FA] hover:border-[#CBD5E1]'
                }`}
                style={{
                  borderColor: exportFormat === fmt.id ? fmt.color : undefined,
                  backgroundColor: exportFormat === fmt.id ? `${fmt.color}08` : undefined,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ color: fmt.color }}>{fmt.icon}</span>
                  <div>
                    <p className="text-xs font-mono font-bold text-[#0F172A]">{fmt.label}</p>
                    <p className="text-[10px] font-mono text-[#64748B]">{fmt.desc}</p>
                  </div>
                  {exportFormat === fmt.id && (
                    <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: fmt.color }} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Preview Summary */}
          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] space-y-1.5 text-[10px] font-mono text-[#64748B]">
            <div className="flex justify-between">
              <span>Report:</span>
              <span className="font-bold text-[#0F172A]">{activeConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-bold text-[#0F172A] uppercase">{exportFormat}</span>
            </div>
            <div className="flex justify-between">
              <span>Sections:</span>
              <span className="font-bold text-[#0F172A]">{selectedSections.length} / {activeConfig.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Date Range:</span>
              <span className="font-bold text-[#0F172A]">{dateRange.from} → {dateRange.to}</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedSections.length === 0}
            className={`w-full py-3 rounded-lg text-sm font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isGenerating
                ? 'bg-[#64748B] text-white cursor-not-allowed'
                : selectedSections.length === 0
                ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                : 'bg-flame-gradient text-white hover:opacity-90 glow-flame'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
            <p className="text-[10px] font-mono text-[#DC2626] text-center">Select at least one section to generate.</p>
          )}
        </div>
      </div>

      {/* Generated Reports History */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <FileBarChart className="w-4 h-4 text-[#FF6B00]" />
            Generated Reports Archive
          </h3>
          <span className="text-[10px] font-mono text-[#64748B]">{generatedReports.length} reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-[#E2E8F0]">
                <th className="text-left py-2.5 px-3 text-[#64748B] font-bold">Report</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Format</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Date</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Time</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Size</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Status</th>
                <th className="text-center py-2.5 px-2 text-[#64748B] font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedReports.map(report => (
                <tr key={report.id} className="border-b border-[#F1F5F9] hover:bg-[#F8F9FA] transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      {report.format === 'pdf' ? (
                        <FileText className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                      ) : (
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      )}
                      <span className="font-semibold text-[#0F172A]">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${formatBadgeColor(report.format)}`}>
                      {report.format}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center text-[#64748B]">{report.date}</td>
                  <td className="py-2.5 px-2 text-center text-[#64748B]">{report.time}</td>
                  <td className="py-2.5 px-2 text-center text-[#64748B]">{report.size}</td>
                  <td className="py-2.5 px-2 text-center">
                    {report.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] rounded text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        Generating
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={handleGenerate}
                      className="text-[#FF6B00] hover:underline font-bold flex items-center gap-1 cursor-pointer mx-auto"
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
      </div>
    </div>
  );
};
