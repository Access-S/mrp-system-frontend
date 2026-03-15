// src/components/pages/ForecastsPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useMemo, useCallback } from "react";
import {
  ArrowUpTrayIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Drawer } from "../ui/Drawer";
import { EmptyState } from "../ui/EmptyState";
import { useToast } from "../ui/Toast";
import { ScrollArea } from "../ui/ScrollArea";

import { KPICard } from "../dashboard/KPICard";
import { BarChart } from "../dashboard/charts";
import { ExcelImportModal } from "../modals/ExcelImportModal";

import { PageHeader } from "../shared/PageHeader";
import { FilterToolbar } from "../shared/FilterToolbar";
import { ResultsCount } from "../shared/ResultsCount";
import { ExportDropdown } from "../shared/ExportDropdown";

import { ForecastSkeleton, WEEK_OPTIONS, formatNumber } from "../forecasts";

import { useFetch, useSearch, useImport } from "../../hooks";

import {
  importForecastData,
  getForecastsWithProductData,
} from "../../services/forecast.service";
import { getAllProducts } from "../../services/product.service";
import { exportForecastData } from "../../services/export.service";

import type { ForecastTableData, ForecastImportResult } from "../../services/forecast.service";
import type { ExportFormat } from "../../services/export.service";

// ============== BLOCK 2: Component ==============

export function ForecastsPage() {
  const { toast } = useToast();

  // Week filter
  const [selectedWeeks, setSelectedWeeks] = useState("4");

  // Drawer toggle
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ============== BLOCK 3: Data Fetching ==============

  const { data: forecastData, loading, error, refetch } = useFetch<ForecastTableData>(
    async () => {
      const products = await getAllProducts();
      const productData = products.map((p) => ({
        productCode: p.productCode,
        description: p.description,
        minsPerShipper: p.minsPerShipper || 0,
        unitsPerShipper: p.unitsPerShipper || 0,
      }));
      return getForecastsWithProductData(productData, parseInt(selectedWeeks));
    },
    [selectedWeeks]
  );

  // Search (client-side)
  const rows = forecastData?.rows ?? [];
  const { query, setQuery, filtered: filteredRows } = useSearch(rows, [
    "productCode",
    "description",
  ]);

  // Import modal
  const importModal = useImport(refetch);

  // ============== BLOCK 4: KPI Calculations ==============

  const kpiMetrics = useMemo(() => {
    if (!forecastData) {
      return {
        activeProducts: 0, totalProducts: 0,
        totalDemandUnits: 0, totalDemandHours: 0,
        peakWeek: { label: "-", units: 0 }, avgWeeklyDemand: 0,
      };
    }

    const totalDemandUnits = forecastData.weeklyDemand.reduce((sum, w) => sum + w.totalUnits, 0);
    const totalDemandHours = forecastData.weeklyDemand.reduce((sum, w) => sum + w.totalHours, 0);
    const peakWeek = forecastData.weeklyDemand.reduce(
      (peak, w) => (w.totalUnits > peak.units ? { label: w.weekLabel, units: w.totalUnits } : peak),
      { label: "-", units: 0 }
    );
    const avgWeeklyDemand = forecastData.weeklyDemand.length > 0
      ? totalDemandUnits / forecastData.weeklyDemand.length
      : 0;

    return {
      activeProducts: forecastData.activeProducts,
      totalProducts: forecastData.totalProducts,
      totalDemandUnits, totalDemandHours, peakWeek, avgWeeklyDemand,
    };
  }, [forecastData]);

  // ============== BLOCK 5: Chart Data ==============

  const chartData = useMemo(() => {
    if (!forecastData?.weeklyDemand) {
      return { categories: [] as string[], units: [] as number[], hours: [] as number[] };
    }
    return {
      categories: forecastData.weeklyDemand.map((w) => w.weekLabel),
      units: forecastData.weeklyDemand.map((w) => w.totalUnits),
      hours: forecastData.weeklyDemand.map((w) => w.totalHours),
    };
  }, [forecastData?.weeklyDemand]);

  const chartFormatValue = useCallback(
    (val: number) => `${formatNumber(val)} hrs`,
    []
  );

  // ============== BLOCK 6: Event Handlers ==============

  const handleImport = async (file: File): Promise<ForecastImportResult> => {
    toast.info("Processing forecast data...");
    try {
      const result = await importForecastData(file);
      if (result.pending_review > 0) {
        toast.warning(`${result.imported} records imported. ${result.pending_review} items need review.`);
      } else {
        toast.success(`${result.imported} forecast records imported successfully!`);
      }
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to import forecast data";
      toast.error(message);
      throw err;
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!forecastData || filteredRows.length === 0) {
      toast.warning("No data available to export");
      return;
    }

    try {
      const weekColumns = forecastData.headers
        .filter((h) => h.key !== "productCode" && h.key !== "description")
        .map((h) => ({ key: h.key, label: h.label }));

      const exportData = filteredRows.map((row) => {
        const rowData: Record<string, string | number> = {
          productCode: row.productCode,
          description: row.description,
        };
        weekColumns.forEach((week) => {
          rowData[week.key] = row.weeklyData?.[week.key] || 0;
        });
        return rowData;
      });

      const filename = `forecast_${selectedWeeks}weeks_${new Date().toISOString().split("T")[0]}`;
      exportForecastData(exportData, weekColumns, filename, format);
      toast.success(`Forecast exported as ${format.toUpperCase()}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to export data";
      toast.error(message);
    }
  };

  // ============== BLOCK 7: Loading State ==============

  if (loading) {
    return <ForecastSkeleton />;
  }

  // ============== BLOCK 8: Error State ==============

  if (error) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="error"
            title="Failed to Load Forecasts"
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

  // ============== BLOCK 9: Week Columns ==============

  const weekColumns = forecastData?.headers.filter(
    (h) => h.key !== "productCode" && h.key !== "description"
  ) || [];

  // ============== BLOCK 10: Render ==============

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <PageHeader
            title="Sales Forecasts"
            description="Manage and view forecasted sales data for all products"
            actions={
              <>
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={<ChartBarIcon className="h-4 w-4" />}
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                >
                  {isDrawerOpen ? "Hide Insights" : "Show Insights"}
                </Button>
                <ExportDropdown
                  onExport={handleExport}
                  disabled={!forecastData || filteredRows.length === 0}
                />
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                  onClick={importModal.open}
                >
                  Import Forecast
                </Button>
              </>
            }
          />
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
            title="Active Products" value={kpiMetrics.activeProducts}
            format="number" color="blue"
            trend={{ value: kpiMetrics.totalProducts, isPositive: true }}
            sparklineData={chartData.units.slice(0, 4)}
            sparklineType="bar" sparklineColor="#3b82f6"
          />
          <KPICard
            title="Total Demand" value={kpiMetrics.totalDemandUnits}
            format="number" color="green"
            sparklineData={chartData.units}
            sparklineType="area" sparklineColor="#10b981"
          />
          <KPICard
            title="Total Hours" value={kpiMetrics.totalDemandHours}
            format="hours" color="purple"
            sparklineData={chartData.hours}
            sparklineType="line" sparklineColor="#8b5cf6"
          />
          <KPICard
            title="Peak Week" value={kpiMetrics.peakWeek.units}
            format="number" color="yellow"
            sparklineData={chartData.units}
            sparklineType="bar" sparklineColor="#f59e0b"
          />
        </div>
      </Drawer>

      {/* Demand Chart */}
      {forecastData && forecastData.weeklyDemand.length > 0 && (
        <BarChart
          title="Weekly Demand in Hours"
          subtitle={`Production hours required for next ${selectedWeeks} weeks`}
          data={chartData.hours}
          categories={chartData.categories}
          icon={<ChartBarIcon className="h-6 w-6" />}
          formatValue={chartFormatValue}
        />
      )}

      {/* Table Card */}
      <Card>
        <CardContent className="space-y-4">
          <FilterToolbar
            searchPlaceholder="Search products..."
            searchValue={query}
            onSearchChange={setQuery}
            filters={
              <Select
                options={WEEK_OPTIONS}
                value={selectedWeeks}
                onChange={setSelectedWeeks}
                placeholder="Weeks"
                size="md"
                className="w-36"
              />
            }
          />

          <ResultsCount
            filtered={filteredRows.length}
            total={forecastData?.totalProducts || 0}
            label="products"
            rightContent={
              <Badge variant="subtle" color="primary" size="sm">
                {selectedWeeks} Week View
              </Badge>
            }
          />

          {filteredRows.length > 0 ? (
            <ScrollArea orientation="both" maxHeight="calc(100vh - 400px)">
              <Table stickyHeader hoverable variant="striped" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Head style={{ minWidth: "120px" }}>Product Code</Table.Head>
                    <Table.Head style={{ minWidth: "250px" }}>Description</Table.Head>
                    {weekColumns.map((week) => (
                      <Table.Head
                        key={week.key}
                        style={{ minWidth: "100px" }}
                        className="text-center"
                      >
                        <div className="text-xs font-medium">{week.label}</div>
                      </Table.Head>
                    ))}
                    <Table.Head style={{ minWidth: "100px" }} className="text-center">
                      Total
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredRows.map((row, rowIndex) => {
                    const rowValues = weekColumns.map((week) => row.weeklyData?.[week.key] || 0);
                    const rowTotal = rowValues.reduce((sum, val) => sum + val, 0);

                    return (
                      <Table.Row key={`${row.productCode}-${rowIndex}`}>
                        <Table.Cell>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                            {row.productCode}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {row.description || "-"}
                          </span>
                        </Table.Cell>
                        {weekColumns.map((week) => {
                          const value = row.weeklyData?.[week.key] || 0;
                          return (
                            <Table.Cell key={week.key} className="text-center whitespace-nowrap">
                              {value > 0 ? formatNumber(value) : "-"}
                            </Table.Cell>
                          );
                        })}
                        <Table.Cell className="text-center font-semibold whitespace-nowrap">
                          {rowTotal > 0 ? formatNumber(rowTotal) : "-"}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </ScrollArea>
          ) : (
            <EmptyState
              variant={query ? "search" : "default"}
              title={query ? "No matching products" : "No forecast data"}
              description={
                query
                  ? `No products found matching "${query}"`
                  : "Import a forecast file to get started"
              }
              action={
                !query ? (
                  <Button
                    variant="primary"
                    leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
                    onClick={importModal.open}
                  >
                    Import Forecast
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
        title="Import Sales Forecast"
        onImportComplete={importModal.onComplete}
      />
    </div>
  );
}