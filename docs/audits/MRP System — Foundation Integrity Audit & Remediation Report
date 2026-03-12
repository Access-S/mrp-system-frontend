Document Classification: Internal — Technical Leadership Review
Prepared: June 2025
System: Manufacturing Resource Planning (MRP) Web Platform
Audit Scope: Frontend application, Backend API, Database schema, Data integrity
System Maturity at Audit Start: ~25% complete

1. Purpose of This Report
During a comprehensive architectural review of the MRP system, a series of foundational defects were identified that collectively undermined the reliability of the platform's core function — calculating whether the business has enough materials to meet customer demand.

This report documents what was found, what the business impact of each issue was, what has been remediated to date, and what remains to be addressed. It is written for stakeholders who need to understand the state of the system without requiring technical expertise.

2. Background
The MRP system is designed to replace disconnected spreadsheets and manual processes with a single platform that:

Imports weekly customer demand forecasts
Maintains a Bill of Materials (BOM) for every product
Tracks packaging material stock on hand (SOH) via 3PL uploads
Calculates whether current stock can meet upcoming demand
Manages the Purchase Order (PO) lifecycle from receipt to despatch
Provides dashboards and KPIs for operational visibility
At the time of the audit, the system was approximately 25% built, with key modules functional but several critical data pathways broken or inconsistent.

3. What Was Found — Executive Summary
The Core Problem
The MRP engine — the central calculation that determines whether materials need to be purchased — was producing zero demand for every product. Every component appeared "Healthy" regardless of actual stock levels or forecast volumes. This means any decisions based on MRP output would have been fundamentally wrong.

Root Causes
The audit identified 23 distinct issues across five categories:

Category	Issue Count	Severity Range
Data flow breakage (wrong data reaching calculations)	3	🔴 Critical
Inconsistent data access patterns (multiple conflicting pathways)	5	🟠 High
Type definitions mismatched with reality (code says one thing, data says another)	4	🟠 High
MRP logic gaps (missing inputs to calculations)	5	🟡 Medium
Code quality and technical debt	6	🟡–🟢 Medium to Low
Business Risk at Time of Discovery
Risk Area	Consequence
Material planning	System showed no shortages even when stock was critically low — could lead to production stoppages
Data integrity	Same data retrieved via different pathways returned different results — inconsistent reporting
Stock visibility	Database column naming mismatches meant SOH records could become "orphaned" with no link to their BOM components
System scalability	Fetching all records to the browser for every operation would degrade performance as data volume grows
Maintainability	Three different methods to call the same data, scattered across multiple files — high risk of introducing bugs with any change
4. Remediation Plan
A prioritised, sequential fix plan was designed to address issues from the foundation up. The principle was: fix the data layer first, then the logic, then the presentation.

Fix Sequence
Fix	Scope	Issues Addressed	Rationale
Fix 0	Database column naming	Misleading column names in SOH and Parts tables	Must be correct before any code references them
Fix 1	MRP data flow	Core engine reading wrong data property; products silently dropped from calculations	The #1 critical bug — nothing else matters if the engine reads zero
Fix 2	Service layer standardisation	Duplicate services, three different API call patterns, hardcoded URLs	Foundation for consistent, secure data access
Fix 3	Type definitions	TypeScript types declaring fields that don't exist in the database	Developers must be able to trust the type system
Fix 4	Product data access	Direct database calls from browser, missing API endpoints, redundant functions across files	Complete the backend-first architecture for products
Fix 5	PO data transformation (planned)	Purchase Order API returns raw database format instead of application format	Consistency with the pattern established for Products
5. What Has Been Fixed
Fix 0 — Database Column Standardisation ✅
Problem:
Two database tables (soh and parts) used a column named product_id that actually contained part codes, not product identifiers. The same column name was used elsewhere (bom_components, purchase_orders) to store genuine product UUIDs. This created confusion about what data each column held and made cross-table queries unreliable.

What Was Done:

Renamed soh.product_id → soh.part_code
Renamed parts.product_id → parts.part_code
Renamed associated database indexes for consistency
Updated all backend controller queries referencing these columns
Updated all frontend service files and page components
Verified that bom_components.product_id and purchase_orders.product_id (which correctly hold UUIDs) were not affected
Files Changed: 6 (1 SQL migration, 1 backend controller, 2 frontend services, 1 frontend page, 1 frontend interface)

Business Impact: Column names now accurately describe their content. Developers and future database queries will not confuse part codes with product IDs. SOH-to-BOM matching is now clearly understood in code.

Fix 1 — MRP Engine Data Flow Restoration ✅
Problem:
The MRP engine expected forecast data in a property called monthlyForecast, but the forecast service provided data in a property called weeklyForecast. When the engine tried to read monthlyForecast, it received undefined, which meant the demand calculation loop never executed. Every component showed zero demand and appeared "Healthy" regardless of actual stock levels.

Additionally, a validation check silently removed any product without a unitsPerShipper value from the calculation — even though this field was not needed for the computation (forecasts are already provided in shipper quantities).

What Was Done:

Aligned the Forecast type definition to match actual data: weeklyForecast with YYYY-MM-DD keys
Removed unused fields from the Forecast type (id, period, confidence, actualQuantity, forecastedQuantity, createdAt, updatedAt) that were never populated
Updated the MRP engine to iterate over weekly data instead of monthly
Renamed all internal references from monthly terminology to weekly (sortedMonths → sortedWeeks, fourMonthDemand → horizonDemand, averageMonthlyDemand → averageWeeklyDemand)
Introduced a configurable PROJECTION_HORIZON_WEEKS = 17 constant (~4 months) for health assessment
Corrected daily demand calculation from /30 (monthly) to /7 (weekly)
Removed the unitsPerShipper gate check that silently dropped products
Updated the forecast service to provide a properly typed getAllForecasts() method
Updated the Inventory Planning page to use the new weekly property names
Files Changed: 4 (1 type definition, 2 frontend services, 1 frontend page)

Business Impact: The MRP engine now correctly calculates component-level demand from weekly forecasts. Health statuses (Healthy/Risk/Shortage) reflect actual stock coverage against forecast demand. Products are no longer silently excluded from analysis.

Fix 2 — Service Layer Standardisation ✅
Problem:
The frontend had multiple, conflicting ways to access the same data:

Product data could be fetched via product.service.ts (backend API), api.service.ts (backend API, different function), or product.service.ts (direct database query) — three different pathways returning subtly different data shapes
SOH data had two separate service files (soh.service.ts and inventory.service.ts) with overlapping functions, each using different connection methods
Forecast data used a hardcoded production URL instead of the shared API client, meaning local development tested against production data
Some services used the shared HTTP client, some used raw browser fetch calls, and some queried the database directly — resulting in inconsistent error handling, no centralised authentication capability, and different response formats
What Was Done:

Renamed inventory.service.ts to component.service.ts to accurately reflect its purpose (providing component data to the MRP engine, not managing inventory)
Established clear ownership: soh.service.ts handles SOH page operations (import, display), component.service.ts handles MRP data transformation
Removed all direct database queries from component.service.ts
Removed duplicate import functions that existed in both SOH services
Updated the SOH service to use the shared API client's base URL instead of a hardcoded production URL
Added a getBaseURL() method to the shared API client for file upload operations that cannot use JSON
Updated all downstream consumers (MRP service, Inventory page)
Files Changed: 6 (1 new service, 1 deleted service, 4 updated files)

Business Impact: All data access now flows through a single, consistent pathway. This enables future implementation of authentication, centralised error handling, and environment-specific configuration. The risk of one code path returning different data than another has been eliminated for SOH/component data.

Fix 3 — Type Definition Alignment ✅
Problem:
The TypeScript Product type definition was missing fields that the application actively used (createdAt, updatedAt) and a service mapping function was populating a field (currentStock) from a database column that did not exist, resulting in the value always being 0.

What Was Done:

Added createdAt and updatedAt to the Product type definition
Removed the currentStock mapping from the product transformation function — this column does not exist in the database and the value was always zero
Files Changed: 2 (1 type definition, 1 frontend service)

Business Impact: Type definitions now accurately represent the data. Developers can trust TypeScript to flag genuine errors rather than working around phantom fields.

Fix 4 — Product Data Access Architecture ✅
Problem:
When a user navigated to a product detail page, the system fetched all 79 products with their complete BOMs, then scanned the array in the browser to find the one requested product — discarding 78 products' worth of data. This happened because no backend endpoint existed to fetch a single product, so the frontend bypassed the backend and queried the database directly, which returned products without BOM components (the direct query didn't include the join).

Additionally, product-related functions were scattered across two service files (product.service.ts and api.service.ts), with different function signatures for the same operation.

What Was Done:

Backend:

Created a new API endpoint (GET /products/:productCode) that returns a single product with its BOM components in the correct format
Added route registration with parameter validation
Frontend:

Rewrote the product service to route all operations through the backend API — no direct database access
Replaced getProductById() (broken, returned empty components) with getProductByCode() (uses new endpoint, returns complete data)
Removed search and filtering functions that bypassed the backend
Removed a function that queried a non-existent database column (current_stock)
Removed duplicate product functions from the shared API service file
Updated the Product Detail page to fetch a single product instead of all products
Updated four additional pages and modals that referenced the removed functions
Files Changed: 9 (2 backend files, 7 frontend files)

Business Impact: Product detail pages now load a single product instead of the entire catalogue. The direct database access pathway (which returned incomplete data) has been eliminated. All product operations go through the backend API, establishing the pattern for future authentication and access control.

6. What Remains — Planned Future Fixes
Immediate Priority
Issue	Description	Business Impact	Estimated Effort
PO Data Transformation	The Purchase Order API returns data in raw database format (snake_case column names) while the application expects a different format (camelCase). The system works because TypeScript checks are bypassed, but the types are effectively decorative.	PO-related bugs will be difficult to diagnose. Any developer trusting the type definitions will write code that fails at runtime.	Medium — add transformation layer matching the Product controller pattern
Backend Service Layer	Business logic (validation, calculations, data transformation) lives directly in API route handlers. This makes it impossible to reuse rules, difficult to test, and creates long, complex functions.	Increases risk of introducing bugs when adding features. Cannot share business rules between different API endpoints.	Large — requires restructuring all backend controllers
MRP Engine Enhancement
Issue	Description	Business Impact
MRP Logic Redesign	Current health assessment uses a fixed horizon comparison. Real requirements are customer-specific (different stock targets per customer), MOQ-aware (minimum order quantities affect reorder decisions), and need to consider what has already been ordered.	MRP recommendations may suggest ordering when not needed, or not suggest ordering when urgently needed.
Open POs Not in MRP	System does not consider incoming purchase orders when calculating material requirements. If 3,000 units are on order, the system still recommends ordering the full shortfall.	Over-ordering, excess inventory, locked capital.
Safety Stock Not Yet Implemented	Database columns for safety stock levels do not exist yet. The MRP engine references these fields but they always return zero.	Cannot set minimum stock thresholds per component.
Lead Time Not Considered	All shortage recommendations say "order immediately" regardless of whether the supplier lead time is 2 weeks or 12 weeks.	Cannot prioritise orders by actual urgency. Time-sensitive orders may be treated with the same urgency as orders with months of buffer.
MRP Runs in Browser	All calculation data is downloaded to the user's browser and processed locally.	Works at current scale (~79 products, ~200 components) but will degrade as data grows. Results may vary between users if data changes mid-session.
Code Quality
Issue	Description	Business Impact
Debug Logging in Production	Console debug statements remain in production code, including data samples.	Noisy browser console, potential information leakage. Partially addressed — removed from product service in Fix 4.
Two Dashboard Service Files	dashboard.api.ts and dashboard.service.ts both exist with unclear ownership.	Developer confusion about which to maintain.
Forecast Service Still Uses Raw Fetch	While the hardcoded URL was addressed via apiClient.getBaseURL(), the forecast service still uses raw fetch() instead of the shared API client for some operations.	Inconsistent with the standardised pattern. Will need updating when authentication is added.
Orphaned Utility Functions	Functions for Economic Order Quantity, Reorder Point calculation, and Days of Coverage exist but are never called by any part of the system.	Dead code that suggests capabilities the system doesn't have.
No Authentication	No user login, no role-based access, no audit trail of who made changes.	Anyone with the URL can modify BOMs, adjust stock, approve POs.
No Automated Tests	Zero unit or integration tests across the entire codebase.	Every fix carries risk of breaking something else. Cannot verify system correctness after changes.
7. Partially Addressed Issues
Several issues from the original audit have been partially resolved as a natural consequence of the fixes applied, even though they were not the primary target:

Issue	Original State	Current State	What Remains
Hardcoded Production URL	Forecast service had production URL hardcoded — local development hit production	SOH service now uses apiClient.getBaseURL()	Forecast service import/review functions still use raw fetch() with API_BASE_URL
Three Different API Patterns	apiClient, raw fetch, direct Supabase — all used interchangeably	Product and Component services fully standardised on apiClient. SOH service uses apiClient.getBaseURL() for uploads	Forecast service and PO service still have mixed patterns
Debug Console Logs	Extensive debug logging including data samples in production	Removed from product.service.ts	Remain in other services (soh.service.ts, component.service.ts, forecast.service.ts)
Duplicate Function Exports	Every service exported both class methods and standalone functions for "backward compatibility"	Product service cleaned up — minimal, clear exports	Other services still export both patterns
8. Risk Assessment — Current State
Area	Pre-Remediation	Post-Remediation	Remaining Risk
MRP Accuracy	🔴 Zero demand calculated — completely unreliable	🟢 Weekly demand correctly flows through engine	🟡 MRP logic needs customer-specific targets and open PO consideration
Data Consistency	🔴 Same query via different pathways returned different data	🟢 Product and SOH data access standardised	🟡 PO data still has mixed patterns
Data Integrity	🟠 Column naming caused confusion between part codes and product IDs	🟢 Columns accurately named, clear relationships	🟡 SOH table intentionally has no foreign key (3PL data may have unknown codes)
Type Safety	🔴 Types declared fields that didn't exist, missed fields that did	🟢 Product and Forecast types match reality	🟡 PO type still mismatched with API response format
Performance	🟠 Product detail page fetched all 79 products	🟢 Single product fetch via dedicated endpoint	🟡 MRP engine still fetches all data to browser
Security	🔴 Frontend could query database directly, bypassing all controls	🟢 Product data access fully through backend API	🟠 No authentication exists yet
9. Recommendations
Complete the PO transformation layer (Fix 5) before building any new PO features — the current type mismatch will cause increasingly difficult bugs as the PO module grows

Prioritise the MRP logic redesign once the data layer is stable — this is the primary value proposition of the system and the current health check logic is a temporary placeholder

Add authentication before any external deployment — the system currently has no access control

Establish automated testing starting with the MRP calculation engine — this is where incorrect results have the highest business cost

Plan the forecast comparison feature (detailed specification exists) as the next major feature after foundation work is complete — this delivers immediate, measurable business value in the weekly planning cycle

10. Appendix — Complete Issue Register
#	Severity	Issue	Status
1A	🔴 Critical	MRP reads wrong forecast property — zero demand	✅ Fixed (Fix 1)
1B	🔴 Critical	MRP logic needs complete redesign	⏸️ Parked — requires dedicated design session
2	🟠 High	Product detail fetches all products, broken getProductById	✅ Fixed (Fix 4)
3	🟠 High	unitsPerShipper gate silently drops products	✅ Fixed (Fix 1)
4	🟠 High	Triple data access pattern, scattered business logic	✅ Fixed for Products + SOH (Fix 2, Fix 4). PO remains.
5	🟠 High	Hardcoded production URL in forecast service	⚠️ Partially fixed (Fix 2)
6	🟠 High	Three different API call patterns	⚠️ Partially fixed (Fix 2, Fix 4)
7	🟠 High	Product type ghost fields, missing timestamps	✅ Fixed (Fix 3)
8	🟠 High	No backend service layer, PO returns raw snake_case	🔲 Planned (Fix 5)
9	🔴 Critical	getAllForecasts wrapper returns wrong data shape	✅ Fixed (Fix 1)
10	🟡 Medium	Open POs not in MRP calculation	🔲 Planned
11	🟡 Medium	Safety stock columns not yet created	🔲 Planned (database migration)
12	🟡 Medium	No lead time awareness in MRP	🔲 Planned
13	🟡 Medium	MRP engine runs in browser	🔲 Planned
14	🟡 Medium	Excel parsed in both frontend and backend	🔲 Planned
15	🟡 Medium	Two dashboard service files	🔲 Planned
16	🟠 High	SOH vs Inventory service confusion	✅ Fixed — renamed to component.service (Fix 2)
17	🟡 Medium	Debug console.logs in production	⚠️ Partially fixed (Fix 4)
18	🟡 Medium	Orphaned utility functions never called	🔲 Planned
19	🟢 Low	No authentication or authorisation	🔲 Planned
20	🟢 Low	No automated tests	🔲 Planned
21	🟢 Low	PO status array — confirmed intentional design	✅ Resolved — not an issue
22	🟢 Low	Schema file ambiguity	🔲 Planned
23	🟢 Low	Backward-compatibility dual exports	⚠️ Partially fixed (Fix 4)
0	🟠 High	SOH/Parts column named product_id but holds part codes	✅ Fixed (Fix 0)
Total: 23 issues identified → 10 fully resolved, 4 partially addressed, 9 planned

Report prepared following system architecture audit conducted June 2025.
All fixes applied on branch: refactor/data-layer-cleanup