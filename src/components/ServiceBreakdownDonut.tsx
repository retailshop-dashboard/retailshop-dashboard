import React from 'react';
import { CORE_SERVICES } from '../data/telecomData';

interface ServiceBreakdownDonutProps {
  selectedServiceId: string | null;
  onSelectService: (serviceName: string | null) => void;
}

export const ServiceBreakdownDonut: React.FC<ServiceBreakdownDonutProps> = ({
  selectedServiceId,
  onSelectService,
}) => {
  // SVG Circumference for radius 38 is 2 * PI * 38 = 238.761
  const circumference = 238.76;

  // Calculate segment offsets
  let accumulatedOffset = 0;
  const segments = CORE_SERVICES.map((s) => {
    const dash = (s.sharePct / 100) * circumference;
    const offset = -accumulatedOffset;
    accumulatedOffset += dash;
    return {
      ...s,
      dash,
      offset,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-1 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007d55]"></span>
            <h2 className="font-headline font-semibold text-base text-[#0b1c30]">Service Breakdown</h2>
          </div>
          <span className="text-xs text-[#565e74]">7 Revenue Streams</span>
        </div>
        <p className="text-xs text-[#565e74] my-2">Click any segment to isolate retail performance</p>

        {/* Donut Visualization SVG with Center Totals */}
        <div className="relative flex items-center justify-center my-2">
          <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />

            {/* Slices */}
            {segments.map((seg) => {
              const isSelected = selectedServiceId === seg.name;
              return (
                <circle
                  key={seg.id}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isSelected ? 16 : 14}
                  strokeDasharray={`${seg.dash} ${circumference}`}
                  strokeDashoffset={seg.offset}
                  onClick={() => onSelectService(isSelected ? null : seg.name)}
                  className="hover:opacity-80 cursor-pointer transition-all"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Central Stats Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-[#64748b]">Total MTD</span>
            <span className="font-headline font-bold text-xl text-[#0b1c30] font-tabular-data leading-tight">
              $1.84M
            </span>
            <span className="text-[10px] text-[#007d55] font-bold">100% Attributed</span>
          </div>
        </div>

        {/* 7 Service List Items */}
        <div className="space-y-1 mt-2">
          {CORE_SERVICES.map((service) => {
            const isSelected = selectedServiceId === service.name;
            return (
              <div
                key={service.id}
                onClick={() => onSelectService(isSelected ? null : service.name)}
                className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer text-xs ${
                  isSelected ? 'bg-blue-50 ring-1 ring-blue-400 font-semibold' : 'hover:bg-[#f1f5f9]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: service.color }}></span>
                  <span className="text-[#0b1c30] truncate">{service.name}</span>
                </div>
                <div className="flex items-center gap-2 font-tabular-data shrink-0">
                  <span className="text-[#64748b] text-[11px]">{service.sharePct}%</span>
                  <span className="font-bold text-[#0b1c30] text-xs">
                    ${service.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 text-center border-t border-[#f1f5f9]">
        <button
          onClick={() => onSelectService(null)}
          className="text-[11px] text-[#565e74] bg-[#f8f9ff] hover:bg-[#e2e8f0] px-2.5 py-1 rounded inline-flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-xs text-[#2563eb]">touch_app</span>
          {selectedServiceId ? `Active Filter: ${selectedServiceId} (Click to clear)` : 'Tap service to isolate dashboard scope'}
        </button>
      </div>
    </div>
  );
};
