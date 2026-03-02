//src/components/ui/Input.tsx

import React, { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error = false, containerClassName = "", className = "", ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col", containerClassName)}>
        {label && (
          <label
            className={clsx(
              "mb-1 font-medium text-sm select-none",
              error ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={clsx(
            "w-full px-3 py-2 rounded-lg border transition-all duration-200",
            "bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-700",
            className
          )}
        />

        {helperText && (
          <p
            className={clsx(
              "mt-1 text-xs select-none",
              error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";