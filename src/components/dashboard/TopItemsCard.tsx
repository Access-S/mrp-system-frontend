// src/components/dashboard/TopItemsCard.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";

import { Card, CardContent } from "../ui/Card";

import type { TopCustomer, TopProduct } from "../../services/dashboard.api";

// ============== BLOCK 2: Types ==============

interface TopItemsCardProps {
  title: string;
  items: TopCustomer[] | TopProduct[];
  type: "customers" | "products";
}

// ============== BLOCK 3: Helpers ==============

const getRankStyles = (index: number): string => {
  switch (index) {
    case 0:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case 1:
      return "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    case 2:
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
  }
};

// ============== BLOCK 4: Component ==============

export const TopItemsCard: React.FC<TopItemsCardProps> = ({ title, items, type }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        <div className="space-y-3">
          {items.map((item, index) => {
            const isCustomer = type === "customers";
            const customer = isCustomer ? (item as TopCustomer) : null;
            const product = !isCustomer ? (item as TopProduct) : null;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyles(
                      index
                    )}`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {customer ? customer.customerName : product?.productCode}
                    </p>
                    {product && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.description?.substring(0, 30)}...
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {customer
                      ? `$${customer.totalValue.toLocaleString()}`
                      : product?.totalQuantity.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {customer
                      ? `${customer.orderCount} orders`
                      : `${product?.orderCount} orders`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};