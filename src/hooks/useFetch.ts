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
 * Generic data fetching hook with abort-on-unmount and visibility-aware polling.
 *
 * - Aborts in-flight requests when the component unmounts or deps change (N1)
 * - Pauses polling when the browser tab is hidden, resumes on focus (N2)
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
 * // Polling every 5 minutes (pauses when tab is hidden)
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

  // Track the current AbortController so we can cancel on unmount or re-fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============== BLOCK 4: Execute Function ==============

  const execute = useCallback(async (): Promise<void> => {
    // Abort any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();

      // If this request was aborted (unmount or new request started), bail out
      if (controller.signal.aborted) return;

      setData(result);
    } catch (err: unknown) {
      // Don't update state if aborted — component may be unmounted
      if (controller.signal.aborted) return;

      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      console.error("useFetch error:", err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // ============== BLOCK 5: Initial Fetch + Dep Changes ==============

  // Track previous deps and first run to avoid eslint-disable
  const prevDepsRef = useRef<React.DependencyList>(deps);
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Compare deps with previous deps
    const depsChanged =
      prevDepsRef.current.length !== deps.length ||
      prevDepsRef.current.some((dep, i) => dep !== deps[i]);

    if (isFirstRunRef.current || depsChanged) {
      isFirstRunRef.current = false;
      prevDepsRef.current = deps;
      execute();
    }
  }, [execute, enabled]); 

  // ============== BLOCK 6: Polling with Tab Visibility ==============

  useEffect(() => {
    if (!pollingInterval || pollingInterval <= 0 || !enabled) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = (): void => {
      if (intervalId) return;
      intervalId = setInterval(execute, pollingInterval);
    };

    const stopPolling = (): void => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        // Tab hidden — stop wasting bandwidth
        stopPolling();
      } else {
        // Tab visible again — refetch immediately then resume polling
        execute();
        startPolling();
      }
    };

    // Only start polling if the tab is currently visible
    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [execute, pollingInterval, enabled]);

  // ============== BLOCK 7: Return ==============

  return { data, loading, error, refetch: execute };
}