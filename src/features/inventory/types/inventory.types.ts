// src/features/inventory/types/inventory.types.ts

// ============== BLOCK 0: Base Component Interface ==============

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
  type?: string; // Added: "Carton" | "Shipper" | "Label" | "Leaflet" | etc.
}

// ============== BLOCK 1: Inventory Types ==============

/**
 * Represents weekly projection data for a component
 */
export interface WeeklyProjection {
  week: string; // ISO date string (Monday start)
  totalDemand: number;
  coveragePercentage: number;
  projectedSoh: number;
  shortfall: number;
  daysOfCoverage: number;
}

/**
 * Reference to a Finished Good that uses this component
 */
export interface FGReference {
  fgCode: string;
  fgName: string;
}

/**
 * Represents complete inventory projection for a component
 */
export interface InventoryProjection {
  component: Component;
  skusUsedIn: string[]; // FG codes this part is used in (Column C)
  displayPartType: string; // Part type short name (Column B)
  displayDescription: string; // FG names/descriptions (Column D)
  netHorizonDemand: number;
  projections: WeeklyProjection[]; // Should contain 52 entries for full year
  overallHealth: "Healthy" | "Risk" | "Shortage";
  recommendedAction: string;
  priority: "High" | "Medium" | "Low";
  totalForecastDemand: number;
  averageWeeklyDemand: number;

  // === NEW FIELDS FOR 52-WEEK MRP VIEW ===
  fgReferences?: FGReference[]; // Detailed FG info for tooltip/expand
  totalRequirement?: number; // Sum of 52-week demand (calculated)
  purchasingRequirement?: number; // totalRequirement - SOH (calculated)
  monthsCoverage?: number; // Coverage metric (calculated)
}

/**
 * Summary statistics for MRP analysis
 */
export interface MrpSummary {
  totalComponents: number;
  healthyCount: number;
  riskCount: number;
  shortageCount: number;
  totalDemandValue: number;
  criticalComponents: InventoryProjection[];
}