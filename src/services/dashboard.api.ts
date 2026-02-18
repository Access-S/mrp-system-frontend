// src/services/dashboard.api.ts

// BLOCK 1: Interfaces
export interface DashboardKPIs {
  totalOpenOrders: number;
  totalOpenValue: number;
  totalOpenWorkHours: number;
  ordersRequiringAttention: number;
  componentsAtRisk: number;
  averageTurnaroundDays: number;
  completedThisMonth: number;
  revenueThisMonth: number;
}

export interface POStatusDistribution {
  status: string;
  count: number;
  value: number;
}

export interface MonthlyTrend {
  month: string;
  ordersReceived: number;
  ordersDespatched: number;
  revenue: number;
}

export interface TopCustomer {
  customerName: string;
  orderCount: number;
  totalValue: number;
}

export interface TopProduct {
  productCode: string;
  description: string;
  orderCount: number;
  totalQuantity: number;
}

export interface LowStockAlert {
  productId: string;
  description: string;
  stockOnHand: number;
  safetyStock: number;
  deficit: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface ForecastSummary {
  totalForecastedUnits: number;
  monthsCovered: number;
  topForecastedProduct: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  poStatusDistribution: POStatusDistribution[];
  monthlyTrends: MonthlyTrend[];
  topCustomers: TopCustomer[];
  topProducts: TopProduct[];
  lowStockAlerts: LowStockAlert[];
  recentActivity: RecentActivity[];
  forecastSummary: ForecastSummary;
  lastUpdated: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  meta: {
    fetchDuration: number;
    timestamp: string;
  };
}

// BLOCK 2: API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

// BLOCK 3: Fetch Dashboard Data
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
    }

    const result: DashboardResponse = await response.json();

    if (!result.success) {
      throw new Error('Dashboard API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// BLOCK 4: Fetch Quick Stats (Lightweight)
export const fetchQuickStats = async (): Promise<DashboardKPIs> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/quick-stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quick stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    throw error;
  }
};