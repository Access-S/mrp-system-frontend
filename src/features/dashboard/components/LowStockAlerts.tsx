// src/features/dashboard/components/LowStockAlerts.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import { Card, CardContent } from "@/components/ui/Card";

import type { LowStockAlert } from "../services/dashboard.api";

// ============== BLOCK 2: Types ==============

interface LowStockAlertsProps {
  alerts: LowStockAlert[];
}

// ============== BLOCK 3: Component ==============

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Low Stock Alerts
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="h-12 w-12 mb-3 text-green-500 dark:text-green-400" />
            <p className="font-medium text-gray-600 dark:text-gray-300">
              All stock levels healthy!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Low Stock Alerts
          </h3>
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {alerts.length} items
          </span>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.slice(0, 5).map((alert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-gray-700/50"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {alert.productId}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {alert.description || "No description"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-500">{alert.stockOnHand}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  of {alert.safetyStock} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};