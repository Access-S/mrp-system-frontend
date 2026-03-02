// src/components/ui/Toast/useToast.ts

// ============== BLOCK 1: Imports ==============

import { useCallback } from "react";
import { useToastContext } from "./ToastContext";

// ============== BLOCK 2: Hook ==============

export const useToast = () => {
  const { addToast, removeToast, position, setPosition } = useToastContext();

  const success = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "success", duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "error", duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "warning", duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast(message, "info", duration);
    },
    [addToast]
  );

  return {
    toast: {
      success,
      error,
      warning,
      info,
    },
    removeToast,
    position,
    setPosition,
  };
};

export default useToast;