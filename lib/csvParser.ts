import Papa from 'papaparse';
import { Transaction, DashboardMetrics, MonthlyTrend, ProductGroup, StatusGroup, ColumnMapping } from './types';

export const SAMPLE_CSV_DATA = `S.N,Transaction Id,Merchant Transaction Id,Merchant Description,Transaction Amount,Status,CbsMessage,Service Charge,ApiUserName,Created Date
1,100010712779,tx-26071618383701,Basic Training Module,600.00,Success,payment successful|payment_success,2.000,username,7/16/2026 6:38:38 PM
2,100010704706,tx-26071518203402,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/15/2026 6:20:36 PM
3,100010698681,tx-26071500315503,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/15/2026 12:31:58 AM
4,100010688705,tx-26071314014904,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/13/2026 2:01:53 PM
5,100010675085,tx-26071011170905,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/10/2026 11:17:12 AM
6,100010668695,tx-26070911540806,Annual Enterprise Pass,1599.00,Success,payment successful|payment_success,3.000,username,7/9/2026 11:54:10 AM
7,100010666895,tx-26070909105607,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/9/2026 9:10:58 AM
8,100010665859,tx-26070821411808,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/8/2026 9:41:20 PM
9,100010659769,tx-26070808532909,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/8/2026 8:53:33 AM
10,100010655306,tx-26070712435210,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/7/2026 12:43:54 PM
11,100010655112,tx-26070712294011,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/7/2026 12:29:43 PM
12,100010652027,tx-26070621102412,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/6/2026 9:12:05 PM
13,100010650554,tx-26070615214313,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/6/2026 3:21:45 PM
14,100010649912,tx-26070614064414,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/6/2026 2:06:46 PM
15,100010644207,tx-26070508485815,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/5/2026 8:49:00 AM
16,100010644187,tx-26070508405616,Annual Enterprise Pass,1599.00,Success,payment successful|payment_success,3.000,username,7/5/2026 8:40:58 AM
17,100010640432,tx-26070317521317,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,7/3/2026 5:52:16 PM
18,100010633482,tx-26070214041218,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/2/2026 2:04:13 PM
19,100010632139,tx-26070211523619,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/2/2026 11:52:39 AM
20,100010628604,tx-26070117450620,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/1/2026 5:45:09 PM
21,100010628293,tx-26070116370821,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,7/1/2026 4:37:12 PM
22,100010627445,tx-26070114243522,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/1/2026 2:24:36 PM
23,100010626572,tx-26070112514923,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/1/2026 12:51:52 PM
24,100010626426,tx-26070112403924,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,7/1/2026 12:40:41 PM
25,100010622743,tx-26063017582125,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,6/30/2026 5:58:25 PM
26,100010614490,tx-26062910521226,Quarterly Pro Subscription,480.00,Success,transaction completed successfully.,2.000,username,6/29/2026 10:52:15 AM
27,100010612940,tx-26062817211927,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,6/28/2026 5:21:22 PM
28,100010612357,tx-26062813115528,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,6/28/2026 1:11:57 PM
29,100010610352,tx-26062713230629,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,6/27/2026 1:23:07 PM
30,100010605646,tx-26062610500730,Quarterly Pro Subscription,480.00,Success,payment successful|payment_success,2.000,username,6/26/2026 10:50:10 AM
31,100010603819,tx-26062517331431,Annual Enterprise Pass,1599.00,Success,Request was processed successfully.,46.371,username,6/25/2026 5:33:18 PM
32,100010603680,tx-26062516392732,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,6/25/2026 4:39:30 PM
33,100010602978,tx-26062514240933,Messaging Credits Addon,400.00,Success,payment successful|payment_success,2.000,username,6/25/2026 2:24:12 PM
34,100010592974,tx-26062314420434,Quarterly Pro Subscription,440.00,Success,transaction completed successfully.,2.000,username,6/23/2026 2:42:08 PM
35,100010589815,tx-26062308112735,Basic Training Module,300.00,Success,payment successful|payment_success,2.000,username,6/23/2026 8:11:30 AM
36,100010589800,tx-26062308042136,Annual Enterprise Pass,1599.00,Success,payment successful|payment_success,3.000,username,6/23/2026 8:04:23 AM
37,100010589582,tx-26062306045637,Quarterly Pro Subscription,440.00,Success,transaction completed successfully.,2.000,username,6/23/2026 6:04:58 AM
38,100010589178,tx-26062221112238,Basic Training Module,300.00,Success,payment successful|payment_success,2.000,username,6/22/2026 9:11:25 PM
39,100010589158,tx-26062221065339,Basic Training Module,300.00,Success,payment successful|payment_success,2.000,username,6/22/2026 9:06:54 PM
40,100010588931,tx-26062219472340,Basic Training Module,300.00,Success,transaction completed successfully.,2.000,username,6/22/2026 7:47:25 PM
41,100010583360,tx-26062114441841,Annual Enterprise Pass,1599.00,Success,payment successful|payment_success,3.000,username,6/21/2026 2:44:19 PM
42,100010580012,tx-26061920582342,Quarterly Pro Subscription,440.00,Success,transaction completed successfully.,2.000,username,6/19/2026 8:58:25 PM
43,100010577551,tx-26061911491043,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/19/2026 11:49:13 AM
44,100010574452,tx-26061814305444,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,6/18/2026 2:30:57 PM
45,100010572586,tx-26061810192145,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/18/2026 10:19:28 AM
46,100010570883,tx-26061716262646,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/17/2026 4:26:28 PM
47,100010567732,tx-26061622005247,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/16/2026 10:00:59 PM
48,100010567445,tx-26061619504248,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/16/2026 7:50:44 PM
49,100010566317,tx-26061614204749,Quarterly Pro Subscription,440.00,Success,payment successful|payment_success,2.000,username,6/16/2026 2:20:49 PM
50,100010565409,tx-26061612140150,Annual Enterprise Pass,1599.00,Success,transaction completed successfully.,3.000,username,6/16/2026 12:14:04 PM
`;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;

  // Fallback for m/d/yyyy h:mm:ss AM/PM
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, m, day, y] = match;
    const fallbackDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
    if (!isNaN(fallbackDate.getTime())) return fallbackDate;
  }
  return null;
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const normHeaders = headers.map(h => h.trim().toLowerCase());

  const findMatch = (candidates: string[], defaultHeader: string): string => {
    for (const candidate of candidates) {
      const idx = normHeaders.findIndex(h => h.includes(candidate));
      if (idx !== -1) return headers[idx];
    }
    return defaultHeader;
  };

  return {
    transactionId: findMatch(['transaction id', 'tx id', 'txid', 'transaction_id'], 'Transaction Id'),
    merchantTransactionId: findMatch(['merchant transaction id', 'merchant tx', 'merchant_id'], 'Merchant Transaction Id'),
    merchantDescription: findMatch(['merchant description', 'description', 'product', 'item', 'service'], 'Merchant Description'),
    transactionAmount: findMatch(['transaction amount', 'amount', 'sales', 'total amount'], 'Transaction Amount'),
    status: findMatch(['status', 'state', 'payment status'], 'Status'),
    cbsMessage: findMatch(['cbsmessage', 'cbs message', 'message', 'remark'], 'CbsMessage'),
    serviceCharge: findMatch(['service charge', 'charge', 'fee', 'commission', 'service_charge'], 'Service Charge'),
    apiUserName: findMatch(['apiusername', 'user', 'username'], 'ApiUserName'),
    createdDate: findMatch(['created date', 'date', 'created_at', 'timestamp', 'time'], 'Created Date'),
  };
}

export function parseCSV(csvString: string): { transactions: Transaction[]; rawCount: number; invalidCount: number } {
  const results = Papa.parse<Record<string, string>>(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (!results.data || results.data.length === 0) {
    return { transactions: [], rawCount: 0, invalidCount: 0 };
  }

  const headers = results.meta.fields || [];
  const colMap = detectColumnMapping(headers);

  let invalidCount = 0;
  const transactions: Transaction[] = [];

  results.data.forEach((row, index) => {
    const snRaw = row['S.N'] || row['SN'] || row['sn'] || String(index + 1);
    const sn = parseInt(snRaw, 10) || index + 1;

    const txId = row[colMap.transactionId] || row['Transaction Id'] || row['TransactionID'] || `TX-${index + 1}`;
    const mTxId = row[colMap.merchantTransactionId] || row['Merchant Transaction Id'] || '';
    const desc = (row[colMap.merchantDescription] || row['Merchant Description'] || 'Uncategorized Product').trim();
    const amountRaw = row[colMap.transactionAmount] || row['Transaction Amount'] || '0';
    const status = (row[colMap.status] || row['Status'] || 'Success').trim();
    const cbsMsg = row[colMap.cbsMessage] || row['CbsMessage'] || '';
    const serviceChargeRaw = row[colMap.serviceCharge] || row['Service Charge'] || '0';
    const user = row[colMap.apiUserName] || row['ApiUserName'] || '';
    const dateStr = row[colMap.createdDate] || row['Created Date'] || '';

    // Clean monetary values
    const amount = parseFloat(String(amountRaw).replace(/[^0-9.-]+/g, '')) || 0;
    const serviceCharge = parseFloat(String(serviceChargeRaw).replace(/[^0-9.-]+/g, '')) || 0;

    const dateObj = parseDateString(dateStr);

    let yearMonth = 'Unknown';
    let monthLabel = 'Unknown';
    let year = 2026;

    if (dateObj) {
      year = dateObj.getFullYear();
      const monthIdx = dateObj.getMonth();
      const monthNum = String(monthIdx + 1).padStart(2, '0');
      yearMonth = `${year}-${monthNum}`;
      monthLabel = `${MONTH_NAMES[monthIdx]} ${year}`;
    }

    transactions.push({
      sn,
      transactionId: txId,
      merchantTransactionId: mTxId,
      merchantDescription: desc,
      transactionAmount: amount,
      status,
      cbsMessage: cbsMsg,
      serviceCharge,
      apiUserName: user,
      createdDate: dateStr,
      dateObj,
      yearMonth,
      monthLabel,
      year,
    });
  });

  return { transactions, rawCount: results.data.length, invalidCount };
}

export function calculateMetrics(transactions: Transaction[]): DashboardMetrics {
  let totalSales = 0;
  let totalServiceCharges = 0;
  let successfulCount = 0;

  transactions.forEach(t => {
    totalSales += t.transactionAmount;
    totalServiceCharges += t.serviceCharge;
    if (t.status.toLowerCase() === 'success') {
      successfulCount++;
    }
  });

  const totalCount = transactions.length;
  const netRevenue = totalSales - totalServiceCharges;
  const successRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;
  const avgTransactionValue = totalCount > 0 ? totalSales / totalCount : 0;
  const avgServiceCharge = totalCount > 0 ? totalServiceCharges / totalCount : 0;
  const serviceChargeRatio = totalSales > 0 ? (totalServiceCharges / totalSales) * 100 : 0;

  return {
    totalSales,
    totalServiceCharges,
    netRevenue,
    totalCount,
    successfulCount,
    successRate,
    avgTransactionValue,
    avgServiceCharge,
    serviceChargeRatio,
  };
}

export function aggregateMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
  const map: Record<string, { yearMonth: string; monthLabel: string; timestamp: number; sales: number; serviceCharge: number; netRevenue: number; count: number; successCount: number }> = {};

  transactions.forEach(t => {
    const key = t.yearMonth;
    if (!map[key]) {
      const dateForSort = t.dateObj ? new Date(t.dateObj.getFullYear(), t.dateObj.getMonth(), 1).getTime() : 0;
      map[key] = {
        yearMonth: key,
        monthLabel: t.monthLabel,
        timestamp: dateForSort,
        sales: 0,
        serviceCharge: 0,
        netRevenue: 0,
        count: 0,
        successCount: 0,
      };
    }

    map[key].sales += t.transactionAmount;
    map[key].serviceCharge += t.serviceCharge;
    map[key].netRevenue += (t.transactionAmount - t.serviceCharge);
    map[key].count += 1;
    if (t.status.toLowerCase() === 'success') {
      map[key].successCount += 1;
    }
  });

  return Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
}

export function groupProductsByDescription(transactions: Transaction[], totalSalesOverall: number): ProductGroup[] {
  const map: Record<string, { totalSales: number; totalServiceCharges: number; transactionCount: number; successfulCount: number }> = {};

  transactions.forEach(t => {
    const desc = t.merchantDescription || 'Uncategorized';
    if (!map[desc]) {
      map[desc] = {
        totalSales: 0,
        totalServiceCharges: 0,
        transactionCount: 0,
        successfulCount: 0,
      };
    }
    map[desc].totalSales += t.transactionAmount;
    map[desc].totalServiceCharges += t.serviceCharge;
    map[desc].transactionCount += 1;
    if (t.status.toLowerCase() === 'success') {
      map[desc].successfulCount += 1;
    }
  });

  return Object.entries(map).map(([description, data]) => {
    const avgAmount = data.transactionCount > 0 ? data.totalSales / data.transactionCount : 0;
    const avgServiceCharge = data.transactionCount > 0 ? data.totalServiceCharges / data.transactionCount : 0;
    const shareOfSales = totalSalesOverall > 0 ? (data.totalSales / totalSalesOverall) * 100 : 0;
    const serviceChargeRatio = data.totalSales > 0 ? (data.totalServiceCharges / data.totalSales) * 100 : 0;

    return {
      description,
      totalSales: data.totalSales,
      totalServiceCharges: data.totalServiceCharges,
      transactionCount: data.transactionCount,
      successfulCount: data.successfulCount,
      avgAmount,
      shareOfSales,
      avgServiceCharge,
      serviceChargeRatio,
    };
  }).sort((a, b) => b.totalSales - a.totalSales);
}

export function groupStatusDistribution(transactions: Transaction[]): StatusGroup[] {
  const map: Record<string, { count: number; totalSales: number }> = {};
  const total = transactions.length;

  transactions.forEach(t => {
    const st = t.status || 'Unknown';
    if (!map[st]) {
      map[st] = { count: 0, totalSales: 0 };
    }
    map[st].count += 1;
    map[st].totalSales += t.transactionAmount;
  });

  return Object.entries(map).map(([status, data]) => ({
    status,
    count: data.count,
    totalSales: data.totalSales,
    percentage: total > 0 ? (data.count / total) * 100 : 0,
  }));
}

export function downloadDemoCsv() {
  const blob = new Blob([SAMPLE_CSV_DATA.trim()], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'demo_sales_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
