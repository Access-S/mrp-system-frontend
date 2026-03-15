// src/components/shared/ResultsCount/ResultsCount.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

// ============== BLOCK 2: Types & Interfaces ==============

interface ResultsCountProps {
  /** Number of filtered/visible items */
  filtered: number;
  /** Total number of items before filtering */
  total: number;
  /** Label for the items (default: "products") */
  label?: string;
  /** Optional content on the right side (e.g., a Badge) */
  rightContent?: React.ReactNode;
}

// ============== BLOCK 3: Component ==============

export const ResultsCount = ({
  filtered,
  total,
  label = "products",
  rightContent,
}: ResultsCountProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {filtered}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {total}
        </span>{" "}
        {label}
      </p>
      {rightContent && rightContent}
    </div>
  );
};