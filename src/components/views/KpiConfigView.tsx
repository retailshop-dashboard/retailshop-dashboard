import React, { useState } from 'react';

export const KpiConfigView: React.FC = () => {
  const [oab, setOab] = useState(100);
  const [otb, setOtb] = useState(90);
  const [gate, setGate] = useState(80);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
        <h2 className="font-headline font-bold text-lg text-[#0b1c30]">KPI Configuration & Grading Rules</h2>
        <p className="text-xs text-[#565e74]">
          Tune the operational benchmarks and performance tier thresholds for regional commission calculations
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-[#e2e8f0] space-y-5 text-xs">
        <div>
          <h3 className="font-bold text-sm text-[#0b1c30] mb-3">Status Tier Thresholds (% Quota Achievement)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
              <label className="font-bold text-emerald-800 block mb-1">OAB (Outstanding)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={oab}
                  onChange={(e) => setOab(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded bg-white text-emerald-900 font-bold"
                />
                <span className="text-[#64748b]">% and above</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Qualifies for maximum bonus tier (+15%)</p>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
              <label className="font-bold text-blue-800 block mb-1">OTB (On Target Benchmark)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={otb}
                  onChange={(e) => setOtb(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded bg-white text-blue-900 font-bold"
                />
                <span className="text-[#64748b]">% to {oab - 1}%</span>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">Normal standard incentive payout (100%)</p>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
              <label className="font-bold text-amber-800 block mb-1">GATE (Warning Threshold)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gate}
                  onChange={(e) => setGate(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded bg-white text-amber-900 font-bold"
                />
                <span className="text-[#64748b]">% to {otb - 1}%</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">Subject to supervisory review; 75% payout</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f1f5f9] pt-4">
          <h3 className="font-bold text-sm text-[#0b1c30] mb-3">Service Revenue Weights</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'FWBB Broadband', weight: '28%' },
              { name: 'eTopup Retailops', weight: '24%' },
              { name: 'CPE 5G Routers', weight: '16%' },
              { name: 'Blank SIM Packs', weight: '12%' },
              { name: 'Change SIM Repl.', weight: '8%' },
              { name: 'MDN VIP Reserv.', weight: '7%' },
              { name: 'NA Accessories', weight: '5%' },
            ].map((s) => (
              <div key={s.name} className="p-2 bg-slate-50 rounded border border-[#e2e8f0]">
                <div className="text-[11px] text-[#64748b]">{s.name}</div>
                <div className="font-bold text-sm text-[#0b1c30]">{s.weight}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
          <span className="text-[#64748b] text-[11px]">
            {saved ? '✓ Configuration saved and propagated to all 42 shops!' : 'Changes apply immediately across performance tables.'}
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[#2563eb] text-white hover:bg-[#1d4ed8] font-semibold text-xs transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
