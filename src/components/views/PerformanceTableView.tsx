import React, { useState, useMemo } from 'react';
import { ALL_SHOPS } from '../../data/telecomData';
import { ShopItem } from '../../types';

interface PerformanceTableViewProps {
  onOpenShopModal: (shop: ShopItem) => void;
}

export const PerformanceTableView: React.FC<PerformanceTableViewProps> = ({ onOpenShopModal }) => {
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof ShopItem>('achievementPct');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    return ALL_SHOPS.filter((s) => {
      if (regionFilter !== 'all' && s.region !== regionFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.leadAgent.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (typeof vA === 'number' && typeof vB === 'number') {
        return sortAsc ? vA - vB : vB - vA;
      }
      return 0;
    });
  }, [regionFilter, statusFilter, search, sortField, sortAsc]);

  const handleSort = (f: keyof ShopItem) => {
    if (sortField === f) setSortAsc(!sortAsc);
    else {
      setSortField(f);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-headline font-bold text-lg text-[#0b1c30]">Full Performance Table & Shop Ranking</h2>
          <p className="text-xs text-[#565e74]">Complete ledger of 42 outlets with real-time KPI thresholds</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search shops or agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded bg-[#f8f9ff] text-[#0b1c30] w-48"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded bg-white text-[#0b1c30]"
          >
            <option value="all">All Regions</option>
            <option value="Metro Hub">Metro Hub</option>
            <option value="North">North</option>
            <option value="South Bay">South Bay</option>
            <option value="East">East</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded bg-white text-[#0b1c30]"
          >
            <option value="all">All Statuses</option>
            <option value="OAB">OAB (&gt;=100%)</option>
            <option value="OTB">OTB (90-99%)</option>
            <option value="GATE">GATE (80-89%)</option>
            <option value="MIN">MIN (&lt;80%)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-x-auto">
        <table className="w-full text-left font-tabular-data text-xs">
          <thead className="bg-[#f8f9ff] text-[#565e74] text-[11px] uppercase tracking-wider border-b border-[#e2e8f0]">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Rank</th>
              <th onClick={() => handleSort('name')} className="py-2.5 px-3 font-semibold cursor-pointer">Shop Name</th>
              <th onClick={() => handleSort('region')} className="py-2.5 px-3 font-semibold cursor-pointer">Region</th>
              <th onClick={() => handleSort('revenueMtd')} className="py-2.5 px-3 text-right font-semibold cursor-pointer">Revenue MTD</th>
              <th onClick={() => handleSort('target')} className="py-2.5 px-3 text-right font-semibold cursor-pointer">Target</th>
              <th onClick={() => handleSort('achievementPct')} className="py-2.5 px-4 text-center font-semibold cursor-pointer">Achievement</th>
              <th onClick={() => handleSort('activeSubs')} className="py-2.5 px-3 text-right font-semibold cursor-pointer">Subs</th>
              <th onClick={() => handleSort('fwbbTopUp')} className="py-2.5 px-3 text-right font-semibold cursor-pointer">FWBB</th>
              <th onClick={() => handleSort('grossAds')} className="py-2.5 px-3 text-right font-semibold cursor-pointer">Gross Ads</th>
              <th className="py-2.5 px-3 text-center font-semibold">Status</th>
              <th className="py-2.5 px-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {filtered.map((s, idx) => (
              <tr key={s.id} className="hover:bg-[#f8f9ff]">
                <td className="py-2.5 px-4 font-bold text-[#64748b]">#{idx + 1}</td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-[#0b1c30]">{s.name}</div>
                  <div className="text-[11px] text-[#64748b]">{s.leadAgent} ({s.code})</div>
                </td>
                <td className="py-2.5 px-3">{s.region}</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#0b1c30]">${s.revenueMtd.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right text-[#64748b]">${s.target.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`font-bold ${s.achievementPct >= 100 ? 'text-[#007d55]' : s.achievementPct >= 90 ? 'text-[#2563eb]' : s.achievementPct >= 80 ? 'text-amber-700' : 'text-red-700'}`}>
                    {s.achievementPct}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">{s.activeSubs.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right">${s.fwbbTopUp.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right">{s.grossAds.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === 'OAB' ? 'bg-emerald-100 text-emerald-800' :
                    s.status === 'OTB' ? 'bg-blue-100 text-blue-800' :
                    s.status === 'GATE' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {s.status}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button onClick={() => onOpenShopModal(s)} className="text-[#2563eb] hover:underline font-medium">
                    Drilldown
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
