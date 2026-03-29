// src/features/products/services/product.service.ts

// ============== BLOCK 1: Imports ==============
import { apiClient, handleApiError, ApiResponse } from "@/services/api.service";
import type { Product, BomComponent } from "@/features/products/types";

// ============== BLOCK 2: Interfaces ==============
export interface CreateProductData {
  productCode: string;
  description: string;
  unitsPerShipper?: number;
  dailyRunRate?: number;
  hourlyRunRate?: number;
  minsPerShipper?: number;
  pricePerShipper?: number;
}

export interface UpdateProductData {
  description?: string;
  unitsPerShipper?: number;
  dailyRunRate?: number;
  hourlyRunRate?: number;
  minsPerShipper?: number;
  pricePerShipper?: number;
}

// ============== BLOCK 3: Product Service Class ==============
class ProductService {

  /**
   * Fetches all products with BOM components from the backend API
   * @returns Promise<Product[]>
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const response: ApiResponse<Product[]> = await apiClient.get('/products');

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch products');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetches a single product by product code with BOM components
   * @param productCode - The product code to fetch
   * @returns Promise<Product | null>
   */
  async getProductByCode(productCode: string): Promise<Product | null> {
    try {
      if (!productCode) {
        throw new Error('Product code is required');
      }

      const response: ApiResponse<Product> = await apiClient.get(`/products/${encodeURIComponent(productCode)}`);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Fetches BOM components for a specific product
   * @param productCode - The product code
   * @returns Promise<BomComponent[]>
   */
  async getBomForProduct(productCode: string): Promise<BomComponent[]> {
    try {
      if (!productCode) {
        throw new Error('Product code is required');
      }

      const response: ApiResponse<BomComponent[]> = await apiClient.get(`/products/${encodeURIComponent(productCode)}/bom`);

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Creates a new product via the backend API
   * @param productData - Product data to create
   * @returns Promise<Product>
   */
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response: ApiResponse<Product> = await apiClient.post('/products', productData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to create product');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Updates an existing product via the backend API
   * @param productCode - Product code to update
   * @param productData - Partial product data to update
   * @returns Promise<Product>
   */
  async updateProduct(productCode: string, productData: UpdateProductData): Promise<Product> {
    try {
      const response: ApiResponse<Product> = await apiClient.patch(`/products/${encodeURIComponent(productCode)}`, productData);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to update product');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Deletes a product via the backend API
   * @param productCode - Product code to delete
   * @returns Promise<void>
   */
  async deleteProduct(productCode: string): Promise<void> {
    try {
      const response: ApiResponse<void> = await apiClient.delete(`/products/${encodeURIComponent(productCode)}`);

      if (response.success) {
        return;
      }

      throw new Error('Failed to delete product');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// ============== BLOCK 4: Export Singleton Instance ==============
export const productService = new ProductService();

// ============== BLOCK 5: Export Individual Functions ==============
export const getAllProducts = () => productService.getAllProducts();
export const getProductByCode = (productCode: string) => productService.getProductByCode(productCode);
export const getBomForProduct = (productCode: string) => productService.getBomForProduct(productCode);
export const createProduct = (productData: CreateProductData) => productService.createProduct(productData);
export const updateProduct = (productCode: string, productData: UpdateProductData) => productService.updateProduct(productCode, productData);
export const deleteProduct = (productCode: string) => productService.deleteProduct(productCode);

// ============== BLOCK 6: Export Service Class ==============
export { ProductService };
export default productService;