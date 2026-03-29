// src/features/purchase-orders/components/ActionsCell.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Menu } from "@/components/ui/Menu";
import { Tooltip } from "@/components/ui/Tooltip";

import type { PurchaseOrder } from "@/types/mrp.types";

// ============== BLOCK 2: Types ==============

interface ActionsCellProps {
  po: PurchaseOrder;
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
}

// ============== BLOCK 3: Component ==============

export const ActionsCell: React.FC<ActionsCellProps> = ({ po, onEdit, onDelete }) => {
  return (
    <Menu>
      <Menu.Trigger>
        <Tooltip content="Actions" position="top">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </Tooltip>
      </Menu.Trigger>
      <Menu.Content position="bottom-end" minWidth={160}>
        <Menu.Item
          icon={<PencilSquareIcon className="w-4 h-4" />}
          onClick={() => onEdit(po)}
        >
          Edit PO Details
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<TrashIcon className="w-4 h-4" />}
          onClick={() => onDelete(po)}
          danger
        >
          Delete PO
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};