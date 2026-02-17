// src/components/dashboard/charts/BarChart.tsx

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { useTheme } from '../../../contexts/ThemeContext';

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

export function BarChart({
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

  useEffect(() => {
    if (!chartRef.current) return;

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
          formatter: formatValue || ((val) => val.toString()),
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
          formatter: formatValue || ((val) => val.toString()),
        },
      },
    };

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new ApexCharts(chartRef.current, chartConfig);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, categories, theme.isDark, color, height, title, formatValue]);

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
}