'use client';

import React, { useState, useMemo } from 'react';
import { Transaction } from '@/lib/types';
import { Search, ArrowUpDown, Download, Filter, FileText, ChevronLeft, ChevronRight, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  currencySymbol?: string;
  onResetFilters?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  currencySymbol = 'Rs. ',
  onResetFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof Transaction>('sn');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const formatMoney = (val: number) =>
    `${currencySymbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const statuses = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.status));
    return Array.from(set);
  }, [transactions]);

  // Filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchantTransactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchantDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cbsMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.apiUserName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  // Sort
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (valA instanceof Date && valB instanceof Date) {
        return sortAsc ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
      }
      return 0;
    });
  }, [filteredTransactions, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['S.N', 'Transaction Id', 'Merchant Transaction Id', 'Merchant Description', 'Transaction Amount', 'Status', 'Service Charge', 'Created Date'];
    const rows = filteredTransactions.map((t) => [
      t.sn,
      `"${t.transactionId}"`,
      `"${t.merchantTransactionId}"`,
      `"${t.merchantDescription}"`,
      t.transactionAmount.toFixed(2),
      `"${t.status}"`,
      t.serviceCharge.toFixed(3),
      `"${t.createdDate}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Transaction Records</h3>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredTransactions.length.toLocaleString()} Records Found
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            View detailed sales logs, service charges paid, transaction statuses, and export reports
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, Product, Remark..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-52 md:w-64"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Statuses ({transactions.length})</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Filtered CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3 px-3 w-12 text-center">
                <button onClick={() => handleSort('sn')} className="hover:text-slate-900 mx-auto flex items-center gap-1">
                  S.N <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button onClick={() => handleSort('transactionId')} className="hover:text-slate-900 flex items-center gap-1">
                  Tx ID / Ref <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button onClick={() => handleSort('merchantDescription')} className="hover:text-slate-900 flex items-center gap-1">
                  Product / Description <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button onClick={() => handleSort('transactionAmount')} className="hover:text-slate-900 flex items-center gap-1 justify-end ml-auto">
                  Sales Amount <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">
                <button onClick={() => handleSort('serviceCharge')} className="hover:text-slate-900 flex items-center gap-1 justify-end ml-auto">
                  Service Charge <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-center">
                <button onClick={() => handleSort('status')} className="hover:text-slate-900 flex items-center gap-1 justify-center mx-auto">
                  Status <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button onClick={() => handleSort('createdDate')} className="hover:text-slate-900 flex items-center gap-1">
                  Created Date <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-4 text-slate-500">CBS Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium mb-1">No transactions found</p>
                  <p className="text-xs">Try clearing search term or status filters</p>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((t) => {
                const isSuccess = t.status.toLowerCase() === 'success';

                return (
                  <tr key={t.transactionId || t.sn} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">{t.sn}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      <div>{t.transactionId}</div>
                      {t.merchantTransactionId && (
                        <div className="text-[10px] text-slate-400 font-sans">{t.merchantTransactionId}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{t.merchantDescription}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatMoney(t.transactionAmount)}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-amber-700">
                      {formatMoney(t.serviceCharge)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                          isSuccess
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{t.createdDate}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={t.cbsMessage}>
                      {t.cbsMessage || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-md py-1 px-2 bg-slate-50 font-semibold"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Showing <strong>{sortedTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sortedTransactions.length)}</strong> of{' '}
            <strong>{sortedTransactions.length.toLocaleString()}</strong> records
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
