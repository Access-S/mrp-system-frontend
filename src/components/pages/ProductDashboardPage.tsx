// src/components/pages/ProductDashboardPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  Squares2X2Icon,
  BoltIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PlayCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { productService } from "../../services/product.service";
import { bomService } from "../../services/bom.service";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";
import { WidgetCard, WidgetHeader, WidgetBody, MiniActionButton } from "../ui/WidgetCard";

// === Types ===
interface Product {
  productCode: string;
  description?: string;
  unitsPerShipper?: number;
  pricePerShipper?: number;
  hourlyRunRate?: number;
  dailyRunRate?: number;
  minsPerShipper?: number;
}

interface BomComponent {
  partCode: string;
  partDescription?: string;
  partType: "RAW_MATERIAL" | "COMPONENT" | "PACKAGING" | string;
  perShipper: number;
  cost?: number;
}

interface ProductDashboardPageProps {
  productCode: string;
  onBack: () => void;
}

type ModalType = "addBom" | "editBom" | "deleteProduct" | "deleteBom" | null;

// === Component ===
export function ProductDashboardPage({ productCode, onBack }: ProductDashboardPageProps) {
  const { theme } = useTheme();
  
  // Data states
  const [product, setProduct] = useState<Product | null>(null);
  const [components, setComponents] = useState<BomComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedComponent, setSelectedComponent] = useState<BomComponent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load product data with cleanup protection
  const loadProductData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsRes, bomRes] = await Promise.all([
        productService.getAllProducts(),
        productService.getBomForProduct(productCode),
      ]);
      
      const foundProduct = productsRes.find((p: Product) => p.productCode === productCode);
      
      if (!foundProduct) {
        setError(`Product not found: ${productCode}`);
        setProduct(null);
      } else {
        setProduct(foundProduct);
      }
      
      setComponents(Array.isArray(bomRes?.data) ? bomRes.data : bomRes || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load product data";
      console.error("Failed to load product data:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [productCode]);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) {
        await loadProductData();
      }
    };
    
    init();
    
    return () => {
      isMounted = false;
    };
  }, [loadProductData]);

  // Modal handlers
  const openModal = (modal: ModalType, component: BomComponent | null = null) => {
    setSelectedComponent(component);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedComponent(null);
  };

  // Delete handlers
  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productCode);
      onBack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      alert(errorMessage);
    } finally {
      setDeleteLoading(false);
      closeModal();
    }
  };

  const handleDeleteComponent = async () => {
    if (!selectedComponent?.partCode) return;
    
    setDeleteLoading(true);
    try {
      await bomService.deleteComponent(productCode, selectedComponent.partCode);
      await loadProductData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete component";
      alert(errorMessage);
    } finally {
      setDeleteLoading(false);
      closeModal();
    }
  };

  // Helpers
  const formatCurrency = (value: number | undefined) => 
    `$${Number(value || 0).toFixed(2)}`;

  // BOM metrics
  const totalComponents = components.length;
  const rawMaterialsCount = components.filter(c => c.partType === "RAW_MATERIAL").length;
  const subAssembliesCount = components.filter(c => c.partType === "COMPONENT").length;
  const packagingCount = components.filter(c => c.partType === "PACKAGING").length;
  const totalCost = components.reduce((sum, c) => sum + (c.cost || 0) * c.perShipper, 0);

  const getBomStatus = () => {
    if (totalComponents === 0) return { text: "Empty", color: "text-slate-500 dark:text-slate-400", width: 0 };
    // Add your actual validation logic here
    return { text: "Complete", color: "text-green-600 dark:text-green-400", width: 100 };
  };

  const bomStatus = getBomStatus();

  // === Render States ===
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl font-medium text-slate-600 dark:text-slate-400">
          {error || `Product not found: ${productCode}`}
        </p>
        <button 
          onClick={onBack} 
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // === Main Render ===
  return (
    <div className="space-y-6">
      {/* Top Row: 4 Widget Grid - Matching Inspiration Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Widget 1: Specifications */}
        <WidgetCard>
          <WidgetHeader
            title="Specifications"
            icon={<InformationCircleIcon className="h-4 w-4" />}
            actions={
              <>
                <MiniActionButton 
                  onClick={() => {}} // Add edit handler
                  icon={<PencilIcon className="h-4 w-4" />} 
                  title="Edit Specs"
                  aria-label="Edit specifications"
                />
                <MiniActionButton 
                  onClick={() => {}} // Add copy handler
                  icon={<DocumentDuplicateIcon className="h-4 w-4" />} 
                  title="Copy Info"
                  aria-label="Copy product information"
                />
              </>
            }
          />
          <WidgetBody className="space-y-4">
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Product Code
              </label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {product.productCode}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Description
              </label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {product.description || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Units Per Shipper
              </label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {product.unitsPerShipper ?? "—"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-800 pt-3">
              <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                Price Per Shipper
              </label>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(product.pricePerShipper)}
              </span>
            </div>
          </WidgetBody>
        </WidgetCard>

        {/* Widget 2: BOM Summary - Now with Cost like Inspiration */}
        <WidgetCard>
          <WidgetHeader
            title="BOM Summary"
            icon={<Squares2X2Icon className="h-4 w-4" />}
            actions={
              <>
                <MiniActionButton 
                  onClick={() => openModal("addBom")} 
                  icon={<PlusIcon className="h-4 w-4" />} 
                  title="Add Component"
                  aria-label="Add BOM component"
                />
                <MiniActionButton 
                  onClick={() => {}} // Add full BOM view handler
                  icon={<ArrowLeftIcon className="h-4 w-4 rotate-180" />} 
                  title="Full BOM View"
                  aria-label="Open full BOM view"
                />
              </>
            }
          />
          <WidgetBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Items</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {totalComponents} Parts
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">BOM Cost</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500" 
                  style={{ width: `${bomStatus.width}%` }} 
                />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                BOM completion: {bomStatus.width}%
              </p>
              <div className="pt-4 space-y-2">
                {rawMaterialsCount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{rawMaterialsCount} Raw Materials</span>
                  </div>
                )}
                {subAssembliesCount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span>{subAssembliesCount} Sub-assemblies</span>
                  </div>
                )}
                {packagingCount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span>{packagingCount} Packaging</span>
                  </div>
                )}
              </div>
            </div>
          </WidgetBody>
        </WidgetCard>

        {/* Widget 3: Production Rates */}
        <WidgetCard>
          <WidgetHeader
            title="Production Rates"
            icon={<ChartBarIcon className="h-4 w-4" />}
            actions={
              <MiniActionButton 
                onClick={() => loadProductData()} 
                icon={<BoltIcon className="h-4 w-4" />} 
                title="Recalculate"
                aria-label="Recalculate production rates"
              />
            }
          />
          <WidgetBody className="flex flex-col gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Hourly Run Rate
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {product.hourlyRunRate ?? "—"}{" "}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">pcs/hr</span>
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Daily Capacity
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {product.dailyRunRate ?? "—"}{" "}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">pcs/day</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <ClockIcon className="h-5 w-5 text-green-500" />
              {product.minsPerShipper ?? "—"} mins per shipper
            </div>
          </WidgetBody>
        </WidgetCard>

        {/* Widget 4: Recent Activity (Matching Inspiration) */}
        <WidgetCard>
          <WidgetHeader
            title="Recent Activity"
            icon={<ListBulletIcon className="h-4 w-4" />}
            actions={
              <MiniActionButton 
                onClick={() => {}} // Add view logs handler
                icon={<ListBulletIcon className="h-4 w-4" />} 
                title="View Logs"
                aria-label="View activity logs"
              />
            }
          />
          <WidgetBody>
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
              {/* Static example - replace with actual activity data */}
              <div className="relative pl-7">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <PencilIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">BOM Updated</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">by System • 2h ago</p>
              </div>
              <div className="relative pl-7">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <DocumentDuplicateIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Spec Verified</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">by QA • 5h ago</p>
              </div>
              <div className="relative pl-7">
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <ArrowDownTrayIcon className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Requirements Exported</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">by System • 1d ago</p>
              </div>
            </div>
          </WidgetBody>
        </WidgetCard>
      </div>               
      
      {/* Bottom Row: Component Table (8 cols) + Quick Actions Sidebar (4 cols) - Matching Inspiration */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Component Details Table - 8 columns */}
        <div className="col-span-12 lg:col-span-8">
          <WidgetCard>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Component Details
                </h2>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase">
                  {totalComponents} Core Items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MiniActionButton 
                  icon={<FunnelIcon className="h-4 w-4" />} 
                  title="Filter"
                  aria-label="Filter components"
                />
                <MiniActionButton 
                  icon={<ArrowDownTrayIcon className="h-4 w-4" />} 
                  title="Download"
                  aria-label="Download component list"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No components added yet
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className={`${theme.tableHeaderBg ?? "bg-slate-50 dark:bg-slate-800"} text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                    <tr>
                      <th className="px-6 py-3">Part Code</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">Quantity</th>
                      <th className="px-6 py-3 text-right">Cost</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {components.map((comp) => (
                      <tr 
                        key={comp.partCode} 
                        className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors"
                      >
                        <td className="px-6 py-3 font-bold text-blue-600 dark:text-blue-400">
                          {comp.partCode}
                        </td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                          {comp.partDescription || "—"}
                        </td>
                        <td className="px-6 py-3">
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
                        <td className="px-6 py-3 text-right font-semibold">
                          {comp.perShipper}
                        </td>
                        <td className="px-6 py-3 text-right text-slate-600 dark:text-slate-300">
                          {formatCurrency(comp.cost)}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => openModal("editBom", comp)}
                              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              aria-label={`Edit ${comp.partCode}`}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => openModal("deleteBom", comp)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                              aria-label={`Delete ${comp.partCode}`}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </WidgetCard>
        </div>

        {/* Right: Quick Actions Sidebar - 4 columns (Matching Inspiration Layout) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <WidgetCard>
            <WidgetHeader title="Quick Actions" />
            <WidgetBody className="space-y-3">
              <button 
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                <DocumentDuplicateIcon className="h-5 w-5 text-slate-400" />
                <span>Clone Product</span>
              </button>
              <button 
                type="button"
                onClick={() => openModal("addBom")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
              >
                <PlayCircleIcon className="h-5 w-5" />
                <span>Run MRP Simulation</span>
              </button>
              <button 
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 text-slate-400" />
                <span>Generate Requirements</span>
              </button>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => openModal("deleteProduct")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg text-red-600 dark:text-red-400 border border-red-50 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <PowerIcon className="h-5 w-5" />
                  <span>Deactivate Product</span>
                </button>
              </div>
            </WidgetBody>
          </WidgetCard>

          {/* Internal Notes Widget (Optional - from Inspiration) */}
          <WidgetCard>
            <WidgetHeader 
              title="Internal Notes" 
              actions={
                <MiniActionButton 
                  icon={<PlusIcon className="h-4 w-4" />} 
                  title="Add Note"
                  aria-label="Add internal note"
                />
              }
            />
            <WidgetBody>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Ensure component calibration is verified before assembly. Lead times are increasing for raw materials."
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                <DocumentDuplicateIcon className="h-4 w-4" />
                <span>CALIBRATION-SPECS-V2.PDF</span>
              </div>
            </WidgetBody>
          </WidgetCard>
        </div>
      </div>

      {/* Modals */}
      <AddBomComponentModal 
        open={activeModal === "addBom"} 
        onClose={closeModal} 
        productCode={productCode} 
        onSuccess={loadProductData} 
      />
      
      <EditBomComponentModal
        open={activeModal === "editBom"}
        onClose={closeModal}
        productCode={productCode}
        component={selectedComponent}
        onSuccess={loadProductData}
      />
      
      <ConfirmationDialog
        open={activeModal === "deleteProduct"}
        title="Delete Product"
        message={`Permanently delete "${productCode}" and all BOM components?`}
        onConfirm={handleDeleteProduct}
        onCancel={closeModal}
        confirmText="Delete Forever"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleteLoading}
      />
      
      <ConfirmationDialog
        open={activeModal === "deleteBom"}
        title="Delete Component"
        message={`Remove ${selectedComponent?.partCode} from BOM?`}
        onConfirm={handleDeleteComponent}
        onCancel={closeModal}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleteLoading}
      />
    </div>
  );
}