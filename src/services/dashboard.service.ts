// BLOCK 1: Imports
import { supabase } from "../supabase.config";
import { handleApiError } from "./api.service";
import { PurchaseOrder, Component, Product } from "../types/mrp.types";

// BLOCK 2: Interface for Dashboard Data
export interface DashboardStats {
  openPoCount: number;
  totalOpenValue: number;
  componentsAtRiskCount: number;
  attentionPoCount: number;
  totalOpenWorkHours: number;
  averageTurnaroundDays: number;
}

export interface DashboardChartData {
  poStatusDistribution: { status: string; count: number; value: number }[];
  monthlyPoTrends: { month: string; count: number; value: number }[];
  topCustomers: { customer: string; count: number; value: number }[];
  inventoryAlerts: { partCode: string; currentStock: number; safetyStock: number }[];
}

// BLOCK 3: Dashboard Service Class
class DashboardService {

  /**
   * Fetches and calculates all key statistics for the main dashboard
   * @param allProducts - Array of products for calculations (optional, will fetch if not provided)
   * @returns Promise<DashboardStats>
   */
  async getDashboardStats(allProducts?: Product[]): Promise<DashboardStats> {
    try {
      console.log('📊 Fetching dashboard statistics...');

      // Fetch products if not provided - USE BACKEND API WITH FULL URL
      if (!allProducts) {
        const response = await fetch('https://mrp-1.onrender.com/api/products');
        if (!response.ok) {
          console.warn('Could not fetch products for dashboard calculations');
          allProducts = [];
        } else {
          const result = await response.json();
          allProducts = result.data || [];
        }
      }

      // Fetch all Purchase Orders - USE BACKEND API WITH FULL URL
      const poResponse = await fetch('https://mrp-1.onrender.com/api/purchase-orders?limit=100');
      if (!poResponse.ok) {
        throw new Error('Failed to fetch purchase orders');
      }
      const poResult = await poResponse.json();
      const allPOs = poResult.data || [];

      // Fetch all Components/SOH data - USE BACKEND API WITH FULL URL
      const sohResponse = await fetch('https://mrp-1.onrender.com/api/soh?limit=100');
      const sohResult = await sohResponse.json();
      const allComponents = sohResult.data || [];

      // Calculate Stats
      let openPoCount = 0;
      let totalOpenValue = 0;
      let attentionPoCount = 0;
      let totalOpenWorkHours = 0;
      let totalTurnaroundDays = 0;
      let completedPoCount = 0;

      (allPOs || []).forEach((po) => {
        // Get product details for calculations
        const productDetails = allProducts?.find(
          (p) => p.product_code === po.product_code || p.productCode === po.product_code
        ) || po.product;

        // Calculate production time in hours
        const minsPerShipper = productDetails?.mins_per_shipper || productDetails?.minsPerShipper || 0;
        const orderedQtyShippers = po.ordered_qty_shippers || 0;
        const prodTimeHours = (orderedQtyShippers * minsPerShipper) / 60;

        // Get current statuses (could be from po_status_history or direct field)
        const currentStatuses = po.statuses?.map((s: any) => s.status) || 
                              (Array.isArray(po.status) ? po.status : [po.status || 'Open']);

        const isCompleted = currentStatuses.some((status: string) => 
          status.includes('Completed') || status.includes('Despatched')
        );

        const needsAttention = currentStatuses.some((status: string) => 
          status.includes('PO Check')
        );

        if (!isCompleted) {
          openPoCount++;
          totalOpenValue += po.customer_amount || po.system_amount || 0;
          totalOpenWorkHours += prodTimeHours;
        } else {
          // Calculate Turnaround Days for completed POs
          if (po.delivery_date && po.po_received_date) {
            const receivedDate = new Date(po.po_received_date);
            const deliveryDate = new Date(po.delivery_date);
            const diffTime = Math.abs(deliveryDate.getTime() - receivedDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            totalTurnaroundDays += diffDays;
            completedPoCount++;
          }
        }

        if (needsAttention) {
          attentionPoCount++;
        }
      });

      // Calculate components at risk
      const componentsAtRiskCount = (allComponents || []).filter(
        (c) => (c.stock_on_hand || 0) < (c.safety_stock || 0)
      ).length;

      const averageTurnaroundDays = completedPoCount > 0 
        ? Math.round((totalTurnaroundDays / completedPoCount) * 100) / 100 
        : 0;

      const stats = {
        openPoCount,
        totalOpenValue: Math.round(totalOpenValue * 100) / 100,
        componentsAtRiskCount,
        attentionPoCount,
        totalOpenWorkHours: Math.round(totalOpenWorkHours * 100) / 100,
        averageTurnaroundDays,
      };

      console.log('✅ Dashboard stats calculated:', stats);
      return stats;

    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      // Return zeroed-out data on error
      return {
        openPoCount: 0,
        totalOpenValue: 0,
        componentsAtRiskCount: 0,
        attentionPoCount: 0,
        totalOpenWorkHours: 0,
        averageTurnaroundDays: 0,
      };
    }
  }

  /**
   * Fetches data for dashboard charts and visualizations
   * @returns Promise<DashboardChartData>
   */
  async getDashboardChartData(): Promise<DashboardChartData> {
    try {
      console.log('📈 Fetching dashboard chart data...');

      // TODO: Replace these with backend API calls when available
      // For now, return empty data to avoid errors
      
      return {
        poStatusDistribution: [],
        monthlyPoTrends: [],
        topCustomers: [],
        inventoryAlerts: []
      };

    } catch (error) {
      console.error('❌ Error fetching dashboard chart data:', error);
      return {
        poStatusDistribution: [],
        monthlyPoTrends: [],
        topCustomers: [],
        inventoryAlerts: []
      };
    }
  }

  /**
   * Gets recent activity feed for dashboard
   * @param limit - Number of recent activities to fetch
   * @returns Promise<any[]>
   */
  async getRecentActivity(limit: number = 10): Promise<any[]> {
    try {
      // Fetch recent PO updates - USE BACKEND API WITH FULL URL
      const response = await fetch(`https://mrp-1.onrender.com/api/purchase-orders?limit=${limit}&sort_direction=desc`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent activities');
      }
      
      const result = await response.json();
      const recentPOs = result.data || [];

      const activities = (recentPOs || []).map(po => ({
        id: po.id,
        type: 'purchase_order',
        title: `PO ${po.po_number}`,
        description: `${po.customer_name} - $${po.customer_amount}`,
        timestamp: po.updated_at || po.created_at,
        metadata: {
          poNumber: po.po_number,
          customer: po.customer_name,
          product: po.product?.product_code
        }
      }));

      console.log(`✅ Fetched ${activities.length} recent activities`);
      return activities;

    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * Gets performance metrics for dashboard
   * @returns Promise<any>
   */
  async getPerformanceMetrics(): Promise<{
    avgProcessingTime: number;
    onTimeDeliveryRate: number;
    customerSatisfactionScore: number;
    inventoryTurnover: number;
  }> {
    try {
      // This would require more complex queries and historical data
      // For now, return placeholder metrics
      console.log('📊 Calculating performance metrics...');

      // You can implement these based on your specific business logic
      return {
        avgProcessingTime: 0, // Average days from PO received to dispatch
        onTimeDeliveryRate: 0, // Percentage of on-time deliveries
        customerSatisfactionScore: 0, // Based on feedback or returns
        inventoryTurnover: 0 // How quickly inventory moves
      };

    } catch (error) {
      console.error('❌ Error calculating performance metrics:', error);
      return {
        avgProcessingTime: 0,
        onTimeDeliveryRate: 0,
        customerSatisfactionScore: 0,
        inventoryTurnover: 0
      };
    }
  }
}

// BLOCK 4: Export singleton instance
export const dashboardService = new DashboardService();

// BLOCK 5: Export individual functions for backward compatibility
export const getDashboardStats = (allProducts?: Product[]) => 
  dashboardService.getDashboardStats(allProducts);

export const getDashboardChartData = () => 
  dashboardService.getDashboardChartData();

export const getRecentActivity = (limit?: number) => 
  dashboardService.getRecentActivity(limit);

export const getPerformanceMetrics = () => 
  dashboardService.getPerformanceMetrics();

// BLOCK 6: Export the service class
export { DashboardService };
export default dashboardService;