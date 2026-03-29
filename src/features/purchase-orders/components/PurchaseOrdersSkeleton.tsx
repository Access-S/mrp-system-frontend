// src/features/purchase-orders/components/PurchaseOrdersSkeleton.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

import { Table } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";

// ============== BLOCK 2: Table Row Skeleton ==============

const TableRowSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Table.Row key={index}>
          <Table.Cell><Skeleton className="h-4 w-24" /></Table.Cell>
          <Table.Cell><Skeleton className="h-4 w-20" /></Table.Cell>
          <Table.Cell><Skeleton className="h-4 w-96" /></Table.Cell>
          <Table.Cell><Skeleton className="h-4 w-16" /></Table.Cell>
          <Table.Cell><Skeleton className="h-4 w-16" /></Table.Cell>
          <Table.Cell><Skeleton className="h-6 w-24 rounded-full" /></Table.Cell>
          <Table.Cell><Skeleton className="h-8 w-8 rounded" /></Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};

// ============== BLOCK 3: Full Page Skeleton ==============

export const PurchaseOrdersSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 w-full sm:w-80" />
        <Skeleton className="h-10 w-full sm:w-48" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>

      {/* Table Skeleton */}
      <Table stickyHeader>
        <Table.Header>
          <Table.Row>
            <Table.Head>PO Number</Table.Head>
            <Table.Head>Product Code</Table.Head>
            <Table.Head>Description</Table.Head>
            <Table.Head>Order Qty</Table.Head>
            <Table.Head>Prod. Time</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableRowSkeleton />
        </Table.Body>
      </Table>
    </div>
  );
};