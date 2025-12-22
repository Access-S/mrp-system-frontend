//src/services/bom.service.ts

// BLOCK 1: Imports
import { apiClient, handleApiError, ApiResponse } from "./api.service";

// BLOCK 2: Interfaces
export interface BomComponent {
  partCode: string;
  partDescription: string;
  partType: 'RAW_MATERIAL' | 'COMPONENT' | 'PACKAGING' | 'CONSUMABLE';
  perShipper: number;
}

export interface AddBomComponentData {
  partCode: string;
  partDescription: string;
  partType: 'RAW_MATERIAL' | 'COMPONENT' | 'PACKAGING' | 'CONSUMABLE';
  perShipper: number;
}

export interface UpdateBomComponentData {
  partDescription?: string;
  partType?: 'RAW_MATERIAL' | 'COMPONENT' | 'PACKAGING' | 'CONSUMABLE';
  perShipper?: number;
}

// BLOCK 3: BOM Service Class
class BomService {
  
  /**
   * Adds a new BOM component to a product
   * @param productCode - The product code
   * @param componentData - Component data to add
   * @returns A promise that resolves to the created component
   */
  async addComponent(productCode: string, componentData: AddBomComponentData): Promise<BomComponent> {
    try {
      const response: ApiResponse<BomComponent> = await apiClient.post(
        `/products/${productCode}/bom`,
        componentData
      );
      
      if (response.success && response.data) {
        console.log(`✅ Added BOM component: ${componentData.partCode} to ${productCode}`);
        return response.data;
      }
      
      throw new Error('Failed to add BOM component');
    } catch (error) {
      console.error('❌ Error adding BOM component:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Updates an existing BOM component
   * @param productCode - The product code
   * @param partCode - The part code to update
   * @param componentData - Partial component data to update
   * @returns A promise that resolves to the updated component
   */
  async updateComponent(
    productCode: string, 
    partCode: string, 
    componentData: UpdateBomComponentData
  ): Promise<BomComponent> {
    try {
      const response: ApiResponse<BomComponent> = await apiClient.patch(
        `/products/${productCode}/bom/${partCode}`,
        componentData
      );
      
      if (response.success && response.data) {
        console.log(`✅ Updated BOM component: ${partCode} in ${productCode}`);
        return response.data;
      }
      
      throw new Error('Failed to update BOM component');
    } catch (error) {
      console.error('❌ Error updating BOM component:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Deletes a BOM component from a product
   * @param productCode - The product code
   * @param partCode - The part code to delete
   * @returns A promise that resolves when deletion is complete
   */
  async deleteComponent(productCode: string, partCode: string): Promise<void> {
    try {
      const response: ApiResponse<void> = await apiClient.delete(
        `/products/${productCode}/bom/${partCode}`
      );
      
      if (response.success) {
        console.log(`✅ Deleted BOM component: ${partCode} from ${productCode}`);
        return;
      }
      
      throw new Error('Failed to delete BOM component');
    } catch (error) {
      console.error('❌ Error deleting BOM component:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Gets all BOM components for a product
   * @param productCode - The product code
   * @returns A promise that resolves to an array of BOM components
   */
  async getComponents(productCode: string): Promise<BomComponent[]> {
    try {
      const response: ApiResponse<BomComponent[]> = await apiClient.get(
        `/products/${productCode}/bom`
      );
      
      if (response.success && response.data) {
        console.log(`✅ Fetched ${response.data.length} BOM components for ${productCode}`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error fetching BOM components:', error);
      throw new Error(handleApiError(error));
    }
  }
}

// BLOCK 4: Export singleton instance
export const bomService = new BomService();

// BLOCK 5: Export individual functions for convenience
export const addBomComponent = (productCode: string, data: AddBomComponentData) => 
  bomService.addComponent(productCode, data);

export const updateBomComponent = (productCode: string, partCode: string, data: UpdateBomComponentData) => 
  bomService.updateComponent(productCode, partCode, data);

export const deleteBomComponent = (productCode: string, partCode: string) => 
  bomService.deleteComponent(productCode, partCode);

export const getBomComponents = (productCode: string) => 
  bomService.getComponents(productCode);

// BLOCK 6: Export the service class
export default bomService;