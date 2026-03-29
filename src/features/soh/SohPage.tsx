// src/features/soh/SohPage.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import {
  ArrowUpTrayIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { ScrollArea } from "@/components/ui/ScrollArea";

import { PageHeader } from "@/components/shared/PageHeader";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { ResultsCount } from "@/components/shared/ResultsCount";
import { ExportDropdown } from "@/components/shared/ExportDropdown";
import { SohSkeleton } from "./components";
import { ExcelImportModal } from "@/components/modals/ExcelImportModal";

import { useFetch, useSearch, useImport } from "@/hooks";

import {
  getSohData,
  importSohData,
  formatStock,
  formatCurrency,
} from "./services/soh.service";
import { exportData } from "@/services/export.service";

import type { SohTableData, SohImportResult } from "./services/soh.service";
import type { ExportFormat, ExportColumn } from "@/services/export.service";

// ============== BLOCK 2: Component ==============

export function SohPage() {
  const { toast } = useToast();

  // ============== BLOCK 3: Data Fetching ==============

  const { data, loading, error, refetch } = useFetch<SohTableData>(
    () => getSohData()
  );

  const sohRecords = data?.records ?? [];
  const summary = data?.summary ?? null;

  // Search (client-side)
  const { query, setQuery, filtered: filteredRecords } = useSearch(sohRecords, [
    "part_code",
    "description",
  ]);

  // Import modal
  const importModal = useImport(refetch);

  // ============== BLOCK 4: Event Handlers ==============

  const handleImport = async (file: File): Promise<SohImportResult> => {
    toast.info("Processing SOH data...");
    try {
      const result = await importSohData(file);
      toast.success(
        `${result.data.imported} records imported. ${result.data.archived} previous records archived.`
      );
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to import SOH data";
      toast.error(message);
      throw err;
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!filteredRecords || filteredRecords.length === 0) {
      toast.warning("No data available to export");
      return;
    }

    try {
      const columns: ExportColumn[] = [
        { key: "part_code", header: "Part Code", width: 15 },
        { key: "description", header: "Description", width: 35 },
        { key: "stock_on_hand", header: "Stock on Hand", width: 15 },
        { key: "stock_value", header: "Stock Value", width: 15 },
      ];

      const exportDataRows = filteredRecords.map((record) => ({
        part_code: record.part_code,
        description: record.description || "-",
        stock_on_hand: record.stock_on_hand,
        stock_value: formatCurrency(record.stock_value),
      }));

      const filename = `stock_on_hand_${new Date().toISOString().split("T")[0]}`;

      exportData(format, {
        filename,
        title: "Stock on Hand Report",
        subtitle: `Total: ${formatStock(summary?.totalStock || 0)} units | Value: ${formatCurrency(summary?.totalStockValue || 0)}`,
        columns,
        data: exportDataRows,
        orientation: "portrait",
        dateGenerated: true,
      });

      toast.success(`Stock on Hand exported as ${format.toUpperCase()}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to export data";
      toast.error(message);
    }
  };

  // ============== BLOCK 5: Loading State ==============

  if (loading) {
    return <SohSkeleton />;
  }

  // ============== BLOCK 6: Error State ==============

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="error"
            title="Failed to Load Stock on Hand"
            description={error}
            action={
              <Button variant="primary" onClick={refetch}>
                Try Again
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  // ============== BLOCK 7: Render ==============

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent>
          <PageHeader
            title="Stock on Hand"
            description="View and manage current inventory stock levels"
            actions={
              <>
                <ExportDropdown
                  onExport={handleExport}
                  disabled={!filteredRecords || filteredRecords.length === 0}
                />
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                  onClick={importModal.open}
                >
                  Import SOH
                </Button>
              </>
            }
          />
        </CardContent>
      </Card>

      {/* KPI Card */}
      {summary && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Stock Value
                  </p>
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
          <FilterToolbar
            searchPlaceholder="Search by product code or description..."
            searchValue={query}
            onSearchChange={setQuery}
          />

          <ResultsCount
            filtered={filteredRecords.length}
            total={summary?.totalRecords || 0}
            label="products"
            rightContent={
              summary ? (
                <Badge variant="subtle" color="primary" size="sm">
                  Zero Stock: {summary.zeroStockCount} products
                </Badge>
              ) : undefined
            }
          />

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
                          {record.part_code}
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
              variant={query ? "search" : "default"}
              title={query ? "No matching products" : "No SOH data"}
              description={
                query
                  ? `No products found matching "${query}"`
                  : "Import a SOH file to get started"
              }
              icon={<ArchiveBoxIcon className="h-12 w-12" />}
              action={
                !query ? (
                  <Button
                    variant="primary"
                    leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                    onClick={importModal.open}
                  >
                    Import SOH
                  </Button>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Import Modal */}
      <ExcelImportModal
        open={importModal.isOpen}
        handleOpen={importModal.close}
        onImport={handleImport}
        title="Import Stock on Hand"
        onImportComplete={importModal.onComplete}
      />
    </div>
  );
}