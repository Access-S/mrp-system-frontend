// src/services/soh.service.ts

// ============== BLOCK 1: Imports ==============
import { handleApiError } from "./api.service";
import * as XLSX from "xlsx";

// ============== BLOCK 2: Types & Interfaces ==============
export interface SohRecord {
  id: string;
  product_id: string;
  description: string;
  stock_on_hand: number;
  stock_value: number;
  import_batch_id: string;
  import_source: string;
  created_at: string;
  is_active: boolean;
}

export interface SohSummary {
  totalRecords: number;
  totalStock: number;
  totalStockValue: number;
  zeroStockCount: number;
}
export interface SohImportResult {
  success: boolean;
  message: string;
  data: {
    imported: number;
    skipped: number;
    archived: number;
    import_batch_id: string;
    detected_columns: {
      product_id: string | null;
      description: string | null;
      stock_on_hand: string | null;
    };
  };
}

export interface SohTableData {
  summary: SohSummary;
  records: SohRecord[];
}

// ============== BLOCK 3: API Base URL ==============
const API_BASE_URL = "https://mrp-1.onrender.com/api";

// ============== BLOCK 4: SOH Service Class ==============
class SohService {
  /**
   * Import SOH data from Excel file
   * Client-side parsing, sends file to backend for processing
   */
  async importSohData(file: File): Promise<SohImportResult> {
    try {
      console.log("📦 Starting SOH import...", file.name);

      // Validate file on client side
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!["xlsx", "xls", "csv"].includes(fileExt || "")) {
        throw new Error("Only Excel files (.xlsx, .xls) or CSV are allowed.");
      }

      // Create FormData and send file to backend
      const formData = new FormData();
      formData.append("sohFile", file);

      const response = await fetch(`${API_BASE_URL}/soh/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to import SOH data");
      }

      const result: SohImportResult = await response.json();
      console.log(
        `✅ SOH Import complete: ${result.data.imported} records imported, ${result.data.archived} archived`
      );

      return result;
    } catch (error) {
      console.error("❌ SOH import failed:", error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetch all active SOH records from backend
   */
  async getSohData(search?: string): Promise<SohTableData> {
    try {
      console.log("📦 Fetching SOH data...", { search });

      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.append("search", search.trim());
      }

      const url = `${API_BASE_URL}/soh${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch SOH data");
      }

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Fetched ${result.data.length} SOH records`);
        return {
          summary: result.summary,
          records: result.data,
        };
      }

      console.warn("Unexpected API response format:", result);
      return {
        summary: { totalRecords: 0, totalStock: 0, zeroStockCount: 0 },
        records: [],
      };
    } catch (error) {
      console.error("❌ Error fetching SOH data:", error);
      throw new Error(handleApiError(error));
    }
  }
}

// ============== BLOCK 5: Export Singleton Instance ==============
export const sohService = new SohService();

// ============== BLOCK 6: Export Individual Functions ==============
export const importSohData = (file: File) => sohService.importSohData(file);
export const getSohData = (search?: string) => sohService.getSohData(search);

// ============== BLOCK 7: Utility Functions ==============

/**
 * Format stock number with thousand separators
 */
export const formatStock = (value: number): string => {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

/**
 * Format currency (for stock value)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// ============== BLOCK 8: Default Export ==============
export { SohService };
export default sohService;