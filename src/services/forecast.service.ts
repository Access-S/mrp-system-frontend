// src/services/forecast.service.ts

// BLOCK 1: Imports
import { supabase } from "../supabase.config";
import { handleApiError } from "./api.service";
import * as XLSX from "xlsx";

// BLOCK 2: Forecast Service Class
class ForecastService {

  /**
   * Parses a month header (e.g., "Jul-25") into a "YYYY-MM" format
   * @param header - The string header to parse
   * @returns A formatted string like "2025-07" or null if invalid
   */
  private parseMonthHeader(header: string): string | null {
    if (typeof header !== "string") return null;
    const parts = header.trim().split("-");
    if (parts.length !== 2) return null;

    const monthMap: { [key: string]: string } = {
      jan: "01", feb: "02", mar: "03", apr: "04",
      may: "05", jun: "06", jul: "07", aug: "08",
      sep: "09", oct: "10", nov: "11", dec: "12",
    };

    const month = monthMap[parts[0].toLowerCase()];
    const yearPart = parts[1];
    const year = yearPart.length === 2 ? `20${yearPart}` : yearPart;

    if (!month || isNaN(parseInt(year))) return null;
    return `${year}-${month}`;
  }

  /**
   * Imports forecast data from Excel file to Backend API
   * @param file - Excel file to import
   * @returns Promise<{successCount: number, errorCount: number, errors: string[]}>
   */
  async importForecastData(file: File): Promise<{
    successCount: number;
    errorCount: number;
    errors: string[];
  }> {
    try {
      console.log('📊 Starting forecast import...');

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });

      console.log("Raw Excel data (first 5 rows):", rawData.slice(0, 5));

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

      const jsonData = dataRows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      console.log("Processed JSON data:", jsonData);
      console.log("Headers found:", headers);

      if (!jsonData || jsonData.length === 0) {
        throw new Error("No data found after header row.");
      }

      const productCodeHeader = headers.find(h =>
        h && typeof h === 'string' && h.toLowerCase().includes('product')
      );

      if (!productCodeHeader) {
        throw new Error(`Could not find 'Product' column. Headers: ${headers.join(", ")}`);
      }

      const formData = new FormData();
      formData.append('forecastFile', file);
      formData.append('data', JSON.stringify(jsonData));

      console.log("Sending to backend...");
      const response = await fetch('https://mrp-1.onrender.com/api/forecasts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to import forecasts');
      }

      const result = await response.json();
      if (result.success) {
        const successCount = result.debug?.recordsInserted || jsonData.length;
        console.log(`✅ Forecast import completed: ${successCount} records imported`);
        return { successCount, errorCount: 0, errors: [] };
      } else {
        throw new Error(result.message || 'Import failed');
      }

    } catch (error) {
      console.error('❌ Forecast import failed:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetches the full forecast table data (headers + rows) from backend
   * Matches the structure returned by your Express API
   */
  async getAllForecastsTable() {
    try {
      console.log('📊 Fetching all forecasts...');
      const response = await fetch('https://mrp-1.onrender.com/api/forecasts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecasts');
      }

      const result = await response.json();
      
      if (result.success && result.tableData) {
        console.log(`✅ Fetched ${result.tableData.rows.length} forecasts`);
        return result.tableData; // { headers: [...], rows: [...] }
      }
      
      console.warn('Unexpected API response format:', result);
      return { headers: [], rows: [] };
    } catch (error) {
      console.error('❌ Error fetching forecasts:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
 * Fetches forecasts in the format expected by InventoryPage:
 * { productCode, description, monthlyForecast }
 */
async getAllForecasts() {
  const tableData = await this.getAllForecastsTable();
  
  return tableData.rows.map(row => {
    const { product_code, description, ...rest } = row;
    
    // Extract only valid YYYY-MM keys as monthlyForecast
    const monthlyForecast: Record<string, number> = {};
    for (const [key, value] of Object.entries(rest)) {
      if (/^\d{4}-\d{2}$/.test(key) && typeof value === 'number') {
        monthlyForecast[key] = value;
      }
    }

    return {
      productCode: product_code || '',
      description: description || '',
      monthlyForecast,
    };
  });
}
}

// BLOCK 3: Export singleton instance
export const forecastService = new ForecastService();

// BLOCK 4: Export individual functions
export const importForecastData = (file: File) => forecastService.importForecastData(file);
export const getAllForecastsTable = () => forecastService.getAllForecastsTable();

// BLOCK 5: Utility functions (unchanged)
export const parseMonthHeader = (header: string): string | null => {
  if (typeof header !== "string") return null;
  const parts = header.trim().split("-");
  if (parts.length !== 2) return null;

  const monthMap: { [key: string]: string } = {
    jan: "01", feb: "02", mar: "03", apr: "04",
    may: "05", jun: "06", jul: "07", aug: "08",
    sep: "09", oct: "10", nov: "11", dec: "12",
  };

  const month = monthMap[parts[0].toLowerCase()];
  const yearPart = parts[1];
  const year = yearPart.length === 2 ? `20${yearPart}` : yearPart;

  if (!month || isNaN(parseInt(year))) return null;
  return `${year}-${month}`;
};

export const validateForecastData = (data: {
  productCode: string;
  monthlyForecast: { [key: string]: number };
}): string[] => {
  const errors: string[] = [];

  if (!data.productCode?.trim()) {
    errors.push('Product code is required');
  }

  if (!data.monthlyForecast || Object.keys(data.monthlyForecast).length === 0) {
    errors.push('At least one monthly forecast is required');
  }

  Object.entries(data.monthlyForecast).forEach(([month, value]) => {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      errors.push(`Invalid month format: ${month}. Use YYYY-MM format.`);
    }
    
    if (typeof value !== 'number' || value < 0) {
      errors.push(`Invalid forecast value for ${month}: ${value}. Must be a non-negative number.`);
    }
  });

  return errors;
};

export const formatForecastMonth = (month: string): string => {
  try {
    const [year, monthNum] = month.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthIndex = parseInt(monthNum) - 1;
    const shortYear = year.slice(-2);
    
    return `${monthNames[monthIndex]}-${shortYear}`;
  } catch {
    return month;
  }
};

export const calculateForecastTrends = (monthlyForecast: { [key: string]: number }): {
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  totalForecast: number;
  avgMonthlyForecast: number;
} => {
  const entries = Object.entries(monthlyForecast)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length < 2) {
    return {
      trend: 'stable',
      changePercent: 0,
      totalForecast: entries[0]?.[1] || 0,
      avgMonthlyForecast: entries[0]?.[1] || 0
    };
  }

  const firstValue = entries[0][1];
  const lastValue = entries[entries.length - 1][1];
  const totalForecast = entries.reduce((sum, [, value]) => sum + value, 0);
  const avgMonthlyForecast = totalForecast / entries.length;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  let changePercent = 0;

  if (firstValue > 0) {
    changePercent = ((lastValue - firstValue) / firstValue) * 100;
    
    if (changePercent > 5) {
      trend = 'increasing';
    } else if (changePercent < -5) {
      trend = 'decreasing';
    }
  }

  return {
    trend,
    changePercent: Math.round(changePercent * 100) / 100,
    totalForecast: Math.round(totalForecast * 100) / 100,
    avgMonthlyForecast: Math.round(avgMonthlyForecast * 100) / 100
  };
};

export const getNextMonths = (count: number = 12): string[] => {
  const months: string[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
  }
  
  return months;
};

export const getForecastColor = (value: number, max: number): string => {
  if (max === 0) return 'gray';
  
  const percentage = (value / max) * 100;
  
  if (percentage >= 80) return 'red';
  if (percentage >= 60) return 'orange';
  if (percentage >= 40) return 'yellow';
  if (percentage >= 20) return 'blue';
  return 'green';
};

// ============== BLOCK 6: Forecast with Product Hours ==============

export interface ForecastWithHours {
  productCode: string;
  description: string;
  minsPerShipper: number;
  unitsPerShipper: number;
  monthlyForecast: Record<string, number>;
  weeklyForecast?: Record<string, number>;
}

export interface WeeklyDemandSummary {
  weekKey: string;
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  totalUnits: number;
  totalHours: number;
}

export interface ForecastTableData {
  headers: { key: string; label: string }[];
  rows: ForecastWithHours[];
  weeklyDemand: WeeklyDemandSummary[];
  totalProducts: number;
  activeProducts: number;
}

/**
 * Generates week keys and labels for a given number of weeks starting from current week
 */
export const generateWeekColumns = (
  weeks: number = 4
): { key: string; label: string; startDate: Date; endDate: Date }[] => {
  const result: { key: string; label: string; startDate: Date; endDate: Date }[] = [];
  const today = new Date();
  
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() + mondayOffset);
  currentMonday.setHours(0, 0, 0, 0);

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(currentMonday);
    weekStart.setDate(currentMonday.getDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekNumber = i + 1;
    const monthShort = weekStart.toLocaleDateString("en-US", { month: "short" });
    const dayNum = weekStart.getDate();

    result.push({
      key: `week_${weekNumber}`,
      label: `Week ${weekNumber} (${monthShort} ${dayNum})`,
      startDate: weekStart,
      endDate: weekEnd,
    });
  }

  return result;
};

/**
 * Converts monthly forecast data to weekly forecast data
 */
export const convertMonthlyToWeekly = (
  monthlyForecast: Record<string, number>,
  weekColumns: { key: string; startDate: Date; endDate: Date }[]
): Record<string, number> => {
  const weeklyForecast: Record<string, number> = {};

  weekColumns.forEach((week) => {
    const weekMonth = `${week.startDate.getFullYear()}-${String(
      week.startDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const monthlyValue = monthlyForecast[weekMonth] || 0;

    const weeksInMonth = weekColumns.filter((w) => {
      const wMonth = `${w.startDate.getFullYear()}-${String(
        w.startDate.getMonth() + 1
      ).padStart(2, "0")}`;
      return wMonth === weekMonth;
    }).length;

    const weeklyValue =
      weeksInMonth > 0 ? Math.round(monthlyValue / weeksInMonth) : 0;

    weeklyForecast[week.key] = weeklyValue;
  });

  return weeklyForecast;
};

/**
 * Calculates demand hours from forecast units
 */
export const calculateDemandHours = (
  units: number,
  minsPerShipper: number,
  unitsPerShipper: number
): number => {
  if (unitsPerShipper === 0 || minsPerShipper === 0) return 0;
  const shippers = units / unitsPerShipper;
  const minutes = shippers * minsPerShipper;
  const hours = minutes / 60;
  return Math.round(hours * 100) / 100;
};

/**
 * Fetches forecast data combined with product hours information
 */
export const getForecastsWithProductData = async (
  products: Array<{
    productCode: string;
    description: string;
    minsPerShipper: number;
    unitsPerShipper: number;
  }>,
  weeks: number = 4
): Promise<ForecastTableData> => {
  try {
    const forecastData = await forecastService.getAllForecasts();
    const weekColumns = generateWeekColumns(weeks);

    const productMap = new Map(
      products.map((p) => [p.productCode.toUpperCase(), p])
    );

    const rows: ForecastWithHours[] = forecastData.map((forecast) => {
      const product = productMap.get(forecast.productCode.toUpperCase());

      const weeklyForecast = convertMonthlyToWeekly(
        forecast.monthlyForecast,
        weekColumns
      );

      return {
        productCode: forecast.productCode,
        description: forecast.description || product?.description || "",
        minsPerShipper: product?.minsPerShipper || 0,
        unitsPerShipper: product?.unitsPerShipper || 0,
        monthlyForecast: forecast.monthlyForecast,
        weeklyForecast,
      };
    });

    const weeklyDemand: WeeklyDemandSummary[] = weekColumns.map((week) => {
      let totalUnits = 0;
      let totalHours = 0;

      rows.forEach((row) => {
        const units = row.weeklyForecast?.[week.key] || 0;
        totalUnits += units;
        totalHours += calculateDemandHours(
          units,
          row.minsPerShipper,
          row.unitsPerShipper
        );
      });

      return {
        weekKey: week.key,
        weekLabel: week.label,
        startDate: week.startDate,
        endDate: week.endDate,
        totalUnits,
        totalHours: Math.round(totalHours * 100) / 100,
      };
    });

    const activeProducts = rows.filter((row) => {
      const totalForecast = Object.values(row.weeklyForecast || {}).reduce(
        (sum, val) => sum + val,
        0
      );
      return totalForecast > 0;
    }).length;

    const headers = [
      { key: "productCode", label: "Product Code" },
      { key: "description", label: "Description" },
      ...weekColumns.map((week) => ({
        key: week.key,
        label: week.label,
      })),
    ];

    return {
      headers,
      rows,
      weeklyDemand,
      totalProducts: rows.length,
      activeProducts,
    };
  } catch (error) {
    console.error("❌ Error fetching forecasts with hours:", error);
    throw error;
  }
};

// BLOCK 7: Export the service class
export { ForecastService };
export default forecastService;
export const getAllForecasts = () => forecastService.getAllForecasts();
// Export types
export type {
  ForecastWithHours,
  WeeklyDemandSummary,
  ForecastTableData,
};