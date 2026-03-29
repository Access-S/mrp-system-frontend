// src/features/inventory/InventoryPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/Toast";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { getAllSoh } from "@/services/component.service";
import { getAllProducts } from "@/services/product.service";
import { getAllForecasts } from "@/features/forecasts/services/forecast.service";
import {
  calculateInventoryProjections,
  InventoryProjection,
  exportMrpData,
} from "./services/mrp.service";

// ============== BLOCK 2: Constants & Types ==============

const timeHorizon = 6;

const getHealthColor = (soh: number): string =>
  soh >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

type PriorityFilter = "All" | "High" | "Medium" | "Low";

const PRIORITY_FILTERS: { value: PriorityFilter; label: string; color: string }[] = [
  { value: "All", label: "All Components", color: "gray" },
  { value: "High", label: "Shortage (High)", color: "red" },
  { value: "Medium", label: "At Risk (Medium)", color: "orange" },
  { value: "Low", label: "Healthy (Low)", color: "green" },
];

type SortField = "netHorizonDemand" | "stock" | "coverage";

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "netHorizonDemand", label: "Net Demand" },
  { value: "stock", label: "On Hand" },
  { value: "coverage", label: "Coverage %" },
];

// ============== BLOCK 3: Main Component ==============

export function InventoryPage() {
  const { theme } = useTheme();
  const { toast } = useToast();

  // ============== BLOCK 4: State Management ==============
  const [projections, setProjections] = useState<InventoryProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [sortField, setSortField] = useState<SortField>("netHorizonDemand");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // ============== BLOCK 5: Data Fetching ==============
  useEffect(() => {
    const fetchDataAndCalculate = async () => {
      setLoading(true);
      try {
        const [components, products, forecasts] = await Promise.all([
          getAllSoh(),
          getAllProducts(),
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
  }, [toast]);

  // ============== BLOCK 6: Filtering & Sorting ==============
  const processedProjections = useMemo(() => {
    let result = [...projections];

    if (priorityFilter !== "All") {
      result = result.filter(p => p.priority === priorityFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.component.partCode.toLowerCase().includes(q) ||
          p.displayDescription.toLowerCase().includes(q) ||
          p.skusUsedIn.some(sku => sku.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let valA: number, valB: number;

      switch (sortField) {
        case "netHorizonDemand":
          valA = a.netHorizonDemand;
          valB = b.netHorizonDemand;
          break;
        case "stock":
          valA = a.component.stock;
          valB = b.component.stock;
          break;
        case "coverage":
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

  // ============== BLOCK 7: Table Headers ==============
  const weekHeaders =
    projections[0]?.projections
      .slice(0, timeHorizon)
      .map((p) =>
        new Date(p.week + "T00:00:00").toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        })
      ) || [];

  const TABLE_HEAD = [
    "SKUs",
    "Part Code",
    "Description",
    "On Hand",
    "Net Demand",
    ...weekHeaders,
  ];

  // ============== BLOCK 8: Event Handlers ==============
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleExport = () => {
    if (projections.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const exportData = exportMrpData(projections);
      const csv = [
        Object.keys(exportData[0]).join(','),
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

  // ============== BLOCK 9: Render ==============
  return (
    <Card variant="bordered" className={`w-full ${theme.cards} shadow-sm`}>
      <div className={`p-4 border-b ${theme.borderColor}`}>
        <span className={`text-lg font-semibold ${theme.text}`}>
          Inventory Planning Dashboard
        </span>
      </div>

      <div className={`p-4 border-b ${theme.borderColor} flex flex-wrap gap-3 items-center`}>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_FILTERS.map(({ value, label, color }) => (
            <Button
              key={value}
              variant={priorityFilter === value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setPriorityFilter(value)}
              className={priorityFilter === value ? "" : "text-gray-700 dark:text-gray-300"}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex-grow"></div>

        <Button
          onClick={handleExport}
          size="sm"
          variant="primary"
          leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
        >
          Export Recommendations
        </Button>
      </div>

      <div className={`p-4 border-b ${theme.borderColor}`}>
        <Input
          label="Search by Part Code, Description, or SKU"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
        />
      </div>

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

      {/* ============== BLOCK 10: Data Table ============== */}
      <CardContent className="overflow-x-auto p-0">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner size="lg" />
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
                    <span className={`text-sm font-semibold ${theme.text}`}>
                      {head}
                    </span>
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
                  netHorizonDemand,
                  projections,
                }) => (
                  <React.Fragment key={component.id || component.partCode}>
                    <tr className={`border-b ${theme.borderColor}`}>
                      <td className="p-2 align-top">
                        <div className="flex flex-col">
                          {skusUsedIn.map((sku) => (
                            <span key={sku} className={`text-sm ${theme.text} opacity-80`}>
                              {sku}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        <span className={`text-sm font-bold ${theme.text}`}>
                          {component.partCode}
                        </span>
                      </td>
                      <td className="p-2 align-top">
                        <span className={`text-sm ${theme.text}`}>
                          {displayDescription}
                        </span>
                      </td>
                      <td className="p-2 align-top">
                        <span className={`text-sm font-semibold ${theme.text}`}>
                          {component.stock.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-2 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            netHorizonDemand > 0
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {netHorizonDemand.toLocaleString()}
                        </span>
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td key={`${p.week}-demand`} className="p-2 text-center align-top">
                          <span className="text-sm font-semibold">{p.totalDemand.toLocaleString()}</span>
                        </td>
                      ))}
                    </tr>
                    <tr className={`border-b ${theme.borderColor}`}>
                      <td className="p-2 font-semibold text-xs text-gray-500" colSpan={5}>
                        Coverage %
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td key={`${p.week}-coverage`} className="p-2 text-center">
                          <span
                            className={`text-sm ${
                              p.coveragePercentage < 100
                                ? "text-red-500 font-semibold"
                                : "text-green-500"
                            }`}
                          >
                            {p.coveragePercentage.toFixed(0)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className={`border-b-4 ${theme.borderColor}`}>
                      <td className="p-2 font-semibold text-xs text-gray-500" colSpan={5}>
                        Projected SOH
                      </td>
                      {projections.slice(0, timeHorizon).map((p) => (
                        <td
                          key={`${p.week}-soh`}
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
            <span className={`${theme.text} opacity-70`}>
              No inventory projections match your filters.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}