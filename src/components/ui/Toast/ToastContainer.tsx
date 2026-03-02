// src/components/ui/Toast/ToastContainer.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";
import { Toast } from "./Toast";
import { useToastContext, ToastPosition } from "./ToastContext";

// ============== BLOCK 2: Position Styles ==============

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

// ============== BLOCK 3: Component ==============

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, position } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      className={clsx(
        "fixed z-50 flex flex-col gap-2",
        positionStyles[position]
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;