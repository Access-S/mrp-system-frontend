// src/components/ui/Skeleton/Skeleton.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: "pulse" | "shimmer" | "none";
  lines?: number;
  gap?: string;
}

// ============== BLOCK 3: Component ==============

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className,
  animation = "pulse",
  lines = 1,
  gap = "gap-2",
}) => {
  const baseStyles = clsx(
    "bg-gray-200 dark:bg-gray-700",
    animation === "pulse" && "animate-pulse",
    animation === "shimmer" &&
      "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
  );

  const variantStyles: Record<SkeletonVariant, string> = {
    text: "rounded h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  // Multiple lines for text variant
  if (variant === "text" && lines > 1) {
    return (
      <div className={clsx("flex flex-col", gap)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseStyles,
              variantStyles[variant],
              index === lines - 1 && "w-3/4", // Last line shorter
              className
            )}
            style={index === lines - 1 ? { ...style, width: "75%" } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(baseStyles, variantStyles[variant], className)}
      style={style}
    />
  );
};

// ============== BLOCK 4: Skeleton Presets ==============

// Table Row Skeleton
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({
  columns = 5,
}) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton variant="text" />
        </td>
      ))}
    </tr>
  );
};

// Card Skeleton
export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Skeleton variant="rounded" height={120} className="mb-4" />
      <Skeleton variant="text" className="mb-2" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
};

// Avatar Skeleton
export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return <Skeleton variant="circular" width={size} height={size} />;
};

// Button Skeleton
export const SkeletonButton: React.FC<{ width?: number }> = ({
  width = 100,
}) => {
  return <Skeleton variant="rounded" width={width} height={36} />;
};

// ============== BLOCK 5: Display Name ==============

Skeleton.displayName = "Skeleton";

export default Skeleton;