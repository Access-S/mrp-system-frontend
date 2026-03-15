// src/hooks/useModal.ts

// ============== BLOCK 1: Imports ==============

import { useState, useCallback } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UseModalResult<T> {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** The data associated with the open modal, or null when closed */
  data: T | null;
  /** Open the modal, optionally with associated data */
  open: (data?: T) => void;
  /** Close the modal and clear data */
  close: () => void;
  /** Toggle the modal open/closed */
  toggle: () => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Generic modal state management hook.
 * Replaces the repeated isOpen + selectedItem useState pairs.
 *
 * @example
 * // Modal with associated data
 * const editModal = useModal<PurchaseOrder>();
 * editModal.open(po);        // isOpen=true, data=po
 * editModal.close();         // isOpen=false, data=null
 *
 * @example
 * // Simple modal without data
 * const createModal = useModal();
 * createModal.open();         // isOpen=true, data=null
 * createModal.close();        // isOpen=false
 *
 * @example
 * // In JSX
 * <Dialog open={editModal.isOpen} onClose={editModal.close}>
 *   <EditForm po={editModal.data} />
 * </Dialog>
 */
export function useModal<T = undefined>(): UseModalResult<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((itemData?: T) => {
    setData(itemData ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setData(null);
      }
      return !prev;
    });
  }, []);

  return { isOpen, data, open, close, toggle };
}