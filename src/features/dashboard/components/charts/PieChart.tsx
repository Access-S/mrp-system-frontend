// src/features/dashboard/components/charts/PieChart.tsx

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { useTheme } from '@/contexts/ThemeContext';

interface PieChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels: string[];
  icon?: React.ReactNode;
  colors?: string[];
  size?: number;
}

export function PieChart({
  title,
  subtitle,
  data,
  labels,
  icon,
  colors = ['#020617', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  size = 280
}: PieChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartConfig: ApexCharts.ApexOptions = {
      series: data,
      chart: {
        type: 'donut',
        width: size,
        height: size,
        toolbar: {
          show: false,
        },
        background: 'transparent',
      },
      labels: labels,
      dataLabels: {
        enabled: false,
      },
      colors: theme.isDark 
        ? ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa']
        : colors,
      legend: {
        show: true,
        position: 'bottom',
        labels: {
          colors: theme.isDark ? '#94a3b8' : '#616161',
        },
        markers: {
          width: 12,
          height: 12,
          radius: 3,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: theme.isDark ? '#e2e8f0' : '#1e293b',
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 600,
                color: theme.isDark ? '#e2e8f0' : '#1e293b',
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                color: theme.isDark ? '#94a3b8' : '#64748b',
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                },
              },
            },
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: [theme.isDark ? '#1e293b' : '#ffffff'],
      },
      tooltip: {
        theme: theme.isDark ? 'dark' : 'light',
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ApexCharts(chartRef.current, chartConfig);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, theme.isDark, colors, size]);

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
      <div className="py-6 mt-4 grid place-items-center px-2">
        <div ref={chartRef}></div>
      </div>
    </div>
  );
}