// src/components/dialogs/ConfirmationDialog.tsx

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// BLOCK 2: Interface and Component Definition
interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  loading = false,
}: ConfirmationDialogProps) {
  // BLOCK 3: Handlers
  const handleConfirmClick = () => {
    onConfirm();
  };

  // BLOCK 4: Render Logic
  return (
    <Dialog open={open} handler={onCancel} size="sm">
      <DialogHeader className="gap-2">
        <ExclamationTriangleIcon
          className={`h-6 w-6 text-${confirmColor}-500`}
        />
        {title}
      </DialogHeader>
      <DialogBody divider>
        <Typography color="gray" className="font-normal">
          {message}
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={onCancel}
          className="mr-1"
          disabled={loading}
        >
          <span>{cancelText}</span>
        </Button>
        <Button
          variant="gradient"
          color={confirmColor as any}
          onClick={handleConfirmClick}
          loading={loading}
        >
          <span>{confirmText}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}