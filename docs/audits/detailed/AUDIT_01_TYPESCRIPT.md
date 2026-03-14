# TypeScript Type Safety Audit

**Scope:** `src/types/mrp.types.ts`, `src/services/`, `tsconfig.json`  
**Standard:** "Would this pass at Google/Microsoft?"  
**Date:** 2025-03-14

---

## Executive Summary

Type safety across the audited scope is **not enterprise-grade**. Strict mode is disabled, `any` is used extensively in services and shared types, and API response shapes are not consistently typed. Remediation is required before this would pass a strict TypeScript policy at a top-tier tech company.

---

## Findings Table

| # | Severity | File:Line | Issue | Fix |
|---|----------|-----------|--------|-----|
| 1 | 🔴 | tsconfig.json:13–27 | **Strict mode fully disabled** — `strict: false`, `noImplicitAny: false`, `strictNullChecks: false`, `strictFunctionTypes: false`, etc. | Set `"strict": true` (or enable `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `noImplicitReturns` individually). Prefer `noUncheckedIndexedAccess: true` for maximum safety. |
| 2 | 🔴 | api.service.ts:7 | **Generic default `any`** — `ApiResponse<T = any>` | Remove default: `ApiResponse<T>` and require explicit type at call sites, or use `ApiResponse<unknown>`. |
| 3 | 🔴 | api.service.ts:13 | **Generic default `any`** — `PaginatedApiResponse<T = any>` | Same as above: `PaginatedApiResponse<T>` or `PaginatedApiResponse<unknown>`. |
| 4 | 🔴 | api.service.ts:91 | **Explicit `any`** — `post<T>(endpoint, data?: any)` | Type as `data?: unknown` or a union of allowed body types (e.g. `Record<string, unknown>`). |
| 5 | 🔴 | api.service.ts:98 | **Explicit `any`** — `patch<T>(endpoint, data?: any)` | Same as above. |
| 6 | 🔴 | api.service.ts:212 | **Explicit `any`** — `body: Record<string, any>` in `updatePurchaseOrderStatus` | Use `Record<string, string \| undefined>` or a dedicated interface for the request body. |
| 7 | 🔴 | api.service.ts:236–241 | **Explicit `any`** — `fetchBomForProduct` returns `Promise<any[]>` and uses `ApiResponse<any[]>` | Return `Promise<BomComponent[]>` (or shared BOM type) and use `ApiResponse<BomComponent[]>`. |
| 8 | 🔴 | api.service.ts:252 | **Explicit `any`** — `isApiResponse<T>(response: any)` | Use `response: unknown` and narrow with type guards. |
| 9 | 🔴 | api.service.ts:256 | **Explicit `any`** — `isPaginatedResponse<T>(response: any)` | Same as above: `response: unknown`. |
| 10 | 🔴 | api.service.ts:173 | **Type assertion** — `poData[field as keyof typeof poData]` | Use a type-safe required-field check (e.g. `requiredFields` as `(keyof typeof poData)[]` and iterate with typed access). |
| 11 | 🟠 | soh.service.ts:97 | **Explicit `any`** — `apiClient.get<any>(...)` for SOH | Define `SohApiResponse` (e.g. `{ success: boolean; data: SohRecord[]; summary?: SohSummary }`) and use it. |
| 12 | 🟠 | soh.service.ts:101–105 | **API shape mismatch** — Code uses `response.summary` and `response.data`; `ApiResponse<T>` has no `summary` | Define a response type that includes `summary` (and optionally `data`) to match backend, and use it in `getSohData`. |
| 13 | 🔴 | import.service.ts:40 | **Explicit `any`** — `ImportTemplate.sampleRow: Record<string, any>` | Use `Record<string, unknown>` or a dedicated `ImportSampleRow` type. |
| 14 | 🔴 | import.service.ts:151 | **Explicit `any`** — `const row: any = {}` in CSV parser | Build row as `Partial<ImportRow>` or `Record<string, string \| number>` and validate/narrow before push. |
| 15 | 🟠 | import.service.ts:174 | **Type assertion** — `data.push(row as ImportRow)` | Validate row shape (e.g. with a type guard or zod/io-ts) and then assign; avoid unsound `as ImportRow`. |
| 16 | 🔴 | mrp.service.ts:363 | **Explicit `any`** — `exportMrpData(...): any[]` | Define `MrpExportRow` (or similar) with known keys and return `MrpExportRow[]`. |
| 17 | 🔴 | mrp.service.ts:382 | **Explicit `any` + type assertion** — `}, {} as any)` in reduce | Type accumulator as `Record<string, string \| number>` (or a dedicated interface for dynamic week columns). |
| 18 | 🟠 | mrp.service.ts:119 | **Non-null assertion** — `componentMasterMap.get(bomItem.partCode)!` | Check existence and throw or return early: `const data = componentMasterMap.get(...); if (!data) return;` (or use `assert` helper). |
| 19 | 🔴 | forecast.service.ts:25 | **Explicit `any`** — `ForecastImportResult.debug?: any` | Type as `unknown` or a specific debug shape; remove if unused. |
| 20 | 🔴 | forecast.service.ts:73 | **Explicit `any`** — `rawData: any[][]` from XLSX | Use `unknown[][]` and narrow when reading cells (e.g. `string \| number` per cell). |
| 21 | 🔴 | forecast.service.ts:105 | **Explicit `any`** — `const obj: any = {}` in Excel import | Use `Record<string, unknown>` or a typed object builder. |
| 22 | 🔴 | forecast.service.ts:150 | **Explicit `any`** — `Promise<{ ... results: any }>` in `finalizeForecastReview` | Define a `ForecastReviewResult` interface and use it for `results`. |
| 23 | 🔴 | forecast.service.ts:187–188 | **Explicit `any`** — `rows: any[]; summary: any` in `getWeeklyForecasts` return type | Define `WeeklyForecastRow` (or use existing) and a `ForecastSummary` type; use them in the return type. |
| 24 | 🔴 | forecast.service.ts:227 | **Explicit `any`** — `rows.map((row: any) => ...)` in `getAllForecasts` | Type `row` as the API row shape (e.g. interface with `product_code`, `description`, and index signature for week keys). |
| 25 | 🔴 | forecast.service.ts:326 | **Explicit `any`** — `rows.map((row: any) => ...)` in `getForecastsWithProductData` | Same: use a proper API row type instead of `any`. |
| 26 | 🔴 | component.service.ts:16 | **Explicit `any`** — `ApiResponse<any[]>` for SOH | Use `ApiResponse<SohRecord[]>` or a shared SOH response type; map to `Component[]` with typed mapping. |
| 27 | 🔴 | component.service.ts:48 | **Explicit `any`** — `getSohSummary()` return type has `latestImport: any` | Define `SohSummaryResponse` (or extend existing) with a typed `latestImport` (e.g. `{ id: string; createdAt: string; ... }`). |
| 28 | 🔴 | component.service.ts:77, 116 | **Explicit `any`** — `ApiResponse<any[]>` in search/getByPartCode | Use `ApiResponse<SohRecord[]>` (or backend DTO type) and map to `Component[]`. |
| 29 | 🟠 | dashboard.service.ts:82 | **Explicit `any`** — `po.statuses?.map((s: any) => s.status)` | Type `s` as `{ status: string }` or use `PoStatusEntry`; prefer typing the PO response (see #31). |
| 30 | 🔴 | dashboard.service.ts:183 | **Explicit `any`** — `getRecentActivity(limit): Promise<any[]>` | Define `RecentActivity` (id, type, title, description, timestamp, etc.) and return `Promise<RecentActivity[]>`. |
| 31 | 🟠 | dashboard.service.ts:51–58, 70–84 | **API shape mismatch** — Uses `po.product_code`, `po.ordered_qty_shippers`, `po.delivery_date`, `po.po_received_date` (snake_case) while `PurchaseOrder` is camelCase | Either type `allPOs` as a backend DTO (snake_case) and map to `PurchaseOrder`, or ensure API returns camelCase and type accordingly; align types with actual response. |
| 32 | 🔴 | export.service.ts:24 | **Explicit `any`** — `ExportOptions.data: Record<string, any>[]` | Use `Record<string, unknown>[]` or a generic `ExportOptions<T extends Record<string, unknown>>`. |
| 33 | 🔴 | export.service.ts:105 | **Explicit `any`** — `worksheetData: any[][]` for XLSX | Use `(string \| number)[][]` or a cell type union. |
| 34 | 🔴 | export.service.ts:244 | **Type assertion + `any`** — `}, {} as Record<number, any>)` in columnStyles reduce | Type as `Record<number, { cellWidth: number; halign: string }>` (or use `ColumnStyle` interface). |
| 35 | 🟡 | mrp.types.ts:74–75 | **Loose types** — `PurchaseOrder.currentStatus: string` and `statuses: string[]` | Use `currentStatus: PoStatus` and `statuses: PoStatus[]` for consistency and autocomplete. |
| 36 | 🟡 | mrp.types.ts:7 | **Loose type** — `BomComponent.partType: string` | Use union or enum (e.g. `'RAW_MATERIAL' \| 'COMPONENT' \| 'PACKAGING' \| 'CONSUMABLE' \| 'Bulk - Supplied'`) to match usage. |
| 37 | 🟠 | api.service.ts:199 | **Loose type** — `updatePurchaseOrderStatus(poId, status: string)` | Use `status: PoStatus` and ensure backend accepts the same union. |
| 38 | 🟡 | api.service.ts:124 | **Loose type** — `fetchPurchaseOrders` options `status?: string` | Use `status?: PoStatus` for filter consistency. |
| 39 | 🟠 | purchaseOrder.service.ts:197 | **Value/type mismatch** — `updatePoStatus(poId, 'Completed')` but `PoStatus` has `"Despatched/ Completed"`, not `"Completed"` | Use `'Despatched/ Completed'` (or add `'Completed'` to `PoStatus` if backend expects it). |
| 40 | 🟡 | dashboard.api.ts:105 | **Loose type** — `timeRange: string = 'last_6_months'` | Use union type (e.g. `'last_6_months' \| 'last_12_months'`) if API documents allowed values. |
| 41 | 🟡 | forecast.service.ts:201–208 | **Unexpected API shape** — Assumes `result.success`, `result.tableData`, `result.summary`; no shared response type | Define `ForecastsApiResponse` and use it for `result`; avoids implicit any and documents contract. |

---

## Summary by Category

| Category | Count | Severity |
|----------|-------|----------|
| tsconfig strict mode off | 1 | 🔴 |
| Explicit `any` (incl. generics default) | 24 | 🔴/🟠 |
| Type assertions (`as`) | 4 | 🔴/🟠 |
| Non-null assertions (`!`) | 1 | 🟠 |
| Loose types (string vs enum/union) | 5 | 🟠/🟡 |
| API response shape mismatches | 4 | 🟠/🟡 |
| Missing return types | 0 (in scope) | — |
| @ts-ignore / @ts-expect-error | 0 | — |

---

## Recommended Remediation Order

1. **Enable strict mode** in `tsconfig.json` and fix resulting errors (prioritize `noImplicitAny`, `strictNullChecks`).
2. **Remove generic defaults** and all explicit `any` in `api.service.ts` and shared types; use `unknown` or concrete types.
3. **Define API response types** for each endpoint used in services (SOH, forecasts, dashboard, PO, BOM) and use them instead of `any` or untyped `response`.
4. **Tighten domain types** in `mrp.types.ts`: `PoStatus` for status fields, union for `partType`, and fix `PurchaseOrder`/backend DTO alignment.
5. **Replace type assertions** with validation (e.g. type guards or schema lib) where data comes from network or files.
6. **Remove non-null assertions** by adding proper null checks or early returns.

---

*Audit scope limited to `src/types/mrp.types.ts`, `src/services/`, and `tsconfig.json`. Additional type-safety issues exist in `src/components/` (e.g. `any` in props, catch blocks, and state) and should be audited separately.*
