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

// ============== RE-EXPORTS FOR BACKWARD COMPATIBILITY ==============
// Purchase Order types moved to features/purchase-orders/types/
export type { PoStatus, PurchaseOrder } from '@/features/purchase-orders/types';
export { ALL_PO_STATUSES } from '@/features/purchase-orders/types';