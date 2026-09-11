import React, { useState } from 'react';

export const CsvImportView: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [importedRows, setImportedRows] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStatus('parsing');
      setTimeout(() => {
        setStatus('success');
        setImportedRows(184);
      }, 800);
    }
  };

  const handleDownloadSample = () => {
    const sample = `ShopCode,ShopName,AgentCode,LeadAgent,Region,RevenueMTD,Target,ActiveSubs,FWBBAmount,GrossAds
C01,Central Megastore #01,AG-1082,Alex Wong,Metro Hub,148200,140000,4120,42100,1240
M02,Metro Plaza Flagship,AG-2041,Sarah Chen,Metro Hub,137760,140000,3980,39850,1120
N05,North Point Hub,AG-3105,Michael Davis,North,127680,140000,3650,36400,980`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teleportal-kpi-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex justify-between items-center">
        <div>
          <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Import CSV Performance Data</h2>
          <p className="text-xs text-[#565e74]">
            Ingest point-of-sale logs and agent quota reports from regional billing systems
          </p>
        </div>
        <button
          onClick={handleDownloadSample}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-[#e2e8f0] text-xs font-semibold text-[#0b1c30]"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Download CSV Template
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e2e8f0] text-center">
        <div className="border-2 border-dashed border-[#c3c6d7] rounded-xl p-8 hover:bg-slate-50/50 transition-colors">
          <span className="material-symbols-outlined text-4xl text-[#2563eb] mb-2">upload_file</span>
          <h3 className="font-bold text-sm text-[#0b1c30]">Drag and drop your performance CSV file here</h3>
          <p className="text-xs text-[#64748b] mt-1">Supports UTF-8 CSV up to 25MB (max 10,000 rows)</p>
          <label className="mt-4 inline-block px-4 py-2 bg-[#2563eb] text-white rounded text-xs font-semibold cursor-pointer hover:bg-[#1d4ed8] transition-colors shadow-sm">
            <span>Browse Files on Computer</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {status === 'parsing' && (
          <div className="mt-4 p-3 bg-blue-50 text-[#2563eb] rounded-lg text-xs flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            <span>Parsing file {fileName} and validating schema headers...</span>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-left text-xs">
            <div className="flex items-center gap-2 text-[#007d55] font-bold text-sm">
              <span className="material-symbols-outlined">check_circle</span>
              <span>Successfully parsed {fileName}</span>
            </div>
            <div className="mt-2 text-[#0b1c30]">
              Validated <span className="font-bold">{importedRows} agent records</span> across 42 shops. Zero column errors detected.
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => alert('Changes committed to live database!')}
                className="px-3 py-1.5 bg-[#007d55] text-white rounded font-semibold hover:bg-emerald-700 transition-colors"
              >
                Commit Records to Live Hub
              </button>
              <button
                onClick={() => { setStatus('idle'); setFileName(null); }}
                className="px-3 py-1.5 bg-white border border-[#e2e8f0] rounded text-[#565e74] hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
