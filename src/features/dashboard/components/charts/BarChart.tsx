// src/features/dashboard/components/charts/BarChart.tsx

// ============== BLOCK 1: Imports ==============

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import ApexCharts from 'apexcharts';
import { useTheme } from '@/contexts/ThemeContext';

// ============== BLOCK 2: Types & Interfaces ==============

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  categories: string[];
  icon?: React.ReactNode;
  color?: string;
  height?: number;
  formatValue?: (value: number) => string;
}

interface MultipleBarChartProps {
  title: string;
  subtitle?: string;
  series: { name: string; data: number[]; color?: string }[];
  categories: string[];
  icon?: React.ReactNode;
  height?: number;
  formatValue?: (value: number) => string;
}

// ============== BLOCK 3: Debug Helper ==============

const DEBUG_CHARTS = true; // Set to false to disable logging

const debugLog = (chartTitle: string, message: string, data?: any) => {
  if (!DEBUG_CHARTS) return;
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
  console.log(`[${timestamp}] 📊 ${chartTitle}: ${message}`, data || '');
};

// ============== BLOCK 4: Single Bar Chart ==============

export const BarChart = React.memo(function BarChart({
  title,
  subtitle,
  data,
  categories,
  icon,
  color = '#020617',
  height = 240,
  formatValue
}: BarChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);
  const renderCount = useRef(0);

  // Track renders
  renderCount.current += 1;
  debugLog(title, `Component render #${renderCount.current}`);

  // Memoize the formatter to prevent unnecessary re-renders
  const stableFormatValue = useCallback(
    (val: number) => {
      return formatValue ? formatValue(val) : val.toString();
    },
    []
  );

  // Memoize data arrays to detect actual changes
  const dataKey = useMemo(() => JSON.stringify(data), [data]);
  const categoriesKey = useMemo(() => JSON.stringify(categories), [categories]);

  useEffect(() => {
    if (!chartRef.current) return;

    debugLog(title, 'useEffect triggered - Creating/Updating chart', {
      dataLength: data.length,
      categoriesLength: categories.length,
      isDark: theme.isDark,
    });

    const chartConfig: ApexCharts.ApexOptions = {
      series: [
        {
          name: title,
          data: data,
        },
      ],
      chart: {
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 300,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [theme.isDark ? '#60a5fa' : color],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 4,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: theme.isDark ? '#94a3b8' : '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
        categories: categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.isDark ? '#94a3b8' : '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
          formatter: stableFormatValue,
        },
      },
      grid: {
        show: true,
        borderColor: theme.isDark ? '#334155' : '#e2e8f0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.9,
      },
      tooltip: {
        theme: theme.isDark ? 'dark' : 'light',
        y: {
          formatter: stableFormatValue,
        },
      },
    };

    if (chartInstance.current) {
      debugLog(title, 'Destroying previous chart instance');
      chartInstance.current.destroy();
    }

    debugLog(title, 'Creating new chart instance');
    chartInstance.current = new ApexCharts(chartRef.current, chartConfig);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        debugLog(title, 'Cleanup - Destroying chart instance');
        chartInstance.current.destroy();
      }
    };
  }, [dataKey, categoriesKey, theme.isDark, color, height, title, stableFormatValue]);

  return (
    <div className={`relative flex flex-col rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
      <div className="relative mx-4 mt-4 flex flex-col gap-4 overflow-hidden rounded-none bg-transparent md:flex-row md:items-center">
        {icon && (
          <div className={`w-max rounded-lg ${theme.isDark ? 'bg-blue-600' : 'bg-gray-900'} p-5 text-white`}>
            {icon}
          </div>
        )}
        <div>
          <h6 className={`block font-sans text-base font-semibold leading-relaxed tracking-normal ${theme.isDark ? 'text-slate-200' : 'text-blue-gray-900'}`}>
            {title}
          </h6>
          {subtitle && (
            <p className={`block max-w-sm font-sans text-sm font-normal leading-normal ${theme.isDark ? 'text-slate-400' : 'text-gray-700'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="pt-6 px-2 pb-4">
        <div ref={chartRef}></div>
      </div>
    </div>
  );
});

// ============== BLOCK 5: Multiple Bar Chart ==============

export const MultipleBarChart = React.memo(function MultipleBarChart({
  title,
  subtitle,
  series,
  categories,
  icon,
  height = 280,
  formatValue
}: MultipleBarChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);
  const renderCount = useRef(0);

  // Track renders
  renderCount.current += 1;
  debugLog(title, `Component render #${renderCount.current}`);

  // Memoize the formatter to prevent unnecessary re-renders
  const stableFormatValue = useCallback(
    (val: number) => {
      return formatValue ? formatValue(val) : Math.round(val).toString();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Memoize data arrays to detect actual changes
  const seriesKey = useMemo(() => JSON.stringify(series), [series]);
  const categoriesKey = useMemo(() => JSON.stringify(categories), [categories]);

  useEffect(() => {
    if (!chartRef.current) return;

    debugLog(title, 'useEffect triggered - Creating/Updating chart', {
      seriesCount: series.length,
      categoriesLength: categories.length,
      isDark: theme.isDark,
    });

    // Default colors: Blue for Received, Green for Despatched
    const defaultColors = theme.isDark 
      ? ['#60a5fa', '#34d399']  // Light blue, Light green (dark mode)
      : ['#020617', '#10b981']; // Dark gray, Green (light mode)

    const chartConfig: ApexCharts.ApexOptions = {
      series: series.map((s) => ({
        name: s.name,
        data: s.data,
      })),
      chart: {
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 300,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      colors: series.map((s, index) => s.color || defaultColors[index] || defaultColors[0]),
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: theme.isDark ? '#94a3b8' : '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
        },
        categories: categories,
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.isDark ? '#94a3b8' : '#616161',
            fontSize: '12px',
            fontFamily: 'inherit',
            fontWeight: 400,
          },
          formatter: stableFormatValue,
        },
      },
      grid: {
        show: true,
        borderColor: theme.isDark ? '#334155' : '#e2e8f0',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: theme.isDark ? '#94a3b8' : '#616161',
        },
        markers: {
          width: 12,
          height: 12,
          radius: 3,
        },
      },
      tooltip: {
        theme: theme.isDark ? 'dark' : 'light',
        y: {
          formatter: stableFormatValue,
        },
      },
    };

    if (chartInstance.current) {
      debugLog(title, 'Destroying previous chart instance');
      chartInstance.current.destroy();
    }

    debugLog(title, 'Creating new chart instance');
    chartInstance.current = new ApexCharts(chartRef.current, chartConfig);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        debugLog(title, 'Cleanup - Destroying chart instance');
        chartInstance.current.destroy();
      }
    };
  }, [seriesKey, categoriesKey, theme.isDark, height, title, series, stableFormatValue]);

  return (
    <div className={`relative flex flex-col rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
      <div className="relative mx-4 mt-4 flex flex-col gap-4 overflow-hidden rounded-none bg-transparent md:flex-row md:items-center">
        {icon && (
          <div className={`w-max rounded-lg ${theme.isDark ? 'bg-blue-600' : 'bg-gray-900'} p-5 text-white`}>
            {icon}
          </div>
        )}
        <div>
          <h6 className={`block font-sans text-base font-semibold leading-relaxed tracking-normal ${theme.isDark ? 'text-slate-200' : 'text-blue-gray-900'}`}>
            {title}
          </h6>
          {subtitle && (
            <p className={`block max-w-sm font-sans text-sm font-normal leading-normal ${theme.isDark ? 'text-slate-400' : 'text-gray-700'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="pt-6 px-2 pb-4">
        <div ref={chartRef}></div>
      </div>
    </div>
  );
});

// ============== BLOCK 6: Exports ==============

export default BarChart;