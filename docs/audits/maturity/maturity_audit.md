# System Maturity Audit: MRP System Frontend

This document outlines a thorough architectural and maturity assessment of the Manufacturing Resource Planning (MRP) frontend application based on a review of its core configurations, business logic handlers, and component structures.

## 1. Module Classifications

### A. Dashboard & Analytics Engine
* **Classification: Prototype**
* **Reasoning:** While the UI is well-structured and displays metrics beautifully, the underlying data gathering technique in `dashboard.service.ts` pulls massive unpaginated datasets locally (e.g., `limit=100` on orders and products) to calculate values manually in JavaScript. This will break under actual production load. `getDashboardChartData` and `getPerformanceMetrics` currently return hardcoded/mocked data or empty arrays.

### B. Purchase Order (PO) Management
* **Classification: Beta-ready**
* **Reasoning:** The service layer (`purchaseOrder.service.ts`) handles fetching, formatting, and calculating $5 "PO Check" tolerances efficiently. It cleanly wraps an external `api.service.ts`. However, crucial checks like `checkPoNumberExists` and `getFilteredPurchaseOrders` are still returning hardcoded placeholders (`false` and `[]` respectively) rather than waiting on backend confirmations.

### C. Inventory & Stock on Hand (SOH)
* **Classification: Beta-ready**
* **Reasoning:** It supports complex bulk Excel uploads and correctly maps backend `product_id` anomalies to frontend `partCode` formats. However, standard methods like `getLowStockItems` and `updateStock` throw "not implemented" errors directly to the user.

### D. BOM (Bill of Materials) Management
* **Classification: Production-ready**
* **Reasoning:** The `bom.service.ts` is a tightly scoped, fully implemented CRUD controller. It acts as a clean proxy to the backend API without maintaining complicated, volatile local state. 

### E. Demand Forecasting & MRP Engine
* **Classification: Needs Architectural Redesign**
* **Reasoning:** The `mrp.service.ts` is calculating gross-to-net requirements, economic order quantities (EOQ), and reorder points directly in the user's browser via a massive `Promise.all` fetch of all products, forecasts, and SOH. This is a monolithic script (`runCompleteAnalysis`) that needs to be moved to a PostgreSQL materialized view or a dedicated backend microservice. A browser cannot handle deep multi-level BOM explosions efficiently.

---

## 2. System Scoring

### A. Technical Risk Score: 7/10 (High Risk)
* **API Inconsistencies:** There is a fragile mix between direct `supabase-js` database calls and custom API fetches (`apiClient` directed at Node backends like `https://mrp-1.onrender.com`).
* **Environment Instability:** Code contains a mix of hardcoded production URLs (`https://mrp-1.onrender.com/api/products`), `import.meta.env` references, and fallback `localhost` strings.

### B. Scalability Score: 3/10 (Poor)
* **Client-side Bottlenecks:** Aggregating thousands of rows of POs, Products, and Inventory logs inside React state to calculate Dashboard KPIs or MRP projections will cause severe memory leaks and application freezing on low-end devices.
* **Pagination Issues:** While the API `api.service.ts` supports pagination, many internal service calls forcefully override it or fetch massive blocks to do manual filtering.

### C. Maintainability Score: 8/10 (Very Good)
* **Code Structure:** The project is extremely well-organized. Separation of concerns is respected (services handle data, components handle UI).
* **Typing:** The usage of TypeScript `interface` definitions (like `InventoryProjection`, `DashboardStats`) is strict and highly readable.
* **UI Consistency:** The choice to use Tailwind, DaisyUI, and Heroicons provides a clean, easily extensible design system.

### D. Data Integrity Risk Assessment: Elevated
* The calculation logic for "PO Checks" evaluates the absolute difference between `customerAmount` and `systemAmount`. If there are floating-point errors in JavaScript (e.g., `0.1 + 0.2 !== 0.3`), POs could be falsely flagged.
* Because the MRP engine runs client-side, if two planners run an analysis and trigger automated Purchase Orders simultaneously based on out-of-sync local browser state, they could double-order stock.

---

## 3. Suggested 90-Day Improvement Roadmap

### Month 1: Stabilization & Hardening
1. **Unify the Network Layer:** Standardize all data access. Choose either the Supabase JS SDK exclusively or the custom `apiClient` Express backend. Do not mix them.
2. **Remove Hardcoded URLs:** Eliminate all references to `localhost:5000` and `mrp-1.onrender.com` scattered inside service files. Route everything through standardized environment variables (`VITE_API_URL`).
3. **Finish PO Workflows:** Implement the missing backend `checkPoNumberExists` and server-side filtering for POs to unlock full procurement functionality.

### Month 2: Architectural Redesign (The Data Layer)
1. **Migrate MRP to the Backend:** Rewrite the `mrp.service.ts` calculations into a Supabase Edge Function or the Node.js backend. The frontend should only make a single GET request to `/api/mrp/projections`.
2. **Server-Side Dashboard Aggregation:** Move all Dashboard KPI math (`getDashboardStats`) to a nightly CRON job or a PostgreSQL View so the dashboard loads instantly without parsing thousands of records.

### Month 3: Feature Completion & Polish
1. **Implement Missing Stubs:** Finish the Excel SOH Import `getLowStockItems` feature and Work Orders tracking. 
2. **Role-Based Access Control (RBAC):** Lock down the `supabase.config.ts` endpoints relying on `anon` keys by integrating actual JWT user sessions and routing permissions in React.
3. **End-to-End Testing:** Introduce Jest and React Testing Library to mathematically verify the $5 PO Check tolerance and the MRP Shortfall calculation logic.
