// src/features/forecasts/components/ForecastSkeleton.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Skeleton, SkeletonTableRow } from "@/components/ui/Skeleton";

// ============== BLOCK 2: Component ==============

export const ForecastSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="space-y-2">
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width={300} height={16} />
            </div>
            <Skeleton variant="rounded" width={140} height={40} />
          </div>
        </CardHeader>
      </Card>

      {/* Chart Skeleton */}
      <Skeleton variant="rounded" height={280} className="w-full" />

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton variant="rounded" width={300} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
              <Skeleton variant="rounded" width={120} height={40} />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    {[...Array(6)].map((_, i) => (
                      <th key={i} className="p-3 bg-gray-50 dark:bg-gray-800">
                        <Skeleton variant="text" height={20} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={6} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};