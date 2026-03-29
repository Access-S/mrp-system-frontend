// src/app/App.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { ToastProvider, ToastContainer } from "@/components/ui/Toast";
import { Sidebar } from "@/components/layout";
import { DashboardPage } from "@/features/dashboard";
import { ProductsPage, ProductDashboardPage } from "@/features/products";
import { PurchaseOrdersPage, CreatePoPage } from "@/features/purchase-orders";
import { ForecastsPage } from "@/features/forecasts";
import { SohPage } from "@/features/soh";
import { InventoryPage } from "@/features/inventory";
import { ImportPage } from "@/features/import";
import { UITestPage, UITestPage2 } from "@/components/pages/testing";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMemo } from 'react';

// ============== BLOCK 2: Types ==============

export type Page =
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

// ============== BLOCK 3: AppLayout Component ==============

function AppLayout() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null);

  const handlePageChange = (newPage: Page) => {
    setActivePage(newPage);
  };

  const pageTitles = useMemo<Record<Page, string>>(() => ({
    dashboard: "Dashboard",
    products: "Products (BOM)",
    "product-detail": "",
    "purchase-orders": "Purchase Orders",
    "create-po": "",
    import: "Import Data",
    inventory: "Inventory Planning Dashboard",
    forecasts: "Sales Forecasts",
    soh: "Stock On Hand",
    analytics: "Analytics",
    reporting: "Reporting",
    "ui-test": "UI Components Test",
    "ui-test-2": "UI Components Test - Page 2",
  }), []);

  const handleViewProduct = (productCode: string, description?: string) => {
    setSelectedProductCode(productCode);
    setSelectedProductDescription(description || null);
    handlePageChange("product-detail");
  };

  const handleBackToProducts = () => {
    setSelectedProductCode(null);
    setSelectedProductDescription(null);
    handlePageChange("products");
  };

  // ============== BLOCK 3.5: Update document title ==============

  useEffect(() => {
    let title: string;

    if (activePage === "product-detail" && selectedProductCode) {
      title = `Product: ${selectedProductDescription || selectedProductCode}`;
    } else if (activePage === "create-po") {
      title = "Create New Purchase Order";
    } else {
      title = pageTitles[activePage] || "MRP System";
    }

    document.title = `${title} | MRP System`;
  }, [activePage, selectedProductCode, selectedProductDescription, pageTitles]);

  // ============== BLOCK 4: Navbar Content Renderer ==============

  const renderNavbarContent = () => {
    if (activePage === "product-detail" && selectedProductCode) {
      return (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleBackToProducts}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`${theme.text} opacity-60 cursor-pointer hover:opacity-100 transition-opacity text-base`}
              onClick={handleBackToProducts}
            >
              Products
            </span>
            <span className={`${theme.text} opacity-40`}>›</span>
            <span className={`${theme.text} font-semibold text-base`}>
              {selectedProductDescription || selectedProductCode}
            </span>
          </div>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
            Active
          </span>
        </div>
      );
    }

    if (activePage === "create-po") {
      return (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => handlePageChange("purchase-orders")}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`${theme.text} opacity-60 cursor-pointer hover:opacity-100 transition-opacity text-base`}
              onClick={() => handlePageChange("purchase-orders")}
            >
              Purchase Orders
            </span>
            <span className={`${theme.text} opacity-40`}>›</span>
            <span className={`${theme.text} font-semibold text-base`}>
              Create New Purchase Order
            </span>
          </div>
        </div>
      );
    }

    return (
      <h1 className={`text-2xl font-bold ${theme.text}`}>{pageTitles[activePage]}</h1>
    );
  };

  // ============== BLOCK 5: Render ==============

  return (
    <div className={`flex h-screen ${theme.background} transition-all duration-500`}>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <Sidebar activePage={activePage} setActivePage={handlePageChange} />

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className={`${theme.navbar} shadow-sm border-b p-4 transition-all duration-500 flex items-center gap-4 flex-shrink-0 z-20`}
        >
          {renderNavbarContent()}
        </div>

        <main id="main-content" className="flex-1 p-4 md:p-8 overflow-auto" tabIndex={-1}>
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "products" && <ProductsPage onViewProduct={handleViewProduct} />}
          {activePage === "product-detail" && selectedProductCode && (
            <ProductDashboardPage productCode={selectedProductCode} onBack={handleBackToProducts} />
          )}
          {activePage === "purchase-orders" && (
            <PurchaseOrdersPage
              onCreatePo={() => handlePageChange("create-po")}
              onImport={() => handlePageChange("import")}
            />
          )}
          {activePage === "create-po" && (
            <CreatePoPage
              onBack={() => setActivePage("purchase-orders")}
              onPoCreated={() => setActivePage("purchase-orders")}
            />
          )}
          {activePage === "import" && <ImportPage />}
          {activePage === "forecasts" && <ForecastsPage />}
          {activePage === "soh" && <SohPage />}
          {activePage === "inventory" && <InventoryPage />}
          {activePage === "ui-test" && <UITestPage />}
          {activePage === "ui-test-2" && <UITestPage2 />}
        </main>
      </div>

      {/* Custom Toast Container */}
      <ToastContainer />
    </div>
  );
}

// ============== BLOCK 6: App Root ==============

function App() {
  return (
    <ThemeProvider>
      <ToastProvider defaultPosition="top-right">
        <AppLayout />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;