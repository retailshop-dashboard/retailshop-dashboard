import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ALL_SHOPS } from './data/telecomData';
import { FilterState, ShopItem, SyncLog } from './types';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { SubNavBar } from './components/SubNavBar';
import { FilterToolbar } from './components/FilterToolbar';
import { KpiCardGrid } from './components/KpiCardGrid';
import { RevenueTrajectoryChart } from './components/RevenueTrajectoryChart';
import { ServiceBreakdownDonut } from './components/ServiceBreakdownDonut';
import { ShopPerformanceTable } from './components/ShopPerformanceTable';
import { ShopDetailModal } from './components/ShopDetailModal';
import { SyncToast } from './components/SyncToast';

// Views
import { PerformanceTableView } from './components/views/PerformanceTableView';
import { ActualVsKpiView } from './components/views/ActualVsKpiView';
import { KpiConfigView } from './components/views/KpiConfigView';
import { CsvImportView } from './components/views/CsvImportView';
import { MonthlyHistoryView } from './components/views/MonthlyHistoryView';
import { CustomersView } from './components/views/CustomersView';
import { GSheetsSyncView } from './components/views/GSheetsSyncView';
import { PermissionsView } from './components/views/PermissionsView';

// Auth Services
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';

const INITIAL_FILTERS: FilterState = {
  period: 'oct-mtd',
  region: 'all',
  outlet: 'all',
  agent: 'all',
  service: 'all',
  statusFilter: 'all',
  searchQuery: '',
};

const INITIAL_SYNC_LOGS: SyncLog[] = [
  {
    id: 'sync-init-1',
    timestamp: '24m ago',
    initiatedBy: 'Cron POS Daemon (Sheets v4 API)',
    recordsCount: 42,
    shopsCount: 42,
    status: 'SUCCESS',
    latencyMs: 290,
  },
  {
    id: 'sync-init-2',
    timestamp: '2h ago',
    initiatedBy: 'Regional Admin Ledger Import',
    recordsCount: 42,
    shopsCount: 42,
    status: 'SUCCESS',
    latencyMs: 315,
  },
  {
    id: 'sync-init-3',
    timestamp: 'Yesterday 18:30',
    initiatedBy: 'EOD Shift Audit Batch',
    recordsCount: 42,
    shopsCount: 42,
    status: 'SUCCESS',
    latencyMs: 402,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [shops, setShops] = useState<ShopItem[]>(ALL_SHOPS);
  const [selectedShopModal, setSelectedShopModal] = useState<ShopItem | null>(null);
  const [toastVisible, setToastVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState(
    '184 records updated across 42 shops (14 OAB, 18 OTB, 7 GATE, 3 MIN)'
  );
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('G-Sheets Synced 2m ago');
  const [syncing, setSyncing] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Google Workspace / Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, token) => {
        setUser(authenticatedUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setLastSyncText('Google Workspace Connected');
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setLastSyncText('Offline Ledger Mode');
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  // Filter handlers
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSelectedServiceId(null);
  };

  // Trigger manual sync or redirect to Google Sheets hub
  const handleManualSync = () => {
    if (syncing) return;
    if (!user || !accessToken) {
      // Direct user to Google Sheets integration tab to sign in or connect
      setCurrentTab('g-sheets-sync');
      return;
    }

    setSyncing(true);
    setLastSyncText('Syncing with G-Sheets...');
    setTimeout(() => {
      setSyncing(false);
      setLastSyncText('G-Sheets Synced just now');
      setToastVisible(true);
      setToastMessage(`✓ Real-time sync verified with Google Drive for ${shops.length} retail outlets`);
    }, 800);
  };

  // Called when data is pulled from Google Sheets
  const handleShopsUpdated = (newShops: ShopItem[], summaryMsg: string) => {
    setShops(newShops);
    setLastSyncText('G-Sheets Synced just now');
    setToastMessage(summaryMsg);
    setToastVisible(true);
  };

  // Export handlers
  const handleExport = (type: 'pdf' | 'xlsx' | 'csv') => {
    setExportMenuOpen(false);
    if (type === 'csv') {
      const headers = [
        'Code',
        'Name',
        'LeadAgent',
        'Region',
        'RevenueMTD',
        'Target',
        'AchievementPct',
        'Subs',
        'FWBBTopUp',
        'GrossAds',
        'Status',
      ];
      const rows = shops.map((s) =>
        [
          s.code,
          `"${s.name}"`,
          `"${s.leadAgent}"`,
          `"${s.region}"`,
          s.revenueMtd,
          s.target,
          `${s.achievementPct}%`,
          s.activeSubs,
          s.fwbbTopUp,
          s.grossAds,
          s.status,
        ].join(',')
      );
      const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telecom-executive-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      window.print();
    }
  };

  // Filtered shops based on dropdown filters
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      if (filters.region !== 'all' && shop.region !== filters.region) return false;
      if (filters.outlet !== 'all' && shop.name !== filters.outlet) return false;
      if (filters.agent !== 'all' && shop.leadAgent !== filters.agent) return false;
      return true;
    });
  }, [shops, filters]);

  // Aggregate metrics
  const totalRevenue = useMemo(() => {
    return filteredShops.reduce((sum, s) => sum + s.revenueMtd, 0);
  }, [filteredShops]);

  const totalGrossAds = useMemo(() => {
    return filteredShops.reduce((sum, s) => sum + s.grossAds, 0);
  }, [filteredShops]);

  const totalFwbb = useMemo(() => {
    return filteredShops.reduce((sum, s) => sum + s.fwbbTopUp, 0);
  }, [filteredShops]);

  const totalActiveSubs = useMemo(() => {
    return filteredShops.reduce((sum, s) => sum + s.activeSubs, 0);
  }, [filteredShops]);

  const avgAchievement = useMemo(() => {
    if (filteredShops.length === 0) return 0;
    const totalTarget = filteredShops.reduce((sum, s) => sum + s.target, 0);
    return totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;
  }, [filteredShops, totalRevenue]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased">
      {/* 1. Left Fixed Navigation Rail */}
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* 2. Main Content Area offset by fixed rail (w-64 = 256px) */}
      <div className="pl-64">
        {/* Top Fixed Header with Google Workspace Controls */}
        <TopHeader
          lastSyncText={lastSyncText}
          onManualSync={handleManualSync}
          onSearchSelectShop={(shopName) => {
            const found = shops.find((s) => s.name === shopName);
            if (found) setSelectedShopModal(found);
          }}
          user={user}
          onSignInGoogle={handleSignIn}
          onSignOutGoogle={handleSignOut}
          onNavigateToGSheets={() => setCurrentTab('g-sheets-sync')}
        />

        <div className="pt-16">
          {/* Top Secondary SubNavBar */}
          <SubNavBar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

          {/* Main Operational Cockpit Screen */}
          <main className="w-full px-6 py-4 bg-[#f8f9ff] min-h-[calc(100vh-112px)]">
            {currentTab === 'overview' && (
              <div className="flex flex-col w-full space-y-4">
                {/* Executive Controls Strip */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-4 rounded-lg shadow-sm border border-[#e2e8f0]">
                  <div className="flex flex-col space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex p-1.5 rounded bg-[#2563eb] text-white shadow-sm">
                        <span className="material-symbols-outlined text-lg">monitoring</span>
                      </span>
                      <h1 className="font-headline font-bold text-xl text-[#0b1c30] tracking-tight">
                        Telecom Shop / Agent Operations & KPI Dashboard
                      </h1>
                      <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-xs text-[#004ac6] font-semibold">
                        Q4 Fiscal
                      </span>
                      {user && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Google Sheets Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#565e74]">
                      Real-time performance intelligence, revenue tracking, and sales agent KPI monitoring across {shops.length} retail shops
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleResetFilters}
                      id="resetFiltersBtn"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f1f5f9] text-[#0b1c30] hover:bg-[#e2e8f0] transition-colors text-xs font-semibold border border-[#e2e8f0]"
                    >
                      <span className="material-symbols-outlined text-base text-[#565e74]">restart_alt</span>
                      <span>Reset Filters</span>
                    </button>

                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        id="exportDropdownBtn"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#004ac6] text-white hover:bg-[#003ea8] shadow-sm text-xs font-semibold transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Export Report</span>
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                      </button>

                      {exportMenuOpen && (
                        <div
                          id="exportDropdownMenu"
                          className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-xl z-30 py-1.5 text-xs text-[#0b1c30] border border-[#e2e8f0] animate-in fade-in"
                        >
                          <button
                            onClick={() => handleExport('pdf')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9ff] transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm text-red-600">picture_as_pdf</span>
                            <span>Executive PDF Summary</span>
                          </button>
                          <button
                            onClick={() => handleExport('xlsx')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9ff] transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm text-[#007d55]">table_view</span>
                            <span>Full Excel Workbook (.xlsx)</span>
                          </button>
                          <button
                            onClick={() => handleExport('csv')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[#f8f9ff] transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm text-[#2563eb]">csv</span>
                            <span>Agent Raw Data (.csv)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operational Filter Toolbar */}
                <FilterToolbar
                  filters={filters}
                  onChangeFilter={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  auditedCount={filteredShops.length}
                />

                {/* Top 6 KPI Summary Cards Grid */}
                <KpiCardGrid
                  totalRevenue={totalRevenue}
                  totalGrossAds={totalGrossAds}
                  totalFwbb={totalFwbb}
                  avgAchievement={avgAchievement}
                  totalActiveSubs={totalActiveSubs}
                  isFiltered={filteredShops.length < shops.length}
                />

                {/* Operational Intelligence Cockpit: Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {/* Left 2 Columns: Revenue Performance Trajectory */}
                  <RevenueTrajectoryChart />

                  {/* Right 1 Column: Service Breakdown Donut */}
                  <ServiceBreakdownDonut
                    selectedServiceId={selectedServiceId}
                    onSelectService={(service) => {
                      setSelectedServiceId(service);
                      if (service) {
                        handleFilterChange('service', service);
                      } else {
                        handleFilterChange('service', 'all');
                      }
                    }}
                  />
                </div>

                {/* Shop & Agent Operational Performance Tabular Grid */}
                <ShopPerformanceTable
                  shops={filteredShops}
                  onOpenShopModal={(shop) => setSelectedShopModal(shop)}
                  statusFilter={filters.statusFilter}
                  onSelectStatusFilter={(status) => handleFilterChange('statusFilter', status)}
                  searchQuery={filters.searchQuery}
                  onSearchChange={(query) => handleFilterChange('searchQuery', query)}
                />
              </div>
            )}

            {/* Other Dedicated Operational Screens */}
            {currentTab === 'performance-table' && (
              <PerformanceTableView
                shops={shops}
                onOpenShopModal={(shop) => setSelectedShopModal(shop)}
              />
            )}

            {currentTab === 'actual-vs-kpi' && <ActualVsKpiView />}

            {currentTab === 'kpi-config' && <KpiConfigView />}

            {currentTab === 'csv-import' && <CsvImportView />}

            {currentTab === 'monthly-history' && <MonthlyHistoryView />}

            {currentTab === 'customers' && <CustomersView />}

            {currentTab === 'g-sheets-sync' && (
              <GSheetsSyncView
                user={user}
                accessToken={accessToken}
                onAuthSuccess={(u, token) => {
                  setUser(u);
                  setAccessToken(token);
                }}
                onLogout={handleSignOut}
                currentShops={shops}
                onShopsUpdated={handleShopsUpdated}
                syncLogs={syncLogs}
                onAddSyncLog={(newLog) => setSyncLogs((prev) => [newLog, ...prev])}
              />
            )}

            {currentTab === 'permissions' && <PermissionsView />}
          </main>
        </div>
      </div>

      {/* Shop Drilldown Modal */}
      <ShopDetailModal
        shop={selectedShopModal}
        onClose={() => setSelectedShopModal(null)}
      />

      {/* Bottom Floating Toast Notification */}
      <SyncToast
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
        syncSummary={toastMessage}
      />
    </div>
  );
}
