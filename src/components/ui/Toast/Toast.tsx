// src/components/ui/Toast/Toast.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import type { ToastVariant } from "./ToastContext";

// ============== BLOCK 2: Types ==============

interface ToastProps {
  id: string;
  message: string;
  variant: ToastVariant;
  onClose: (id: string) => void;
}

// ============== BLOCK 3: Variant Styles ==============

const variantStyles: Record<
  ToastVariant,
  {
    container: string;
    icon: string;
    iconComponent: React.ReactNode;
  }
> = {
  success: {
    container: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    icon: "text-green-500 dark:text-green-400",
    iconComponent: <CheckCircleIcon className="w-5 h-5" />,
  },
  error: {
    container: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
    icon: "text-red-500 dark:text-red-400",
    iconComponent: <XCircleIcon className="w-5 h-5" />,
  },
  warning: {
    container: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-500 dark:text-yellow-400",
    iconComponent: <ExclamationTriangleIcon className="w-5 h-5" />,
  },
  info: {
    container: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    icon: "text-blue-500 dark:text-blue-400",
    iconComponent: <InformationCircleIcon className="w-5 h-5" />,
  },
  loading: {
    container: "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
    icon: "text-gray-500 dark:text-gray-400",
    iconComponent: <ArrowPathIcon className="w-5 h-5 animate-spin" />,
  },
};

// ============== BLOCK 4: Component ==============

export const Toast: React.FC<ToastProps> = ({ id, message, variant, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 200);
  };

  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={clsx(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg",
        "min-w-[300px] max-w-[400px]",
        "transition-all duration-200 ease-out",
        styles.container,
        isVisible && !isLeaving
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-4"
      )}
    >
      {/* Icon */}
      <span className={clsx("flex-shrink-0", styles.icon)}>
        {styles.iconComponent}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
        {message}
      </p>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={clsx(
          "flex-shrink-0 p-1 rounded-md",
          "text-gray-500 dark:text-gray-400",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-gray-400"
        )}
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};