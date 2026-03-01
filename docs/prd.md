# Product Requirements Document (PRD)

## A. Product Overview
The Manufacturing Resource Planning (MRP) System is a centralized, web-based platform designed to streamline manufacturing operations, track inventory and stock on hand (SOH), manage product Bills of Materials (BOM), forecast sales demand, and handle the procurement lifecycle through purchase orders (POs). Currently in development (approximately 25% complete), it aims to replace disconnected tools and provide real-time visibility into the production and supply chain workflows.

## B. Problem Statement
Manufacturing businesses often face challenges when tracking inventory across multiple spreadsheets or disjointed tools. This leads to component stockouts, overlooked low-stock alerts, delayed orders, and inefficient capital allocation. A unified system is required to bring together KPIs, BOMs, forecasts, and purchasing decisions to maintain operational health.

## C. Goals & Objectives
1. **Centralize Operations Data:** Provide a single source of truth for all products, inventory levels, and order metrics.
2. **Prevent Stockouts & Bottlenecks:** Alert supply chain managers about low stock levels and components at risk before production is halted.
3. **Streamline Procurement:** Simplify and centralize the creation, tracking, and statuses of purchase orders.
4. **Improve Decision Making:** Deliver high-level dashboards with critical KPIs (e.g., Open Order Value, Revenue, Turnaround Days) for operational transparency.

## D. Target Users / User Personas
1. **Inventory Planner / Supply Chain Manager:** Focuses on maintaining healthy stock levels and satisfying upcoming demand forecasts.
2. **Purchasing Officer:** Responsible for issuing Purchase Orders, monitoring their statuses ("Open", "In Progress", "Completed", "Despatched", "PO Check"), and dealing with vendors.
3. **Production / Operations Manager:** Needs visibility into the BOM, components at risk, and open work hours required to meet manufacturing goals.
4. **Business Executive:** Uses the dashboard to track top-performing customers and products, overall revenue, and monthly trends.

## E. Functional Requirements *(Confirmed from Codebase)*
1. **Dashboard & Analytics**
   - Display real-time KPI metrics (Open Orders, Open Order Value, Pending Work Hours, Orders Requiring Attention).
   - Display secondary metrics (Components at Risk, Avg. Turnaround Days, Completed Orders, Revenue).
   - Filter views by dynamic date ranges (Today, This Week, Last 6 Months, Financial Year, etc.).
   - Visual charts (Monthly Revenue Trends, Orders Received vs Despatched, Order Status Distribution).
   - "Low Stock Alerts" and "Recent Activity" feeds.
   - Lists highlighting "Top Customers" and "Top Products".
2. **Product Catalog & Bill of Materials (BOM)**
   - Product list views and detailed product dashboards (`ProductsPage`, `ProductDetailPage`).
   - Component management (Adding/Updating/Deleting) mapped to product codes (`bom.service.ts`). Four part types supported: Raw Material, Component, Packaging, Consumable.
3. **Inventory & Stock Tracking**
   - Stock On Hand (SOH) reporting and dedicated dashboard (`SohPage`).
   - SOH batch imports from Excel/CSV with column mapping validation (`inventory.service.ts`).
   - Searchable SOH components, tracking `safetyStock`, `supplierId`, and `perShipper` amounts.
4. **Purchase Order (PO) Management**
   - View, filter, and paginate through all Purchase Orders (`PurchaseOrdersPage`).
   - Form wizards for creating new Purchase Orders (`CreatePOPage`), including searchable product dropdowns and real-time calculation rows.
   - **PO Validation Logic:** Triggers a "PO Check" status if the calculated system amount deviates from the entered customer amount by more than $5 (`resolvePoCheck`).
5. **Demand Forecasting & MRP Engine**
   - Manage monthly sales forecasts, with import support from Excel (`ForecastsPage.tsx`, `forecast.service.ts`).
   - **Internal MRP Engine (`mrp.service.ts`):** 
     - Aggregates demand from BOMs and forecasts.
     - Calculates `netFourMonthDemand` and `daysOfCoverage`.
     - Flags components as "Healthy", "Risk", or "Shortage" based on threshold logic (e.g. current stock vs 4-month demand).
     - Generates automated purchase recommendations organized by priority ("High", "Medium", "Low").

## F. Suggested Future Functional Requirements *(Recommended)*
1. **User Authentication & Role-Based Access Control (RBAC):** Different access levels (e.g., Read-Only for Floor Staff, Admin for Executives). While Supabase is configured, distinct application-level RBAC is essential.
2. **Vendor / Supplier Management Module:** A dedicated space for tracking vendor details, lead times, reliability scores, and historical pricing.
3. **Work Order Management (Shop Floor Control):** Tracking actual production runs, assembly status, machine allocation, and labor hours against estimated times.
4. **Automated Reordering System:** Auto-generate draft Purchase Orders leveraging the `generatePurchaseRecommendations` from the MRP engine.
5. **Reporting & Exporting:** Advanced custom reports with PDF export capabilities for financial audits (Excel exporting is partially implemented).

## G. Non-Functional Requirements
1. **Performance:** The frontend dashboard should load initial views and structural skeletons immediately, with data populated generally in under 2 seconds. The MRP calculation is currently client-side and optimized via memoization but relies heavily on the `Promise.all` data fetching batch.
2. **Usability:** Responsive design suitable for distinct screen sizes, utilizing an intuitive layout (Tailwind CSS, DaisyUI, Heroicons) with baked-in dark/light theme support. Includes intuitive UI elements like toast notifications, modals, and sparklines.
3. **Architecture:** Hybrid backend interaction bridging direct Supabase SDK calls (`supabase.from`) with dedicated custom API endpoints (`import.meta.env.VITE_API_URL/api/...`).
4. **Data Integrity:** The application expects strict validations matching data types such as `orderedQtyPieces`, `pricePerShipper`, and `runRate`.

## H. User Flows
1. **The Executive Overview Flow:** User logs in $\rightarrow$ Lands on Dashboard $\rightarrow$ Selects "Last 6 Months" filter $\rightarrow$ Reviews "Revenue Trends" chart and "Top Products".
2. **The Procurement Flow:** User opens Dashboard $\rightarrow$ Sees "Low Stock Alerts" $\rightarrow$ Navigates to Products to verify BOM dependencies $\rightarrow$ Opens Purchase Orders $\rightarrow$ Clicks "Create New PO" for the required components $\rightarrow$ Selects Product and enters amounts $\rightarrow$ System validates if PO triggers a "PO Check".
3. **The Planning Flow:** User enters Forecasts page $\rightarrow$ Imports an Excel Sales Forecast $\rightarrow$ Navigates to Inventory Planning $\rightarrow$ The MRP engine processes all BOMs and flags shortfalls in a prioritized list.

## I. Technical Overview
- **Frontend Core:** React (v19), Vite, TypeScript.
- **UI & Styling:** Tailwind CSS, PostCSS, DaisyUI, Material Tailwind. Includes custom theming context (`ThemeContext`).
- **Data Visualization & Tools:** ApexCharts/React-ApexCharts, React Router DOM (v7), React Hot Toast, Flatpickr (for dates), `xlsx` (Excel parsing).
- **Backend & Database:** Supabase (`@supabase/supabase-js` v2) acting as primary data store, combined with custom Express/Node API backend endpoints (e.g., for Excel parsing and analysis).
- **Code Quality:** ESLint and TypeScript compilation checks established.

## J. Constraints & Dependencies
- High dependence on vendor libraries (Supabase, ApexCharts, Material Tailwind) and their respective package lifetimes.
- The use of client-side `xlsx` processing and local MRP calculations (`mrp.service.ts`) might cause performance degradation for deeply nested multi-level BOMs containing thousands of parts over multiple forecast months. 

## K. Risks & Assumptions
- **Risk:** Calculating gross-to-net requirements strictly within the JS environment under heavy loads. If a business scales to 10k+ components, the fetching of all SOH, Products, and Forecasts simultaneously will hit API limits and cause browser lag.
- **Risk:** There are placeholders within `purchaseOrder.service.ts` for backend routes (e.g., `checkPoNumberExists` currently always returns false), meaning true validation is still missing.

## L. Open Questions
1. **MRP Engine Scalability:** Should the `runCompleteAnalysis` be moved from a client-side aggregation function to a backend Cron job or PostgreSQL materialized view to prevent data fetching bottlenecks?
2. **BOM Complexity:** Does the `bom.service.ts` eventually need to handle circular dependencies, scrap rates, and distinct unit conversions?
3. **Procurement Timings:** Are shipping and external supplier lead times intended to be integrated into the `generatePurchaseRecommendations` logic?
4. **Authentication Depth:** Is authentication firmly enforced on all endpoints using Supabase Row-Level Security (RLS), or is it bypassed due to the usage of custom backend API routes?
