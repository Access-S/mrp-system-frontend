// src/hooks/useFetch.ts

// ============== BLOCK 1: Imports ==============

import { useState, useEffect, useCallback, useRef } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UseFetchOptions {
  /** Auto-refresh interval in milliseconds. 0 or undefined = no polling */
  pollingInterval?: number;
  /** Set to false to prevent fetching until a condition is met */
  enabled?: boolean;
}

export interface UseFetchResult<T> {
  /** The fetched data, or null if not yet loaded */
  data: T | null;
  /** True during initial load or re-fetch */
  loading: boolean;
  /** Error message if the fetch failed, null otherwise */
  error: string | null;
  /** Manually trigger a re-fetch */
  refetch: () => Promise<void>;
}

// ============== BLOCK 3: Hook ==============

/**
 * Generic data fetching hook that replaces the repeated
 * useState + useCallback + useEffect pattern across pages.
 *
 * @param fetchFn - Async function that returns data
 * @param deps - Re-fetch when these values change (like useEffect deps)
 * @param options - Optional: pollingInterval, enabled
 *
 * @example
 * // Simple fetch on mount
 * const { data, loading, error } = useFetch(productService.getAllProducts);
 *
 * @example
 * // Re-fetch when dependencies change
 * const { data, loading, error } = useFetch(
 *   () => fetchForecasts(selectedWeeks),
 *   [selectedWeeks]
 * );
 *
 * @example
 * // Polling every 5 minutes
 * const { data, loading, error } = useFetch(
 *   () => fetchDashboardData(timeRange),
 *   [timeRange],
 *   { pollingInterval: 5 * 60 * 1000 }
 * );
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { pollingInterval, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Store fetchFn in a ref so the execute callback never goes stale
  // even when the caller passes an inline arrow function
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      console.error("useFetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + re-fetch when deps change
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    execute();
    // deps are provided by the caller — this is a standard custom hook pattern
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, enabled, ...deps]);

  // Polling interval (independent of deps)
  useEffect(() => {
    if (!pollingInterval || pollingInterval <= 0 || !enabled) return;

    const interval = setInterval(execute, pollingInterval);
    return () => clearInterval(interval);
  }, [execute, pollingInterval, enabled]);

  return { data, loading, error, refetch: execute };
}