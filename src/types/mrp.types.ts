// src/types/mrp.types.ts

// BomComponent and Product interfaces
export interface BomComponent {
  partCode: string;
  partDescription: string;
  partType: string;
  perShipper: number;
  unitCost?: number;
}

// Component interface (for inventory/stock items)
export interface Component {
  id: string;
  partCode: string;
  partDescription: string;
  stock: number;
  safetyStock: number;
  reorderPoint: number;
  unitCost: number;
  supplier?: string;
  leadTime?: number;
}

// Forecast interface
export interface Forecast {
  productCode: string;
  description: string;
  weeklyForecast: { [week: string]: number };
}

// BLOCK 2: Product Interface
export interface Product {
  id: string;
  productCode: string;
  description: string;
  components: BomComponent[];
  unitsPerShipper?: number;
  dailyRunRate?: number;
  hourlyRunRate?: number;
  minsPerShipper?: number;
  pricePerShipper?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Purchase Order Structure
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