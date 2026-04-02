// src/app/App.tsx

import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { ToastProvider, ToastContainer } from "@/components/ui/Toast";
import { Sidebar } from "@/components/layout";
import { routes, getRouteById, type PageId } from "./routes";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// ============== BLOCK 1: AppLayout Component ==============

function AppLayout() {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(null);
  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null);

  const handlePageChange = (newPage: PageId) => {
    setActivePage(newPage);
  };

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

  // ============== BLOCK 2: Update document title ==============

  useEffect(() => {
    let title: string;
    const route = getRouteById(activePage);

    if (activePage === "product-detail" && selectedProductCode) {
      title = `Product: ${selectedProductDescription || selectedProductCode}`;
    } else {
      title = route.title || "MRP System";
    }

    document.title = `${title} | MRP System`;
  }, [activePage, selectedProductCode, selectedProductDescription]);

  // ============== BLOCK 3: Navbar Content Renderer ==============

  const renderNavbarContent = () => {
    const route = getRouteById(activePage);

    // Product detail breadcrumb
    if (activePage === "product-detail" && selectedProductCode) {
      return (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleBackToProducts}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to Products"
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

    // Breadcrumb for routes with parent pages
    if (route.parentPage) {
      const parentRoute = getRouteById(route.parentPage);
      return (
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => handlePageChange(route.parentPage!)}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Back to ${parentRoute.title}`}
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`${theme.text} opacity-60 cursor-pointer hover:opacity-100 transition-opacity text-base`}
              onClick={() => handlePageChange(route.parentPage!)}
            >
              {parentRoute.title}
            </span>
            <span className={`${theme.text} opacity-40`}>›</span>
            <span className={`${theme.text} font-semibold text-base`}>
              {route.title}
            </span>
          </div>
        </div>
      );
    }

    // Default title
    return (
      <h1 className={`text-2xl font-bold ${theme.text}`}>{route.title}</h1>
    );
  };

  // ============== BLOCK 4: Page Content Renderer ==============

  const renderPageContent = () => {
    const route = getRouteById(activePage);
    const Component = route.component;

    // Special props for specific pages
    const pageProps: Record<PageId, any> = {
      products: { onViewProduct: handleViewProduct },
      "product-detail": {
        productCode: selectedProductCode!,
        onBack: handleBackToProducts,
      },
      "purchase-orders": {
        onCreatePo: () => handlePageChange("create-po"),
        onImport: () => handlePageChange("import"),
      },
      "create-po": {
        onBack: () => handlePageChange("purchase-orders"),
        onPoCreated: () => handlePageChange("purchase-orders"),
      },
    };

    return <Component {...(pageProps[activePage] || {})} />;
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
          {renderPageContent()}
        </main>
      </div>

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