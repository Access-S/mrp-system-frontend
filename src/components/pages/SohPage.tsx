// src/components/pages/SohPage.tsx

// ============== BLOCK 1: Imports ==============
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
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
  SohRecord,
  SohSummary,
  SohImportResult,
} from "../../services/soh.service";

// Modals
import { ExcelImportModal } from "../modals/ExcelImportModal";

// ============== BLOCK 2: Loading Skeleton Component ==============
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
                    {[...Array(3)].map((_, i) => (
                      <th key={i} className="p-3 bg-gray-50 dark:bg-gray-800">
                        <Skeleton variant="text" height={20} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={3} />
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

// ============== BLOCK 3: Main Component ==============
export function SohPage() {
  const { toast } = useToast();

  // ============== BLOCK 4: State Management ==============
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sohRecords, setSohRecords] = useState<SohRecord[]>([]);
  const [summary, setSummary] = useState<SohSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============== BLOCK 5: Data Fetching ==============
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

  // ============== BLOCK 6: Filtered Data ==============
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

  // ============== BLOCK 7: Event Handlers ==============
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

  // ============== BLOCK 8: Loading State ==============
  if (isLoading) {
    return <SohSkeleton />;
  }

  // ============== BLOCK 9: Error State ==============
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

  // ============== BLOCK 10: Render ==============
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
                Total Stock: {formatStock(summary.totalStock)}
              </Badge>
            )}
          </div>

          {/* Table */}
          {filteredRecords.length > 0 ? (
            <ScrollArea orientation="both" maxHeight="calc(100vh - 350px)">
              <Table stickyHeader hoverable variant="striped" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Head style={{ minWidth: "150px" }}>
                      Product Code
                    </Table.Head>
                    <Table.Head style={{ minWidth: "300px" }}>
                      Description
                    </Table.Head>
                    <Table.Head
                      style={{ minWidth: "130px" }}
                      className="text-right"
                    >
                      Stock on Hand
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredRecords.map((record, index) => (
                    <Table.Row key={record.id || index}>
                      <Table.Cell>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {record.product_id}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-gray-600 dark:text-gray-300">
                          {record.description || "-"}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-right">
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

// ============== BLOCK 11: Default Export ==============
export default SohPage;