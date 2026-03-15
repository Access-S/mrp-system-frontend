// src/components/purchase-orders/helpers.ts

// ============== BLOCK 1: Imports ==============

import { ALL_PO_STATUSES } from "../../types/mrp.types";

// ============== BLOCK 2: Status Logic ==============

/**
 * Determines which statuses are blocked based on current active statuses.
 * Used by StatusCell to disable menu items.
 */
export const getBlockedStatuses = (currentStatuses: string[]): Set<string> => {
  const blocked = new Set<string>();
  const has = (s: string): boolean => currentStatuses.includes(s);

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

// ============== BLOCK 3: Calculations ==============

/**
 * Calculates production time in hours from quantity and hourly rate.
 */
export const calculateProductionTime = (qty: number, rate: number): string => {
  if (rate <= 0) return "0.00";
  return (qty / rate).toFixed(2);
};