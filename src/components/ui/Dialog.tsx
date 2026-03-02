import React, { ReactNode, useEffect } from 'react';
import { Button } from './Button';
import clsx from 'clsx';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // Close when clicking overlay
    >
      <div
        className={clsx(
          'bg-white dark:bg-slate-800 rounded-lg shadow-xl relative p-6',
          SIZE_CLASSES[size],
          'mx-4',
          'transition-transform transform scale-100',
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
        )}

        <div className="space-y-4">{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3"
        >
          ✕
        </Button>
      </div>
    </div>
  );
};