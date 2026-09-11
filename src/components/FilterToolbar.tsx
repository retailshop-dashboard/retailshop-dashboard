import React from 'react';
import { FilterState } from '../types';

interface FilterToolbarProps {
  filters: FilterState;
  onChangeFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  auditedCount: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters: _onResetFilters,
  auditedCount,
}) => {
  return (
    <div className="bg-white px-4 py-2.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-wrap items-center gap-3 text-xs">
      {/* Period Filter */}
      <div className="flex items-center gap-1.5 bg-[#f8f9ff] rounded px-2.5 py-1.5 text-[#565e74] border border-[#e2e8f0]/80">
        <span className="material-symbols-outlined text-[15px] text-[#737686]">date_range</span>
        <span className="text-[10px] uppercase font-bold text-[#737686] tracking-wider">Period</span>
        <select
          value={filters.period}
          onChange={(e) => onChangeFilter('period', e.target.value)}
          className="bg-transparent font-semibold text-[#0b1c30] focus:outline-none cursor-pointer pr-1 text-xs"
        >
          <option value="oct-mtd">Oct 2024 - MTD (Month to Date)</option>
          <option value="q3">Q3 2024 (Jul - Sep)</option>
          <option value="rolling-30">Last 30 Rolling Days</option>
          <option value="ytd">YTD (Fiscal 2024)</option>
        </select>
      </div>

      {/* Region Filter */}
      <div className="flex items-center gap-1.5 bg-[#f8f9ff] rounded px-2.5 py-1.5 text-[#565e74] border border-[#e2e8f0]/80">
        <span className="material-symbols-outlined text-[15px] text-[#737686]">map</span>
        <span className="text-[10px] uppercase font-bold text-[#737686] tracking-wider">Region</span>
        <select
          value={filters.region}
          onChange={(e) => onChangeFilter('region', e.target.value)}
          className="bg-transparent font-semibold text-[#0b1c30] focus:outline-none cursor-pointer pr-1 text-xs"
        >
          <option value="all">All Regions (Central, North, South, Metro, East)</option>
          <option value="Metro Hub">Metro Central Hub (12 Shops)</option>
          <option value="North">North Regional Corridor (8 Shops)</option>
          <option value="South Bay">South Bay & Coast (9 Shops)</option>
          <option value="East">East Express Zone (13 Shops)</option>
        </select>
      </div>

      {/* Shop Selector */}
      <div className="flex items-center gap-1.5 bg-[#f8f9ff] rounded px-2.5 py-1.5 text-[#565e74] border border-[#e2e8f0]/80">
        <span className="material-symbols-outlined text-[15px] text-[#737686]">store</span>
        <span className="text-[10px] uppercase font-bold text-[#737686] tracking-wider">Outlet</span>
        <select
          value={filters.outlet}
          onChange={(e) => onChangeFilter('outlet', e.target.value)}
          className="bg-transparent font-semibold text-[#0b1c30] focus:outline-none cursor-pointer pr-1 text-xs"
        >
          <option value="all">All Telecom Retail Outlets (42 Active)</option>
          <option value="Central Megastore #01">Central Megastore #01</option>
          <option value="Metro Plaza Flagship">Metro Plaza Flagship</option>
          <option value="North Point Hub">North Point Hub</option>
          <option value="South Bay Express">South Bay Express</option>
          <option value="East Harbor Center">East Harbor Center</option>
          <option value="Highland Terminal Kiosk">Highland Terminal Kiosk</option>
          <option value="Grand Central Outlet">Grand Central Outlet</option>
        </select>
      </div>

      {/* Sales Agent */}
      <div className="flex items-center gap-1.5 bg-[#f8f9ff] rounded px-2.5 py-1.5 text-[#565e74] border border-[#e2e8f0]/80">
        <span className="material-symbols-outlined text-[15px] text-[#737686]">badge</span>
        <span className="text-[10px] uppercase font-bold text-[#737686] tracking-wider">Agent</span>
        <select
          value={filters.agent}
          onChange={(e) => onChangeFilter('agent', e.target.value)}
          className="bg-transparent font-semibold text-[#0b1c30] focus:outline-none cursor-pointer pr-1 text-xs"
        >
          <option value="all">All Senior & Direct Agents (184)</option>
          <option value="Alex Wong">AG-1082: Alex Wong</option>
          <option value="Sarah Chen">AG-2041: Sarah Chen</option>
          <option value="Michael Davis">AG-3105: Michael Davis</option>
          <option value="Priya Patel">AG-4122: Priya Patel</option>
          <option value="Jason Miller">AG-5019: Jason Miller</option>
          <option value="Elena Rostova">AG-6211: Elena Rostova</option>
          <option value="Carlos Mendez">AG-1429: Carlos Mendez</option>
        </select>
      </div>

      {/* Core Service Filter */}
      <div className="flex items-center gap-1.5 bg-[#f8f9ff] rounded px-2.5 py-1.5 text-[#565e74] border border-[#e2e8f0]/80">
        <span className="material-symbols-outlined text-[15px] text-[#737686]">layers</span>
        <span className="text-[10px] uppercase font-bold text-[#737686] tracking-wider">Service</span>
        <select
          value={filters.service}
          onChange={(e) => onChangeFilter('service', e.target.value)}
          className="bg-transparent font-semibold text-[#0b1c30] focus:outline-none cursor-pointer pr-1 text-xs"
        >
          <option value="all">All 7 Core Lines (FWBB, eTopup, CPE, SIM...)</option>
          <option value="FWBB Broadband">FWBB (Fixed Wireless Broadband)</option>
          <option value="eTopup - Retailops">eTopup - Retailops</option>
          <option value="CPE 5G Routers">CPE / 5G Enterprise Hardware</option>
          <option value="Blank SIM Packs">Blank SIM & MNP</option>
          <option value="Change SIM (SIM Replacement)">Change SIM (SIM Replacement)</option>
        </select>
      </div>

      {/* Audited Status Counter */}
      <div className="ml-auto flex items-center gap-1.5 text-[#007d55] text-xs font-semibold">
        <span className="material-symbols-outlined text-[17px] text-[#007d55]">check_circle</span>
        <span>{auditedCount} Shops Audited</span>
      </div>
    </div>
  );
};
