// src/components/ui/index.ts

// ============== BLOCK 1: Accordion ==============
export { Accordion } from "./Accordion";

// ============== BLOCK 2: Button ==============
export { Button } from "./Button";

// ============== BLOCK 3: Card ==============
export { Card, CardHeader, CardContent, CardFooter } from "./Card";

// ============== BLOCK 4: DatePicker ==============
export { DatePicker } from "./DatePicker";

// ============== BLOCK 5: Dialog ==============
export { Dialog } from "./Dialog";
export type { DialogProps } from "./Dialog";

// ============== BLOCK 6: EmptyState ==============
export {
  EmptyState,
  EmptyTableState,
  EmptySearchState,
  EmptyProductState,
  ErrorState,
} from "./EmptyState";

// ============== BLOCK 7: Input ==============
export { Input } from "./Input";
export type { InputProps } from "./Input";

// ============== BLOCK 8: Menu ==============
export { Menu } from "./Menu";

// ============== BLOCK 9: Select ==============
export { Select } from "./Select";
export type { SelectOption } from "./Select";

// ============== BLOCK 10: Skeleton ==============
export {
  Skeleton,
  SkeletonTableRow,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
} from "./Skeleton";

// ============== BLOCK 11: Spinner ==============
export {
  Spinner,
  SpinnerInline,
  SpinnerPage,
  SpinnerOverlay,
} from "./Spinner";

// ============== BLOCK 12: StatusBadge ==============
export { StatusBadge } from "./StatusBadge";
export type { Status } from "./StatusBadge";

// ============== BLOCK 13: Table ==============
export { Table } from "./Table";
export { useTableContext } from "./Table";
export type { TableVariant, TableSize, TableContextValue } from "./Table";

// ============== BLOCK 14: Tabs ==============
export { Tabs } from "./Tabs";

// ============== BLOCK 15: Toast ==============
export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToastContext,
  useToast,
} from "./Toast";
export type { ToastVariant, ToastPosition } from "./Toast";

// ============== BLOCK 16: WidgetCard ==============
export {
  WidgetCard,
  WidgetHeader,
  WidgetBody,
  WidgetFooter,
  MiniActionButton,
} from "./WidgetCard";

// ============== BLOCK 17: Pagination ==============
export { Pagination, PaginationInfo } from "./Pagination";