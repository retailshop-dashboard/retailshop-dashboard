import React from 'react';

export const PermissionsView: React.FC = () => {
  const roles = [
    { role: 'Regional Director (Marcus Vance)', read: true, write: true, export: true, admin: true, users: 1 },
    { role: 'Shop Lead / Supervisors (42 Leads)', read: true, write: true, export: true, admin: false, users: 42 },
    { role: 'NOC & Performance Analysts', read: true, write: false, export: true, admin: false, users: 8 },
    { role: 'Field Sales Agents (184 Staff)', read: true, write: false, export: false, admin: false, users: 184 },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
        <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Access Control & Role Permissions</h2>
        <p className="text-xs text-[#565e74]">
          Role-based access matrix managing visibility into individual agent compensation, quota overrides, and CSV data export
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-x-auto text-xs">
        <table className="w-full text-left font-tabular-data">
          <thead className="bg-[#f8f9ff] text-[#565e74] text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
            <tr>
              <th className="py-3 px-4 font-semibold">User Role Group</th>
              <th className="py-3 px-3 text-center font-semibold">Read Dashboard</th>
              <th className="py-3 px-3 text-center font-semibold">Edit Target/Quota</th>
              <th className="py-3 px-3 text-center font-semibold">Export CSV/PDF</th>
              <th className="py-3 px-3 text-center font-semibold">Admin Config</th>
              <th className="py-3 px-4 text-right font-semibold">Assigned Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {roles.map((r) => (
              <tr key={r.role} className="hover:bg-[#f8f9ff]">
                <td className="py-3 px-4 font-semibold text-[#0b1c30]">{r.role}</td>
                <td className="py-3 px-3 text-center">
                  <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`material-symbols-outlined text-base ${r.write ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {r.write ? 'check_circle' : 'cancel'}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`material-symbols-outlined text-base ${r.export ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {r.export ? 'check_circle' : 'cancel'}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`material-symbols-outlined text-base ${r.admin ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {r.admin ? 'check_circle' : 'cancel'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-[#0b1c30]">{r.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
