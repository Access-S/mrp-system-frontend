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

// BLOCK 6: Export the service class
export { ForecastService };
export default forecastService;
export const getAllForecasts = () => forecastService.getAllForecasts();