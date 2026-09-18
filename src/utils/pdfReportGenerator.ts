import { GasTypeMetrics, NetworkNode, AuditItem } from '../types';

export interface PDFReportOptions {
  metrics?: GasTypeMetrics[];
  nodes?: NetworkNode[];
  auditLogs?: AuditItem[];
  reportTitle: string;
  dateRange: string;
  shiftFilter?: string;
  selectedSections?: string[];
  operatorName: string;
  employeeId?: string;
  operatorDesignation?: string;
  operatorDept?: string;
}

export async function generateGasMindPDFReport(options: PDFReportOptions): Promise<number> {
  // Dynamic import of jsPDF and jspdf-autotable to defer ~380 KB bundle chunk
  const [{ default: jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);
  const autoTable = autoTableModule.default || autoTableModule;

  const doc = new jsPDF();
  const { 
    metrics = [], 
    nodes = [], 
    auditLogs = [], 
    reportTitle, 
    dateRange,
    shiftFilter = 'all',
    selectedSections = [],
    operatorName,
    employeeId,
    operatorDesignation,
    operatorDept
  } = options;

  const titleLower = reportTitle.toLowerCase();
  const isAudit = titleLower.includes('audit');
  const isConsumer = titleLower.includes('consumer');

  // Header background
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, 210, 48, 'F');

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GASMIND - Tata Steel Energy Intelligence', 14, 16);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 220, 220);
  doc.text(`Report: ${reportTitle} | Date Range: ${dateRange} | Shift: ${shiftFilter.toUpperCase()}`, 14, 24);

  const empStr = employeeId ? ` (Emp ID: ${employeeId})` : '';
  const desigStr = operatorDesignation ? ` | ${operatorDesignation}` : '';
  const deptStr = operatorDept ? ` | Dept: ${operatorDept}` : '';
  doc.text(`Operator: ${operatorName}${empStr}${desigStr}${deptStr}`, 14, 32);

  const nowIST = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '') + ' IST';
  doc.setTextColor(160, 160, 160);
  doc.setFontSize(8.5);
  doc.text(`Recorded Timestamp: ${nowIST}`, 14, 40);

  // Divider line
  doc.setDrawColor(60, 60, 65);
  doc.setLineWidth(0.5);
  doc.line(14, 45, 196, 45);

  let currentY = 54;
  let sectionIndex = 1;

  const shouldInclude = (secName: string) => {
    if (selectedSections.length === 0) return true;
    return selectedSections.some(s => s.toLowerCase().includes(secName.toLowerCase()) || secName.toLowerCase().includes(s.toLowerCase()));
  };

  // ---------------------------------------------------------------------------
  // SECTION 1: By-Product Gas Stream Summary
  // ---------------------------------------------------------------------------
  if (shouldInclude('kpi') || shouldInclude('gas balance') || shouldInclude('shift metadata') || shouldInclude('deficit timeline') || shouldInclude('consumer matrix') || shouldInclude('audit log')) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(`${sectionIndex++}. By-Product Gas Stream Telemetry Summary`, 14, currentY);

    const streamTableData = metrics.map((m) => [
      m.id,
      m.name,
      `${m.generation.toLocaleString()} Nm³/h`,
      `${typeof m.consumption === 'number' ? m.consumption.toLocaleString() : '—'} Nm³/h`,
      `${m.balance >= 0 ? '+' : ''}${m.balance.toLocaleString()} Nm³/h`,
      `${m.holderLevel}%`,
      m.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['ID', 'Gas Stream', 'Generation', 'Consumption', 'Net Balance', 'Holder Lvl', 'Status']],
      body: streamTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [24, 24, 27],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 248]
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 2.5
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // ---------------------------------------------------------------------------
  // SECTION 2: Plant Network Equipment & Unit Telemetry
  // ---------------------------------------------------------------------------
  if (nodes.length > 0 && (shouldInclude('unit performance') || shouldInclude('consumer') || shouldInclude('hourly telemetry') || shouldInclude('fuel type') || isConsumer || !isAudit)) {
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(`${sectionIndex++}. Plant Network Equipment & Unit Telemetry`, 14, currentY);

    const nodeTableData = nodes.map((n) => [
      n.id,
      n.name,
      n.type.toUpperCase(),
      n.gasType,
      `${n.flowRate.toLocaleString()} Nm³/h`,
      `${n.pressure.toFixed(1)} kPa`,
      n.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['ID', 'Equipment Name', 'Type', 'Gas Stream', 'Flow Rate', 'Pressure', 'Status']],
      body: nodeTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // ---------------------------------------------------------------------------
  // SECTION 3: Departmental Governance & Security Audit Trail Records
  // ---------------------------------------------------------------------------
  if (auditLogs.length > 0 && (shouldInclude('audit') || shouldInclude('operator') || isAudit)) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(`${sectionIndex++}. Departmental Governance & Security Audit Trail`, 14, currentY);

    const auditTableData = auditLogs.slice(0, 15).map((a) => [
      a.id,
      a.timestamp,
      a.category.toUpperCase(),
      a.userName,
      a.actionTitle,
      a.details?.targetEquipment || a.details?.resultsProduced || 'N/A'
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Audit ID', 'Timestamp', 'Category', 'Operator', 'Action Title', 'Details / Output']],
      body: auditTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2
      }
    });
  }

  // Footer Page Numbering
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `GASMIND v1.0.0 Confidential - Fuel Management Dept, Tata Steel | Page ${i} of ${pageCount}`,
      14,
      288
    );
  }

  const cleanFileName = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`GASMIND_${cleanFileName}_Report.pdf`);
  const arrayBuf = doc.output('arraybuffer');
  return arrayBuf.byteLength;
}
