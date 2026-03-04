// src/components/ui/Drawer/Drawer.tsx

// ============== BLOCK 1: Imports ==============

import React, { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// ============== BLOCK 2: Types & Interfaces ==============

type DrawerVariant = "default" | "bordered" | "elevated";
type DrawerSize = "sm" | "md" | "lg";

interface DrawerProps {
  /** Content to render inside the drawer */
  children: React.ReactNode;
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback when drawer toggle is clicked */
  onToggle: () => void;
  /** Title displayed in the header */
  title?: string;
  /** Subtitle/description displayed in the header */
  subtitle?: string;
  /** Icon displayed next to title */
  icon?: React.ReactNode;
  /** Text for the toggle button when closed */
  openButtonText?: string;
  /** Text for the toggle button when open */
  closeButtonText?: string;
  /** Visual variant */
  variant?: DrawerVariant;
  /** Size affecting padding */
  size?: DrawerSize;
  /** Additional class names for the container */
  className?: string;
  /** Whether to show the header inside drawer */
  showHeader?: boolean;
  /** Custom trigger button (overrides default) */
  customTrigger?: React.ReactNode;
}

// ============== BLOCK 3: Style Definitions ==============

const variantStyles: Record<DrawerVariant, string> = {
  default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  bordered: "bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600",
  elevated: "bg-white dark:bg-gray-800 shadow-lg border-0",
};

const sizeStyles: Record<DrawerSize, { padding: string; gap: string }> = {
  sm: { padding: "p-3", gap: "gap-3" },
  md: { padding: "p-4", gap: "gap-4" },
  lg: { padding: "p-6", gap: "gap-6" },
};

// ============== BLOCK 4: Component ==============

export const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen,
  onToggle,
  title,
  subtitle,
  icon,
  openButtonText = "Show Insights",
  closeButtonText = "Hide Insights",
  variant = "default",
  size = "md",
  className,
  showHeader = true,
  customTrigger,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // ============== BLOCK 5: Height Calculation ==============

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(contentRef.current);

      // Initial measurement
      setContentHeight(contentRef.current.scrollHeight);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [children]);

  // ============== BLOCK 6: Styles ==============

  const styles = sizeStyles[size];

  const containerStyles = clsx(
    "rounded-xl overflow-hidden transition-all duration-300 ease-in-out",
    variantStyles[variant],
    className
  );

  const headerStyles = clsx(
    "flex items-center justify-between",
    styles.padding,
    "border-b border-gray-100 dark:border-gray-700"
  );

  const toggleButtonStyles = clsx(
    "inline-flex items-center gap-2",
    "px-4 py-2 rounded-lg",
    "text-sm font-medium",
    "bg-gray-100 dark:bg-gray-700",
    "text-gray-700 dark:text-gray-200",
    "hover:bg-gray-200 dark:hover:bg-gray-600",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
  );

  const contentContainerStyles = clsx(
    "overflow-hidden transition-all duration-300 ease-in-out"
  );

  const contentInnerStyles = clsx(styles.padding, styles.gap, "flex flex-col");

  // ============== BLOCK 7: Render ==============

  return (
    <div className={containerStyles}>
      {/* Header with Toggle */}
      {showHeader && (
        <div className={headerStyles}>
          {/* Left side: Icon + Title */}
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side: Toggle Button */}
          {customTrigger ? (
            <div onClick={onToggle} className="cursor-pointer">
              {customTrigger}
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className={toggleButtonStyles}
              aria-expanded={isOpen}
              aria-controls="drawer-content"
            >
              <span>{isOpen ? closeButtonText : openButtonText}</span>
              <ChevronDownIcon
                className={clsx(
                  "h-4 w-4 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
      )}

      {/* Collapsible Content */}
      <div
        id="drawer-content"
        className={contentContainerStyles}
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className={contentInnerStyles}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ============== BLOCK 8: Display Name ==============

Drawer.displayName = "Drawer";

export default Drawer;