import React, { useState } from 'react';
import { SAMPLE_CUSTOMERS } from '../../data/telecomData';

export const CustomersView: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Subscriber & Customer Registry</h2>
          <p className="text-xs text-[#565e74]">
            94,120 active accounts registered across 42 shops with ARPU tracking and service assignments
          </p>
        </div>
        <input
          type="text"
          placeholder="Search accounts or customer names..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded bg-[#f8f9ff] text-[#0b1c30] w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0]">
          <span className="text-[#64748b]">Total Subscribers</span>
          <div className="text-xl font-bold text-[#0b1c30] mt-1 font-tabular-data">94,120</div>
          <span className="text-[10px] text-[#007d55]">+3.61% this month</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0]">
          <span className="text-[#64748b]">Avg ARPU</span>
          <div className="text-xl font-bold text-[#2563eb] mt-1 font-tabular-data">$48.50</div>
          <span className="text-[10px] text-[#64748b]">Blended across prepaid/postpaid</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0]">
          <span className="text-[#64748b]">FWBB Broadband Line</span>
          <div className="text-xl font-bold text-[#0b1c30] mt-1 font-tabular-data">26,350</div>
          <span className="text-[10px] text-[#007d55]">High-yield enterprise</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-[#e2e8f0]">
          <span className="text-[#64748b]">Churn Risk Alert</span>
          <div className="text-xl font-bold text-amber-700 mt-1 font-tabular-data">1.2%</div>
          <span className="text-[10px] text-amber-600">Within acceptable range</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-x-auto">
        <table className="w-full text-left font-tabular-data text-xs">
          <thead className="bg-[#f8f9ff] text-[#565e74] text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Account #</th>
              <th className="py-2.5 px-3 font-semibold">Customer / Enterprise</th>
              <th className="py-2.5 px-3 font-semibold">Service Type</th>
              <th className="py-2.5 px-3 text-right font-semibold">ARPU</th>
              <th className="py-2.5 px-3 font-semibold">Origin Outlet</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-4 font-semibold">Registration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#f8f9ff]">
                <td className="py-2.5 px-4 font-mono font-bold text-[#2563eb]">{c.accountNumber}</td>
                <td className="py-2.5 px-3 font-semibold text-[#0b1c30]">{c.name}</td>
                <td className="py-2.5 px-3">{c.serviceType}</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#0b1c30]">${c.arpu}/mo</td>
                <td className="py-2.5 px-3 text-[#64748b]">{c.assignedShop}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'Grace Period' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-[#64748b]">{c.registeredDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
