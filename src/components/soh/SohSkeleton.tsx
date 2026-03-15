// src/components/soh/SohSkeleton.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

import { Card, CardHeader, CardContent } from "../ui/Card";
import { Skeleton, SkeletonTableRow } from "../ui/Skeleton";

// ============== BLOCK 2: Component ==============

export const SohSkeleton: React.FC = () => {
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

      {/* KPI Card Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="rounded" width={40} height={40} />
              <div className="space-y-2">
                <Skeleton variant="text" width={100} height={14} />
                <Skeleton variant="text" width={140} height={28} />
              </div>
            </div>
            <Skeleton variant="rounded" width={100} height={28} />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton variant="rounded" width={300} height={40} />
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className="p-3 bg-gray-50 dark:bg-gray-800">
                        <Skeleton variant="text" height={20} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <SkeletonTableRow key={i} columns={4} />
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