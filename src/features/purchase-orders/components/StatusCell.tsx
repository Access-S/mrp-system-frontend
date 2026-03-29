// src/features/purchase-orders/components/StatusCell.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { Menu } from "@/components/ui/Menu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScrollArea } from "@/components/ui/ScrollArea";

import { ALL_PO_STATUSES } from "@/types/mrp.types";
import { getBlockedStatuses } from "../helpers";

import type { PurchaseOrder } from "@/types/mrp.types";
import type { Status } from "@/components/ui/StatusBadge";

// ============== BLOCK 2: Types ==============

interface StatusCellProps {
  po: PurchaseOrder;
  onStatusUpdate: (poId: string, status: string, currentStatuses: string[]) => void;
}

// ============== BLOCK 3: Component ==============

export const StatusCell: React.FC<StatusCellProps> = ({ po, onStatusUpdate }) => {
  const currentStatuses = po.statuses || [];
  const blocked = getBlockedStatuses(currentStatuses);

  return (
    <Menu>
      <Menu.Trigger>
        <div
          className={clsx(
            "flex items-center gap-1 cursor-pointer",
            "p-1.5 rounded-md",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors"
          )}
        >
          <ScrollArea
            orientation="horizontal"
            maxWidth="220px"
            thumbSize={4}
            hideDelay={800}
            convertWheelToHorizontal
          >
            <div className="flex items-center gap-1 flex-nowrap">
              {currentStatuses.length > 0 ? (
                currentStatuses.map((s) => (
                  <StatusBadge
                    key={s}
                    status={s as Status}
                    size="sm"
                    variant="subtle"
                    className="flex-shrink-0"
                  />
                ))
              ) : (
                <StatusBadge status="Open" size="sm" variant="subtle" className="flex-shrink-0" />
              )}
            </div>
          </ScrollArea>
          <ChevronDownIcon className="w-3 h-3 text-gray-400 flex-shrink-0 ml-1" />
        </div>
      </Menu.Trigger>
      <Menu.Content position="bottom-start" minWidth={220}>
        <Menu.Label>Update Status</Menu.Label>
        <Menu.Divider />
        {ALL_PO_STATUSES.map((statusOption) => {
          const isChecked = currentStatuses.includes(statusOption);
          const isBlocked = !isChecked && blocked.has(statusOption);

          return (
            <Menu.Item
              key={statusOption}
              onClick={() => {
                if (!isBlocked) {
                  onStatusUpdate(po.id, statusOption, po.statuses || []);
                }
              }}
              disabled={isBlocked}
              icon={
                isChecked ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                ) : (
                  <span className="opacity-0">✓</span>
                )
              }
              rightIcon={
                isBlocked ? (
                  <span className="text-xs text-red-400">blocked</span>
                ) : undefined
              }
              className={isBlocked ? "line-through opacity-50" : ""}
            >
              {statusOption}
            </Menu.Item>
          );
        })}
        {currentStatuses.includes("PO Check") && (
          <>
            <Menu.Divider />
            <Menu.Item disabled icon={<span className="text-amber-600">⚠</span>}>
              PO Check (System)
            </Menu.Item>
          </>
        )}
      </Menu.Content>
    </Menu>
  );
};