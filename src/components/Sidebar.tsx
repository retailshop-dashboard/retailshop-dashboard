import React from 'react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#213145] z-50 flex flex-col justify-between overflow-y-auto border-r border-[#334155]/60 select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-[#213145] border-b border-[#334155]/40">
          <div className="flex items-center gap-2.5">
            <img
              alt="Telecom Business Portal Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XPUPPOhFE26K2q0fQiQcPBLqugpn4309hfC9Pm5Nm5kkQMNGrVvX7RdU8143Vdcn_rAuakNF77NIFKh1ldur9KLnRbjyXPbY-WUtpASSKlKucVZlBpWG2lfb8i0ja9yRsMRJ2H5QxlpYh73UXssamA4UYeqBDEGaXn-wDlZMS-v83nQpgI9z-dMLoVUaLGhTzzdBHHfiSEe_DgVDl_v_q5YtBomUr5DhPzxazTAo2Q5_q8_SaMpSDE-Ger"
            />
            <div className="flex flex-col">
              <span className="font-headline font-semibold text-base text-[#eaf1ff] leading-none">TelePortal</span>
              <span className="text-[11px] font-semibold text-[#c3c6d7] tracking-wider uppercase mt-1">
                Operations Hub
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#007d55] text-[#bdffdb] text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse"></span>
            Live Sync
          </span>
        </div>

        {/* Regional Unit Selector Strip */}
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f172a]/60 rounded text-[#eaf1ff] text-[11px]">
            <span className="uppercase text-[#c3c6d7] font-semibold tracking-wider">Regional Unit:</span>
            <span className="font-semibold text-white flex items-center gap-1">
              APAC-East Hub
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-2 space-y-1 pb-4 text-[13px]">
          {/* Group 1: Core Operations */}
          <div className="pt-2">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              Core Operations
            </span>
          </div>

          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'overview'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[19px]">dashboard</span>
              <span>Overview</span>
            </div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                currentTab === 'overview' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-200'
              }`}
            >
              KPI 98%
            </span>
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">storefront</span>
            <span>Shop Revenue</span>
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">trending_up</span>
            <span>Gross Ads</span>
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">router</span>
            <span>Top Up FWBB</span>
          </button>

          <button
            onClick={() => onSelectTab('overview')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">pie_chart</span>
            <span>Service Breakdown</span>
          </button>

          {/* Group 2: Analytics & Hit Rates */}
          <div className="pt-3">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              Analytics & Hit Rates
            </span>
          </div>

          <button
            onClick={() => onSelectTab('performance-table')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'performance-table'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[19px]">leaderboard</span>
              <span>Shop / Agent Performance</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#007d55] text-white">OTB</span>
          </button>

          <button
            onClick={() => onSelectTab('kpi-config')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">calculate</span>
            <span>KPI Calculation</span>
          </button>

          <button
            onClick={() => onSelectTab('actual-vs-kpi')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">fact_check</span>
            <span>KPI Hit Report</span>
          </button>

          <button
            onClick={() => onSelectTab('monthly-history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'monthly-history'
                ? 'bg-[#2563eb] text-white font-semibold'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">history</span>
            <span>Monthly KPI History</span>
          </button>

          <button
            onClick={() => onSelectTab('csv-import')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'csv-import'
                ? 'bg-[#2563eb] text-white font-semibold'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">upload_file</span>
            <span>Import CSV File</span>
          </button>

          {/* Group 3: Performance Management */}
          <div className="pt-3">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              Performance Management
            </span>
          </div>

          <button
            onClick={() => onSelectTab('actual-vs-kpi')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'actual-vs-kpi'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[19px]">compare_arrows</span>
              <span>Actual vs KPI</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">Active</span>
          </button>

          <button
            onClick={() => onSelectTab('csv-import')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">publish</span>
            <span>Upload KPI for Shop</span>
          </button>

          <button
            onClick={() => onSelectTab('actual-vs-kpi')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">rule</span>
            <span>KPI Status</span>
          </button>

          <button
            onClick={() => onSelectTab('kpi-config')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'kpi-config'
                ? 'bg-[#2563eb] text-white font-semibold'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
            <span>KPI Configuration</span>
          </button>

          {/* Group 4: Subscriber Management */}
          <div className="pt-3">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              Subscriber Management
            </span>
          </div>

          <button
            onClick={() => onSelectTab('customers')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'customers'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[19px]">group</span>
              <span>Customers Registry</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-white">124k</span>
          </button>

          <button
            onClick={() => onSelectTab('customers')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">person_add</span>
            <span>Sign Up Pipeline</span>
          </button>

          <button
            onClick={() => onSelectTab('customers')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">payments</span>
            <span>Top Up Ingestion</span>
          </button>

          <button
            onClick={() => onSelectTab('customers')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[19px]">pending_actions</span>
            <span>Pending Payment</span>
          </button>

          {/* Group 5: System Administration */}
          <div className="pt-3">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
              System Administration
            </span>
          </div>

          <button
            onClick={() => onSelectTab('g-sheets-sync')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'g-sheets-sync'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[19px]">sync_alt</span>
              <span>Google Sheets Sync</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          <button
            onClick={() => onSelectTab('permissions')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
              currentTab === 'permissions'
                ? 'bg-[#2563eb] text-white font-semibold shadow-sm'
                : 'text-[#eaf1ff] hover:bg-slate-700/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">security</span>
            <span>Permissions</span>
          </button>
        </nav>
      </div>

      {/* Engine Status Bottom Card */}
      <div className="p-3 bg-[#213145] border-t border-[#334155]/40">
        <div className="p-2.5 rounded bg-[#0f172a]/70 flex items-center justify-between text-[#eaf1ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-400">network_ping</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-white leading-tight">Engine Status</span>
              <span className="text-[10px] text-[#94a3b8]">All NOC Nodes Up</span>
            </div>
          </div>
          <span className="font-tabular-data text-xs text-emerald-400 font-bold">99.98%</span>
        </div>
      </div>
    </aside>
  );
};
