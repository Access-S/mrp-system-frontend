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

// BLOCK 4: AppLayout Component (Full-Width)
function AppLayout() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null);

  const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    products: "Products (BOM)",
    "product-detail": "",  // Empty - we'll use breadcrumb instead
    "purchase-orders": "Purchase Orders",
    inventory: "Inventory Planning Dashboard",
    forecasts: "Sales Forecasts",
    soh: "Stock On Hand",
    analytics: "Analytics",
    reporting: "Reporting"
  };

  // Handler to view product
  const handleViewProduct = (productCode: string, description?: string) => {
    setSelectedProductCode(productCode);
    setSelectedProductDescription(description || null);
    setActivePage("product-detail");
  };

  // Handler to go back
  const handleBackToProducts = () => {
    setSelectedProductCode(null);
    setSelectedProductDescription(null);
    setActivePage("products");
  };

  // Render breadcrumb for product detail page
  const renderNavbarContent = () => {
    if (activePage === "product-detail" && selectedProductCode) {
      return (
        <div className="flex items-center gap-2">
          <span 
            className={`${theme.text} opacity-60 cursor-pointer hover:opacity-100 transition-opacity`}
            onClick={handleBackToProducts}
          >
            Products (BOM)
          </span>
          <span className={`${theme.text} opacity-40`}>&gt;</span>
          <span className={`${theme.text} font-bold`}>
            {selectedProductCode}
            {selectedProductDescription && ` - ${selectedProductDescription}`}
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
    <div
      className={`min-h-screen ${theme.background} transition-all duration-500`}
    >
      <div
       className={`${theme.navbar} shadow-sm border-b p-4 transition-all duration-500 flex items-center gap-4 sticky top-0 z-20`}
      >
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        {renderNavbarContent()}
      </div>
      
      <main className="p-4 md:p-8">
        {activePage === "dashboard" && <DashboardPage />}
        {activePage === "products" && <ProductsPage onViewProduct={handleViewProduct} />}
        {activePage === "product-detail" && selectedProductCode && (
          <ProductDashboardPage  // Changed from ProductDetailPage
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