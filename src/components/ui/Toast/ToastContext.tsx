// ============== BLOCK 1: Imports ==============

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

// ============== BLOCK 2: Types ==============

export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, variant: ToastVariant, duration?: number) => string;
  updateToast: (id: string, message: string, variant: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

// ============== BLOCK 3: Context ==============

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============== BLOCK 4: Provider ==============

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
}> = ({ children, defaultPosition = "top-right" }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(defaultPosition);
  
  // Store timeout IDs for each toast to clear on removal
  const timeoutIdsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear the timeout for this toast if it exists
    const timeoutId = timeoutIdsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant, duration: number = 5000): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((prev) => [...prev, { id, message, variant, duration }]);

      // Auto-remove after duration (0 = persistent)
      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, duration);
        timeoutIdsRef.current.set(id, timeoutId);
      }

      return id;
    },
    [removeToast]
  );

  const updateToast = useCallback(
    (id: string, message: string, variant: ToastVariant, duration: number = 5000) => {
      // Clear previous timeout if exists
      const prevTimeoutId = timeoutIdsRef.current.get(id);
      if (prevTimeoutId) {
        clearTimeout(prevTimeoutId);
        timeoutIdsRef.current.delete(id);
      }

      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, message, variant, duration } : toast
        )
      );

      // Set new timeout for the updated toast
      if (duration > 0) {
        const newTimeoutId = setTimeout(() => {
          removeToast(id);
        }, duration);
        timeoutIdsRef.current.set(id, newTimeoutId);
      }
    },
    [removeToast]
  );

  // Cleanup all timeouts when provider unmounts
useEffect(() => {
  // Capture the current ref value before cleanup
  const currentTimeoutIds = timeoutIdsRef.current;
  return () => {
    currentTimeoutIds.forEach(clearTimeout);
  };
}, [/* deps */]);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, updateToast, removeToast, position, setPosition }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// ============== BLOCK 5: Hook ==============

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};