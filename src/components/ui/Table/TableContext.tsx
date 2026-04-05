// src/components/ui/Table/TableContext.tsx

// ============== BLOCK 1: Imports & Types ==============

import { createContext, useContext } from "react";

export type TableVariant = "default" | "glass" | "material" | "minimal" | "striped";
export type TableSize = "sm" | "md" | "lg";

export interface TableContextValue {
  variant: TableVariant;
  size: TableSize;
  hoverable: boolean;
  stickyHeader: boolean;
  isDark: boolean;
}

// ============== BLOCK 2: Context ==============

const TableContext = createContext<TableContextValue>({
  variant: "default",
  size: "md",
  hoverable: true,
  stickyHeader: true,
  isDark: false,
});

export const useTableContext = () => useContext(TableContext);

export default TableContext;