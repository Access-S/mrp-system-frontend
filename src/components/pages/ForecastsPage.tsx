// src/components/pages/ForecastsPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  CardBody,
  ButtonGroup,
  Spinner,
} from "@material-tailwind/react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { ExcelImportModal } from "../modals/ExcelImportModal";
import { getAllForecastsTable, importForecastData } from "../../services/forecast.service";
import toast from "react-hot-toast";

// BLOCK 2: Constants
type TimeHorizon = 4 | 6 | 9 | 12 | "All";
const TIME_HORIZONS: TimeHorizon[] = [4, 6, 9, 12, "All"];

// BLOCK 3: Main ForecastsPage Component
export function ForecastsPage() {
  // BLOCK 4: State Management
  const { theme } = useTheme();
  const [activeHorizon, setActiveHorizon] = useState<TimeHorizon>("All");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [tableData, setTableData] = useState<{
    headers: { key: string; label: string }[];
    rows: Record<string, any>[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // BLOCK 5: Handlers and Effects
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
      fetchData(); // Re-fetch the data to show the new/updated forecasts
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Import failed: ${error.message}`);
    }
  };

  // Filter columns based on time horizon
  const filteredHeaders = tableData
    ? activeHorizon === "All"
      ? tableData.headers
      : tableData.headers.slice(0, 2 + (activeHorizon as number)) // 2 = product + description
    : [];

  const filteredRows = tableData
    ? tableData.rows.map(row => {
        const newRow: Record<string, any> = {};
        filteredHeaders.forEach(h => {
          newRow[h.key] = row[h.key];
        });
        return newRow;
      })
    : [];

  // BLOCK 6: Render Logic
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

        {/* Time Horizon Toggles */}
        <div
          className={`flex flex-wrap items-center justify-between p-4 border-b ${theme.borderColor}`}
        >
          <Typography variant="h6" className={theme.text}>
            View Horizon
          </Typography>
          <ButtonGroup variant="outlined">
            {TIME_HORIZONS.map((horizon) => (
              <Button
                key={horizon}
                onClick={() => setActiveHorizon(horizon)}
                className={
                  activeHorizon === horizon
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }
              >
                {horizon === "All" ? "All" : `${horizon}m`}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Forecast Table */}
        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : filteredRows.length > 0 ? (
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {filteredHeaders.map((header) => (
                    <th
                      key={header.key}
                      className={`border-b-2 ${theme.borderColor} ${theme.tableHeaderBg} p-4`}
                    >
                      <Typography
                        variant="small"
                        className={`font-semibold leading-none ${theme.text}`}
                      >
                        {header.label}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={index} className={theme.hoverBg}>
                    {filteredHeaders.map((header) => (
                      <td
                        key={header.key}
                        className={`p-4 border-b ${theme.borderColor} text-center`}
                      >
                        <Typography
                          variant="small"
                          className={`font-normal ${theme.text}`}
                        >
                          {row[header.key] ?? "-"}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <Typography color="gray" className={theme.text}>
                No forecast data loaded. Click "Import Forecast" to upload an
                Excel file.
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