// src/components/pages/ForecastsPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Custom UI Components
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select, SelectOption } from "../ui/Select";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Drawer } from "../ui/Drawer";
import { Skeleton, SkeletonTableRow } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Menu } from "../ui/Menu";
import { useToast } from "../ui/Toast";

// Dashboard Components
import { KPICard } from "../dashboard/KPICard";
import { BarChart } from "../dashboard/charts";

// Services
import {
  importForecastData,
  getForecastsWithProductData,
  generateWeekColumns,
  ForecastTableData,
  ForecastWithHours,
} from "../../services/forecast.service";
import { getAllProducts } from "../../services/product.service";
import { exportForecastData, ExportFormat } from "../../services/export.service";

// Modals
import { ExcelImportModal } from "../modals/ExcelImportModal";

// ============== BLOCK 2: Types & Interfaces ==============

interface WeekOption extends SelectOption {
  value: string;
  label: string;
}

// ============== BLOCK 3: Constants ==============

const WEEK_OPTIONS: WeekOption[] = [
  { value: "4", label: "4 Weeks" },
  { value: "6", label: "6 Weeks" },
  { value: "8", label: "8 Weeks" },
  { value: "10", label: "10 Weeks" },
  { value: "12", label: "12 Weeks" },
];

const EXPORT_OPTIONS = [
  { key: "csv", label: "Export as CSV", icon: "📄" },
  { key: "excel", label: "Export as Excel", icon: "📊" },
  { key: "pdf", label: "Export as PDF", icon: "📑" },
];

// ============== BLOCK 4: Helper Functions ==============

/**
 * Gets heat map color based on value relative to row maximum
 */
const getHeatMapColor = (
  value: number,
  rowMax: number,
  isDark: boolean
): string => {
  if (value === 0) {
    return isDark
      ? "bg-gray-800 text-gray-500"
      : "bg-gray-50 text-gray-400";
  }

  if (rowMax === 0) {
    return isDark
      ? "bg-gray-700 text-gray-300"
      : "bg-gray-100 text-gray-600";
  }

  const percentage = (value / rowMax) * 100;

  if (percentage >= 80) {
    return isDark
      ? "bg-red-900/40 text-red-300"
      : "bg-red-100 text-red-800";
  }
  if (percentage >= 60) {
    return isDark
      ? "bg-orange-900/40 text-orange-300"
      : "bg-orange-100 text-orange-800";
  }
  if (percentage >= 40) {
    return isDark
      ? "bg-yellow-900/40 text-yellow-300"
      : "bg-yellow-100 text-yellow-800";
  }
  if (percentage >= 20) {
    return isDark
      ? "bg-blue-900/40 text-blue-300"
      : "bg-blue-100 text-blue-800";
  }

  return isDark
    ? "bg-gray-700 text-gray-300"
    : "bg-gray-100 text-gray-600";
};

/**
 * Formats a number with thousand separators
 */
const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

/**
 * Formats hours with 1 decimal place
 */
const formatHours = (value: number): string => {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`;
};

// ============== BLOCK 5: Loading Skeleton Component ==============

const ForecastSkeleton: React.FC = () => {
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

      {/* Chart Skeleton */}
      <Skeleton variant="rounded" height={280} className="w-full" />

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton variant="rounded" width={300} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    {[...Array(6)].map((_, i) => (
                      <th key={i} className="p-3 bg-gray-50 dark:bg-gray-800">
                        <Skeleton variant="text" height={20} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={6} />
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

// ============== BLOCK 6: Main Component ==============

export function ForecastsPage() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  // ============== BLOCK 7: State Management ==============

  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeeks, setSelectedWeeks] = useState("4");

  const [forecastData, setForecastData] = useState<ForecastTableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============== BLOCK 8: Data Fetching ==============

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch products first to get hours data
      const products = await getAllProducts();

      // Map products to the format needed by getForecastsWithProductData
      const productData = products.map((p) => ({
        productCode: p.productCode,
        description: p.description,
        minsPerShipper: p.minsPerShipper || 0,
        unitsPerShipper: p.unitsPerShipper || 0,
      }));

      // Fetch forecasts with product data
      const data = await getForecastsWithProductData(
        productData,
        parseInt(selectedWeeks)
      );

      setForecastData(data);
    } catch (err: any) {
      console.error("Failed to fetch forecast data:", err);
      setError(err.message || "Failed to load forecast data");
      showToast({
        type: "error",
        title: "Error",
        message: "Failed to load forecast data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedWeeks, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

// ============== BLOCK 9: Filtered Data (Add forecastData to deps) ==============

const filteredRows = useMemo(() => {
  if (!forecastData?.rows) return [];

  if (!searchQuery.trim()) return forecastData.rows;

  const query = searchQuery.toLowerCase().trim();
  return forecastData.rows.filter(
    (row) =>
      row.productCode.toLowerCase().includes(query) ||
      row.description.toLowerCase().includes(query)
  );
}, [forecastData?.rows, searchQuery]);


// ============== BLOCK 10: KPI Calculations (Add missing deps) ==============

const kpiMetrics = useMemo(() => {
  if (!forecastData) {
    return {
      activeProducts: 0,
      totalProducts: 0,
      totalDemandUnits: 0,
      totalDemandHours: 0,
      peakWeek: { label: "-", units: 0 },
      avgWeeklyDemand: 0,
    };
  }

  const totalDemandUnits = forecastData.weeklyDemand.reduce(
    (sum, week) => sum + week.totalUnits,
    0
  );

  const totalDemandHours = forecastData.weeklyDemand.reduce(
    (sum, week) => sum + week.totalHours,
    0
  );

  const peakWeek = forecastData.weeklyDemand.reduce(
    (peak, week) => (week.totalUnits > peak.units ? { label: week.weekLabel, units: week.totalUnits } : peak),
    { label: "-", units: 0 }
  );

  const avgWeeklyDemand =
    forecastData.weeklyDemand.length > 0
      ? totalDemandUnits / forecastData.weeklyDemand.length
      : 0;

  return {
    activeProducts: forecastData.activeProducts,
    totalProducts: forecastData.totalProducts,
    totalDemandUnits,
    totalDemandHours,
    peakWeek,
    avgWeeklyDemand,
  };
}, [forecastData]); // ✅ Add forecastData as dependency

// ============== BLOCK 11: Chart Data (Proper Memoization) ==============

const chartData = useMemo(() => {
  if (!forecastData?.weeklyDemand) {
    return { categories: [], units: [], hours: [] };
  }

  return {
    categories: forecastData.weeklyDemand.map((w) =>
      w.weekLabel.replace("Week ", "W").split(" (")[0]
    ),
    units: forecastData.weeklyDemand.map((w) => w.totalUnits),
    hours: forecastData.weeklyDemand.map((w) => w.totalHours),
  };
}, [forecastData?.weeklyDemand]);

// Stable formatter to prevent chart re-renders
const chartFormatValue = useCallback(
  (val: number) => formatNumber(val),
  []
);

  // ============== BLOCK 12: Event Handlers ==============

  const handleImport = async (file: File) => {
    showToast({
      type: "loading",
      title: "Importing",
      message: "Processing forecast data...",
    });

    try {
      await importForecastData(file);
      showToast({
        type: "success",
        title: "Success",
        message: "Forecast data imported successfully!",
      });
      setIsImportModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Import Failed",
        message: err.message || "Failed to import forecast data",
      });
    }
  };

  const handleExport = (format: string) => {
    if (!forecastData || filteredRows.length === 0) {
      showToast({
        type: "warning",
        title: "No Data",
        message: "No data available to export",
      });
      return;
    }

    try {
      const weekColumns = forecastData.headers
        .filter((h) => h.key.startsWith("week_"))
        .map((h) => ({ key: h.key, label: h.label }));

      const exportData = filteredRows.map((row) => {
        const rowData: Record<string, any> = {
          productCode: row.productCode,
          description: row.description,
        };
        weekColumns.forEach((week) => {
          rowData[week.key] = row.weeklyForecast?.[week.key] || 0;
        });
        return rowData;
      });

      const filename = `forecast_${selectedWeeks}weeks_${new Date().toISOString().split("T")[0]}`;

      exportForecastData(
        exportData,
        weekColumns,
        filename,
        format as ExportFormat
      );

      showToast({
        type: "success",
        title: "Exported",
        message: `Forecast exported as ${format.toUpperCase()}`,
      });

      setIsExportMenuOpen(false);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Export Failed",
        message: err.message || "Failed to export data",
      });
    }
  };

  const handleWeekChange = (value: string) => {
    setSelectedWeeks(value);
  };

  // ============== BLOCK 13: Loading State ==============

  if (isLoading) {
    return <ForecastSkeleton />;
  }

  // ============== BLOCK 14: Error State ==============

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="error"
            title="Failed to Load Forecasts"
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

// ============== BLOCK 15: Week Columns for Table ==============

const weekColumns = forecastData?.headers.filter((h) =>
  h.key.startsWith("week_")
) || [];

// ============== BLOCK 16: Render ==============

return (
  <div className="space-y-6">
    {/* Header Card */}
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Sales Forecasts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and view forecasted sales data for all products
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="md"
              leftIcon={<ChartBarIcon className="h-4 w-4" />}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              {isDrawerOpen ? "Hide Insights" : "Show Insights"}
            </Button>

            {/* Export Button - Moved here from toolbar */}
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
                        onClick={() => {
                          handleExport(option.key);
                          setIsExportMenuOpen(false);
                        }}
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
              Import Forecast
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>

    {/* KPI Drawer */}
    <Drawer
      isOpen={isDrawerOpen}
      onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      showHeader={false}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Products"
          value={kpiMetrics.activeProducts}
          format="number"
          color="blue"
          trend={{
            value: kpiMetrics.totalProducts,
            isPositive: true,
          }}
          sparklineData={chartData.units.slice(0, 4)}
          sparklineType="bar"
          sparklineColor="#3b82f6"
        />
        <KPICard
          title="Total Demand"
          value={kpiMetrics.totalDemandUnits}
          format="number"
          color="green"
          sparklineData={chartData.units}
          sparklineType="area"
          sparklineColor="#10b981"
        />
        <KPICard
          title="Total Hours"
          value={kpiMetrics.totalDemandHours}
          format="hours"
          color="purple"
          sparklineData={chartData.hours}
          sparklineType="line"
          sparklineColor="#8b5cf6"
        />
        <KPICard
          title="Peak Week"
          value={kpiMetrics.peakWeek.units}
          format="number"
          color="yellow"
          sparklineData={chartData.units}
          sparklineType="bar"
          sparklineColor="#f59e0b"
        />
      </div>
    </Drawer>

    {/* Demand Chart - Only re-renders when data changes */}
    {forecastData && forecastData.weeklyDemand.length > 0 && (
      <BarChart
        title="Weekly Demand Overview"
        subtitle={`Forecasted demand for next ${selectedWeeks} weeks`}
        data={chartData.units}
        categories={chartData.categories}
        icon={<ChartBarIcon className="h-6 w-6" />}
        formatValue={chartFormatValue}
      />
    )}

    {/* Toolbar & Table Card */}
    <Card>
      <CardContent className="space-y-4">
        {/* Toolbar - Search left, controls right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Search - Fixed width, left side */}
          <div className="w-full sm:w-64 md:w-80">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              size="md"
            />
          </div>

          {/* Right side controls - Room for future buttons */}
          <div className="flex items-center gap-3">
            {/* Future buttons can go here */}

            {/* Week Filter */}
            <div className="w-32">
              <Select
                options={WEEK_OPTIONS}
                value={selectedWeeks}
                onChange={handleWeekChange}
                placeholder="Weeks"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {filteredRows.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {forecastData?.totalProducts || 0}
            </span>{" "}
            products
          </p>
          <Badge variant="subtle" color="primary" size="sm">
            {selectedWeeks} Week View
          </Badge>
        </div>

        {/* Table */}
        {filteredRows.length > 0 ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table variant="striped" size="sm" hoverable>
                <Table.Header>
                  <Table.Row>
                    <Table.Head className="min-w-[120px]">Product Code</Table.Head>
                    <Table.Head className="min-w-[200px]">Description</Table.Head>
                    {weekColumns.map((week) => {
                      const getDatePart = (label: string): string => {
                        const match = label.match(/\(([^)]+)\)/);
                        return match ? match[1] : "";
                      };

                      return (
                        <Table.Head key={week.key} className="text-center min-w-[100px]">
                          {week.label.replace("Week ", "W").split(" (")[0]}
                          <div className="text-xs font-normal text-gray-400">
                            {getDatePart(week.label)}
                          </div>
                        </Table.Head>
                      );
                    })}
                    <Table.Head className="text-center min-w-[80px]">Total</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredRows.map((row, rowIndex) => {
                    const rowValues = weekColumns.map(
                      (week) => row.weeklyForecast?.[week.key] || 0
                    );
                    const rowMax = Math.max(...rowValues, 0);
                    const rowTotal = rowValues.reduce((sum, val) => sum + val, 0);

                    return (
                      <Table.Row key={`${row.productCode}-${rowIndex}`}>
                        <Table.Cell className="font-medium">
                          {row.productCode}
                        </Table.Cell>
                        <Table.Cell className="text-gray-600 dark:text-gray-400">
                          {row.description || "-"}
                        </Table.Cell>
                        {weekColumns.map((week) => {
                          const value = row.weeklyForecast?.[week.key] || 0;
                          const colorClass = getHeatMapColor(
                            value,
                            rowMax,
                            theme.isDark
                          );

                          return (
                            <Table.Cell
                              key={week.key}
                              className={`text-center ${colorClass} transition-colors`}
                            >
                              {value > 0 ? formatNumber(value) : "-"}
                            </Table.Cell>
                          );
                        })}
                        <Table.Cell className="text-center font-semibold">
                          {rowTotal > 0 ? formatNumber(rowTotal) : "-"}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>
        ) : (
          <EmptyState
            variant={searchQuery ? "search" : "default"}
            title={searchQuery ? "No matching products" : "No forecast data"}
            description={
              searchQuery
                ? `No products found matching "${searchQuery}"`
                : "Import a forecast file to get started"
            }
            action={
              !searchQuery && (
                <Button
                  variant="primary"
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                  onClick={() => setIsImportModalOpen(true)}
                >
                  Import Forecast
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
      title="Import Sales Forecast"
    />
  </div>
);
}
// ============== BLOCK 17: Default Export ==============

export default ForecastsPage;