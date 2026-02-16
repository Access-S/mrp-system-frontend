// BLOCK 1: Imports (keep as is)
import React, { useState, useEffect, useCallback } from "react";
import {
  Button, Typography, Card, CardBody, Input,
  Menu, MenuHandler, MenuList, MenuItem, IconButton
} from "@material-tailwind/react";
import {
  PlusIcon, MagnifyingGlassIcon, ArrowDownIcon,
  ArrowUpIcon, ArrowLeftIcon, ArrowRightIcon, EllipsisVerticalIcon,
  PencilIcon, TrashIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { PoDetailModal } from "../modals/PoDetailModal";
import { EditPoForm } from "../forms/EditPoForm";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";
import { PaginationControls } from "../PaginationControls";
import { PurchaseOrder, PoStatus, ALL_PO_STATUSES } from "../../types/mrp.types";
import toast from "react-hot-toast";
import { useDebounce } from 'use-debounce';
import { fetchPurchaseOrders, updatePurchaseOrderStatus, deletePo, PaginatedApiResponse } from "../../services/api.service";

// BLOCK 2: Constants
const TABLE_HEAD = [
  "PO Number",
  "Product Code",
  "Description",
  "Order Qty|(shippers)",
  "Prod. Time|(hrs)",
  "Status",
  "Actions",
];

// BLOCK 3: Main Component Definition - MAKE SURE THIS IS EXACT
interface PurchaseOrdersPageProps {
  onCreatePo: () => void;
}

export function PurchaseOrdersPage({ onCreatePo }: PurchaseOrdersPageProps) {
  // BLOCK 4: State
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginatedApiResponse['pagination']>({ total: 0, page: 1, limit: 25, totalPages: 1 });
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>("desc");
  const [poToView, setPoToView] = useState<any | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [poToEdit, setPoToEdit] = useState<any | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [poToDelete, setPoToDelete] = useState<any | null>(null);

  // BLOCK 5: Data Fetching (keep as is)
  const loadPurchaseOrders = useCallback(async (page: number, search: string, status: string, limit: number) => {
    setLoading(true);
    try {
      const response = await fetchPurchaseOrders({ page, search, status, limit, sortDirection });
      setPurchaseOrders(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      toast.error(error.message || "Failed to load purchase orders.");
    } finally { setLoading(false); }
  }, [sortDirection]);

  useEffect(() => {
    loadPurchaseOrders(1, debouncedSearchQuery, statusFilter, itemsPerPage);
  }, [debouncedSearchQuery, statusFilter, sortDirection, itemsPerPage, loadPurchaseOrders]);

  // BLOCK 6: Pagination Handlers (keep as is)
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      loadPurchaseOrders(newPage, debouncedSearchQuery, statusFilter, itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
  };

  // BLOCK 7: Status Business Rules (keep as is)
const getBlockedStatuses = (currentStatuses: string[]): Set<string> => {
  const blocked = new Set<string>();
  const has = (s: string) => currentStatuses.includes(s);

  // PO Check (system-generated) → can only add PO Canceled
  if (has('PO Check')) {
    ALL_PO_STATUSES.forEach(s => {
      if (s !== 'PO Canceled') blocked.add(s);
    });
    return blocked;
  }

  // PO Canceled → can only add Closed or toggle off PO Canceled
  if (has('PO Canceled')) {
    ALL_PO_STATUSES.forEach(s => {
      if (s !== 'Closed' && s !== 'PO Canceled') blocked.add(s);
    });
    return blocked;
  }

  // Closed with terminal → fully locked except toggling off
  if (has('Closed')) {
    ALL_PO_STATUSES.forEach(s => {
      if (s !== 'Closed' && s !== 'Despatched/ Completed' && s !== 'PO Canceled') {
        blocked.add(s);
      }
    });
    return blocked;
  }

  // Despatched/Completed → can only add Closed or toggle off
  if (has('Despatched/ Completed')) {
    ALL_PO_STATUSES.forEach(s => {
      if (s !== 'Closed' && s !== 'Despatched/ Completed') blocked.add(s);
    });
    return blocked;
  }

  // Normal state → everything allowed except Closed (needs terminal first)
  blocked.add('Closed');

  return blocked;
};

  // BLOCK 8: Status Update Handler (keep as is)
  const handleStatusUpdate = async (poId: string, status: string, currentStatuses: { status: string }[]) => {
  const statusList = currentStatuses?.map(s => s.status) || [];
  const isCurrentlyActive = statusList.includes(status);

  // If adding a new status (not toggling off), check business rules
  if (!isCurrentlyActive) {
    const blocked = getBlockedStatuses(statusList);
    if (blocked.has(status)) {
      toast.error(`Cannot add "${status}" with current statuses: ${statusList.join(', ')}`);
      return;
    }
  }

  const toastId = toast.loading(`Updating status...`);
  try {
    const response = await updatePurchaseOrderStatus(poId, status);
    // Extract the statuses array from the response
    const updatedStatuses = response.data?.statuses || response.statuses || [];
    
    setPurchaseOrders(prevPOs =>
      prevPOs.map(p => {
        if (p.id === poId) {
          const newStatusArray = updatedStatuses.map((s: string) => ({ status: s }));
          const newCurrentStatus = updatedStatuses.length > 0 ? updatedStatuses[updatedStatuses.length - 1] : 'Open';
          return { ...p, statuses: newStatusArray, current_status: newCurrentStatus };
        }
        return p;
      })
    );
    toast.success('Status updated!', { id: toastId });
  } catch (error: any) {
    toast.error(error.message, { id: toastId });
  }
};

  // BLOCK 9: Modal/Form Handlers (keep as is)
  const handleOpenViewModal = (po: any | null) => setPoToView(po);
  const handleSort = () => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');

  const handleOpenDeleteConfirm = (po: any | null) => { setPoToDelete(po); setIsDeleteConfirmOpen(!!po); };
  const handleConfirmDelete = async () => {
    if (!poToDelete) return;
    const toastId = toast.loading(`Deleting PO ${poToDelete.po_number}...`);
    try {
      await deletePo(poToDelete.id);
      setPurchaseOrders(prevPOs => prevPOs.filter(p => p.id !== poToDelete.id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      toast.success(`PO ${poToDelete.po_number} deleted successfully.`, { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      handleOpenDeleteConfirm(null);
    }
  };

  const handleOpenEditForm = (po: any | null) => { setPoToEdit(po); setIsEditFormOpen(!!po); };
  const handlePoUpdate = (updatedPo: any) => { toast.success(`PO ${updatedPo.po_number} updated successfully!`); setPurchaseOrders(prevPOs => prevPOs.map(p => (p.id === updatedPo.id ? updatedPo : p))); };

  // BLOCK 10: Table Helper Functions (keep as is)
  const getHeaderClasses = (index: number) => {
    let classes = `${theme.tableHeaderBg} p-4 text-center`;
    if (index < TABLE_HEAD.length - 1) {
      classes += ` border-r-2 ${theme.borderColor}`;
    }
    return classes;
  };

  const getCellClasses = (isLast = false, align = 'center') => {
    let classes = `p-2 border-b-2 ${theme.borderColor} text-${align}`;
    if (!isLast) { classes += ` border-r-2 ${theme.borderColor}`; }
    return classes;
  };

  const getHeaderStyle = (head: string): React.CSSProperties => {
    const style: React.CSSProperties = { minWidth: '120px' };
    if (head === 'Actions') style.minWidth = '60px';
    if (head === 'Description') style.minWidth = '470px';
    if (head === 'Status') style.minWidth = '250px';
    return style;
  };

  // BLOCK 11: Initial Loading State (keep as is)
  if (loading && purchaseOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <svg className="animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600" />
          <path d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-gray-100" />
        </svg>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading purchase orders...</p>
      </div>
    );
  }

  // BLOCK 12: Main Render - CRITICAL: Make sure onClick uses onCreatePo
  return (
    <Card className={`w-full ${theme.cards} shadow-sm`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme.borderColor}`}>
        <div>
          <Typography variant="h5" className={theme.text}>Purchase Orders</Typography>
          <Typography color="gray" className={`mt-1 font-normal ${theme.text} opacity-80`}>
            Manage all incoming customer orders. Click any row to view details.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="text" className="flex items-center gap-2" onClick={handleSort}>
            {sortDirection === "desc"
              ? <ArrowDownIcon strokeWidth={2} className={`h-4 w-4 ${theme.text}`} />
              : <ArrowUpIcon strokeWidth={2} className={`h-4 w-4 ${theme.text}`} />
            }
            <Typography variant="small" className={`font-normal ${theme.text}`}>
              Sort by {sortDirection === "desc" ? "Newest" : "Oldest"}
            </Typography>
          </Button>
          <Button 
            onClick={() => {
              console.log("✅ Create PO button clicked in PurchaseOrdersPage");
              console.log("📤 Calling onCreatePo prop:", onCreatePo);
              if (onCreatePo) {
                onCreatePo();
              } else {
                console.error("❌ onCreatePo prop is missing!");
              }
            }} 
            className="flex items-center gap-3" 
            size="sm"
          >
            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Create New PO
          </Button>
        </div>
      </div>

      {/* Rest of the component remains exactly the same... */}
      {/* Search, Filter, Quick Nav */}
      <div className={`flex flex-wrap items-center justify-between border-b ${theme.borderColor}`}>
        <div className="p-4 flex-grow">
          <Input
            label="Search all purchase orders..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color={theme.isDark ? "white" : "black"}
          />
        </div>
        <div className="p-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full p-2 border rounded-md ${theme.borderColor} ${theme.cards} ${theme.text}`}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Wip Called">Wip Called</option>
            <option value="Packaging Called">Packaging Called</option>
            <option value="In Production">In Production</option>
            <option value="Despatched/ Completed">Despatched/ Completed</option>
            <option value="Closed">Closed</option>
            <option value="PO Canceled">PO Canceled</option>
          </select>
        </div>
        <div className="p-4 flex items-center gap-4">
          <Button variant="text" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1} className={theme.buttonText}>
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>
          <Button variant="text" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className={theme.buttonText}>
            Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <svg className="animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600" />
            <path d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-gray-100" />
          </svg>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading purchase orders...</p>
        </div>
      ) : purchaseOrders.length > 0 ? (
        <CardBody className="overflow-x-auto p-0">
          <div className={`border-2 ${theme.borderColor} rounded-lg m-4 overflow-hidden`}>
            <table className="w-full table-auto text-left">
              <thead className={`border-b-2 ${theme.borderColor}`}>
                <tr>
                  {TABLE_HEAD.map((head, index) => {
                    let thClasses = getHeaderClasses(index);
                    if (head === 'Description') {
                      thClasses = thClasses.replace('text-center', 'text-left');
                    }

                    return (
                      <th key={head} className={thClasses} style={getHeaderStyle(head)}>
                        {head.includes("|") ? (
                          <div>
                            <Typography variant="small" className={`font-bold text-base ${theme.text}`}>
                              {head.split("|")[0]}
                            </Typography>
                            <Typography variant="small" className={`font-bold text-base ${theme.text} opacity-80`}>
                              {head.split("|")[1]}
                            </Typography>
                          </div>
                        ) : (
                          <Typography variant="small" className={`font-bold text-base ${theme.text}`}>
                            {head}
                          </Typography>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr
                    key={po.id}
                    className={`${theme.hoverBg} cursor-pointer transition-colors`}
                    onClick={() => handleOpenViewModal(po)}
                  >
                    {/* PO Number */}
                    <td className={getCellClasses()}>
                      <Typography variant="body" className={`font-bold ${theme.text}`}>
                        {po.po_number}
                      </Typography>
                    </td>

                    {/* Product Code */}
                    <td className={getCellClasses()}>
                      <Typography variant="body" className={`font-normal ${theme.text}`}>
                        {po.product?.product_code || 'N/A'}
                      </Typography>
                    </td>

                    {/* Description */}
                    <td className={getCellClasses(false, 'left')}>
                      <Typography variant="body" className={`font-normal ${theme.text}`}>
                        {po.description}
                      </Typography>
                    </td>

                    {/* Order Qty */}
                    <td className={getCellClasses()}>
                      <Typography variant="body" className={`font-semibold ${theme.text}`}>
                        {Number(po.ordered_qty_shippers || 0).toFixed(2)}
                      </Typography>
                    </td>

                    {/* Prod Time */}
                    <td className={getCellClasses()}>
                      <Typography variant="body" className={`font-normal ${theme.text}`}>
                        {(po.hourly_run_rate > 0
                          ? po.ordered_qty_shippers / po.hourly_run_rate
                          : 0
                        ).toFixed(2)}
                      </Typography>
                    </td>

                    {/* Status */}
                    <td
                      className={getCellClasses()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Menu>
                        <MenuHandler>
                          <div className="flex flex-wrap justify-center items-center gap-1 p-1 cursor-pointer">
                            {po.statuses?.map((s: { status: string }) => {
                              let chipClass = theme.chip.blueGray;
                              if (s.status === "PO Check") chipClass = theme.chip.red;
                              else if (s.status === "Despatched/ Completed") chipClass = theme.chip.blue;
                              else if (s.status === "Open") chipClass = theme.chip.green;
                              else if (s.status === "PO Canceled") chipClass = theme.chip.red;
                              else if (s.status === "Closed") chipClass = theme.chip.blue;

                              return (
                                <div
                                  key={s.status}
                                  className={`py-1.5 px-3 rounded-md text-sm font-medium leading-none ${chipClass}`}
                                >
                                  {s.status}
                                </div>
                              );
                            })}
                            {(!po.statuses || po.statuses.length === 0) && (
                              <div className={`py-1.5 px-3 rounded-md text-sm font-medium leading-none ${theme.chip.green}`}>
                                Open
                              </div>
                            )}
                          </div>
                        </MenuHandler>
                        <MenuList>
                          {ALL_PO_STATUSES.map((statusOption) => {
                            const currentStatuses = po.statuses?.map((s: { status: string }) => s.status) || [];
                            const isChecked = currentStatuses.includes(statusOption);
                            const blocked = getBlockedStatuses(currentStatuses);
                            const isBlocked = !isChecked && blocked.has(statusOption);

                            return (
                              <MenuItem
                                key={statusOption}
                                onClick={() => {
                                  if (!isBlocked) {
                                    handleStatusUpdate(po.id, statusOption, po.statuses || []);
                                  }
                                }}
                                disabled={isBlocked}
                                className={isBlocked ? 'opacity-40 cursor-not-allowed' : ''}
                              >
                                <span className={`mr-2 ${isChecked ? "opacity-100 text-green-600 font-bold" : "opacity-0"}`}>✓</span>
                                <span className={isBlocked ? 'line-through' : ''}>
                                  {statusOption}
                                </span>
                                {isBlocked && (
                                  <span className="ml-auto text-xs text-red-400">blocked</span>
                                )}
                              </MenuItem>
                            );
                          })}

                          {/* Show PO Check if system-generated (read-only) */}
                          {po.statuses?.some((s: { status: string }) => s.status === 'PO Check') && (
                            <>
                              <hr className="my-1" />
                              <MenuItem disabled className="opacity-60">
                                <span className="mr-2 text-red-600 font-bold">⚠</span>
                                PO Check (System)
                              </MenuItem>
                            </>
                          )}
                        </MenuList>
                      </Menu>
                    </td>

                    {/* Actions */}
                    <td
                      className={getCellClasses(true)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text" size="sm">
                            <EllipsisVerticalIcon className={`h-5 w-5 ${theme.text}`} />
                          </IconButton>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleOpenEditForm(po)}
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit PO Details
                          </MenuItem>
                          <hr className="my-2" />
                          <MenuItem
                            className="flex items-center gap-2 text-red-500 hover:bg-red-50 focus:bg-red-50 active:bg-red-50"
                            onClick={() => handleOpenDeleteConfirm(po)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete PO
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      ) : (
        <div className="p-8 text-center">
          <Typography color="gray" className={theme.text}>
            {searchQuery || statusFilter
              ? `No purchase orders found matching the current filters.`
              : "No purchase orders found."}
          </Typography>
        </div>
      )}

      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={pagination.total}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Modals */}
      <PoDetailModal open={poToView !== null} handleOpen={() => handleOpenViewModal(null)} po={poToView} />
      <EditPoForm open={isEditFormOpen} handleOpen={() => handleOpenEditForm(null)} po={poToEdit} onUpdate={handlePoUpdate} />
      <ConfirmationDialog open={isDeleteConfirmOpen} handleOpen={() => handleOpenDeleteConfirm(null)} onConfirm={handleConfirmDelete} title="Delete Purchase Order?" message={`Are you sure you want to permanently delete PO ${poToDelete?.po_number}?`} />
    </Card>
  );
}