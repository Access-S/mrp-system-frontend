// src/components/ui/index.ts

// ============== BLOCK 1: Accordion ==============
export { Accordion } from "./Accordion";

// ============== BLOCK 2: Avatar ==============
export { Avatar, AvatarGroup } from "./Avatar";

// ============== BLOCK 3: Badge ==============
export { Badge } from "./Badge";

// ============== BLOCK 4: Breadcrumb ==============
export { Breadcrumb } from "./Breadcrumb";

// ============== BLOCK 5: Button ==============
export { Button } from "./Button";

// ============== BLOCK 6: Card ==============
export { Card, CardHeader, CardContent, CardFooter } from "./Card";

// ============== BLOCK 7: DatePicker ==============
export { DatePicker } from "./DatePicker";

// ============== BLOCK 8: Dialog ==============
export { Dialog } from "./Dialog";
export type { DialogProps } from "./Dialog";

// ============== BLOCK 9: EmptyState ==============
export {
  EmptyState,
  EmptyTableState,
  EmptySearchState,
  EmptyProductState,
  ErrorState,
} from "./EmptyState";

// ============== BLOCK 10: Input ==============
export { Input } from "./Input";
export type { InputProps } from "./Input";

// ============== BLOCK 11: Menu ==============
export { Menu } from "./Menu";

// ============== BLOCK 12: Pagination ==============
export { Pagination, PaginationInfo } from "./Pagination";

// ============== BLOCK 13: Select ==============
export { Select } from "./Select";
export type { SelectOption } from "./Select";

// ============== BLOCK 14: Skeleton ==============
export {
  Skeleton,
  SkeletonTableRow,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
} from "./Skeleton";

// ============== BLOCK 15: Spinner ==============
export {
  Spinner,
  SpinnerInline,
  SpinnerPage,
  SpinnerOverlay,
} from "./Spinner";

// ============== BLOCK 16: StatusBadge ==============
export { StatusBadge } from "./StatusBadge";
export type { Status } from "./StatusBadge";

// ============== BLOCK 17: Table ==============
export { Table } from "./Table";
export { useTableContext } from "./Table";
export type { TableVariant, TableSize, TableContextValue } from "./Table";

// ============== BLOCK 18: Tabs ==============
export { Tabs } from "./Tabs";

// ============== BLOCK 19: Toast ==============
export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToastContext,
  useToast,
} from "./Toast";
export type { ToastVariant, ToastPosition } from "./Toast";

// ============== BLOCK 20: Tooltip ==============
export { Tooltip } from "./Tooltip";

// ============== BLOCK 21: WidgetCard ==============
export {
  WidgetCard,
  WidgetHeader,
  WidgetBody,
  WidgetFooter,
  MiniActionButton,
} from "./WidgetCard";