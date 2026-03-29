// src/features/soh/services/soh.service.ts

// ============== BLOCK 1: Imports ==============
import { apiClient, handleApiError } from "@/services/api.service";
import type { SohRecord, SohSummary, SohImportResult, SohTableData } from "../types/soh.types";

// ============== BLOCK 2: SOH Service Class ==============
class SohService {
  /**
   * Import SOH data from Excel file
   * Sends file to backend for processing
   */
  async importSohData(file: File): Promise<SohImportResult> {
    try {

      // Validate file on client side
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      if (!["xlsx", "xls", "csv"].includes(fileExt || "")) {
        throw new Error("Only Excel files (.xlsx, .xls) or CSV are allowed.");
      }

      // Create FormData and send file to backend via apiClient base URL
      const formData = new FormData();
      formData.append("sohFile", file);

      const response = await fetch(`${apiClient.getBaseURL()}/soh/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to import SOH data");
      }

      const result: SohImportResult = await response.json();
      return result;
      
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetch all active SOH records from backend
   * Used by SohPage for display
   */
  async getSohData(search?: string): Promise<SohTableData> {
    try {

      const params = search && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
      const response = await apiClient.get<any>(`/soh${params}`);

      if (response.success) {
        return {
          summary: response.summary,
          records: response.data,
        };
      }

      return {
        summary: { totalRecords: 0, totalStock: 0, totalStockValue: 0, zeroStockCount: 0 },
        records: [],
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// ============== BLOCK 3: Export Singleton Instance ==============
export const sohService = new SohService();

// ============== BLOCK 4: Export Individual Functions & Re-export Types ==============
export const importSohData = (file: File) => sohService.importSohData(file);
export const getSohData = (search?: string) => sohService.getSohData(search);

// Re-export types for convenience
export type { SohRecord, SohSummary, SohImportResult, SohTableData } from "../types/soh.types";

// ============== BLOCK 5: Utility Functions ==============

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

// ============== BLOCK 6: Default Export ==============
export { SohService };
export default sohService;