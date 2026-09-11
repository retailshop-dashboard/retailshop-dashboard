import React, { useState } from 'react';
import { RECENT_SYNC_LOGS } from '../../data/telecomData';

interface GSheetsSyncViewProps {
  onTriggerSync: () => void;
  syncing: boolean;
  lastSyncText: string;
}

export const GSheetsSyncView: React.FC<GSheetsSyncViewProps> = ({
  onTriggerSync,
  syncing,
  lastSyncText,
}) => {
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1X9_teleportal_ops_hub_q4/edit#gid=0'
  );

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Google Sheets Live Integration</h2>
          <p className="text-xs text-[#565e74]">
            Bi-directional synchronization gateway bridging live spreadsheet registers with the TelePortal engine
          </p>
        </div>
        <button
          onClick={onTriggerSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] text-white rounded text-xs font-semibold hover:bg-[#1d4ed8] disabled:opacity-60 transition-colors shadow-sm"
        >
          <span className={`material-symbols-outlined text-sm ${syncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{syncing ? 'Syncing Now...' : 'Sync Now with G-Sheets'}</span>
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-[#e2e8f0] space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
            <div>
              <div className="font-bold text-emerald-900 text-sm">Spreadsheet Connection Healthy</div>
              <div className="text-[11px] text-emerald-700">Status: {lastSyncText} • Latency: 312ms</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
            ACTIVE WEBHOOK
          </span>
        </div>

        <div>
          <label className="font-bold text-[#0b1c30] block mb-1">Target Google Sheet URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-[#e2e8f0] rounded bg-[#f8f9ff] text-[#0b1c30]"
            />
            <button
              onClick={() => window.open(sheetUrl, '_blank')}
              className="px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#e2e8f0] border border-[#e2e8f0] rounded font-semibold text-[#0b1c30]"
            >
              Open Sheet
            </button>
          </div>
          <p className="text-[11px] text-[#64748b] mt-1">
            Mapped Sheet Range: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">Shops_Oct_MTD!A1:N185</code> (184 agent performance records)
          </p>
        </div>

        <div className="border-t border-[#f1f5f9] pt-4">
          <h3 className="font-bold text-sm text-[#0b1c30] mb-2">Sync Audit History</h3>
          <div className="space-y-2">
            {RECENT_SYNC_LOGS.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-[#e2e8f0]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-600">done_all</span>
                  <div>
                    <span className="font-semibold text-[#0b1c30]">{log.timestamp}</span>
                    <span className="text-[11px] text-[#64748b] block">{log.initiatedBy}</span>
                  </div>
                </div>
                <div className="text-right font-tabular-data">
                  <span className="font-bold text-[#007d55]">{log.recordsCount} rows synced</span>
                  <span className="text-[11px] text-[#64748b] block">{log.latencyMs}ms latency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
