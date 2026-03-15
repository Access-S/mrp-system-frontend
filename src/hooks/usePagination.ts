// src/hooks/usePagination.ts

// ============== BLOCK 1: Imports ==============

import { useState, useCallback } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UsePaginationOptions {
  /** Starting page number (default: 1) */
  initialPage?: number;
  /** Starting items per page (default: 25) */
  initialLimit?: number;
}

export interface UsePaginationResult {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items (from server response) */
  total: number;
  /** Total number of pages (from server response) */
  totalPages: number;
  /** Navigate to a specific page */
  setPage: (page: number) => void;
  /** Change items per page (resets to page 1) */
  setLimit: (limit: number) => void;
  /** Sync state with server pagination response */
  updateFromResponse: (response: {
    total: number;
    page: number;
    totalPages: number;
  }) => void;
  /** Reset to initial values */
  reset: () => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Server-side pagination state management hook.
 * Manages page + limit on the client, syncs totals from server responses.
 *
 * @example
 * const pagination = usePagination({ initialLimit: 25 });
 *
 * // After fetching:
 * pagination.updateFromResponse(response.pagination);
 *
 * // In JSX:
 * <Pagination
 *   currentPage={pagination.page}
 *   totalPages={pagination.totalPages}
 *   onPageChange={pagination.setPage}
 * />
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationResult {
  const { initialPage = 1, initialLimit = 25 } = options;

  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages) {
        setPageState(newPage);
      }
    },
    [totalPages]
  );

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1);
  }, []);

  const updateFromResponse = useCallback(
    (response: { total: number; page: number; totalPages: number }) => {
      setTotal(response.total);
      setPageState(response.page);
      setTotalPages(response.totalPages);
    },
    []
  );

  const reset = useCallback(() => {
    setPageState(initialPage);
    setLimitState(initialLimit);
    setTotal(0);
    setTotalPages(1);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    updateFromResponse,
    reset,
  };
}