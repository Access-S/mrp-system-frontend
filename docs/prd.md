# Product Requirements Document (PRD)

## MRP System Frontend

**Version:** 0.0.0  
**Last Updated:** 2026-03-10  
**Repository:** `mrp-system-frontend`

---

## 1. EXECUTIVE SUMMARY

The MRP (Material Requirements Planning) System is a manufacturing operations management platform designed for contract manufacturing / packaging companies. The frontend is a single-page application providing real-time visibility into purchase orders, product bill-of-materials (BOM), sales forecasts, stock-on-hand inventory, and an MRP computation engine that projects component-level demand and inventory shortages over configurable time horizons.

The core problem this product solves is the manual coordination of manufacturing operations — tracking purchase orders through their lifecycle (from receipt to dispatch), managing product BOMs, importing demand forecasts from Excel, monitoring raw material stock levels, and proactively identifying inventory shortages before they disrupt production. Without this system, operations managers rely on spreadsheets and email, leading to delayed PO processing, missed stock shortfalls, and inaccurate financial reporting.

The target audience consists of **operations managers**, **production planners**, and **warehouse staff** in small-to-medium contract manufacturing businesses. The product vision is to be a comprehensive, real-time manufacturing operations dashboard that replaces spreadsheet-based workflows with an integrated platform — from forecast import to purchase order dispatch — with proactive alerting on inventory risks and automated MRP calculations.

---

## 2. PROJECT OVERVIEW

| Attribute | Detail |
|---|---|
| **Project Name** | `react-vite-ts` (package.json) / `mrp-system-frontend` (repository) |
| **Version** | `0.0.0` |
| **Architecture** | SPA Frontend (Vite + React) with REST API backend + Supabase direct access |
| **Current Status** | **Active Development** — core features functional, several TODO items remain |

### 2.1 Tech Stack

| Category | Technologies |
|---|---|
| **Language** | TypeScript 5.8.3 |
| **Framework** | React 19.0.0 |
| **Build Tool** | Vite 6.0.3 |
| **Styling** | TailwindCSS 3.4.16, PostCSS 8.4.49, Autoprefixer 10.4.20 |
| **Component Library** | `@material-tailwind/react` 2.1.10 |
| **Icons** | `@heroicons/react` 2.2.0 |
| **Charts** | ApexCharts 5.6.0, `react-apexcharts` 2.0.1 |
| **Backend Client** | `@supabase/supabase-js` 2.55.0, `fetch` (REST API) |
| **Routing** | `react-router-dom` 7.11.0 *(installed but not currently used — manual state-based routing)* |
| **Date Picker** | `react-flatpickr` 4.0.11 |
| **Toast/Notifications** | `react-hot-toast` 2.5.2, Custom Toast system |
| **Excel Parsing** | `xlsx` 0.18.5 |
| **PDF Generation** | `jspdf` 4.2.0, `jspdf-autotable` 5.0.7 |
| **File Downloads** | `file-saver` 2.0.5 |
| **Utilities** | `clsx` 2.1.1, `use-debounce` 10.0.5, `@floating-ui/react` 0.27.15 |
| **Linting** | ESLint 9.16 with TypeScript parser |
| **Hosting** | Render.com (static site, Oregon region, free plan) |

### 2.2 Architecture Pattern

**Hybrid Client-Side Architecture:**
- **REST API** (`api.service.ts`) — Primary data access via a Node.js backend at `https://mrp-1.onrender.com/api`
- **Direct Supabase** — Some service classes (`product.service.ts`, `inventory.service.ts`) also query Supabase directly for searches and lookups
- **State Management** — React `useState`/`useEffect` hooks (no Redux, Zustand, or Context-based state management beyond theme)
- **Routing** — Manual page switching via `activePage` state in `App.tsx` (12 pages)

### 2.3 Repository Structure

```
mrp-system-frontend/
├── .env.local                  # Local environment config (Supabase, API URL)
├── .env.production             # Production API URL
├── index.html                  # Entry HTML
├── package.json                # Dependencies & scripts
├── render.yaml                 # Render.com deployment config
├── vite.config.ts              # Vite build config with proxy
├── tailwind.config.js          # Tailwind with custom animations
├── tsconfig.json               # TypeScript config
├── postcss.config.js           # PostCSS plugins
├── docs/
│   ├── prd.md                  # This document
│   ├── mrp_simulation.md       # MRP calculation documentation
│   ├── forecast_comparison_specification.md  # Forecast spec
│   ├── maturity_audit.md       # Code maturity audit
│   ├── audits/                 # Audit reports
│   ├── ai-instructions/        # AI code assistant rules
│   └── ui-library/             # UI component library docs
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root layout, routing, page switching
│   ├── index.css               # Global styles
│   ├── supabase.config.ts      # Supabase client initialization
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Theme provider (3 themes, dark mode sync)
│   ├── types/
│   │   └── mrp.types.ts        # Core domain types (Product, PO, BOM, Forecast)
│   ├── styles/
│   │   └── themes.ts           # Theme definitions (Classic, Sunset, Dark)
│   ├── services/               # Data access / business logic layer
│   │   ├── api.service.ts      # HTTP client, PO & Product REST endpoints
│   │   ├── dashboard.api.ts    # Dashboard REST endpoint
│   │   ├── dashboard.service.ts# Dashboard KPI calculations
│   │   ├── product.service.ts  # Product CRUD (API + Supabase)
│   │   ├── purchaseOrder.service.ts  # PO lifecycle management
│   │   ├── bom.service.ts      # BOM CRUD via API
│   │   ├── inventory.service.ts# SOH data, Excel import
│   │   ├── forecast.service.ts # Forecast import/fetch, weekly data
│   │   ├── mrp.service.ts      # MRP calculation engine
│   │   ├── export.service.ts   # CSV, Excel, PDF export
│   │   └── import.service.ts   # PO CSV/TSV import, validation
│   └── components/
│       ├── Sidebar.tsx          # Navigation sidebar with accordion menus
│       ├── PaginationControls.tsx  # Pagination component
│       ├── ui/                  # 24 reusable UI components
│       │   ├── Accordion/       ├── Avatar/        ├── Badge/
│       │   ├── Breadcrumb/      ├── Button/        ├── Card/
│       │   ├── DatePicker/      ├── Dialog/        ├── Divider/
│       │   ├── Drawer/          ├── EmptyState/    ├── Input/
│       │   ├── Menu/            ├── Pagination/    ├── ScrollArea/
│       │   ├── Select/          ├── Skeleton/      ├── Spinner/
│       │   ├── StatusBadge/     ├── Table/         ├── Tabs/
│       │   ├── Toast/           ├── Tooltip/       ├── WidgetCard/
│       │   └── index.ts         # Barrel exports
│       ├── pages/               # Page-level components
│       │   ├── DashboardPage.tsx       # KPIs, charts, activity feed (822 lines)
│       │   ├── ProductsPage.tsx        # Product list with search (211 lines)
│       │   ├── ProductDetailPage.tsx   # Single product BOM view (338 lines)
│       │   ├── ProductDashboardPage.tsx# Product detail dashboard (693 lines)
│       │   ├── PurchaseOrdersPage.tsx  # PO list, status mgmt (771 lines)
│       │   ├── CreatePOPage.tsx        # New PO form (655 lines)
│       │   ├── ForecastsPage.tsx       # Weekly forecast table (675 lines)
│       │   ├── SohPage.tsx             # Stock on Hand view (453 lines)
│       │   ├── InventoryPage.tsx       # MRP inventory projections (419 lines)
│       │   ├── ImportPage.tsx          # PO CSV import wizard (605 lines)
│       │   └── testing/               # UI test pages
│       ├── dashboard/          # Dashboard sub-components
│       │   ├── KPICard.tsx     # Animated KPI card with sparklines
│       │   └── charts/        # Chart components (Bar, Line, Pie, Radial)
│       ├── forms/             # Form components
│       │   ├── CreateProductForm.tsx  # New product form
│       │   ├── EditProductForm.tsx    # Edit product form
│       │   ├── CreatePoForm.tsx       # PO creation form
│       │   ├── EditPoForm.tsx         # PO edit form
│       │   └── DespatchPoForm.tsx     # Dispatch PO form
│       ├── modals/            # Modal dialogs
│       │   ├── PoDetailModal.tsx       # PO detail view
│       │   ├── BomDetailModal.tsx      # BOM detail view
│       │   ├── AddBomComponentModal.tsx    # Add BOM component
│       │   ├── EditBomComponentModal.tsx   # Edit BOM component
│       │   └── ExcelImportModal.tsx    # Excel file import
│       ├── dialogs/           # Utility dialogs
│       │   ├── ConfirmationDialog.tsx  # Delete/action confirmation
│       │   └── FormAlert.tsx          # Form validation alert
│       └── tabs/              # Tab content components
│           ├── BomManagementTab.tsx    # BOM management tab
│           └── ProductInfoTab.tsx     # Product info tab
```

---

## 3. USER PERSONAS & ROLES

> **Note:** The current codebase has **no authentication or role-based access control (RBAC)**. There is no login page, no JWT handling, and no middleware protecting routes. The Supabase client uses the anonymous key. The following personas are derived from the features built.

### 3.1 Operations Manager

| Attribute | Detail |
|---|---|
| **Who** | Senior staff overseeing all manufacturing operations |
| **Permissions** | Full access (currently unrestricted) |
| **Key Features** | Dashboard KPIs, PO lifecycle management, revenue tracking, turnaround analysis |
| **User Journey** | Login → Dashboard (KPIs, trends) → Drill into PO issues → Monitor stock alerts → Review forecasts |

### 3.2 Production Planner

| Attribute | Detail |
|---|---|
| **Who** | Planner responsible for material requirements and scheduling |
| **Permissions** | Full access (currently unrestricted) |
| **Key Features** | Inventory planning, MRP projections, forecast imports, BOM management |
| **User Journey** | Import forecasts → Review MRP projections → Identify shortages → Generate purchase recommendations → Export reports |

### 3.3 Warehouse / Data Entry Staff

| Attribute | Detail |
|---|---|
| **Who** | Staff handling PO receipt, dispatch, and stock updates |
| **Permissions** | Full access (currently unrestricted) |
| **Key Features** | Create POs, update PO status, import SOH data, dispatch orders |
| **User Journey** | Create PO → Track through statuses → Update stock → Dispatch completed orders |

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Dashboard

- **Description:** Real-time overview of manufacturing operations with 8 KPI cards, 4 charts, recent activity feed, low stock alerts, and top customer/product rankings
- **User Story:** "As an operations manager, I want to see a single-page overview of all key metrics with time-range filtering, so that I can quickly assess business health."
- **Acceptance Criteria:**
  - 8 KPI cards update when time range filter changes (Today, This Week, Last Week, This Month, Last Month, Last 3/6 Months, This/Last FY)
  - Charts always display last 6 months data regardless of filter
  - Animated counter effects on KPI values
  - Sparkline mini-charts on each KPI card (bar, line, area types)
  - Auto-refresh every 5 minutes
  - Skeleton loading states during data fetch
  - Error state with retry button
- **API Endpoints:**
  - `GET /api/dashboard?timeRange={range}` — Full dashboard data
  - `GET /api/dashboard/quick-stats` — Lightweight KPI stats
- **Database Tables:** `purchase_orders`, `products`, `stock_on_hand` (aggregated by backend)
- **UI Components:** `KPICard`, `LineChart`, `BarChart` (Multiple), `RadialBarChart`, `PieChart`, `RecentActivityCard`, `LowStockAlerts`, `TopItemsCard`
- **Current Status:** ✅ Complete
- **Dependencies:** Backend dashboard API

---

### 4.2 Purchase Order Management

- **Description:** Full CRUD lifecycle for purchase orders with paginated listing, search, status filtering, multi-status workflow, inline editing, dispatch, and deletion
- **User Story:** "As a warehouse operator, I want to manage the full lifecycle of purchase orders from receipt to dispatch, so that I can track production progress."
- **Acceptance Criteria:**
  - Paginated PO list (10/25/50/100 per page)
  - Global search across PO number, customer, product
  - Filter by any of 11 PO statuses
  - Sort by date (asc/desc)
  - Multi-status toggle system with blocked-status logic (e.g., can't mark "Despatched" before "Ready for Despatch")
  - View PO details in modal
  - Edit PO details inline
  - Delete PO with confirmation dialog
  - Dispatch PO with delivery date and docket number
  - Production time calculation from hourly run rate
  - Status color coding (green=completed, red=PO Check, yellow=in progress, blue=open)
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/purchase-orders?page=&limit=&search=&status=&sort_direction=` | Paginated list |
| `GET` | `/api/purchase-orders/:id` | Single PO |
| `POST` | `/api/purchase-orders` | Create PO |
| `PATCH` | `/api/purchase-orders/:id` | Update PO |
| `PATCH` | `/api/purchase-orders/:id/status` | Toggle status |
| `DELETE` | `/api/purchase-orders/:id` | Delete PO |

- **Database Tables:** `purchase_orders`, `po_status_history`, `products`
- **Business Logic:**
  - PO Check status auto-triggered when `|customerAmount - systemAmount| > $5`
  - System amount = `(orderedQtyPieces / unitsPerShipper) × pricePerShipper`
  - Status workflow has sequential dependencies (blocked statuses)
  - Turnaround days = `deliveryDate - poReceivedDate`
- **UI Components:** `PurchaseOrdersPage`, `StatusCell`, `ActionsCell`, `PoDetailModal`, `EditPoForm`, `DespatchPoForm`, `ConfirmationDialog`, `TableSkeleton`
- **Current Status:** ✅ Complete (core), 🔧 Partial (dispatch details not fully sent to API, `checkPoNumberExists` returns false placeholder, `getFilteredPurchaseOrders` returns empty, `getTotalPurchaseOrdersCount` returns 0)
- **Dependencies:** Product data for amount validation

---

### 4.3 Purchase Order Creation

- **Description:** Multi-section form for creating new purchase orders with product search, auto-calculations, date pickers, and validation
- **User Story:** "As a data entry operator, I want a guided form to create purchase orders with auto-calculated amounts, so that I can quickly enter orders with minimal errors."
- **Acceptance Criteria:**
  - Searchable product dropdown with debounced filtering
  - Auto-calculation of shippers, system amount, production hours
  - Date picker for PO Created and Received dates
  - Real-time amount mismatch warning
  - Form validation (all required fields + date logic)
  - Success notification and redirect to PO list
- **API Endpoints:** `POST /api/purchase-orders`, `GET /api/products`
- **UI Components:** `CreatePoPage`, `ProductSearchSelect`, `SectionHeader`, `FormField`, `CalcRow`, `DatePicker`, `FormAlert`
- **Current Status:** ✅ Complete
- **Dependencies:** Product list for dropdown

---

### 4.4 PO Import (CSV/Excel)

- **Description:** Multi-step import wizard for bulk importing purchase orders from CSV/TSV files with preview, validation, and error reporting
- **User Story:** "As an operations manager, I want to bulk import purchase orders from CSV files, so that I don't have to enter each order manually."
- **Acceptance Criteria:**
  - 4-step wizard: Upload → Preview → Validate → Complete
  - Drag-and-drop file upload
  - CSV and TSV parsing with flexible header mapping (supports variations like "po_number", "ponumber", "po")
  - Data preview before import
  - Backend validation with error details per row
  - Option to skip invalid rows
  - Import result summary (success/failed/skipped counts)
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/import/template` | Get import template |
| `POST` | `/api/import/validate` | Validate import data |
| `POST` | `/api/import/purchase-orders` | Execute import |

- **UI Components:** `ImportPage`, multi-step state machine
- **Current Status:** ✅ Complete
- **Dependencies:** Backend import API

---

### 4.5 Product Management

- **Description:** Product catalog with CRUD operations, displaying product codes, descriptions, and key attributes. Clicking a product navigates to a detailed dashboard.
- **User Story:** "As a production planner, I want to manage our product catalog with detailed manufacturing data, so that the system can calculate accurate amounts and production times."
- **Acceptance Criteria:**
  - Searchable product list with client-side filtering
  - Create new product form
  - Navigate to product detail dashboard on click
  - View/edit product specifications (units per shipper, hourly run rate, mins per shipper, price per shipper)
  - Delete product with confirmation
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/products` | All products |
| `POST` | `/api/products` | Create product |
| `PATCH` | `/api/products/:code` | Update product |
| `DELETE` | `/api/products/:code` | Delete product |

- **Database Tables:** `products`
- **UI Components:** `ProductsPage`, `ProductDashboardPage`, `ProductDetailPage`, `CreateProductForm`, `EditProductForm`
- **Current Status:** ✅ Complete
- **Dependencies:** None

---

### 4.6 Bill of Materials (BOM) Management

- **Description:** Manage component-level BOMs for each product. Components have part codes, descriptions, part types, and quantity per shipper.
- **User Story:** "As a production planner, I want to manage the bill of materials for each product, so that the MRP engine can calculate component-level demand."
- **Acceptance Criteria:**
  - View BOM components list for a product
  - Add new BOM component with part code, description, type (RAW_MATERIAL, COMPONENT, PACKAGING, CONSUMABLE), and per-shipper quantity
  - Edit existing BOM component
  - Delete BOM component with confirmation
  - BOM data feeds into MRP calculations
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/products/:code/bom` | Get BOM components |
| `POST` | `/api/products/:code/bom` | Add component |
| `PATCH` | `/api/products/:code/bom/:partCode` | Update component |
| `DELETE` | `/api/products/:code/bom/:partCode` | Delete component |

- **Database Tables:** `bom_components`
- **UI Components:** `BomManagementTab`, `AddBomComponentModal`, `EditBomComponentModal`, `BomDetailModal`
- **Current Status:** ✅ Complete
- **Dependencies:** Product data

---

### 4.7 Sales Forecasts

- **Description:** Weekly demand forecast table with Excel import, configurable week horizons, and export capabilities
- **User Story:** "As a production planner, I want to import weekly sales forecasts from Excel and view them in a tabular format, so that I can plan production schedules."
- **Acceptance Criteria:**
  - Weekly forecast table with configurable visible weeks (4/6/8/10)
  - Excel file import with auto-detection of header row (looks for "Product" + "Description" columns)
  - Review workflow for unknown products (create placeholder, map to existing, or skip)
  - Summary bar showing total units and demand hours per week
  - Product-level hours calculation using `minsPerShipper` data
  - Export to CSV, Excel, or PDF
  - Product search/filter
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/forecasts` | Weekly forecast data |
| `POST` | `/api/forecasts/upload` | Import from Excel (FormData) |
| `POST` | `/api/forecasts/review` | Finalize review of unknown products |

- **UI Components:** `ForecastsPage`, `ExcelImportModal`
- **Current Status:** ✅ Complete
- **Dependencies:** Product data for hours calculation

---

### 4.8 Stock on Hand (SOH) Management

- **Description:** View and manage current stock-on-hand data with Excel import and export capabilities
- **User Story:** "As a warehouse manager, I want to import and view current stock levels, so that the MRP engine has accurate inventory data."
- **Acceptance Criteria:**
  - SOH record list with search functionality
  - Summary stats (total items, latest import info)
  - Excel file import with column selection
  - Option to replace existing data or merge
  - Import result reporting (success/error counts)
  - Export to CSV, Excel, or PDF
- **API Endpoints:**

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/soh` | All SOH records |
| `GET` | `/api/soh/summary` | SOH summary stats |
| `POST` | `/api/soh/analyze` | Analyze Excel headers (FormData) |
| `POST` | `/api/soh/import` | Import SOH data (FormData) |

- **Database Tables:** `stock_on_hand` (or equivalent, queried via `bom_components` for fallback)
- **UI Components:** `SohPage`, `ExcelImportModal`
- **Current Status:** ✅ Complete
- **Dependencies:** Backend SOH API

---

### 4.9 Inventory Planning / MRP Engine

- **Description:** Front-end MRP computation engine that combines products+BOMs, forecasts, and SOH data to produce component-level inventory projections with health status, priority levels, and purchase recommendations
- **User Story:** "As a production planner, I want to see which components are at risk of shortage based on forecasted demand, so that I can proactively order materials."
- **Acceptance Criteria:**
  - Full MRP calculation combining SOH, BOM, and forecast data
  - Monthly projection per component (demand, coverage %, projected SOH, shortfall, days of coverage)
  - Health status classification (Healthy / Risk / Shortage)
  - Priority classification (High / Medium / Low)
  - Recommended actions per component
  - Filter by priority level
  - Sort by net demand, stock on hand, or coverage %
  - Export MRP data to Excel
  - Input data validation with error/warning reporting
- **Business Logic (MRP Engine in `mrp.service.ts`):**
  - Demand = `forecastedShippers × perShipperQty` per component per month
  - Net 4-month demand = `max(0, totalFourMonthDemand - currentSOH)`
  - Coverage % = `min(1, currentSOH / monthlyDemand) × 100`
  - Health: `SOH ≥ 4monthDemand → Healthy` | `SOH > avgMonthlyDemand → Risk` | `else → Shortage`
  - Utility functions: EOQ calculation, reorder point, days of coverage
  - Bulk-supplied items are excluded from calculations
- **UI Components:** `InventoryPage`, summary cards, component detail table, export buttons
- **Current Status:** ✅ Complete (calculation engine), 🔧 Partial (low stock filtering placeholder, stock updates not available)
- **Dependencies:** Product service, forecast service, inventory service

---

### 4.10 Data Export

- **Description:** Universal export system supporting CSV, Excel (.xlsx), and PDF formats for any data table
- **User Story:** "As any user, I want to export data to CSV, Excel, or PDF, so that I can share reports with stakeholders."
- **Acceptance Criteria:**
  - CSV export with proper escaping and BOM character for Excel compatibility
  - Excel export with title, subtitle, date generated, column widths
  - PDF export with A4 landscape layout, styled table, page numbers
  - Forecast-specific export with week columns and totals
- **UI Components:** Export dropdown menus on ForecastsPage, SohPage, InventoryPage
- **Current Status:** ✅ Complete
- **Dependencies:** `xlsx`, `jspdf`, `jspdf-autotable`, `file-saver`

---

### 4.11 Theme System

- **Description:** Multi-theme support with three built-in themes and dynamic scrollbar styling
- **User Story:** "As a user, I want to switch between light and dark themes, so that I can use the application comfortably."
- **Acceptance Criteria:**
  - 3 themes: Classic Blue (light), Sunset Orange (light), Dark Mode
  - Theme switcher in sidebar Settings → Themes
  - Dark mode syncs with Tailwind `dark:` class on `<html>`
  - Dynamic scrollbar theming via injected CSS
  - Theme persists during session (not persisted across sessions)
- **UI Components:** `ThemeContext`, `ThemeProvider`, `useTheme` hook
- **Current Status:** ✅ Complete (session-only persistence)

---

### 4.12 Analytics & Reporting (Planned)

- **Description:** Analytics and reporting modules visible in sidebar but disabled
- **Current Status:** ❌ Not Started — sidebar items are `disabled`

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Performance
- **Auto-refresh:** Dashboard data refreshes every 5 minutes via `setInterval`
- **Debounced search:** Product search uses `use-debounce` for performance
- **Skeleton loading:** All pages display animated skeleton loaders during data fetch
- **Animated counters:** KPI values animate from 0 to target value over 1 second
- **Pagination:** Server-side pagination for purchase orders (configurable 10/25/50/100)
- **No caching layer**, **no lazy loading**, **no code splitting**, **no virtual scrolling**

### 5.2 Security
- ⚠️ **No authentication** — Application is completely open, no login required
- ⚠️ **No authorization** — No RBAC, all features accessible to anyone
- **Supabase Anon Key** exposed in `.env.local` (standard for client-side, relies on RLS policies)
- **No CSRF protection**, **no rate limiting**, **no input sanitization** on frontend
- **CORS** — Handled by backend
- API errors are caught and displayed as toast notifications

### 5.3 Scalability
- Frontend is statically hosted (Render.com, free tier)
- No server-side rendering, load balancing, or CDN configuration
- Backend at `mrp-1.onrender.com` (single instance)

### 5.4 Reliability
- Error boundaries: Each page has error states with retry buttons
- Fallback values: Dashboard service returns zeroed-out data on API failure
- Console logging with emoji prefixes (✅ ❌ ⚠️ 📊 🔵) for debugging
- No monitoring, no logging service, no health checks

### 5.5 Accessibility
- `aria-label` on sidebar toggle button
- Semantic HTML headers (`h1`-`h3`)
- `role="menu"` and `role="menuitem"` on dropdown menus
- No comprehensive ARIA implementation, no screen reader optimization, no keyboard navigation

### 5.6 Internationalization
- ❌ No i18n/l10n support — all strings are hardcoded in English
- Currency format: USD (`en-US` locale) — hardcoded

---

## 6. DATABASE SCHEMA & DATA MODEL

> **Note:** The frontend does not define migrations. The schema is inferred from service layer field mappings.

### 6.1 `products`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `product_code` | string | Unique identifier |
| `description` | string | Product description |
| `units_per_shipper` | number | Units per shipper container |
| `daily_run_rate` | number | Daily production rate |
| `hourly_run_rate` | number | Hourly production rate |
| `mins_per_shipper` | number | Minutes to produce one shipper |
| `price_per_shipper` | number | Price per shipper unit (AUD/USD) |
| `current_stock` | number | Current stock level |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

### 6.2 `bom_components`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `product_code` | string | FK → products |
| `part_code` | string | Component part code |
| `part_description` | string | Component description |
| `part_type` | enum | `RAW_MATERIAL`, `COMPONENT`, `PACKAGING`, `CONSUMABLE`, or free text |
| `per_shipper` | number | Quantity required per shipper |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

### 6.3 `purchase_orders`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `po_number` | string | Unique PO number |
| `sequence` | number | Sequence number |
| `product_code` | string | FK → products |
| `customer_name` | string | Customer name |
| `po_created_date` | date | When PO was created |
| `po_received_date` | date | When PO was received |
| `requested_delivery_date` | date | Requested delivery date |
| `ordered_qty_pieces` | number | Quantity in pieces |
| `ordered_qty_shippers` | number | Calculated: pieces ÷ unitsPerShipper |
| `customer_amount` | decimal | Customer-stated amount |
| `system_amount` | decimal | System-calculated amount |
| `status` | string/array | Current status(es) |
| `delivery_date` | date | Actual delivery date |
| `delivery_docket_number` | string | Delivery docket reference |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

### 6.4 `po_status_history`

| Field | Type | Notes |
|---|---|---|
| `status` | string | Status name |
| *Other fields* | - | Linked via PO `statuses` array |

### 6.5 `stock_on_hand` (SOH)

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `product_id` | string | Part identifier (maps to BOM part codes) |
| `stock_on_hand` | number | Current stock quantity |
| `safety_stock` | number | Minimum safety stock level |
| `supplier_id` | string | Supplier reference |
| `part_type` | string | Component part type |
| `per_shipper` | number | Quantity per shipper |
| `created_at` | timestamp | Record creation time |
| `updated_at` | timestamp | Last update time |

### 6.6 `forecasts` (Weekly)

Stored in a pivoted format with product rows and weekly date columns. Managed entirely through backend API.

### Entity Relationships

```
products (1) ──── (N) bom_components
products (1) ──── (N) purchase_orders
products (1) ──── (N) forecasts
bom_components.part_code ←──→ stock_on_hand.product_id
purchase_orders (1) ──── (N) po_status_history
```

---

## 7. API DOCUMENTATION

### 7.1 Purchase Orders

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/purchase-orders` | None | Query: `page, limit, search, status, sort_direction` | `PaginatedApiResponse<PO>` | Paginated list |
| `GET` | `/api/purchase-orders/:id` | None | — | `ApiResponse<PO>` | Single PO |
| `POST` | `/api/purchase-orders` | None | `{poNumber, productCode, customerName, poCreatedDate, poReceivedDate, orderedQtyPieces, customerAmount}` | `ApiResponse<PO>` | Create PO |
| `PATCH` | `/api/purchase-orders/:id` | None | Partial PO fields | `ApiResponse<PO>` | Update PO |
| `PATCH` | `/api/purchase-orders/:id/status` | None | `{status, deliveryDate?, docketNumber?}` | `ApiResponse<{statuses}>` | Toggle status |
| `DELETE` | `/api/purchase-orders/:id` | None | — | `ApiResponse<void>` | Delete PO |

### 7.2 Products

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/products` | None | — | `ApiResponse<Product[]>` | All products |
| `POST` | `/api/products` | None | `CreateProductData` | `ApiResponse<Product>` | Create product |
| `PATCH` | `/api/products/:code` | None | `UpdateProductData` | `ApiResponse<Product>` | Update product |
| `DELETE` | `/api/products/:code` | None | — | `ApiResponse<void>` | Delete product |

### 7.3 BOM Components

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/products/:code/bom` | None | — | `ApiResponse<BomComponent[]>` | Get components |
| `POST` | `/api/products/:code/bom` | None | `AddBomComponentData` | `ApiResponse<BomComponent>` | Add component |
| `PATCH` | `/api/products/:code/bom/:partCode` | None | `UpdateBomComponentData` | `ApiResponse<BomComponent>` | Update component |
| `DELETE` | `/api/products/:code/bom/:partCode` | None | — | `ApiResponse<void>` | Delete component |

### 7.4 Dashboard

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/dashboard?timeRange=` | None | — | `DashboardResponse` | Full dashboard |
| `GET` | `/api/dashboard/quick-stats` | None | — | `DashboardKPIs` | KPIs only |

### 7.5 Forecasts

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/forecasts` | None | — | `{tableData: {headers, rows}}` | Weekly data |
| `POST` | `/api/forecasts/upload` | None | FormData: `forecastFile, data` | `ForecastImportResult` | Import |
| `POST` | `/api/forecasts/review` | None | `{import_batch_id, approvals[]}` | `{success, results}` | Finalize review |

### 7.6 SOH / Inventory

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/soh` | None | Query: `search, limit, product_id` | `ApiResponse<Component[]>` | SOH records |
| `GET` | `/api/soh/summary` | None | — | `ApiResponse<Summary>` | Summary stats |
| `POST` | `/api/soh/analyze` | None | FormData: `file` | `ApiResponse<{headers, sampleData, totalRows}>` | Analyze Excel |
| `POST` | `/api/soh/import` | None | FormData: `file, selectedColumns[], replaceExisting` | `ApiResponse<ImportResult>` | Import data |

### 7.7 Import

| Method | Route | Auth | Request Body | Response | Description |
|---|---|---|---|---|---|
| `GET` | `/api/import/template` | None | — | `ImportTemplate` | Get template |
| `POST` | `/api/import/validate` | None | `{data: ImportRow[]}` | `ValidationResult` | Validate data |
| `POST` | `/api/import/purchase-orders` | None | `{data: ImportRow[], skipInvalid}` | `ImportResult` | Execute import |

---

## 8. AUTHENTICATION & AUTHORIZATION

| Aspect | Status |
|---|---|
| Auth Strategy | ❌ **None** |
| Login/Register | ❌ Not implemented |
| Password Reset | ❌ Not implemented |
| RBAC | ❌ Not implemented |
| Token Management | ❌ Not implemented |
| Third-party Auth | ❌ Not implemented |
| Supabase Auth | Configured with `persistSession: true, autoRefreshToken: true` but **not used** |

The sidebar shows **Profile** and **Log Out** menu items, but these are non-functional placeholders.

---

## 9. THIRD-PARTY INTEGRATIONS

| Service | Purpose | Configuration |
|---|---|---|
| **Supabase** | Database (PostgreSQL) and direct data access | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| **Render.com** | Static site hosting (frontend) and API hosting (backend) | `render.yaml`, free plan, Oregon region |
| **ApexCharts** | Dashboard charts (line, bar, pie, radial) and KPI sparklines | Client-side via npm |

No payment gateways, email services, cloud storage, or analytics integrations found.

---

## 10. ENVIRONMENT & CONFIGURATION

### 10.1 Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://gvwzmdnujlidubbiphlg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | JWT token |
| `VITE_API_URL` | Backend API base URL | `https://mrp-1.onrender.com/api` |

### 10.2 Deployment

- **Frontend:** Render.com static site (`render.yaml`)
  - Build: `npm ci && npm run build`
  - Publish: `dist/`
  - SPA routing: All paths rewrite to `/index.html`
- **Backend:** `https://mrp-1.onrender.com/api` (separate repository)

### 10.3 Build Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Development server with HMR |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint . --ext ts,tsx` | Code linting |

### 10.4 Dev Server Configuration

- Host: `0.0.0.0`
- HMR client port: 443
- Proxy: `/api` → Gitpod backend URL
- Allowed hosts configured for Gitpod

---

## 11. FRONTEND ARCHITECTURE

### 11.1 Component Hierarchy

```
App
├── ThemeProvider
│   └── ToastProvider
│       └── AppLayout
│           ├── Sidebar (navigation)
│           ├── Navbar (breadcrumbs, page title)
│           └── Main Content (page switch)
│               ├── DashboardPage
│               │   ├── KPICard (×8)
│               │   ├── LineChart
│               │   ├── MultipleBarChart
│               │   ├── RadialBarChart
│               │   ├── RecentActivityCard
│               │   ├── LowStockAlerts
│               │   └── TopItemsCard (×2)
│               ├── ProductsPage
│               │   └── CreateProductForm (modal)
│               ├── ProductDashboardPage
│               │   ├── WidgetCard (product info, BOM, quotes)
│               │   ├── AddBomComponentModal
│               │   ├── EditBomComponentModal
│               │   ├── EditProductForm
│               │   └── ConfirmationDialog
│               ├── PurchaseOrdersPage
│               │   ├── StatusCell (per row)
│               │   ├── ActionsCell (per row)
│               │   ├── PoDetailModal
│               │   ├── EditPoForm (drawer)
│               │   ├── DespatchPoForm (drawer)
│               │   └── ConfirmationDialog
│               ├── CreatePOPage
│               │   ├── ProductSearchSelect
│               │   ├── DatePicker (×2)
│               │   └── FormAlert
│               ├── ForecastsPage
│               │   └── ExcelImportModal
│               ├── SohPage
│               │   └── ExcelImportModal
│               ├── InventoryPage
│               ├── ImportPage (multi-step wizard)
│               ├── UITestPage
│               └── UITestPage2
├── ToastContainer (custom)
└── ToasterPortal (legacy react-hot-toast)
```

### 11.2 State Management

- **No global state library** — All state is local `useState` in components
- **Theme** — Only global context via `ThemeContext`
- **Data fetching** — `useEffect` with loading/error state pattern in each page
- **No data caching** — Each page refetches on mount

### 11.3 Routing Structure

Manual state-based routing via `activePage` in `App.tsx` (despite `react-router-dom` being installed):

| Page Key | Component | Path/Title |
|---|---|---|
| `dashboard` | `DashboardPage` | Dashboard |
| `products` | `ProductsPage` | Products (BOM) |
| `product-detail` | `ProductDashboardPage` | Product detail (dynamic) |
| `purchase-orders` | `PurchaseOrdersPage` | Purchase Orders |
| `create-po` | `CreatePoPage` | Create New Purchase Order |
| `import` | `ImportPage` | Import Data |
| `inventory` | `InventoryPage` | Inventory Planning Dashboard |
| `forecasts` | `ForecastsPage` | Sales Forecasts |
| `soh` | `SohPage` | Stock On Hand |
| `analytics` | *(not implemented)* | Analytics |
| `reporting` | *(not implemented)* | Reporting |
| `ui-test` | `UITestPage` | UI Components Test |
| `ui-test-2` | `UITestPage2` | UI Components Test - Page 2 |

### 11.4 Styling Approach

- **TailwindCSS** with `class` dark mode strategy
- **Material Tailwind** for sidebar, accordion, list, card, typography, input, button, chip, spinner, drawer components
- **Custom UI library** (24 components) for project-specific components
- **Dynamic theme classes** applied via `theme.text`, `theme.cards`, `theme.background` etc.
- **Custom animations** defined in `tailwind.config.js`: `fadeIn`, `scaleIn`, `ripple`, `shimmer`

### 11.5 Responsive Design

- Sidebar: Hidden on mobile (`lg:hidden` / `hidden lg:flex`), opens via hamburger drawer
- Dashboard grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` responsive breakpoints
- Main content: `p-4 md:p-8` responsive padding
- No explicit breakpoint definitions beyond Tailwind defaults

---

## 12. CURRENT GAPS, BUGS & TECHNICAL DEBT

### 12.1 TODOs in Code (7 found)

| File | Line | Description |
|---|---|---|
| `purchaseOrder.service.ts` | 33 | `checkPoNumberExists` — returns false placeholder |
| `purchaseOrder.service.ts` | 193 | `despatchPo` — delivery details not sent to API |
| `purchaseOrder.service.ts` | 267 | `reopenDespatchedPo` — simplified implementation |
| `purchaseOrder.service.ts` | 308 | `getTotalPurchaseOrdersCount` — returns 0 |
| `purchaseOrder.service.ts` | 333 | `getFilteredPurchaseOrders` — returns empty array |
| `dashboard.service.ts` | 157 | `getDashboardChartData` — returns empty data |
| `ProductDashboardPage.tsx` | 170 | Quote data placeholder |

### 12.2 Hardcoded URLs

- `dashboard.service.ts` lines 39, 50, 58, 186: Backend URL `https://mrp-1.onrender.com/api` hardcoded instead of using `VITE_API_URL`
- `forecast.service.ts` line 55: `API_BASE_URL` hardcoded to production URL
- `vite.config.ts`: Gitpod-specific allowed hosts and proxy targets

### 12.3 Technical Debt

- **Dual data access pattern:** Services use both REST API (`apiClient`) and direct Supabase queries inconsistently
- **Legacy toast system:** Both `react-hot-toast` and custom `ToastProvider/ToastContainer` coexist; migration incomplete
- **No React Router:** `react-router-dom` is installed but unused; manual state-based routing breaks browser history/deep linking
- **Debug logging:** Extensive `console.log` statements with emoji prefixes left in production code
- **No code splitting:** All pages are eagerly loaded at startup
- **`index.html` title:** Still says "Vite + React + Tailwind + TS" instead of product name
- **Missing tests:** Zero test files found in the codebase
- **No `.env.example`:** Only `.env.local` with real credentials
- **No error boundary component:** Only per-page error handling, no global error boundary

### 12.4 Security Concerns

- No authentication or authorization
- Supabase anonymous key in client code (by design, but requires proper RLS policies)
- No input sanitization on frontend
- API keys and Supabase credentials visible in `.env.local`

---

## 13. TESTING

| Aspect | Status |
|---|---|
| Testing Framework | ❌ None configured |
| Test Files | ❌ Zero test files |
| Unit Tests | ❌ None |
| Integration Tests | ❌ None |
| E2E Tests | ❌ None |
| Test Coverage | ❌ 0% |
| UI Test Pages | `UITestPage` and `UITestPage2` exist for **manual** component testing only |

---

## 14. USER FLOWS & WORKFLOWS

### 14.1 Purchase Order Lifecycle

```
Create PO ──→ Open ──→ Wip Called ──→ Packaging Called ──→ In Production
                                                              │
         PO Check ◄──── (amount mismatch detected)            │
              │                                               ▼
              └── Resolve ──→ Open                    Awaiting QA Release
                                                              │
                                                              ▼
                                                     Ready for Despatch
                                                              │
                                                              ▼
                                                  Despatched / Completed
                                                              │
                                                              ▼
                                                           Closed
```

### 14.2 Forecast Import Flow

```
Upload Excel File
       │
       ▼
Parse headers (find "Product" + "Description" columns)
       │
       ▼
Convert rows to JSON → Send to backend
       │
       ▼
Backend identifies unknown products
       │
       ▼
Review: Create placeholder / Map to existing / Skip
       │
       ▼
Finalize import → Refresh forecast table
```

### 14.3 MRP Calculation Flow

```
Fetch Products ──┐
Fetch Forecasts ──┤──→ MRP Engine
Fetch SOH ────────┘         │
                            ▼
                  For each product:
                    For each BOM component:
                      Calculate monthly demand
                            │
                            ▼
                  For each component with stock:
                    Project monthly SOH decline
                    Classify health + priority
                    Generate recommendations
                            │
                            ▼
                  Render inventory projections table
```

### 14.4 PO Import Flow (CSV)

```
Upload CSV/TSV File
       │
       ▼
Parse with flexible header mapping
       │
       ▼
Preview parsed data in table
       │
       ▼
Validate via backend API
       │
       ▼
Review errors → Choose to skip invalid
       │
       ▼
Execute import → View results summary
```

---

## 15. FUTURE ROADMAP SUGGESTIONS

### Must Have (P0)

- **Authentication & RBAC** — Add Supabase Auth with role-based access (Admin, Manager, Operator, Viewer)
- **React Router integration** — Replace manual state routing with proper URL-based routing for deep linking, browser history, and bookmarkability
- **Remove hardcoded URLs** — Consolidate all API URLs to use `VITE_API_URL` environment variable
- **Fix HTML title** — Update from "Vite + React + Tailwind + TS" to proper product name

### Should Have (P1)

- **Implement outstanding TODOs** — `checkPoNumberExists`, `despatchPo` with delivery details, `getFilteredPurchaseOrders`, `getTotalPurchaseOrdersCount`
- **Complete toast migration** — Remove `react-hot-toast` and use custom toast system exclusively
- **Testing framework** — Add Vitest for unit tests and Playwright/Cypress for E2E
- **Remove debug logging** — Strip `console.log` statements from production builds
- **Code splitting** — Lazy load pages with `React.lazy()` and `Suspense`
- **Error boundaries** — Add global React error boundary

### Nice to Have (P2)

- **Analytics & Reporting pages** — Implement the disabled sidebar items
- **Supplier management** — Track suppliers per BOM component with lead times
- **Quote management** — Replace placeholder quote data in ProductDashboardPage
- **Notification system** — Real-time alerts for stock shortages, PO status changes
- **Multi-currency support** — Add currency selection beyond USD
- **i18n support** — Internationalize all user-facing strings
- **Theme persistence** — Save theme preference to localStorage or user profile
- **Audit logging** — Track who changed what and when
- **Dashboard customization** — Allow users to pin/hide KPI cards

---

## 16. RISK ASSESSMENT

### 16.1 Single Points of Failure

| Risk | Impact | Mitigation |
|---|---|---|
| Backend on Render free tier | Cold starts (30+ seconds), limited uptime | Upgrade to paid tier or migrate to production host |
| No authentication | Any user can read/modify/delete all data | Implement Supabase Auth + RLS policies |
| Hardcoded production URLs in services | Breaks local development, blocks environment switching | Use `VITE_API_URL` consistently |
| Single Supabase instance | Database downtime = full outage | Standard Supabase SLA; consider backups |

### 16.2 Scalability Bottlenecks

| Risk | Impact |
|---|---|
| No pagination on product/forecast/SOH APIs | Performance degrades with large datasets |
| MRP calculations run in browser | CPU-intensive for thousands of components |
| No data caching | Redundant API calls on every page navigation |
| No virtual scrolling | Large tables can freeze the browser |

### 16.3 Dependency Risks

| Package | Risk |
|---|---|
| `@material-tailwind/react` 2.1.10 | Specific version pinned; limited maintainer activity |
| `xlsx` 0.18.5 | Community edition; no official security patches |
| React 19 | Latest major version; some ecosystem libraries may have compatibility issues |
| `react-router-dom` 7.11 | Installed but unused — unnecessary dependency bloat |

---

## 17. APPENDIX

### 17.1 Glossary

| Term | Definition |
|---|---|
| **BOM** | Bill of Materials — list of components/materials required to manufacture a product |
| **MRP** | Material Requirements Planning — system for planning component-level demand based on forecasts |
| **PO** | Purchase Order — customer order for a specific product quantity |
| **SOH** | Stock on Hand — current inventory levels for components/materials |
| **Shipper** | A packaging unit containing a defined number of product pieces |
| **Units Per Shipper** | Number of finished product pieces that fit in one shipper container |
| **Mins Per Shipper** | Manufacturing time (minutes) to produce one shipper's worth of product |
| **Run Rate** | Production speed (hourly or daily) for planning purposes |
| **PO Check** | Status flagging an amount discrepancy between customer and system amounts |
| **Despatched** | Australian English for "dispatched" — indicates order has been shipped |
| **Part Code** | Unique identifier for a raw material or component in the BOM |
| **Lead Time** | Days between ordering a component and receiving delivery |
| **Safety Stock** | Minimum inventory level maintained as a buffer against demand variability |
| **EOQ** | Economic Order Quantity — optimal order size that minimizes total inventory costs |
| **Coverage %** | Percentage of upcoming demand that current stock can fulfill |
| **Net Demand** | Total demand minus current stock on hand |
| **FY** | Financial Year |

### 17.2 Key File Reference

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component, page routing, layout |
| `src/types/mrp.types.ts` | Core domain type definitions |
| `src/services/api.service.ts` | REST API HTTP client and PO/Product endpoints |
| `src/services/mrp.service.ts` | MRP calculation engine (639 lines) |
| `src/services/dashboard.api.ts` | Dashboard data fetching with typed interfaces |
| `src/services/export.service.ts` | Multi-format data export (CSV/Excel/PDF) |
| `src/services/forecast.service.ts` | Forecast import, parsing, and weekly data |
| `src/services/import.service.ts` | CSV/TSV parsing with flexible header mapping |
| `src/contexts/ThemeContext.tsx` | Theme provider with dynamic scrollbar styling |
| `src/styles/themes.ts` | Theme definitions (Classic, Sunset, Dark) |
| `src/components/Sidebar.tsx` | Navigation sidebar with 5 menu groups |
| `src/components/dashboard/KPICard.tsx` | Animated KPI card with ApexCharts sparklines |
| `render.yaml` | Render.com deployment configuration |

### 17.3 PO Status Workflow

The 11 possible PO statuses and their color codes:

| Status | Color | Notes |
|---|---|---|
| Open | Blue | Default initial status |
| Wip Called | Gray | Work-in-progress initiated |
| Packaging Called | Gray | Packaging stage initiated |
| PO Check | Red | Amount mismatch flagged |
| In WH Ready | Gray | In warehouse, ready |
| In Production | Yellow | Active manufacturing |
| Awaiting QA Release | Gray | Quality assurance review |
| Ready for Despatch | Gray | Dispatch-ready |
| Despatched / Completed | Green | Shipped to customer |
| Closed | Green | Finalized |
| PO Canceled | Red | Canceled order |
