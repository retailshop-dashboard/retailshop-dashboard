import React from 'react';

interface SubNavBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const SubNavBar: React.FC<SubNavBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance-table', label: 'Performance Table' },
    { id: 'actual-vs-kpi', label: 'Actual vs KPI' },
    { id: 'kpi-config', label: 'KPI Config' },
    { id: 'csv-import', label: 'CSV Import' },
    { id: 'monthly-history', label: 'Monthly History' },
    { id: 'customers', label: 'Customers' },
    { id: 'g-sheets-sync', label: 'G-Sheets Sync' },
    { id: 'permissions', label: 'Permissions' },
  ];

  return (
    <div className="w-full bg-white px-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)] border-b border-[#e2e8f0]">
      <nav className="flex items-center gap-6 overflow-x-auto text-xs sm:text-sm">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`py-3 whitespace-nowrap transition-colors text-left border-b-2 font-medium ${
                isActive
                  ? 'text-[#004ac6] border-[#004ac6] font-semibold'
                  : 'text-[#434655] border-transparent hover:text-[#0b1c30]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
