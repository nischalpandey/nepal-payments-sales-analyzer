'use client';

import React, { useState } from 'react';
import { ProductGroup } from '@/lib/types';
import { Search, ArrowUpDown, Tag, Layers, CheckCircle2, DollarSign, Filter, RefreshCw } from 'lucide-react';

interface ProductGroupTableProps {
  productGroups: ProductGroup[];
  totalSalesOverall: number;
  totalChargesOverall: number;
  selectedProductFilter: string | null;
  onSelectProduct: (desc: string | null) => void;
  currencySymbol?: string;
}

export const ProductGroupTable: React.FC<ProductGroupTableProps> = ({
  productGroups,
  totalSalesOverall,
  totalChargesOverall,
  selectedProductFilter,
  onSelectProduct,
  currencySymbol = 'Rs. ',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ProductGroup>('totalSales');
  const [sortAsc, setSortDirection] = useState(false);

  const formatMoney = (val: number) =>
    `${currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSort = (field: keyof ProductGroup) => {
    if (sortField === field) {
      setSortDirection(!sortAsc);
    } else {
      setSortField(field);
      setSortDirection(false);
    }
  };

  const filteredGroups = productGroups.filter((pg) =>
    pg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Product Grouping by Description</h3>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {productGroups.length} Products
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Aggregated revenue, service charges paid, and order volume grouped by Merchant Description
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-56 md:w-64"
            />
          </div>

          {selectedProductFilter && (
            <button
              onClick={() => onSelectProduct(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Product Filter
            </button>
          )}
        </div>
      </div>

      {/* Selected Filter Alert */}
      {selectedProductFilter && (
        <div className="mb-4 bg-indigo-50/80 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>
              Dashboard currently filtered for product: <strong>&quot;{selectedProductFilter}&quot;</strong>
            </span>
          </div>
          <button
            onClick={() => onSelectProduct(null)}
            className="text-xs font-semibold underline text-indigo-700 hover:text-indigo-900"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Product Summary Cards */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">
                <button
                  onClick={() => handleSort('description')}
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  Merchant Description / Product
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('totalSales')}
                  className="flex items-center gap-1 justify-end hover:text-slate-900 ml-auto"
                >
                  Total Sales
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('totalServiceCharges')}
                  className="flex items-center gap-1 justify-end hover:text-slate-900 ml-auto"
                >
                  Service Charges
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('serviceChargeRatio')}
                  className="flex items-center gap-1 justify-end hover:text-slate-900 ml-auto"
                >
                  Fee Ratio %
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-center">
                <button
                  onClick={() => handleSort('transactionCount')}
                  className="flex items-center gap-1 justify-center hover:text-slate-900 mx-auto"
                >
                  Orders
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => handleSort('avgAmount')}
                  className="flex items-center gap-1 justify-end hover:text-slate-900 ml-auto"
                >
                  Avg Ticket
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-center">Sales Share</th>
              <th className="py-3 px-4 text-center">Filter View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedGroups.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                  No product group matches search &quot;{searchTerm}&quot;
                </td>
              </tr>
            ) : (
              sortedGroups.map((pg, idx) => {
                const isSelected = selectedProductFilter === pg.description;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isSelected ? 'bg-indigo-50/60 font-medium' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{pg.description}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatMoney(pg.totalSales)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-amber-700">
                      {formatMoney(pg.totalServiceCharges)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                          pg.serviceChargeRatio > 5
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : pg.serviceChargeRatio > 2
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {pg.serviceChargeRatio.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-700 font-medium">
                      {pg.transactionCount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-mono text-xs">
                      {formatMoney(pg.avgAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32 mx-auto">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>{pg.shareOfSales.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(2, pg.shareOfSales))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectProduct(isSelected ? null : pg.description)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Filter View'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {/* Table Footer Totals */}
          <tfoot>
            <tr className="bg-slate-100/80 font-bold text-slate-900 border-t border-slate-300 text-xs">
              <td className="py-3 px-4">Total ({productGroups.length} Product Groups)</td>
              <td className="py-3 px-4 text-right text-emerald-700">{formatMoney(totalSalesOverall)}</td>
              <td className="py-3 px-4 text-right text-amber-700">{formatMoney(totalChargesOverall)}</td>
              <td className="py-3 px-4 text-right">
                {totalSalesOverall > 0 ? ((totalChargesOverall / totalSalesOverall) * 100).toFixed(2) : 0}%
              </td>
              <td className="py-3 px-4 text-center">
                {productGroups.reduce((acc, p) => acc + p.transactionCount, 0).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-right" colSpan={3}>
                100.0% Overall Share
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
