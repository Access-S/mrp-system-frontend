// src/features/dashboard/types/dashboard.types.ts

// ============== BLOCK 1: Dashboard Types ==============

export interface DashboardKPIs {
  totalOpenOrders: number;
  totalOpenValue: number;
  totalOpenWorkHours: number;
  ordersRequiringAttention: number;
  componentsAtRisk: number;
  averageTurnaroundDays: number;
  completedThisMonth: number;
  revenueThisMonth: number;
  snapshotAvailable: boolean;
  trends: {
    openOrders: number[];
    openValue: number[];
    workHours: number[];
    attentionRequired: number[];
    componentsAtRisk: number[];
    turnaroundDays: number[];
    completedMonthly: number[];
    revenueMonthly: number[];
  };
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
  completedOrdersTotal: number;
  activeOrdersTotal: number;
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