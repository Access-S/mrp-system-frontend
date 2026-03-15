// src/components/dashboard/TimeRangeFilter.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { Button } from "../ui/Button";
import { Menu } from "../ui/Menu";

// ============== BLOCK 2: Constants ==============

const TIME_RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Last 3 Months", value: "last_3_months" },
  { label: "Last 6 Months", value: "last_6_months" },
  { label: "This Financial Year", value: "this_fy" },
  { label: "Last Financial Year", value: "last_fy" },
];

export const TIME_RANGE_LABELS: Record<string, string> = {
  today: "Today",
  this_week: "This Week",
  last_week: "Last Week",
  this_month: "This Month",
  last_month: "Last Month",
  last_3_months: "Last 3 Months",
  last_6_months: "Last 6 Months",
  this_fy: "This FY",
  last_fy: "Last FY",
};

// ============== BLOCK 3: Types ==============

interface TimeRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

// ============== BLOCK 4: Component ==============

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ value, onChange }) => {
  const selectedLabel =
    TIME_RANGE_OPTIONS.find((opt) => opt.value === value)?.label || "Select Range";

  return (
    <Menu>
      <Menu.Trigger>
        <Button
          variant="secondary"
          size="md"
          rightIcon={<ChevronDownIcon className="h-4 w-4" />}
        >
          {selectedLabel}
        </Button>
      </Menu.Trigger>
      <Menu.Content position="bottom-end" minWidth={220}>
        <Menu.Label>Time Range</Menu.Label>
        <Menu.Divider />
        {TIME_RANGE_OPTIONS.map((option) => (
          <Menu.Item
            key={option.value}
            onClick={() => onChange(option.value)}
            icon={
              value === option.value ? (
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
              ) : (
                <span className="opacity-0">✓</span>
              )
            }
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  );
};