import React from 'react';
import { MONTHLY_TRAJECTORY } from '../../data/telecomData';

export const MonthlyHistoryView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
        <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Monthly Performance & Historical KPI Logs</h2>
        <p className="text-xs text-[#565e74]">
          Fiscal Year 2024 historic revenue trends, subscriber acquisitions, and quota hit benchmarks
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-x-auto">
        <table className="w-full text-left font-tabular-data text-xs">
          <thead className="bg-[#f8f9ff] text-[#565e74] text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
            <tr>
              <th className="py-3 px-4 font-semibold">Month</th>
              <th className="py-3 px-4 text-right font-semibold">Gross Revenue</th>
              <th className="py-3 px-4 text-right font-semibold">Quota Target</th>
              <th className="py-3 px-4 text-center font-semibold">Achievement %</th>
              <th className="py-3 px-4 text-right font-semibold">MoM Growth</th>
              <th className="py-3 px-4 text-center font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {MONTHLY_TRAJECTORY.map((m, i) => {
              const ach = ((m.actual / m.target) * 100).toFixed(1);
              const prev = i > 0 ? MONTHLY_TRAJECTORY[i - 1].actual : null;
              const mom = prev ? (((m.actual - prev) / prev) * 100).toFixed(1) : '+0.0%';

              return (
                <tr key={m.month} className="hover:bg-[#f8f9ff]">
                  <td className="py-3 px-4 font-bold text-[#0b1c30]">
                    {m.month} {m.isMtd && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold ml-1">LIVE</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0b1c30]">${m.actual.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-[#64748b]">${m.target.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${Number(ach) >= 100 ? 'text-[#007d55]' : 'text-[#2563eb]'}`}>
                      {ach}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#007d55]">+{mom}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      Number(ach) >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {Number(ach) >= 100 ? 'OAB' : 'OTB'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
