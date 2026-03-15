// src/components/shared/FilterToolbar/FilterToolbar.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Input } from "../../ui/Input";

// ============== BLOCK 2: Types & Interfaces ==============

interface FilterToolbarProps {
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Current search value */
  searchValue: string;
  /** Called with the new search string on every keystroke */
  onSearchChange: (value: string) => void;
  /** Additional filter controls rendered on the right side */
  filters?: React.ReactNode;
}

// ============== BLOCK 3: Component ==============

export const FilterToolbar = ({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
}: FilterToolbarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          size="md"
        />
      </div>

      {/* Right Side Filters */}
      {filters && (
        <div className="flex flex-wrap items-center gap-3">
          {filters}
        </div>
      )}
    </div>
  );
};