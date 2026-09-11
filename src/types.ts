export type KPIStatus = 'OAB' | 'OTB' | 'GATE' | 'MIN';

export type Region = 'Metro Hub' | 'North' | 'South Bay' | 'East';

export interface ShopItem {
  id: string;
  code: string;
  name: string;
  leadAgent: string;
  agentCode: string;
  agentCount: number;
  region: Region;
  revenueMtd: number;
  target: number;
  achievementPct: number;
  activeSubs: number;
  fwbbTopUp: number;
  grossAds: number;
  status: KPIStatus;
  city: string;
  address: string;
  serviceMix: {
    fwbb: number;
    eTopup: number;
    cpe: number;
    blankSim: number;
    changeSim: number;
    mdn: number;
    na: number;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  sharePct: number;
  revenue: number;
  color: string;
  icon: string;
  growth: string;
}

export interface MonthlyTrajectory {
  month: string;
  actual: number;
  target: number;
  isMtd?: boolean;
}

export interface FilterState {
  period: string;
  region: string;
  outlet: string;
  agent: string;
  service: string;
  statusFilter: string;
  searchQuery: string;
}

export interface KPIThresholds {
  oabMin: number; // >= 100%
  otbMin: number; // >= 90%
  gateMin: number; // >= 80%
  minUnder: number; // < 80%
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  recordsCount: number;
  shopsCount?: number;
  status: 'SUCCESS' | 'SYNCING' | 'ERROR';
  latencyMs: number;
  initiatedBy: string;
}

export type SyncLog = SyncLogEntry;

export interface CustomerRecord {
  id: string;
  name: string;
  accountNumber: string;
  serviceType: 'FWBB Broadband' | 'Postpaid SIM' | 'eTopup Retailer' | 'CPE 5G Business';
  status: 'Active' | 'Pending' | 'Grace Period' | 'Suspended';
  arpu: number;
  assignedShop: string;
  registeredDate: string;
}
