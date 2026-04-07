// dev/UITestPage2.tsx 
// 
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// --- SHADCN IMPORTS ---
import { Button as ShadcnButton } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import { Badge as ShadcnBadge } from "@/components/shadcn-ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/dropdown-menu";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";

// --- TANSTACK IMPORTS ---
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

// ============== BLOCK 1: Data & Types ==============

// 1. Define what your data looks like
export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  inventory: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
};

// 2. Generate Fake Data
const statuses = ["In Stock", "Low Stock", "Out of Stock"] as const;
const categories = ["Raw Materials", "Electronics", "Packaging", "Finished Goods"];

const sampleData: InventoryItem[] = Array.from({ length: 250 }, (_, i) => ({
  id: `INV-${i + 1}`,
  name: `Component X-${String(i + 1).padStart(4, "0")}`,
  sku: `SKU-${String(i + 1).padStart(4, "0")}`,
  category: categories[Math.floor(Math.random() * categories.length)],
  inventory: Math.floor(Math.random() * 5000),
  status: statuses[Math.floor(Math.random() * statuses.length)],
  price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
}));

// ============== BLOCK 2: Column Definitions ==============
// This is where TanStack shines. You define the logic for each column once.

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "name",
    // Let's make this column sortable!
    header: ({ column }) => {
      return (
        <ShadcnButton
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4" // slight offset to align text
        >
          Component Name
          {/* Simple sort arrow indicator */}
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </ShadcnButton>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "inventory",
    header: () => <div className="text-right">Stock</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("inventory"));
      return <div className="text-right font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center">
          <ShadcnBadge variant={status === "In Stock" ? "default" : status === "Low Stock" ? "secondary" : "destructive"}>
            {status}
          </ShadcnBadge>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Unit Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    // This is a custom column just for the Dropdown menu!
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ShadcnButton variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                •••
              </ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.sku)}>
                Copy SKU
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive">
                Delete item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// ============== BLOCK 3: Component ==============

const UITestPage2: React.FC = () => {
  const { theme } = useTheme();

  // TanStack State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Initialize TanStack Table!
  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 15, // Default to 15 rows per page
      },
    },
  });

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>TanStack Data Table</h1>
        <p className={`${theme.text} opacity-60 mt-1`}>
          A fully featured Headless UI Table with Shadcn styling.
        </p>
      </div>

      <section className="bg-card rounded-xl p-6 shadow-sm border border-border">

        {/* TOP TOOLBAR: Search & Actions */}
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm bg-background border-border"
          />
          <ShadcnButton variant="outline">Export CSV</ShadcnButton>
        </div>

        {/* THE TABLE */}
        <div className="rounded-md border border-border bg-background overflow-hidden">
          <ShadcnTable>
            <TableHeader className="bg-card">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {/* flexRender is the magic function that paints your UI */}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ShadcnTable>
        </div>

        {/* BOTTOM TOOLBAR: Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </ShadcnButton>
            <ShadcnButton
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </ShadcnButton>
          </div>
        </div>

      </section>
    </div>
  );
};

export default UITestPage2;