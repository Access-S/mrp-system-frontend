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
} from "@heroicons/react/24/outline";

import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============== BLOCK 7: Validation ==============

  const validateFile = (file: File): string | null => {
    // Check file type
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      return "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.";
    }

    // Check file size
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
      handleClose();
    } else {
      setError("Please select a file to import.");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    setIsDragging(false);
    setShowChecklist(false);
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
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
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
        </div>
      }
    >
      <div className="space-y-6">
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
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleInputChange}
            className="hidden"
            accept={ACCEPTED_FILE_TYPES}
          />

          {/* Icon */}
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

          {/* Text */}
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

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* File Requirements */}
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

        {/* Expected Format Example */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Expected Format Example
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-800/50">
                  <th className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-left font-medium text-blue-900 dark:text-blue-100">
                    Product
                  </th>
                  <th className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-left font-medium text-blue-900 dark:text-blue-100">
                    Description
                  </th>
                  <th className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center font-medium text-blue-900 dark:text-blue-100">
                    02.03.2026
                  </th>
                  <th className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center font-medium text-blue-900 dark:text-blue-100">
                    09.03.2026
                  </th>
                  <th className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center font-medium text-blue-900 dark:text-blue-100">
                    ...
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-gray-700 dark:text-gray-300">
                    43020062
                  </td>
                  <td className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-gray-700 dark:text-gray-300">
                    Zyrtec Nasal Spray
                  </td>
                  <td className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                    216
                  </td>
                  <td className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                    0
                  </td>
                  <td className="border border-blue-200 dark:border-blue-700 px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                    ...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pre-Import Checklist (Collapsible) */}
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
      </div>
    </Dialog>
  );
}

// ============== BLOCK 11: Default Export ==============

export default ExcelImportModal;