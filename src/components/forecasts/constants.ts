// src/components/forecasts/constants.ts

// ============== BLOCK 1: Imports ==============

import type { SelectOption } from "../ui/Select";

// ============== BLOCK 2: Week Filter Options ==============

export const WEEK_OPTIONS: SelectOption[] = [
  { value: "4", label: "4 Weeks" },
  { value: "6", label: "6 Weeks" },
  { value: "8", label: "8 Weeks" },
  { value: "10", label: "10 Weeks" },
  { value: "12", label: "12 Weeks" },
];