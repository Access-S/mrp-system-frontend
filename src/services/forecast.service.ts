// src/services/forecast.service.ts

// ============== BLOCK 1: Imports ==============
import { handleApiError } from "./api.service";
import { Forecast } from "../types/mrp.types";
import * as XLSX from "xlsx";

// ============== BLOCK 2: Types & Interfaces ==============
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
  weeklyData: Record<string, number>; // Key: YYYY-MM-DD, Value: quantity
}

export interface WeeklyDemandSummary {
  weekDate: string; // YYYY-MM-DD
  weekLabel: string; // "02 Mar 2026"
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

// ============== BLOCK 3: API Base URL ==============
const API_BASE_URL = 'https://mrp-1.onrender.com/api';

// ============== BLOCK 4: Forecast Service Class ==============
class ForecastService {

  /**
   * Import forecast data from Excel file
   * Sends parsed JSON data to backend for processing
   */
  async importForecastData(file: File): Promise<ForecastImportResult> {
    try {

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });

      // Find header row
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(5, rawData.length); i++) {
        const row = rawData[i];
        if (row && Array.isArray(row)) {
          const hasProduct = row.some(cell =>
            cell && typeof cell === 'string' && cell.toLowerCase().includes('product')
          );
          const hasDescription = row.some(cell =>
            cell && typeof cell === 'string' && cell.toLowerCase().includes('description')
          );
          if (hasProduct && hasDescription) {
            headerRowIndex = i;
            break;
          }
        }
      }

      if (headerRowIndex === -1) {
        throw new Error("Could not find header row with 'Product' and 'Description' columns.");
      }

      const headers = rawData[headerRowIndex];
      const dataRows = rawData.slice(headerRowIndex + 1);

      // Convert to JSON objects
      const jsonData = dataRows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      }).filter(row => {
        // Filter out empty rows
        const productKey = headers.find(h => h?.toLowerCase?.().includes('product'));
        return productKey && row[productKey];
      });


      // Send to backend
      const formData = new FormData();
      formData.append('forecastFile', file);
      formData.append('data', JSON.stringify(jsonData));

      const response = await fetch(`${API_BASE_URL}/forecasts/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import forecasts');
      }

      const result: ForecastImportResult = await response.json();
      
      return result;

    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Finalize forecast review after user approves/maps unknown products
   */
  async finalizeForecastReview(
    importBatchId: string,
    approvals: ForecastReviewApproval[]
  ): Promise<{ success: boolean; message: string; results: any }> {
    try {

      const response = await fetch(`${API_BASE_URL}/forecasts/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          import_batch_id: importBatchId,
          approvals,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to finalize review');
      }

      const result = await response.json();
      
      return result;

    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetch all weekly forecasts from backend
   * Returns data already in weekly format
   */
async getWeeklyForecasts(): Promise<{
  headers: { key: string; label: string }[];
  rows: any[];
  summary: any;
}> {
  const response = await fetch(`${API_BASE_URL}/forecasts`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch forecasts');
  }

  const result = await response.json();
  
  if (result.success && result.tableData) {
    return {
      headers: result.tableData.headers,
      rows: result.tableData.rows,
      summary: result.summary
    };
  }
  
  return { headers: [], rows: [], summary: {} };
}

  /**
   * Fetch all forecasts formatted for MRP engine consumption
   * Transforms raw weekly data into typed Forecast objects
   * @returns Promise<Forecast[]> - Array of forecasts with weeklyForecast maps
   */
  async getAllForecasts(): Promise<Forecast[]> {
    const { rows } = await this.getWeeklyForecasts();

    return rows.map((row: any) => {
      const { product_code, description, ...weeklyData } = row;

      const weeklyForecast: Record<string, number> = {};
      for (const [key, value] of Object.entries(weeklyData)) {
        if (typeof value === 'number') {
          weeklyForecast[key] = value;
        }
      }

      return {
        productCode: product_code || '',
        description: description || '',
        weeklyForecast,
      };
    });
  }
}

// ============== BLOCK 5: Export Singleton Instance ==============
export const forecastService = new ForecastService();

// ============== BLOCK 6: Export Individual Functions ==============
export const importForecastData = (file: File) => forecastService.importForecastData(file);
export const finalizeForecastReview = (
  importBatchId: string,
  approvals: ForecastReviewApproval[]
) => forecastService.finalizeForecastReview(importBatchId, approvals);
export const getWeeklyForecasts = () => forecastService.getWeeklyForecasts();
export const getAllForecasts = () => forecastService.getAllForecasts();

export const getAllForecastsTable = async () => {
  return forecastService.getWeeklyForecasts();
};

// ============== BLOCK 7: Utility Functions ==============

/**
 * Calculate demand hours from shippers
 * Formula: shippers × minsPerShipper ÷ 60
 */
export const calculateDemandHours = (
  shippers: number,
  minsPerShipper: number
): number => {
  if (minsPerShipper === 0) return 0;
  const minutes = shippers * minsPerShipper;
  const hours = minutes / 60;
  return Math.round(hours * 100) / 100;
};

/**
 * Format date string for display (YYYY-MM-DD -> "02 Mar")
 */
export const formatWeekDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  } catch {
    return dateStr;
  }
};

/**
 * Get forecast data with product hours calculation
 * This is the main function used by ForecastsPage
 */
export const getForecastsWithProductData = async (
  products: Array<{
    productCode: string;
    description: string;
    minsPerShipper: number;
    unitsPerShipper: number;
  }>,
  weeksToShow: number = 4
): Promise<ForecastTableData> => {
  const { headers, rows } = await getWeeklyForecasts(); // remove unused summary

  // Create product lookup map
  const productMap = new Map(
    products.map((p) => [p.productCode.toUpperCase(), p])
  );

  // Get date columns (all columns except product_code and description)
  const dateHeaders = headers.filter(h => 
    h.key !== 'product_code' && h.key !== 'description'
  );

  // Limit to requested number of weeks
  const limitedDateHeaders = dateHeaders.slice(0, weeksToShow);

  // Transform rows to include product data
  const transformedRows: WeeklyForecastRow[] = rows.map((row: any) => {
    const product = productMap.get(row.product_code?.toUpperCase());
    
    // Extract weekly data
    const weeklyData: Record<string, number> = {};
    for (const dateHeader of limitedDateHeaders) {
      weeklyData[dateHeader.key] = row[dateHeader.key] || 0;
    }

    return {
      productCode: row.product_code,
      description: row.description || product?.description || '',
      minsPerShipper: product?.minsPerShipper || 0,
      unitsPerShipper: product?.unitsPerShipper || 0,
      weeklyData
    };
  });

  // Calculate weekly demand summaries
  const weeklyDemand: WeeklyDemandSummary[] = limitedDateHeaders.map((dateHeader) => {
    let totalUnits = 0;
    let totalHours = 0;

    transformedRows.forEach((row) => {
      const units = row.weeklyData[dateHeader.key] || 0;
      totalUnits += units;
      
      // Get minsPerShipper from the product map
      const product = productMap.get(row.productCode.toUpperCase());
      if (product && product.minsPerShipper) {
        totalHours += calculateDemandHours(units, product.minsPerShipper);
      }
    });

    return {
      weekDate: dateHeader.key,
      weekLabel: dateHeader.label,
      totalUnits,
      totalHours: Math.round(totalHours * 100) / 100,
    };
  });

  // Count active products (products with any forecast > 0)
  const activeProducts = transformedRows.filter((row) => {
    const total = Object.values(row.weeklyData).reduce((sum, val) => sum + val, 0);
    return total > 0;
  }).length;

  // Build final headers
  const finalHeaders = [
    { key: "productCode", label: "Product Code" },
    { key: "description", label: "Description" },
    ...limitedDateHeaders.map((h) => ({
      key: h.key,
      label: h.label,
    })),
  ];

  return {
    headers: finalHeaders,
    rows: transformedRows,
    weeklyDemand,
    totalProducts: transformedRows.length,
    activeProducts,
  };
};

// ============== BLOCK 8: Exports ==============
export { ForecastService };
export default forecastService;