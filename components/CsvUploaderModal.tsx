'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, Download, RefreshCw, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadDemoCsv } from '@/lib/csvParser';

interface CsvUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadCsv: (csvContent: string, fileName: string) => void;
  onResetToSample: () => void;
  isUsingCustomDataset: boolean;
  activeFileName: string;
  totalRecordsLoaded: number;
}

export const CsvUploaderModal: React.FC<CsvUploaderModalProps> = ({
  isOpen,
  onClose,
  onUploadCsv,
  onResetToSample,
  isUsingCustomDataset,
  activeFileName,
  totalRecordsLoaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('excel')) {
      setErrorMsg('Please upload a valid .csv file.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onUploadCsv(content, file.name);
        onClose();
      }
    };
    reader.onerror = () => setErrorMsg('Error reading CSV file.');
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSample = () => {
    downloadDemoCsv();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Upload Sales CSV Data</h3>
              <p className="text-xs text-slate-500">Analyze custom transactions, service charges & monthly revenue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Active Dataset Badge */}
          <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Active Dataset:</span>
              <span className="font-semibold text-slate-900 ml-1.5">{activeFileName}</span>
              <span className="text-slate-400 mx-2">•</span>
              <span className="text-emerald-600 font-semibold">{totalRecordsLoaded.toLocaleString()} Records</span>
            </div>
            {isUsingCustomDataset && (
              <button
                onClick={() => {
                  onResetToSample();
                  onClose();
                }}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset to Sample
              </button>
            )}
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-full shadow-xs border border-slate-200 mx-auto flex items-center justify-center text-emerald-600 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Drag & drop your sales CSV file here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-emerald-600 font-semibold underline">browse file</span> from your computer
            </p>
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Column Guidance */}
          <div className="mt-5 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-700 mb-1">Supported Columns (Auto-Detected):</p>
            <p className="font-mono text-[11px] text-slate-600">
              Merchant Description, Transaction Amount, Service Charge, Created Date, Status, Transaction Id
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs">
          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            Download Sample CSV Template
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
