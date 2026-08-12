export interface Transaction {
  sn: number;
  transactionId: string;
  merchantTransactionId: string;
  merchantDescription: string;
  transactionAmount: number;
  status: string;
  cbsMessage: string;
  serviceCharge: number;
  apiUserName: string;
  createdDate: string;
  dateObj: Date | null;
  yearMonth: string; // e.g. "2026-07"
  monthLabel: string; // e.g. "Jul 2026"
  year: number;
}

export interface DashboardMetrics {
  totalSales: number;
  totalServiceCharges: number;
  netRevenue: number;
  totalCount: number;
  successfulCount: number;
  successRate: number;
  avgTransactionValue: number;
  avgServiceCharge: number;
  serviceChargeRatio: number;
}

export interface MonthlyTrend {
  yearMonth: string;
  monthLabel: string;
  timestamp: number;
  sales: number;
  serviceCharge: number;
  netRevenue: number;
  count: number;
  successCount: number;
}

export interface ProductGroup {
  description: string;
  totalSales: number;
  totalServiceCharges: number;
  transactionCount: number;
  successfulCount: number;
  avgAmount: number;
  shareOfSales: number;
  avgServiceCharge: number;
  serviceChargeRatio: number;
}

export interface StatusGroup {
  status: string;
  count: number;
  totalSales: number;
  percentage: number;
}

export interface ColumnMapping {
  transactionId: string;
  merchantTransactionId: string;
  merchantDescription: string;
  transactionAmount: string;
  status: string;
  cbsMessage: string;
  serviceCharge: string;
  apiUserName: string;
  createdDate: string;
}
