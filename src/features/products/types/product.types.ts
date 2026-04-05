// src/features/products/types/product.types.ts

export interface BomComponent {
  partCode: string;
  partDescription: string;
  partType: string;
  perShipper: number;
  unitCost?: number;
}

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
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}