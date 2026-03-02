// src/components/ui/Select/Select.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    forwardRef,
    useRef,
    useState,
    useEffect,
    useCallback,
  } from "react";
  import clsx from "clsx";
  import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
  
  // ============== BLOCK 2: Types & Interfaces ==============
  
  type SelectVariant = "default" | "filled";
  type SelectSize = "sm" | "md" | "lg";
  
  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
  
  interface SelectProps {
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
    disabled?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    name?: string;
  }
  
  // ============== BLOCK 3: Style Definitions ==============
  
  const sizeStyles: Record<SelectSize, { 
    trigger: string; 
    icon: string; 
    label: string;
    option: string;
  }> = {
    sm: {
      trigger: "px-3 py-1.5 text-sm",
      icon: "w-4 h-4",
      label: "text-xs mb-1",
      option: "px-3 py-1.5 text-sm",
    },
    md: {
      trigger: "px-4 py-2.5 text-sm",
      icon: "w-5 h-5",
      label: "text-sm mb-1.5",
      option: "px-4 py-2.5 text-sm",
    },
    lg: {
      trigger: "px-4 py-3 text-base",
      icon: "w-5 h-5",
      label: "text-base mb-2",
      option: "px-4 py-3 text-base",
    },
  };
  
  const variantStyles: Record<SelectVariant, { base: string; focus: string }> = {
    default: {
      base: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
      focus: "ring-2 ring-blue-500/20 border-blue-500",
    },
    filled: {
      base: "bg-gray-100 dark:bg-gray-700 border border-transparent",
      focus: "bg-white dark:bg-gray-800 ring-2 ring-blue-500/20 border-blue-500",
    },
  };
  
  // ============== BLOCK 4: Component Definition ==============
  
  export const Select = forwardRef<HTMLDivElement, SelectProps>(
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
        disabled = false,
        value = "",
        onChange,
        className,
        name,
      },
      ref
    ) => {
      const [isOpen, setIsOpen] = useState(false);
      const [highlightedIndex, setHighlightedIndex] = useState(-1);
      const containerRef = useRef<HTMLDivElement>(null);
      const listRef = useRef<HTMLUListElement>(null);
  
      const isDisabled = disabled || loading;
  
      // Find selected option label
      const selectedOption = options.find((opt) => opt.value === value);
  
      // ============== BLOCK 5: Event Handlers ==============
  
      // Close dropdown when clicking outside
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
          ) {
            setIsOpen(false);
          }
        };
  
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
  
      // Handle keyboard navigation
      const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
          if (isDisabled) return;
  
          switch (event.key) {
            case "Enter":
            case " ":
              event.preventDefault();
              if (isOpen && highlightedIndex >= 0) {
                const option = options[highlightedIndex];
                if (!option.disabled) {
                  onChange?.(option.value);
                  setIsOpen(false);
                }
              } else {
                setIsOpen(true);
              }
              break;
  
            case "ArrowDown":
              event.preventDefault();
              if (!isOpen) {
                setIsOpen(true);
              } else {
                setHighlightedIndex((prev) => {
                  let next = prev + 1;
                  while (next < options.length && options[next].disabled) {
                    next++;
                  }
                  return next < options.length ? next : prev;
                });
              }
              break;
  
            case "ArrowUp":
              event.preventDefault();
              if (isOpen) {
                setHighlightedIndex((prev) => {
                  let next = prev - 1;
                  while (next >= 0 && options[next].disabled) {
                    next--;
                  }
                  return next >= 0 ? next : prev;
                });
              }
              break;
  
            case "Escape":
              event.preventDefault();
              setIsOpen(false);
              break;
  
            case "Tab":
              setIsOpen(false);
              break;
          }
        },
        [isOpen, highlightedIndex, options, onChange, isDisabled]
      );
  
      // Handle option selection
      const handleSelect = (option: SelectOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setIsOpen(false);
      };
  
      // Toggle dropdown
      const toggleDropdown = () => {
        if (!isDisabled) {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setHighlightedIndex(
              options.findIndex((opt) => opt.value === value && !opt.disabled)
            );
          }
        }
      };
  
      // ============== BLOCK 6: Style Classes ==============
  
      const triggerStyles = clsx(
        "relative w-full flex items-center justify-between gap-2",
        "rounded-lg cursor-pointer",
        "transition-all duration-200",
        "outline-none",
        "text-left",
        sizeStyles[size].trigger,
        variantStyles[variant].base,
        isOpen && variantStyles[variant].focus,
        error && "border-red-500 dark:border-red-500",
        isDisabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
      );
  
      const dropdownStyles = clsx(
        "absolute z-50 w-full mt-1",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg shadow-lg",
        "overflow-hidden",
        "transition-all duration-200 ease-out",
        "transform origin-top",
        isOpen
          ? "opacity-100 scale-y-100 translate-y-0"
          : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
      );
  
      // ============== BLOCK 7: Render ==============
  
      return (
        <div
          ref={containerRef}
          className={clsx("flex flex-col", fullWidth ? "w-full" : "min-w-[200px]", className)}
        >
          {/* Hidden input for form submission */}
          {name && <input type="hidden" name={name} value={value} />}
  
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
  
          {/* Select Container */}
          <div ref={ref} className="relative">
            {/* Trigger Button */}
            <div
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={toggleDropdown}
              onKeyDown={handleKeyDown}
              className={triggerStyles}
            >
              {/* Left Icon */}
              {leftIcon && (
                <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {leftIcon}
                </span>
              )}
  
              {/* Selected Value / Placeholder */}
              <span
                className={clsx(
                  "flex-1 truncate",
                  selectedOption
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
  
              {/* Loading Spinner or Chevron */}
              <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                {loading ? (
                  <svg
                    className={clsx("animate-spin", sizeStyles[size].icon)}
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
                  <ChevronDownIcon
                    className={clsx(
                      sizeStyles[size].icon,
                      "transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                )}
              </span>
            </div>
  
            {/* Dropdown Menu */}
            <ul
              ref={listRef}
              role="listbox"
              aria-label={label || "Select options"}
              className={dropdownStyles}
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {options.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                    className={clsx(
                      sizeStyles[size].option,
                      "flex items-center justify-between gap-2",
                      "cursor-pointer transition-colors duration-100",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                        : clsx(
                            "text-gray-900 dark:text-gray-100",
                            highlightedIndex === index &&
                              "bg-blue-50 dark:bg-blue-900/30",
                            value === option.value &&
                              "bg-blue-100 dark:bg-blue-900/50"
                          )
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {value === option.value && (
                      <CheckIcon className={clsx(sizeStyles[size].icon, "text-blue-600 dark:text-blue-400 flex-shrink-0")} />
                    )}
                  </li>
                ))}
              </div>
            </ul>
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
  
  // ============== BLOCK 8: Display Name ==============
  
  Select.displayName = "Select";
  
  export default Select;