// src/features/purchase-orders/types/purchaseOrder.types.ts

import type { Product, BomComponent } from '@/types/mrp.types';

// Purchase Order Status
export type PoStatus =
  | "Open"
  | "Wip Called"
  | "Packaging Called"
  | "PO Check"
  | "In WH Ready"
  | "In Production"
  | "Awaiting QA Release"
  | "Ready for Despatch"
  | "Despatched/ Completed"
  | "Closed"
  | "PO Canceled";

// Purchase Order Interface
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  sequence?: number;
  description?: string;
  customerName: string;
  poCreatedDate: string;
  poReceivedDate: string;
  requestedDeliveryDate?: string;
  orderedQtyPieces: number;
  orderedQtyShippers: number;
  customerAmount: number;
  systemAmount: number;
  currentStatus: string;
  statuses: string[];
  deliveryDate?: string;
  deliveryDocketNumber?: string;
  hourlyRunRate?: number;
  minsPerShipper?: number;
  createdAt?: string;
  updatedAt?: string;
  product?: Product;
  components?: BomComponent[];
}

// Constant array of all possible statuses
export const ALL_PO_STATUSES: PoStatus[] = [
  "Open",
  "Wip Called",
  "Packaging Called",
  "In WH Ready",
  "In Production",
  "Awaiting QA Release",
  "Ready for Despatch",
  "Despatched/ Completed",
  "Closed",
  "PO Canceled",
];