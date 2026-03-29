// src/features/dashboard/services/dashboard.api.ts

// ============== BLOCK 1: Type Imports & Re-exports ==============
export type {
  DashboardKPIs,
  POStatusDistribution,
  MonthlyTrend,
  TopCustomer,
  TopProduct,
  LowStockAlert,
  RecentActivity,
  ForecastSummary,
  DashboardData,
  DashboardResponse,
} from '../types/dashboard.types';

import type {
  DashboardKPIs,
  DashboardData,
  DashboardResponse,
} from '../types/dashboard.types';

// ============== BLOCK 2: API Configuration ==============
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ============== BLOCK 3: Fetch Dashboard Data ==============

// UPDATED: Added timeRange parameter with a default value
export const fetchDashboardData = async (timeRange: string = 'last_6_months'): Promise<DashboardData> => {
  const response = await fetch(`${API_BASE_URL}/dashboard?timeRange=${timeRange}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }
  const result: DashboardResponse = await response.json();
  if (!result.success) {
    throw new Error('Dashboard API returned unsuccessful response');
  }
  return result.data;
};

// ============== BLOCK 4: Fetch Quick Stats (Lightweight) ==============
export const fetchQuickStats = async (): Promise<DashboardKPIs> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/quick-stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch quick stats: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data;
};