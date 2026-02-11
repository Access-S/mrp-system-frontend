//src/App.tsx

// BLOCK 1: Imports
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { ProductDashboardPage } from "./components/pages/ProductDashboardPage";
import { PurchaseOrdersPage } from "./components/pages/PurchaseOrdersPage";
import { ForecastsPage } from "./components/pages/ForecastsPage";
import SohPage from "./components/pages/SohPage";
import { InventoryPage } from "./components/pages/InventoryPage";
import { Toaster } from "react-hot-toast";
import { createPortal } from "react-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// BLOCK 2: Type Definitions
export type Page =
  | "dashboard"
  | "products"
  | "product-detail"  // ✅ Add this new page type
  | "purchase-orders"
  | "inventory"
  | "forecasts"
  | "soh"
  | "analytics"
  | "reporting";

// BLOCK 3: A new, dedicated component for our Toaster
function ToasterPortal() {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setMountNode(document.body);
  }, []);
  
  const toaster = (
    <Toaster
      position="top-right"
      containerStyle={{
        zIndex: 9999,
      }}
      toastOptions={{
        success: { style: { background: "#28a745", color: "white" } },
        error: { style: { background: "#dc3545", color: "white" } },
      }}
    />
  );

  return mountNode ? createPortal(toaster, mountNode) : toaster;
}

// BLOCK 4: AppLayout Component - FIXED FOR PERMANENT SIDEBAR
function AppLayout() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null);

  const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    products: "Products (BOM)",
    "product-detail": "",
    "purchase-orders": "Purchase Orders",
    inventory: "Inventory Planning Dashboard",
    forecasts: "Sales Forecasts",
    soh: "Stock On Hand",
    analytics: "Analytics",
    reporting: "Reporting"
  };

  const handleViewProduct = (productCode: string, description?: string) => {
    setSelectedProductCode(productCode);
    setSelectedProductDescription(description || null);
    setActivePage("product-detail");
  };

  const handleBackToProducts = () => {
    setSelectedProductCode(null);
    setSelectedProductDescription(null);
    setActivePage("products");
  };

  const renderNavbarContent = () => {
  if (activePage === "product-detail" && selectedProductCode) {
    return (
      <div className="flex items-center gap-4 w-full">
        {/* Back Button */}
        <button
          onClick={handleBackToProducts}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        
        {/* Breadcrumb */}
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
        
        {/* Active Badge */}
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
          Active
        </span>
      </div>
    );
  }
  
  return (
    <h1 className={`text-2xl font-bold ${theme.text}`}>
      {pageTitles[activePage]}
    </h1>
  );
};

  return (
    <div className={`flex min-h-screen ${theme.background} transition-all duration-500`}>
      {/* Sidebar - Only rendered once */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Navbar */}
        <div className={`${theme.navbar} shadow-sm border-b p-4 transition-all duration-500 flex items-center gap-4 sticky top-0 z-20`}>
          {renderNavbarContent()}
        </div>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {activePage === "dashboard" && <DashboardPage />}
          {activePage === "products" && <ProductsPage onViewProduct={handleViewProduct} />}
          {activePage === "product-detail" && selectedProductCode && (
            <ProductDashboardPage
              productCode={selectedProductCode} 
              onBack={handleBackToProducts}
            />
          )}
          {activePage === "purchase-orders" && <PurchaseOrdersPage />}
          {activePage === "forecasts" && <ForecastsPage />}
          {activePage === "soh" && <SohPage />}
          {activePage === "inventory" && <InventoryPage />}
        </main>
      </div>
    </div>
  );
}

// BLOCK 5: App Component
function App() {
  return (
    <ThemeProvider>
      <AppLayout />
      <ToasterPortal />
    </ThemeProvider>
  );
}

// BLOCK 6: Default Export
export default App;