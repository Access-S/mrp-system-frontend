// src/components/pages/ForecastsPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Typography,
  Card,
  CardBody,
  Spinner,
  Input,
} from "@material-tailwind/react";
import { ArrowUpTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { ExcelImportModal } from "../modals/ExcelImportModal";
import { getAllForecastsTable, importForecastData } from "../../services/forecast.service";
import toast from "react-hot-toast";

// BLOCK 2: Main ForecastsPage Component
export function ForecastsPage() {
  // BLOCK 3: State Management
  const { theme } = useTheme();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [tableData, setTableData] = useState<{
    headers: { key: string; label: string }[];
    rows: Record<string, any>[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // BLOCK 4: Handlers and Effects
  const handleOpenImportModal = () => setIsImportModalOpen((cur) => !cur);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllForecastsTable();
      setTableData(data);
    } catch (error) {
      console.error("Failed to fetch forecasts:", error);
      toast.error("Failed to load forecast data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForecastImport = async (file: File) => {
    const loadingToast = toast.loading(
      "Importing and processing forecast data..."
    );
    try {
      await importForecastData(file);
      toast.dismiss(loadingToast);
      toast.success("Forecast data imported successfully! Refreshing data...");
      fetchData();
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Import failed: ${error.message}`);
    }
  };

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!tableData || !searchQuery) return tableData?.rows || [];

    const q = searchQuery.toLowerCase();
    return tableData.rows.filter(row =>
      (row.product_code?.toString() || "").toLowerCase().includes(q) ||
      (row.description?.toString() || "").toLowerCase().includes(q)
    );
  }, [tableData, searchQuery]);

  // BLOCK 5: Render Logic
  return (
    <>
      <Card className={`w-full ${theme.cards} shadow-sm`}>
        {/* Page Header */}
        <div
          className={`flex flex-wrap items-center justify-between p-4 border-b ${theme.borderColor}`}
        >
          <div>
            <Typography variant="h5" className={theme.text}>
              Sales Forecasts
            </Typography>
            <Typography
              color="gray"
              className={`mt-1 font-normal ${theme.text} opacity-80`}
            >
              Manage and view forecasted sales data for all products.
            </Typography>
          </div>
          <div>
            <Button
              onClick={handleOpenImportModal}
              className="flex items-center gap-3"
              size="sm"
            >
              <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Import
              Forecast
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`p-4 border-b ${theme.borderColor}`}>
          <Input
            label="Search by Product Code or Description"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Forecast Table */}
        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : filteredRows.length > 0 ? (
            <div className={`border-2 ${theme.borderColor} rounded-lg m-4`}>
              <table className="w-full min-w-max table-auto text-left border-collapse">
                <thead className={`border-b-2 ${theme.borderColor}`}>
                  <tr>
                    {tableData?.headers.map((header, index) => {
                      // Center-align everything by default
                      let align = "center";
                      if (header.key === "description") {
                        align = "left";
                      }

                      let thClasses = `${theme.tableHeaderBg} p-4 text-${align}`;
                      if (index < (tableData?.headers.length || 0) - 1) {
                        thClasses += ` border-r ${theme.borderColor}`;
                      }

                      return (
                        <th key={header.key} className={thClasses}>
                          <Typography
                            variant="small"
                            className={`font-semibold leading-none ${theme.text}`}
                          >
                            {header.label}
                          </Typography>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className={theme.hoverBg}>
                      {tableData?.headers.map((header, colIndex) => {
                        const isLast = colIndex === (tableData?.headers.length || 0) - 1;
                        let align = "center";
                        if (header.key === "description") {
                          align = "left";
                        }

                        const tdClasses = `p-2 border-b ${theme.borderColor} text-${align}${!isLast ? ' border-r' : ''}`;

                        return (
                          <td key={header.key} className={tdClasses}>
                            <Typography
                              variant="small"
                              className={`font-normal ${theme.text}`}
                            >
                              {row[header.key] ?? "-"}
                            </Typography>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Typography color="gray" className={theme.text}>
                No forecast data loaded. Click "Import Forecast" to upload an Excel file.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>

      <ExcelImportModal
        open={isImportModalOpen}
        handleOpen={handleOpenImportModal}
        onImport={handleForecastImport}
        title="Import Sales Forecast"
      />
    </>
  );
}