'use client';

import React, { useState } from 'react';
import { MonthlyTrend } from '@/lib/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, TrendingUp, Info } from 'lucide-react';

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
  currencySymbol?: string;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data, currencySymbol = 'Rs. ' }) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [showSales, setShowSales] = useState(true);
  const [showCharges, setShowCharges] = useState(true);
  const [showNet, setShowNet] = useState(false);

  const formatMoney = (val: number) => `${currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `${currencySymbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(value ?? '');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Monthly Revenue & Service Charge Trends</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
              {data.length} Months Tracked
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor total sales volume alongside service charges paid month-over-month
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-600">
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                chartType === 'area' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <AreaChartIcon className="w-3.5 h-3.5 text-emerald-600" />
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                chartType === 'bar' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                chartType === 'line' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5 text-indigo-600" />
              Line
            </button>
          </div>

          {/* Series Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 font-medium">
              <input
                type="checkbox"
                checked={showSales}
                onChange={(e) => setShowSales(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Total Sales
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 font-medium">
              <input
                type="checkbox"
                checked={showCharges}
                onChange={(e) => setShowCharges(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Service Charges
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 font-medium">
              <input
                type="checkbox"
                checked={showNet}
                onChange={(e) => setShowNet(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Net Sales
            </label>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 border border-dashed rounded-lg">
          <Info className="w-8 h-8 mb-2 stroke-1" />
          <p className="text-sm">No monthly data available for selected filter</p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorCharges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="monthLabel"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatMoney}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '0.875rem',
                }}
              />
              <Legend verticalAlign="top" height={36} />

              {/* Render Series based on Selected Controls */}
              {showSales &&
                (chartType === 'area' ? (
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Total Sales Amount"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                ) : chartType === 'bar' ? (
                  <Bar dataKey="sales" name="Total Sales Amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                ) : (
                  <Line type="monotone" dataKey="sales" name="Total Sales Amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                ))}

              {showCharges &&
                (chartType === 'area' ? (
                  <Area
                    type="monotone"
                    dataKey="serviceCharge"
                    name="Service Charges Paid"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCharges)"
                  />
                ) : chartType === 'bar' ? (
                  <Bar dataKey="serviceCharge" name="Service Charges Paid" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                ) : (
                  <Line type="monotone" dataKey="serviceCharge" name="Service Charges Paid" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                ))}

              {showNet &&
                (chartType === 'area' ? (
                  <Area
                    type="monotone"
                    dataKey="netRevenue"
                    name="Net Sales (After Charges)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNet)"
                  />
                ) : chartType === 'bar' ? (
                  <Bar dataKey="netRevenue" name="Net Sales (After Charges)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                ) : (
                  <Line type="monotone" dataKey="netRevenue" name="Net Sales (After Charges)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Tip: Hover over chart points to inspect precise monthly service charge & sales breakdown.
        </div>
        <div className="flex items-center gap-4">
          <span>Peak Month: <strong className="text-slate-800">{data.length > 0 ? [...data].sort((a,b)=>b.sales - a.sales)[0]?.monthLabel : 'N/A'}</strong></span>
        </div>
      </div>
    </div>
  );
};
