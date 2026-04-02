// src/components/dialogs/FormAlert.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

// ============== BLOCK 2: Types ==============

interface FormAlertProps {
  /** Type of alert: 'error' or 'info' */
  type: "error" | "info";
  /** Message to display */
  message: string;
  /** Optional callback when alert is dismissed (close button) */
  onDismiss?: () => void;
}

// ============== BLOCK 3: Constants ==============

const styles = {
  error: {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon: "text-red-500 dark:text-red-400",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: "text-blue-500 dark:text-blue-400",
  },
};

// ============== BLOCK 4: Component ==============

export function FormAlert({
  type,
  message,
  onDismiss,
}: FormAlertProps): React.JSX.Element | null {
  if (!message) return null;

  const isError = type === "error";
  const Icon = isError ? ExclamationTriangleIcon : InformationCircleIcon;
  const style = styles[type];

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${style.bg} ${style.border}`}
      role={isError ? "alert" : "status"}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${style.icon}`} />
      <p className={`text-sm flex-1 ${style.text}`}>{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${style.text}`}
          aria-label="Dismiss"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}