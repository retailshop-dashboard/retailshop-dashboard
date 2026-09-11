import React from 'react';
import { ShopItem } from '../types';

interface ShopDetailModalProps {
  shop: ShopItem | null;
  onClose: () => void;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ shop, onClose }) => {
  if (!shop) return null;

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

  const serviceBreakdown = [
    { name: 'FWBB Broadband', amount: shop.serviceMix.fwbb, share: '28%' },
    { name: 'eTopup - Retailops', amount: shop.serviceMix.eTopup, share: '24%' },
    { name: 'CPE 5G Routers', amount: shop.serviceMix.cpe, share: '16%' },
    { name: 'Blank SIM Packs', amount: shop.serviceMix.blankSim, share: '12%' },
    { name: 'Change SIM (Replacement)', amount: shop.serviceMix.changeSim, share: '8%' },
    { name: 'MDN VIP Reservation', amount: shop.serviceMix.mdn, share: '7%' },
    { name: 'NA (Accessories & Addons)', amount: shop.serviceMix.na, share: '5%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#f1f5f9] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563eb] font-bold text-lg border border-blue-200">
              {shop.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-[#0b1c30]">{shop.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    shop.status === 'OAB'
                      ? 'bg-emerald-100 text-emerald-800'
                      : shop.status === 'OTB'
                      ? 'bg-blue-100 text-blue-800'
                      : shop.status === 'GATE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {shop.status}
                </span>
              </div>
              <p className="text-xs text-[#565e74] mt-0.5 flex items-center gap-2">
                <span>{shop.address}, {shop.city}</span>
                <span>•</span>
                <span className="font-medium text-[#2563eb]">{shop.region}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">Revenue MTD</span>
              <span className="text-base font-bold text-[#0b1c30] font-tabular-data">
                {formatCurrency(shop.revenueMtd)}
              </span>
              <span className="text-[10px] text-[#64748b] block mt-0.5">Target: {formatCurrency(shop.target)}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">Quota Achieved</span>
              <span className="text-base font-bold text-[#2563eb] font-tabular-data">
                {shop.achievementPct}%
              </span>
              <div className="w-full bg-[#e2e8f0] rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-[#2563eb] h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, shop.achievementPct)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">Active Subs</span>
              <span className="text-base font-bold text-[#0b1c30] font-tabular-data">
                {shop.activeSubs.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#007d55] block mt-0.5 font-medium">+140 this month</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">FWBB Top Up</span>
              <span className="text-base font-bold text-[#0b1c30] font-tabular-data">
                {formatCurrency(shop.fwbbTopUp)}
              </span>
              <span className="text-[10px] text-[#64748b] block mt-0.5">{shop.grossAds} Gross Ads</span>
            </div>
          </div>

          {/* Lead Agent and Roster */}
          <div className="p-3.5 rounded-lg border border-[#e2e8f0] bg-white">
            <h4 className="font-semibold text-xs text-[#0b1c30] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#2563eb]">badge</span>
              Assigned Personnel & Agent Roster
            </h4>
            <div className="flex items-center justify-between p-2.5 rounded bg-[#f8f9ff] border border-[#e2e8f0]/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs">
                  {shop.leadAgent.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0b1c30]">{shop.leadAgent} (Lead Agent)</div>
                  <div className="text-[11px] text-[#64748b]">Agent ID: {shop.agentCode} • Direct Sales Lead</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#007d55] bg-emerald-50 px-2 py-0.5 rounded">
                Active On Duty
              </span>
            </div>
            <div className="mt-2 text-[11px] text-[#64748b] flex items-center justify-between px-1">
              <span>{shop.agentCount} Field Sales Agents assigned to this outlet</span>
              <span className="text-[#2563eb] hover:underline cursor-pointer">View full agent roster</span>
            </div>
          </div>

          {/* Service Mix Breakdown */}
          <div className="rounded-lg border border-[#e2e8f0] overflow-hidden">
            <div className="p-3 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between">
              <h4 className="font-semibold text-xs text-[#0b1c30] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#007d55]">pie_chart</span>
                Outlet Product Mix Breakdown
              </h4>
              <span className="text-[11px] text-[#64748b]">7 Revenue Categories</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#f8f9ff] text-[10px] text-[#64748b] uppercase border-b border-[#e2e8f0]">
                <tr>
                  <th className="py-2 px-3">Product / Service</th>
                  <th className="py-2 px-3 text-right">Share</th>
                  <th className="py-2 px-3 text-right">Amount (MTD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {serviceBreakdown.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 font-medium text-[#0b1c30]">{item.name}</td>
                    <td className="py-1.5 px-3 text-right text-[#64748b]">{item.share}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-[#0b1c30] font-tabular-data">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#f1f5f9] flex items-center justify-between">
          <button
            onClick={() => {
              alert(`Exporting operational audit report for ${shop.name}...`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#0b1c30] hover:bg-[#e2e8f0] border border-[#e2e8f0] text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Print Shop Audit
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#2563eb] text-white hover:bg-[#1d4ed8] text-xs font-semibold shadow-sm transition-colors"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
};
