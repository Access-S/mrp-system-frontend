import React, { InputHTMLAttributes, useState } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  className?: string;
}

/**
 * Reusable Input Component
 * Features:
 * - Tailwind-only styling
 * - Dark mode support
 * - Ripple/focus effect on focus
 * - Optional helper/error text
 */
export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={clsx('flex flex-col', className)}>
      {label && (
        <label
          className={clsx(
            'mb-1 font-medium text-sm select-none',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={clsx(
            'w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-1',
            'transition-colors duration-300 ease-in-out',
            isFocused ? 'ring-blue-500 dark:ring-blue-400' : '',
            error
              ? 'border-red-600 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
            'focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)] dark:focus:shadow-[0_0_0_3px_rgba(59,130,246,0.4)]',
            'relative overflow-hidden', // for ripple
          )}
        />

        {/* Ripple Effect */}
        {isFocused && (
          <span className="absolute inset-0 pointer-events-none animate-ripple rounded-md bg-blue-200 dark:bg-blue-400/20"></span>
        )}
      </div>

      {helperText && (
        <p
          className={clsx(
            'mt-1 text-xs select-none',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};