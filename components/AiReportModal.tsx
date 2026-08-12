'use client';

import React, { useState } from 'react';
import { DashboardMetrics, ProductGroup, MonthlyTrend } from '@/lib/types';
import { Sparkles, Loader2, FileText, CheckCircle, RefreshCw, X, AlertCircle } from 'lucide-react';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: DashboardMetrics;
  productGroups: ProductGroup[];
  monthlyTrends: MonthlyTrend[];
  fileName: string;
}

export const AiReportModal: React.FC<AiReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  productGroups,
  monthlyTrends,
  fileName,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics,
          productGroups,
          monthlyTrends,
          fileName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI report');
      }

      setAnalysisText(data.analysis);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating report';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-violet-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Gemini Sales & Fee Executive Report
              </h3>
              <p className="text-xs text-slate-500">Automated AI intelligence on sales trends, product margins, and fee efficiency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!analysisText && !loading && !error && (
            <div className="py-12 text-center max-w-md mx-auto">
              <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-100">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-2">Generate Executive AI Summary</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Gemini AI will perform deep data synthesis across your {metrics.totalCount.toLocaleString()} sales transactions, evaluating total revenue, product description groupings, and service charge ratios.
              </p>
              <button
                onClick={handleGenerateReport}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Generate Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="py-16 text-center">
              <Loader2 className="w-10 h-10 text-violet-600 animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-800">Synthesizing Sales & Service Charge Analytics...</p>
              <p className="text-xs text-slate-500 mt-1">Analyzing product margins, fee ratios, and revenue trajectory</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Report Generation Failed</span>
              </div>
              <p>{error}</p>
              <button
                onClick={handleGenerateReport}
                className="mt-3 bg-rose-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {analysisText && !loading && (
            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Executive AI Analysis generated for dataset: {fileName}
                </span>
                <button
                  onClick={handleGenerateReport}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>

              <div className="whitespace-pre-line text-slate-800 font-sans text-xs sm:text-sm bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                {analysisText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Powered by Gemini 3.6 Flash Server-side AI</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
