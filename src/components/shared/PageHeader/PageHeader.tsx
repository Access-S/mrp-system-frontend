// src/components/shared/PageHeader/PageHeader.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

// ============== BLOCK 2: Types & Interfaces ==============

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Short description below the title */
  description?: string;
  /** Action buttons rendered on the right side */
  actions?: React.ReactNode;
}

// ============== BLOCK 3: Component ==============

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};