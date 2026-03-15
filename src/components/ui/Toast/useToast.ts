// src/components/ui/Toast/useToast.ts

// ============== BLOCK 1: Imports ==============

import { useCallback } from "react";

import { useToastContext } from "./ToastContext";

// ============== BLOCK 2: Types ==============

export interface ToastOptions {
  id?: string;
  duration?: number;
}

// ============== BLOCK 3: Hook ==============

export const useToast = () => {
  const { addToast, updateToast, removeToast, position, setPosition } = useToastContext();

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      if (options?.id) {
        updateToast(options.id, message, "success", options.duration);
      } else {
        addToast(message, "success", options?.duration);
      }
    },
    [addToast, updateToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      if (options?.id) {
        updateToast(options.id, message, "error", options.duration);
      } else {
        addToast(message, "error", options?.duration);
      }
    },
    [addToast, updateToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      if (options?.id) {
        updateToast(options.id, message, "warning", options.duration);
      } else {
        addToast(message, "warning", options?.duration);
      }
    },
    [addToast, updateToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      if (options?.id) {
        updateToast(options.id, message, "info", options.duration);
      } else {
        addToast(message, "info", options?.duration);
      }
    },
    [addToast, updateToast]
  );

  const loading = useCallback(
    (message: string): string => {
      return addToast(message, "loading", 0);
    },
    [addToast]
  );

  return {
    toast: {
      success,
      error,
      warning,
      info,
      loading,
    },
    removeToast,
    position,
    setPosition,
  };
};