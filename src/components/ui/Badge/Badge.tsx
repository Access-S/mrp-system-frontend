// src/components/ui/Badge/Badge.tsx

// ============== BLOCK 1: Imports ==============

import React, { HTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type BadgeVariant = "solid" | "outline" | "subtle";
type BadgeColor = "gray" | "primary" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

// ============== BLOCK 3: Style Definitions ==============

const baseStyles = clsx(
  "inline-flex items-center justify-center gap-1",
  "font-medium rounded-full",
  "transition-colors duration-200"
);

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-sm",
  lg: "px-3 py-1 text-sm",
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
};

const variantColorStyles: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    gray: "bg-gray-600 text-white dark:bg-gray-500",
    primary: "bg-blue-600 text-white dark:bg-blue-500",
    success: "bg-green-600 text-white dark:bg-green-500",
    warning: "bg-yellow-500 text-white dark:bg-yellow-400",
    error: "bg-red-600 text-white dark:bg-red-500",
  },
  outline: {
    gray: "border border-gray-400 text-gray-700 dark:border-gray-500 dark:text-gray-300",
    primary: "border border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400",
    success: "border border-green-500 text-green-600 dark:border-green-400 dark:text-green-400",
    warning: "border border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400",
    error: "border border-red-500 text-red-600 dark:border-red-400 dark:text-red-400",
  },
  subtle: {
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    primary: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

const dotColorStyles: Record<BadgeColor, string> = {
  gray: "bg-current",
  primary: "bg-current",
  success: "bg-current",
  warning: "bg-current",
  error: "bg-current",
};

// ============== BLOCK 4: Component ==============

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "subtle",
      color = "gray",
      size = "md",
      dot = false,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    // ============== BLOCK 5: Render ==============

    return (
      <span
        ref={ref}
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantColorStyles[variant][color],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              "rounded-full",
              dotSizeStyles[size],
              dotColorStyles[color]
            )}
            aria-hidden="true"
          />
        )}

        {!dot && icon && <span className="flex-shrink-0">{icon}</span>}

        {children && <span>{children}</span>}
      </span>
    );
  }
);

// ============== BLOCK 6: Display Name ==============

Badge.displayName = "Badge";

export default Badge;