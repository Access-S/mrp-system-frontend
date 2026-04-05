// src/components/ui/Table/Table.tsx

// ============== BLOCK 1: Imports ==============

import React, {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  useEffect,
  useState,
  ReactNode,
  ReactElement,
} from "react";
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
  maxHeight?: string;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

interface TableFooterProps extends HTMLAttributes<HTMLDivElement> {
  showBorder?: boolean;
}

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<TableSize, { cell: string; head: string }> = {
  sm: {
    cell: "px-3 py-2 text-xs",
    head: "px-3 py-2 text-xs font-semibold",
  },
  md: {
    cell: "px-4 py-3 text-sm",
    head: "px-4 py-3 text-sm font-semibold",
  },
  lg: {
    cell: "px-6 py-4 text-base",
    head: "px-6 py-4 text-base font-semibold",
  },
};

// ============== BLOCK 4: Variant Styles ==============

const getVariantStyles = (variant: TableVariant, isDark: boolean) => {
  const styles = {
    default: {
      container: isDark ? "bg-gray-900" : "bg-white",
      containerStyle: {
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      header: isDark
        ? "bg-gray-800 border-b border-gray-700"
        : "bg-gray-50 border-b border-gray-200",
      headerText: isDark ? "text-gray-200" : "text-gray-700",
      row: isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
      rowHover: isDark ? "hover:bg-gray-800" : "hover:bg-gray-50",
      cellText: isDark ? "text-gray-100" : "text-gray-900",
      footer: isDark
        ? "bg-gray-800 border-t border-gray-700"
        : "bg-gray-50 border-t border-gray-200",
      separator: isDark ? "border-gray-700" : "border-gray-200",
    },
    glass: {
      container: "",
      containerStyle: {
        borderRadius: "1rem",
        overflow: "hidden",
        background: isDark
          ? "rgba(17, 24, 39, 0.7)"
          : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          : "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      },
      header: isDark
        ? "bg-white/5 border-b border-white/10"
        : "bg-white/40 border-b border-gray-200/50",
      headerText: isDark ? "text-gray-100" : "text-gray-800",
      row: isDark
        ? "bg-transparent border-white/5"
        : "bg-transparent border-gray-200/30",
      rowHover: isDark
        ? "hover:bg-white/5"
        : "hover:bg-white/60",
      cellText: isDark ? "text-gray-100" : "text-gray-800",
      footer: isDark
        ? "bg-white/5 border-t border-white/10"
        : "bg-white/40 border-t border-gray-200/50",
      separator: isDark ? "border-white/10" : "border-gray-200/50",
    },
    material: {
      container: isDark ? "bg-gray-800" : "bg-white",
      containerStyle: {
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: isDark
          ? "0 2px 4px -1px rgba(0, 0, 0, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.2)"
          : "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
      header: isDark
        ? "bg-gray-700 border-b border-gray-600"
        : "bg-blue-50 border-b border-blue-100",
      headerText: isDark ? "text-gray-100" : "text-blue-900",
      row: isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100",
      rowHover: isDark
        ? "hover:bg-gray-700"
        : "hover:bg-blue-50/50",
      cellText: isDark ? "text-gray-100" : "text-gray-900",
      footer: isDark
        ? "bg-gray-700 border-t border-gray-600"
        : "bg-blue-50 border-t border-blue-100",
      separator: isDark ? "border-gray-600" : "border-blue-100",
    },
    minimal: {
      container: isDark ? "bg-transparent" : "bg-transparent",
      containerStyle: {},
      header: isDark
        ? "bg-transparent border-b-2 border-gray-700"
        : "bg-transparent border-b-2 border-gray-300",
      headerText: isDark ? "text-gray-200" : "text-gray-900",
      row: isDark
        ? "bg-transparent border-gray-800"
        : "bg-transparent border-gray-100",
      rowHover: isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50",
      cellText: isDark ? "text-gray-200" : "text-gray-800",
      footer: isDark
        ? "bg-transparent border-t-2 border-gray-700"
        : "bg-transparent border-t-2 border-gray-300",
      separator: isDark ? "border-gray-700" : "border-gray-300",
    },
    striped: {
      container: isDark ? "bg-gray-900" : "bg-white",
      containerStyle: {
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
      },
      header: isDark
        ? "bg-gray-800 border-b border-gray-700"
        : "bg-gray-50 border-b border-gray-200",
      headerText: isDark ? "text-gray-200" : "text-gray-700",
      row: isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
      rowHover: isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
      cellText: isDark ? "text-gray-100" : "text-gray-900",
      footer: isDark
        ? "bg-gray-800 border-t border-gray-700"
        : "bg-gray-50 border-t border-gray-200",
      separator: isDark ? "border-gray-700" : "border-gray-200",
    },
  };

  return styles[variant];
};

// ============== BLOCK 5: Helper to Extract Footer ==============

const extractFooter = (children: ReactNode): { tableChildren: ReactNode[]; footer: ReactElement | null } => {
  const tableChildren: ReactNode[] = [];
  let footer: ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TableFooter) {
      footer = child;
    } else {
      tableChildren.push(child);
    }
  });

  return { tableChildren, footer };
};

// ============== BLOCK 6: Table Root Component ==============

const TableRoot: React.FC<TableProps> = ({
  children,
  variant = "default",
  size = "md",
  hoverable = true,
  stickyHeader = true,
  maxHeight,
  className,
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const variantStyles = getVariantStyles(variant, isDark);
  const { tableChildren, footer } = extractFooter(children);

  return (
    <TableContext.Provider
      value={{ variant, size, hoverable, stickyHeader, isDark }}
    >
      <div
        className={clsx("w-full", className)}
        style={variantStyles.containerStyle as React.CSSProperties}
      >
        {/* Scrollable Table Area */}
        <div
          className="w-full overflow-auto"
          style={maxHeight ? { maxHeight } : undefined}
        >
          <table
            className={clsx(
              "w-full min-w-full text-left border-collapse",
              variantStyles.container
            )}
            {...props}
          >
            {tableChildren}
          </table>
        </div>

        {/* Footer (outside scrollable area) */}
        {footer}
      </div>
    </TableContext.Provider>
  );
};

// ============== BLOCK 7: Table Header Component ==============

const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  const { stickyHeader, variant, isDark } = useTableContext();
  const variantStyles = getVariantStyles(variant, isDark);

  return (
    <thead
      className={clsx(
        variantStyles.header,
        stickyHeader && "sticky top-0 z-20",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

// ============== BLOCK 8: Table Body Component ==============

const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  const { variant, isDark } = useTableContext();

  return (
    <tbody
      className={clsx(
        "divide-y",
        variant === "striped" &&
        (isDark
          ? "[&>tr:nth-child(even)]:bg-gray-800/50"
          : "[&>tr:nth-child(even)]:bg-gray-50"),
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

// ============== BLOCK 9: Table Row Component ==============

const TableRow: React.FC<TableRowProps> = ({
  children,
  isSelected = false,
  className,
  ...props
}) => {
  const { hoverable, variant, isDark } = useTableContext();
  const variantStyles = getVariantStyles(variant, isDark);

  return (
    <tr
      className={clsx(
        variantStyles.row,
        "transition-all duration-200",
        hoverable && variantStyles.rowHover,
        isSelected && (isDark ? "bg-blue-900/30" : "bg-blue-50"),
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

// ============== BLOCK 10: Table Head Cell Component ==============

const TableHead: React.FC<TableHeadProps> = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  className,
  ...props
}) => {
  const { size, variant, isDark } = useTableContext();
  const variantStyles = getVariantStyles(variant, isDark);

  const hasAlignmentClass =
    className && /text-(left|center|right)/.test(className);

  return (
    <th
      className={clsx(
        sizeStyles[size].head,
        variantStyles.headerText,
        !hasAlignmentClass && "text-left",
        "whitespace-nowrap",
        "uppercase tracking-wider",
        sortable &&
        "cursor-pointer select-none transition-colors duration-200",
        sortable &&
        (isDark ? "hover:bg-white/10" : "hover:bg-black/5"),
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-2">
          {children}
          <span
            className={clsx(
              "transition-colors",
              sortDirection
                ? isDark
                  ? "text-blue-400"
                  : "text-blue-600"
                : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
            )}
          >
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

// ============== BLOCK 11: Table Cell Component ==============

const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  const { size, variant, isDark } = useTableContext();
  const variantStyles = getVariantStyles(variant, isDark);

  return (
    <td
      className={clsx(sizeStyles[size].cell, variantStyles.cellText, className)}
      {...props}
    >
      {children}
    </td>
  );
};

// ============== BLOCK 12: Table Footer Component ==============

const TableFooter: React.FC<TableFooterProps> = ({
  children,
  showBorder = true,
  className,
  ...props
}) => {
  const { variant, isDark, size } = useTableContext();
  const variantStyles = getVariantStyles(variant, isDark);

  return (
    <div
      className={clsx(
        "w-full",
        variantStyles.footer,
        "flex items-center justify-between gap-4 flex-wrap",
        size === "sm" && "px-3 py-3",
        size === "md" && "px-4 py-4",
        size === "lg" && "px-6 py-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ============== BLOCK 13: Compound Component Export ==============

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Footer: TableFooter,
});

export default Table;