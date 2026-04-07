// dev/UITestPage2.tsx 
// 
// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pagination, PaginationInfo } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";


// --- NEW SHADCN IMPORTS ---
import { Button as ShadcnButton } from "@/components/shadcn-ui/button";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-ui/table";
import { Badge as ShadcnBadge } from "@/components/shadcn-ui/badge";

// ============== BLOCK 2: Sample Data ==============
const statuses = ["In Stock", "Low Stock", "Out of Stock"];
const categories = ["Raw Materials", "Electronics", "Packaging", "Finished Goods"];

const sampleData = Array.from({ length: 250 }, (_, i) => {
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return {
    id: i + 1,
    name: `Component X-${String(i + 1).padStart(4, "0")}`,
    sku: `SKU-${String(i + 1).padStart(4, "0")}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    inventory: Math.floor(Math.random() * 5000),
    status: status,
    price: `$${(Math.random() * 500 + 10).toFixed(2)}`,
  };
});

// ============== BLOCK 3: Component ==============

const UITestPage2: React.FC = () => {
  const { theme } = useTheme();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Calculate paginated data for table
  const paginatedData = sampleData.slice(
    (tableCurrentPage - 1) * itemsPerPage,
    tableCurrentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);

  // ============== BLOCK 4: Render ==============

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>UI Components Test - Page 2</h1>
        <p className={`${theme.text} opacity-60 mt-1`}>
          Testing additional UI components (Pagination, Badge, Avatar, Tooltip, Breadcrumb)
        </p>
      </div>

      {/* ============== NEW SHADCN TEST SECTION ============== */}
      <section className={`bg-card rounded-xl p-6 shadow-sm border border-border border-l-4 border-l-primary`}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">✨ New Shadcn UI Integration</h2>
          <p className="text-muted-foreground mt-1">
            Testing the new OLED Dark Mode with Neon Emerald Primary Color. Click these to test the focus ring!
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Shadcn Button Variants</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ShadcnButton variant="default">Primary (Emerald)</ShadcnButton>
              <ShadcnButton variant="secondary">Secondary</ShadcnButton>
              <ShadcnButton variant="destructive">Destructive</ShadcnButton>
              <ShadcnButton variant="outline">Outline</ShadcnButton>
              <ShadcnButton variant="ghost">Ghost</ShadcnButton>
              <ShadcnButton variant="link">Link Style</ShadcnButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 5: Badge Section ============== */}
      {/* (Skipping for brevity, keeping existing code) */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Badge</h2>
        <div className="space-y-8">
          <Badge variant="solid" color="primary">Legacy Badge Test</Badge>
        </div>
      </section>

      {/* ============== BLOCK 10: ADVANCED SHADCN TABLE ============== */}

      <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Inventory Master List
            </h2>
            <p className="text-sm text-muted-foreground">Showing 25 rows per page with sticky headers.</p>
          </div>
          <div className="space-x-2">
            <ShadcnButton variant="outline" size="sm">Filter</ShadcnButton>
            <ShadcnButton variant="default" size="sm">Export CSV</ShadcnButton>
          </div>
        </div>

        {/* SHADCN TABLE CONTAINER - Fixed height for scrolling! */}
        <div className="rounded-md border border-border bg-background overflow-hidden">
          <div className="max-h-[600px] overflow-auto relative">
            <ShadcnTable>
              {/* STICKY HEADER */}
              <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] py-3">ID</TableHead>
                  <TableHead className="py-3">Component Name</TableHead>
                  <TableHead className="py-3">SKU</TableHead>
                  <TableHead className="py-3">Category</TableHead>
                  <TableHead className="py-3 text-right">Stock</TableHead>
                  <TableHead className="py-3 text-center">Status</TableHead>
                  <TableHead className="py-3 text-right">Unit Price</TableHead>
                  <TableHead className="py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-medium text-foreground py-2">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-foreground py-2">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground py-2">
                      {item.sku}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm py-2">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground py-2">
                      {item.inventory.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <ShadcnBadge
                        variant={
                          item.status === "In Stock" ? "default" :
                            item.status === "Low Stock" ? "secondary" : "destructive"
                        }
                      >
                        {item.status}
                      </ShadcnBadge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground py-2">
                      {item.price}
                    </TableCell>
                    <TableCell className="text-right py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShadcnButton variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        Edit
                      </ShadcnButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ShadcnTable>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-border">
          <PaginationInfo
            currentPage={tableCurrentPage}
            totalPages={totalPages}
            totalItems={sampleData.length}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            currentPage={tableCurrentPage}
            totalPages={totalPages}
            onPageChange={setTableCurrentPage}
          />
        </div>
      </section>

    </div>
  );
};

export default UITestPage2;