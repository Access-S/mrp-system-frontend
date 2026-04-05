// src/features/products/ProductsPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useMemo } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination, PaginationInfo } from "@/components/ui/Pagination";

import { useFetch, useSearch, useModal, useClientPagination } from "@/hooks";

import { productService } from "./services/product.service";
import { ProductsSkeleton } from "./components/ProductsSkeleton";
import { CreateProductForm } from "./forms/CreateProductForm";

import type { Product } from "@/features/products/types";

// ============== BLOCK 2: Types ==============

interface ProductsPageProps {
  onViewProduct?: (productCode: string, description?: string) => void;
}

type StatusFilter = "all" | "active" | "inactive";

// ============== BLOCK 3: Constants ==============

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// ============== BLOCK 4: Component ==============

export function ProductsPage({ onViewProduct }: ProductsPageProps) {
  // State
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Data fetching
  const { data, loading, error, refetch } = useFetch<Product[]>(() =>
    productService.getAllProducts()
  );
  const products = data ?? [];

  // Search
  const { query, setQuery, filtered: searchFiltered } = useSearch(products, [
    "productCode",
    "description",
  ]);

  // Status filtering
  const filtered = useMemo(() => {
    if (statusFilter === "all") return searchFiltered;
    // Treat undefined isActive as true (active by default)
    return searchFiltered.filter((p) => {
      const isActive = p.isActive ?? true;
      return statusFilter === "active" ? isActive : !isActive;
    });
  }, [searchFiltered, statusFilter]);

  // Client-side pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
  } = useClientPagination(filtered, { initialItemsPerPage: 25 });

  // Modal
  const createModal = useModal();

  // ============== BLOCK 5: Loading State ==============

  if (loading) {
    return <ProductsSkeleton />;
  }

  // ============== BLOCK 6: Error State ==============

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          variant="error"
          title="Failed to Load Products"
          description={error}
          action={
            <Button variant="primary" onClick={refetch}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  // ============== BLOCK 7: Render ==============

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">

      {/* ============== HEADER ============== */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Products
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your product catalog
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => createModal.open()}
          >
            New Product
          </Button>
        </div>
      </div>

      {/* ============== TOOLBAR ============== */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Search & Filters */}
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative w-80">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
              options={statusOptions}
              className="w-36 h-9"
            />

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Export
            </Button>
          </div>

          {/* Right: Results Count */}
          <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {totalItems}
            </span>
            {" "}products
          </div>
        </div>
      </div>

      {/* ============== TABLE ============== */}
      <div className="flex-1 overflow-auto">
        {filtered.length > 0 ? (
          <Table variant="minimal" size="sm" stickyHeader hoverable>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: "180px" }}>Product Code</Table.Head>
                <Table.Head>Description</Table.Head>
                <Table.Head style={{ width: "120px" }} className="text-center">
                  Status
                </Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {paginatedData.map((product) => {
                const isActive = product.isActive ?? true;
                return (
                  <Table.Row
                    key={product.id}
                    className="cursor-pointer"
                    onClick={() =>
                      onViewProduct?.(product.productCode, product.description)
                    }
                  >
                    <Table.Cell>
                      <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
                        {product.productCode}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-gray-600 dark:text-gray-300">
                        {product.description || "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Badge
                        variant={isActive ? "success" : "secondary"}
                        size="sm"
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-full p-12">
            <EmptyState
              variant={query || statusFilter !== "all" ? "search" : "default"}
              title={
                query || statusFilter !== "all"
                  ? "No matching products"
                  : "No products yet"
              }
              description={
                query || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first product"
              }
              action={
                !query && statusFilter === "all" ? (
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                    onClick={() => createModal.open()}
                  >
                    New Product
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      {/* ============== FOOTER / PAGINATION ============== */}
      {filtered.length > 0 && (
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Info */}
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              size="sm"
            />

            {/* Right: Pagination Controls */}
            <div className="flex items-center gap-4">
              {/* Rows per page */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Rows:</span>
                <Select
                  value={String(itemsPerPage)}
                  onChange={(value) => setItemsPerPage(Number(value))}
                  options={[
                    { value: "10", label: "10" },
                    { value: "25", label: "25" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                  ]}
                  className="w-20 h-8"
                />
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                size="sm"
                showFirstLast={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============== CREATE MODAL ============== */}
      <CreateProductForm
        open={createModal.isOpen}
        handleOpen={createModal.close}
        onProductCreated={() => refetch()}
      />
    </div>
  );
}