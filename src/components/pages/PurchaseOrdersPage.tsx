// src/components/pages/PurchaseOrdersPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

// UI Components
import { Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select, SelectOption } from "../ui/Select";
import { Menu } from "../ui/Menu";
import { StatusBadge, Status } from "../ui/StatusBadge";
import { Pagination, PaginationInfo } from "../ui/Pagination";
import { Spinner } from "../ui/Spinner";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState, EmptySearchState } from "../ui/EmptyState";
import { Tooltip } from "../ui/Tooltip";
import { ScrollArea } from "../ui/ScrollArea";
import { Divider } from "../ui/Divider";

// Modals & Forms
import { PoDetailModal } from "../modals/PoDetailModal";
import { EditPoForm } from "../forms/EditPoForm";
import { DespatchPoForm } from "../forms/DespatchPoForm";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";

// Services & Types
import {
  fetchPurchaseOrders,
  updatePurchaseOrderStatus,
  deletePo,
  PaginatedApiResponse,
} from "../../services/api.service";
import { PoStatus, ALL_PO_STATUSES } from "../../types/mrp.types";

// ============== BLOCK 2: Types & Interfaces ==============

interface PurchaseOrdersPageProps {
  onCreatePo: () => void;
  onImport: () => void;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  description: string;
  ordered_qty_shippers: number;
  hourly_run_rate: number;
  current_status: string;
  delivery_date?: string;
  delivery_docket_number?: string;
  statuses: { status: string }[];
  product?: {
    product_code: string;
  };
}

// ============== BLOCK 3: Constants ==============

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "Open", label: "Open" },
  { value: "Wip Called", label: "Wip Called" },
  { value: "Packaging Called", label: "Packaging Called" },
  { value: "In Production", label: "In Production" },
  { value: "Despatched/ Completed", label: "Despatched/ Completed" },
  { value: "Closed", label: "Closed" },
  { value: "PO Canceled", label: "PO Canceled" },
];

const ITEMS_PER_PAGE_OPTIONS: SelectOption[] = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

// ============== BLOCK 4: Helper Functions ==============

const getBlockedStatuses = (currentStatuses: string[]): Set<string> => {
  const blocked = new Set<string>();
  const has = (s: string) => currentStatuses.includes(s);

  if (has("PO Check")) {
    ALL_PO_STATUSES.forEach((s) => {
      if (s !== "PO Canceled") blocked.add(s);
    });
    return blocked;
  }

  if (has("PO Canceled")) {
    ALL_PO_STATUSES.forEach((s) => {
      if (s !== "Closed" && s !== "PO Canceled") blocked.add(s);
    });
    return blocked;
  }

  if (has("Closed")) {
    ALL_PO_STATUSES.forEach((s) => {
      if (s !== "Closed" && s !== "Despatched/ Completed" && s !== "PO Canceled") {
        blocked.add(s);
      }
    });
    return blocked;
  }

  if (has("Despatched/ Completed")) {
    ALL_PO_STATUSES.forEach((s) => {
      if (s !== "Closed" && s !== "Despatched/ Completed") blocked.add(s);
    });
    return blocked;
  }

  blocked.add("Closed");
  return blocked;
};

const calculateProductionTime = (qty: number, rate: number): string => {
  if (rate <= 0) return "0.00";
  return (qty / rate).toFixed(2);
};

// ============== BLOCK 5: Skeleton Loading Component ==============

const TableSkeleton: React.FC = () => {
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

// ============== BLOCK 6: Status Cell Component ==============

interface StatusCellProps {
  po: PurchaseOrder;
  onStatusUpdate: (poId: string, status: string, currentStatuses: { status: string }[]) => void;
}

const StatusCell: React.FC<StatusCellProps> = ({ po, onStatusUpdate }) => {
  const currentStatuses = po.statuses?.map((s) => s.status) || [];
  const blocked = getBlockedStatuses(currentStatuses);

  return (
    <Menu>
      <Menu.Trigger>
        <div 
          className={clsx(
            "flex items-center gap-1 cursor-pointer",
            "p-1.5 rounded-md",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors",
          )}
        >
          <ScrollArea
            orientation="horizontal"
            maxWidth="220px"
            thumbSize={4}
            hideDelay={800}
            convertWheelToHorizontal
          >
            <div className="flex items-center gap-1 flex-nowrap">
              {po.statuses && po.statuses.length > 0 ? (
                po.statuses.map((s) => (
                  <StatusBadge
                    key={s.status}
                    status={s.status as Status}
                    size="sm"
                    variant="subtle"
                    className="flex-shrink-0"
                  />
                ))
              ) : (
                <StatusBadge status="Open" size="sm" variant="subtle" className="flex-shrink-0" />
              )}
            </div>
          </ScrollArea>
          <ChevronDownIcon className="w-3 h-3 text-gray-400 flex-shrink-0 ml-1" />
        </div>
      </Menu.Trigger>
      <Menu.Content position="bottom-start" minWidth={220}>
        <Menu.Label>Update Status</Menu.Label>
        <Menu.Divider />
        {ALL_PO_STATUSES.map((statusOption) => {
          const isChecked = currentStatuses.includes(statusOption);
          const isBlocked = !isChecked && blocked.has(statusOption);

          return (
            <Menu.Item
              key={statusOption}
              onClick={() => {
                if (!isBlocked) {
                  onStatusUpdate(po.id, statusOption, po.statuses || []);
                }
              }}
              disabled={isBlocked}
              icon={
                isChecked ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                ) : (
                  <span className="opacity-0">✓</span>
                )
              }
              rightIcon={
                isBlocked ? (
                  <span className="text-xs text-red-400">blocked</span>
                ) : undefined
              }
              className={isBlocked ? "line-through opacity-50" : ""}
            >
              {statusOption}
            </Menu.Item>
          );
        })}
        {po.statuses?.some((s) => s.status === "PO Check") && (
          <>
            <Menu.Divider />
            <Menu.Item disabled icon={<span className="text-amber-600">⚠</span>}>
              PO Check (System)
            </Menu.Item>
          </>
        )}
      </Menu.Content>
    </Menu>
  );
};

// ============== BLOCK 7: Actions Cell Component ==============

interface ActionsCellProps {
  po: PurchaseOrder;
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ po, onEdit, onDelete }) => {
  return (
    <Menu>
      <Menu.Trigger>
        <Tooltip content="Actions" position="top">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </Tooltip>
      </Menu.Trigger>
      <Menu.Content position="bottom-end" minWidth={160}>
        <Menu.Item
          icon={<PencilSquareIcon className="w-4 h-4" />}
          onClick={() => onEdit(po)}
        >
          Edit PO Details
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<TrashIcon className="w-4 h-4" />}
          onClick={() => onDelete(po)}
          danger
        >
          Delete PO
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};

// ============== BLOCK 8: Main Component ==============

export function PurchaseOrdersPage({ onCreatePo, onImport }: PurchaseOrdersPageProps) {

  // ============== BLOCK 9: State ==============

  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [pagination, setPagination] = useState<PaginatedApiResponse["pagination"]>({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 1,
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Modals & Forms
  const [poToView, setPoToView] = useState<PurchaseOrder | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [poToEdit, setPoToEdit] = useState<PurchaseOrder | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);
  const [isDespatchFormOpen, setIsDespatchFormOpen] = useState(false);
  const [poToDespatch, setPoToDespatch] = useState<PurchaseOrder | null>(null);

  // ============== BLOCK 10: Data Fetching ==============

  const loadPurchaseOrders = useCallback(
    async (page: number, search: string, status: string, limit: number) => {
      setLoading(true);
      try {
        const response = await fetchPurchaseOrders({
          page,
          search,
          status,
          limit,
          sortDirection,
        });
        setPurchaseOrders(response.data);
        setPagination(response.pagination);
      } catch (error: any) {
        toast.error(error.message || "Failed to load purchase orders.");
      } finally {
        setLoading(false);
      }
    },
    [sortDirection]
  );

  useEffect(() => {
    loadPurchaseOrders(1, debouncedSearchQuery, statusFilter, itemsPerPage);
  }, [debouncedSearchQuery, statusFilter, sortDirection, itemsPerPage, loadPurchaseOrders]);

  // ============== BLOCK 11: Pagination Handlers ==============

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      loadPurchaseOrders(newPage, debouncedSearchQuery, statusFilter, itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = parseInt(value, 10);
    setItemsPerPage(newLimit);
  };

  // ============== BLOCK 12: Sort Handler ==============

  const handleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // ============== BLOCK 13: Status Update Handler ==============

  const handleStatusUpdate = async (
    poId: string,
    status: string,
    currentStatuses: { status: string }[]
  ) => {
    const statusList = currentStatuses?.map((s) => s.status) || [];
    const isCurrentlyActive = statusList.includes(status);

    if (!isCurrentlyActive) {
      const blocked = getBlockedStatuses(statusList);
      if (blocked.has(status)) {
        toast.error(`Cannot add "${status}" with current statuses: ${statusList.join(", ")}`);
        return;
      }

      // Intercept: If adding "Despatched/ Completed", open despatch form
      if (status === "Despatched/ Completed") {
        const po = purchaseOrders.find((p) => p.id === poId);
        if (po) {
          setPoToDespatch(po);
          setIsDespatchFormOpen(true);
        }
        return;
      }
    }

    const toastId = toast.loading("Updating status...");
    try {
      const response = await updatePurchaseOrderStatus(poId, status);
      const updatedStatuses = response.data?.statuses || response.statuses || [];

      setPurchaseOrders((prevPOs) =>
        prevPOs.map((p) => {
          if (p.id === poId) {
            const newStatusArray = updatedStatuses.map((s: string) => ({ status: s }));
            const newCurrentStatus =
              updatedStatuses.length > 0 ? updatedStatuses[updatedStatuses.length - 1] : "Open";
            return { ...p, statuses: newStatusArray, current_status: newCurrentStatus };
          }
          return p;
        })
      );
      toast.success("Status updated!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  // ============== BLOCK 14: Despatch Handler ==============

  const handleDespatchSubmit = async (deliveryDate: string, docketNumber: string) => {
    if (!poToDespatch) return;

    const toastId = toast.loading("Updating despatch details...");
    try {
      const response = await updatePurchaseOrderStatus(
        poToDespatch.id,
        "Despatched/ Completed",
        { deliveryDate, docketNumber }
      );

      const updatedStatuses = response.data?.statuses || response.statuses || [];

      setPurchaseOrders((prevPOs) =>
        prevPOs.map((p) => {
          if (p.id === poToDespatch.id) {
            const newStatusArray = updatedStatuses.map((s: string) => ({ status: s }));
            const newCurrentStatus =
              updatedStatuses.length > 0 ? updatedStatuses[updatedStatuses.length - 1] : "Open";
            return {
              ...p,
              statuses: newStatusArray,
              current_status: newCurrentStatus,
              delivery_date: deliveryDate,
              delivery_docket_number: docketNumber,
            };
          }
          return p;
        })
      );

      toast.success(`PO ${poToDespatch.po_number} despatched successfully!`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to update despatch details.", { id: toastId });
    } finally {
      setIsDespatchFormOpen(false);
      setPoToDespatch(null);
    }
  };

  // ============== BLOCK 15: Modal/Form Handlers ==============

  const handleOpenViewModal = (po: PurchaseOrder | null) => setPoToView(po);

  const handleOpenEditForm = (po: PurchaseOrder | null) => {
    setPoToEdit(po);
    setIsEditFormOpen(!!po);
  };

  const handlePoUpdate = (updatedPo: PurchaseOrder) => {
    toast.success(`PO ${updatedPo.po_number} updated successfully!`);
    setPurchaseOrders((prevPOs) =>
      prevPOs.map((p) => (p.id === updatedPo.id ? updatedPo : p))
    );
  };

  const handleOpenDeleteConfirm = (po: PurchaseOrder | null) => {
    setPoToDelete(po);
    setIsDeleteConfirmOpen(!!po);
  };

  const handleConfirmDelete = async () => {
    if (!poToDelete) return;

    const toastId = toast.loading(`Deleting PO ${poToDelete.po_number}...`);
    try {
      await deletePo(poToDelete.id);
      setPurchaseOrders((prevPOs) => prevPOs.filter((p) => p.id !== poToDelete.id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success(`PO ${poToDelete.po_number} deleted successfully.`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      handleOpenDeleteConfirm(null);
    }
  };

// ============== BLOCK 16: Render - Initial Loading ==============

if (loading && purchaseOrders.length === 0) {
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
          <TableSkeleton />
        </Table.Body>
      </Table>
    </div>
  );
}

// ============== BLOCK 17: Render - Main Content ==============

return (
  <div className="space-y-6">
    {/* ============== BLOCK 18: Page Header ============== */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Purchase Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all incoming customer orders. Click any row to view details.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" leftIcon={<ArrowDownTrayIcon className="w-4 h-4" />} onClick={onImport}>
          Import
        </Button>
        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={onCreatePo}>
          Create New PO
        </Button>
      </div>
    </div>

    {/* ============== BLOCK 19: Filters Bar ============== */}
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search purchase orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          size="md"
        />
      </div>

      {/* Right Side Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All Statuses"
          size="md"
          className="w-44"
        />

        {/* Items Per Page */}
        <Select
          options={ITEMS_PER_PAGE_OPTIONS}
          value={itemsPerPage.toString()}
          onChange={handleItemsPerPageChange}
          size="md"
          className="w-36"
        />

        {/* Sort Button */}
        <Tooltip content={`Sort by ${sortDirection === "desc" ? "Oldest" : "Newest"}`}>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<ArrowsUpDownIcon className="w-4 h-4" />}
            onClick={handleSort}
          >
            {sortDirection === "desc" ? "Newest" : "Oldest"}
          </Button>
        </Tooltip>
      </div>
    </div>

    {/* ============== BLOCK 20: Table ============== */}
    {loading ? (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    ) : purchaseOrders.length > 0 ? (
      <ScrollArea
        orientation="both"
        maxHeight="calc(100vh - 280px)"
      >
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
                onClick={() => handleOpenViewModal(po)}
              >
                <Table.Cell>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {po.po_number}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {po.product?.product_code || "N/A"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {po.description}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    {Number(po.ordered_qty_shippers || 0).toFixed(2)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {calculateProductionTime(po.ordered_qty_shippers, po.hourly_run_rate)}
                  </span>
                </Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <StatusCell po={po} onStatusUpdate={handleStatusUpdate} />
                </Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <ActionsCell
                    po={po}
                    onEdit={handleOpenEditForm}
                    onDelete={handleOpenDeleteConfirm}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Divider between table and pagination */}
        <Divider spacing="md" />

        {/* Pagination inside ScrollArea */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 pb-4">
          <PaginationInfo
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={itemsPerPage}
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
              <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={onCreatePo}>
                Create New PO
              </Button>
            }
          />
        )}
      </div>
    )}

    {/* ============== BLOCK 22: Modals & Dialogs ============== */}
    <PoDetailModal
      open={poToView !== null}
      handleOpen={() => handleOpenViewModal(null)}
      po={poToView}
    />

    <EditPoForm
      open={isEditFormOpen}
      handleOpen={() => handleOpenEditForm(null)}
      po={poToEdit}
      onUpdate={handlePoUpdate}
    />

    <ConfirmationDialog
      open={isDeleteConfirmOpen}
      handleOpen={() => handleOpenDeleteConfirm(null)}
      onConfirm={handleConfirmDelete}
      title="Delete Purchase Order?"
      message={`Are you sure you want to permanently delete PO ${poToDelete?.po_number}?`}
    />

    <DespatchPoForm
      open={isDespatchFormOpen}
      handleOpen={() => {
        setIsDespatchFormOpen(false);
        setPoToDespatch(null);
      }}
      onSubmit={handleDespatchSubmit}
    />
  </div>
  );
}

// ============== BLOCK 23: Export ==============

export default PurchaseOrdersPage;