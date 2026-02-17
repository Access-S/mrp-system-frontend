import React, { useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  theme: any;
  placeholder?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  required = false,
  theme,
  placeholder = "Select a date...",
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Initialize Flatpickr
    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      defaultDate: value || undefined,
      onChange: (selectedDates, dateStr) => {
        onChange(dateStr);
      },
    });

    // Apply custom styling to the calendar
    const fp = fpRef.current;
    if (fp.calendarContainer) {
      const calendarContainer = fp.calendarContainer;
      const calendarMonthNav = fp.monthNav;
      const calendarNextMonthNav = fp.nextMonthNav;
      const calendarPrevMonthNav = fp.prevMonthNav;
      const calendarDaysContainer = fp.daysContainer;

      // Base calendar styling
      calendarContainer.classList.add(
        "!bg-white", "dark:!bg-slate-800",
        "!p-4", "!border", "!border-blue-gray-50", "dark:!border-slate-600",
        "!rounded-lg", "!shadow-lg", "!shadow-blue-gray-500/10",
        "!font-sans", "!text-sm", "!font-normal",
        "!text-blue-gray-500", "dark:!text-slate-300"
      );

      // Month navigation styling
      if (calendarMonthNav) {
        calendarMonthNav.classList.add(
          "!flex", "!items-center", "!justify-between", "!mb-4"
        );
      }

      // Next/Prev buttons styling
      if (calendarNextMonthNav) {
        calendarNextMonthNav.classList.add(
          "!h-6", "!w-6", "!bg-transparent",
          "hover:!bg-blue-gray-50", "dark:hover:!bg-slate-700",
          "!p-1", "!rounded-md", "!transition-colors", "!duration-300"
        );
      }

      if (calendarPrevMonthNav) {
        calendarPrevMonthNav.classList.add(
          "!h-6", "!w-6", "!bg-transparent",
          "hover:!bg-blue-gray-50", "dark:hover:!bg-slate-700",
          "!p-1", "!rounded-md", "!transition-colors", "!duration-300"
        );
      }

      // Days container styling
      if (calendarDaysContainer) {
        calendarDaysContainer.classList.add("flatpickr-days-custom");
      }
    }

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
      }
    };
  }, []);

  // Update flatpickr when value changes externally
  useEffect(() => {
    if (fpRef.current && value) {
      fpRef.current.setDate(value, false);
    }
  }, [value]);

  return (
    <div className="relative w-full min-w-[200px]">
      <input
        ref={inputRef}
        type="text"
        placeholder=" "
        readOnly
        className={`peer h-12 w-full rounded-lg border-2 bg-transparent px-4 py-3 font-sans text-sm font-medium outline-none transition-all cursor-pointer
          ${theme.isDark
            ? "border-slate-600 text-slate-200 placeholder-slate-500 focus:border-blue-500"
            : "border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500"
          }
          focus:ring-2 focus:ring-blue-500/20`}
      />
      <label
        className={`pointer-events-none absolute left-3 -top-2.5 px-1 text-xs font-bold uppercase tracking-wider transition-all
          ${theme.isDark 
            ? "bg-slate-900 text-slate-400" 
            : "bg-white text-slate-500"
          }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}