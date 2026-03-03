// src/components/ui/Card/Card.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type CardVariant = "default" | "bordered" | "elevated" | "flat";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  padding?: boolean;
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

// ============== BLOCK 3: Variant Styles ==============

const variantStyles: Record<CardVariant, string> = {
  default: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm",
  bordered: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
  elevated: "border-0 bg-white dark:bg-gray-800 shadow-lg",
  flat: "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900",
};

// ============== BLOCK 4: Card Component ==============

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className,
  padding = false,
}) => {
  return (
    <div
      className={clsx(
        "rounded-xl transition-colors duration-200",
        variantStyles[variant],
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";

// ============== BLOCK 5: CardHeader Component ==============

export const CardHeader: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "border-b border-gray-100 dark:border-gray-700",
        "px-6 py-4",
        "flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

CardHeader.displayName = "CardHeader";

// ============== BLOCK 6: CardContent Component ==============

export const CardContent: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <div className={clsx("px-6 py-4", className)}>
      {children}
    </div>
  );
};

CardContent.displayName = "CardContent";

// ============== BLOCK 7: CardFooter Component ==============

export const CardFooter: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "border-t border-gray-100 dark:border-gray-700",
        "px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = "CardFooter";

// ============== BLOCK 8: Default Export ==============

export default Card;