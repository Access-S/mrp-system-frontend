// src/features/inventory/services/inventory.service.ts

// ============== BLOCK 1: Imports ==============
import type { Product } from "@/features/products/types";
import type { Forecast } from "@/features/forecasts/types";
import type { Component } from "@/features/inventory/types";
import { productService } from "@/features/products";
import { forecastService } from "@/features/forecasts/services/forecast.service";
import { componentService } from "@/features/products/services/component.service";
import { handleApiError } from "@/services/api.service";

// ============== BLOCK 2: Interface Definitions ==============
export type {
  WeeklyProjection,
  InventoryProjection,
  MrpSummary,
  FGReference,
} from '../types/inventory.types';

import type {
  WeeklyProjection,
  InventoryProjection,
  MrpSummary,
  FGReference,
} from '../types/inventory.types';

// ============== BLOCK 3: Constants & MRP Service Class ==============

/** Full year planning horizon: 52 weeks */
const PROJECTION_HORIZON_WEEKS = 52;
const WEEKS_PER_MONTH = 4.33;

class MrpService {

  // ============== Main MRP Calculation Engine ==============
  calculateInventoryProjections(
    components: Component[],
    products: Product[],
    forecasts: Forecast[]
  ): InventoryProjection[] {

    const componentMasterMap = new Map<
      string,
      {
        demand: { [week: string]: number };
        skus: Set<string>;
        partTypes: Set<string>;
        descriptions: Set<string>;
        fgReferences: Map<string, string>; // fgCode -> fgName
      }
    >();

    // STEP 1: Aggregate demand from all BOMs and forecasts
    products.forEach((product) => {
      const forecast = forecasts.find(
        (f) => f.productCode === product.productCode
      );
      if (!forecast) return;

      product.components.forEach((bomItem) => {
        if (bomItem.partType === "Bulk - Supplied") return;

        if (!componentMasterMap.has(bomItem.partCode)) {
          componentMasterMap.set(bomItem.partCode, {
            demand: {},
            skus: new Set(),
            partTypes: new Set(),
            descriptions: new Set(),
            fgReferences: new Map(),
          });
        }

        const componentData = componentMasterMap.get(bomItem.partCode)!;
        componentData.skus.add(product.productCode);
        componentData.partTypes.add(bomItem.partType);
        componentData.descriptions.add(bomItem.partDescription);
        componentData.fgReferences.set(product.productCode, product.name || product.productCode);

        for (const week in forecast.weeklyForecast) {
          const forecastQty = forecast.weeklyForecast[week];
          const requiredComponents = forecastQty * bomItem.perShipper;
          componentData.demand[week] =
            (componentData.demand[week] || 0) + requiredComponents;
        }
      });
    });

    // STEP 2: Create inventory projections
    const inventoryProjections: InventoryProjection[] = [];

    components.forEach((component) => {
      const componentData = componentMasterMap.get(component.partCode);
      if (!componentData) return;

      // Generate sorted week list (ensure we have 52 weeks)
      const allWeeks = Object.keys(componentData.demand).sort();
      const weeks = allWeeks.length >= PROJECTION_HORIZON_WEEKS
        ? allWeeks.slice(0, PROJECTION_HORIZON_WEEKS)
        : [...allWeeks, ...Array(PROJECTION_HORIZON_WEEKS - allWeeks.length).fill(null).map((_, i) =>
          `week-${allWeeks.length + i + 1}`
        )];

      let currentSoh = component.stock;
      let totalRequirement = 0;

      // Calculate weekly projections (exactly 52)
      const projections: WeeklyProjection[] = weeks.map((week, index) => {
        const demand = componentData.demand[week] || 0;
        totalRequirement += demand;

        const coveragePercentage = demand > 0 ? Math.min(100, (currentSoh / demand) * 100) : 100;
        const projectedSoh = Math.max(0, currentSoh - demand);
        const shortfall = Math.max(0, demand - currentSoh);
        const dailyDemand = demand / 7;
        const daysOfCoverage = dailyDemand > 0 ? Math.floor(currentSoh / dailyDemand) : 7;

        currentSoh = projectedSoh;

        return {
          week,
          totalDemand: Math.round(demand * 100) / 100,
          coveragePercentage: Math.round(coveragePercentage * 100) / 100,
          projectedSoh: Math.round(projectedSoh * 100) / 100,
          shortfall: Math.round(shortfall * 100) / 100,
          daysOfCoverage: Math.min(daysOfCoverage, 7)
        };
      });

      // Calculate summary metrics
      const averageWeeklyDemand = totalRequirement / PROJECTION_HORIZON_WEEKS;
      const purchasingRequirement = Math.max(0, totalRequirement - component.stock);
      const monthsCoverage = averageWeeklyDemand > 0
        ? (component.stock / averageWeeklyDemand) / WEEKS_PER_MONTH
        : 999;

      // Health/priority logic (existing)
      const horizonDemand = projections.slice(0, 17).reduce((s, p) => s + p.totalDemand, 0);
      let overallHealth: "Healthy" | "Risk" | "Shortage";
      let priority: "High" | "Medium" | "Low";
      let recommendedAction: string;

      if (component.stock >= horizonDemand) {
        overallHealth = "Healthy";
        priority = "Low";
        recommendedAction = "Monitor stock levels";
      } else if (component.stock > averageWeeklyDemand) {
        overallHealth = "Risk";
        priority = "Medium";
        recommendedAction = `Order ${Math.ceil(purchasingRequirement)} units`;
      } else {
        overallHealth = "Shortage";
        priority = "High";
        recommendedAction = `URGENT: Order ${Math.ceil(purchasingRequirement)} units immediately`;
      }

      // Build FG references array
      const fgReferences: FGReference[] = Array.from(componentData.fgReferences.entries()).map(
        ([fgCode, fgName]) => ({ fgCode, fgName })
      );

      inventoryProjections.push({
        component,
        skusUsedIn: Array.from(componentData.skus),
        displayPartType: Array.from(componentData.partTypes)[0] || "Component",
        displayDescription: Array.from(componentData.descriptions)[0] || component.partDescription,
        netHorizonDemand: Math.round(Math.max(0, horizonDemand - component.stock) * 100) / 100,
        projections,
        overallHealth,
        recommendedAction,
        priority,
        totalForecastDemand: Math.round(totalRequirement * 100) / 100,
        averageWeeklyDemand: Math.round(averageWeeklyDemand * 100) / 100,

        // NEW FIELDS FOR 52-WEEK MRP VIEW
        fgReferences,
        totalRequirement: Math.round(totalRequirement * 100) / 100,
        purchasingRequirement: Math.round(purchasingRequirement * 100) / 100,
        monthsCoverage: Math.round(monthsCoverage * 100) / 100,
      });
    });

    return inventoryProjections;
  }

  // ============== Complete MRP Analysis ==============
  async runCompleteAnalysis(): Promise<InventoryProjection[]> {
    try {
      const [components, products, forecasts] = await Promise.all([
        componentService.getAllSoh(),
        productService.getAllProducts(),
        forecastService.getAllForecasts()
      ]);
      return this.calculateInventoryProjections(components, products, forecasts);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // ============== Summary and Statistics ==============
  getMrpSummary(projections: InventoryProjection[]): MrpSummary {
    const healthyCount = projections.filter(p => p.overallHealth === 'Healthy').length;
    const riskCount = projections.filter(p => p.overallHealth === 'Risk').length;
    const shortageCount = projections.filter(p => p.overallHealth === 'Shortage').length;
    const totalDemandValue = projections.reduce((sum, p) => sum + (p.totalRequirement || p.totalForecastDemand), 0);
    const criticalComponents = projections
      .filter(p => p.priority === 'High')
      .sort((a, b) => (b.totalRequirement || b.netHorizonDemand) - (a.totalRequirement || a.netHorizonDemand))
      .slice(0, 10);

    return {
      totalComponents: projections.length,
      healthyCount,
      riskCount,
      shortageCount,
      totalDemandValue: Math.round(totalDemandValue * 100) / 100,
      criticalComponents
    };
  }

  // ============== Filtering and Search ==============
  filterByHealth(projections: InventoryProjection[], health: "Healthy" | "Risk" | "Shortage"): InventoryProjection[] {
    return projections.filter(p => p.overallHealth === health);
  }

  filterByPriority(projections: InventoryProjection[], priority: "High" | "Medium" | "Low"): InventoryProjection[] {
    return projections.filter(p => p.priority === priority);
  }

  searchProjections(projections: InventoryProjection[], searchTerm: string): InventoryProjection[] {
    if (!searchTerm || searchTerm.trim().length < 2) return projections;
    const term = searchTerm.toLowerCase();
    return projections.filter(p =>
      p.component.partCode.toLowerCase().includes(term) ||
      p.displayDescription.toLowerCase().includes(term) ||
      p.displayPartType.toLowerCase().includes(term) ||
      p.skusUsedIn.some(sku => sku.toLowerCase().includes(term)) ||
      p.fgReferences?.some(fg => fg.fgCode.toLowerCase().includes(term) || fg.fgName.toLowerCase().includes(term))
    );
  }

  // ============== Purchase Recommendations ==============
  generatePurchaseRecommendations(projections: InventoryProjection[]): {
    partCode: string;
    description: string;
    currentStock: number;
    recommendedQuantity: number;
    priority: "High" | "Medium" | "Low";
    reason: string;
    estimatedCost?: number;
  }[] {
    return projections
      .filter(p => (p.purchasingRequirement || p.netHorizonDemand) > 0)
      .map(p => ({
        partCode: p.component.partCode,
        description: p.displayDescription,
        currentStock: p.component.stock,
        recommendedQuantity: Math.ceil(p.purchasingRequirement || p.netHorizonDemand),
        priority: p.priority,
        reason: p.recommendedAction,
        estimatedCost: p.component.unitCost ? Math.ceil(p.purchasingRequirement || p.netHorizonDemand) * p.component.unitCost : undefined,
      }))
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  // ============== Data Export (UPDATED FOR 52-WEEK TABLE) ==============
  exportMrpData(projections: InventoryProjection[]): Record<string, any>[] {
    return projections.map(p => {
      const base: Record<string, any> = {
        "Part Code": p.component.partCode,
        "Type": p.displayPartType,
        "FG Used In": p.skusUsedIn.join("; "),
        "Description": p.displayDescription,
      };

      // Add 52 week demand columns
      p.projections.forEach((proj, i) => {
        base[`Week ${i + 1}`] = proj.totalDemand;
      });

      // Add summary columns
      base["Total Requirement"] = p.totalRequirement;
      base["SOH"] = p.component.stock;
      base["Purchasing Requirement"] = p.purchasingRequirement;
      base["Months Coverage"] = p.monthsCoverage?.toFixed(1);
      base["Supplier"] = p.component.supplier || "";
      base["Unit Price"] = p.component.unitCost?.toFixed(2);

      return base;
    });
  }
}

// ============== BLOCK 4: Export Singleton Instance ==============
export const mrpService = new MrpService();

// ============== BLOCK 5: Export Individual Functions (Backward Compatibility) ==============
export const calculateInventoryProjections = (
  components: Component[],
  products: Product[],
  forecasts: Forecast[]
) => mrpService.calculateInventoryProjections(components, products, forecasts);

export const runCompleteAnalysis = () => mrpService.runCompleteAnalysis();
export const getMrpSummary = (projections: InventoryProjection[]) => mrpService.getMrpSummary(projections);
export const filterByHealth = (projections: InventoryProjection[], health: "Healthy" | "Risk" | "Shortage") =>
  mrpService.filterByHealth(projections, health);
export const filterByPriority = (projections: InventoryProjection[], priority: "High" | "Medium" | "Low") =>
  mrpService.filterByPriority(projections, priority);
export const searchProjections = (projections: InventoryProjection[], searchTerm: string) =>
  mrpService.searchProjections(projections, searchTerm);
export const generatePurchaseRecommendations = (projections: InventoryProjection[]) =>
  mrpService.generatePurchaseRecommendations(projections);
export const exportMrpData = (projections: InventoryProjection[]) =>
  mrpService.exportMrpData(projections);

// ============== BLOCK 6: Utility Functions (Unchanged) ==============
export const calculateDaysOfCoverage = (currentStock: number, weeklyDemand: number): number => {
  if (weeklyDemand <= 0) return 999;
  return Math.floor((currentStock / (weeklyDemand / 7)));
};

export const calculateReorderPoint = (
  averageWeeklyDemand: number,
  leadTimeDays: number = 30,
  safetyStock: number = 0
): number => {
  const dailyDemand = averageWeeklyDemand / 7;
  return Math.ceil((dailyDemand * leadTimeDays) + safetyStock);
};

export const calculateEconomicOrderQuantity = (
  annualDemand: number,
  orderingCost: number = 50,
  holdingCostPerUnit: number = 1
): number => {
  if (holdingCostPerUnit <= 0 || annualDemand <= 0) return 0;
  return Math.ceil(Math.sqrt((2 * annualDemand * orderingCost) / holdingCostPerUnit));
};

export const getHealthColor = (health: "Healthy" | "Risk" | "Shortage"): string => {
  switch (health) {
    case 'Healthy': return 'green';
    case 'Risk': return 'orange';
    case 'Shortage': return 'red';
    default: return 'gray';
  }
};

export const getPriorityColor = (priority: "High" | "Medium" | "Low"): string => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

export const formatCoverage = (percentage: number): string => {
  if (percentage >= 100) return '100%';
  if (percentage <= 0) return '0%';
  return `${Math.round(percentage)}%`;
};

export const formatDemand = (demand: number): string => {
  if (demand >= 1000000) return `${(demand / 1000000).toFixed(1)}M`;
  if (demand >= 1000) return `${(demand / 1000).toFixed(1)}K`;
  return Math.round(demand).toString();
};

// ============== BLOCK 7: Validation Functions (Unchanged) ==============
export const validateMrpInputs = (
  components: Component[],
  products: Product[],
  forecasts: Forecast[]
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!components || components.length === 0) {
    errors.push('No components (SOH data) provided');
  } else {
    const invalidComponents = components.filter(c =>
      !c.partCode || typeof c.stock !== 'number' || c.stock < 0
    );
    if (invalidComponents.length > 0) {
      errors.push(`${invalidComponents.length} components have invalid data`);
    }
  }

  if (!products || products.length === 0) {
    errors.push('No products provided');
  } else {
    const productsWithoutBom = products.filter(p =>
      !p.components || p.components.length === 0
    );
    if (productsWithoutBom.length > 0) {
      warnings.push(`${productsWithoutBom.length} products have no BOM components`);
    }
  }

  if (!forecasts || forecasts.length === 0) {
    errors.push('No forecasts provided');
  } else {
    const invalidForecasts = forecasts.filter(f =>
      !f.productCode || !f.weeklyForecast || Object.keys(f.weeklyForecast).length === 0
    );
    if (invalidForecasts.length > 0) {
      warnings.push(`${invalidForecasts.length} forecasts have no weekly data`);
    }
  }

  if (products.length > 0 && forecasts.length > 0) {
    const productsWithoutForecast = products.filter(p =>
      !forecasts.some(f => f.productCode === p.productCode)
    );
    if (productsWithoutForecast.length > 0) {
      warnings.push(`${productsWithoutForecast.length} products have no forecast data`);
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
};

// ============== BLOCK 8: Report Generation (Updated to use new fields) ==============
export const generateMrpReport = (projections: InventoryProjection[]): {
  executiveSummary: string;
  keyFindings: string[];
  recommendations: string[];
  criticalActions: string[];
} => {
  const summary = mrpService.getMrpSummary(projections);

  const executiveSummary = `
    MRP Analysis completed for ${summary.totalComponents} components. 
    ${summary.shortageCount} components are in shortage, ${summary.riskCount} are at risk, 
    and ${summary.healthyCount} are healthy. Total 52-week demand: ${summary.totalDemandValue.toLocaleString()} units.
  `.trim();

  const keyFindings = [
    `${summary.totalComponents} components tracked across 52-week horizon`,
    `${Math.round((summary.shortageCount / summary.totalComponents) * 100) || 0}% of components are in shortage`,
    `${summary.criticalComponents.length} components require immediate procurement action`,
    `Average months coverage varies significantly across component types`
  ];

  const recommendations = [
    'Implement automated reorder triggers for High-priority components',
    'Review safety stock calculations quarterly',
    'Negotiate lead-time reductions with key suppliers',
    'Consider dual-sourcing for components with recurring shortages'
  ];

  const criticalActions = summary.criticalComponents
    .slice(0, 5)
    .map(c => `Order ${Math.ceil(c.purchasingRequirement || c.netHorizonDemand)} units of ${c.component.partCode} (Current SOH: ${c.component.stock})`);

  return { executiveSummary, keyFindings, recommendations, criticalActions };
};

// ============== BLOCK 9: Service and Type Exports ==============
export { MrpService };
export default mrpService;