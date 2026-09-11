import React, { useState } from 'react';
import { MONTHLY_TRAJECTORY, WEEKLY_TRAJECTORY, DAILY_TRAJECTORY } from '../data/telecomData';

export const RevenueTrajectoryChart: React.FC = () => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate coordinates based on granularity
  const isMonthly = granularity === 'monthly';
  const isWeekly = granularity === 'weekly';

  const monthlyPoints = MONTHLY_TRAJECTORY.map((item, idx) => {
    // x from 60 to 720
    const x = 60 + idx * 73.33;
    // value between 0.4M (200y) and 2.0M (20y)
    // ratio = (val - 400000) / 1600000; y = 200 - ratio * 180
    const actualY = 200 - ((item.actual - 400000) / 1600000) * 180;
    const targetY = 200 - ((item.target - 400000) / 1600000) * 180;
    return { ...item, x, actualY, targetY, label: item.month };
  });

  const weeklyPoints = WEEKLY_TRAJECTORY.map((item, idx) => {
    const x = 60 + idx * 94;
    // value between 350k (200y) and 520k (20y)
    const actualY = 200 - ((item.actual - 350000) / 170000) * 180;
    const targetY = 200 - ((item.target - 350000) / 170000) * 180;
    return { ...item, x, actualY, targetY, label: item.week };
  });

  const dailyPoints = DAILY_TRAJECTORY.map((item, idx) => {
    const x = 55 + idx * 67;
    // value between 50k (200y) and 85k (20y)
    const actualY = 200 - ((item.actual - 50000) / 35000) * 180;
    const targetY = 200 - ((item.target - 50000) / 35000) * 180;
    return { ...item, x, actualY, targetY, label: item.day };
  });

  const currentPoints = isMonthly ? monthlyPoints : isWeekly ? weeklyPoints : dailyPoints;

  const actualPath = currentPoints.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.actualY.toFixed(1)}`,
    ''
  );

  const targetPath = currentPoints.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.targetY.toFixed(1)}`,
    ''
  );

  const areaPath = `${actualPath} L ${currentPoints[currentPoints.length - 1].x.toFixed(1)} 200 L ${currentPoints[0].x.toFixed(1)} 200 Z`;

  const activePoint = hoveredIndex !== null ? currentPoints[hoveredIndex] : currentPoints[currentPoints.length - 1];

  return (
    <div className="xl:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
      <div>
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
            <h2 className="font-headline font-semibold text-base text-[#0b1c30]">
              Revenue Performance Trajectory ({isMonthly ? 'Jan - Oct 2024' : isWeekly ? 'Q4 Rolling Weeks' : 'Last 10 Days'})
            </h2>
          </div>

          {/* Granularity Switcher & Legends */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#f1f5f9] p-0.5 rounded text-[#565e74] text-xs">
              <button
                onClick={() => setGranularity('daily')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  granularity === 'daily'
                    ? 'bg-white text-[#2563eb] font-semibold shadow-sm'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setGranularity('weekly')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  granularity === 'weekly'
                    ? 'bg-white text-[#2563eb] font-semibold shadow-sm'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setGranularity('monthly')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  granularity === 'monthly'
                    ? 'bg-white text-[#2563eb] font-semibold shadow-sm'
                    : 'text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                Monthly
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs pl-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                <span className="text-[#0b1c30] font-medium text-xs">
                  {isMonthly ? 'Actual ($1.84M)' : 'Actual'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#64748b] border-dashed"></span>
                <span className="text-[#64748b] text-xs">
                  {isMonthly ? 'Target ($1.72M)' : 'Target'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Revenue Chart */}
        <div className="relative w-full h-64 mt-2 select-none">
          <svg className="w-full h-full" viewBox="0 0 760 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="40" y1="20" x2="740" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="65" x2="740" y2="65" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="110" x2="740" y2="110" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="155" x2="740" y2="155" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="200" x2="740" y2="200" stroke="#e2e8f0" strokeWidth="1" />

            {/* Y-Axis labels */}
            {isMonthly ? (
              <>
                <text x="32" y="24" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$2.0M</text>
                <text x="32" y="69" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$1.6M</text>
                <text x="32" y="114" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$1.2M</text>
                <text x="32" y="159" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$0.8M</text>
                <text x="32" y="202" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$0.4M</text>
              </>
            ) : isWeekly ? (
              <>
                <text x="32" y="24" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$520k</text>
                <text x="32" y="69" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$480k</text>
                <text x="32" y="114" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$440k</text>
                <text x="32" y="159" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$400k</text>
                <text x="32" y="202" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$350k</text>
              </>
            ) : (
              <>
                <text x="32" y="24" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$85k</text>
                <text x="32" y="69" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$75k</text>
                <text x="32" y="114" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$65k</text>
                <text x="32" y="159" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$55k</text>
                <text x="32" y="202" textAnchor="end" className="text-[10px] fill-[#64748b] font-tabular-data">$50k</text>
              </>
            )}

            {/* Target Dashed Line */}
            <path d={targetPath} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,4" />

            {/* Actual Gradient Fill */}
            <path d={areaPath} fill="url(#actualGradient)" />

            {/* Actual Solid Blue Line */}
            <path d={actualPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data point dots on Actual line */}
            {currentPoints.map((pt, idx) => (
              <g key={pt.label} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={pt.x}
                  cy={pt.actualY}
                  r={idx === currentPoints.length - 1 || hoveredIndex === idx ? 5 : 3.5}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth={idx === currentPoints.length - 1 || hoveredIndex === idx ? 3 : 2}
                  className="cursor-pointer transition-all"
                />
                {/* X-Axis text */}
                <text
                  x={pt.x}
                  y="215"
                  textAnchor="middle"
                  className={`text-[10px] font-tabular-data ${
                    idx === currentPoints.length - 1 ? 'font-bold fill-[#2563eb]' : 'fill-[#64748b]'
                  }`}
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Highlighting Pill Callout / Tooltip */}
          <div className="absolute top-2 right-4 bg-[#213145] text-white px-3 py-1.5 rounded shadow-lg pointer-events-none flex flex-col border border-slate-700">
            <span className="text-[11px] text-[#c3c6d7] font-medium">
              {activePoint.label} {isMonthly ? 'Peak' : 'Snapshot'}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-sm text-[#6ffbbe] font-tabular-data">
                ${activePoint.actual.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#6ffbbe] bg-[#007d55]/40 px-1 py-0.5 rounded font-bold">
                {(((activePoint.actual - activePoint.target) / activePoint.target) * 100).toFixed(1)}% ahead
              </span>
            </div>
            <span className="text-[10px] text-[#94a3b8] mt-0.5">
              Target was ${activePoint.target.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer KPI Run-Rate Stats */}
      <div className="mt-4 pt-3 bg-[#f8f9ff] rounded-lg p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border border-[#e2e8f0]/80">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-[#e5eeff] text-[#2563eb] material-symbols-outlined text-base">flag</span>
          <div>
            <span className="text-[10px] text-[#64748b] uppercase font-bold block leading-tight">Month Target</span>
            <span className="font-bold text-sm text-[#0b1c30] font-tabular-data">$2,100,000</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-emerald-50 text-[#007d55] material-symbols-outlined text-base">speed</span>
          <div>
            <span className="text-[10px] text-[#64748b] uppercase font-bold block leading-tight">Projected Run-rate</span>
            <span className="font-bold text-sm text-[#007d55] font-tabular-data">$2,052,000 (97.7%)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded bg-amber-100 text-amber-800 material-symbols-outlined text-base">trending_flat</span>
          <div>
            <span className="text-[10px] text-[#64748b] uppercase font-bold block leading-tight">Projected Gap</span>
            <span className="font-bold text-sm text-amber-800 font-tabular-data">-$48,000 to OAB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
