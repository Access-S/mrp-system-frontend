// src/components/forecasts/helpers.ts

// ============== BLOCK 1: Formatting ==============

/**
 * Formats a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

/**
 * Formats hours with 1 decimal place
 */
export const formatHours = (value: number): string => {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} hrs`;
};