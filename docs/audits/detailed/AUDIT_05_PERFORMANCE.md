# AUDIT 05: Performance

**Standard:** "Would this pass performance review at Google/Microsoft?"  
**Scope:** Bundle size, rendering, network, memory, code splitting, lists, assets, caching.  
**Date:** 2025-03-14

---

## Summary Table

| # | Severity | Category | Finding | Estimated Impact | Fix |
|---|----------|----------|---------|------------------|-----|
| 1 | 🔴 | Bundle size | **No code splitting:** All 12+ page components and dashboard charts are imported eagerly in `App.tsx`. No `React.lazy` or dynamic `import()` for routes. | Large initial bundle; slow FCP/TTI on slow networks. | Use `React.lazy(() => import('./pages/DashboardPage'))` and `<Suspense>` for each page; lazy-load testing pages and heavy features (Import, Forecasts, SOH). |
| 2 | 🔴 | Bundle size | **Heavy libraries loaded eagerly:** `xlsx`, `jspdf`, `jspdf-autotable`, `file-saver`, and `apexcharts` are imported at module load in services and dashboard components. They are only needed on specific pages (Export, Forecasts, Import, Dashboard charts). | ~500KB+ of JS parsed/executed on first load even when user never visits those pages. | Dynamic `import()` for export/forecast/import flows and for chart components (e.g. load ApexCharts only when Dashboard or KPICard with sparkline is rendered). |
| 3 | 🔴 | Bundle size | **No vendor/chunk splitting in Vite:** `vite.config.ts` has no `build.rollupOptions.output.manualChunks`. React, Material-Tailwind, ApexCharts, and app code can end up in one or few large chunks. | Poor caching; any app change invalidates large vendor chunk; slower incremental loads. | Add `manualChunks` (e.g. `vendor-react`, `vendor-ui`, `vendor-charts`, `vendor-xlsx`) and consider `chunkSizeWarningLimit` to catch regressions. |
| 4 | 🟠 | Bundle size | **Unused dependencies:** `react-router-dom` and `react-flatpickr` are in `package.json` but never imported. `dashboard.service.ts` imports `supabase` but never uses it (all fetches use raw `fetch` to hardcoded URLs). | Dead code and larger `node_modules`/bundle. | Remove `react-router-dom` and `react-flatpickr`; remove unused `supabase` import from `dashboard.service.ts` (or delete if Supabase is unused). |
| 5 | 🟠 | Bundle size | **@material-tailwind/react used widely:** Many components import from `@material-tailwind/react` (Sidebar, modals, forms, pages). Library is heavy; tree-shaking is limited by package structure. | Significant vendor weight and duplicated styling patterns. | Audit bundle with `vite build --mode production` and `rollup-plugin-visualizer`; consider replacing with lighter headless UI + Tailwind (e.g. Radix, or custom) for critical tree. |
| 6 | 🔴 | Rendering | **AppLayout re-renders all children on any state change:** `activePage`, `selectedProductCode`, etc. live in `App.tsx`; no `React.memo` on page components. Changing page or product causes full tree re-render. | Unnecessary work when switching tabs or updating unrelated state. | Wrap page components in `React.memo`; consider moving page state to a router or context that only notifies the active page. |
| 7 | 🟠 | Rendering | **Inline object/array creation in JSX causing re-renders:** `App.tsx` creates `pageTitles` object and `ToasterPortal` creates `containerStyle`/`toastOptions` objects every render. `App.tsx` passes inline arrow handlers (e.g. `onCreatePo={() => handlePageChange('create-po')}`) to pages. | Child components that depend on these props re-render every time; can break memoization. | Move `pageTitles` to module-level constant or `useMemo`; memoize toaster options; use `useCallback` for handlers passed to pages (e.g. `onCreatePo`). |
| 8 | 🟠 | Rendering | **Console.log in render path:** `App.tsx` has `console.log('🔵 AppLayout rendered...')` and `console.log('🟡 Changing page...')` in render and handler. | Dev noise; in some builds log arguments can retain references and affect GC. | Remove or guard with `if (import.meta.env.DEV)`. |
| 9 | 🟡 | Rendering | **Heavy components not memoized:** `RecentActivityCard`, `KPISkeleton`, `ChartSkeleton` and other inner components in `DashboardPage.tsx` are not wrapped in `React.memo`. Theme/activities changes cause full re-render of list items. | Extra work on dashboard when only one section changes. | Wrap list item components and skeletons in `React.memo` where props are stable. |
| 10 | 🟡 | Rendering | **Sidebar not memoized:** `Sidebar` receives `activePage` and `setActivePage`. Parent `AppLayout` re-renders frequently; Sidebar re-renders and re-creates large JSX tree (duplicated drawer + desktop nav). | Unnecessary CPU on every app state change. | Wrap `Sidebar` in `React.memo`; ensure `setActivePage` is stable (e.g. from `useState` or wrapped in `useCallback`). |
| 11 | 🔴 | Network | **No client-side data cache:** No React Query, SWR, or manual cache. Every navigation to Dashboard, Products, Purchase Orders, Inventory, Forecasts, SOH triggers full refetch. Same data (e.g. products) fetched on multiple pages. | Redundant requests; slower UX; unnecessary server load. | Introduce a data layer (e.g. React Query or SWR) with stale-while-revalidate, shared keys for products/POs, and prefetch on hover or route preload. |
| 12 | 🟠 | Network | **Dashboard double-fetch on mount:** `DashboardPage` runs two separate `useEffect` hooks that each call `fetchDashboardData` (KPI and charts) with no request deduplication. Same API (or same backend data) may be hit twice. | Duplicate network and backend work on dashboard load. | Single effect that fetches dashboard data once and distributes to KPI and chart state; or use a cache/deduplication layer so identical in-flight requests share one promise. |
| 13 | 🟠 | Network | **No AbortController for fetch:** `api.service.ts` and `dashboard.api.ts` use raw `fetch()` with no `AbortController`. When user navigates away or component unmounts, in-flight requests are not cancelled. | Wasted bandwidth and possible state updates after unmount. | Add `signal` from `AbortController` to all fetch calls; create controller in `useEffect` and `abort()` in cleanup. Use in dashboard, product, PO, and other data-fetching effects. |
| 14 | 🟡 | Network | **Hardcoded API base URLs in dashboard.service:** `dashboard.service.ts` uses `fetch('https://mrp-1.onrender.com/api/...')` instead of shared `API_BASE_URL`. Duplicates config and bypasses any central fetch/abort logic. | Inconsistent config; harder to add caching/abort in one place. | Use shared API client or `API_BASE_URL` from env; migrate dashboard to use `api.service` (or shared client) so AbortController and caching can be applied uniformly. |
| 15 | 🟡 | Network | **Products API has no pagination:** `product.service.ts` `getAllProducts()` fetches `/products` with no limit. Products page loads full list and filters client-side. | Large payloads and memory for big catalogs; slower first load. | Add server-side pagination (and optional search) to products API; use paginated API on Products page and consider infinite scroll or virtualized list. |
| 16 | 🟡 | Network | **Auto-refresh intervals are fixed:** Dashboard uses two `setInterval(..., 5 * 60 * 1000)` for KPI and chart refresh. No visibility or focus awareness. | Requests run in background when tab is hidden or user is idle. | Use Page Visibility API or document focus to pause refresh when tab is hidden; consider longer interval or no interval when not visible. |
| 17 | 🟠 | Memory | **Toast exit timeout not cleared on unmount:** In `Toast.tsx`, `handleClose` calls `setTimeout(() => onClose(id), 200)`. If the toast is removed from the tree before 200ms (e.g. auto-dismiss), the timeout still fires and can call `removeToast` after unmount. | React warning "Can't perform state update on unmounted component"; possible stale closure. | Store timeout id in a ref; clear it in `useEffect` cleanup so that on unmount the timeout is cancelled. |
| 18 | 🟡 | Memory | **ToastContext auto-dismiss timeouts never cancelled:** When `addToast` is called with `duration > 0`, a `setTimeout(removeToast, duration)` is scheduled. If the toast is manually closed earlier, the timer is not cleared. | Minor: timer fires later and calls `removeToast(id)` (idempotent but unnecessary). | Store timer ids in a ref (e.g. Map by toast id) and clear on manual remove or unmount. |
| 19 | 🟡 | Memory | **Dashboard service holds no ref to in-flight requests:** If user switches page before dashboard fetch completes, the promise still resolves and could try to update state. Combined with no AbortController, this risks setState after unmount. | Potential memory leak and React warnings. | Use AbortController in fetch and ignore results when `signal.aborted`; or track mounted ref in effect and only call setState if still mounted. |
| 20 | 🔴 | Code splitting | **No React.lazy anywhere:** Entire app is synchronous imports. No lazy loading of routes or heavy features. | All pages and heavy libs in initial bundle. | Lazy-load every page component and wrap in `<Suspense fallback={...}>`; lazy-load Import, Forecasts, SOH, and Export/Chart-heavy views. |
| 21 | 🔴 | Code splitting | **Heavy libraries not dynamically imported:** `xlsx`, `jspdf`, `apexcharts` are required at top level in `export.service.ts`, `forecast.service.ts`, and chart components. | Eager parse/execution of large dependencies. | Use `const loadXlsx = () => import('xlsx')` (and similar) at call sites (e.g. export button click or route enter); await before use. |
| 22 | 🟠 | List performance | **Products table has no virtualization:** `ProductsPage` renders `filteredProducts.map(...)` for every product in a plain `<table>`. No pagination or virtual list. | With 1000+ products: large DOM, slow scroll and re-renders. | Add server-side pagination and/or client virtualization (e.g. `@tanstack/react-virtual` or `react-window`) for the product list. |
| 23 | 🟡 | List performance | **Purchase Orders table renders full page in DOM:** Up to 100 rows per page are rendered as real DOM nodes. No virtualization. | With 50–100 rows, acceptable but not scalable; heavier on low-end devices. | For 50+ rows consider virtualizing table body (fixed header + virtualized body) to limit DOM nodes. |
| 24 | 🟡 | List performance | **Forecasts and SOH tables:** Same pattern as above—full array mapped to rows. If row counts grow, same issues as Products/PO. | Scalability and jank on large datasets. | Add server pagination and/or virtualize long lists. |
| 25 | 🟢 | Asset | **Tailwind content paths:** `tailwind.config.js` has `content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`. Unused CSS should be purged. | Minimal risk of missing purges. | Keep as is; run production build and spot-check that unused utilities are not present in CSS if needed. |
| 26 | 🟡 | Asset | **No font loading strategy:** `index.html` has no preload for fonts; no `font-display` or subsetting. If custom fonts are added later, FOUT/FOIT can hurt LCP. | N/A until custom fonts are used. | When adding fonts: use `<link rel="preload">`, `font-display: optional` or `swap`, and subset fonts if possible. |
| 27 | 🟡 | Asset | **External image in Sidebar:** Sidebar uses `<img src="https://docs.material-tailwind.com/img/logo-ct-dark.png">`. No dimensions, no lazy load. | Layout shift; request to external domain. | Use local asset or import; set width/height; consider `loading="lazy"` for below-the-fold. |
| 28 | 🔴 | Caching | **No HTTP cache headers configured:** Application does not control cache headers; relies on server/defaults. No explicit cache strategy for API or static assets. | Missed opportunity for browser cache of static assets and idempotent GETs. | Configure server (or proxy) to send Cache-Control for static assets (e.g. 1y with content hash) and appropriate headers for API (e.g. short cache or no-store for mutable data). |
| 29 | 🔴 | Caching | **No client-side data cache:** No React Query, SWR, or manual in-memory cache for API responses. Every visit refetches. | Repeated network round-trips and slower UX. | Add React Query or SWR with stale-while-revalidate and shared query keys for products, POs, dashboard, etc. |
| 30 | 🟡 | Caching | **Vite build uses content hashing by default:** Production build outputs hashed filenames for chunks. Good for cache busting. | N/A. | Confirm in `dist/` that JS/CSS have hashes; ensure server sends long-lived Cache-Control for these files. |
| 31 | 🟢 | Caching | **No service worker:** No PWA/offline layer. Acceptable for current scope. | N/A. | Add SW only if offline or installability is required. |

---

## Severity Legend

- **🔴 Critical:** Would fail a strict performance bar; clear win to fix.
- **🟠 High:** Meaningful impact on bundle, runtime, or network; should be addressed.
- **🟡 Medium:** Noticeable at scale or on weak devices; plan a fix.
- **🟢 Low / Info:** Minor or already in good shape.

---

## Recommended Priorities

1. **Quick wins:** Remove unused deps (`react-router-dom`, `react-flatpickr`), remove `console.log` and unused `supabase` import, fix Toast timeout cleanup, add AbortController to fetch.
2. **Bundle:** Add `manualChunks` in Vite; lazy-load all pages and heavy libs (xlsx, jspdf, apexcharts).
3. **Data layer:** Introduce React Query or SWR; deduplicate dashboard fetch; add request cancellation.
4. **Rendering:** Memoize `Sidebar` and page components; stabilize `App.tsx` props and handlers.
5. **Lists:** Add products API pagination and virtualize Products list; consider virtualizing PO/Forecasts/SOH tables if row counts grow.
6. **Assets/caching:** When adding fonts or more static assets, add preload and cache headers; confirm Vite hashing for long-term caching.

---

## Files to Change (Summary)

| Area | Files |
|------|--------|
| Bundle / code split | `vite.config.ts`, `App.tsx`, `src/main.tsx`, `export.service.ts`, `forecast.service.ts`, chart components, `package.json` |
| Rendering / memo | `App.tsx`, `Sidebar.tsx`, `DashboardPage.tsx`, page components |
| Network / cache | `api.service.ts`, `dashboard.api.ts`, `dashboard.service.ts`, `DashboardPage.tsx`, data-fetching pages |
| Memory | `Toast.tsx`, `ToastContext.tsx`, effects using fetch |
| Lists | `ProductsPage.tsx`, `product.service.ts`, `PurchaseOrdersPage.tsx`, ForecastsPage, SohPage, InventoryPage |

---

*End of Audit 05 — Performance*
