'use client';

import React from 'react';
import { DashboardMetrics } from '@/lib/types';
import { DollarSign, CreditCard, Percent, TrendingUp, CheckCircle, Receipt } from 'lucide-react';

interface KpiCardsProps {
  metrics: DashboardMetrics;
  currencySymbol?: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics, currencySymbol = 'Rs. ' }) => {
  const formatMoney = (val: number) => {
    return `${currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Total Sales */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gross Sales</span>
          <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{formatMoney(metrics.totalSales)}</div>
        <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          Gross Revenue Processed
        </p>
      </div>

      {/* Total Service Charges Paid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Charges</span>
          <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{formatMoney(metrics.totalServiceCharges)}</div>
        <p className="text-xs text-slate-500 mt-2">
          <span className="font-semibold text-amber-700">{metrics.serviceChargeRatio.toFixed(2)}%</span> effective rate
        </p>
      </div>

      {/* Net Revenue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Revenue</span>
          <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{formatMoney(metrics.netRevenue)}</div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Sales minus service fees</p>
      </div>

      {/* Total Volume & Success Rate */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transactions</span>
          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{metrics.totalCount.toLocaleString()}</div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
          <span className="text-emerald-600 font-semibold">{metrics.successfulCount} success</span>
          <span>({metrics.successRate.toFixed(1)}%)</span>
        </p>
      </div>

      {/* Avg Ticket Value */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Ticket Size</span>
          <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{formatMoney(metrics.avgTransactionValue)}</div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Per transaction average</p>
      </div>

      {/* Avg Fee / Order */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Fee / Order</span>
          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-light text-[#0F172A] tracking-tight">{formatMoney(metrics.avgServiceCharge)}</div>
        <p className="text-xs text-slate-400 mt-2 font-medium">Per order service fee</p>
      </div>
    </div>
  );
};
