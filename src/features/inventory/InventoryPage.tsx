// src/features/inventory/InventoryPage.tsx

// ============== BLOCK 1: Imports ==============
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/shadcn-ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/Toast";
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { getAllSoh } from "@/features/products/services/component.service";
import { getAllProducts } from "@/features/products";
import { getAllForecasts } from "@/features/forecasts/services/forecast.service";
import {
  calculateInventoryProjections,
  InventoryProjection,
  exportMrpData,
} from './services/inventory.service';
import type { Component } from './types/inventory.types';

// ============== BLOCK 2: Constants & Types ==============
const TIME_HORIZON = 52;
const WEEKS_PER_MONTH = 4.33;

type PriorityFilter = "All" | "High" | "Medium" | "Low";
type SortField = "partCode" | "totalRequirement" | "stock" | "monthsCoverage";

const PRIORITY_FILTERS: { value: PriorityFilter; label: string }[] = [
  { value: "All", label: "All Components" },
  { value: "High", label: "Shortage (High)" },
  { value: "Medium", label: "At Risk (Medium)" },
  { value: "Low", label: "Healthy (Low)" },
];

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "partCode", label: "Part Code" },
  { value: "totalRequirement", label: "Total Demand" },
  { value: "stock", label: "Stock on Hand" },
  { value: "monthsCoverage", label: "Months Coverage" },
];

// Sticky column config (widths in px)
const STICKY = {
  partCode: { w: 150, left: 0 },
  type: { w: 120, left: 150 },
  fgUsedIn: { w: 180, left: 270 },
  description: { w: 250, left: 450 },
};

// ============== BLOCK 3: Helper Functions ==============
const generateWeekHeaders = (startDate?: Date): string[] => {
  const start = startDate || new Date();
  const day = start.getDay();
  const daysToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(start);
  monday.setDate(start.getDate() + daysToMonday);

  return Array.from({ length: TIME_HORIZON }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i * 7);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
  });
};

const getHealthColor = (val: number, threshold = 0): string =>
  val >= threshold ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400 font-semibold";

const fmt = (n?: number) => n == null || isNaN(n) ? "–" : n.toLocaleString();
const fmtCur = (n?: number) => n == null || isNaN(n) ? "–" : `$${n.toFixed(2)}`;
const calcMonthsCoverage = (soh: number, avgWeekly: number) =>
  avgWeekly > 0 ? (soh / avgWeekly) / WEEKS_PER_MONTH : 999;

// ============== BLOCK 4: Main Component ==============
export function InventoryPage() {
  const { theme } = useTheme();
  const { toast } = useToast();

  // ============== BLOCK 5: State Management ==============
  const [projections, setProjections] = useState<InventoryProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [sortField, setSortField] = useState<SortField>("partCode");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [weekHeaders] = useState(() => generateWeekHeaders());

  // ============== BLOCK 6: Data Fetching ==============
  useEffect(() => {
    let isMounted = true;

    const fetchDataAndCalculate = async () => {
      setLoading(true);
      try {
        const [components, products, forecasts] = await Promise.all([
          getAllSoh(),
          getAllProducts(),
          getAllForecasts(),
        ]);

        if (!isMounted) return;

        const calculated = calculateInventoryProjections(components, products, forecasts);
        setProjections(calculated);
      } catch (error) {
        console.error("Failed to load inventory data:", error);
        if (isMounted) {
          setProjections([]); // Set empty state on error
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDataAndCalculate();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Empty dependency array - runs once on mount

  // ============== BLOCK 7: Filtering & Sorting ==============
  const processedProjections = useMemo(() => {
    let result = [...projections];

    if (priorityFilter !== "All") {
      result = result.filter(p => p.priority === priorityFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.component.partCode.toLowerCase().includes(q) ||
        p.displayPartType.toLowerCase().includes(q) ||
        p.displayDescription.toLowerCase().includes(q) ||
        p.skusUsedIn.some(sku => sku.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let valA: number | string, valB: number | string;
      switch (sortField) {
        case "partCode":
          valA = a.component.partCode.toLowerCase();
          valB = b.component.partCode.toLowerCase();
          break;
        case "totalRequirement":
          valA = a.totalRequirement || 0;
          valB = b.totalRequirement || 0;
          break;
        case "stock":
          valA = a.component.stock;
          valB = b.component.stock;
          break;
        case "monthsCoverage":
          valA = a.monthsCoverage || 0;
          valB = b.monthsCoverage || 0;
          break;
        default: return 0;
      }
      if (typeof valA === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
  }, [projections, priorityFilter, searchQuery, sortField, sortDirection]);

  // ============== BLOCK 8: Event Handlers ==============
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const handleExport = useCallback(() => {
    if (projections.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      const exportData = exportMrpData(projections);
      const headers = [
        "Part Code", "Type", "FG Used In", "Description",
        ...Array.from({ length: TIME_HORIZON }, (_, i) => `Week ${i + 1}`),
        "Total Requirement", "SOH", "Purchasing Requirement",
        "Months Coverage", "Supplier", "Unit Price"
      ];

      const csv = [
        headers.join(','),
        ...exportData.map(row =>
          Object.values(row)
            .map(value => {
              const str = String(value ?? "");
              if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mrp-inventory-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Exported to CSV");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export");
    }
  }, [projections, toast]);

  // ============== BLOCK 9: Render ==============
  if (loading) {
    return (
      <Card variant="bordered" className={`w-full ${theme.cards} shadow-sm`}>
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card variant="bordered" className={`w-full ${theme.cards} shadow-sm`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme.borderColor} flex flex-wrap gap-3 items-center justify-between`}>
        <h2 className={`text-lg font-semibold ${theme.text}`}>Inventory Planning Dashboard</h2>
        <Button onClick={handleExport} size="sm" variant="primary" leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className={`p-4 border-b ${theme.borderColor} flex flex-wrap gap-3 items-center`}>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              variant={priorityFilter === value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setPriorityFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="flex-grow min-w-[200px]">
          <Input
            placeholder="Search parts, types, FG codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
            className="w-full"
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className={`px-4 py-2 ${theme.borderColor} flex flex-wrap gap-4 text-sm border-b`}>
        <span className={`${theme.text} opacity-80 font-medium`}>Sort by:</span>
        {SORT_FIELDS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSort(value)}
            className={`flex items-center gap-1 font-medium ${sortField === value ? "text-emerald-600 dark:text-emerald-400" : `${theme.text} opacity-70 hover:opacity-100`
              }`}
          >
            {label}
            {sortField === value && <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <CardContent className="overflow-x-auto p-0 relative">
        <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-background/90 to-transparent pointer-events-none z-10" />

        {processedProjections.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No results match your filters.</div>
        ) : (
          <Table className="min-w-[2400px]">
            <TableHeader className="bg-muted/40 sticky top-0 z-30">
              <TableRow className="hover:bg-transparent">
                {/* Sticky Columns */}
                <TableHead className="sticky z-30 bg-muted/40 border-r font-semibold" style={{ width: STICKY.partCode.w, left: STICKY.partCode.left }}>Part Code</TableHead>
                <TableHead className="sticky z-30 bg-muted/40 border-r font-semibold" style={{ width: STICKY.type.w, left: STICKY.type.left }}>Type</TableHead>
                <TableHead className="sticky z-30 bg-muted/40 border-r font-semibold" style={{ width: STICKY.fgUsedIn.w, left: STICKY.fgUsedIn.left }}>FG Used In</TableHead>
                <TableHead className="sticky z-30 bg-muted/40 border-r pr-4 font-semibold" style={{ width: STICKY.description.w, left: STICKY.description.left }}>Description</TableHead>

                {/* 52 Week Columns */}
                {weekHeaders.map((h, i) => (
                  <TableHead key={i} className="text-center text-xs px-2 min-w-[65px] border-r last:border-r-0">{h}</TableHead>
                ))}

                {/* Summary Columns */}
                <TableHead className="font-bold bg-muted/60 min-w-[110px] text-center">Total Req</TableHead>
                <TableHead className="font-bold bg-muted/60 min-w-[90px] text-center">SOH</TableHead>
                <TableHead className="font-bold bg-muted/60 min-w-[120px] text-center">Purch. Req</TableHead>
                <TableHead className="font-bold bg-muted/60 min-w-[100px] text-center">Mos. Cov</TableHead>
                <TableHead className="font-bold bg-muted/60 min-w-[130px]">Supplier</TableHead>
                <TableHead className="font-bold bg-muted/60 min-w-[100px] text-right">Unit Price</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className={theme.text}>
              {processedProjections.map((item) => {
                const totalReq = item.totalRequirement || item.projections.reduce((s, p) => s + p.totalDemand, 0);
                const avgWeekly = totalReq / TIME_HORIZON;
                const purchReq = item.purchasingRequirement ?? Math.max(0, totalReq - item.component.stock);
                const mosCov = item.monthsCoverage ?? calcMonthsCoverage(item.component.stock, avgWeekly);
                const key = item.component.id || item.component.partCode;

                return (
                  <TableRow key={key} className="group hover:bg-accent/40 border-b last:border-b-0">
                    {/* Sticky: Part Code */}
                    <TableCell className="sticky z-20 bg-background/98 group-hover:bg-accent/40 border-r font-mono font-bold text-sm" style={{ width: STICKY.partCode.w, left: STICKY.partCode.left }}>
                      {item.component.partCode}
                    </TableCell>

                    {/* Sticky: Type */}
                    <TableCell className="sticky z-20 bg-background/98 group-hover:bg-accent/40 border-r" style={{ width: STICKY.type.w, left: STICKY.type.left }}>
                      <Badge variant="secondary" className="text-xs">{item.displayPartType || "–"}</Badge>
                    </TableCell>

                    {/* Sticky: FG Used In */}
                    <TableCell className="sticky z-20 bg-background/98 group-hover:bg-accent/40 border-r" style={{ width: STICKY.fgUsedIn.w, left: STICKY.fgUsedIn.left }}>
                      <div className="flex flex-wrap gap-1">
                        {item.skusUsedIn.slice(0, 4).map(sku => (
                          <span key={sku} className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{sku}</span>
                        ))}
                        {item.skusUsedIn.length > 4 && <span className="text-[10px] text-muted-foreground">+{item.skusUsedIn.length - 4}</span>}
                      </div>
                    </TableCell>

                    {/* Sticky: Description */}
                    <TableCell className="sticky z-20 bg-background/98 group-hover:bg-accent/40 border-r pr-4 text-sm" style={{ width: STICKY.description.w, left: STICKY.description.left }}>
                      {item.displayDescription}
                    </TableCell>

                    {/* 52 Week Demand Cells */}
                    {item.projections.slice(0, TIME_HORIZON).map((p, i) => (
                      <TableCell key={i} className="text-center py-2 px-1.5 min-w-[65px] border-r last:border-r-0">
                        {p.totalDemand > 0 ? (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{fmt(p.totalDemand)}</span>
                        ) : <span className="text-xs text-muted-foreground">–</span>}
                      </TableCell>
                    ))}

                    {/* Summary Columns */}
                    <TableCell className="text-center font-semibold bg-muted/20">{fmt(totalReq)}</TableCell>
                    <TableCell className={`text-center font-bold ${getHealthColor(item.component.stock)}`}>{fmt(item.component.stock)}</TableCell>
                    <TableCell className="text-center">
                      {purchReq > 0 ? <Badge variant="destructive" className="text-xs">{fmt(purchReq)}</Badge> : <span className="text-muted-foreground">–</span>}
                    </TableCell>
                    <TableCell className="text-center text-sm">{isFinite(mosCov) && mosCov < 999 ? mosCov.toFixed(1) : "∞"}</TableCell>
                    <TableCell className="text-sm opacity-90">{item.component.supplier || "–"}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{fmtCur(item.component.unitCost)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Footer */}
      <div className={`px-4 py-3 border-t ${theme.borderColor} text-xs ${theme.text} opacity-70 flex justify-between items-center`}>
        <span>Showing {processedProjections.length} of {projections.length} components</span>
        <span>52-week horizon • Weeks start Monday</span>
      </div>
    </Card>
  );
}