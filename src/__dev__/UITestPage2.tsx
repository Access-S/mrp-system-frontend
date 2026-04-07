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

// ============== BLOCK 2: Sample Data ==============

const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, "0")}`,
  price: `$${(Math.random() * 500 + 10).toFixed(2)}`,
}));

const sampleUsers = [
  { name: "John Doe", src: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", src: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Johnson", src: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", src: "https://i.pravatar.cc/150?img=4" },
  { name: "Charlie Wilson", src: "https://i.pravatar.cc/150?img=5" },
  { name: "Diana Prince", src: "https://i.pravatar.cc/150?img=6" },
];

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Laptops", href: "/products/electronics/laptops" },
  { label: "MacBook Pro" },
];

const shortBreadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
  { label: "Profile" },
];

// ============== BLOCK 3: Component ==============

const UITestPage2: React.FC = () => {
  const { theme } = useTheme();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

      {/* ============== BLOCK 10: NEW SHADCN TABLE ============== */}

      <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Pagination with Shadcn Table
          </h2>
          <ShadcnButton variant="outline" size="sm">Export CSV</ShadcnButton>
        </div>

        {/* SHADCN TABLE CONTAINER */}
        <div className="rounded-md border border-border overflow-hidden bg-background">
          <ShadcnTable>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.name}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {item.sku}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {item.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </ShadcnTable>
        </div>

        {/* FOOTER (Using your legacy pagination component for now) */}
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