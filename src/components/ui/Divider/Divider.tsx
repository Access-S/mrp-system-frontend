// src/components/ui/Divider/Divider.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types & Interfaces ==============

export type DividerOrientation = "horizontal" | "vertical";
export type DividerSpacing = "none" | "sm" | "md" | "lg";
export type DividerLabelPosition = "start" | "center" | "end";

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Spacing around the divider */
  spacing?: DividerSpacing;
  /** Optional label text */
  label?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Position of label/icon */
  labelPosition?: DividerLabelPosition;
  /** Additional CSS classes */
  className?: string;
}

// ============== BLOCK 3: Constants ==============

const horizontalSpacingStyles: Record<DividerSpacing, string> = {
  none: "my-0",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

const verticalSpacingStyles: Record<DividerSpacing, string> = {
  none: "mx-0",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-6",
};

const labelPositionStyles: Record<DividerLabelPosition, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

// ============== BLOCK 4: Component ==============

export function Divider({
  orientation = "horizontal",
  spacing = "md",
  label,
  icon,
  labelPosition = "center",
  className,
}: DividerProps) {
  const hasContent = label || icon;

  // Vertical divider
  if (orientation === "vertical") {
    return (
      <div
        className={clsx(
          "inline-flex self-stretch",
          verticalSpacingStyles[spacing],
          className
        )}
      >
        <div
          className={clsx(
            "w-px h-full",
            "bg-gray-200 dark:bg-gray-700"
          )}
        />
      </div>
    );
  }

  // Horizontal divider without content
  if (!hasContent) {
    return (
      <hr
        className={clsx(
          "w-full border-0",
          "h-px",
          "bg-gray-200 dark:bg-gray-700",
          horizontalSpacingStyles[spacing],
          className
        )}
      />
    );
  }

  // Horizontal divider with label or icon
  return (
    <div
      className={clsx(
        "flex items-center w-full",
        horizontalSpacingStyles[spacing],
        labelPositionStyles[labelPosition],
        className
      )}
    >
      {/* Left line */}
      <div
        className={clsx(
          "h-px bg-gray-200 dark:bg-gray-700",
          labelPosition === "start" && "w-4 flex-shrink-0",
          labelPosition === "center" && "flex-1",
          labelPosition === "end" && "flex-1"
        )}
      />

      {/* Content (label or icon) */}
      <div
        className={clsx(
          "flex items-center gap-2 px-3",
          "text-sm text-gray-500 dark:text-gray-400",
          "whitespace-nowrap"
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label && <span>{label}</span>}
      </div>

      {/* Right line */}
      <div
        className={clsx(
          "h-px bg-gray-200 dark:bg-gray-700",
          labelPosition === "start" && "flex-1",
          labelPosition === "center" && "flex-1",
          labelPosition === "end" && "w-4 flex-shrink-0"
        )}
      />
    </div>
  );
}

// ============== BLOCK 5: Exports ==============

export default Divider;