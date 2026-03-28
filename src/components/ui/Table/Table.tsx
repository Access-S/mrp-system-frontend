// src/components/ui/Table/Table.tsx

// ============== BLOCK 1: Imports ==============

import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import clsx from "clsx";
import TableContext, {
  TableVariant,
  TableSize,
  useTableContext,
} from "./TableContext";

// ============== BLOCK 2: Types & Interfaces ==============

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
  size?: TableSize;
  hoverable?: boolean;
  stickyHeader?: boolean;
}

// Removed TableHeaderProps and TableBodyProps (use HTMLAttributes<HTMLTableSectionElement> directly)

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

// Removed TableCellProps (use TdHTMLAttributes<HTMLTableCellElement> directly)

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<TableSize, { cell: string; head: string }> = {
  sm: {
    cell: "px-3 py-2 text-xs",
    head: "px-3 py-2 text-xs",
  },
  md: {
    cell: "px-4 py-3 text-sm",
    head: "px-4 py-3 text-xs",
  },
  lg: {
    cell: "px-6 py-4 text-base",
    head: "px-6 py-4 text-sm",
  },
};

// ============== BLOCK 4: Table Root Component ==============

const TableRoot: React.FC<TableProps> = ({
  children,
  variant = "striped",
  size = "md",
  hoverable = true,
  stickyHeader = true,
  className,
  ...props
}) => {
  return (
    <TableContext.Provider value={{ variant, size, hoverable, stickyHeader }}>
      <div className="w-full">
        <table
          className={clsx(
            "w-full min-w-table text-left",
            "border-collapse",
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

// ============== BLOCK 5: Table Header Component ==============

const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  const { stickyHeader } = useTableContext();

  return (
    <thead
      className={clsx(
        "bg-gray-50 dark:bg-gray-800",
        "border-b border-gray-200 dark:border-gray-700",
        stickyHeader && "sticky top-0 z-10",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

// ============== BLOCK 6: Table Body Component ==============

const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  const { variant } = useTableContext();

  return (
    <tbody
      className={clsx(
        "divide-y divide-gray-200 dark:divide-gray-700",
        variant === "striped" &&
          "[&>tr:nth-child(even)]:bg-gray-50 dark:[&>tr:nth-child(even)]:bg-gray-800/50",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

// ============== BLOCK 7: Table Row Component ==============

const TableRow: React.FC<TableRowProps> = ({
  children,
  isSelected = false,
  className,
  ...props
}) => {
  const { hoverable } = useTableContext();

  return (
    <tr
      className={clsx(
        "bg-white dark:bg-gray-900",
        "transition-colors duration-150",
        hoverable && "hover:bg-gray-100 dark:hover:bg-gray-800",
        isSelected && "bg-blue-50 dark:bg-blue-900/20",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// ============== BLOCK 8: Table Head Cell Component ==============

const TableHead: React.FC<TableHeadProps> = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  className,
  ...props
}) => {
  const { size } = useTableContext();

  // Check if alignment class is provided
  const hasAlignmentClass = className && /text-(left|center|right)/.test(className);

  return (
    <th
      className={clsx(
        sizeStyles[size].head,
        "font-semibold text-gray-700 dark:text-gray-300",
        !hasAlignmentClass && "text-left",
        "whitespace-nowrap",
        "bg-gray-50 dark:bg-gray-800",
        sortable && "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-2">
          {children}
          <span className="text-gray-400">
            {sortDirection === "asc" && "↑"}
            {sortDirection === "desc" && "↓"}
            {sortDirection === null && "↕"}
          </span>
        </div>
      ) : (
        children
      )}
    </th>
  );
};

// ============== BLOCK 9: Table Cell Component ==============

const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  const { size } = useTableContext();

  return (
    <td
      className={clsx(
        sizeStyles[size].cell,
        "text-gray-900 dark:text-gray-100",
        "whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

// ============== BLOCK 10: Compound Component Export ==============

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});

export default Table;