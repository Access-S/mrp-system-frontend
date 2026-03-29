// src/features/purchase-orders/PurchaseOrdersPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useCallback, useEffect } from "react";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { useDebounce } from "use-debounce";

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { Pagination, PaginationInfo } from "@/components/ui/Pagination";
import { EmptyState, EmptySearchState } from "@/components/ui/EmptyState";
import { Tooltip } from "@/components/ui/Tooltip";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Divider } from "@/components/ui/Divider";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterToolbar } from "@/components/shared/FilterToolbar";
import {
  PurchaseOrdersSkeleton,
  StatusCell,
  ActionsCell,
  STATUS_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
  getBlockedStatuses,
  calculateProductionTime,
} from "./components";
import { PoDetailModal } from "./modals/PoDetailModal";
import { EditPoForm } from "./forms/EditPoForm";
import { DespatchPoForm } from "./forms/DespatchPoForm";
import { ConfirmationDialog } from "@/components/dialogs/ConfirmationDialog";

import { useModal, usePagination, useSort } from "@/hooks";
import {
  fetchPurchaseOrders,
  updatePurchaseOrderStatus,
  deletePo,
} from "@/services/api.service";

import type { PurchaseOrder } from "@/types/mrp.types";

// ============== BLOCK 2: Types & Interfaces ==============

interface PurchaseOrdersPageProps {
  onCreatePo: () => void;
  onImport: () => void;
}

// ============== BLOCK 3: Component ==============

export function PurchaseOrdersPage({ onCreatePo, onImport }: PurchaseOrdersPageProps) {
  const { toast } = useToast();

  // Data state (local because of optimistic updates)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Hooks
  const sort = useSort("desc");
  const pagination = usePagination({ initialLimit: 25 });
  const viewModal = useModal<PurchaseOrder>();
  const editModal = useModal<PurchaseOrder>();
  const deleteModal = useModal<PurchaseOrder>();
  const despatchModal = useModal<PurchaseOrder>();

  // ============== BLOCK 4: Data Fetching ==============

  const loadPurchaseOrders = useCallback(
    async (page: number, search: string, status: string, limit: number) => {
      setLoading(true);
      try {
        const response = await fetchPurchaseOrders({
          page, limit, search, status,
          sortDirection: sort.direction,
        });
        setPurchaseOrders(response.data);
        pagination.updateFromResponse(response.pagination);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load purchase orders.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sort.direction]
  );

  useEffect(() => {
    loadPurchaseOrders(1, debouncedSearchQuery, statusFilter, pagination.limit);
  }, [debouncedSearchQuery, statusFilter, pagination.limit, loadPurchaseOrders]);

  // ============== BLOCK 5: Status Update Handler ==============

  const handleStatusUpdate = async (
    poId: string,
    status: string,
    currentStatuses: string[]
  ) => {
    const statusList = currentStatuses || [];
    const isCurrentlyActive = statusList.includes(status);

    if (!isCurrentlyActive) {
      const blocked = getBlockedStatuses(statusList);
      if (blocked.has(status)) {
        toast.error(`Cannot add "${status}" with current statuses: ${statusList.join(", ")}`);
        return;
      }

      if (status === "Despatched/ Completed") {
        const po = purchaseOrders.find((p) => p.id === poId);
        if (po) {
          despatchModal.open(po);
        }
        return;
      }
    }

    const toastId = toast.loading("Updating status...");
    try {
      const response = await updatePurchaseOrderStatus(poId, status);
      const updatedStatuses = response.data?.statuses || [];

      setPurchaseOrders((prev) =>
        prev.map((p) => {
          if (p.id === poId) {
            const newCurrentStatus =
              updatedStatuses.length > 0 ? updatedStatuses[updatedStatuses.length - 1] : "Open";
            return { ...p, statuses: updatedStatuses, currentStatus: newCurrentStatus };
          }
          return p;
        })
      );
      toast.success("Status updated!", { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      toast.error(message, { id: toastId });
    }
  };

  // ============== BLOCK 6: Despatch Handler ==============

  const handleDespatchSubmit = async (deliveryDate: string, docketNumber: string) => {
    const po = despatchModal.data;
    if (!po) return;

    const toastId = toast.loading("Updating despatch details...");
    try {
      const response = await updatePurchaseOrderStatus(
        po.id,
        "Despatched/ Completed",
        { deliveryDate, docketNumber }
      );
      const updatedStatuses = response.data?.statuses || [];

      setPurchaseOrders((prev) =>
        prev.map((p) => {
          if (p.id === po.id) {
            const newCurrentStatus =
              updatedStatuses.length > 0 ? updatedStatuses[updatedStatuses.length - 1] : "Open";
            return {
              ...p,
              statuses: updatedStatuses,
              currentStatus: newCurrentStatus,
              deliveryDate,
              deliveryDocketNumber: docketNumber,
            };
          }
          return p;
        })
      );
      toast.success(`PO ${po.poNumber} despatched successfully!`, { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update despatch details.";
      toast.error(message, { id: toastId });
    } finally {
      despatchModal.close();
    }
  };

  // ============== BLOCK 7: CRUD Handlers ==============

  const handlePoUpdate = (updatedPo: PurchaseOrder) => {
    toast.success(`PO ${updatedPo.poNumber} updated successfully!`);
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === updatedPo.id ? updatedPo : p))
    );
  };

  const handleConfirmDelete = async () => {
    const po = deleteModal.data;
    if (!po) return;

    const toastId = toast.loading(`Deleting PO ${po.poNumber}...`);
    try {
      await deletePo(po.id);
      setPurchaseOrders((prev) => prev.filter((p) => p.id !== po.id));
      pagination.updateFromResponse({
        total: pagination.total - 1,
        page: pagination.page,
        totalPages: pagination.totalPages,
      });
      toast.success(`PO ${po.poNumber} deleted successfully.`, { id: toastId });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete purchase order";
      toast.error(message, { id: toastId });
    } finally {
      deleteModal.close();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      loadPurchaseOrders(newPage, debouncedSearchQuery, statusFilter, pagination.limit);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    pagination.setLimit(parseInt(value, 10));
  };

  // ============== BLOCK 8: Loading State ==============

  if (loading && purchaseOrders.length === 0) {
    return <PurchaseOrdersSkeleton />;
  }

  // ============== BLOCK 9: Render ==============

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Purchase Orders"
        description="Manage all incoming customer orders. Click any row to view details."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />}
              onClick={onImport}
            >
              Import
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={onCreatePo}
            >
              Create New PO
            </Button>
          </>
        }
      />

      {/* Filters */}
      <FilterToolbar
        searchPlaceholder="Search purchase orders..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={
          <>
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Statuses"
              size="md"
              className="w-44"
            />
            <Select
              options={ITEMS_PER_PAGE_OPTIONS}
              value={pagination.limit.toString()}
              onChange={handleItemsPerPageChange}
              size="md"
              className="w-36"
            />
            <Tooltip content={`Sort by ${sort.direction === "desc" ? "Oldest" : "Newest"}`}>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<ArrowsUpDownIcon className="w-4 h-4" />}
                onClick={sort.toggle}
              >
                {sort.direction === "desc" ? "Newest" : "Oldest"}
              </Button>
            </Tooltip>
          </>
        }
      />

      {/* Table / Loading / Empty */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : purchaseOrders.length > 0 ? (
        <ScrollArea orientation="both" maxHeight="calc(100vh - 280px)">
          <Table stickyHeader hoverable variant="striped" size="md">
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ minWidth: "120px" }}>PO Number</Table.Head>
                <Table.Head style={{ minWidth: "120px" }}>Product Code</Table.Head>
                <Table.Head style={{ minWidth: "400px" }}>Description</Table.Head>
                <Table.Head style={{ minWidth: "140px" }}>Order Qty (shippers)</Table.Head>
                <Table.Head style={{ minWidth: "130px" }}>Prod. Time (hrs)</Table.Head>
                <Table.Head style={{ minWidth: "220px" }}>Status</Table.Head>
                <Table.Head style={{ minWidth: "80px", width: "80px" }}>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {purchaseOrders.map((po) => (
                <Table.Row
                  key={po.id}
                  className="cursor-pointer"
                  onClick={() => viewModal.open(po)}
                >
                  <Table.Cell>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {po.poNumber}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {po.product?.productCode || "N/A"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {po.description}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {Number(po.orderedQtyShippers || 0).toFixed(2)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {calculateProductionTime(po.orderedQtyShippers, po.hourlyRunRate || 0)}
                    </span>
                  </Table.Cell>
                  <Table.Cell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <StatusCell po={po} onStatusUpdate={handleStatusUpdate} />
                  </Table.Cell>
                  <Table.Cell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <ActionsCell
                      po={po}
                      onEdit={(po) => editModal.open(po)}
                      onDelete={(po) => deleteModal.open(po)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Divider spacing="md" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 pb-4">
            <PaginationInfo
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              showFirstLast
              maxVisiblePages={5}
            />
          </div>
        </ScrollArea>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          {searchQuery || statusFilter ? (
            <EmptySearchState
              query={searchQuery}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              variant="document"
              title="No purchase orders yet"
              description="Get started by creating your first purchase order."
              action={
                <Button
                  variant="primary"
                  leftIcon={<PlusIcon className="w-4 h-4" />}
                  onClick={onCreatePo}
                >
                  Create New PO
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* ============== BLOCK 10: Modals ============== */}

      <PoDetailModal
        open={viewModal.isOpen}
        handleOpen={viewModal.close}
        po={viewModal.data}
      />

      <EditPoForm
        open={editModal.isOpen}
        handleOpen={editModal.close}
        po={editModal.data}
        onUpdate={handlePoUpdate}
      />

      <ConfirmationDialog
        open={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleConfirmDelete}
        title="Delete Purchase Order"
        message={`Are you sure you want to permanently delete PO ${deleteModal.data?.poNumber ?? ""}? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
      />

      <DespatchPoForm
        open={despatchModal.isOpen}
        handleOpen={despatchModal.close}
        onSubmit={handleDespatchSubmit}
      /> 
    </div>
  );
};
