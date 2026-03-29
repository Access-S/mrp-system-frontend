// src/features/dashboard/components/charts/RadialBarChart.tsx

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { useTheme } from '@/contexts/ThemeContext';

interface RadialBarChartProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels: string[];
  icon?: React.ReactNode;
  colors?: string[];
  height?: number;
  despatchedCount?: number;
}

export function RadialBarChart({
  title,
  subtitle,
  data,
  labels,
  icon,
  colors,
  height = 320,
  despatchedCount
}: RadialBarChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const defaultColors = theme.isDark
      ? ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171', '#fb923c', '#94a3b8', '#f472b6']
      : ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#f97316', '#64748b', '#ec4899'];

    const chartColors = colors || defaultColors.slice(0, data.length);

    const chartConfig: ApexCharts.ApexOptions = {
      series: data,
      chart: {
        type: 'donut',
        height: height,
        background: 'transparent',
      },
      labels: labels,
      colors: chartColors,
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                color: theme.isDark ? '#e2e8f0' : '#1e293b',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: theme.isDark ? '#e2e8f0' : '#1e293b',
                offsetY: 0,
                formatter: function(val: string) {
                  return val;
                }
              },
              total: {
                show: true,
                label: 'Active',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.isDark ? '#94a3b8' : '#64748b',
                formatter: function(w: any) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                }
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'inherit',
        labels: {
          colors: theme.isDark ? '#94a3b8' : '#64748b',
        },
        markers: {
          width: 10,
          height: 10,
          radius: 2,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 4,
        },
        formatter: function(seriesName: string, opts: any) {
          return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
      stroke: {
        show: false,
      },
      grid: {
        padding: {
          bottom: -80,
        }
      },
      tooltip: {
        enabled: true,
        theme: theme.isDark ? 'dark' : 'light',
        y: {
          formatter: function(val: number) {
            return `${val} orders`;
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 280,
            },
            legend: {
              fontSize: '11px',
            },
          },
        },
      ],
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
  }, [data, labels, colors, theme.isDark, height]);

  return (
    <div className={`relative flex flex-col rounded-xl ${theme.isDark ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
      {/* Header */}
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

      {/* Chart */}
      <div className="py-4 px-2 flex-1">
        <div ref={chartRef}></div>
      </div>

      {/* Despatched Footer - Simple black bar */}
      {despatchedCount !== undefined && (
        <div className="mx-4 mb-4">
          <div className="bg-gray-900 rounded-md px-4 py-2">
            <span className="text-white text-sm font-semibold">
              Despatched/ Completed: {despatchedCount.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}