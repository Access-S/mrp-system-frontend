// src/components/dashboard/DashboardSkeleton.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

import { Skeleton } from "../ui/Skeleton";

// ============== BLOCK 2: Component ==============

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`kpi1-${i}`} className="rounded-xl h-32" />
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`kpi2-${i}`} className="rounded-xl h-32" />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="rounded-xl h-80" />
        <Skeleton className="rounded-xl h-80" />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="rounded-xl h-80" />
        <Skeleton className="rounded-xl h-80" />
        <Skeleton className="rounded-xl h-80" />
      </div>
    </div>
  );
};