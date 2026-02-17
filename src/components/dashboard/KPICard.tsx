// src/components/dashboard/KPICard.tsx

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'number' | 'currency' | 'hours' | 'days' | 'percent';
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  format = 'number',
  icon,
  trend,
  color = 'blue',
  onClick
}: KPICardProps) {
  const { theme } = useTheme();
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += stepValue;
      
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'hours':
        return `${val.toFixed(1)} hrs`;
      case 'days':
        return `${val.toFixed(1)} days`;
      case 'percent':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
  };

  const colorClasses = {
    blue: {
      bg: theme.isDark ? 'bg-blue-900/30' : 'bg-blue-50',
      icon: theme.isDark ? 'bg-blue-600' : 'bg-blue-500',
      text: theme.isDark ? 'text-blue-400' : 'text-blue-600',
    },
    green: {
      bg: theme.isDark ? 'bg-green-900/30' : 'bg-green-50',
      icon: theme.isDark ? 'bg-green-600' : 'bg-green-500',
      text: theme.isDark ? 'text-green-400' : 'text-green-600',
    },
    yellow: {
      bg: theme.isDark ? 'bg-yellow-900/30' : 'bg-yellow-50',
      icon: theme.isDark ? 'bg-yellow-600' : 'bg-yellow-500',
      text: theme.isDark ? 'text-yellow-400' : 'text-yellow-600',
    },
    red: {
      bg: theme.isDark ? 'bg-red-900/30' : 'bg-red-50',
      icon: theme.isDark ? 'bg-red-600' : 'bg-red-500',
      text: theme.isDark ? 'text-red-400' : 'text-red-600',
    },
    purple: {
      bg: theme.isDark ? 'bg-purple-900/30' : 'bg-purple-50',
      icon: theme.isDark ? 'bg-purple-600' : 'bg-purple-500',
      text: theme.isDark ? 'text-purple-400' : 'text-purple-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6 shadow-md transition-all duration-300
        ${theme.isDark ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:shadow-lg'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${colors.bg} opacity-50`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold ${theme.isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {formatValue(displayValue)}
          </p>
          
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              <svg
                className={`h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
              <span className={theme.isDark ? 'text-slate-500' : 'text-slate-400'}>vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.icon} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}