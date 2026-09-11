import React from 'react';

interface SyncToastProps {
  visible: boolean;
  onDismiss: () => void;
  syncSummary?: string;
}

export const SyncToast: React.FC<SyncToastProps> = ({
  visible,
  onDismiss,
  syncSummary = '184 records updated across 42 shops (14 OAB, 18 OTB, 7 GATE, 3 MIN)',
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 bg-[#213145] text-white p-3 rounded-lg shadow-xl z-50 flex items-center gap-3 transition-all transform translate-y-0 max-w-md border border-slate-700 animate-in slide-in-from-bottom-5"
    >
      <div className="p-2 rounded bg-[#007d55] text-white flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-lg">sync_saved_locally</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-xs text-white leading-tight">
          Google Sheets Live Data Synced
        </span>
        <span className="text-[11px] text-[#c3c6d7] mt-0.5 leading-snug">
          {syncSummary}
        </span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-auto text-[#c3c6d7] hover:text-white p-1 rounded transition-colors"
        title="Dismiss Notification"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};
