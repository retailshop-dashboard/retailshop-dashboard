import React from 'react';

interface KpiCardGridProps {
  totalRevenue: number;
  totalGrossAds: number;
  totalFwbb: number;
  avgAchievement: number;
  totalActiveSubs: number;
  isFiltered?: boolean;
}

export const KpiCardGrid: React.FC<KpiCardGridProps> = ({
  totalRevenue,
  totalGrossAds,
  totalFwbb,
  avgAchievement,
  totalActiveSubs,
  isFiltered,
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* Metric 1: Shop Revenue */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            Shop Revenue
          </span>
          <span className="flex items-center text-[#007d55] bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>9.02%
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#0b1c30] tracking-tight font-tabular-data">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[#565e74] text-xs">
          <span className="truncate text-[11px]">
            {isFiltered ? 'Target: $2.1M' : 'Prev: $1,690,400'}
          </span>
          <svg className="w-16 h-5 text-emerald-600 stroke-current shrink-0" fill="none" viewBox="0 0 60 20">
            <path d="M2 16 L 12 14 L 22 15 L 32 9 L 42 11 L 52 4 L 58 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Metric 2: Gross Ads */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            Gross Ads
          </span>
          <span className="flex items-center text-[#007d55] bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>12.27%
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#0b1c30] tracking-tight font-tabular-data">
            {totalGrossAds.toLocaleString()} <span className="text-xs text-[#565e74] font-normal">SIMs</span>
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[#565e74] text-xs">
          <span className="truncate text-[11px]">Prev: 13,200</span>
          <svg className="w-16 h-5 text-emerald-600 stroke-current shrink-0" fill="none" viewBox="0 0 60 20">
            <path d="M2 17 L 14 12 L 24 13 L 34 8 L 44 10 L 52 5 L 58 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Metric 3: FWBB Top Up */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            FWBB Top Up
          </span>
          <span className="flex items-center text-[#ba1a1a] bg-red-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs mr-0.5">arrow_downward</span>4.21%
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#0b1c30] tracking-tight font-tabular-data">
            {formatCurrency(totalFwbb)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[#565e74] text-xs">
          <span className="truncate text-[11px]">Prev: $610,000</span>
          <svg className="w-16 h-5 text-red-500 stroke-current shrink-0" fill="none" viewBox="0 0 60 20">
            <path d="M2 4 L 14 6 L 24 5 L 34 11 L 44 9 L 52 14 L 58 17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Metric 4: KPI Hit Target */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            KPI Hit Target
          </span>
          <span className="flex items-center text-[#2563eb] bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            +3.3% pt
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#0b1c30] tracking-tight font-tabular-data">
            {avgAchievement.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>GATE · Near OTB
          </span>
          <span className="text-[11px] text-[#565e74]">Target: 90%</span>
        </div>
      </div>

      {/* Metric 5: Active Customers */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            Active Subs
          </span>
          <span className="flex items-center text-[#007d55] bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>3.61%
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#0b1c30] tracking-tight font-tabular-data">
            {totalActiveSubs.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[#565e74] text-xs">
          <span className="truncate text-[11px]">Prev: 90,840</span>
          <svg className="w-16 h-5 text-emerald-600 stroke-current shrink-0" fill="none" viewBox="0 0 60 20">
            <path d="M2 15 L 14 13 L 26 14 L 36 9 L 46 7 L 54 8 L 58 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Metric 6: YoY Growth */}
      <div className="bg-white p-3.5 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#565e74] uppercase tracking-wide">
            YoY Growth
          </span>
          <span className="flex items-center text-[#007d55] bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            +3.6% pt
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-headline font-bold text-2xl text-[#004ac6] tracking-tight font-tabular-data">
            +14.8%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[#565e74] text-xs">
          <span className="truncate text-[11px]">Prior Year: +11.2%</span>
          <span className="text-[10px] font-bold text-[#007d55] uppercase tracking-wider">Expanding</span>
        </div>
      </div>
    </div>
  );
};
