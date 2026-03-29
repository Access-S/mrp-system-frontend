//src/services/mrp.service.ts

// ============================================================================
// BLOCK 1: Imports
// ============================================================================
import { Product, Forecast, Component } from "../types/mrp.types";
import { productService } from "./product.service";
import { forecastService } from "../features/forecasts/services/forecast.service";
import { componentService } from "./component.service";
import { handleApiError } from "./api.service";

// ============================================================================
// BLOCK 2: Interface Definitions for MRP Engine Output
// ============================================================================

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
  component: Component;
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

// ============================================================================
// BLOCK 3: MRP Service Class
// ============================================================================

/** Number of weeks to use for horizon demand calculation (~4 months) */
const PROJECTION_HORIZON_WEEKS = 17;

class MrpService {

  // --------------------------------------------------------------------------
  // Main MRP Calculation Engine
  // --------------------------------------------------------------------------

  /**
   * Calculates inventory projections based on BOMs, forecasts, and current stock
   * @param components - Array of components with current stock levels (SOH data)
   * @param products - Array of products with BOM data
   * @param forecasts - Array of weekly forecasts per product
   * @returns Array of inventory projections with demand calculations
   */
  calculateInventoryProjections(
    components: Component[],
    products: Product[],
    forecasts: Forecast[]
  ): InventoryProjection[] {

    // Initialize component master map for demand aggregation
    const componentMasterMap = new Map<
      string,
      {
        demand: { [week: string]: number };
        skus: Set<string>;
        partTypes: Set<string>;
        descriptions: Set<string>;
      }
    >();

    // STEP 1: Aggregate demand from all BOMs and forecasts
    products.forEach((product) => {
      // Find matching forecast for this product
      const forecast = forecasts.find(
        (f) => f.productCode === product.productCode
      );
      if (!forecast) return;

      // Process each BOM component
      product.components.forEach((bomItem) => {
        // Skip bulk supplied items
        if (bomItem.partType === "Bulk - Supplied") return;
        
        // Initialize component in map if not exists
        if (!componentMasterMap.has(bomItem.partCode)) {
          componentMasterMap.set(bomItem.partCode, {
            demand: {},
            skus: new Set(),
            partTypes: new Set(),
            descriptions: new Set(),
          });
        }
        
        // Get component data reference
        const componentData = componentMasterMap.get(bomItem.partCode)!;
        componentData.skus.add(product.productCode);
        componentData.partTypes.add(bomItem.partType);
        componentData.descriptions.add(bomItem.partDescription);

        // Calculate weekly demand for this component
        for (const week in forecast.weeklyForecast) {
          const forecastQtyInShippers = forecast.weeklyForecast[week];
          const requiredComponents = forecastQtyInShippers * bomItem.perShipper;

          componentData.demand[week] =
            (componentData.demand[week] || 0) + requiredComponents;
        }
      });
    });

    // STEP 2: Create inventory projections for components with stock
    const inventoryProjections: InventoryProjection[] = [];

    components.forEach((component) => {
      const componentData = componentMasterMap.get(component.partCode);
      if (!componentData) return;

      let currentSoh = component.stock;
      const sortedWeeks = Object.keys(componentData.demand).sort();

      // Calculate demand metrics
      const horizonDemand = sortedWeeks
        .slice(0, PROJECTION_HORIZON_WEEKS)
        .reduce((sum, week) => sum + (componentData.demand[week] || 0), 0);
      
      const totalForecastDemand = Object.values(componentData.demand)
        .reduce((sum, demand) => sum + demand, 0);
      
      const averageWeeklyDemand = sortedWeeks.length > 0 
        ? totalForecastDemand / sortedWeeks.length 
        : 0;

      const netHorizonDemand = Math.max(0, horizonDemand - currentSoh);

      // Determine health status and priority
      let overallHealth: "Healthy" | "Risk" | "Shortage";
      let priority: "High" | "Medium" | "Low";
      let recommendedAction: string;

      if (currentSoh >= horizonDemand) {
        overallHealth = "Healthy";
        priority = "Low";
        recommendedAction = "Monitor stock levels";
      } else if (currentSoh > averageWeeklyDemand) {
        overallHealth = "Risk";
        priority = "Medium";
        recommendedAction = `Order ${Math.ceil(netHorizonDemand)} units`;
      } else {
        overallHealth = "Shortage";
        priority = "High";
        recommendedAction = `URGENT: Order ${Math.ceil(netHorizonDemand)} units immediately`;
      }

      // Calculate weekly projections
      const projections: WeeklyProjection[] = sortedWeeks.map((week) => {
        const demand = componentData.demand[week];
        const coveragePercentage = demand > 0 ? Math.min(1, currentSoh / demand) * 100 : 100;
        const projectedSoh = Math.max(0, currentSoh - demand);
        const shortfall = Math.max(0, demand - currentSoh);
        
        // Calculate days of coverage (7 days per week)
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

      // Add to projections array
      inventoryProjections.push({
        component,
        skusUsedIn: Array.from(componentData.skus),
        displayPartType: Array.from(componentData.partTypes)[0] || "N/A",
        displayDescription: Array.from(componentData.descriptions)[0] || "N/A",
        netHorizonDemand: Math.round(netHorizonDemand * 100) / 100,
        projections,
        overallHealth,
        recommendedAction,
        priority,
        totalForecastDemand: Math.round(totalForecastDemand * 100) / 100,
        averageWeeklyDemand: Math.round(averageWeeklyDemand * 100) / 100
      });
    });

    return inventoryProjections;
  }

  // --------------------------------------------------------------------------
  // Complete MRP Analysis
  // --------------------------------------------------------------------------

  /**
   * Runs a complete MRP analysis by fetching all required data
   * @returns Promise resolving to array of inventory projections
   */
  async runCompleteAnalysis(): Promise<InventoryProjection[]> {
    try {

      // Fetch all required data in parallel
      const [components, products, forecasts] = await Promise.all([
        componentService.getAllSoh(),
        productService.getAllProducts(),
        forecastService.getAllForecasts()
      ]);


      // Run the MRP calculation
      const projections = this.calculateInventoryProjections(components, products, forecasts);

      return projections;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // --------------------------------------------------------------------------
  // Summary and Statistics
  // --------------------------------------------------------------------------

  /**
   * Generates summary statistics from MRP projections
   * @param projections - Array of inventory projections
   * @returns Summary object with key metrics
   */
  getMrpSummary(projections: InventoryProjection[]): MrpSummary {
    const healthyCount = projections.filter(p => p.overallHealth === 'Healthy').length;
    const riskCount = projections.filter(p => p.overallHealth === 'Risk').length;
    const shortageCount = projections.filter(p => p.overallHealth === 'Shortage').length;
    
    const totalDemandValue = projections.reduce((sum, p) => sum + p.totalForecastDemand, 0);
    
    const criticalComponents = projections
      .filter(p => p.priority === 'High')
      .sort((a, b) => b.netHorizonDemand - a.netHorizonDemand)
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

  // --------------------------------------------------------------------------
  // Filtering and Search
  // --------------------------------------------------------------------------

  /**
   * Filters projections by health status
   */
  filterByHealth(
    projections: InventoryProjection[], 
    health: "Healthy" | "Risk" | "Shortage"
  ): InventoryProjection[] {
    return projections.filter(p => p.overallHealth === health);
  }

  /**
   * Filters projections by priority level
   */
  filterByPriority(
    projections: InventoryProjection[], 
    priority: "High" | "Medium" | "Low"
  ): InventoryProjection[] {
    return projections.filter(p => p.priority === priority);
  }

  /**
   * Searches projections by part code, description, or SKU
   */
  searchProjections(projections: InventoryProjection[], searchTerm: string): InventoryProjection[] {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return projections;
    }

    const term = searchTerm.toLowerCase();
    return projections.filter(p => 
      p.component.partCode.toLowerCase().includes(term) ||
      p.displayDescription.toLowerCase().includes(term) ||
      p.skusUsedIn.some(sku => sku.toLowerCase().includes(term))
    );
  }

  // --------------------------------------------------------------------------
  // Purchase Recommendations
  // --------------------------------------------------------------------------

  /**
   * Generates purchase recommendations based on MRP analysis
   */
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
      .filter(p => p.netHorizonDemand > 0)
      .map(p => ({
        partCode: p.component.partCode,
        description: p.displayDescription,
        currentStock: p.component.stock,
        recommendedQuantity: Math.ceil(p.netHorizonDemand),
        priority: p.priority,
        reason: p.recommendedAction,
      }))
      .sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  // --------------------------------------------------------------------------
  // Data Export
  // --------------------------------------------------------------------------

  /**
   * Exports MRP data in a format suitable for Excel/CSV
   */
  exportMrpData(projections: InventoryProjection[]): any[] {
    return projections.map(p => ({
      'Part Code': p.component.partCode,
      'Description': p.displayDescription,
      'Part Type': p.displayPartType,
      'Current Stock': p.component.stock,
      'Safety Stock': p.component.safetyStock || 0,
      'SKUs Used In': p.skusUsedIn.join(', '),
      'Health Status': p.overallHealth,
      'Priority': p.priority,
      'Net Horizon Demand': p.netHorizonDemand,
      'Total Forecast Demand': p.totalForecastDemand,
      'Average Weekly Demand': p.averageWeeklyDemand,
      'Recommended Action': p.recommendedAction,
      ...p.projections.reduce((acc, proj, index) => {
        acc[`Week ${index + 1} Demand`] = proj.totalDemand;
        acc[`Week ${index + 1} Coverage %`] = proj.coveragePercentage;
        acc[`Week ${index + 1} Projected SOH`] = proj.projectedSoh;
        return acc;
      }, {} as any)
    }));
  }
}

// ============================================================================
// BLOCK 4: Export Singleton Instance
// ============================================================================

export const mrpService = new MrpService();

// ============================================================================
// BLOCK 5: Export Individual Functions (Backward Compatibility)
// ============================================================================

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

// ============================================================================
// BLOCK 6: Utility Functions for MRP Calculations
// ============================================================================

/**
 * Calculates days of coverage based on current stock and weekly demand
 */
export const calculateDaysOfCoverage = (currentStock: number, weeklyDemand: number): number => {
  if (weeklyDemand <= 0) return 999;
  const dailyDemand = weeklyDemand / 7;
  return Math.floor(currentStock / dailyDemand);
};

/**
 * Calculates reorder point based on average weekly demand and lead time
 */
export const calculateReorderPoint = (
  averageWeeklyDemand: number, 
  leadTimeDays: number = 30, 
  safetyStock: number = 0
): number => {
  const dailyDemand = averageWeeklyDemand / 7;
  return Math.ceil((dailyDemand * leadTimeDays) + safetyStock);
};

/**
 * Calculates Economic Order Quantity (EOQ)
 */
export const calculateEconomicOrderQuantity = (
  annualDemand: number,
  orderingCost: number = 50,
  holdingCostPerUnit: number = 1
): number => {
  if (holdingCostPerUnit <= 0 || annualDemand <= 0) return 0;
  return Math.ceil(Math.sqrt((2 * annualDemand * orderingCost) / holdingCostPerUnit));
};

/**
 * Returns color code for health status
 */
export const getHealthColor = (health: "Healthy" | "Risk" | "Shortage"): string => {
  switch (health) {
    case 'Healthy': return 'green';
    case 'Risk': return 'yellow';
    case 'Shortage': return 'red';
    default: return 'gray';
  }
};

/**
 * Returns color code for priority level
 */
export const getPriorityColor = (priority: "High" | "Medium" | "Low"): string => {
  switch (priority) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

/**
 * Formats coverage percentage for display
 */
export const formatCoverage = (percentage: number): string => {
  if (percentage >= 100) return '100%';
  if (percentage <= 0) return '0%';
  return `${Math.round(percentage)}%`;
};

/**
 * Formats demand numbers with K/M suffixes
 */
export const formatDemand = (demand: number): string => {
  if (demand >= 1000000) {
    return `${(demand / 1000000).toFixed(1)}M`;
  }
  if (demand >= 1000) {
    return `${(demand / 1000).toFixed(1)}K`;
  }
  return Math.round(demand).toString();
};

// ============================================================================
// BLOCK 7: Validation Functions
// ============================================================================

/**
 * Validates MRP input data for completeness and correctness
 */
export const validateMrpInputs = (
  components: Component[],
  products: Product[],
  forecasts: Forecast[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate components
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

  // Validate products
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

  // Validate forecasts
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

  // Cross-validation
  if (products.length > 0 && forecasts.length > 0) {
    const productsWithoutForecast = products.filter(p => 
      !forecasts.some(f => f.productCode === p.productCode)
    );
    if (productsWithoutForecast.length > 0) {
      warnings.push(`${productsWithoutForecast.length} products have no forecast data`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// ============================================================================
// BLOCK 8: Report Generation
// ============================================================================

/**
 * Generates executive MRP report with key findings and recommendations
 */
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
    and ${summary.healthyCount} are healthy. Total forecast demand: ${summary.totalDemandValue.toLocaleString()} units.
  `.trim();

  const keyFindings = [
    `${Math.round((summary.shortageCount / summary.totalComponents) * 100)}% of components are in shortage`,
    `${Math.round((summary.riskCount / summary.totalComponents) * 100)}% of components are at risk`,
    `${summary.criticalComponents.length} components require immediate attention`,
    `Average demand coverage varies significantly across component types`
  ];

  const recommendations = [
    'Implement automated reorder points for critical components',
    'Review safety stock levels for high-demand components',
    'Establish supplier agreements for faster lead times',
    'Consider alternative suppliers for shortage-prone components'
  ];

  const criticalActions = summary.criticalComponents
    .slice(0, 5)
    .map(c => `Order ${Math.ceil(c.netHorizonDemand)} units of ${c.component.partCode} immediately`);

  return {
    executiveSummary,
    keyFindings,
    recommendations,
    criticalActions
  };
};

// ============================================================================
// BLOCK 9: Service and Type Exports
// ============================================================================

export { MrpService };
export default mrpService;

export type {
  Product,
  Forecast,
  Component
} from '../types/mrp.types';

