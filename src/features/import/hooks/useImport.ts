// src/hooks/useImport.ts

// ============== BLOCK 1: Imports ==============

import { useState, useCallback } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UseImportResult {
  /** Whether the import modal is open */
  isOpen: boolean;
  /** Open the import modal */
  open: () => void;
  /** Close the import modal */
  close: () => void;
  /** Close the modal and trigger data refetch */
  onComplete: () => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Import modal state + auto-refetch hook.
 * Replaces the repeated isImportModalOpen + handleImportComplete
 * pattern in ForecastsPage and SohPage.
 *
 * @param refetch - Function to call after import completes (re-fetches data)
 *
 * @example
 * const importModal = useImport(refetch);
 *
 * <Button onClick={importModal.open}>Import</Button>
 *
 * <ExcelImportModal
 *   open={importModal.isOpen}
 *   handleOpen={importModal.close}
 *   onImport={handleImport}
 *   onImportComplete={importModal.onComplete}
 * />
 */
export function useImport(
  refetch: () => void | Promise<void>
): UseImportResult {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const onComplete = useCallback(() => {
    setIsOpen(false);
    refetch();
  }, [refetch]);

  return { isOpen, open, close, onComplete };
}