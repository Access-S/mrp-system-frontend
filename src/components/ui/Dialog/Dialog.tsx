// src/components/ui/Dialog/Dialog.tsx

// ============== BLOCK 1: Imports ==============

import React, { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

// ============== BLOCK 2: Types ==============

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

// ============== BLOCK 4: Component ==============

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div
        className={clsx(
          "bg-white dark:bg-gray-800",
          "rounded-xl shadow-2xl",
          "relative w-full mx-4",
          "transform transition-all duration-200 animate-scaleIn",
          sizeStyles[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={clsx(
                  "p-1.5 rounded-lg",
                  "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-gray-400"
                )}
                aria-label="Close dialog"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className={clsx(
              "flex justify-end gap-2 px-6 py-4",
              "border-t border-gray-200 dark:border-gray-700",
              "bg-gray-50 dark:bg-gray-800/50",
              "rounded-b-xl"
            )}
          >
            {footer}
          </div>
        )}

        {/* Close button if no title */}
        {!title && showCloseButton && (
          <button
            onClick={onClose}
            className={clsx(
              "absolute top-3 right-3 p-1.5 rounded-lg",
              "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-gray-400"
            )}
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============== BLOCK 5: Display Name ==============

Dialog.displayName = "Dialog";

export default Dialog;