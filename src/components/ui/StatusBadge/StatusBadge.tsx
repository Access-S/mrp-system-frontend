// src/components/ui/StatusBadge/StatusBadge.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

export type Status =
  | "Open"
  | "Wip Called"
  | "Packaging Called"
  | "In Production"
  | "Completed"
  | "Despatched/ Completed"
  | "PO Check"
  | "PO Canceled"
  | "Closed";

type BadgeVariant = "filled" | "outlined" | "subtle";
type BadgeSize = "sm" | "md" | "lg";

interface StatusBadgeProps {
  status: Status;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

// ============== BLOCK 3: Status Color Mapping ==============

type ColorScheme = {
  filled: string;
  outlined: string;
  subtle: string;
  dot: string;
};

const STATUS_COLORS: Record<Status, ColorScheme> = {
  Open: {
    filled: "bg-blue-600 text-white dark:bg-blue-500",
    outlined: "border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400",
    subtle: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  "Wip Called": {
    filled: "bg-violet-600 text-white dark:bg-violet-500",
    outlined: "border border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400",
    subtle: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    dot: "bg-violet-500",
  },
  "Packaging Called": {
    filled: "bg-cyan-600 text-white dark:bg-cyan-500",
    outlined: "border border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400",
    subtle: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    dot: "bg-cyan-500",
  },
  "In Production": {
    filled: "bg-orange-600 text-white dark:bg-orange-500",
    outlined: "border border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400",
    subtle: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  Completed: {
    filled: "bg-green-600 text-white dark:bg-green-500",
    outlined: "border border-green-600 text-green-600 dark:border-green-400 dark:text-green-400",
    subtle: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-500",
  },
  "Despatched/ Completed": {
    filled: "bg-emerald-600 text-white dark:bg-emerald-500",
    outlined: "border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400",
    subtle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  "PO Check": {
    filled: "bg-amber-600 text-white dark:bg-amber-500",
    outlined: "border border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400",
    subtle: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "PO Canceled": {
    filled: "bg-red-600 text-white dark:bg-red-500",
    outlined: "border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400",
    subtle: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
  },
  Closed: {
    filled: "bg-slate-600 text-white dark:bg-slate-500",
    outlined: "border border-slate-600 text-slate-600 dark:border-slate-400 dark:text-slate-400",
    subtle: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    dot: "bg-slate-500",
  },
};

// ============== BLOCK 4: Size Styles ==============

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

// ============== BLOCK 5: Component ==============

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "subtle",
  size = "md",
  dot = false,
  className,
}) => {
  const colors = STATUS_COLORS[status];

  // Fallback for unknown statuses
  if (!colors) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded font-semibold",
          "transition-colors duration-150",
          sizeStyles[size],
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
          className
        )}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded font-semibold",
        "transition-colors duration-150",
        sizeStyles[size],
        colors[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full",
            colors.dot
          )}
        />
      )}
      {status}
    </span>
  );
};

// ============== BLOCK 6: Display Name ==============

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;