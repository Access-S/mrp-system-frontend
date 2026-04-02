// src/app/routes.tsx

import { DashboardPage } from "@/features/dashboard";
import { ProductsPage, ProductDashboardPage } from "@/features/products";
import { PurchaseOrdersPage, CreatePoPage } from "@/features/purchase-orders";
import { ForecastsPage } from "@/features/forecasts";
import { SohPage } from "@/features/soh";
import { InventoryPage } from "@/features/inventory";
import { ImportPage } from "@/features/import";
import { UITestPage, UITestPage2 } from "@/__dev__";

export type PageId =
  | "dashboard"
  | "products"
  | "product-detail"
  | "purchase-orders"
  | "create-po"
  | "import"
  | "inventory"
  | "forecasts"
  | "soh"
  | "analytics"
  | "reporting"
  | "ui-test"
  | "ui-test-2";

export interface RouteConfig {
  id: PageId;
  title: string;
  component: React.ComponentType<any>;
  showInSidebar?: boolean;
  parentPage?: PageId;
}

export const routes: Record<PageId, RouteConfig> = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    component: DashboardPage,
    showInSidebar: true,
  },
  products: {
    id: "products",
    title: "Products (BOM)",
    component: ProductsPage,
    showInSidebar: true,
  },
  "product-detail": {
    id: "product-detail",
    title: "", // Dynamic, set at runtime
    component: ProductDashboardPage,
    showInSidebar: false,
    parentPage: "products",
  },
  "purchase-orders": {
    id: "purchase-orders",
    title: "Purchase Orders",
    component: PurchaseOrdersPage,
    showInSidebar: true,
  },
  "create-po": {
    id: "create-po",
    title: "Create New Purchase Order",
    component: CreatePoPage,
    showInSidebar: false,
    parentPage: "purchase-orders",
  },
  import: {
    id: "import",
    title: "Import Data",
    component: ImportPage,
    showInSidebar: true,
  },
  inventory: {
    id: "inventory",
    title: "Inventory Planning Dashboard",
    component: InventoryPage,
    showInSidebar: true,
  },
  forecasts: {
    id: "forecasts",
    title: "Sales Forecasts",
    component: ForecastsPage,
    showInSidebar: true,
  },
  soh: {
    id: "soh",
    title: "Stock On Hand",
    component: SohPage,
    showInSidebar: true,
  },
  analytics: {
    id: "analytics",
    title: "Analytics",
    component: () => <div>Analytics Page (Coming Soon)</div>,
    showInSidebar: false,
  },
  reporting: {
    id: "reporting",
    title: "Reporting",
    component: () => <div>Reporting Page (Coming Soon)</div>,
    showInSidebar: false,
  },
  "ui-test": {
    id: "ui-test",
    title: "UI Components Test",
    component: UITestPage,
    showInSidebar: false,
  },
  "ui-test-2": {
    id: "ui-test-2",
    title: "UI Components Test - Page 2",
    component: UITestPage2,
    showInSidebar: false,
  },
};

export const getSidebarRoutes = () =>
  Object.values(routes).filter((route) => route.showInSidebar);

export const getRouteById = (id: PageId) => routes[id];