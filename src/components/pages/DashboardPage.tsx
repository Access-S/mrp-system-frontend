// src/components/pages/DashboardPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import {
  ShoppingCartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { useToast } from "../ui/Toast";
import { Skeleton } from "../ui/Skeleton";

import {
  KPICard,
  DashboardSkeleton,
  RecentActivityCard,
  LowStockAlerts,
  TopItemsCard,
  TimeRangeFilter,
  TIME_RANGE_LABELS,
} from "../dashboard";
import {
  LineChart,
  MultipleBarChart,
  RadialBarChart,
} from "../dashboard/charts";

import { useFetch } from "../../hooks";

import { fetchDashboardData } from "../../services/dashboard.api";

import type { DashboardData } from "../../services/dashboard.api";

// ============== BLOCK 2: Constants ==============

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ============== BLOCK 3: Component ==============

export function DashboardPage() {
  const { toast } = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState("this_month");

  // KPI data — re-fetches when time range changes + polls every 5 min
  const kpi = useFetch<DashboardData>(
    () => fetchDashboardData(selectedTimeRange),
    [selectedTimeRange],
    { pollingInterval: POLLING_INTERVAL }
  );

  // Chart data — always last 6 months, fetched once + polls every 5 min
  const charts = useFetch<DashboardData>(
    () => fetchDashboardData("last_6_months"),
    [],
    { pollingInterval: POLLING_INTERVAL }
  );

  // ============== BLOCK 4: Loading State ==============

  if ((kpi.loading && !kpi.data) || (charts.loading && !charts.data)) {
    return <DashboardSkeleton />;
  }

  // ============== BLOCK 5: Error State ==============

  if ((kpi.error && !kpi.data) || (charts.error && !charts.data)) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            variant="error"
            title="Failed to Load Dashboard"
            description={kpi.error || charts.error || "Unable to fetch dashboard data"}
            action={
              <Button
                variant="primary"
                onClick={() => {
                  kpi.refetch();
                  charts.refetch();
                }}
              >
                Try Again
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  // ============== BLOCK 6: Data Guards ==============

  const kpiData = kpi.data;
  const chartData = charts.data;

  if (!kpiData || !chartData) return null;

  const { kpis } = kpiData;
  const {
    monthlyTrends,
    poStatusDistribution,
    completedOrdersTotal,
    topCustomers,
    topProducts,
    recentActivity,
    lowStockAlerts,
  } = chartData;

  const timeLabel = TIME_RANGE_LABELS[selectedTimeRange] || "This Month";

  // ============== BLOCK 7: Render ==============

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Manager Dashboard
              </h1>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                Real-time overview of your manufacturing operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TimeRangeFilter
                value={selectedTimeRange}
                onChange={setSelectedTimeRange}
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <p>Last updated</p>
                <p className="font-medium">
                  {new Date(kpiData.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Row 1 — updates with time range filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpi.loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`kpi1-${i}`} className="rounded-xl h-32" />
          ))
        ) : (
          <>
            <KPICard
              title="Open Orders" value={kpis.totalOpenOrders}
              format="number" color="blue"
              sparklineData={kpis.trends?.openOrders}
              sparklineColor="#3b82f6" sparklineType="bar"
            />
            <KPICard
              title="Open Order Value" value={kpis.totalOpenValue}
              format="currency" color="green"
              sparklineData={kpis.trends?.openValue}
              sparklineColor="#10b981" sparklineType="area"
            />
            <KPICard
              title="Work Hours Pending" value={kpis.totalOpenWorkHours}
              format="hours" color="purple"
              sparklineData={kpis.trends?.workHours}
              sparklineColor="#8b5cf6" sparklineType="line"
            />
            <KPICard
              title="Attention Required" value={kpis.ordersRequiringAttention}
              format="number"
              color={kpis.ordersRequiringAttention > 0 ? "red" : "green"}
              sparklineData={kpis.trends?.attentionRequired}
              sparklineColor={kpis.ordersRequiringAttention > 0 ? "#ef4444" : "#10b981"}
              sparklineType="bar"
            />
          </>
        )}
      </div>

      {/* KPI Row 2 — also updates with time range filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpi.loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`kpi2-${i}`} className="rounded-xl h-32" />
          ))
        ) : (
          <>
            <KPICard
              title="Components at Risk" value={kpis.componentsAtRisk}
              format="number"
              color={kpis.componentsAtRisk > 0 ? "yellow" : "green"}
              sparklineData={kpis.trends?.componentsAtRisk}
              sparklineColor={kpis.componentsAtRisk > 0 ? "#f59e0b" : "#10b981"}
              sparklineType="bar"
            />
            <KPICard
              title="Avg. Turnaround" value={kpis.averageTurnaroundDays}
              format="days" color="blue"
              sparklineData={kpis.trends?.turnaroundDays}
              sparklineColor="#3b82f6" sparklineType="line"
            />
            <KPICard
              title={`Completed ${timeLabel}`} value={kpis.completedThisMonth}
              format="number" color="green"
              sparklineData={kpis.trends?.completedMonthly}
              sparklineColor="#10b981" sparklineType="bar"
            />
            <KPICard
              title={`Revenue ${timeLabel}`} value={kpis.revenueThisMonth}
              format="currency" color="green"
              sparklineData={kpis.trends?.revenueMonthly}
              sparklineColor="#10b981" sparklineType="area"
            />
          </>
        )}
      </div>

      {/* Charts Row — always last 6 months */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.loading ? (
          <>
            <Skeleton className="rounded-xl h-80" />
            <Skeleton className="rounded-xl h-80" />
          </>
        ) : (
          <>
            <LineChart
              title="Monthly Revenue Trend"
              subtitle="Revenue from despatched orders — Last 6 Months"
              data={monthlyTrends.map((t) => t.revenue)}
              categories={monthlyTrends.map((t) => t.month)}
              icon={<ChartBarIcon className="h-6 w-6" />}
              formatValue={(val) => `$${val.toLocaleString()}`}
            />
            <MultipleBarChart
              title="Orders: Received vs Despatched"
              subtitle="Compare incoming orders with completed deliveries — Last 6 Months"
              series={[
                { name: "Orders Received", data: monthlyTrends.map((t) => t.ordersReceived) },
                { name: "Orders Despatched", data: monthlyTrends.map((t) => t.ordersDespatched) },
              ]}
              categories={monthlyTrends.map((t) => t.month)}
              icon={<ShoppingCartIcon className="h-6 w-6" />}
            />
          </>
        )}
      </div>

      {/* Radial Chart + Top Lists — always last 6 months */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {charts.loading ? (
          <>
            <Skeleton className="rounded-xl h-80" />
            <Skeleton className="rounded-xl h-80" />
            <Skeleton className="rounded-xl h-80" />
          </>
        ) : (
          <>
            <RadialBarChart
              title="Order Status Distribution"
              subtitle="Current active orders by status"
              data={poStatusDistribution.map((s) => s.count)}
              labels={poStatusDistribution.map((s) => s.status)}
              icon={<ChartBarIcon className="h-6 w-6" />}
              despatchedCount={completedOrdersTotal}
            />
            <TopItemsCard title="Top Customers" items={topCustomers} type="customers" />
            <TopItemsCard title="Top Products" items={topProducts} type="products" />
          </>
        )}
      </div>

      {/* Activity + Alerts — always last 6 months */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.loading ? (
          <>
            <Skeleton className="rounded-xl h-80" />
            <Skeleton className="rounded-xl h-80" />
          </>
        ) : (
          <>
            <RecentActivityCard activities={recentActivity} />
            <LowStockAlerts alerts={lowStockAlerts} />
          </>
        )}
      </div>
    </div>
  );
}