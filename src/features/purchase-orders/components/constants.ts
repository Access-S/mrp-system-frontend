// src/features/purchase-orders/components/constants.ts

// ============== BLOCK 1: Imports ==============

import type { SelectOption } from "@/components/ui/Select";

// ============== BLOCK 2: Status Filter Options ==============

export const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "Open", label: "Open" },
  { value: "Wip Called", label: "Wip Called" },
  { value: "Packaging Called", label: "Packaging Called" },
  { value: "In Production", label: "In Production" },
  { value: "Despatched/ Completed", label: "Despatched/ Completed" },
  { value: "Closed", label: "Closed" },
  { value: "PO Canceled", label: "PO Canceled" },
];

// ============== BLOCK 3: Pagination Options ==============

export const ITEMS_PER_PAGE_OPTIONS: SelectOption[] = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];