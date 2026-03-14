# MRP System Worst-Case Scenario Simulation

This document models the performance of the current Manufacturing Resource Planning (MRP) frontend application under a high-stress, worst-case operating scenario.

### Scenario Parameters
- **5,000 Products** currently active in the system.
- **4-Level BOM Depth** (meaning components are built from sub-components, averaging ~780 total exploded component nodes per product).
- **24-Month Demand Forecast** per product.
- **10 Concurrent Planners** running the "Complete Analysis" (`mrp.service.ts`) at the same time.

---

## 1. Data Volume Size (Network Payload)

When a planner opens the Inventory Planning page or runs `calculateInventoryProjections()`, the current frontend architecture executes `Promise.all` to fetch all necessary data without server-side pagination or aggregation.

* **Products & BOM:** 5,000 products $\times$ 780 components each = 3.9 million BOM relation rows. At a minimum of ~150 bytes per JSON row, this equals **~585 MB**.
* **Forecasts:** 5,000 products $\times$ 24 months = 120,000 forecast data points. At ~250 bytes per product forecast JSON object, this equals **~1.25 MB**.
* **Stock on Hand (SOH):** Assuming 20,000 unique raw materials and sub-assemblies across all BOMs. SOH data $\times$ ~300 bytes equals **~6 MB**.

**Total Network Payload Output:** **~592 MB** of raw uncompressed JSON data per planner request.

## 2. API Request Volume & Server Stress

When **10 concurrent planners** log on and hit the dashboard/MRP calculation:
* The frontend makes `3` parallel GET requests (`/products`, `/forecasts`, `/soh`) per user.
* Total concurrent API requests = **30 requests**.
* **Server Bandwidth Peak:** 10 users $\times$ 592 MB = **5.92 GB** of outbound JSON bandwidth requested instantly.
* **Database Stress:** Supabase or the underlying PostgreSQL instance will be forced to execute full table scans and joins on millions of BOM rows concurrently, likely exceeding connection pool limits or standard memory tier allowances, triggering HTTP 500/504 Timeouts.

## 3. Browser Memory Usage Estimate (Client-Side)

Browsers (especially Chrome V8) are notoriously hungry when parsing large JSON strings into JavaScript objects.
* A 592 MB JSON payload typically inflates 3x to 5x when instantiated as parsed JavaScript HashMaps, Sets, and Arrays in memory.
* **Peak Memory Usage:** **~1.7 GB to 2.9 GB** per browser tab.
* **Impact:** This exceeds the base memory limit for individual Chrome tabs (often capped around ~1.4 GB to 2 GB depending on system architecture). 
* **Result:** The browser tab will trigger the "Aw, Snap! Out of Memory" crash screen for the user before the array sorting even begins.

## 4. Estimated MRP Calculation Time

If we assume the planner is using a high-end workstation that somehow doesn't crash from the memory load, we must calculate the Time Complexity of `mrp.service.ts`:

Currently, the code uses an $O(N)$ `.find()` lookup inside an $O(N)$ `.forEach()` loop:
```javascript
products.forEach((product) => {
  const forecast = forecasts.find(f => f.productCode === product.productCode); 
  // ...
});
```
* **Step 1 (Matches):** 5,000 $\times$ 5,000 = **25,000,000** iteration steps.
* **Step 2 (Demand Aggregation):** 5,000 products $\times$ 780 components $\times$ 24 months = **93,600,000** iterations.
* **Step 3 (Projections & Sorting):** 20,000 components sorting arrays of 24 months, calculating coverage limits, reorder points, and formatting strings.

**Estimated Calculation Time:** **~8 to 14 seconds** of pure, synchronous CPU blocking on the main JavaScript thread. Because it runs synchronously on the main thread, the entire React UI will "freeze" (inputs will be unclickable, spinners will stop animating). 

*(Note: In reality, because the code does not actively support multi-level BOM explosion recursively, it would only calculate the top level, but if modified to support 4-levels via a recursive algorithm, it would easily hit this time limit.)*

## 5. Breakpoint Analysis (When/Where the System Fails)

The system will catastrophically cascade fail under this scenario in the following order:

1. **First Breakpoint: API Gateway / Supabase Timeout (15-30s)**
   The query to fetch 3.9 million BOM records without pagination will likely timeout the serverless function or Supabase REST gateway before it can finish compiling the JSON string.
2. **Second Breakpoint: Backend Out-of-Memory (OOM)**
   If 10 planners ask for the same 592 MB payload concurrently, the Node.js Express server (`mrp-1.onrender.com`) will attempt to stringify 5.9 GB of data in RAM and will crash (`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`).
3. **Third Breakpoint: Browser Tab Crash (OOM)**
   If the data makes it to the frontend, the browser will crash while parsing the `fetch().json()` response payload, turning the screen white or showing an OOM error.
4. **Fourth Breakpoint: UI Thread Lock**
   If the user survives the memory spike, the $\sim$118 million synchronous calculation iterations will trigger the browser's "Page Unresponsive: Wait or Exit?" warning dialog.

### Mitigation & Solution
The current architecture is a **prototype** and is mathematically incompatible with enterprise-scale manufacturing data. 
To fix this:
1. Move the `mrp.service.ts` calculation logic entirely to a backend PostgreSQL Materialized View, Supabase Edge Function, or standard Node microservice.
2. The frontend should only send a single localized request (e.g., "Get me the top 50 components at risk for Product X") rather than downloading the entire database to the client.
