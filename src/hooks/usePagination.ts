// src/hooks/useClientPagination.ts

// ============== BLOCK 1: Imports ==============

import { useState, useMemo, useEffect } from "react";

// ============== BLOCK 2: Types ==============

export interface UseClientPaginationOptions {
  /** Starting page number (default: 1) */
  initialPage?: number;
  /** Starting items per page (default: 25) */
  initialItemsPerPage?: number;
}

export interface UseClientPaginationResult<T> {
  /** Current page number */
  currentPage: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total items count */
  totalItems: number;
  /** Paginated slice of data for current page */
  paginatedData: T[];
  /** Navigate to a specific page */
  setCurrentPage: (page: number) => void;
  /** Change items per page (resets to page 1) */
  setItemsPerPage: (limit: number) => void;
  /** Reset to initial values */
  reset: () => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Client-side pagination hook.
 * Takes full data array and returns paginated slice.
 *
 * @example
 * const {
 *   paginatedData,
 *   currentPage,
 *   totalPages,
 *   setCurrentPage,
 *   itemsPerPage,
 *   setItemsPerPage
 * } = useClientPagination(filteredProducts, { initialItemsPerPage: 25 });
 *
 * // Render only paginatedData in table
 * // Use currentPage, totalPages, setCurrentPage for Pagination component
 */
export function useClientPagination<T>(
  data: T[],
  options: UseClientPaginationOptions = {}
): UseClientPaginationResult<T> {
  const { initialPage = 1, initialItemsPerPage = 25 } = options;

  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  // Reset to page 1 if current page exceeds total pages (e.g., after filtering)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPageState(1);
    }
  }, [totalPages, currentPage]);

  // Get paginated slice
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Set page with bounds checking
  const setCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageState(page);
    }
  };

  // Set items per page (resets to page 1)
  const setItemsPerPage = (limit: number) => {
    setItemsPerPageState(limit);
    setCurrentPageState(1);
  };

  // Reset to initial values
  const reset = () => {
    setCurrentPageState(initialPage);
    setItemsPerPageState(initialItemsPerPage);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: data.length,
    paginatedData,
    setCurrentPage,
    setItemsPerPage,
    reset,
  };
}