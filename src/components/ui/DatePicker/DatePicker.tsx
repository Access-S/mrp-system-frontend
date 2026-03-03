// src/components/ui/DatePicker/DatePicker.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// ============== BLOCK 2: Types ==============

type DatePickerSize = "sm" | "md" | "lg";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  size?: DatePickerSize;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  fullWidth?: boolean;
}

// ============== BLOCK 3: Constants ==============

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ============== BLOCK 4: Size Styles ==============

const sizeStyles: Record<DatePickerSize, { input: string; label: string; icon: string }> = {
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

// ============== BLOCK 5: Helper Functions ==============

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatDisplayDate = (dateString: string): string => {
  const date = parseDate(dateString);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============== BLOCK 6: Component ==============

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value = "",
  onChange,
  placeholder = "Select a date",
  size = "md",
  error = false,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  className,
  fullWidth = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = parseDate(value) || new Date();
    return date.getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const date = parseDate(value) || new Date();
    return date.getFullYear();
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const styles = sizeStyles[size];

  // ============== BLOCK 7: Event Handlers ==============

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      if (!isOpen) {
        event.preventDefault();
        setIsOpen(true);
      }
    }
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onChange(formatDate(selectedDate));
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  // ============== BLOCK 8: Date Validation ==============

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    const selectedDate = parseDate(value);
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // ============== BLOCK 9: Generate Calendar Days ==============

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // ============== BLOCK 10: Render ==============

  return (
    <div
      ref={containerRef}
      className={clsx("flex flex-col", fullWidth ? "w-full" : "min-w-[200px]", className)}
    >
      {/* Label */}
      {label && (
        <label
          className={clsx(
            "font-medium select-none",
            styles.label,
            error ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Trigger */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={clsx(
            "w-full flex items-center justify-between gap-2",
            "rounded-lg cursor-pointer",
            "transition-all duration-200",
            "outline-none",
            "bg-white dark:bg-gray-800",
            "border border-gray-300 dark:border-gray-600",
            styles.input,
            isOpen && "ring-2 ring-blue-500/20 border-blue-500",
            error && "border-red-500 dark:border-red-500",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
          )}
        >
          <span
            className={clsx(
              "flex-1 truncate",
              value
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
          <CalendarIcon
            className={clsx(styles.icon, "text-gray-500 dark:text-gray-400 flex-shrink-0")}
          />
        </div>

        {/* Calendar Dropdown */}
        <div
          className={clsx(
            "absolute z-50 mt-1 w-full min-w-[280px]",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "rounded-lg shadow-lg",
            "p-4",
            "transition-all duration-200 ease-out",
            "transform origin-top",
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className={clsx(
                "p-1.5 rounded-lg",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-150"
              )}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {MONTHS[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className={clsx(
                "p-1.5 rounded-lg",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "transition-colors duration-150"
              )}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <div key={index} className="aspect-square">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => !isDateDisabled(day) && handleSelectDate(day)}
                    disabled={isDateDisabled(day)}
                    className={clsx(
                      "w-full h-full flex items-center justify-center",
                      "text-sm rounded-lg",
                      "transition-colors duration-150",
                      isSelected(day)
                        ? "bg-blue-600 text-white font-semibold"
                        : isToday(day)
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                      isDateDisabled(day) && "opacity-30 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
                onChange(formatDate(today));
                setIsOpen(false);
              }}
              className={clsx(
                "w-full py-2 text-sm font-medium",
                "text-blue-600 dark:text-blue-400",
                "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                "rounded-lg transition-colors duration-150"
              )}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p
          className={clsx(
            "mt-1.5 text-xs select-none",
            error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

// ============== BLOCK 11: Display Name ==============

DatePicker.displayName = "DatePicker";

export default DatePicker;