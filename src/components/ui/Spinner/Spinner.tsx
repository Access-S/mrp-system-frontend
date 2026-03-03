// src/components/ui/Spinner/Spinner.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "primary" | "secondary" | "white" | "current";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
  showLabel?: boolean;
  fullScreen?: boolean;
  overlay?: boolean;
}

// ============== BLOCK 3: Style Definitions ==============

const sizeStyles: Record<SpinnerSize, { spinner: string; border: string; label: string }> = {
  xs: { spinner: "w-3 h-3", border: "border-[2px]", label: "text-xs" },
  sm: { spinner: "w-4 h-4", border: "border-2", label: "text-xs" },
  md: { spinner: "w-6 h-6", border: "border-2", label: "text-sm" },
  lg: { spinner: "w-8 h-8", border: "border-[3px]", label: "text-sm" },
  xl: { spinner: "w-12 h-12", border: "border-4", label: "text-base" },
};

const variantStyles: Record<SpinnerVariant, string> = {
  primary: "border-blue-600 border-t-transparent",
  secondary: "border-gray-600 dark:border-gray-400 border-t-transparent",
  white: "border-white border-t-transparent",
  current: "border-current border-t-transparent",
};

// ============== BLOCK 4: Component ==============

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
  label = "Loading...",
  showLabel = false,
  fullScreen = false,
  overlay = false,
}) => {
  const spinnerElement = (
    <div
      className={clsx(
        "animate-spin rounded-full",
        sizeStyles[size].spinner,
        sizeStyles[size].border,
        variantStyles[variant],
        className
      )}
      role="status"
      aria-label={label}
    />
  );

  // With label
  if (showLabel) {
    return (
      <div className="flex flex-col items-center gap-2">
        {spinnerElement}
        <span
          className={clsx(
            sizeStyles[size].label,
            "text-gray-600 dark:text-gray-400"
          )}
        >
          {label}
        </span>
      </div>
    );
  }

  // Full screen with overlay
  if (fullScreen || overlay) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center",
          fullScreen && "fixed inset-0 z-50",
          overlay && "bg-black/50 dark:bg-black/70"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          {spinnerElement}
          {showLabel && (
            <span
              className={clsx(
                sizeStyles[size].label,
                overlay ? "text-white" : "text-gray-600 dark:text-gray-400"
              )}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  return spinnerElement;
};

// ============== BLOCK 5: Preset Components ==============

// Inline spinner for buttons
export const SpinnerInline: React.FC<{ className?: string }> = ({ className }) => (
  <Spinner size="xs" variant="current" className={className} />
);

// Page loading spinner
export const SpinnerPage: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Spinner size="lg" showLabel label={label} />
  </div>
);

// Full screen loading overlay
export const SpinnerOverlay: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <Spinner size="xl" fullScreen overlay showLabel label={label} />
);

// ============== BLOCK 6: Display Name ==============

Spinner.displayName = "Spinner";

export default Spinner;