MRP System Frontend — Migration Report & AI Instructions
Document Information
text

Project:        MRP System Frontend
Document:       Structure Migration Plan & AI Assistant Rules
Version:        1.0
Created:        2025-03-28
Status:         Ready for Execution
Estimated Time: 7-8 hours (spread across 1-2 weeks)
Table of Contents
text

1. Executive Summary
2. Why We Are Doing This
3. Current vs Target Structure
4. AI Assistant Rules (copy-paste ready)
5. Migration Phases (step by step)
6. File Movement Map (every file, every destination)
7. Types Migration Strategy
8. Git Workflow
9. Verification Checklist
10. Recommended Free AI Coding Tools
1. Executive Summary
We are migrating the MRP System Frontend from a type-based folder structure (files grouped by what they are — components, services, hooks) to a feature-based folder structure (files grouped by what they do — dashboard, products, purchase orders).

What changes:

Feature-specific files move into src/features/{feature}/
Pages move out of components/pages/ into their feature folders
The monolithic mrp.types.ts gets split per feature
A new src/app/ folder holds routing and providers
A new src/utils/ and src/config/ folder holds shared utilities
What does NOT change:

components/ui/* stays exactly where it is
components/shared/* stays exactly where it is
hooks/* (shared hooks) stays where it is
No code logic is rewritten
No types are invented or modified
No new features are added
2. Why We Are Doing This
text

PROBLEM                              SOLUTION
───────                              ────────
Purchase order code lives in         Everything for purchase orders
5 different folders                  lives in one folder

Adding a new feature means           Adding a new feature means
touching 6 directories              creating one directory

Deleting a feature means             Deleting a feature means
hunting across the codebase          removing one folder

One types file will grow             Each feature owns its types
to 1000+ lines

New developers must understand       New developers can read one
the whole project                    feature in isolation
3. Current vs Target Structure
Current (Type-Based)
text

src/
├── components/
│   ├── pages/              ← pages mixed with components
│   │   ├── DashboardPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── PurchaseOrdersPage.tsx
│   │   └── ...
│   ├── forms/              ← all forms dumped together
│   ├── modals/             ← all modals dumped together
│   ├── dashboard/          ← feature components
│   ├── purchase-orders/    ← feature components
│   ├── products/           ← feature components
│   ├── tabs/               ← mixed feature components
│   ├── shared/             ← ✓ this is fine
│   └── ui/                 ← ✓ this is fine
├── services/               ← all services dumped together
├── hooks/                  ← all hooks dumped together
├── types/
│   └── mrp.types.ts        ← everything in one file
└── ...
Target (Feature-Based)
text

src/
├── app/                     ← NEW: app shell
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── features/                ← NEW: domain modules
│   ├── dashboard/
│   ├── products/
│   ├── purchase-orders/
│   ├── forecasts/
│   ├── inventory/
│   ├── soh/
│   └── import/
├── components/
│   ├── ui/                  ← UNCHANGED
│   ├── shared/              ← UNCHANGED
│   └── layout/              ← NEW: Sidebar + ErrorBoundary
├── hooks/                   ← UNCHANGED (shared hooks only)
├── services/
│   ├── api.service.ts       ← STAYS (base HTTP client)
│   └── export.service.ts    ← STAYS (generic export)
├── types/
│   ├── api.types.ts         ← NEW: shared API types only
│   └── common.types.ts      ← NEW: shared enums/interfaces
├── utils/                   ← NEW: shared utilities
├── config/                  ← NEW: env, routes, supabase
├── contexts/                ← UNCHANGED
└── styles/                  ← UNCHANGED
4. AI Assistant Rules
Copy and paste this entire block at the start of EVERY AI session:

Markdown

═══════════════════════════════════════════════════════════════
  AI CODE ASSISTANT — MRP FRONTEND MIGRATION RULES
  
  Read these rules completely before responding.
  Violating any rule means your output will be rejected.
═══════════════════════════════════════════════════════════════

PROJECT CONTEXT:
We are migrating an MRP (Material Requirements Planning) React 
frontend from a type-based folder structure to a feature-based 
folder structure. This is a MECHANICAL migration. We are moving 
files and updating import paths. Nothing else.

Tech stack: React, TypeScript, Vite, Tailwind CSS, Supabase

Path alias: "@/" maps to "src/"

═══════════════════════════════════════════════════════════════
ABSOLUTE RULES — NO EXCEPTIONS
═══════════════════════════════════════════════════════════════

RULE 1: DO NOT REWRITE CODE
  - Move files exactly as they are
  - The ONLY lines you may change are import/export statements
  - If a function is ugly, leave it ugly
  - If a variable name is bad, leave it bad
  - If there's a bug, leave the bug
  - You are a FILE MOVER, not a CODE IMPROVER

RULE 2: DO NOT INVENT TYPES
  - Never write a type definition from memory or assumption
  - Only copy types that I explicitly paste to you
  - If you don't know what a type looks like, ASK ME
  - If I say "extract the SOH types," I will paste the source
    file for you to copy from. WAIT for me to paste it.

RULE 3: DO NOT ADD THINGS THAT DON'T EXIST
  - No new error handling
  - No new validation
  - No new helper functions
  - No new hooks
  - No new components
  - No "I've also added..." — you add NOTHING

RULE 4: DO NOT RENAME ANYTHING
  - Variable names stay the same
  - Function names stay the same
  - Type names stay the same
  - File names stay the same (unless I explicitly say otherwise)
  - Component names stay the same

RULE 5: DO NOT ASSUME FILE CONTENTS
  - If I say "move soh.service.ts," do NOT guess what's inside
  - Ask me to paste the file, or wait for me to paste it
  - Work ONLY with code I have explicitly provided

RULE 6: SHOW YOUR WORK
  - After every file move, show me:
    a) The list of import lines that CHANGED (before → after)
    b) Confirmation that all other lines are UNCHANGED
  - If no imports changed, say "No import changes needed"

RULE 7: ONE FILE AT A TIME
  - I will ask you to move one file per message
  - Complete that one file before moving to the next
  - Do not batch multiple files unless I explicitly ask

RULE 8: STOP IF UNCERTAIN
  - If you're not sure where an import resolves to → ASK
  - If you're not sure what type to use → ASK
  - If the instruction is ambiguous → ASK
  - Never guess. Guessing = hallucinating.

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════════════

When I ask you to move a file, respond in this exact format:

  FILE: [old path] → [new path]
  
  IMPORT CHANGES:
  Line X: [old import] → [new import]
  Line Y: [old import] → [new import]
  
  OTHER FILES AFFECTED:
  - [file path]: [old import line] → [new import line]
  
  FULL UPDATED FILE:
  [paste the complete file with only imports changed]
  
  VERIFICATION:
  - [ ] Only import paths changed
  - [ ] No code logic modified  
  - [ ] No types invented
  - [ ] No variables renamed

═══════════════════════════════════════════════════════════════
FEATURE FOLDER STRUCTURE (for reference)
═══════════════════════════════════════════════════════════════

Each feature follows this pattern:

  features/{feature-name}/
  ├── components/        ← UI components specific to this feature
  ├── forms/             ← form components (if any)
  ├── modals/            ← modal components (if any)
  ├── hooks/             ← hooks specific to this feature
  ├── services/          ← API service for this feature
  ├── types/             ← TypeScript types for this feature
  ├── helpers.ts         ← helper functions (if any)
  ├── constants.ts       ← constants (if any)
  ├── {Feature}Page.tsx  ← page component(s)
  └── index.ts           ← barrel exports (public API)

═══════════════════════════════════════════════════════════════
IMPORT PATH RULES
═══════════════════════════════════════════════════════════════

All imports must use the "@/" path alias.

CORRECT:
  import { Button } from '@/components/ui/Button';
  import { SohRecord } from '@/features/soh/types/soh.types';

WRONG:
  import { Button } from '../../../components/ui/Button';
  import { SohRecord } from '../../types/mrp.types';

When a file moves, update its internal imports to use "@/" 
paths based on the NEW file location. Also identify any OTHER 
files that import from the OLD location and show me what their 
import lines should change to.

═══════════════════════════════════════════════════════════════
5. Migration Phases
Pre-Migration: Path Alias Setup
Do this manually. Do not use AI for this.

TypeScript

// vite.config.ts — add resolve alias
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ... rest of your config
});
JSON

// tsconfig.json — add paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
Bash

git checkout -b refactor/path-alias-setup
# make the changes above
# run the app, verify it works
git add .
git commit -m "chore: add @ path alias"
git checkout main
git merge refactor/path-alias-setup
Phase 1: App Shell
Branch: refactor/app-shell

text

TASK 1.1 — Create src/app/ folder
  Create: src/app/App.tsx
  Action: Move content from src/App.tsx
  
TASK 1.2 — Extract router  
  Create: src/app/router.tsx
  Action: Extract route definitions from App.tsx
  
TASK 1.3 — Extract providers
  Create: src/app/providers.tsx
  Action: Extract context provider wrappers from App.tsx

TASK 1.4 — Update main.tsx
  Action: Point to new src/app/App.tsx location

TASK 1.5 — Create layout components
  Create: src/components/layout/Sidebar.tsx
  Action: Move from src/components/Sidebar.tsx
  Create: src/components/layout/ErrorBoundary.tsx
  Action: Move from src/components/ErrorBoundary.tsx
  Create: src/components/layout/MainLayout.tsx
  Action: New file (wrapper with Sidebar)
  Create: src/components/layout/index.ts

✅ VERIFY: App runs. All routes work. Commit.
Phase 2: SOH Feature (Smallest First)
Branch: refactor/migrate-soh

text

TASK 2.1 — Create folder structure
  mkdir -p src/features/soh/components
  mkdir -p src/features/soh/hooks  
  mkdir -p src/features/soh/services
  mkdir -p src/features/soh/types

TASK 2.2 — Move page
  Move: components/pages/SohPage.tsx → features/soh/SohPage.tsx

TASK 2.3 — Move components
  Move: components/soh/SohSkeleton.tsx → features/soh/components/SohSkeleton.tsx
  Move: components/soh/index.ts → features/soh/components/index.ts

TASK 2.4 — Move service
  Move: services/soh.service.ts → features/soh/services/soh.service.ts

TASK 2.5 — Extract types
  From: types/mrp.types.ts
  Copy: SOH-related types into features/soh/types/soh.types.ts
  Keep: Re-export from mrp.types.ts for backward compatibility

TASK 2.6 — Create barrel
  Create: features/soh/index.ts
  Content: export { SohPage } from './SohPage';

TASK 2.7 — Update router
  Update: app/router.tsx to import from '@/features/soh'

✅ VERIFY: SOH page loads. Data displays correctly. Commit.
Phase 3: Forecasts Feature
Branch: refactor/migrate-forecasts

text

TASK 3.1 — Create folder structure
  mkdir -p src/features/forecasts/components
  mkdir -p src/features/forecasts/hooks
  mkdir -p src/features/forecasts/services
  mkdir -p src/features/forecasts/types

TASK 3.2 — Move page
  Move: components/pages/ForecastsPage.tsx → features/forecasts/ForecastsPage.tsx

TASK 3.3 — Move components
  Move: components/forecasts/ForecastSkeleton.tsx → features/forecasts/components/
  Move: components/forecasts/constants.ts → features/forecasts/constants.ts
  Move: components/forecasts/helpers.ts → features/forecasts/helpers.ts
  Move: components/forecasts/index.ts → features/forecasts/components/index.ts

TASK 3.4 — Move service
  Move: services/forecast.service.ts → features/forecasts/services/

TASK 3.5 — Extract types
  Copy: Forecast-related types into features/forecasts/types/forecast.types.ts

TASK 3.6 — Create barrel + update router

✅ VERIFY: Forecasts page loads. Commit.
Phase 4: Import Feature
Branch: refactor/migrate-import

text

TASK 4.1 — Create folder structure

TASK 4.2 — Move page
  Move: components/pages/ImportPage.tsx → features/import/ImportPage.tsx

TASK 4.3 — Move components
  Move: components/modals/ExcelImportModal.tsx → features/import/components/

TASK 4.4 — Move service and hook
  Move: services/import.service.ts → features/import/services/
  Move: hooks/useImport.ts → features/import/hooks/

TASK 4.5 — Extract types + create barrel + update router

✅ VERIFY: Import page loads. Excel import works. Commit.
Phase 5: Inventory Feature
Branch: refactor/migrate-inventory

text

TASK 5.1 — Create folder structure

TASK 5.2 — Move page
  Move: components/pages/InventoryPage.tsx → features/inventory/InventoryPage.tsx

TASK 5.3 — Move service
  Move: services/mrp.service.ts → features/inventory/services/

TASK 5.4 — Extract types + create barrel + update router

✅ VERIFY: Inventory page loads. Commit.
Phase 6: Dashboard Feature
Branch: refactor/migrate-dashboard

text

TASK 6.1 — Create folder structure
  mkdir -p src/features/dashboard/components/charts
  mkdir -p src/features/dashboard/hooks
  mkdir -p src/features/dashboard/services
  mkdir -p src/features/dashboard/types

TASK 6.2 — Move page
  Move: components/pages/DashboardPage.tsx → features/dashboard/DashboardPage.tsx

TASK 6.3 — Move components
  Move: components/dashboard/charts/* → features/dashboard/components/charts/
  Move: components/dashboard/DashboardSkeleton.tsx → features/dashboard/components/
  Move: components/dashboard/KPICard.tsx → features/dashboard/components/
  Move: components/dashboard/LowStockAlerts.tsx → features/dashboard/components/
  Move: components/dashboard/RecentActivityCard.tsx → features/dashboard/components/
  Move: components/dashboard/TimeRangeFilter.tsx → features/dashboard/components/
  Move: components/dashboard/TopItemsCard.tsx → features/dashboard/components/

TASK 6.4 — Move services
  Move: services/dashboard.service.ts → features/dashboard/services/
  Move: services/dashboard.api.ts → features/dashboard/services/
  NOTE: Consider merging these two into one file LATER (not during migration)

TASK 6.5 — Extract types + create barrel + update router

✅ VERIFY: Dashboard loads. Charts render. KPIs display. Commit.
Phase 7: Products Feature
Branch: refactor/migrate-products

text

TASK 7.1 — Create folder structure
  mkdir -p src/features/products/components
  mkdir -p src/features/products/forms
  mkdir -p src/features/products/modals
  mkdir -p src/features/products/hooks
  mkdir -p src/features/products/services
  mkdir -p src/features/products/types

TASK 7.2 — Move pages
  Move: components/pages/ProductsPage.tsx → features/products/ProductsPage.tsx
  Move: components/pages/ProductDashboardPage.tsx → features/products/ProductDashboardPage.tsx

TASK 7.3 — Move components
  Move: components/products/ProductsSkeleton.tsx → features/products/components/
  Move: components/tabs/ProductInfoTab.tsx → features/products/components/
  Move: components/tabs/BomManagementTab.tsx → features/products/components/

TASK 7.4 — Move forms
  Move: components/forms/CreateProductForm.tsx → features/products/forms/
  Move: components/forms/EditProductForm.tsx → features/products/forms/

TASK 7.5 — Move modals
  Move: components/modals/AddBomComponentModal.tsx → features/products/modals/
  Move: components/modals/BomDetailModal.tsx → features/products/modals/
  Move: components/modals/EditBomComponentModal.tsx → features/products/modals/

TASK 7.6 — Move services
  Move: services/product.service.ts → features/products/services/
  Move: services/bom.service.ts → features/products/services/
  Move: services/component.service.ts → features/products/services/

TASK 7.7 — Extract types + create barrel + update router

✅ VERIFY: Products list loads. Create/edit works. BOM modal works. Commit.
Phase 8: Purchase Orders Feature
Branch: refactor/migrate-purchase-orders

text

TASK 8.1 — Create folder structure
  mkdir -p src/features/purchase-orders/components
  mkdir -p src/features/purchase-orders/forms
  mkdir -p src/features/purchase-orders/modals
  mkdir -p src/features/purchase-orders/hooks
  mkdir -p src/features/purchase-orders/services
  mkdir -p src/features/purchase-orders/types

TASK 8.2 — Move pages
  Move: components/pages/PurchaseOrdersPage.tsx → features/purchase-orders/PurchaseOrdersPage.tsx
  Move: components/pages/CreatePOPage.tsx → features/purchase-orders/CreatePOPage.tsx

TASK 8.3 — Move components
  Move: components/purchase-orders/ActionsCell.tsx → features/purchase-orders/components/
  Move: components/purchase-orders/StatusCell.tsx → features/purchase-orders/components/
  Move: components/purchase-orders/PurchaseOrdersSkeleton.tsx → features/purchase-orders/components/
  Move: components/purchase-orders/constants.ts → features/purchase-orders/constants.ts
  Move: components/purchase-orders/helpers.ts → features/purchase-orders/helpers.ts

TASK 8.4 — Move forms
  Move: components/forms/CreatePoForm.tsx → features/purchase-orders/forms/
  Move: components/forms/EditPoForm.tsx → features/purchase-orders/forms/
  Move: components/forms/DespatchPoForm.tsx → features/purchase-orders/forms/

TASK 8.5 — Move modals
  Move: components/modals/PoDetailModal.tsx → features/purchase-orders/modals/

TASK 8.6 — Move service
  Move: services/purchaseOrder.service.ts → features/purchase-orders/services/

TASK 8.7 — Extract types + create barrel + update router

✅ VERIFY: PO list loads. Create PO works. Edit/despatch works. Commit.
Phase 9: Shared Infrastructure
Branch: refactor/shared-infrastructure

text

TASK 9.1 — Create utils folder
  Create: src/utils/formatting.ts (extract from existing helpers if any)
  Create: src/utils/dates.ts
  Create: src/utils/validation.ts
  Create: src/utils/cn.ts (classname merge utility)
  Create: src/utils/index.ts

TASK 9.2 — Create config folder
  Move: src/supabase.config.ts → src/config/supabase.ts
  Create: src/config/routes.ts (route path constants)
  Create: src/config/env.ts (typed env variables)

TASK 9.3 — Split remaining shared types
  Create: src/types/api.types.ts (ApiResponse, PaginatedResponse, etc.)
  Create: src/types/common.types.ts (shared enums, SelectOption, etc.)
  
TASK 9.4 — Move test pages
  Move: components/pages/testing/* → dev/

TASK 9.5 — Clean up empty folders
  Delete: components/pages/ (should be empty now)
  Delete: components/forms/ (should be empty now)
  Delete: components/modals/ (should be empty now)
  Delete: components/tabs/ (should be empty now)
  Delete: components/dashboard/ (should be empty now)
  Delete: components/purchase-orders/ (should be empty now)
  Delete: components/products/ (should be empty now)
  Delete: components/soh/ (should be empty now)
  Delete: components/forecasts/ (should be empty now)

TASK 9.6 — Delete mrp.types.ts
  Only after ALL features have their own types
  And NO file imports from mrp.types.ts directly

✅ VERIFY: Full app smoke test. Every page. Every action. Commit.
6. Complete File Movement Map
text

┌─────────────────────────────────────────────────────────────────────────┐
│ CURRENT LOCATION                        → NEW LOCATION                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ APP SHELL                                                               │
│ src/App.tsx                             → src/app/App.tsx               │
│ src/components/Sidebar.tsx              → src/components/layout/Sidebar │
│ src/components/ErrorBoundary.tsx        → src/components/layout/ErrorB  │
│ NEW                                     → src/app/router.tsx            │
│ NEW                                     → src/app/providers.tsx         │
│ NEW                                     → src/components/layout/Main..  │
│                                                                         │
│ DASHBOARD                                                               │
│ components/pages/DashboardPage          → features/dashboard/           │
│ components/dashboard/charts/*           → features/dashboard/comp/ch..  │
│ components/dashboard/DashboardSkeleton  → features/dashboard/comp/      │
│ components/dashboard/KPICard            → features/dashboard/comp/      │
│ components/dashboard/LowStockAlerts     → features/dashboard/comp/      │
│ components/dashboard/RecentActivityCard → features/dashboard/comp/      │
│ components/dashboard/TimeRangeFilter    → features/dashboard/comp/      │
│ components/dashboard/TopItemsCard       → features/dashboard/comp/      │
│ services/dashboard.service.ts           → features/dashboard/services/  │
│ services/dashboard.api.ts              → features/dashboard/services/   │
│                                                                         │
│ PRODUCTS                                                                │
│ components/pages/ProductsPage           → features/products/            │
│ components/pages/ProductDashboardPage   → features/products/            │
│ components/products/ProductsSkeleton    → features/products/comp/       │
│ components/tabs/ProductInfoTab          → features/products/comp/       │
│ components/tabs/BomManagementTab        → features/products/comp/       │
│ components/forms/CreateProductForm      → features/products/forms/      │
│ components/forms/EditProductForm        → features/products/forms/      │
│ components/modals/AddBomComponentModal  → features/products/modals/     │
│ components/modals/BomDetailModal        → features/products/modals/     │
│ components/modals/EditBomComponentModal → features/products/modals/     │
│ services/product.service.ts            → features/products/services/    │
│ services/bom.service.ts               → features/products/services/     │
│ services/component.service.ts          → features/products/services/    │
│                                                                         │
│ PURCHASE ORDERS                                                         │
│ components/pages/PurchaseOrdersPage     → features/purchase-orders/     │
│ components/pages/CreatePOPage           → features/purchase-orders/     │
│ components/purchase-orders/ActionsCell  → features/purchase-orders/co.. │
│ components/purchase-orders/StatusCell   → features/purchase-orders/co.. │
│ components/purchase-orders/PO..Skeleton → features/purchase-orders/co.. │
│ components/purchase-orders/constants    → features/purchase-orders/     │
│ components/purchase-orders/helpers      → features/purchase-orders/     │
│ components/forms/CreatePoForm           → features/purchase-orders/fo.. │
│ components/forms/EditPoForm             → features/purchase-orders/fo.. │
│ components/forms/DespatchPoForm         → features/purchase-orders/fo.. │
│ components/modals/PoDetailModal         → features/purchase-orders/mo.. │
│ services/purchaseOrder.service.ts      → features/purchase-orders/se..  │
│                                                                         │
│ FORECASTS                                                               │
│ components/pages/ForecastsPage          → features/forecasts/           │
│ components/forecasts/ForecastSkeleton   → features/forecasts/comp/      │
│ components/forecasts/constants          → features/forecasts/           │
│ components/forecasts/helpers            → features/forecasts/           │
│ services/forecast.service.ts           → features/forecasts/services/   │
│                                                                         │
│ INVENTORY                                                               │
│ components/pages/InventoryPage          → features/inventory/           │
│ services/mrp.service.ts               → features/inventory/services/    │
│                                                                         │
│ SOH                                                                     │
│ components/pages/SohPage                → features/soh/                 │
│ components/soh/SohSkeleton              → features/soh/comp/            │
│ services/soh.service.ts               → features/soh/services/          │
│                                                                         │
│ IMPORT                                                                  │
│ components/pages/ImportPage             → features/import/              │
│ components/modals/ExcelImportModal      → features/import/comp/         │
│ services/import.service.ts             → features/import/services/      │
│ hooks/useImport.ts                     → features/import/hooks/         │
│                                                                         │
│ CONFIG                                                                  │
│ src/supabase.config.ts                 → src/config/supabase.ts         │
│ NEW                                     → src/config/env.ts             │
│ NEW                                     → src/config/routes.ts          │
│                                                                         │
│ STAYS IN PLACE                                                          │
│ components/ui/*                         → NO CHANGE                     │
│ components/shared/*                     → NO CHANGE                     │
│ components/dialogs/*                    → components/shared/ (rename)   │
│ hooks/* (except useImport)              → NO CHANGE                     │
│ services/api.service.ts               → NO CHANGE                       │
│ services/export.service.ts            → NO CHANGE                       │
│ contexts/*                              → NO CHANGE                     │
│ styles/*                                → NO CHANGE                     │
│                                                                         │
│ DELETE (after migration)                                                │
│ types/mrp.types.ts                     → DELETE (after all types split) │
│ components/pages/                      → DELETE (empty folder)          │
│ components/forms/                      → DELETE (empty folder)          │
│ components/modals/                     → DELETE (empty folder)          │
│ components/tabs/                       → DELETE (empty folder)          │
│                                                                         │
│ MOVE TO DEV                                                             │
│ components/pages/testing/*             → dev/                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
7. Types Migration Strategy
The Safe Way to Split Types
Never delete from mrp.types.ts until the migration is complete.

text

STEP 1: Identify which types belong to which feature

  Open mrp.types.ts and categorize every type:
  
  DASHBOARD:  DashboardKPI, TimeRange, ChartData...
  PRODUCTS:   Product, BomComponent, ProductCategory...
  PO:         PurchaseOrder, PoLineItem, PoStatus...
  FORECASTS:  Forecast, ForecastPeriod...
  SOH:        SohRecord, StockLevel...
  INVENTORY:  InventoryItem, MrpResult...
  SHARED:     ApiResponse, PaginatedResult, SelectOption...

STEP 2: For each feature migration, copy (don't cut) types

  // features/soh/types/soh.types.ts
  // Copied from src/types/mrp.types.ts — DO NOT MODIFY
  export interface SohRecord {
    // exact copy
  }

STEP 3: In mrp.types.ts, add re-exports

  // src/types/mrp.types.ts
  // Re-exported for backward compatibility
  export type { SohRecord } from '@/features/soh/types/soh.types';
  
  // Original definition removed from this file

STEP 4: After ALL features migrated, mrp.types.ts should contain
         only re-exports. Then delete it and update remaining imports.
8. Git Workflow
Bash

# Before starting any phase
git checkout main
git pull origin main
git checkout -b refactor/migrate-{feature-name}

# After each file move (within a phase)
git add .
git commit -m "move: {FileName} to features/{feature}/"

# Example commits for Phase 2 (SOH):
git commit -m "move: SohPage.tsx to features/soh/"
git commit -m "move: SohSkeleton.tsx to features/soh/components/"
git commit -m "move: soh.service.ts to features/soh/services/"
git commit -m "feat: extract soh types from mrp.types.ts"
git commit -m "feat: create soh barrel exports and update router"

# After phase is complete and verified
git checkout main
git merge refactor/migrate-{feature-name}

# If something goes horribly wrong during a phase
git checkout main                    # abandon the branch
git branch -D refactor/migrate-soh   # delete it
# start fresh
Rollback Strategies
Bash

# Undo the last file move (within current phase)
git reset --soft HEAD~1

# Undo the last 3 file moves
git reset --soft HEAD~3

# Nuclear option: abandon entire phase
git checkout main
git branch -D refactor/migrate-{feature-name}

# Check what files you've changed in current branch
git diff --name-only main
9. Verification Checklist
Run after EVERY phase:

text

PRE-FLIGHT
[ ] npm run build — compiles without errors
[ ] npm run dev — app starts without console errors
[ ] No TypeScript errors in IDE

PHASE-SPECIFIC (for each migrated feature)
[ ] Page loads correctly
[ ] Data fetches and displays
[ ] All interactive elements work (buttons, forms, modals)
[ ] No broken imports in console
[ ] No 404s in network tab

FULL SMOKE TEST (after all phases)
[ ] Dashboard — KPIs load, charts render
[ ] Products — list loads, create/edit works, BOM modal works
[ ] Purchase Orders — list loads, create/edit/despatch works
[ ] Forecasts — data loads, charts display
[ ] Inventory — page loads, data displays
[ ] SOH — page loads, data displays
[ ] Import — Excel import modal opens and works
[ ] Sidebar navigation — all links work
[ ] Export functionality — CSV/Excel downloads work
[ ] Error states — error boundary catches errors
[ ] Empty states — display correctly when no data
[ ] Skeleton loaders — show during data fetching