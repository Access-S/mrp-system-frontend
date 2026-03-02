//src/components/ui/Card.tsx

import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-sm transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<SectionProps> = ({ children, className }) => {
  return <div className={clsx("px-6 py-4", className)}>{children}</div>;
};

export const CardFooter: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "border-t border-gray-100 dark:border-gray-700 px-6 py-4",
        className
      )}
    >
      {children}
    </div>
  );
};