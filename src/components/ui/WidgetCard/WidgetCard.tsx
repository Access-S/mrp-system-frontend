// src/components/ui/WidgetCard/WidgetCard.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type WidgetVariant = "default" | "bordered" | "elevated";

interface WidgetCardProps {
  children: React.ReactNode;
  variant?: WidgetVariant;
  className?: string;
}

interface WidgetHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

interface WidgetBodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

interface WidgetFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface MiniActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  title?: string;
  "aria-label"?: string;
  disabled?: boolean;
}

// ============== BLOCK 3: Variant Styles ==============

const variantStyles: Record<WidgetVariant, string> = {
  default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm",
  bordered: "bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700",
  elevated: "bg-white dark:bg-gray-900 shadow-lg border-0",
};

// ============== BLOCK 4: WidgetCard Component ==============

export const WidgetCard: React.FC<WidgetCardProps> = ({
  children,
  variant = "default",
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl overflow-hidden flex flex-col h-full",
        "transition-colors duration-200",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

WidgetCard.displayName = "WidgetCard";

// ============== BLOCK 5: WidgetHeader Component ==============

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  icon,
  actions,
  badge,
  className,
}) => {
  return (
    <div
      className={clsx(
        "px-4 py-4",
        "bg-gray-50 dark:bg-gray-800/50",
        "border-b border-gray-200 dark:border-gray-700",
        "flex items-center justify-between shrink-0",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-blue-600 dark:text-blue-400">
            {icon}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          {title}
        </h3>
        {badge}
      </div>
      {actions && <div className="flex gap-1">{actions}</div>}
    </div>
  );
};

WidgetHeader.displayName = "WidgetHeader";

// ============== BLOCK 6: WidgetBody Component ==============

export const WidgetBody: React.FC<WidgetBodyProps> = ({
  children,
  className,
  noPadding = false,
}) => {
  return (
    <div
      className={clsx(
        "flex-1",
        !noPadding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

WidgetBody.displayName = "WidgetBody";

// ============== BLOCK 7: WidgetFooter Component ==============

export const WidgetFooter: React.FC<WidgetFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "px-4 py-3",
        "border-t border-gray-200 dark:border-gray-700",
        "bg-gray-50 dark:bg-gray-800/50",
        className
      )}
    >
      {children}
    </div>
  );
};

WidgetFooter.displayName = "WidgetFooter";

// ============== BLOCK 8: MiniActionButton Component ==============

export const MiniActionButton: React.FC<MiniActionButtonProps> = ({
  onClick,
  icon,
  title,
  "aria-label": ariaLabel,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      disabled={disabled}
      className={clsx(
        "p-1.5 rounded-md",
        "text-gray-400",
        "transition-colors duration-150",
        "flex items-center justify-center",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
      )}
    >
      {icon}
    </button>
  );
};

MiniActionButton.displayName = "MiniActionButton";

// ============== BLOCK 9: Default Export ==============

export default WidgetCard;