// src/features/products/ProductsPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useMemo } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { EmptyState } from "@/components/ui/EmptyState";

import { useFetch, useSearch, useModal } from "@/hooks";

import { productService } from "./services/product.service";

import { PageHeader } from "@/components/shared/PageHeader";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import { ResultsCount } from "@/components/shared/ResultsCount";
import { ProductsSkeleton } from "./components/ProductsSkeleton";
import { CreateProductForm } from "./forms/CreateProductForm";

import type { Product } from "@/features/products/types";

// ============== BLOCK 2: Types & Interfaces ==============

interface ProductsPageProps {
  onViewProduct?: (productCode: string, description?: string) => void;
}

// ============== BLOCK 3: Component ==============

export function ProductsPage({ onViewProduct }: ProductsPageProps) {
  // Data fetching
  const { data, loading, error, refetch } = useFetch<Product[]>(
    () => productService.getAllProducts()
  );
  const products = data ?? [];

  // Search & filter
  const { query, setQuery, filtered } = useSearch(products, [
    "productCode",
    "description",
  ]);

  // Create modal
  const createModal = useModal();

  // Stats calculations
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const productsWithBom = products.filter(
      (p) => p.components && p.components.length > 0
    ).length;
    const totalComponents = products.reduce(
      (sum, p) => sum + (p.components?.length || 0),
      0
    );
    const avgRunRate =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + (p.hourlyRunRate || 0), 0) /
          totalProducts
        : 0;

    return { totalProducts, productsWithBom, totalComponents, avgRunRate };
  }, [products]);

  // ============== BLOCK 4: Loading State ==============

  if (loading) {
    return <ProductsSkeleton />;
  }

  // ============== BLOCK 5: Error State ==============

  if (error) {
    return (
      <Card>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  // ============== BLOCK 6: Render ==============

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Products"
        description="Manage all products and their bill of materials."
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => createModal.open()}
          >
            Create Product
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Products
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Active in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Products with BOM
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {stats.productsWithBom}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stats.totalProducts > 0
                ? (
                    (stats.productsWithBom / stats.totalProducts) *
                    100
                  ).toFixed(1)
                : 0}
              % coverage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Components
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {stats.totalComponents}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Across all BOMs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Avg Hourly Run Rate
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {stats.avgRunRate.toFixed(1)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Units per hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardContent className="space-y-4">
          <FilterToolbar
            searchPlaceholder="Search by product code or description..."
            searchValue={query}
            onSearchChange={setQuery}
          />

          <ResultsCount
            filtered={filtered.length}
            total={products.length}
            label="products"
          />

          {filtered.length > 0 ? (
            <ScrollArea orientation="both" maxHeight="calc(100vh - 400px)">
              <Table stickyHeader hoverable variant="striped" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Head style={{ minWidth: "150px" }}>
                      Product Code
                    </Table.Head>
                    <Table.Head style={{ minWidth: "400px" }}>
                      Description
                    </Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filtered.map((product) => (
                    <Table.Row
                      key={product.id}
                      className="cursor-pointer"
                      onClick={() =>
                        onViewProduct?.(
                          product.productCode,
                          product.description
                        )
                      }
                    >
                      <Table.Cell>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {product.productCode || "-"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-gray-600 dark:text-gray-300">
                          {product.description || "-"}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </ScrollArea>
          ) : (
            <EmptyState
              variant={query ? "search" : "default"}
              title={query ? "No matching products" : "No products yet"}
              description={
                query
                  ? `No products found matching "${query}"`
                  : "Get started by creating your first product."
              }
              action={
                !query ? (
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                    onClick={() => createModal.open()}
                  >
                    Create Product
                  </Button>
                ) : undefined
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <CreateProductForm
        open={createModal.isOpen}
        handleOpen={createModal.close}
        onProductCreated={() => refetch()}
      />
    </div>
  );
}