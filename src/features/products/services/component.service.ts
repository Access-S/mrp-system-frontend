// src/services/component.service.ts

// ============== BLOCK 1: Imports ==============
import { apiClient, handleApiError, ApiResponse } from "./api.service";
import { Component } from "../types/mrp.types";

// ============== BLOCK 2: Component Service Class ==============
class ComponentService {

  /**
   * Fetches all active SOH records and transforms them into Component objects for MRP
   * @returns Promise<Component[]> - Array of components with stock data
   */
  async getAllSoh(): Promise<Component[]> {
    try {
      const response: ApiResponse<any[]> = await apiClient.get('/soh');

      if (response.success && Array.isArray(response.data)) {
        const components = response.data.map(item => ({
          id: item.id,
          partCode: String(item.part_code || '').trim(),
          partDescription: item.description || '',
          stock: item.stock_on_hand || 0,
          safetyStock: 0,
          reorderPoint: 0,
          unitCost: item.unit_cost || 0,
          supplier: item.supplier_id || undefined,
          leadTime: item.lead_time_days || undefined,
        }));

        return components;
      }

      throw new Error('Failed to fetch SOH records');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Gets SOH summary statistics
   * @returns Promise with total records and latest import info
   */
  async getSohSummary(): Promise<{
    totalRecords: number;
    latestImport: any;
  }> {
    try {
      const response: ApiResponse<any> = await apiClient.get('/soh/summary');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch SOH summary');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Searches SOH records by part code or description
   * @param searchTerm - Term to search for
   * @param limit - Maximum number of results
   * @returns Promise<Component[]>
   */
  async searchSoh(searchTerm: string, limit: number = 50): Promise<Component[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const response: ApiResponse<any[]> = await apiClient.get(
        `/soh?search=${encodeURIComponent(searchTerm)}&limit=${limit}`
      );

      if (response.success && Array.isArray(response.data)) {
        const components = response.data.map(item => ({
          id: item.id,
          partCode: String(item.part_code || '').trim(),
          partDescription: item.description || '',
          stock: item.stock_on_hand || 0,
          safetyStock: 0,
          reorderPoint: 0,
          unitCost: item.unit_cost || 0,
          supplier: item.supplier_id || undefined,
          leadTime: item.lead_time_days || undefined,
        }));

        return components;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Gets SOH record by part code
   * @param partCode - Part code to search for
   * @returns Promise<Component | null>
   */
  async getSohByPartCode(partCode: string): Promise<Component | null> {
    try {
      if (!partCode) {
        return null;
      }

      const response: ApiResponse<any[]> = await apiClient.get(
        `/soh?search=${encodeURIComponent(partCode)}&limit=1`
      );

      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const item = response.data[0];
        return {
          id: item.id,
          partCode: String(item.part_code || '').trim(),
          partDescription: item.description || '',
          stock: item.stock_on_hand || 0,
          safetyStock: 0,
          reorderPoint: 0,
          unitCost: item.unit_cost || 0,
          supplier: item.supplier_id || undefined,
          leadTime: item.lead_time_days || undefined,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets inventory summary statistics
   */
  async getInventorySummary(): Promise<{
    totalItems: number;
    totalStock: number;
    lowStockCount: number;
    averageStock: number;
  }> {
    try {
      const summary = await this.getSohSummary();

      return {
        totalItems: summary.totalRecords,
        totalStock: 0,
        lowStockCount: 0,
        averageStock: 0
      };
    } catch (error) {
      return {
        totalItems: 0,
        totalStock: 0,
        lowStockCount: 0,
        averageStock: 0
      };
    }
  }
}

// ============== BLOCK 3: Export Singleton Instance ==============
export const componentService = new ComponentService();

// ============== BLOCK 4: Export Individual Functions ==============
export const getAllSoh = () => componentService.getAllSoh();
export const getSohSummary = () => componentService.getSohSummary();
export const getSohByPartCode = (partCode: string) => componentService.getSohByPartCode(partCode);
export const searchSoh = (searchTerm: string, limit?: number) => componentService.searchSoh(searchTerm, limit);
export const getInventorySummary = () => componentService.getInventorySummary();

// ============== BLOCK 5: Export Service Class ==============
export { ComponentService };
export default componentService;