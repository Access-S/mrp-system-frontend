// src/components/dialogs/ConfirmationDialog.tsx

// ============== BLOCK 1: Imports ==============

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

// ============== BLOCK 2: Types ==============

type ConfirmVariant = "danger" | "primary";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

// ============== BLOCK 3: Constants ==============

const iconStyles: Record<ConfirmVariant, string> = {
  danger: "text-red-500",
  primary: "text-blue-500",
};

// ============== BLOCK 4: Component ==============

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmationDialogProps): React.JSX.Element | null => {
  const handleConfirm = (): void => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      title={title}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon
          className={`h-6 w-6 flex-shrink-0 ${iconStyles[variant]}`}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
    </Dialog>
  );
};

// ============== BLOCK 5: Display Name ==============

ConfirmationDialog.displayName = "ConfirmationDialog";