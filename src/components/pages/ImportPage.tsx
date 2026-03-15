// src/components/pages/ImportPage.tsx

// ============================================================================
// BLOCK 1: Imports (at top of file, before types)
// ============================================================================
import React, { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button, Typography, Spinner } from '@material-tailwind/react';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
  parseCSV,
  parseTSV,
  validateImportData,
  importPurchaseOrders,
  ImportRow,
  ValidationResult,
  ImportResult,
} from '../../services/import.service';
import { useToast } from '../ui/Toast';

// ============================================================================
// BLOCK 1.5: Types
// ============================================================================
type ImportStep = 'upload' | 'preview' | 'validating' | 'validated' | 'importing' | 'complete';

// ============================================================================
// BLOCK 2: Main Component
// ============================================================================
export function ImportPage() {
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // State
  const [step, setStep] = useState<ImportStep>('upload');
  const [rawData, setRawData] = useState<string>('');
  const [parsedData, setParsedData] = useState<ImportRow[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // ============================================================================
  // BLOCK 3: File Handling
  // ============================================================================
  const handleFile = useCallback((file: File) => {
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        setRawData(text);
        
        const data = text.includes('\t') ? parseTSV(text) : parseCSV(text);
        
        if (data.length === 0) {
          throw new Error('No data found in file');
        }
        
        setParsedData(data);
        setStep('preview');
        toast.success(`Parsed ${data.length} rows`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse file";
        setError(message);
        toast.error(message);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      toast.error('Failed to read file');
    };
    
    reader.readAsText(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    if (text) {
      try {
        setRawData(text);
        const data = text.includes('\t') ? parseTSV(text) : parseCSV(text);
        
        if (data.length === 0) {
          throw new Error('No data found');
        }
        
        setParsedData(data);
        setStep('preview');
        toast.success(`Parsed ${data.length} rows from clipboard`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to parse clipboard data";
        setError(message);
        toast.error(message);
      }
    }
  }, [toast]);

  // ============================================================================
  // BLOCK 4: Validation & Import
  // ============================================================================
  const handleValidate = async () => {
    setStep('validating');
    setError(null);
    
    try {
      const result = await validateImportData(parsedData);
      setValidation(result);
      setStep('validated');
      
      if (result.invalidRows === 0) {
        toast.success(`All ${result.totalRows} rows are valid!`);
      } else {
        toast.error(`${result.invalidRows} rows have errors`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Validation failed";
      setError(message);
      setStep('preview');
      toast.error(message);
    }
  };

  const handleImport = async () => {
    setStep('importing');
    setError(null);
    
    try {
      const result = await importPurchaseOrders(parsedData, true);
      setImportResult(result);
      setStep('complete');
      
      if (result.failed === 0) {
        toast.success(`Successfully imported ${result.success} purchase orders!`);
      } else {
        toast.success(`Imported ${result.success}, failed ${result.failed}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Import failed";
      setError(message);
      setStep('validated');
      toast.error(message);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setRawData('');
    setParsedData([]);
    setValidation(null);
    setImportResult(null);
    setError(null);
  };
  
  // ============================================================================
  // BLOCK 5: Render Upload Step
  // ============================================================================
  const renderUploadStep = () => (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : theme.isDark 
              ? 'border-slate-600 hover:border-slate-500 bg-slate-800/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }
        `}
      >
        <input
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <CloudArrowUpIcon className={`h-16 w-16 mx-auto mb-4 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        
        <h3 className={`text-lg font-semibold mb-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Drop your CSV file here
        </h3>
        
        <p className={`text-sm mb-4 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          or click to browse, or paste data directly (Ctrl+V)
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <span className={`text-xs px-3 py-1 rounded-full ${theme.isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
            CSV
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${theme.isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
            TSV
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${theme.isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
            Excel Copy/Paste
          </span>
        </div>
      </div>

      {/* Template Info */}
      <Card className={`${theme.cards} p-6`}>
        <div className="flex items-start gap-4">
          <DocumentTextIcon className={`h-8 w-8 flex-shrink-0 ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h4 className={`font-semibold mb-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Required CSV Format
            </h4>
            <p className={`text-sm mb-3 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Your CSV should have these columns (order doesn't matter):
            </p>
            <div className="flex flex-wrap gap-2">
              {['po_number', 'product_code', 'customer_name', 'ordered_qty_pieces', 'customer_amount', 'po_created_date', 'po_received_date', 'delivery_date', 'delivery_number', 'status'].map(col => (
                <span 
                  key={col}
                  className={`text-xs px-2 py-1 rounded font-mono ${
                    ['po_number', 'product_code', 'customer_name', 'ordered_qty_pieces', 'customer_amount', 'po_created_date', 'po_received_date'].includes(col)
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {col}{['po_number', 'product_code', 'customer_name', 'ordered_qty_pieces', 'customer_amount', 'po_created_date', 'po_received_date'].includes(col) ? '*' : ''}
                </span>
              ))}
            </div>
            <p className={`text-xs mt-2 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              * Required fields. Dates should be in YYYY-MM-DD format.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  // ============================================================================
  // BLOCK 6: Render Preview Step
  // ============================================================================
  const renderPreviewStep = () => (
    <div className="space-y-6">
      {/* Summary */}
      <Card className={`${theme.cards} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className={`h-8 w-8 ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h3 className={`font-semibold ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Data Preview
              </h3>
              <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {parsedData.length} rows parsed
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outlined" color="gray" onClick={handleReset}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleValidate}>
              Validate Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table Preview */}
      <Card className={`${theme.cards} overflow-hidden`}>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className={`sticky top-0 ${theme.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <tr>
                <th className={`px-4 py-3 text-left font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>#</th>
                <th className={`px-4 py-3 text-left font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>PO Number</th>
                <th className={`px-4 py-3 text-left font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Product</th>
                <th className={`px-4 py-3 text-left font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Customer</th>
                <th className={`px-4 py-3 text-right font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Qty</th>
                <th className={`px-4 py-3 text-right font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Amount</th>
                <th className={`px-4 py-3 text-left font-semibold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Status</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.slice(0, 50).map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-t ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}
                >
                  <td className={`px-4 py-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>{index + 1}</td>
                  <td className={`px-4 py-2 font-mono ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.po_number}</td>
                  <td className={`px-4 py-2 font-mono ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.product_code}</td>
                  <td className={`px-4 py-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.customer_name}</td>
                  <td className={`px-4 py-2 text-right ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.ordered_qty_pieces?.toLocaleString()}</td>
                  <td className={`px-4 py-2 text-right ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>${row.customer_amount?.toLocaleString()}</td>
                  <td className={`px-4 py-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.status || 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {parsedData.length > 50 && (
            <div className={`px-4 py-3 text-center text-sm ${theme.isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-50'}`}>
              Showing first 50 of {parsedData.length} rows
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  // ============================================================================
  // BLOCK 7: Render Validation Step
  // ============================================================================
  const renderValidatedStep = () => (
    <div className="space-y-6">
      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`${theme.cards} p-6`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {validation?.totalRows || 0}
              </p>
              <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Rows</p>
            </div>
          </div>
        </Card>

        <Card className={`${theme.cards} p-6`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {validation?.validRows || 0}
              </p>
              <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Valid Rows</p>
            </div>
          </div>
        </Card>

        <Card className={`${theme.cards} p-6`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {validation?.invalidRows || 0}
              </p>
              <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Invalid Rows</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Missing Products Warning */}
      {validation?.missingProducts && validation.missingProducts.length > 0 && (
        <Card className={`p-6 border-l-4 border-yellow-500 ${theme.isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            <div>
              <h4 className={`font-semibold ${theme.isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Missing Products ({validation.missingProducts.length})
              </h4>
              <p className={`text-sm mt-1 ${theme.isDark ? 'text-yellow-300/70' : 'text-yellow-600'}`}>
                These product codes don't exist in your products table:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {validation.missingProducts.map(code => (
                  <span key={code} className="text-xs font-mono px-2 py-1 rounded bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Error Details */}
      {validation?.errors && validation.errors.length > 0 && (
        <Card className={`${theme.cards} overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h4 className={`font-semibold ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Error Details
            </h4>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead className={`sticky top-0 ${theme.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <tr>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Row</th>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>PO Number</th>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Errors</th>
                </tr>
              </thead>
              <tbody>
                {validation.errors.slice(0, 20).map((err, index) => (
                  <tr key={index} className={`border-t ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <td className={`px-4 py-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>{err.row}</td>
                    <td className={`px-4 py-2 font-mono ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{err.po_number}</td>
                    <td className={`px-4 py-2 text-red-500`}>{err.errors.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outlined" color="gray" onClick={handleReset}>
          Cancel
        </Button>
        <Button 
          color="green" 
          onClick={handleImport}
          disabled={validation?.validRows === 0}
        >
          Import {validation?.validRows || 0} Valid Rows
        </Button>
      </div>
    </div>
  );

  // ============================================================================
  // BLOCK 8: Render Complete Step
  // ============================================================================
  const renderCompleteStep = () => (
    <div className="space-y-6">
      <Card className={`${theme.cards} p-8 text-center`}>
        <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h2 className={`text-2xl font-bold mb-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Import Complete!
        </h2>
        <p className={`text-lg mb-6 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Successfully imported {importResult?.success || 0} purchase orders
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
          <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
            <p className="text-2xl font-bold text-green-500">{importResult?.success || 0}</p>
            <p className={`text-sm ${theme.isDark ? 'text-green-400' : 'text-green-600'}`}>Imported</p>
          </div>
          <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <p className="text-2xl font-bold text-red-500">{importResult?.failed || 0}</p>
            <p className={`text-sm ${theme.isDark ? 'text-red-400' : 'text-red-600'}`}>Failed</p>
          </div>
          <div className={`p-4 rounded-lg ${theme.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <p className={`text-2xl font-bold ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>{importResult?.skipped || 0}</p>
            <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>Skipped</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outlined" color="blue" onClick={handleReset}>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Import More
          </Button>
          <Button color="green" onClick={() => window.location.href = '/purchase-orders'}>
            View Purchase Orders
          </Button>
        </div>
      </Card>

      {/* Failed Rows */}
      {importResult?.errors && importResult.errors.length > 0 && (
        <Card className={`${theme.cards} overflow-hidden`}>
          <div className={`px-6 py-4 border-b ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <h4 className={`font-semibold text-red-500`}>
              Failed Rows ({importResult.errors.length})
            </h4>
          </div>
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-sm">
              <thead className={`sticky top-0 ${theme.isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <tr>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Row</th>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>PO Number</th>
                  <th className={`px-4 py-2 text-left ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>Error</th>
                </tr>
              </thead>
              <tbody>
                {importResult.errors.map((err, index) => (
                  <tr key={index} className={`border-t ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <td className={`px-4 py-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>{err.row}</td>
                    <td className={`px-4 py-2 font-mono ${theme.isDark ? 'text-slate-200' : 'text-slate-700'}`}>{err.po_number}</td>
                    <td className={`px-4 py-2 text-red-500`}>{err.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );

  // ============================================================================
  // BLOCK 9: Render Loading States
  // ============================================================================
  const renderLoadingState = (message: string) => (
    <Card className={`${theme.cards} p-12 text-center`}>
      <Spinner className="h-12 w-12 mx-auto mb-4" />
      <p className={`text-lg ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>{message}</p>
    </Card>
  );

  // ============================================================================
  // BLOCK 10: Main Render
  // ============================================================================
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${theme.isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Import Purchase Orders
        </h1>
        <p className={`mt-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Upload a CSV file or paste data from Excel to bulk import purchase orders
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['Upload', 'Preview', 'Validate', 'Import'].map((label, index) => {
          const stepIndex = ['upload', 'preview', 'validated', 'complete'].indexOf(step);
          const isActive = index <= stepIndex || (step === 'validating' && index <= 2) || (step === 'importing' && index <= 3);
          const isCurrent = (step === 'upload' && index === 0) || 
                           (step === 'preview' && index === 1) || 
                           ((step === 'validating' || step === 'validated') && index === 2) ||
                           ((step === 'importing' || step === 'complete') && index === 3);
          
          return (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 ${isActive ? '' : 'opacity-40'}`}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : isActive 
                      ? 'bg-green-500 text-white'
                      : theme.isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                  }
                `}>
                  {isActive && index < stepIndex ? '✓' : index + 1}
                </div>
                <span className={`text-sm font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div className={`w-12 h-0.5 ${isActive && index < stepIndex ? 'bg-green-500' : theme.isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Error Display */}
      {error && (
        <Card className={`mb-6 p-4 border-l-4 border-red-500 ${theme.isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-6 w-6 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      )}

      {/* Step Content */}
      {step === 'upload' && renderUploadStep()}
      {step === 'preview' && renderPreviewStep()}
      {step === 'validating' && renderLoadingState('Validating data...')}
      {step === 'validated' && renderValidatedStep()}
      {step === 'importing' && renderLoadingState('Importing purchase orders...')}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
}