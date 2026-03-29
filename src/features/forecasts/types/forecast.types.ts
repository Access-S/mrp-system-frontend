// src/features/forecasts/types/forecast.types.ts

// ============== BLOCK 0: Base Forecast Interface ==============

export interface Forecast {
  productCode: string;
  description: string;
  weeklyForecast: { [week: string]: number };
}

// ============== BLOCK 1: Forecast Types ==============

export interface ForecastReviewItem {
  row_number: number;
  product_code: string;
  description: string;
  forecast_values: Record<string, number>;
  reason: 'unknown_product' | 'invalid_date';
}

export interface ForecastImportResult {
  success: boolean;
  message: string;
  imported: number;
  skipped?: number;
  pending_review: number;
  review_items: ForecastReviewItem[];
  requires_review?: boolean;
  debug?: any;
}

export interface ForecastReviewApproval {
  product_code: string;
  action: 'create_placeholder' | 'map_to_existing' | 'skip';
  mapped_product_code?: string;
}

export interface WeeklyForecastRow {
  productCode: string;
  description: string;
  weeklyData: Record<string, number>;
}

export interface WeeklyDemandSummary {
  weekDate: string;
  weekLabel: string;
  totalUnits: number;
  totalHours: number;
}

export interface ForecastTableData {
  headers: { key: string; label: string }[];
  rows: WeeklyForecastRow[];
  weeklyDemand: WeeklyDemandSummary[];
  totalProducts: number;
  activeProducts: number;
}