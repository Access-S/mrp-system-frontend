# AUDIT 02: React Patterns & Anti-Patterns

**Scope:** `src/components/pages`, `src/components/forms`, `src/components/modals`, `src/components/dialogs`, `src/components/tabs`, `src/components/Sidebar.tsx`, `src/App.tsx`  
**Standard:** "Would this pass at Google/Microsoft?"  
**Date:** 2025-03-14

---

## 1. Components Over 300 Lines

| File | Lines | Severity |
|------|-------|----------|
| `src/components/pages/DashboardPage.tsx` | 534 | 🔴 |
| `src/components/pages/PurchaseOrdersPage.tsx` | 469 | 🔴 |
| `src/components/modals/ExcelImportModal.tsx` | 461 | 🔴 |
| `src/components/pages/ProductDashboardPage.tsx` | 459 | 🔴 |
| `src/components/pages/ForecastsPage.tsx` | 457 | 🔴 |
| `src/components/pages/CreatePOPage.tsx` | 439 | 🔴 |
| `src/components/pages/ImportPage.tsx` | 441 | 🔴 |
| `src/components/Sidebar.tsx` | 428 | 🔴 |
| `src/components/pages/InventoryPage.tsx` | 406 | 🔴 |
| `src/components/pages/SohPage.tsx` | 341 | 🟠 |

**Impact:** Hard to test, review, and reason about; high risk of regression.  
**Fix:** Split into smaller components (e.g. DashboardPage: KPISection, ChartsSection, ActivitySection; extract hooks like `useDashboardData`, `useTimeRangeFilter`).

---

## Findings Table

| # | Severity | File:Line | Anti-Pattern | Impact | Fix |
|---|----------|-----------|--------------|--------|-----|
| 1 | 🔴 | **DashboardPage.tsx** (534 lines) | Component over 300 lines | Unmaintainable, hard to test | Extract sections + custom hooks |
| 2 | 🔴 | **PurchaseOrdersPage.tsx:345** | `loadPurchaseOrders` in useEffect deps but fetches have no AbortController | Unmounted component can set state; race conditions | Use AbortController in fetch, pass signal, abort in cleanup |
| 3 | 🔴 | **ProductsPage.tsx:33-35** | useEffect(() => loadProducts(), []) — `loadProducts` not in deps | Stale closure; eslint exhaustive-deps violation | Add loadProducts to deps and wrap loadProducts in useCallback, or call loadProducts inside effect |
| 4 | 🔴 | **DashboardPage.tsx:396-418, 420-442** | Two async useEffects (KPI + chart) with no AbortController | Unmount during fetch can set state; no cancel on dependency change | Use AbortController; abort previous request when selectedTimeRange changes or on unmount |
| 5 | 🔴 | **ProductDashboardPage, ForecastsPage, SohPage, InventoryPage, CreatePOPage** | Data-fetch useEffects without AbortController | Same as above across all pages | Add AbortController to all fetch/API calls; cleanup in useEffect return |
| 6 | 🔴 | **PoDetailModal.tsx:40-51, BomDetailModal.tsx:24-42** | getBomForProduct in useEffect with no abort/cleanup | setState after unmount; no cancel when modal closes quickly | AbortController + cleanup; or at least ignore stale responses with a ref/cancel flag |
| 7 | 🔴 | **ExcelImportModal.tsx:259-272** | getAllProducts in useEffect; deps [isReviewing, existingProducts.length] | fetchProducts not in deps; possible stale closure | Add fetchProducts to deps and wrap in useCallback, or move fetch logic inside effect |
| 8 | 🔴 | **PurchaseOrdersPage.tsx:747-753** | ConfirmationDialog given `handleOpen` prop but component expects `onCancel` | Cancel/close does nothing; dialog cannot be closed via cancel/overlay | Pass `onCancel={() => handleOpenDeleteConfirm(null)}` (dialog API uses onCancel, not handleOpen) |
| 9 | 🟠 | **EditPoForm.tsx:54-73** | useState for calculatedShippers, systemAmount, amountDifference, isAmountMismatch | Derived state stored in state; can get out of sync; extra re-renders | Compute with useMemo from formData + po; remove the four useState and second useEffect |
| 10 | 🟠 | **DashboardPage.tsx:212, 278** | LowStockAlerts/TopItemsCard use key={index} in list | Unstable keys; React reconciliation and focus/state bugs when list order changes | Use alert.productId or item.id or (productCode + index) if no id |
| 11 | 🟠 | **DashboardPage.tsx:341-342, 459-464** | getTimeRangeLabel() called every render; timeRangeOptions recreated; KPISkeleton key={i} | Unnecessary re-renders; index as key in skeleton list | useMemo for timeLabel and timeRangeOptions; use stable key for skeletons (e.g. `skeleton-${i}` or accept index for static list) |
| 12 | 🟠 | **Sidebar.tsx** | No useCallback for handleOpen, openDrawer, closeDrawer; many inline onClick handlers | New function refs every render; child re-renders | useCallback for handlers; consider React.memo for list items if list is large |
| 13 | 🟠 | **App.tsx:76-79, 110-168** | console.log in render; renderNavbarContent recreated every render; inline onClick handlers | Log spam in prod; unnecessary re-renders; unstable handler refs | Remove console.log; useCallback for handlePageChange, handleViewProduct, handleBackToProducts; memoize renderNavbarContent or inline with stable handlers |
| 14 | 🟠 | **ProductsPage.tsx:41-50** | getAllProducts().catch only console.error; no error state | User sees nothing on API failure | Add error state; show error UI and retry option |
| 15 | 🟠 | **PoDetailModal.tsx:45-46, BomDetailModal.tsx:36-37** | getBomForProduct .catch(console.error) | No user-facing error for BOM load failure | Set error state; show message + retry in modal |
| 16 | 🟠 | **BomManagementTab.tsx:52-56** | useEffect(..., [product]); loadBomComponents not in deps | Object reference change can cause duplicate or missing fetches; eslint deps | useCallback(loadBomComponents, [product?.productCode]); add to effect deps |
| 17 | 🟠 | **PoDetailModal.tsx:50** | useEffect deps include components.length | Effect can re-run when components set; fragile dependency | Depend on open and po?.product?.productCode only; reset components when open becomes false inside effect |
| 18 | 🟠 | **ProductDashboardPage.tsx:125-132, 138-152** | handleDeleteProduct / handleDeleteComponent use alert() for errors | Poor UX; blocks UI | Use toast or in-component error state |
| 19 | 🟠 | **ForecastsPage.tsx:432** | Table.Row key={`${row.productCode}-${rowIndex}`} | Index in key when productCode might duplicate or reorder | Use row.productCode only, or stable row id if available |
| 20 | 🟠 | **SohPage.tsx:279** | key={record.id \|\| index} | Fallback to index when id missing | Ensure API returns stable id; avoid index as fallback for dynamic lists |
| 21 | 🟠 | **ImportPage.tsx:307, 424, 511** | key={index} for parsedData rows and validation/import error rows | Unstable keys; reorder/update can break focus and state | Use row.po_number + index or row identifier if available |
| 22 | 🟠 | **ExcelImportModal.tsx:655, 670** | FILE_REQUIREMENTS/PRE_IMPORT_CHECKLIST map with key={index} | Minor (static lists) but inconsistent with best practice | Use option key from content (e.g. requirement.text or item) |
| 23 | 🟡 | **PurchaseOrdersPage.tsx:139** | TableSkeleton rows key={index} | Index as key in static skeleton | Acceptable for static placeholder; prefer key={`skeleton-${index}`} for clarity |
| 24 | 🟡 | **InventoryPage.tsx:181-188** | document.createElement("a"), link.click(), appendChild/removeChild for CSV export | Direct DOM for download link | Acceptable pattern for file download; keep but document; consider using library (e.g. file-saver) |
| 25 | 🟡 | **ConfirmationDialog.tsx:38** | handleConfirmClick wraps onConfirm() with no extra logic | Unnecessary wrapper; inline onClick={onConfirm} | Remove handleConfirmClick; use onClick={onConfirm} |
| 26 | 🟡 | **CreatePoForm.tsx, EditPoForm.tsx, DespatchPoForm.tsx** | Inline onChange handlers (e) => setX(e.target.value) | New function per render for each input | useCallback for single handleChange(field, value) or accept minor cost for simple forms |
| 27 | 🟡 | **DashboardPage, ForecastsPage, SohPage, etc.** | Pages own both data fetching and presentation | Mixed concerns; hard to test and reuse | Extract data layer to custom hooks (e.g. usePurchaseOrders, useDashboardData); keep UI in presentational components |
| 28 | 🟡 | **BomManagementTab.tsx:65-71** | filteredComponents = components.filter(...) without useMemo | Filter runs every render | useMemo with [components, searchQuery] deps |
| 29 | 🟢 | **Sidebar.tsx** | Duplicate markup for drawer vs desktop list | DRY violation; more to maintain | Extract shared NavList component used by both Drawer and aside |
| 30 | 🟢 | **App.tsx** | selectedProductCode + selectedProductDescription as separate state | Could be one object | useState<{ code: string; description: string \| null } \| null> or useMemo for derived display string |

---

## Summary by Severity

- **🔴 Critical:** 8 (AbortController, dependency bugs, prop API mismatch, component size)
- **🟠 High:** 14 (derived state, keys, error/loading UX, deps, alerts)
- **🟡 Medium:** 6 (minor keys, DOM for download, wrappers, mixed concerns, useMemo)
- **🟢 Low:** 2 (DRY, state shape)

---

## Recommended Priorities

1. **Fix ConfirmationDialog usage** in PurchaseOrdersPage (onCancel vs handleOpen) — user-facing bug.
2. **Add AbortController** to all data-fetching useEffects and pass signal; cleanup on unmount and when deps change.
3. **Fix useEffect dependency arrays** (ProductsPage, BomManagementTab, ExcelImportModal, PoDetailModal) and avoid derived state in EditPoForm.
4. **Replace index keys** with stable IDs in dynamic lists (DashboardPage, ImportPage, ForecastsPage, SohPage).
5. **Add error (and where missing, loading) states** for API calls (ProductsPage, PoDetailModal, BomDetailModal, BomManagementTab); replace alert() with toast or error UI.
6. **Break up components >300 lines** (DashboardPage, PurchaseOrdersPage, ProductDashboardPage, CreatePOPage, ExcelImportModal, Sidebar) into smaller components and hooks.
7. **Remove console.log** from App.tsx and any other production code.
8. **Memoize handlers and derived values** where profiling shows benefit (Sidebar, App, DashboardPage).

---

*End of Audit 02*
