// src/components/ui/Select/Select.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    SelectHTMLAttributes,
    forwardRef,
    useRef,
    useImperativeHandle,
  } from "react";
  import clsx from "clsx";
  import { ChevronDownIcon } from "@heroicons/react/24/outline";
  
  // ============== BLOCK 2: Types & Interfaces ==============
  
  type SelectVariant = "default" | "filled";
  type SelectSize = "sm" | "md" | "lg";
  
  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
  
  interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    variant?: SelectVariant;
    size?: SelectSize;
    error?: boolean;
    helperText?: string;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    fullWidth?: boolean;
  }
  
  // ============== BLOCK 3: Style Definitions ==============
  
  const sizeStyles: Record<SelectSize, { select: string; icon: string; label: string }> = {
    sm: {
      select: "px-3 py-1.5 text-sm pr-8",
      icon: "w-4 h-4 right-2",
      label: "text-xs mb-1",
    },
    md: {
      select: "px-4 py-2.5 text-sm pr-10",
      icon: "w-5 h-5 right-3",
      label: "text-sm mb-1.5",
    },
    lg: {
      select: "px-4 py-3 text-base pr-12",
      icon: "w-5 h-5 right-4",
      label: "text-base mb-2",
    },
  };
  
  const variantStyles: Record<SelectVariant, { base: string; focus: string }> = {
    default: {
      base: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
      focus: "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    },
    filled: {
      base: "bg-gray-100 dark:bg-gray-700 border border-transparent",
      focus: "focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    },
  };
  
  // ============== BLOCK 4: Component Definition ==============
  
  export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
      {
        label,
        options,
        placeholder = "Select an option",
        variant = "default",
        size = "md",
        error = false,
        helperText,
        loading = false,
        leftIcon,
        fullWidth = false,
        disabled,
        className,
        value,
        ...props
      },
      ref
    ) => {
      const internalRef = useRef<HTMLSelectElement>(null);
      useImperativeHandle(ref, () => internalRef.current!);
  
      const isDisabled = disabled || loading;
  
      // ============== BLOCK 5: Base Styles ==============
  
      const baseSelectStyles = clsx(
        "appearance-none",
        "rounded-lg",
        "transition-all duration-200",
        "outline-none",
        "cursor-pointer",
        "text-gray-900 dark:text-gray-100",
        variantStyles[variant].base,
        variantStyles[variant].focus,
        sizeStyles[size].select,
        leftIcon && "pl-10",
        fullWidth ? "w-full" : "min-w-[200px]",
        error && "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20",
        isDisabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
      );
  
      // ============== BLOCK 6: Render ==============
  
      return (
        <div className={clsx("flex flex-col", fullWidth && "w-full")}>
          {/* Label */}
          {label && (
            <label
              className={clsx(
                sizeStyles[size].label,
                "font-medium",
                "text-gray-700 dark:text-gray-300",
                error && "text-red-500 dark:text-red-400"
              )}
            >
              {label}
            </label>
          )}
  
          {/* Select Wrapper */}
          <div className="relative">
            {/* Left Icon */}
            {leftIcon && (
              <span
                className={clsx(
                  "absolute left-3 top-1/2 -translate-y-1/2",
                  "text-gray-500 dark:text-gray-400",
                  "pointer-events-none"
                )}
              >
                {leftIcon}
              </span>
            )}
  
            {/* Select Element */}
            <select
              ref={internalRef}
              disabled={isDisabled}
              value={value}
              className={clsx(baseSelectStyles, className)}
              {...props}
            >
              {/* Placeholder Option */}
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
  
              {/* Options */}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
  
            {/* Dropdown Icon / Loading Spinner */}
            <span
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                sizeStyles[size].icon,
                "text-gray-500 dark:text-gray-400"
              )}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <ChevronDownIcon className="w-full h-full" />
              )}
            </span>
          </div>
  
          {/* Helper Text */}
          {helperText && (
            <span
              className={clsx(
                "mt-1.5 text-xs",
                error
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              {helperText}
            </span>
          )}
        </div>
      );
    }
  );
  
  // ============== BLOCK 7: Display Name ==============
  
  Select.displayName = "Select";
  
  export default Select;