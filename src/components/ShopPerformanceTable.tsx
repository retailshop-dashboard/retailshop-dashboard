import React, { useState, useMemo } from 'react';
import { ShopItem, KPIStatus } from '../types';

interface ShopPerformanceTableProps {
  shops: ShopItem[];
  onOpenShopModal: (shop: ShopItem) => void;
  statusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export const ShopPerformanceTable: React.FC<ShopPerformanceTableProps> = ({
  shops,
  onOpenShopModal,
  statusFilter,
  onSelectStatusFilter,
  searchQuery,
  onSearchChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ShopItem>('revenueMtd');
  const [sortAsc, setSortAsc] = useState(false);
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const [minAchievementFilter, setMinAchievementFilter] = useState(0);

  const PAGE_SIZE = 7;

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: shops.length,
      OAB: shops.filter((s) => s.status === 'OAB').length,
      OTB: shops.filter((s) => s.status === 'OTB').length,
      GATE: shops.filter((s) => s.status === 'GATE').length,
      MIN: shops.filter((s) => s.status === 'MIN').length,
    };
  }, [shops]);

  // Filtered list
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // Status filter
      if (statusFilter !== 'all' && shop.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          shop.name.toLowerCase().includes(q) ||
          shop.code.toLowerCase().includes(q) ||
          shop.leadAgent.toLowerCase().includes(q) ||
          shop.agentCode.toLowerCase().includes(q) ||
          shop.region.toLowerCase().includes(q) ||
          shop.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Min achievement filter from 'More'
      if (minAchievementFilter > 0 && shop.achievementPct < minAchievementFilter) {
        return false;
      }
      return true;
    });
  }, [shops, statusFilter, searchQuery, minAchievementFilter]);

  // Sorted list
  const sortedShops = useMemo(() => {
    return [...filteredShops].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });
  }, [filteredShops, sortField, sortAsc]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(sortedShops.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);

  // Paginated shops
  const paginatedShops = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return sortedShops.slice(start, start + PAGE_SIZE);
  }, [sortedShops, activePage]);

  const handleSort = (field: keyof ShopItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Code', 'Shop Name', 'Lead Agent', 'Agent Code', 'Region', 'Revenue MTD', 'Target', 'Achievement %', 'Active Subs', 'FWBB TopUp', 'Gross Ads', 'Status'];
    const csvRows = [
      headers.join(','),
      ...sortedShops.map((s) =>
        [
          s.code,
          `"${s.name}"`,
          `"${s.leadAgent}"`,
          s.agentCode,
          `"${s.region}"`,
          s.revenueMtd,
          s.target,
          `${s.achievementPct}%`,
          s.activeSubs,
          s.fwbbTopUp,
          s.grossAds,
          s.status,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telecom-shop-performance-${statusFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

  const renderStatusBadge = (status: KPIStatus) => {
    switch (status) {
      case 'OAB':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>OAB
          </span>
        );
      case 'OTB':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>OTB
          </span>
        );
      case 'GATE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>GATE
          </span>
        );
      case 'MIN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>MIN
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden flex flex-col">
      {/* Table Header Toolbar */}
      <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white border-b border-[#f1f5f9]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2563eb] text-xl">leaderboard</span>
            <h3 className="font-headline font-semibold text-base text-[#0b1c30]">
              Shop & Agent Operational Performance
            </h3>
          </div>
          <span className="text-xs text-[#565e74]">
            Breakdown of gross revenue, achievement against target, and live status grading
          </span>
        </div>

        {/* Table Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Table Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-sm text-[#94a3b8]">search</span>
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#f8f9ff] rounded border border-[#e2e8f0] text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#2563eb] w-56"
              placeholder="Filter shop, agent code, city..."
              type="text"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-[#f8f9ff] p-1 rounded border border-[#e2e8f0] text-xs">
            <button
              onClick={() => onSelectStatusFilter('all')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-[#2563eb] font-semibold shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => onSelectStatusFilter('OAB')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                statusFilter === 'OAB'
                  ? 'bg-white text-[#007d55] font-semibold shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              OAB ({counts.OAB})
            </button>
            <button
              onClick={() => onSelectStatusFilter('OTB')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                statusFilter === 'OTB'
                  ? 'bg-white text-[#2563eb] font-semibold shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              OTB ({counts.OTB})
            </button>
            <button
              onClick={() => onSelectStatusFilter('GATE')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                statusFilter === 'GATE'
                  ? 'bg-white text-amber-700 font-semibold shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              GATE ({counts.GATE})
            </button>
            <button
              onClick={() => onSelectStatusFilter('MIN')}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                statusFilter === 'MIN'
                  ? 'bg-white text-red-700 font-semibold shadow-sm'
                  : 'text-[#565e74] hover:text-[#0b1c30]'
              }`}
            >
              MIN ({counts.MIN})
            </button>
          </div>

          {/* More Filters Toggle */}
          <div className="relative">
            <button
              onClick={() => setMoreFilterOpen(!moreFilterOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#f8f9ff] text-[#0b1c30] text-xs hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
            >
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              <span>More</span>
            </button>

            {moreFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#e2e8f0] p-3 z-30 text-xs animate-in fade-in">
                <div className="font-semibold text-[#0b1c30] mb-2">Filter Parameters</div>
                <label className="block text-[11px] text-[#64748b] mb-1">
                  Min Achievement %: {minAchievementFilter}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="110"
                  step="5"
                  value={minAchievementFilter}
                  onChange={(e) => setMinAchievementFilter(Number(e.target.value))}
                  className="w-full accent-[#2563eb]"
                />
                <div className="mt-3 flex justify-between">
                  <button
                    onClick={() => setMinAchievementFilter(0)}
                    className="text-[11px] text-[#565e74] hover:underline"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMoreFilterOpen(false)}
                    className="px-2 py-1 bg-[#2563eb] text-white rounded text-[11px] font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#f8f9ff] text-[#0b1c30] text-xs hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
          >
            <span className="material-symbols-outlined text-sm text-[#565e74]">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* The Tabular Grid */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-tabular-data text-xs">
          <thead className="bg-[#f8f9ff] text-[#565e74] text-[11px] uppercase tracking-wider sticky top-0 z-10 border-b border-[#e2e8f0]">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-4 font-semibold cursor-pointer hover:text-[#0b1c30]"
              >
                Shop / Lead Agent
              </th>
              <th
                onClick={() => handleSort('region')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-[#0b1c30]"
              >
                Region
              </th>
              <th
                onClick={() => handleSort('revenueMtd')}
                className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#0b1c30]"
              >
                Revenue (MTD)
              </th>
              <th
                onClick={() => handleSort('target')}
                className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#0b1c30]"
              >
                Target
              </th>
              <th
                onClick={() => handleSort('achievementPct')}
                className="py-2.5 px-4 font-semibold min-w-[150px] cursor-pointer hover:text-[#0b1c30]"
              >
                Achievement %
              </th>
              <th
                onClick={() => handleSort('activeSubs')}
                className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#0b1c30]"
              >
                Active Subs
              </th>
              <th
                onClick={() => handleSort('fwbbTopUp')}
                className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#0b1c30]"
              >
                FWBB Top Up
              </th>
              <th
                onClick={() => handleSort('grossAds')}
                className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-[#0b1c30]"
              >
                Gross Ads
              </th>
              <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              <th className="py-2.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f1f5f9]">
            {paginatedShops.map((shop) => {
              const progressWidth = Math.min(100, shop.achievementPct);
              const progressColor =
                shop.achievementPct >= 100
                  ? 'bg-[#007d55]'
                  : shop.achievementPct >= 90
                  ? 'bg-[#2563eb]'
                  : shop.achievementPct >= 80
                  ? 'bg-amber-500'
                  : 'bg-red-500';

              const progressTextColor =
                shop.achievementPct >= 100
                  ? 'text-[#007d55]'
                  : shop.achievementPct >= 90
                  ? 'text-[#2563eb]'
                  : shop.achievementPct >= 80
                  ? 'text-amber-700'
                  : 'text-red-700';

              return (
                <tr key={shop.id} className="hover:bg-[#f8f9ff] transition-colors">
                  {/* Shop & Lead Agent */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-[#2563eb] font-bold text-xs shrink-0 border border-blue-100">
                        {shop.code}
                      </div>
                      <div className="flex flex-col">
                        <button
                          onClick={() => onOpenShopModal(shop)}
                          className="font-semibold text-xs text-[#0b1c30] hover:text-[#2563eb] text-left transition-colors truncate max-w-[200px]"
                        >
                          {shop.name}
                        </button>
                        <span className="text-[11px] text-[#565e74] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">person</span> {shop.leadAgent}{' '}
                          <span className="text-[#94a3b8] font-mono text-[10px]">({shop.agentCode})</span>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Region */}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f1f5f9] text-[#334155] text-[11px] font-medium border border-[#e2e8f0]/60">
                      {shop.region}
                    </span>
                  </td>

                  {/* Revenue MTD */}
                  <td className="py-2.5 px-3 text-right font-bold text-[#0b1c30]">
                    {formatCurrency(shop.revenueMtd)}
                  </td>

                  {/* Target */}
                  <td className="py-2.5 px-3 text-right text-[#565e74]">
                    {formatCurrency(shop.target)}
                  </td>

                  {/* Achievement % with bar */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${progressColor}`}
                          style={{ width: `${progressWidth}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-xs shrink-0 ${progressTextColor}`}>
                        {shop.achievementPct}%
                      </span>
                    </div>
                  </td>

                  {/* Active Subs */}
                  <td className="py-2.5 px-3 text-right text-[#0b1c30]">
                    {shop.activeSubs.toLocaleString()}
                  </td>

                  {/* FWBB Top Up */}
                  <td className="py-2.5 px-3 text-right text-[#0b1c30] font-medium">
                    {formatCurrency(shop.fwbbTopUp)}
                  </td>

                  {/* Gross Ads */}
                  <td className="py-2.5 px-3 text-right text-[#0b1c30]">
                    {shop.grossAds.toLocaleString()}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3 text-center">{renderStatusBadge(shop.status)}</td>

                  {/* Action */}
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => onOpenShopModal(shop)}
                      className="p-1 rounded text-[#565e74] hover:text-[#2563eb] hover:bg-[#f1f5f9] transition-colors"
                      title="Inspect Shop Drilldown"
                    >
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Summary Totals Row */}
          <tfoot className="bg-[#e5eeff] text-[#0b1c30] font-semibold text-xs border-t-2 border-[#c3c6d7]">
            <tr>
              <td className="py-2.5 px-4 font-bold uppercase tracking-wider">Audit Total (42 Shops)</td>
              <td className="py-2.5 px-3 text-[#565e74]">All Regions</td>
              <td className="py-2.5 px-3 text-right font-bold text-[#2563eb]">$1,842,950</td>
              <td className="py-2.5 px-3 text-right text-[#565e74]">$2,108,000</td>
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-[#c3c6d7]/50 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#2563eb] h-2 rounded-full" style={{ width: '87.4%' }}></div>
                  </div>
                  <span className="font-bold text-[#2563eb] text-xs">87.4% Avg</span>
                </div>
              </td>
              <td className="py-2.5 px-3 text-right">94,120</td>
              <td className="py-2.5 px-3 text-right">$584,320</td>
              <td className="py-2.5 px-3 text-right">14,820</td>
              <td className="py-2.5 px-3 text-center">
                <span className="px-2 py-0.5 rounded bg-[#2563eb] text-white text-[10px] font-bold">
                  PORTAL BLEND
                </span>
              </td>
              <td className="py-2.5 px-4 text-right"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-4 bg-white border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="text-[#565e74]">
          Showing <span className="font-semibold text-[#0b1c30]">{(activePage - 1) * PAGE_SIZE + 1}</span> to{' '}
          <span className="font-semibold text-[#0b1c30]">
            {Math.min(activePage * PAGE_SIZE, sortedShops.length)}
          </span>{' '}
          of <span className="font-semibold text-[#0b1c30]">{sortedShops.length}</span> shops (
          <span className="font-semibold text-[#0b1c30]">184</span> agents logged)
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={activePage === 1}
            className="px-2.5 py-1 rounded bg-[#f8f9ff] text-[#565e74] hover:text-[#0b1c30] disabled:opacity-40 disabled:cursor-not-allowed border border-[#e2e8f0]"
          >
            <span className="material-symbols-outlined text-xs align-middle">chevron_left</span> Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-2.5 py-1 rounded font-medium ${
                  activePage === pageNum
                    ? 'bg-[#2563eb] text-white font-bold'
                    : 'bg-[#f8f9ff] hover:bg-[#e2e8f0] text-[#0b1c30] border border-[#e2e8f0]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={activePage === totalPages}
            className="px-2.5 py-1 rounded bg-[#f8f9ff] text-[#565e74] hover:text-[#0b1c30] disabled:opacity-40 disabled:cursor-not-allowed border border-[#e2e8f0]"
          >
            Next <span className="material-symbols-outlined text-xs align-middle">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
