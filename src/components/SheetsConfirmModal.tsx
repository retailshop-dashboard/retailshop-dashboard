import React from 'react';

interface SheetsConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: {
    spreadsheetTitle?: string;
    sheetName?: string;
    affectedCount?: number;
  };
  confirmLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SheetsConfirmModal: React.FC<SheetsConfirmModalProps> = ({
  isOpen,
  title,
  message,
  details,
  confirmLabel = 'Confirm & Overwrite',
  cancelLabel = 'Cancel',
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-md overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-100 text-amber-700 shrink-0">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-900">{title}</h3>
            <p className="text-[11px] text-amber-800">User Confirmation Required</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs text-[#0b1c30]">
          <p className="leading-relaxed">{message}</p>

          {details && (
            <div className="p-3 bg-slate-50 rounded border border-[#e2e8f0] space-y-1 text-[11px]">
              {details.spreadsheetTitle && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Target Spreadsheet:</span>
                  <span className="font-semibold text-[#0b1c30] truncate max-w-[200px]">
                    {details.spreadsheetTitle}
                  </span>
                </div>
              )}
              {details.sheetName && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Target Tab / Range:</span>
                  <span className="font-mono text-[#2563eb]">{details.sheetName}</span>
                </div>
              )}
              {details.affectedCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Affected Rows:</span>
                  <span className="font-bold text-[#0b1c30]">{details.affectedCount} shops / agents</span>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-[#64748b]">
            This operation will update the cell contents in your Google Drive spreadsheet. Existing cell values in that range will be replaced.
          </p>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#f1f5f9] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded bg-white text-[#565e74] hover:bg-slate-100 text-xs font-semibold border border-[#e2e8f0] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isProcessing && (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            )}
            <span>{isProcessing ? 'Updating Sheet...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
