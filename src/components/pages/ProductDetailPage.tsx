// src/components/pages/ProductDetailPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { productService } from "../../services/product.service";
import { bomService } from "../../services/bom.service";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";

// BLOCK 2: Interface
interface ProductDetailPageProps {
  productCode: string;
  onBack: () => void;
}

// BLOCK 3: Main Component
export function ProductDetailPage({ productCode, onBack }: ProductDetailPageProps) {
  const { theme } = useTheme();
  const [product, setProduct] = useState<any | null>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddBomOpen, setIsAddBomOpen] = useState(false);
  const [isEditBomOpen, setIsEditBomOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isDeleteBomOpen, setIsDeleteBomOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // BLOCK 4: Data Fetching
  useEffect(() => {
    loadProductData();
  }, [productCode]);

  const loadProductData = async () => {
    setLoading(true);
    try {
      const [productsRes, bomRes] = await Promise.all([
        productService.getAllProducts(),
        productService.getBomForProduct(productCode),
      ]);
      const foundProduct = productsRes.find((p: any) => p.productCode === productCode);
      setProduct(foundProduct || null);
      setComponents(Array.isArray(bomRes?.data) ? bomRes.data : bomRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // BLOCK 5: Delete Handlers
  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productCode);
      onBack();
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
      setIsDeleteProductOpen(false);
    }
  };

  const handleDeleteComponent = async () => {
    if (!selectedComponent?.partCode) return;
    setDeleteLoading(true);
    try {
      await bomService.deleteComponent(productCode, selectedComponent.partCode);
      loadProductData();
      setSelectedComponent(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete component");
    } finally {
      setDeleteLoading(false);
      setIsDeleteBomOpen(false);
    }
  };

  // BLOCK 6: Helpers
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // BLOCK 7: Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  // BLOCK 8: Not Found State
  if (!product) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">Product not found: {productCode}</p>
        <button onClick={onBack} className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Back to Products
        </button>
      </div>
    );
  }

  // BLOCK 9: Main Render
  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h2 className="text-lg font-bold tracking-tight">Product Details</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddBomOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Component
          </button>
          <button
            onClick={() => setIsDeleteProductOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Product
          </button>
        </div>
      </header>

      <main className="pb-24">
        {/* BLOCK 10: Hero Section */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-6 items-start">
            <div className="bg-gray-200 border-2 border-dashed border-slate-300 rounded-xl w-28 h-28 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{product.description || "Untitled Product"}</h1>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                  Active
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">SKU: {product.productCode}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Updated: {product.updatedAt ? formatDate(product.updatedAt) : "Never"}
              </p>
            </div>
          </div>
        </div>

        {/* BLOCK 11: Specifications Grid */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 px-6 pb-3">
            Product Specifications
          </h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Product Code</p>
                <p className="text-sm font-semibold">{product.productCode}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Description</p>
                <p className="text-sm font-semibold">{product.description || "—"}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Units Per Shipper</p>
                <p className="text-sm font-semibold">{product.unitsPerShipper || "—"}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Price Per Shipper</p>
                <p className="text-sm font-semibold">${Number(product.pricePerShipper || 0).toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Daily Run Rate</p>
                <p className="text-sm font-semibold">{product.dailyRunRate || "—"} units/day</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Hourly Run Rate</p>
                <p className="text-sm font-semibold">{product.hourlyRunRate || "—"} units/hr</p>
              </div>
              <div className="flex flex-col gap-1 border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Minutes Per Shipper</p>
                <p className="text-sm font-semibold">{product.minsPerShipper || "—"} mins</p>
              </div>
              <div className="flex flex-col gap-1 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-semibold">{product.createdAt ? formatDate(product.createdAt) : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 12: BOM Table - NOW PERFECTLY MATCHES THE SAMPLE */}
        <div className="mt-8 px-6">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              BOM Components
            </h3>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              {components.length} Items
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {components.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No components added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Part Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Qty</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {components.map((comp) => (
                      <tr key={comp.partCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{comp.partCode}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{comp.partDescription || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                            comp.partType === "RAW_MATERIAL"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                              : comp.partType === "COMPONENT"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                              : comp.partType === "PACKAGING"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}>
                            {comp.partType?.replace("_", " ") || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-right">{comp.perShipper}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedComponent(comp);
                              setIsEditBomOpen(true);
                            }}
                            className="text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedComponent(comp);
                              setIsDeleteBomOpen(true);
                            }}
                            className="text-slate-600 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* BLOCK 13: Modals */}
      <AddBomComponentModal open={isAddBomOpen} onClose={() => setIsAddBomOpen(false)} productCode={productCode} onSuccess={loadProductData} />
      <EditBomComponentModal
        open={isEditBomOpen}
        onClose={() => {
          setIsEditBomOpen(false);
          setSelectedComponent(null);
        }}
        productCode={productCode}
        component={selectedComponent}
        onSuccess={loadProductData}
      />
      <ConfirmationDialog
        open={isDeleteProductOpen}
        title="Delete Product"
        message={`Permanently delete "${productCode}" and all BOM components?`}
        onConfirm={handleDeleteProduct}
        onCancel={() => setIsDeleteProductOpen(false)}
        confirmText="Delete Forever"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleteLoading}
      />
      <ConfirmationDialog
        open={isDeleteBomOpen}
        title="Delete Component"
        message={`Remove ${selectedComponent?.partCode} from BOM?`}
        onConfirm={handleDeleteComponent}
        onCancel={() => {
          setIsDeleteBomOpen(false);
          setSelectedComponent(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleteLoading}
      />
    </>
  );
}