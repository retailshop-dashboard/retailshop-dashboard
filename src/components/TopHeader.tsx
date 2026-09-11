import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';

interface TopHeaderProps {
  lastSyncText: string;
  onManualSync: () => void;
  onSearchSelectShop?: (shopName: string) => void;
  user?: User | null;
  onSignInGoogle?: () => void;
  onSignOutGoogle?: () => void;
  onNavigateToGSheets?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  lastSyncText,
  onManualSync,
  onSearchSelectShop,
  user,
  onSignInGoogle,
  onSignOutGoogle,
  onNavigateToGSheets,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    {
      id: '1',
      title: 'East Harbor Center (E09) in Critical MIN Status',
      desc: 'Achieved 78.5% of MTD target ($109,900 / $140,000). Needs regional support.',
      time: '12m ago',
      urgent: true,
    },
    {
      id: '2',
      title: 'Google Sheets Automatic Sync Ready',
      desc: 'Bi-directional link configured. Connect your Google account to stream live POS logs.',
      time: '24m ago',
      urgent: false,
    },
    {
      id: '3',
      title: 'Highland Terminal Kiosk (H14) hit OAB benchmark',
      desc: '108.0% quota reached ($151,200), led by Elena Rostova.',
      time: '1h ago',
      urgent: false,
    },
  ];

  const quickSearchMatches = searchQuery.trim()
    ? [
        { code: 'C01', name: 'Central Megastore #01', agent: 'Alex Wong', region: 'Metro Hub', status: 'OAB' },
        { code: 'M02', name: 'Metro Plaza Flagship', agent: 'Sarah Chen', region: 'Metro Hub', status: 'OTB' },
        { code: 'H14', name: 'Highland Terminal Kiosk', agent: 'Elena Rostova', region: 'North', status: 'OAB' },
        { code: 'S03', name: 'South Bay Express', agent: 'Priya Patel', region: 'South Bay', status: 'GATE' },
        { code: 'E09', name: 'East Harbor Center', agent: 'Jason Miller', region: 'East', status: 'MIN' },
      ].filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.agent.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6">
      {/* Left Breadcrumbs & Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#565e74] text-xs">
          <span className="material-symbols-outlined text-[17px] text-[#2563eb]">hub</span>
          <span className="font-semibold text-[#0b1c30]">Enterprise Portal</span>
          <span className="material-symbols-outlined text-xs text-[#94a3b8]">chevron_right</span>
          <span className="font-medium text-[#565e74]">Agent Management</span>
        </div>
        <div className="h-4 w-px bg-[#e2e8f0]"></div>
        <div className="flex items-center gap-2 text-[#565e74] text-xs font-medium">
          <span className="material-symbols-outlined text-sm text-[#565e74]">schedule</span>
          <span>Wednesday, Oct 24, 2024</span>
          <span className="text-[#cbd5e1]">|</span>
          <span className="text-[#0b1c30] font-semibold">APAC Regional Hub</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-base text-[#94a3b8]">search</span>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="w-56 pl-8 pr-12 py-1.5 text-xs bg-[#f8f9ff] text-[#0b1c30] placeholder:text-[#94a3b8] rounded border border-[#e2e8f0] focus:outline-none focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all"
            placeholder="Search shops, agents, KPIs..."
            type="text"
          />
          <span className="absolute right-2 text-[10px] px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#2563eb] font-mono font-medium">
            ⌘K
          </span>

          {/* Search Dropdown Popup */}
          {searchOpen && quickSearchMatches.length > 0 && (
            <div className="absolute top-10 left-0 w-80 bg-white rounded-lg shadow-xl border border-[#e2e8f0] p-2 z-50 animate-in fade-in">
              <div className="text-[10px] uppercase font-bold text-[#64748b] px-2 py-1">Quick Matches</div>
              {quickSearchMatches.map((item) => (
                <button
                  key={item.code}
                  onMouseDown={() => {
                    if (onSearchSelectShop) onSearchSelectShop(item.name);
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-[#f1f5f9] text-left text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2563eb] bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                      {item.code}
                    </span>
                    <div>
                      <div className="font-semibold text-[#0b1c30]">{item.name}</div>
                      <div className="text-[11px] text-[#64748b]">
                        {item.agent} · {item.region}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.status === 'OAB'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'OTB'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'GATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* G-Sheets Synced Pill */}
        <button
          onClick={() => {
            if (onNavigateToGSheets) {
              onNavigateToGSheets();
            } else {
              onManualSync();
            }
          }}
          title="Click to open Google Sheets Live Sync Hub"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5eeff] hover:bg-[#dbe1ff] text-[#0b1c30] text-xs transition-colors cursor-pointer border border-[#c3c6d7]/30"
        >
          <span className="w-2 h-2 rounded-full bg-[#007d55] animate-pulse"></span>
          <span className="font-medium text-[11px]">{lastSyncText}</span>
          <span className="material-symbols-outlined text-[13px] text-[#007d55]">table_chart</span>
        </button>

        {/* Google Workspace Sign-In / Account Indicator */}
        {!user ? (
          onSignInGoogle && (
            <div className="hidden sm:block">
              <GoogleSignInButton
                onClick={onSignInGoogle}
                text="Connect Sheets"
                className="scale-90 origin-right"
              />
            </div>
          )
        ) : (
          <div
            onClick={onNavigateToGSheets}
            className="cursor-pointer hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium"
            title={`Connected to Google Workspace as ${user.email}`}
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">cloud_done</span>
            <span className="truncate max-w-[100px]">{user.displayName || user.email?.split('@')[0]}</span>
          </div>
        )}

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="relative p-1.5 rounded-full text-[#565e74] hover:bg-[#f1f5f9] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-lg shadow-xl border border-[#e2e8f0] p-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                <span className="font-bold text-[#0b1c30]">Alerts & System Logs</span>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-[#2563eb] hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 mt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded text-left transition-colors ${
                      n.urgent ? 'bg-red-50/70 border-l-2 border-red-500' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0b1c30] leading-tight">{n.title}</span>
                      <span className="text-[10px] text-[#94a3b8] shrink-0 ml-1">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#565e74] mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#e2e8f0]"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 py-1 rounded hover:bg-slate-50 transition-colors text-left"
          >
            {user?.photoURL ? (
              <img
                alt={user.displayName || 'Google Profile'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c3c6d7]"
                src={user.photoURL}
                referrerPolicy="no-referrer"
              />
            ) : (
              <img
                alt="Marcus Vance Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c3c6d7]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqipK6IGAmk6E6j8c088UUxvidtfJr2GwJTW63HnAvigC1XQlxoE9nuIyvWJTlyJtJnKYIW4RkoT9YMNJZw4KzrcEgG2I2ShZtmXnR7XRnIE-XlWfvbqAAwoJ3NsBXp-8WRpXDdKAIs6QnngR5cYTNi1RKeEx6Llq4sCJXO7_6ws_8z1ocfPiau5d7SO0BLIGVMNl2VxRLvt2Gif0XZq_vie9FeAwQSYF8P7R5lU70THEY2YNmSRgUEg"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                <span className="font-semibold text-xs text-[#0b1c30] leading-none truncate max-w-[110px]">
                  {user ? user.displayName || 'Google User' : 'Marcus Vance'}
                </span>
                <span className="material-symbols-outlined text-xs text-[#565e74]">arrow_drop_down</span>
              </div>
              <span className="text-[10px] text-[#565e74] mt-0.5">
                {user ? 'Authenticated' : 'Regional Director'}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#e2e8f0] py-1.5 z-50 text-xs animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#f1f5f9]">
                <div className="font-semibold text-[#0b1c30]">
                  {user?.displayName || 'Marcus Vance'}
                </div>
                <div className="text-[11px] text-[#64748b] truncate">
                  {user?.email || 'marcus.vance@telecom.corp'}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                  {user ? 'Google Workspace Connected' : 'APAC Super Admin'}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onNavigateToGSheets) onNavigateToGSheets();
                  }}
                  className="w-full px-3 py-1.5 text-left text-[#334155] hover:bg-[#f8f9ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-emerald-600">table_chart</span>
                  Google Sheets Settings
                </button>
                {user ? (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      if (onSignOutGoogle) onSignOutGoogle();
                    }}
                    className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Sign Out Google Account
                  </button>
                ) : (
                  onSignInGoogle && (
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        onSignInGoogle();
                      }}
                      className="w-full px-3 py-1.5 text-left text-[#2563eb] hover:bg-blue-50 flex items-center gap-2 font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">login</span>
                      Sign in with Google
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
