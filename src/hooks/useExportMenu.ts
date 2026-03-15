// src/hooks/useExportMenu.ts

// ============== BLOCK 1: Imports ==============

import { useState, useCallback } from "react";

// ============== BLOCK 2: Types & Interfaces ==============

export interface UseExportMenuResult {
  /** Whether the export dropdown is open */
  isOpen: boolean;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown */
  close: () => void;
  /** Toggle the dropdown */
  toggle: () => void;
}

// ============== BLOCK 3: Hook ==============

/**
 * Export dropdown menu state hook.
 * Replaces the repeated isExportMenuOpen + toggle pattern
 * in ForecastsPage and SohPage.
 *
 * @example
 * const exportMenu = useExportMenu();
 *
 * <Button onClick={exportMenu.toggle}>Export</Button>
 * {exportMenu.isOpen && <DropdownMenu onClose={exportMenu.close} />}
 */
export function useExportMenu(): UseExportMenuResult {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}