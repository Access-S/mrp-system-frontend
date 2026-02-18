// src/components/dashboard/charts/RadialBarChart.tsx

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { useTheme } from '../../../contexts/ThemeContext';

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
  height = 350,
  despatchedCount
}: RadialBarChartProps) {
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const maxValue = Math.max(...data);
    const percentages = maxValue > 0 
      ? data.map(val => Math.round((val / maxValue) * 100))
      : data.map(() => 0);

    const defaultColors = theme.isDark
      ? ['#34d399', '#60a5fa', '#a78bfa', '#fbbf24', '#f87171', '#fb923c', '#94a3b8', '#f472b6']
      : ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#f97316', '#64748b', '#ec4899'];

    const chartColors = colors || defaultColors.slice(0, data.length);

    const chartConfig: ApexCharts.ApexOptions = {
      series: percentages,
      chart: {
        height: height,
        type: 'radialBar',
        background: 'transparent',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
          },
          track: {
            background: theme.isDark ? '#334155' : '#e2e8f0',
            strokeWidth: '100%',
            margin: 6,  // Add space between tracks
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: 30,  // ← Increased from -8 to 30 (pushes labels further right)
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            formatter: function(seriesName: string, opts: any) {
              const index = opts.seriesIndex;
              const actualValue = data[index];
              return `${seriesName}: ${actualValue}`;
            },
          },
        },
      },
      colors: chartColors,
      labels: labels,
      legend: {
        show: false,
      },
      stroke: {
        lineCap: 'round',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 280,
            },
            plotOptions: {
              radialBar: {
                barLabels: {
                  fontSize: '12px',
                },
              },
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