import React from 'react';

export const ActualVsKpiView: React.FC = () => {
  const regions = [
    { name: 'Metro Central Hub', shops: 12, target: 1680000, actual: 1718000, variancePct: 2.26, status: 'OTB', lead: 'Sarah Chen' },
    { name: 'North Regional Corridor', shops: 8, target: 1120000, actual: 1152000, variancePct: 2.85, status: 'OAB', lead: 'Elena Rostova' },
    { name: 'South Bay & Coast', shops: 9, target: 1260000, actual: 1184000, variancePct: -6.03, status: 'GATE', lead: 'Priya Patel' },
    { name: 'East Express Zone', shops: 13, target: 1820000, actual: 1698000, variancePct: -6.70, status: 'GATE', lead: 'Jason Miller' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
        <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Actual vs KPI Target Variance Matrix</h2>
        <p className="text-xs text-[#565e74]">
          Quarter-to-date and month-to-date comparison breakdown by operating region and quota achievement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {regions.map((reg) => (
          <div key={reg.name} className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0b1c30]">{reg.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                reg.variancePct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {reg.status}
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xs text-[#64748b]">Actual vs Target</div>
              <div className="flex items-baseline gap-2 mt-0.5 font-tabular-data">
                <span className="text-lg font-bold text-[#0b1c30]">${(reg.actual / 1000000).toFixed(2)}M</span>
                <span className="text-xs text-[#64748b]">/ ${(reg.target / 1000000).toFixed(2)}M</span>
              </div>
            </div>
            <div className="mt-3 text-xs flex justify-between border-t border-[#f1f5f9] pt-2">
              <span className="text-[#64748b]">Net Variance:</span>
              <span className={`font-bold font-tabular-data ${reg.variancePct >= 0 ? 'text-[#007d55]' : 'text-red-600'}`}>
                {reg.variancePct >= 0 ? `+${reg.variancePct}%` : `${reg.variancePct}%`} (${(reg.actual - reg.target).toLocaleString()})
              </span>
            </div>
            <div className="text-[11px] text-[#64748b] mt-1">Regional Lead: {reg.lead} ({reg.shops} shops)</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
        <h3 className="font-semibold text-sm text-[#0b1c30] mb-3">Service Quota Attainment Breakdown</h3>
        <div className="space-y-3 text-xs">
          {[
            { name: 'FWBB Broadband ($516k / $500k target)', pct: 103.2, color: 'bg-emerald-500' },
            { name: 'eTopup Retailops ($442k / $450k target)', pct: 98.2, color: 'bg-blue-600' },
            { name: 'CPE 5G Routers ($294k / $280k target)', pct: 105.0, color: 'bg-emerald-500' },
            { name: 'Blank SIM Packs ($221k / $240k target)', pct: 92.1, color: 'bg-blue-600' },
            { name: 'Change SIM Replacements ($147k / $160k target)', pct: 91.8, color: 'bg-blue-600' },
            { name: 'MDN VIP Reservations ($129k / $150k target)', pct: 86.0, color: 'bg-amber-500' },
            { name: 'NA Accessories & Addons ($92k / $120k target)', pct: 76.6, color: 'bg-red-500' },
          ].map((item) => (
            <div key={item.name}>
              <div className="flex justify-between font-medium mb-1">
                <span>{item.name}</span>
                <span className="font-bold">{item.pct}%</span>
              </div>
              <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${Math.min(100, item.pct)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
