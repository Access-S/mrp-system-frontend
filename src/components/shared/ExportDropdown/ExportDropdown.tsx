// src/components/shared/ExportDropdown/ExportDropdown.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import {
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/Button";
import { useExportMenu } from "@/hooks";

// ============== BLOCK 2: Types & Interfaces ==============

export type ExportFormat = "csv" | "excel" | "pdf";

interface ExportOption {
  key: ExportFormat;
  label: string;
  icon: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  { key: "csv", label: "Export as CSV", icon: "📄" },
  { key: "excel", label: "Export as Excel", icon: "📊" },
  { key: "pdf", label: "Export as PDF", icon: "📑" },
];

interface ExportDropdownProps {
  /** Called when user selects an export format */
  onExport: (format: ExportFormat) => void;
  /** Disable the export button (e.g., when no data) */
  disabled?: boolean;
}

// ============== BLOCK 3: Component ==============

export const ExportDropdown = ({ onExport, disabled = false }: ExportDropdownProps) => {
  const exportMenu = useExportMenu();

  const handleExport = (format: ExportFormat) => {
    onExport(format);
    exportMenu.close();
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="md"
        leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
        rightIcon={<ChevronDownIcon className="h-4 w-4" />}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          exportMenu.toggle();
        }}
        disabled={disabled}
      >
        Export
      </Button>

      {exportMenu.isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={exportMenu.close}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
            {EXPORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => handleExport(option.key)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};