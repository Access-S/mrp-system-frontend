// src/features/dashboard/components/RecentActivityCard.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/Card";

import type { RecentActivity } from "../services/dashboard.api";

// ============== BLOCK 2: Types ==============

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

// ============== BLOCK 3: Helpers ==============

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
    case "despatched":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "po check":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
};

// ============== BLOCK 4: Component ==============

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white dark:bg-gray-600">
                  <ShoppingCartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};