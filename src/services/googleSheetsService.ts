import { ShopItem, KPIStatus, Region } from '../types';

export interface DriveSpreadsheet {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface SheetTabInfo {
  sheetId: number;
  title: string;
}

// Extract spreadsheet ID from either a raw ID or full Google Sheets URL
export const extractSpreadsheetId = (input: string): string => {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

// 1. Fetch Google Sheets in user's Google Drive
export const fetchDriveSpreadsheets = async (
  accessToken: string
): Promise<DriveSpreadsheet[]> => {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=15`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch spreadsheets from Google Drive: ${errorText}`);
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink,
  }));
};

// 2. Fetch sheet tabs metadata (Avoid hardcoding sheet names)
export const fetchSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheets: SheetTabInfo[] }> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=properties.title,sheets.properties(sheetId,title)`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to read spreadsheet metadata: ${errorText}`);
  }

  const data = await res.json();
  const sheets: SheetTabInfo[] = (data.sheets || []).map((s: any) => ({
    sheetId: s.properties.sheetId,
    title: s.properties.title,
  }));

  return {
    title: data.properties?.title || 'Untitled Spreadsheet',
    sheets,
  };
};

// 3. Read sheet values
export const fetchSheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<string[][]> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to read sheet cells (${range}): ${errorText}`);
  }

  const data = await res.json();
  return data.values || [];
};

// 4. Parse rows into ShopItem models
export const parseSheetRowsToShops = (rows: string[][], fallbackShops: ShopItem[]): ShopItem[] => {
  if (!rows || rows.length < 2) {
    return fallbackShops;
  }

  const headers = rows[0].map((h) => (h || '').toLowerCase().trim());
  const codeIdx = headers.findIndex((h) => h.includes('code'));
  const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('shop'));
  const agentIdx = headers.findIndex((h) => h.includes('agent'));
  const regionIdx = headers.findIndex((h) => h.includes('region'));
  const revIdx = headers.findIndex((h) => h.includes('rev'));
  const targetIdx = headers.findIndex((h) => h.includes('target'));
  const subsIdx = headers.findIndex((h) => h.includes('sub'));
  const fwbbIdx = headers.findIndex((h) => h.includes('fwbb'));
  const adsIdx = headers.findIndex((h) => h.includes('ads') || h.includes('gross'));
  const statusIdx = headers.findIndex((h) => h.includes('status'));

  const parsedShops: ShopItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row.some((cell) => cell.trim().length > 0)) {
      continue;
    }

    const fallback = fallbackShops[parsedShops.length] || fallbackShops[0];
    const code = codeIdx !== -1 && row[codeIdx] ? row[codeIdx].trim() : fallback.code;
    const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : fallback.name;
    const leadAgent = agentIdx !== -1 && row[agentIdx] ? row[agentIdx].trim() : fallback.leadAgent;
    const VALID_REGIONS: Region[] = ['Metro Hub', 'North', 'South Bay', 'East'];
    const rowRegion = regionIdx !== -1 && row[regionIdx] ? (row[regionIdx].trim() as Region) : fallback.region;
    const region: Region = VALID_REGIONS.includes(rowRegion) ? rowRegion : fallback.region;

    const parseNum = (val: string | undefined, defaultNum: number) => {
      if (!val) return defaultNum;
      const clean = val.replace(/[^0-9.-]/g, '');
      const n = Number(clean);
      return isNaN(n) ? defaultNum : n;
    };

    const revenueMtd = parseNum(row[revIdx], fallback.revenueMtd);
    const target = parseNum(row[targetIdx], fallback.target);
    const activeSubs = parseNum(row[subsIdx], fallback.activeSubs);
    const fwbbTopUp = parseNum(row[fwbbIdx], fallback.fwbbTopUp);
    const grossAds = parseNum(row[adsIdx], fallback.grossAds);

    const achievementPct = target > 0 ? Number(((revenueMtd / target) * 100).toFixed(1)) : fallback.achievementPct;

    let status: KPIStatus = 'OTB';
    if (statusIdx !== -1 && row[statusIdx]) {
      const s = row[statusIdx].toUpperCase().trim();
      if (s === 'OAB' || s === 'OTB' || s === 'GATE' || s === 'MIN') {
        status = s as KPIStatus;
      } else {
        status = achievementPct >= 100 ? 'OAB' : achievementPct >= 90 ? 'OTB' : achievementPct >= 80 ? 'GATE' : 'MIN';
      }
    } else {
      status = achievementPct >= 100 ? 'OAB' : achievementPct >= 90 ? 'OTB' : achievementPct >= 80 ? 'GATE' : 'MIN';
    }

    parsedShops.push({
      ...fallback,
      id: `shop-gsheet-${i}`,
      code,
      name,
      leadAgent,
      region,
      revenueMtd,
      target,
      achievementPct,
      activeSubs,
      fwbbTopUp,
      grossAds,
      status,
    });
  }

  return parsedShops.length > 0 ? parsedShops : fallbackShops;
};

// 5. Build sheet rows for export or sync
export const buildShopsSheetData = (shops: ShopItem[]): string[][] => {
  const headers = [
    'Shop Code',
    'Shop Name',
    'Lead Agent',
    'Agent Code',
    'Region',
    'Revenue MTD ($)',
    'Target ($)',
    'Achievement %',
    'Active Subscribers',
    'FWBB Top Up ($)',
    'Gross SIM Ads',
    'KPI Status',
  ];

  const rows = shops.map((s) => [
    s.code,
    s.name,
    s.leadAgent,
    s.agentCode,
    s.region,
    s.revenueMtd.toString(),
    s.target.toString(),
    `${s.achievementPct}%`,
    s.activeSubs.toString(),
    s.fwbbTopUp.toString(),
    s.grossAds.toString(),
    s.status,
  ]);

  return [headers, ...rows];
};

// 6. Write values back to Google Sheets (MANDATORY: Caller must present confirmation dialog)
export const updateSheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: string[][]
): Promise<{ updatedRows: number; updatedColumns: number }> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to write to Google Sheets: ${errorText}`);
  }

  const data = await res.json();
  return {
    updatedRows: data.updatedRows || values.length,
    updatedColumns: data.updatedColumns || (values[0]?.length || 0),
  };
};

// 7. Create a new Google Sheet in user's Drive with TelePortal data
export const createTeleportalSheet = async (
  accessToken: string,
  title: string,
  shops: ShopItem[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const sheetData = buildShopsSheetData(shops);

  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title || 'TelePortal Operations KPI Roster',
      },
      sheets: [
        {
          properties: {
            title: 'Shops_Performance',
            gridProperties: {
              rowCount: sheetData.length + 10,
              columnCount: 15,
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet: ${errorText}`);
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;
  const spreadsheetUrl = created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Populate data
  await updateSheetValues(
    accessToken,
    spreadsheetId,
    'Shops_Performance!A1:L' + sheetData.length,
    sheetData
  );

  return { spreadsheetId, spreadsheetUrl };
};
