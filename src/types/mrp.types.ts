// src/types/mrp.types.ts

// BomComponent and Product interfaces
export interface BomComponent {
  partCode: string;
  partDescription: string;
  partType: string;
  perShipper: number;
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
  productCode: string;
  description?: string;
  minsPerShipper?: number;
  hourlyRunRate?: number;
  components?: BomComponent[];
  customerName: string;
  poCreatedDate: Date;
  poReceivedDate: Date;
  requestedDeliveryDate: Date;
  orderedQtyPieces: number;
  orderedQtyShippers: number;
  customerAmount: number;
  systemAmount: number;
  status: PoStatus[];
  deliveryDate?: Date;
  deliveryDocketNumber?: string;
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
