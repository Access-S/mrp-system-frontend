// src/features/inventory/types/inventory.types.ts

// ============== BLOCK 1: Inventory Types ==============

/**
 * Represents weekly projection data for a component
 */
export interface WeeklyProjection {
  week: string;
  totalDemand: number;
  coveragePercentage: number;
  projectedSoh: number;
  shortfall: number;
  daysOfCoverage: number;
}

/**
 * Represents complete inventory projection for a component
 */
export interface InventoryProjection {
  component: any; // Will use Component from mrp.types
  skusUsedIn: string[];
  displayPartType: string;
  displayDescription: string;
  netHorizonDemand: number;
  projections: WeeklyProjection[];
  overallHealth: "Healthy" | "Risk" | "Shortage";
  recommendedAction: string;
  priority: "High" | "Medium" | "Low";
  totalForecastDemand: number;
  averageWeeklyDemand: number;
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