// src/components/modals/ExcelImportModal.tsx

// ============== BLOCK 1: Imports ==============
import React, { useState, useRef } from "react";
import clsx from "clsx";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  TableCellsIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

// ============== BLOCK 2: Types & Interfaces ==============
interface ExcelImportModalProps {
  open: boolean;
  handleOpen: () => void;
  onImport: (file: File) => void;
  title: string;
}

interface FileRequirement {
  icon: React.ReactNode;
  text: string;
  required: boolean;
}

interface ReviewItem {
  row_number: number;
  product_code: string;
  description: string;
  forecast_values: Record<string, number>;
  reason: 'unknown_product' | 'invalid_date';
}

interface ReviewApproval {
  product_code: string;
  action: 'create_placeholder' | 'map_to_existing' | 'skip';
  mapped_product_code?: string;
}

// ============== BLOCK 3: Constants ==============
const ACCEPTED_FILE_TYPES = ".xlsx, .xls, .csv";
const MAX_FILE_SIZE_MB = 10;

const FILE_REQUIREMENTS: FileRequirement[] = [
  {
    icon: <CheckCircleIcon className="h-4 w-4" />,
    text: 'First column: "Product" (Product Code)',
    required: true,
  },
  {
    icon: <CheckCircleIcon className="h-4 w-4" />,
    text: 'Second column: "Description"',
    required: true,
  },
  {
    icon: <CheckCircleIcon className="h-4 w-4" />,
    text: "Remaining columns: Week dates (DD.MM.YYYY format)",
    required: true,
  },
  {
    icon: <CheckCircleIcon className="h-4 w-4" />,
    text: "Values: Forecast quantities (numbers)",
    required: true,
  },
];

const PRE_IMPORT_CHECKLIST = [
  "Remove any title rows above the header row",
  "Remove any 'Total' or summary rows at the bottom",
  "Ensure there are no merged cells",
  "Check that all date columns use DD.MM.YYYY format",
  "Save the file as .xlsx or .csv",
];

// ============== BLOCK 4: Helper Components ==============
const RequirementItem: React.FC<{ requirement: FileRequirement }> = ({
  requirement,
}) => (
  <li className="flex items-start gap-2 text-sm">
    <span className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0">
      {requirement.icon}
    </span>
    <span className="text-gray-700 dark:text-gray-300">{requirement.text}</span>
  </li>
);

const ChecklistItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-2 text-sm">
    <span className="text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0">
      <ExclamationTriangleIcon className="h-4 w-4" />
    </span>
    <span className="text-gray-600 dark:text-gray-400">{text}</span>
  </li>
);

const ReviewItemRow: React.FC<{
  item: ReviewItem;
  approval: ReviewApproval;
  onUpdate: (productCode: string, approval: ReviewApproval) => void;
  existingProducts: string[];
}> = ({ item, approval, onUpdate, existingProducts }) => {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {item.product_code}
            </span>
            <Badge
              variant="subtle"
              color={item.reason === 'unknown_product' ? 'yellow' : 'red'}
              size="sm"
            >
              {item.reason === 'unknown_product' ? 'Unknown Product' : 'Invalid Dates'}
            </Badge>
          </div>
          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.description}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Row {item.row_number} • {Object.keys(item.forecast_values).length} forecast values
          </p>
        </div>
      </div>

      {item.reason === 'unknown_product' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Select
              options={[
                { value: 'create_placeholder', label: 'Create Placeholder Product' },
                { value: 'map_to_existing', label: 'Map to Existing Product' },
                { value: 'skip', label: 'Skip This Row' },
              ]}
              value={approval.action}
              onChange={(value) =>
                onUpdate(item.product_code, {
                  product_code: item.product_code,
                  action: value as ReviewApproval['action'],
                })
              }
              size="sm"
              className="flex-1"
            />
          </div>

          {approval.action === 'map_to_existing' && (
            <Select
              options={existingProducts.map((code) => ({
                value: code,
                label: code,
              }))}
              value={approval.mapped_product_code || ''}
              onChange={(value) =>
                onUpdate(item.product_code, {
                  product_code: item.product_code,
                  action: 'map_to_existing',
                  mapped_product_code: value,
                })
              }
              placeholder="Select product code..."
              size="sm"
              className="w-full"
            />
          )}
        </div>
      )}

      {item.reason === 'invalid_date' && (
        <div className="text-sm text-red-600 dark:text-red-400">
          <p>Some date columns could not be parsed. Please check the Excel file format.</p>
          <div className="mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                onUpdate(item.product_code, {
                  product_code: item.product_code,
                  action: 'skip',
                })
              }
            >
              Skip Row
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== BLOCK 5: Main Component ==============
export function ExcelImportModal({
  open,
  handleOpen,
  onImport,
  title,
}: ExcelImportModalProps) {
  // ============== BLOCK 6: State ==============
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [approvals, setApprovals] = useState<Record<string, ReviewApproval>>({});
  const [isFinalizing, setIsFinalizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============== BLOCK 7: Validation ==============
  const validateFile = (file: File): string | null => {
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.";
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }

    return null;
  };

  // ============== BLOCK 8: Handlers ==============
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setImportResult(null);
    setIsReviewing(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileSelect(event.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileSelect(event.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    setImportResult(null);
    setIsReviewing(false);
    setApprovals({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to import.");
      return;
    }

    try {
      const result = await onImport(selectedFile);
      setImportResult(result);

      if (result.pending_review > 0) {
        setIsReviewing(true);
        // Initialize approvals with default action
        const initialApprovals: Record<string, ReviewApproval> = {};
        result.review_items.forEach((item: ReviewItem) => {
          initialApprovals[item.product_code] = {
            product_code: item.product_code,
            action: 'create_placeholder',
          };
        });
        setApprovals(initialApprovals);
      } else {
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || "Import failed");
    }
  };

  const handleApprovalUpdate = (productCode: string, approval: ReviewApproval) => {
    setApprovals((prev) => ({
      ...prev,
      [productCode]: approval,
    }));
  };

  const handleFinalizeReview = async () => {
    setIsFinalizing(true);
    try {
      // This would call the finalizeForecastReview service function
      // For now, just close the modal
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to finalize review");
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setIsDragging(false);
    setShowChecklist(false);
    setImportResult(null);
    setIsReviewing(false);
    setApprovals({});
    handleOpen();
  };

  // ============== BLOCK 9: Format File Size ==============
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ============== BLOCK 10: Render ==============
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={title}
      size={isReviewing ? "2xl" : "lg"}
      footer={
        <div className="flex items-center justify-between w-full">
          {!isReviewing ? (
            <>
              <button
                type="button"
                onClick={() => setShowChecklist(!showChecklist)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {showChecklist ? "Hide" : "Show"} pre-import checklist
              </button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmImport}
                  disabled={!selectedFile}
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                >
                  Import File
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {importResult?.pending_review || 0} items require review
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFinalizeReview}
                  disabled={isFinalizing}
                  leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  {isFinalizing ? "Processing..." : "Finalize Import"}
                </Button>
              </div>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {!isReviewing ? (
          <>
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={clsx(
                "relative flex flex-col items-center justify-center",
                "w-full p-8 rounded-xl cursor-pointer",
                "border-2 border-dashed transition-all duration-200",
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : selectedFile
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleInputChange}
                className="hidden"
                accept={ACCEPTED_FILE_TYPES}
              />

              <div
                className={clsx(
                  "p-4 rounded-full mb-4",
                  selectedFile
                    ? "bg-green-100 dark:bg-green-900/40"
                    : "bg-gray-100 dark:bg-gray-700"
                )}
              >
                {selectedFile ? (
                  <DocumentTextIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              {selectedFile ? (
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 mx-auto"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Drag & drop your Excel/CSV file here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse files
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge variant="subtle" color="gray" size="sm">
                      .xlsx
                    </Badge>
                    <Badge variant="subtle" color="gray" size="sm">
                      .xls
                    </Badge>
                    <Badge variant="subtle" color="gray" size="sm">
                      .csv
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-3">
                <TableCellsIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  File Requirements
                </h4>
              </div>
              <ul className="space-y-2">
                {FILE_REQUIREMENTS.map((req, index) => (
                  <RequirementItem key={index} requirement={req} />
                ))}
              </ul>
            </div>

            {showChecklist && (
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                    Before Importing
                  </h4>
                </div>
                <ul className="space-y-2">
                  {PRE_IMPORT_CHECKLIST.map((item, index) => (
                    <ChecklistItem key={index} text={item} />
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          /* Review Step */
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Review Required
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {importResult?.pending_review} items need your attention before import can complete.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {importResult?.review_items?.map((item: ReviewItem) => (
                <ReviewItemRow
                  key={item.product_code}
                  item={item}
                  approval={
                    approvals[item.product_code] || {
                      product_code: item.product_code,
                      action: 'create_placeholder',
                    }
                  }
                  onUpdate={handleApprovalUpdate}
                  existingProducts={[]} // TODO: Fetch from products service
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

// ============== BLOCK 11: Default Export ==============
export default ExcelImportModal;