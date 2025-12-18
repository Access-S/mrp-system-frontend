// src/components/pages/InventoryPage.tsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Card,
  Spinner,
  CardBody,
  Input,
  Chip,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { getAllSoh } from "../../services/inventory.service";
import { fetchAllProducts } from "../../services/api.service";
import { getAllForecasts } from "../../services/forecast.service";
import {
  calculateInventoryProjections,
  InventoryProjection,
  exportMrpData,
} from "../../services/mrp.service";
import toast from "react-hot-toast";

const timeHorizon = 6;
const getHealthColor = (soh: number) =>
  soh >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

// Priority filter options
type PriorityFilter = "All" | "High" | "Medium" | "Low";
const PRIORITY_FILTERS: { value: PriorityFilter; label: string; color: string }[] = [
  { value: "All", label: "All Components", color: "gray" },
  { value: "High", label: "Shortage (High)", color: "red" },
  { value: "Medium", label: "At Risk (Medium)", color: "orange" },
  { value: "Low", label: "Healthy (Low)", color: "green" },
];

// Sort field options
type SortField = "netFourMonthDemand" | "stock" | "coverage";
const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "netFourMonthDemand", label: "Net Demand (4m)" },
  { value: "stock", label: "On Hand" },
  { value: "coverage", label: "Coverage %" },
];

// BLOCK 3: Main InventoryPage Component
export function InventoryPage() {
  const { theme } = useTheme();
  const [projections, setProjections] = useState<InventoryProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [sortField, setSortField] = useState<SortField>("netFourMonthDemand");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchDataAndCalculate = async () => {
      setLoading(true);
      try {
        const [components, products, forecasts] = await Promise.all([
          getAllSoh(),
          fetchAllProducts(),
          getAllForecasts(),
        ]);
        const calculatedProjections = calculateInventoryProjections(
          components,
          products,
          forecasts
        );
        setProjections(calculatedProjections);
      } catch (error) {
        console.error("Failed to fetch or calculate inventory data:", error);
        toast.error("Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndCalculate();
  }, []);

  // Apply filtering and sorting
  const processedProjections = useMemo(() => {
    let result = [...projections];

    // Priority filter
    if (priorityFilter !== "All") {
      result = result.filter(p => p.priority === priorityFilter);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.component.partCode.toLowerCase().includes(q) ||
          p.displayDescription.toLowerCase().includes(q) ||
          p.skusUsedIn.some(sku => sku.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA: number, valB: number;

      switch (sortField) {
        case "netFourMonthDemand":
          valA = a.netFourMonthDemand;
          valB = b.netFourMonthDemand;
          break;
        case "stock":
          valA = a.component.stock;
          valB = b.component.stock;
          break;
        case "coverage":
          // Use coverage % of first month (or 100 if no projections)
          valA = a.projections[0]?.coveragePercentage ?? 100;
          valB = b.projections[0]?.coveragePercentage ?? 100;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });

    return result;
  }, [projections, priorityFilter, searchQuery, sortField, sortDirection]);

  const monthHeaders =
    projections[0]?.projections
      .slice(0, timeHorizon)
      .map((p) =>
        new Date(p.month + "-02").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        })
      ) || [];

  const TABLE_HEAD = [
    "SKUs",
    "Part Code",
    "Description",
    "On Hand",
    "Net Demand (4m)",
    ...monthHeaders,
  ];

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (projections.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const exportData = exportMrpData(projections);
      const csv = [
        // Header row
        Object.keys(exportData[0]).join(','),
        // Data rows
        ...exportData.map(row => 
          Object.values(row)
            .map(value => `"${String(value).replace(/"/g, '""')}"`)
            .join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "mrp-recommendations.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Exported MRP recommendations to CSV");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Card className={`w-full ${theme.cards} shadow-sm`}>
      {/* Page Header */}
      <div className={`p-4 border-b ${theme.borderColor}`}>
        <Typography variant="h5" className={theme.text}>
          Inventory Planning Dashboard
        </Typography>
      </div>

      {/* Controls: Filters, Search, Export */}
      <div className={`p-4 border-b ${theme.borderColor} flex flex-wrap gap-3 items-center`}>
        {/* Priority Filters */}
        <div className="flex flex-wrap gap-2">
          {PRIORITY_FILTERS.map(({ value, label, color }) => (
            <Button
              key={value}
              variant={priorityFilter === value ? "filled" : "outlined"}
              color={priorityFilter === value ? color : "gray"}
              size="sm"
              onClick={() => setPriorityFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export Recommendations
        </Button>
      </div>

      {/* Search Bar */}
      <div className={`p-4 border-b ${theme.borderColor}`}>
        <Input
          label="Search by Part Code, Description, or SKU"
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          color={theme.isDark ? "white" : "black"}
        />
      </div>

      {/* Sorting Controls */}
      <div className={`px-4 py-2 ${theme.borderColor} flex flex-wrap gap-4 text-sm`}>
        <span className={`${theme.text} opacity-80`}>Sort by:</span>
        {SORT_FIELDS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSort(value)}
            className={`flex items-center gap-1 font-medium ${
              sortField === value ? "text-blue-600 underline" : theme.text + " opacity-80 hover:opacity-100"
            }`}
          >
            {label}
            {sortField === value && (
              <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
            )}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <CardBody className="overflow-x-auto p-0">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner className="h-12 w-12" />
          </div>
        ) : processedProjections.length > 0 ? (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className={`p-2 border-b-2 ${theme.borderColor} ${theme.tableHeaderBg}`}
                  >
                    <Typography
                      variant="small"
                      className={`font-semibold ${theme.text}`}
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedProjections.map(
                ({
                  component,
                  skusUsedIn,
                  displayDescription,
                  netFourMonthDemand,
                  projections,
                }) => (
                  <React.Fragment key={component.id || component.partCode}>
                    {/* Row 1: Forecast Demand */}
                    <tr className={`border-b ${theme.borderColor}`}>
                      <td className="p-2 align-top">
                        <div className="flex flex-col">
                          {skusUsedIn.map((sku) => (
                            <Typography
                              key={sku}
                              variant="small"
                              className={`${theme.text} opacity-80`}
                            >
                              {sku}
                            </Typography>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        <Typography
                          variant="small"
                          className={`font-bold ${theme.text}`}
                        >
                          {component.partCode}
                        </Typography>
                      </td>
                      <td className="p-2 align-top">
                        <Typography variant="small" className={theme.text}>
                          {displayDescription}
                        </Typography>
                      </td>
                      <td className="p-2 align-top">
                        <Typography
                          variant="small"
                          className={`font-semibold ${theme.text}`}
                        >
                          {component.stock.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-2 align-top">
                        <Chip
                          value={netFourMonthDemand.toLocaleString()}
                          color={netFourMonthDemand > 0 ? "red" : "green"}
                          variant="ghost"
                        />
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td
                          key={`${p.month}-demand`}
                          className="p-2 text-center align-top"
                        >
                          <Typography variant="small" className="font-semibold">
                            {p.totalDemand.toLocaleString()}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                    {/* Row 2: Coverage % */}
                    <tr className={`border-b ${theme.borderColor}`}>
                      <td
                        className="p-2 font-semibold text-xs text-gray-500"
                        colSpan={5}
                      >
                        Coverage %
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td
                          key={`${p.month}-coverage`}
                          className="p-2 text-center"
                        >
                          <Typography
                            variant="small"
                            className={
                              p.coveragePercentage < 100
                                ? "text-red-500 font-semibold"
                                : "text-green-500"
                            }
                          >
                            {p.coveragePercentage.toFixed(0)}%
                          </Typography>
                        </td>
                      ))}
                    </tr>
                    {/* Row 3: Projected SOH */}
                    <tr className={`border-b-4 ${theme.borderColor}`}>
                      <td
                        className="p-2 font-semibold text-xs text-gray-500"
                        colSpan={5}
                      >
                        Projected SOH
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td
                          key={`${p.month}-soh`}
                          className={`p-2 text-center font-semibold rounded ${getHealthColor(
                            p.projectedSoh
                          )}`}
                        >
                          {p.projectedSoh.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <Typography color="gray" className={theme.text}>
              No inventory projections match your filters.
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>
  );
}