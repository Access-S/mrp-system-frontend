// src/components/pages/DashboardPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Spinner, Button } from '@material-tailwind/react';
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TruckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { BarChart, MultipleBarChart, LineChart, PieChart, RadialBarChart } from '../dashboard/charts';
import { KPICard } from '../dashboard/KPICard';
import { fetchDashboardData, DashboardData } from '../../services/dashboard.api';
import toast from 'react-hot-toast';


// BLOCK 1: Skeleton Components
function KPISkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 h-32" />
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 h-80" />
  );
}

// BLOCK 2: Recent Activity Component
function RecentActivityCard({ 
  activities, 
  theme 
}: { 
  activities: DashboardData['recentActivity']; 
  theme: any;
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'despatched':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'open':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'po check':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className={`rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              theme.isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-slate-600' : 'bg-white'}`}>
                <ShoppingCartIcon className={`h-5 w-5 ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`font-medium ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {activity.title}
                </p>
                <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activity.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
              <span className={`text-xs ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {formatTime(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// BLOCK 3: Low Stock Alerts Component
function LowStockAlerts({
  alerts,
  theme
}: {
  alerts: DashboardData['lowStockAlerts'];
  theme: any;
}) {
  if (alerts.length === 0) {
    return (
      <div className={`rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Low Stock Alerts
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircleIcon className={`h-12 w-12 mb-3 ${theme.isDark ? 'text-green-400' : 'text-green-500'}`} />
          <p className={`font-medium ${theme.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            All stock levels healthy!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Low Stock Alerts
        </h3>
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {alerts.length} items
        </span>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.slice(0, 5).map((alert, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border-l-4 border-red-500 ${
              theme.isDark ? 'bg-slate-700/50' : 'bg-red-50'
            }`}
          >
            <div>
              <p className={`font-medium ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {alert.productId}
              </p>
              <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {alert.description || 'No description'}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-bold text-red-500`}>
                {alert.stockOnHand}
              </p>
              <p className={`text-xs ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                of {alert.safetyStock} min
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// BLOCK 4: Top Items Component
function TopItemsCard({
  title,
  items,
  type,
  theme
}: {
  title: string;
  items: any[];
  type: 'customers' | 'products';
  theme: any;
}) {
  return (
    <div className={`rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg ${
              theme.isDark ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                index === 0 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : index === 1
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                  : index === 2
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
              }`}>
                {index + 1}
              </span>
              <div>
                <p className={`font-medium ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {type === 'customers' ? item.customerName : item.productCode}
                </p>
                {type === 'products' && (
                  <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.description?.substring(0, 30)}...
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {type === 'customers' 
                  ? `$${item.totalValue.toLocaleString()}`
                  : item.totalQuantity.toLocaleString()
                }
              </p>
              <p className={`text-xs ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.orderCount} orders
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// BLOCK 5: Main Dashboard Component
export function DashboardPage() {
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: State for Time Range Filter
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_6_months');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Time Range Options
  const timeRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'Last Week', value: 'last_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'Last 6 Months', value: 'last_6_months' },
    { label: 'This Financial Year', value: 'this_fy' },
    { label: 'Last Financial Year', value: 'last_fy' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData(selectedTimeRange);
        setDashboardData(data);
      } catch (err: any) {
        console.error('Failed to load dashboard:', err);
        setError(err.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    const interval = setInterval(loadDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <KPISkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !dashboardData) {
    return (
      <div className={`flex flex-col items-center justify-center h-96 rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
        <ExclamationTriangleIcon className={`h-16 w-16 mb-4 ${theme.isDark ? 'text-red-400' : 'text-red-500'}`} />
        <h2 className={`text-xl font-semibold mb-2 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Failed to Load Dashboard
        </h2>
        <p className={`text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {error || 'Unable to fetch dashboard data'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  const { 
    kpis, 
    poStatusDistribution, 
    completedOrdersTotal,
    activeOrdersTotal,
    monthlyTrends, 
    topCustomers, 
    topProducts, 
    lowStockAlerts, 
    recentActivity 
  } = dashboardData;

  // Dynamic KPI title based on selected time range
  const getTimeRangeLabel = (): string => {
    const labels: Record<string, string> = {
      'today': 'Today',
      'this_week': 'This Week',
      'last_week': 'Last Week',
      'this_month': 'This Month',
      'last_month': 'Last Month',
      'last_3_months': 'Last 3 Months',
      'last_6_months': 'Last 6 Months',
      'this_fy': 'This FY',
      'last_fy': 'Last FY',
    };
    return labels[selectedTimeRange] || 'This Month';
  };

  const timeLabel = getTimeRangeLabel();ashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${theme.isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Manager Dashboard
            </h1>
            <p className={`text-sm mt-1 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time overview of your manufacturing operations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Filter Button */}
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ripple={true}
                variant="filled"
                color="gray"
                className="flex items-center gap-2 !bg-slate-800 hover:!bg-slate-700 shadow-md hover:shadow-lg normal-case text-sm font-medium"
              >
                {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select Range'}
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Animated Dropdown Menu */}
              <ul
                role="menu"
                className={`absolute right-0 mt-2 min-w-[220px] overflow-hidden rounded-lg border p-1.5 shadow-lg z-50 transition-all duration-200 origin-top-right
                  ${theme.isDark 
                    ? 'border-slate-600 bg-slate-700' 
                    : 'border-slate-200 bg-white'}
                  ${isDropdownOpen 
                    ? 'opacity-100 scale-100 visible' 
                    : 'opacity-0 scale-95 invisible'}
                `}
              >
                {timeRangeOptions.map((option) => (
                  <li
                    key={option.value}
                    role="menuitem"
                    onClick={() => {
                      setSelectedTimeRange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer flex w-full text-sm items-center rounded-md p-3 transition-all
                      ${selectedTimeRange === option.value
                        ? `${theme.isDark 
                            ? 'bg-slate-600 text-white font-medium' 
                            : 'bg-slate-100 text-slate-900 font-medium'}`
                        : `${theme.isDark 
                            ? 'text-slate-300 hover:bg-slate-600' 
                            : 'text-slate-800 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100'}`
                      }
                    `}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last Updated */}
            <div className={`text-right text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>Last updated</p>
              <p className="font-medium">
                {new Date(dashboardData.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Open Orders"
          value={kpis.totalOpenOrders}
          format="number"
          sparklineData={kpis.trends?.openOrders}
          sparklineColor="#3b82f6"
          sparklineType="bar"
          color="blue"
        />
        <KPICard
          title="Open Order Value"
          value={kpis.totalOpenValue}
          format="currency"
          sparklineData={kpis.trends?.openValue}
          sparklineColor="#10b981"
          sparklineType="area"
          color="green"
        />
        <KPICard
          title="Work Hours Pending"
          value={kpis.totalOpenWorkHours}
          format="hours"
          sparklineData={kpis.trends?.workHours}
          sparklineColor="#8b5cf6"
          sparklineType="line"
          color="purple"
        />
        <KPICard
          title="Attention Required"
          value={kpis.ordersRequiringAttention}
          format="number"
          sparklineData={kpis.trends?.attentionRequired}
          sparklineColor={kpis.ordersRequiringAttention > 0 ? '#ef4444' : '#10b981'}
          sparklineType="bar"
          color={kpis.ordersRequiringAttention > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Components at Risk"
          value={kpis.componentsAtRisk}
          format="number"
          sparklineData={kpis.trends?.componentsAtRisk}
          sparklineColor={kpis.componentsAtRisk > 0 ? '#f59e0b' : '#10b981'}
          sparklineType="bar"
          color={kpis.componentsAtRisk > 0 ? 'yellow' : 'green'}
        />
        <KPICard
          title="Avg. Turnaround"
          value={kpis.averageTurnaroundDays}
          format="days"
          sparklineData={kpis.trends?.turnaroundDays}
          sparklineColor="#3b82f6"
          sparklineType="line"
          color="blue"
        />
            <KPICard
              title={`Completed ${timeLabel}`}
              value={kpis.completedThisMonth}
              format="number"
              sparklineData={kpis.trends?.completedMonthly}
              sparklineColor="#10b981"
              sparklineType="bar"
              color="green"
            />
            <KPICard
              title={`Revenue ${timeLabel}`}
              value={kpis.revenueThisMonth}
              format="currency"
              sparklineData={kpis.trends?.revenueMonthly}
              sparklineColor="#10b981"
              sparklineType="area"
              color="green"
            />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Monthly Revenue Trend"
          subtitle="Revenue from despatched orders"
          data={monthlyTrends.map(t => t.revenue)}
          categories={monthlyTrends.map(t => t.month)}
          icon={<ChartBarIcon className="h-6 w-6" />}
          formatValue={(val) => `$${val.toLocaleString()}`}
        />
        <MultipleBarChart
          title="Orders: Received vs Despatched"
          subtitle="Compare incoming orders with completed deliveries"
          series={[
            { 
              name: 'Orders Received', 
              data: monthlyTrends.map(t => t.ordersReceived),
            },
            { 
              name: 'Orders Despatched', 
              data: monthlyTrends.map(t => t.ordersDespatched),
            }
          ]}
          categories={monthlyTrends.map(t => t.month)}
          icon={<ShoppingCartIcon className="h-6 w-6" />}
        />
      </div>

      {/* Radial Chart and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RadialBarChart
          title="Order Status Distribution"
          subtitle="Current active orders by status"
          data={poStatusDistribution.map(s => s.count)}
          labels={poStatusDistribution.map(s => s.status)}
          icon={<ChartBarIcon className="h-6 w-6" />}
          despatchedCount={completedOrdersTotal}
        />
        <TopItemsCard
          title="Top Customers"
          items={topCustomers}
          type="customers"
          theme={theme}
        />
        <TopItemsCard
          title="Top Products"
          items={topProducts}
          type="products"
          theme={theme}
        />
      </div>

      {/* Activity and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard activities={recentActivity} theme={theme} />
        <LowStockAlerts alerts={lowStockAlerts} theme={theme} />
      </div>
    </div>
  );
}