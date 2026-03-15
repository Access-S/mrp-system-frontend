// src/hooks/useSort.ts

// ============== BLOCK 1: Imports ==============

import { useState, useCallback } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export type SortDirection = "asc" | "desc";

export interface UseSortResult {
  /** Current sort direction */
  direction: SortDirection;
  /** Toggle between asc and desc */
  toggle: () => void;
  /** Set a specific direction */
  setDirection: (direction: SortDirection) => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Sort direction toggle hook.
 *
 * @param initialDirection - Starting sort direction (default: "desc")
 *
 * @example
 * const sort = useSort("desc");
 *
 * <Button onClick={sort.toggle}>
 *   {sort.direction === "desc" ? "Newest" : "Oldest"}
 * </Button>
 */
export function useSort(
  initialDirection: SortDirection = "desc"
): UseSortResult {
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const toggle = useCallback(() => {
    setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  return { direction, toggle, setDirection };
}