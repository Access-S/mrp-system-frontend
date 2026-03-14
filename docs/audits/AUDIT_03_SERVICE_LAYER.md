# AUDIT 03: Service Layer — Enterprise-Grade Assessment

**Standard:** "Would this pass at Google/Microsoft?" If not — it's a finding.

**Scope:** All service files under `src/services/`.

**Audit date:** 2025-03-14.

---

## 1. api.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| (module load) | — | Env `VITE_API_URL` + fallback localhost | — | — | — | **Yes** `console.log('🔗 API Base URL:', …)` | Debug log in production; fallback hardcodes `localhost:5000` |
| `ApiClient.request` | `fetch` | `this.baseURL` (env) | try/catch, throws on `!response.ok` | `Promise<T>` | No | No | No per-status handling (400/401/403/404/500); generic message only; non-JSON error body ignored |
| `ApiClient.get` | `this.request` | baseURL | Via request | `Promise<T>` | No | No | — |
| `ApiClient.post` | `this.request` | baseURL | Via request | `Promise<T>` | No | No | Param `data?: any` — **any** type |
| `ApiClient.patch` | `this.request` | baseURL | Via request | `Promise<T>` | No | No | Param `data?: any` — **any** type |
| `ApiClient.delete` | `this.request` | baseURL | Via request | `Promise<T>` | No | No | — |
| `ApiClient.getBaseURL` | — | — | — | `string` | — | No | — |
| `fetchPurchaseOrders` | apiClient.get | Env | None at call site (throws from client) | Yes `PaginatedApiResponse<PurchaseOrder>` | No | No | — |
| `fetchPoById` | apiClient.get | Env | None | Yes | No | No | — |
| `createPo` | apiClient.post | Env | None | Yes | No | No | — |
| `updatePo` | apiClient.patch | Env | None | Yes | No | No | — |
| `updatePurchaseOrderStatus` | apiClient.patch | Env | None | Yes | No | No | `body: Record<string, any>` |
| `deletePo` | apiClient.delete | Env | None | Yes | No | No | — |
| `fetchBomForProduct` | apiClient.get | Env | None | **Yes but `Promise<any[]>`** | No | No | **any** return; **DEAD CODE** — never imported (callers use product.service.getBomForProduct) |
| `handleApiError` | — | — | N/A | `string` | — | No | — |
| `isApiResponse` | — | — | N/A | type guard | — | No | Param `response: any` |
| `isPaginatedResponse` | — | — | N/A | type guard | — | No | Param `response: any` |

**Interfaces:** `ApiResponse<T = any>`, `PaginatedApiResponse<T = any>` — default **any**. `ApiError` used in request.

---

## 2. purchaseOrder.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `checkPoNumberExists` | None (TODO) | — | try/catch, returns true on error | Yes `Promise<boolean>` | No | **Yes** log + error | **TODO/placeholder** — always returns false; swallows error and returns true "to be safe" |
| `createNewPurchaseOrder` | apiCreatePo (api) | Via api.service | try/catch, rethrow | Yes | No | **Yes** log + error | — |
| `getAllPurchaseOrders` | apiFetchPurchaseOrders | Via api | try/catch | Yes | No | **Yes** log + error | — |
| `getPurchaseOrderById` | apiFetchPoById | Via api | try/catch | Yes | No | **Yes** log + error | — |
| `updatePoStatus` | apiUpdateStatus | Via api | try/catch | Yes | No | **Yes** log + error | — |
| `resolvePoCheck` | updatePoStatus | Via api | try/catch | Yes | No | **Yes** log + error | — |
| `despatchPo` | updatePoStatus only | Via api | try/catch | Yes | No | **Yes** log + error | **TODO** — delivery details ignored; only status updated |
| `updatePurchaseOrder` | apiUpdatePo | Via api | try/catch | Yes | No | **Yes** log + warn + error | — |
| `reopenDespatchedPo` | updatePoStatus | Via api | try/catch | Yes | No | **Yes** log + error | **TODO** — "temporarily skipping delivery details" |
| `deletePurchaseOrder` | apiDeletePo | Via api | try/catch | Yes | No | **Yes** log + error | — |
| `getTotalPurchaseOrdersCount` | None (TODO) | — | try/catch, returns 0 | Yes | No | **Yes** log + error | **TODO/placeholder** — always returns 0 |
| `getFilteredPurchaseOrders` | None (TODO) | — | try/catch | Yes | No | **Yes** log + error | **TODO/placeholder** — always returns [] |
| `getPurchaseOrdersPaginated` | getAllPurchaseOrders | Via api | try/catch, returns empty on error | Yes | No | **Yes** error | Swallows error and returns empty payload — **dead code** (not used by any component) |
| `calculatePoAmounts` | — | — | Throws on invalid | Yes | — | No | Pure util — **dead code** (not imported) |
| `validatePoData` | — | — | — | Yes | — | No | Pure util — **dead code** (not imported) |
| `getPoStatusColor` | — | — | — | Yes | — | No | **Dead code** (not imported) |
| `formatPoStatus` | — | — | — | Yes | — | No | **Dead code** (not imported) |

---

## 3. product.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `getAllProducts` | apiClient.get | Env (via api.service) | try/catch, rethrow | Yes `Promise<Product[]>` | No | **Yes** error | — |
| `getProductByCode` | apiClient.get | Env | try/catch | Yes | No | **Yes** error | 404 handling via message string match (fragile) |
| `getBomForProduct` | apiClient.get | Env | try/catch | Yes `Promise<BomComponent[]>` | No | **Yes** error | Returns **unwrapped** array; BomDetailModal expects `{ success, data }` → **consumer bug** (modal always gets [] if it checks response.success) |
| `createProduct` | apiClient.post | Env | try/catch | Yes | No | **Yes** error | — |
| `updateProduct` | apiClient.patch | Env | try/catch | Yes | No | **Yes** error | — |
| `deleteProduct` | apiClient.delete | Env | try/catch | Yes | No | **Yes** error | — |

---

## 4. forecast.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| (module) `API_BASE_URL` | — | **Hardcoded** `'https://mrp-1.onrender.com/api'` | — | — | — | — | **CRITICAL** — must use `VITE_API_URL` |
| `importForecastData` | **raw fetch** | **Hardcoded** | try/catch | Yes | No (FormData) | **Yes** log + error | No status-code handling; assumes JSON error body |
| `finalizeForecastReview` | **raw fetch** | **Hardcoded** | try/catch | Yes (results: any) | No | **Yes** log + error | `results: any` in return type |
| `getWeeklyForecasts` | **raw fetch** | **Hardcoded** | try/catch | **Partial** — `rows: any[]`, `summary: any` | No | **Yes** log + warn + error | **any** types; on unexpected format returns empty (no throw) |
| `getAllForecasts` | getWeeklyForecasts | Hardcoded | try/catch | Yes | **Yes** snake→camel (product_code etc.) | **Yes** error | — |
| `getForecastsWithProductData` | getWeeklyForecasts | Hardcoded | try/catch, rethrows | Yes | Yes (row shape) | **Yes** error | — |
| `calculateDemandHours` | — | — | — | Yes | — | No | Pure |
| `formatWeekDate` | — | — | try/catch (date parse) | Yes | — | No | Pure |
| `getAllForecastsTable` | getWeeklyForecasts | Hardcoded | — | No explicit | No | No | Thin wrapper — **dead code** (only exported, not used) |

---

## 5. mrp.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `calculateInventoryProjections` | None (pure) | — | — | Yes | — | **Yes** log x2 | No HTTP; logging in pure logic |
| `runCompleteAnalysis` | product/forecast/component services | Via those services | try/catch | Yes | No | **Yes** log x3 + error | No request cancellation — **race risk** if unmount/cancel not supported |
| `getMrpSummary` | — | — | — | Yes | — | No | Pure |
| `filterByHealth` / `filterByPriority` / `searchProjections` | — | — | — | Yes | — | No | Pure |
| `generatePurchaseRecommendations` | — | — | — | Yes | — | No | Pure |
| `exportMrpData` | — | — | — | **Returns `any[]`** | — | No | **any** in export shape |
| `calculateDaysOfCoverage` etc. (utils) | — | — | — | Yes | — | No | Pure |

---

## 6. soh.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `importSohData` | **raw fetch** | apiClient.getBaseURL() | try/catch | Yes | No | **Yes** log + error | Correct use of shared base URL; no per-status handling |
| `getSohData` | apiClient.get | Env | try/catch | Yes | No | **Yes** log + warn + error | **`apiClient.get<any>`** — any; assumes `response.success` and `response.summary`/`response.data` shape; on failure returns empty (no throw) |

---

## 7. component.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `getAllSoh` | apiClient.get | Env | try/catch | Yes | **Yes** snake→camel (part_code, stock_on_hand, etc.) | **Yes** log + error | Uses `ApiResponse<any[]>` |
| `getSohSummary` | apiClient.get | Env | try/catch | Yes (but `latestImport: any`) | No | **Yes** log + error | **any** in return type |
| `searchSoh` | apiClient.get | Env | try/catch, returns [] on error | Yes | Yes | **Yes** log + error | Swallows errors and returns [] |
| `getSohByPartCode` | apiClient.get | Env | try/catch, returns null on error | Yes | Yes | **Yes** log + error | Swallows errors |
| `getInventorySummary` | getSohSummary | — | try/catch | Yes | No | **Yes** error | **TODO/placeholder** — totalStock, lowStockCount, averageStock always 0 |

---

## 8. dashboard.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| (imports) | — | — | — | — | — | — | **Unused import: `supabase`** — never used (should use REST API only) |
| `getDashboardStats` | **raw fetch** x4 | **Hardcoded** `'https://mrp-1.onrender.com/api/...'` x4 | try/catch, returns zeroed stats on error | Yes | No (uses snake_case from API) | **Yes** log + warn + error | **CRITICAL** — 4 hardcoded URLs; no apiClient; mixed snake/camel in code (product_code vs productCode) |
| `getDashboardChartData` | None | — | try/catch | Yes | No | **Yes** error | **TODO/placeholder** — returns empty arrays; no backend call |
| `getRecentActivity` | **raw fetch** | **Hardcoded** URL | try/catch, returns [] on error | **Yes but `Promise<any[]>`** | Yes (map to activity shape) | **Yes** log + error | **any[]**; hardcoded URL |
| `getPerformanceMetrics` | None | — | try/catch | Yes | No | **Yes** log + error | **TODO/placeholder** — returns all zeros |

**Note:** DashboardPage uses **dashboard.api** (fetchDashboardData), not dashboard.service. So getDashboardStats, getDashboardChartData, getRecentActivity, getPerformanceMetrics may be **dead or legacy** unless used elsewhere.

---

## 9. dashboard.api.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `fetchDashboardData` | **raw fetch** | Env `API_BASE_URL` | try/catch, rethrow | Yes | No | **Yes** error | Not using apiClient (inconsistent); generic throw; no 4xx/5xx handling |
| `fetchQuickStats` | **raw fetch** | Env | try/catch, rethrow | Yes `Promise<DashboardKPIs>` | No | **Yes** error | **Dead code** — not imported/called anywhere; assumes `result.data` without checking success |

---

## 10. export.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `exportToCSV` | None (file-saver) | — | try/catch, throw | Yes `void` | — | **Yes** log + error | — |
| `exportToExcel` | None | — | try/catch, throw | Yes | — | **Yes** log + error | `worksheetData: any[][]`, columnStyles `Record<number, any>` |
| `exportToPDF` | None | — | try/catch, throw | Yes | — | **Yes** log + error | — |
| `exportData` | Delegates to above | — | Via callees | Yes | — | No | — |
| `exportForecastData` | exportData | — | Via callees | Yes | — | No | — |
| `ExportService` class | — | — | — | — | — | No | Thin wrapper — acceptable |

---

## 11. import.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `getImportTemplate` | **raw fetch** | Env `API_BASE_URL` | **None** — only throws on !response.ok | Yes | No | No | No try/catch; no 4xx/5xx body handling; **dead code** (not used by ImportPage) |
| `validateImportData` | **raw fetch** | Env | **None** | Yes | No | No | No try/catch; network errors unhandled |
| `importPurchaseOrders` | **raw fetch** | Env | **None** | Yes | No | No | No try/catch |
| `parseCSV` | — | — | Throws on invalid | Yes | — | No | Pure; `row: any` in loop |
| `parseTSV` | — | — | Via parseCSV | Yes | — | No | Pure |

---

## 12. bom.service.ts

| Function | Call Method | URL Source | Error Handling | Return Type | Transform | Console Logs | Issues |
|----------|-------------|------------|----------------|-------------|-----------|--------------|--------|
| `addComponent` | apiClient.post | Env | try/catch | Yes | No | **Yes** log + error | — |
| `updateComponent` | apiClient.patch | Env | try/catch | Yes | No | **Yes** log + error | — |
| `deleteComponent` | apiClient.delete | Env | try/catch | Yes | No | **Yes** log + error | — |
| `getComponents` | apiClient.get | Env | try/catch | Yes | No | **Yes** log + error | Returns [] on success-with-empty; throws on error |

---

## Summary Table

| Service File | Functions | Hardcoded URLs | Direct Supabase | any Types | Console Logs | TODOs | Dead Code |
|--------------|-----------|----------------|-----------------|-----------|--------------|-------|-----------|
| api.service.ts | 14 exports + class | 0 (fallback localhost only) | No | Yes (ApiResponse default, fetchBomForProduct, post/patch body, isApiResponse params) | 1 (module load) | 0 | fetchBomForProduct |
| purchaseOrder.service.ts | 20+ | 0 | No | No | Many | 5 (checkPoNumberExists, despatchPo, reopenDespatchedPo, getTotalPurchaseOrdersCount, getFilteredPurchaseOrders) | getPurchaseOrdersPaginated, calculatePoAmounts, validatePoData, getPoStatusColor, formatPoStatus |
| product.service.ts | 6 class + 6 wrappers | 0 | No | No | All API methods | 0 | 0 |
| forecast.service.ts | 4 API + 4 util | **Yes (1 const)** | No | Yes (rows/summary/results) | Many | 0 | getAllForecastsTable |
| mrp.service.ts | 8 + utils | 0 | No | Yes (exportMrpData) | 4 in run/calculate | 0 | 0 |
| soh.service.ts | 2 class + 2 wrapper + 2 util | 0 | No | Yes (getSohData) | All | 0 | 0 |
| component.service.ts | 5 class + 4 wrapper | 0 | No | Yes (getSohSummary, getInventorySummary) | All | 1 (getInventorySummary) | 0 |
| dashboard.service.ts | 4 class + 4 wrapper | **Yes (4 URLs)** | **Import only, unused** | Yes (getRecentActivity) | All | 2 (getDashboardChartData, getPerformanceMetrics) | Possibly entire file if only dashboard.api is used |
| dashboard.api.ts | 2 | 0 | No | No | 2 | 0 | fetchQuickStats |
| export.service.ts | 5 + class | 0 | No | Yes (worksheetData, columnStyles) | 3 | 0 | 0 |
| import.service.ts | 3 API + 2 parser | 0 | No | Yes (parseCSV row) | 0 | 0 | getImportTemplate (unused) |
| bom.service.ts | 4 class + 4 wrapper | 0 | No | No | All | 0 | 0 |

---

## Explicit Checklist: JSDoc, Error Messages, HTTP Codes

| Service File | JSDoc (proper @param @returns) | Error message (user-friendly vs generic) | Handles 400/401/403/404/500 explicitly |
|--------------|-------------------------------|------------------------------------------|----------------------------------------|
| api.service.ts | No (only getBaseURL has brief comment) | Generic (status text or backend message) | No — only `!response.ok` + message |
| purchaseOrder.service.ts | Yes (class methods) | Generic via handleApiError | Via apiClient only |
| product.service.ts | Yes (class methods) | Generic | Via apiClient only |
| forecast.service.ts | Partial (importForecastData, etc. minimal) | Generic or backend message | No |
| mrp.service.ts | Yes (class + some utils) | Generic | N/A (no direct HTTP) |
| soh.service.ts | Minimal | Generic | No |
| component.service.ts | Yes (class methods) | Generic | Via apiClient only |
| dashboard.service.ts | Yes | Generic; on error returns zeroed/empty | No |
| dashboard.api.ts | No | Generic throw | No |
| export.service.ts | Yes (export functions) | Generic "Failed to export…" | N/A |
| import.service.ts | No | Generic throw from backend | No |
| bom.service.ts | Yes (class methods) | Generic | Via apiClient only |

**Verdict:** No service implements explicit 400/401/403/404/500 handling or user-friendly message mapping. JSDoc is present on most class-based services; missing or minimal on api.service, dashboard.api, import.service.

---

## Cross-Cutting Findings

### 1. Hardcoded URLs
- **forecast.service.ts:** `const API_BASE_URL = 'https://mrp-1.onrender.com/api'` — must use `import.meta.env.VITE_API_URL`.
- **dashboard.service.ts:** Four `fetch('https://mrp-1.onrender.com/api/...')` — must use apiClient or shared env base URL.

### 2. Direct Supabase
- **dashboard.service.ts:** Imports `supabase` but never uses it. Audit standard: use REST API only; remove import or refactor to API.

### 3. Inconsistent patterns
- **HTTP client:** api.service has ApiClient; forecast, dashboard.service, dashboard.api, import.service use raw `fetch`. Standard: single client (apiClient) for all REST.
- **Error handling:** api.service throws; soh/component sometimes return empty/zero instead of throwing; import.service has no try/catch.
- **Response shape:** Some return unwrapped data (e.g. product.service getBomForProduct returns array); BomDetailModal expects `{ success, data }` → contract mismatch and bug.

### 4. HTTP status handling
- **ApiClient:** Only checks `!response.ok` and uses a generic or server message. No explicit handling for 400, 401, 403, 404, 500 or user-facing messages.
- **Raw fetch callers:** Usually only check `!response.ok` and parse JSON error body; no status-specific logic.

### 5. Request cancellation
- **mrp.service.runCompleteAnalysis:** Uses `Promise.all` to fetch components, products, forecasts. No AbortController/signal — race condition risk if component unmounts or user triggers a new run.

### 6. Duplicate / overlapping responsibilities
- **BOM:** api.service has `fetchBomForProduct`; product.service has `getBomForProduct`; bom.service has `getComponents`. fetchBomForProduct is unused; product vs bom overlap.
- **Dashboard:** dashboard.service (hardcoded URLs, TODOs) vs dashboard.api (env URL, used by DashboardPage). Two parallel implementations.

### 7. JSDoc
- Most service methods have brief JSDoc (e.g. @param, @returns). Inconsistent depth; no @throws or error contract.

### 8. User-facing error messages
- Most errors rethrow `handleApiError(error)` or backend message. No mapping of status codes or error types to clear, user-friendly strings.

---

## Recommendations (Priority Order)

1. **Remove all hardcoded base URLs** — Use `VITE_API_URL` (and apiClient) in forecast.service and dashboard.service.
2. **Standardize on apiClient** — Replace raw `fetch` in forecast.service, dashboard.service, dashboard.api, import.service with apiClient (or a shared wrapper that uses env + same error/response contract).
3. **Fix or remove dead code** — fetchBomForProduct, fetchQuickStats, getImportTemplate, getPurchaseOrdersPaginated, calculatePoAmounts, validatePoData, getPoStatusColor, formatPoStatus; clarify if dashboard.service is still required vs dashboard.api.
4. **Resolve BomDetailModal contract** — Either have product.service return `ApiResponse<BomComponent[]>` or change BomDetailModal to treat result as array (and fix types).
5. **Eliminate `any`** — Replace in ApiResponse defaults, fetchBomForProduct, getSohData, getSohSummary, getRecentActivity, export.service, parseCSV; add proper types.
6. **Add explicit HTTP status handling** — In ApiClient (and any remaining fetch paths), handle 401 (auth), 403 (forbidden), 404 (not found), 5xx (server error) with consistent, user-friendly messages.
7. **Remove or gate console.log/warn/error** — Use a logger or build-time strip in production.
8. **Implement or remove TODOs** — checkPoNumberExists, despatchPo delivery details, reopenDespatchedPo, getTotalPurchaseOrdersCount, getFilteredPurchaseOrders, getDashboardChartData, getPerformanceMetrics, getInventorySummary (real metrics).
9. **Request cancellation** — Add AbortSignal support to apiClient and use in runCompleteAnalysis (and other long-running fetches) when the caller can cancel.
10. **Single dashboard path** — Consolidate on dashboard.api (or dashboard.service) and remove the other; ensure one uses env and apiClient.

---

*End of audit.*
