// src/components/ui/Table/TableContext.tsx

// ============== BLOCK 1: Imports & Types ==============

import { createContext, useContext } from "react";

export type TableVariant = "default" | "striped" | "bordered";
export type TableSize = "sm" | "md" | "lg";

export interface TableContextValue {
  variant: TableVariant;
  size: TableSize;
  hoverable: boolean;
  stickyHeader: boolean;
}

// ============== BLOCK 2: Context ==============

const TableContext = createContext<TableContextValue>({
  variant: "striped",
  size: "md",
  hoverable: true,
  stickyHeader: true,
});

export const useTableContext = () => useContext(TableContext);

export default TableContext;