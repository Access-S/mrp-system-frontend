// src/hooks/useSearch.ts

// ============== BLOCK 1: Imports ==============

import { useState, useMemo, useRef, useEffect } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UseSearchResult<T> {
  /** Current search query (raw, not debounced) */
  query: string;
  /** Update the search query */
  setQuery: (value: string) => void;
  /** Filtered results after applying debounced search */
  filtered: T[];
}

// ============== BLOCK 3: Hook ==============

/**
 * Client-side search/filter hook with built-in debounce.
 * Replaces the repeated useState + useMemo filter pattern.
 *
 * @param data - Array of items to search through
 * @param searchKeys - Array of object keys to match against
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 *
 * @example
 * const { query, setQuery, filtered } = useSearch(
 *   products,
 *   ["productCode", "description"]
 * );
 *
 * @example
 * // With custom debounce
 * const { query, setQuery, filtered } = useSearch(
 *   sohRecords,
 *   ["part_code", "description"],
 *   500
 * );
 */
export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  searchKeys: Array<keyof T & string>,
  debounceMs: number = 300
): UseSearchResult<T> {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the query
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new debounce timer
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    // Cleanup on unmount or query change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, debounceMs]);

  const filtered = useMemo(() => {
    if (!data) return [];

    const trimmed = debouncedQuery.trim().toLowerCase();
    if (!trimmed) return data;

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(trimmed);
      })
    );
  }, [data, debouncedQuery, searchKeys]);

  return { query, setQuery, filtered };
}