# 🔧 Frontend Refactoring Plan — Data Layer & Consistency Cleanup

> **Branch:** `refactor/data-layer-cleanup`  
> **Author:** Generated from codebase analysis  
> **Date:** March 2026  
> **Status:** Planned

---

## 📋 Executive Summary

The MRP System frontend has grown organically, resulting in **duplicated logic across pages**, **two competing UI libraries**, **two toast notification systems**, and **TypeScript violations** throughout the codebase. This refactoring will:

- **Eliminate ~500+ lines** of duplicated code
- **Remove Material Tailwind** dependency entirely
- **Standardize** on one toast system, one UI library, one pattern
- **Create reusable hooks** that make future development 3x faster
- **Fix all TypeScript violations** (no more `any` types)

**No features will be added or removed. No UI changes visible to end users.**
This is purely an internal code quality improvement.

---

## 🔴 Problem Statement

### Problem 1: Two UI Libraries Running Side by Side

The app currently imports components from **two different libraries** for the same purpose:

| Page | UI Library Used | Should Be |
|---|---|---|
| ProductsPage | ❌ Material Tailwind | Custom UI |
| DashboardPage | ❌ Material Tailwind | Custom UI |
| PurchaseOrdersPage | ✅ Custom UI | Custom UI |
| ForecastsPage | ✅ Custom UI | Custom UI |
| SohPage | ✅ Custom UI | Custom UI |

**Impact:**
- Inconsistent look and feel across pages
- Larger bundle size (two libraries loaded)
- Harder to maintain — developers don't know which to use
- Custom UI components exist but aren't used everywhere

```typescript
// ❌ ProductsPage + DashboardPage (Material Tailwind)
import { Card, Typography, CardBody, Spinner, Input, Button } from "@material-tailwind/react";

// ✅ Other pages (Custom UI — what we SHOULD use everywhere)
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";

Problem 2: Two Toast Notification Systems
Two different toast libraries are used across the app:

Page	Toast System	Should Be
ProductsPage	❌ No toast at all	useToast
DashboardPage	❌ react-hot-toast	useToast
PurchaseOrdersPage	❌ react-hot-toast	useToast
ForecastsPage	✅ useToast (custom)	useToast
SohPage	✅ useToast (custom)	useToast

// ❌ PurchaseOrdersPage + DashboardPage
import toast from "react-hot-toast";
toast.error("Failed");

// ✅ ForecastsPage + SohPage (our custom system)
import { useToast } from "../ui/Toast";
const { toast } = useToast();
toast.error("Failed");

Problem 3: TypeScript Violations
Multiple violations of our own TypeScript rules (AI Rules — Rule 5):

// ❌ ProductsPage — using any[]
const [products, setProducts] = useState<any[]>([]);

// ❌ DashboardPage — multiple any types
function TopItemsCard({ items, theme }: { items: any[]; theme: any }) {}
function RecentActivityCard({ theme }: { theme: any }) {}
function LowStockAlerts({ theme }: { theme: any }) {}

// ❌ PurchaseOrdersPage — PurchaseOrder interface defined TWICE
import { PurchaseOrder } from "../../types/mrp.types";  // Imported
interface PurchaseOrder { ... }                          // Re-defined!

// ❌ Every page — untyped error catches
catch (error: any) {

Problem 4: Duplicated Logic Across Pages
The same code patterns are copied and pasted across multiple pages:

4a. Fetch + Loading + Error (ALL 5 pages)
Every page repeats this exact pattern (~15 lines each × 5 pages = 75 duplicated lines):

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await someService.getAll();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => { fetchData(); }, []);

4b. Search/Filter Logic (4 of 5 pages)
Each page reimplements search filtering (~10 lines each × 4 pages = 40 duplicated lines):

const [searchQuery, setSearchQuery] = useState("");
const filteredData = useMemo(() => {
  if (!searchQuery) return data;
  const query = searchQuery.toLowerCase();
  return data.filter(item =>
    item.field1.toLowerCase().includes(query) ||
    item.field2.toLowerCase().includes(query)
  );
}, [data, searchQuery]);

4c. Export Dropdown (2 pages — IDENTICAL code)
ForecastsPage and SohPage have the exact same export dropdown implementation (~60 lines each):
const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
const EXPORT_OPTIONS = [
  { key: "csv", label: "Export as CSV", icon: "📄" },
  { key: "excel", label: "Export as Excel", icon: "📊" },
  { key: "pdf", label: "Export as PDF", icon: "📑" },
];
// + identical dropdown JSX

4d. Import Modal Pattern (2 pages — IDENTICAL code)
ForecastsPage and SohPage have the exact same import handling (~20 lines each):
const [isImportModalOpen, setIsImportModalOpen] = useState(false);
const handleImport = async (file) => { ... };
const handleImportComplete = () => {
  setIsImportModalOpen(false);
  fetchData();
};

4e. Modal State Management (PurchaseOrdersPage has 4 modals)
14 useState calls just for modal management in one page:
const [poToView, setPoToView] = useState(null);
const [isEditFormOpen, setIsEditFormOpen] = useState(false);
const [poToEdit, setPoToEdit] = useState(null);
const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
const [poToDelete, setPoToDelete] = useState(null);
const [isDespatchFormOpen, setIsDespatchFormOpen] = useState(false);
const [poToDespatch, setPoToDespatch] = useState(null);

Problem 5: Inconsistent Page Patterns
Feature	Products	PurchaseOrders	Forecasts	SOH	Dashboard
Skeleton loading	❌ Spinner	✅ Custom	✅ Custom	✅ Custom	⚠️ Inline
Empty state	❌ None	✅ Component	✅ Component	✅ Component	❌ None
Error state	❌ console.error	❌ Toast only	✅ UI card	✅ UI card	⚠️ Basic
Page header	❌ Inline	✅ Consistent	✅ Consistent	✅ Consistent	⚠️ Inline
Results count	❌ None	✅ Shown	✅ Shown	✅ Shown	❌ N/A


✅ Solution Overview
What We're Building

src/
├── hooks/                          ← NEW: Reusable custom hooks
│   ├── useFetch.ts                 → Generic data fetching
│   ├── useSearch.ts                → Search + filter logic
│   ├── useModal.ts                 → Modal open/close state
│   ├── usePagination.ts            → Pagination state + handlers
│   ├── useSort.ts                  → Sort direction toggle
│   ├── useExportMenu.ts            → Export dropdown state
│   └── useImport.ts                → Import modal state + handlers
│
├── components/
│   ├── shared/                     ← NEW: Reusable page-level components
│   │   ├── ExportDropdown.tsx      → Export button + dropdown menu
│   │   ├── PageHeader.tsx          → Consistent page header
│   │   ├── FilterToolbar.tsx       → Search + filters bar
│   │   └── ResultsCount.tsx        → "Showing X of Y" display
│   │
│   ├── dashboard/                  ← REFACTORED: Extract sub-components
│   │   ├── RecentActivityCard.tsx  → Extracted from DashboardPage
│   │   ├── LowStockAlerts.tsx      → Extracted from DashboardPage
│   │   ├── TopItemsCard.tsx        → Extracted from DashboardPage
│   │   └── TimeRangeFilter.tsx     → Extracted dropdown component
│   │
│   └── pages/                      ← REFACTORED: Use hooks + custom UI
│       ├── ProductsPage.tsx        → Full rewrite
│       ├── PurchaseOrdersPage.tsx  → Migrate to hooks + useToast
│       ├── ForecastsPage.tsx       → Migrate to hooks
│       ├── SohPage.tsx             → Migrate to hooks
│       └── DashboardPage.tsx       → Remove Material Tailwind + extract components

🏗️ Implementation Plan
Phase 1: Custom Hooks (Biggest Code Reduction)
Goal: Create reusable hooks that eliminate duplicated state management logic.

Hook 1: useFetch
Replaces: 15 lines of fetch/loading/error code in every page

Before (in each page):
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => { ... 10 lines ... };
  useEffect(() => { fetchData(); }, []);

After:
  const { data, loading, error, refetch } = useFetch(productService.getAll);

  Lines eliminated: ~75 lines across 5 pages

Hook 2: useSearch
Replaces: Search state + useMemo filter logic in 4 pages

Before:
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = useMemo(() => { ... 8 lines ... }, [data, searchQuery]);

After:
  const { query, setQuery, filtered } = useSearch(products, ['productCode', 'description']);
  Lines eliminated: ~40 lines across 4 pages

Hook 3: useModal
Replaces: Modal open/close + selected item state
Before (PurchaseOrdersPage — 14 lines for 4 modals):
  const [poToView, setPoToView] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [poToEdit, setPoToEdit] = useState(null);
  // ... 4 more useState calls

After:
  const viewModal = useModal<PurchaseOrder>();
  const editModal = useModal<PurchaseOrder>();
  const deleteModal = useModal<PurchaseOrder>();
  const despatchModal = useModal<PurchaseOrder>();
  
  // Usage: viewModal.open(po), viewModal.close(), viewModal.isOpen, viewModal.data
  Lines eliminated: ~30 lines in PurchaseOrdersPage, reusable elsewhere

Hook 4: usePagination
Replaces: Pagination state in PurchaseOrdersPage
Before:
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 25, totalPages: 1 });
  const handlePageChange = (newPage) => { ... };
  const handleItemsPerPageChange = (value) => { ... };

After:
  const pagination = usePagination({ initialLimit: 25 });
  // pagination.page, pagination.limit, pagination.setPage, pagination.setLimit

  Hook 5: useSort
Replaces: Sort direction toggle in PurchaseOrdersPage
Before:
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const handleSort = () => setSortDirection(prev => prev === "asc" ? "desc" : "asc");

After:
  const { direction, toggle, label } = useSort("desc");

  Hook 6: useExportMenu
Replaces: Export dropdown state in ForecastsPage + SohPage
Before:
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  // + 60 lines of identical dropdown JSX

After:
  const exportMenu = useExportMenu();
  // exportMenu.isOpen, exportMenu.toggle, exportMenu.close

  Hook 7: useImport
Replaces: Import modal state + handlers in ForecastsPage + SohPage
Before:
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleImport = async (file) => { ... };
  const handleImportComplete = () => { ... };

After:
  const importHandler = useImport(importService, fetchData, {
    processingMessage: "Processing forecast data...",
    successMessage: "Forecast imported successfully!",
  });

  Phase 2: Consistency Fixes
Goal: Make all pages look, behave, and code the same way.

Task	Files Affected	Details
Remove Material Tailwind from ProductsPage	ProductsPage.tsx	Replace all MT imports with custom UI
Remove Material Tailwind from DashboardPage	DashboardPage.tsx	Replace all MT imports with custom UI
Remove react-hot-toast everywhere	PurchaseOrdersPage.tsx, DashboardPage.tsx	Replace with useToast
Fix all any types	ProductsPage, DashboardPage, PurchaseOrdersPage	Add proper interfaces
Remove duplicate PurchaseOrder interface	PurchaseOrdersPage.tsx	Use import from mrp.types.ts
Add skeleton loading to ProductsPage	ProductsPage.tsx	Match ForecastsPage/SohPage pattern
Add empty state to ProductsPage	ProductsPage.tsx	Use EmptyState component
Add error state to ProductsPage	ProductsPage.tsx	Match ForecastsPage/SohPage pattern
Uninstall Material Tailwind package	package.json	npm uninstall @material-tailwind/react
Uninstall react-hot-toast package	package.json	npm uninstall react-hot-toast
Phase 3: Shared Components
Goal: Extract repeated UI patterns into reusable components.

Component 1: ExportDropdown
Replaces: 60+ lines of identical dropdown JSX in ForecastsPage + SohPage
<ExportDropdown onExport={handleExport} disabled={data.length === 0} />

Component 2: PageHeader
Replaces: Inconsistent page header patterns across all pages
<PageHeader
  title="Purchase Orders"
  description="Manage all incoming customer orders."
  actions={
    <>
      <Button variant="secondary" onClick={onImport}>Import</Button>
      <Button variant="primary" onClick={onCreatePo}>Create New PO</Button>
    </>
  }
/>

Component 3: FilterToolbar
Replaces: Search bar + filter controls layout duplicated in 4 pages
<FilterToolbar
  searchPlaceholder="Search purchase orders..."
  searchValue={query}
  onSearchChange={setQuery}
  filters={
    <>
      <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <Select options={ITEMS_OPTIONS} value={limit} onChange={setLimit} />
    </>
  }
/>

Component 4: ResultsCount
Replaces: "Showing X of Y" text in ForecastsPage + SohPage
<ResultsCount filtered={filteredRows.length} total={totalProducts} />

Phase 4: Dashboard Cleanup
Goal: Extract inline sub-components from DashboardPage into separate files.

Component	Currently	Move To
RecentActivityCard	Inline in DashboardPage (~50 lines)	src/components/dashboard/RecentActivityCard.tsx
LowStockAlerts	Inline in DashboardPage (~60 lines)	src/components/dashboard/LowStockAlerts.tsx
TopItemsCard	Inline in DashboardPage (~50 lines)	src/components/dashboard/TopItemsCard.tsx
KPISkeleton	Inline function (~3 lines)	Keep inline or move to Skeleton component
ChartSkeleton	Inline function (~3 lines)	Keep inline or move to Skeleton component
TimeRangeFilter	Inline dropdown (~80 lines)	src/components/dashboard/TimeRangeFilter.tsx
Lines moved out of DashboardPage: ~290 lines → DashboardPage becomes orchestration-only

📊 Impact Summary
Metric	Before	After
UI Libraries	2 (Material Tailwind + Custom)	1 (Custom only)
Toast Systems	2 (react-hot-toast + useToast)	1 (useToast only)
any type violations	6+	0
Duplicated fetch logic	5 copies (~75 lines)	1 hook
Duplicated search logic	4 copies (~40 lines)	1 hook
Duplicated export code	2 copies (~120 lines)	1 component
Duplicated import code	2 copies (~40 lines)	1 hook
Modal state boilerplate	14 useState calls	4 useModal calls
Bundle dependencies removed	—	@material-tailwind/react, react-hot-toast
Total lines eliminated	—	~500+
⚠️ Risk Assessment
Risk	Likelihood	Impact	Mitigation
Breaking existing functionality	Medium	High	Test each page after changes
Custom UI components missing features that Material Tailwind had	Low	Medium	Audit MT usage before removing
Toast migration breaks notifications	Low	Medium	Search for all toast. calls
Hooks introducing bugs	Low	Medium	Test hooks in isolation first
Merge conflicts with other branches	Medium	Low	Communicate with team
🧪 Testing Checklist
After each phase, verify:

 All pages load without errors
 Search/filter works on all pages
 CRUD operations work (create, edit, delete POs)
 Import works (Forecasts + SOH)
 Export works (Forecasts + SOH)
 Toast notifications appear correctly
 Dark mode works on all pages
 Pagination works on PurchaseOrdersPage
 Dashboard KPIs load with time range filter
 Dashboard charts render correctly
 No console errors
 No TypeScript errors (npm run build)

 📅 Execution Order
 Phase 1: Hooks          → Create all 7 hooks
                        → No page changes yet, just new files
                        → Test hooks work correctly

Phase 2: Consistency    → Migrate ProductsPage (full rewrite)
                        → Migrate DashboardPage (remove Material Tailwind)
                        → Migrate PurchaseOrdersPage (remove react-hot-toast)
                        → Fix all TypeScript violations
                        → Uninstall removed packages

Phase 3: Shared Comps   → Create ExportDropdown component
                        → Create PageHeader component
                        → Create FilterToolbar component
                        → Create ResultsCount component
                        → Refactor pages to use shared components

Phase 4: Dashboard      → Extract RecentActivityCard
                        → Extract LowStockAlerts
                        → Extract TopItemsCard
                        → Extract TimeRangeFilter
                        → Clean up DashboardPage

Final                   → Run full test checklist
                        → Update project-structure.txt
                        → Update documentation
                        → Create PR for review


Related Files
AI Code Assistant Rules
App Flow Diagram
Architecture Diagram
Project Structure