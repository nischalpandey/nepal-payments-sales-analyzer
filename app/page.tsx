'use client';

import React, { useState, useMemo } from 'react';
import {
  SAMPLE_CSV_DATA,
  parseCSV,
  calculateMetrics,
  aggregateMonthlyTrends,
  groupProductsByDescription,
  groupStatusDistribution,
  downloadDemoCsv,
} from '@/lib/csvParser';
import { KpiCards } from '@/components/KpiCards';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { ProductGroupTable } from '@/components/ProductGroupTable';
import { TransactionTable } from '@/components/TransactionTable';
import { CsvUploaderModal } from '@/components/CsvUploaderModal';
import {
  Upload,
  RefreshCw,
  Calendar,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Receipt,
  Download,
} from 'lucide-react';

export default function DashboardPage() {
  const currencySymbol = 'Rs. ';

  // Raw CSV & Dataset State
  const [csvContent, setCsvContent] = useState<string>(SAMPLE_CSV_DATA);
  const [datasetName, setDatasetName] = useState<string>('Sample Sales Dataset');
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);

  // Modals state
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  // Global Filters
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  // Parse CSV
  const { transactions } = useMemo(() => {
    return parseCSV(csvContent);
  }, [csvContent]);

  // Available Years
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    transactions.forEach((t) => {
      if (t.year) yearsSet.add(t.year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [transactions]);

  // Apply Global Filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedProduct && t.merchantDescription !== selectedProduct) return false;
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
      if (selectedYear !== 'ALL' && String(t.year) !== selectedYear) return false;
      return true;
    });
  }, [transactions, selectedProduct, selectedStatus, selectedYear]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    return calculateMetrics(filteredTransactions);
  }, [filteredTransactions]);

  // Overall Unfiltered Sales & Charges (for product share calculation)
  const totalSalesOverall = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.transactionAmount, 0);
  }, [transactions]);

  const totalChargesOverall = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.serviceCharge, 0);
  }, [transactions]);

  // Monthly Trends
  const monthlyTrends = useMemo(() => {
    return aggregateMonthlyTrends(filteredTransactions);
  }, [filteredTransactions]);

  // Product Groups
  const productGroups = useMemo(() => {
    return groupProductsByDescription(filteredTransactions, metrics.totalSales);
  }, [filteredTransactions, metrics.totalSales]);

  // Status Groups
  const statusGroups = useMemo(() => {
    return groupStatusDistribution(filteredTransactions);
  }, [filteredTransactions]);

  // Handlers
  const handleUploadCsv = (newCsv: string, fileName: string) => {
    setCsvContent(newCsv);
    setDatasetName(fileName);
    setIsCustomUpload(true);
    // Reset filters
    setSelectedProduct(null);
    setSelectedStatus('ALL');
    setSelectedYear('ALL');
  };

  const handleResetToSample = () => {
    setCsvContent(SAMPLE_CSV_DATA);
    setDatasetName('Sample Sales Dataset (1,405 records)');
    setIsCustomUpload(false);
    setSelectedProduct(null);
    setSelectedStatus('ALL');
    setSelectedYear('ALL');
  };

  const handleClearFilters = () => {
    setSelectedProduct(null);
    setSelectedStatus('ALL');
    setSelectedYear('ALL');
  };

  const hasActiveFilters = selectedProduct !== null || selectedStatus !== 'ALL' || selectedYear !== 'ALL';

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pb-16 font-sans antialiased flex flex-col">
      {/* Top Navigation / App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded flex items-center justify-center text-white font-bold text-xs tracking-wider">
              NP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-[#111827]">
                  Nepal Payments <span className="text-slate-400 font-normal ml-1 text-sm">Sales Analyzer</span>
                </h1>
                
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>Data Source: <strong className="text-slate-700">{datasetName}</strong></span>
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadDemoCsv}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              title="Download privacy-friendly sample CSV file"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Download Demo CSV
            </button>

            <button
              onClick={() => setIsUploaderOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors shadow-2xs"
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-6 flex-1 w-full">
        {/* Global Filter Bar */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#3B82F6]" />
              <span>Interactive Filters</span>
              {hasActiveFilters && (
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Active Filter
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Year Filter */}
              <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-slate-200 rounded-lg px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={String(yr)}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-slate-200 rounded-lg px-3 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Success">Success Only</option>
                </select>
              </div>

              {/* Product Filter */}
              <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-slate-200 rounded-lg px-3 py-1.5 max-w-xs truncate">
                <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 font-medium flex-shrink-0">Product:</span>
                <select
                  value={selectedProduct || 'ALL'}
                  onChange={(e) => setSelectedProduct(e.target.value === 'ALL' ? null : e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none truncate"
                >
                  <option value="ALL">All Product Descriptions</option>
                  {productGroups.map((pg) => (
                    <option key={pg.description} value={pg.description}>
                      {pg.description} ({pg.transactionCount})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Top KPI Cards */}
        <section>
          <KpiCards metrics={metrics} currencySymbol={currencySymbol} />
        </section>

        {/* Monthly Revenue Trends Chart */}
        <section>
          <MonthlyTrendChart data={monthlyTrends} currencySymbol={currencySymbol} />
        </section>

        {/* Product Grouping by Description */}
        <section>
          <ProductGroupTable
            productGroups={productGroups}
            totalSalesOverall={metrics.totalSales}
            totalChargesOverall={metrics.totalServiceCharges}
            selectedProductFilter={selectedProduct}
            onSelectProduct={setSelectedProduct}
            currencySymbol={currencySymbol}
          />
        </section>

        {/* Status Breakdown & Fee Efficiency Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fee Efficiency Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  Service Fee Ratio
                </h4>
                <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                  {metrics.serviceChargeRatio.toFixed(2)}% Fee Ratio
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Total service charges paid equal <strong className="text-slate-800">{currencySymbol}{metrics.totalServiceCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> out of gross sales of <strong className="text-slate-800">{currencySymbol}{metrics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Revenue:</span>
                <span className="font-bold text-slate-900">{currencySymbol}{metrics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Service Fees:</span>
                <span className="font-bold text-amber-700">-{currencySymbol}{metrics.totalServiceCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                <span>Net Sales Kept:</span>
                <span className="text-emerald-700">{currencySymbol}{metrics.netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                Transaction Status Breakdown
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                {metrics.successfulCount} / {metrics.totalCount} Success
              </span>
            </div>

            <div className="space-y-3">
              {statusGroups.map((sg, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-800">{sg.status}</span>
                    <span className="text-slate-600">
                      {sg.count.toLocaleString()} txs ({sg.percentage.toFixed(1)}%) • {currencySymbol}{sg.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        sg.status.toLowerCase() === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(3, sg.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Transactions Table */}
        <section>
          <TransactionTable transactions={filteredTransactions} currencySymbol={currencySymbol} onResetFilters={handleClearFilters} />
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 mt-12 text-xs">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
          Data Source: {datasetName}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase tracking-widest font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> System Ready
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            {transactions.length.toLocaleString()} Records Active
          </span>
        </div>
      </footer>

      {/* CSV Uploader Modal */}
      <CsvUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadCsv={handleUploadCsv}
        onResetToSample={handleResetToSample}
        isUsingCustomDataset={isCustomUpload}
        activeFileName={datasetName}
        totalRecordsLoaded={transactions.length}
      />
    </div>
  );
}
