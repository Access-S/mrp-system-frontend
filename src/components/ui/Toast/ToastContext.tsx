// src/components/ui/Toast/ToastContext.tsx

// ============== BLOCK 1: Imports ==============

import React, { createContext, useContext, useState, useCallback } from "react";

// ============== BLOCK 2: Types ==============

export type ToastVariant = "success" | "error" | "warning" | "info";
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, variant: ToastVariant, duration?: number) => void;
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

  const addToast = useCallback(
    (message: string, variant: ToastVariant, duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setToasts((prev) => [...prev, { id, message, variant, duration }]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, position, setPosition }}>
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