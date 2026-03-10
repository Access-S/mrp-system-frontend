// src/components/pages/SohPage.tsx

// ============== BLOCK 1: Imports ==============
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Custom UI Components
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Skeleton, SkeletonTableRow } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { useToast } from "../ui/Toast";
import { ScrollArea } from "../ui/ScrollArea";

// Services
import {
  getSohData,
  importSohData,
  formatStock,
  formatCurrency,
  SohRecord,
  SohSummary,
  SohImportResult,
} from "../../services/soh.service";
import { exportData, ExportFormat, ExportColumn } from "../../services/export.service";

// Modals
import { ExcelImportModal } from "../modals/ExcelImportModal";

// ============== BLOCK 2: Constants ==============
const EXPORT_OPTIONS = [
  { key: "csv", label: "Export as CSV", icon: "📄" },
  { key: "excel", label: "Export as Excel", icon: "📊" },
  { key: "pdf", label: "Export as PDF", icon: "📑" },
];

// ============== BLOCK 3: Loading Skeleton Component ==============
const SohSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="space-y-2">
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width={300} height={16} />
            </div>
            <Skeleton variant="rounded" width={140} height={40} />
          </div>
        </CardHeader>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton variant="rounded" width={300} height={40} />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className="p-3 bg-gray-50 dark:bg-gray-800">
                        <Skeleton variant="text" height={20} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={4} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============== BLOCK 4: Main Component ==============
export function SohPage() {
  const { toast } = useToast();

  // ============== BLOCK 5: State Management ==============
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sohRecords, setSohRecords] = useState<SohRecord[]>([]);
  const [summary, setSummary] = useState<SohSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============== BLOCK 6: Data Fetching ==============
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSohData();
      setSohRecords(data.records);
      setSummary(data.summary);
    } catch (err: any) {
      console.error("Failed to fetch SOH data:", err);
      setError(err.message || "Failed to load SOH data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============== BLOCK 7: Filtered Data ==============
  const filteredRecords = useMemo(() => {
    if (!sohRecords) return [];

    if (!searchQuery.trim()) return sohRecords;

    const query = searchQuery.toLowerCase().trim();
    return sohRecords.filter(
      (record) =>
        record.product_id.toLowerCase().includes(query) ||
        record.description?.toLowerCase().includes(query)
    );
  }, [sohRecords, searchQuery]);

  // ============== BLOCK 8: Event Handlers ==============
const handleImport = async (file: File): Promise<SohImportResult> => {
  toast.info("Processing SOH data...");

  try {
    const result = await importSohData(file);

    toast.success(
      `${result.data.imported} records imported. ${result.data.archived} previous records archived.`
    );

    return result;
  } catch (err: any) {
    toast.error(err.message || "Failed to import SOH data");
    throw err;
  }
};

const handleImportComplete = () => {
  setIsImportModalOpen(false);
  fetchData();
};

const handleExport = (format: string) => {
  if (!filteredRecords || filteredRecords.length === 0) {
    toast.warning("No data available to export");
    return;
  }

  try {
    const columns: ExportColumn[] = [
      { key: "product_id", header: "Product Code", width: 15 },
      { key: "description", header: "Description", width: 35 },
      { key: "stock_on_hand", header: "Stock on Hand", width: 15 },
      { key: "stock_value", header: "Stock Value", width: 15 },
    ];

    const exportDataRows = filteredRecords.map((record) => ({
      product_id: record.product_id,
      description: record.description || "-",
      stock_on_hand: record.stock_on_hand,
      stock_value: formatCurrency(record.stock_value),
    }));

    const filename = `stock_on_hand_${new Date().toISOString().split("T")[0]}`;

    exportData(format as ExportFormat, {
      filename,
      title: "Stock on Hand Report",
      subtitle: `Total: ${formatStock(summary?.totalStock || 0)} units | Value: ${formatCurrency(summary?.totalStockValue || 0)}`,
      columns,
      data: exportDataRows,
      orientation: "portrait",
      dateGenerated: true,
    });

    toast.success(`Stock on Hand exported as ${format.toUpperCase()}`);
    setIsExportMenuOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Failed to export data");
  }
};

  // ============== BLOCK 9: Loading State ==============
  if (isLoading) {
    return <SohSkeleton />;
  }

  // ============== BLOCK 10: Error State ==============
  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="error"
            title="Failed to Load Stock on Hand"
            description={error}
            action={
              <Button variant="primary" onClick={fetchData}>
                Try Again
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  // ============== BLOCK 11: Render ==============
  return (
    <div className="space-y-6">
{/* Header Card */}
<Card>
  <CardHeader>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Stock on Hand
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage current inventory stock levels
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Export Button */}
        <div className="relative">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            rightIcon={<ChevronDownIcon className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              setIsExportMenuOpen(!isExportMenuOpen);
            }}
          >
            Export
          </Button>

          {/* Export Dropdown */}
          {isExportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsExportMenuOpen(false)}
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

        <Button
          variant="primary"
          size="md"
          leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
          onClick={() => setIsImportModalOpen(true)}
        >
          Import SOH
        </Button>
      </div>
    </div>
  </CardHeader>
</Card>

      {/* KPI Card - Total Stock Value */}
      {summary && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(summary.totalStockValue)}
                  </p>
                </div>
              </div>
              <Badge variant="subtle" color="primary" size="lg">
                {formatStock(summary.totalStock)} units
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Card */}
      <Card>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search by product code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                size="md"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {filteredRecords.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {summary?.totalRecords || 0}
              </span>{" "}
              products
            </p>
            {summary && (
              <Badge variant="subtle" color="primary" size="sm">
                Zero Stock: {summary.zeroStockCount} products
              </Badge>
            )}
          </div>

          {/* Table */}
          {filteredRecords.length > 0 ? (
            <ScrollArea orientation="both" maxHeight="calc(100vh - 400px)">
              <Table stickyHeader hoverable variant="striped" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="text-left" style={{ minWidth: "150px" }}>
                      Product Code
                    </Table.Head>
                    <Table.Head className="text-left" style={{ minWidth: "300px" }}>
                      Description
                    </Table.Head>
                    <Table.Head className="text-center" style={{ minWidth: "130px" }}>
                      Stock on Hand
                    </Table.Head>
                    <Table.Head className="text-right" style={{ minWidth: "150px" }}>
                      Stock Value
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredRecords.map((record, index) => (
                    <Table.Row key={record.id || index}>
                      <Table.Cell className="text-left">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {record.product_id}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-left">
                        <span className="text-gray-600 dark:text-gray-300">
                          {record.description || "-"}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <span
                          className={`font-semibold ${
                            record.stock_on_hand === 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          {formatStock(record.stock_on_hand)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(record.stock_value)}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </ScrollArea>
          ) : (
            <EmptyState
              variant={searchQuery ? "search" : "default"}
              title={searchQuery ? "No matching products" : "No SOH data"}
              description={
                searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : "Import a SOH file to get started"
              }
              icon={<ArchiveBoxIcon className="h-12 w-12" />}
              action={
                !searchQuery && (
                  <Button
                    variant="primary"
                    leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                    onClick={() => setIsImportModalOpen(true)}
                  >
                    Import SOH
                  </Button>
                )
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Import Modal */}
      <ExcelImportModal
        open={isImportModalOpen}
        handleOpen={() => setIsImportModalOpen(!isImportModalOpen)}
        onImport={handleImport}
        title="Import Stock on Hand"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}

// ============== BLOCK 12: Default Export ==============
export default SohPage;