// src/components/ui/Pagination/Pagination.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

// ============== BLOCK 2: Types ==============

type PaginationSize = "sm" | "md" | "lg";
type PaginationVariant = "default" | "outlined" | "filled";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  variant?: PaginationVariant;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
  className?: string;
}

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<PaginationSize, { button: string; icon: string; text: string }> = {
  sm: {
    button: "h-7 min-w-[28px] px-2 text-xs",
    icon: "w-3 h-3",
    text: "text-xs",
  },
  md: {
    button: "h-9 min-w-[36px] px-3 text-sm",
    icon: "w-4 h-4",
    text: "text-sm",
  },
  lg: {
    button: "h-11 min-w-[44px] px-4 text-base",
    icon: "w-5 h-5",
    text: "text-base",
  },
};

// ============== BLOCK 4: Variant Styles ==============

const getVariantStyles = (variant: PaginationVariant, isActive: boolean, disabled: boolean) => {
  if (disabled) {
    return "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed";
  }

  const styles: Record<PaginationVariant, { active: string; inactive: string }> = {
    default: {
      active: "bg-blue-600 text-white shadow-sm",
      inactive: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    outlined: {
      active: "bg-blue-600 text-white border-blue-600",
      inactive: "bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    filled: {
      active: "bg-blue-600 text-white",
      inactive: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
    },
  };

  return isActive ? styles[variant].active : styles[variant].inactive;
};

// ============== BLOCK 5: Helper Functions ==============

const getVisiblePages = (currentPage: number, totalPages: number, maxVisible: number): (number | "ellipsis")[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - maxVisible + 1;
  }

  const pages: (number | "ellipsis")[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }

  for (let i = start; i <= end; i++) {
    if (i > 0 && i <= totalPages) {
      pages.push(i);
    }
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
};

// ============== BLOCK 6: Component ==============

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = "md",
  variant = "default",
  showFirstLast = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  disabled = false,
  className,
}) => {
  const styles = sizeStyles[size];
  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const baseButtonStyles = clsx(
    "inline-flex items-center justify-center",
    "rounded-md",
    "font-medium",
    "transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
    styles.button
  );

  // ============== BLOCK 7: Render ==============

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={clsx("flex items-center gap-1", className)}
    >
      {/* First Page Button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={disabled || currentPage === 1}
          aria-label="Go to first page"
          className={clsx(
            baseButtonStyles,
            getVariantStyles(variant, false, disabled || currentPage === 1)
          )}
        >
          <ChevronDoubleLeftIcon className={styles.icon} />
        </button>
      )}

      {/* Previous Page Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        aria-label="Go to previous page"
        className={clsx(
          baseButtonStyles,
          getVariantStyles(variant, false, disabled || currentPage === 1)
        )}
      >
        <ChevronLeftIcon className={styles.icon} />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <>
          {visiblePages.map((page, index) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className={clsx(
                  "inline-flex items-center justify-center",
                  styles.button,
                  "text-gray-500 dark:text-gray-400"
                )}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={clsx(
                  baseButtonStyles,
                  getVariantStyles(variant, currentPage === page, disabled)
                )}
              >
                {page}
              </button>
            )
          )}
        </>
      )}

      {/* Next Page Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        aria-label="Go to next page"
        className={clsx(
          baseButtonStyles,
          getVariantStyles(variant, false, disabled || currentPage === totalPages)
        )}
      >
        <ChevronRightIcon className={styles.icon} />
      </button>

      {/* Last Page Button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label="Go to last page"
          className={clsx(
            baseButtonStyles,
            getVariantStyles(variant, false, disabled || currentPage === totalPages)
          )}
        >
          <ChevronDoubleRightIcon className={styles.icon} />
        </button>
      )}
    </nav>
  );
};

// ============== BLOCK 8: Page Info Component ==============

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  size?: PaginationSize;
  className?: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  size = "md",
  className,
}) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p
      className={clsx(
        "text-gray-600 dark:text-gray-400",
        sizeStyles[size].text,
        className
      )}
    >
      Showing <span className="font-medium text-gray-900 dark:text-gray-100">{start}</span> to{" "}
      <span className="font-medium text-gray-900 dark:text-gray-100">{end}</span> of{" "}
      <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
    </p>
  );
};

// ============== BLOCK 9: Display Names ==============

Pagination.displayName = "Pagination";
PaginationInfo.displayName = "PaginationInfo";

export default Pagination;