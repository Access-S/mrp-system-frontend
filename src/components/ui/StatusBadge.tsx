import React from "react";

export type Status =
  | "Open"
  | "Completed"
  | "Despatched/ Completed"
  | "PO Check"
  | "PO Canceled"
  | "Closed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const STATUS_COLORS: Record<Status, string> = {
  Open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Despatched/ Completed":
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "PO Check": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "PO Canceled":
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Closed: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]} ${className}`}
    >
      {status}
    </span>
  );
};