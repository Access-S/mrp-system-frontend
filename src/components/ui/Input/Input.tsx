// src/components/ui/Input/Input.tsx

// ============== BLOCK 1: Imports ==============

import React, { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  fullWidth?: boolean;
}

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<InputSize, { input: string; label: string; icon: string }> = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    label: "text-xs mb-1",
    icon: "w-4 h-4",
  },
  md: {
    input: "px-4 py-2.5 text-sm",
    label: "text-sm mb-1.5",
    icon: "w-5 h-5",
  },
  lg: {
    input: "px-4 py-3 text-base",
    label: "text-base mb-2",
    icon: "w-5 h-5",
  },
};

// ============== BLOCK 4: Variant Styles ==============

const variantStyles: Record<InputVariant, { base: string; focus: string }> = {
  default: {
    base: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
    focus: "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
  },
  filled: {
    base: "bg-gray-100 dark:bg-gray-700 border border-transparent",
    focus: "focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
  },
};

// ============== BLOCK 5: Component ==============

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      size = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      containerClassName = "",
      fullWidth = true,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const variantStyle = variantStyles[variant];

    return (
      <div className={clsx("flex flex-col", fullWidth && "w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={clsx(
              "font-medium select-none",
              styles.label,
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <span
              className={clsx(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "text-gray-500 dark:text-gray-400",
                "pointer-events-none",
                styles.icon
              )}
            >
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={clsx(
              "w-full rounded-lg transition-all duration-200",
              "text-gray-900 dark:text-gray-100",
              "placeholder-gray-400 dark:placeholder-gray-500",
              "focus:outline-none",
              variantStyle.base,
              variantStyle.focus,
              styles.input,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500",
              disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700",
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <span
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "text-gray-500 dark:text-gray-400",
                styles.icon
              )}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p
            className={clsx(
              "mt-1.5 text-xs select-none",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// ============== BLOCK 6: Display Name ==============

Input.displayName = "Input";

export default Input;