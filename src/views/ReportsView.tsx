import React, { useState } from 'react';
import { useGasData } from '../context/GasDataContext';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { triggerExport } = useGasData();
  const [reportType, setReportType] = useState('shift');
  const [shift, setShift] = useState('morning');

  const history = [
    { id: 'rep-0901-a', title: 'Daily Gas Telemetry & Carbon Audit', date: '2026-09-01', size: '2.4 MB', status: 'Completed' },
    { id: 'rep-0831-b', title: 'Shift Performance Summary (Night)', date: '2026-08-31', size: '1.8 MB', status: 'Completed' },
    { id: 'rep-0831-a', title: 'BF Gas Pressure Outage Incident Analysis', date: '2026-08-31', size: '3.1 MB', status: 'Completed' },
    { id: 'rep-0830-c', title: 'Weekly Gasholder Capacity Utilization', date: '2026-08-30', size: '4.5 MB', status: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#CBD5E1]">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#FF6B00]" />
            Reports & Exports Console v2
          </h2>
          <p className="text-xs text-[#475569] font-mono mt-1">Generate automated shift compliance reports, carbon audit metrics, and CSV exports.</p>
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 space-y-4 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A]">Generate Industrial Telemetry Report</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <label className="text-[#64748B] block mb-1 font-semibold">Report Category</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded focus:border-[#FF6B00] focus:outline-none"
            >
              <option value="shift">Shift Telemetry Summary</option>
              <option value="carbon">Carbon Emission Audit (ESG)</option>
              <option value="efficiency">Plant Thermal Efficiency Audit</option>
            </select>
          </div>

          <div>
            <label className="text-[#64748B] block mb-1 font-semibold">Target Shift</label>
            <select 
              value={shift} 
              onChange={(e) => setShift(e.target.value)}
              className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded focus:border-[#FF6B00] focus:outline-none"
            >
              <option value="morning">Morning Shift (06:00 - 14:00)</option>
              <option value="afternoon">Afternoon Shift (14:00 - 22:00)</option>
              <option value="night">Night Shift (22:00 - 06:00)</option>
            </select>
          </div>

          <div>
            <label className="text-[#64748B] block mb-1 font-semibold">Date</label>
            <input 
              type="date" 
              defaultValue="2026-09-01"
              className="w-full p-2 bg-[#F8F9FA] border border-[#CBD5E1] text-[#0F172A] rounded focus:border-[#FF6B00] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={triggerExport}
            className="px-4 py-2.5 bg-flame-gradient text-white rounded text-xs font-mono font-bold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md glow-flame"
          >
            <Download className="w-4 h-4" />
            Export Official PDF Report
          </button>
          <button 
            onClick={triggerExport}
            className="px-4 py-2.5 bg-[#F1F3F5] text-[#0F172A] border border-[#CBD5E1] rounded text-xs font-mono font-bold hover:bg-[#E9ECEF] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
            Export Raw Telemetry CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-sm">
        <h3 className="font-display text-base font-bold text-[#0F172A] mb-4">Historical Archive & Export Logs</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#E2E8F0] text-[#64748B] uppercase">
              <tr>
                <th className="pb-3 font-bold">Report Document</th>
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">File Size</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8F9FA]">
                  <td className="py-3 font-bold text-[#0F172A]">{item.title}</td>
                  <td className="py-3 text-[#475569]">{item.date}</td>
                  <td className="py-3 text-[#64748B]">{item.size}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#D1FAE5] text-[#059669] font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={triggerExport}
                      className="text-[#FF6B00] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
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
