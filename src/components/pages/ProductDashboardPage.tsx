// src/components/pages/ProductDashboardPage.tsx

import React, { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { productService } from "../../services/product.service";
import { bomService } from "../../services/bom.service";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";
import { WidgetCard, WidgetHeader, WidgetBody, MiniActionButton } from "../ui/WidgetCard";

interface ProductDashboardPageProps {
  productCode: string;
  onBack: () => void;
}

export function ProductDashboardPage({ productCode, onBack }: ProductDashboardPageProps) {
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Calculate BOM metrics
  const totalComponents = components.length;
  const rawMaterialsCount = components.filter(c => c.partType === "RAW_MATERIAL").length;
  const subAssembliesCount = components.filter(c => c.partType === "COMPONENT").length;
  const packagingCount = components.filter(c => c.partType === "PACKAGING").length;

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

  return (
    <>
      <div className="space-y-6">
        {/* Top Row: 4 Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Widget 1: Specifications */}
          <WidgetCard>
            <WidgetHeader
              title="Specifications"
              icon={<InformationCircleIcon className="h-4 w-4" />}
              actions={
                <>
                  <MiniActionButton icon={<PencilIcon className="h-4 w-4" />} title="Edit Specs" />
                  <MiniActionButton icon={<DocumentDuplicateIcon className="h-4 w-4" />} title="Copy Info" />
                </>
              }
            />
            <WidgetBody className="space-y-4">
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Product Code</label>
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{product.productCode}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Description</label>
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{product.description || "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Units Per Shipper</label>
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{product.unitsPerShipper || "—"}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Price Per Shipper</label>
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">${Number(product.pricePerShipper || 0).toFixed(2)}</span>
              </div>
            </WidgetBody>
          </WidgetCard>

          {/* Widget 2: BOM Summary */}
          <WidgetCard>
            <WidgetHeader
              title="BOM Summary"
              icon={<Squares2X2Icon className="h-4 w-4" />}
              actions={
                <>
                  <MiniActionButton onClick={() => setIsAddBomOpen(true)} icon={<PlusIcon className="h-4 w-4" />} title="Add Component" />
                </>
              }
            />
            <WidgetBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-base">
                  <span className="text-slate-500 dark:text-slate-400">Total Items</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{totalComponents} Parts</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-slate-500 dark:text-slate-400">BOM Status</span>
                  <span className="font-bold text-green-600 dark:text-green-400">Complete</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                  <div className="bg-blue-600 h-full" style={{ width: `${totalComponents > 0 ? 100 : 0}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  BOM completion: {totalComponents > 0 ? "100%" : "0%"}
                </p>
                <div className="pt-4 space-y-2">
                  {rawMaterialsCount > 0 && (
                    <div className="flex items-center gap-2 text-base text-slate-600 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>{rawMaterialsCount} Raw Materials</span>
                    </div>
                  )}
                  {subAssembliesCount > 0 && (
                    <div className="flex items-center gap-2 text-base text-slate-600 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span>{subAssembliesCount} Components</span>
                    </div>
                  )}
                  {packagingCount > 0 && (
                    <div className="flex items-center gap-2 text-base text-slate-600 dark:text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
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
            />
            <WidgetBody>
              <div className="flex flex-col gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Hourly Run Rate</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {product.hourlyRunRate || "—"} <span className="text-base font-normal text-slate-500 dark:text-slate-400">pcs/hr</span>
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Daily Capacity</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {product.dailyRunRate || "—"} <span className="text-base font-normal text-slate-500 dark:text-slate-400">pcs/day</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-base text-slate-500 dark:text-slate-400">
                  <ClockIcon className="h-5 w-5 text-green-500" />
                  {product.minsPerShipper || "—"} mins per shipper
                </div>
              </div>
            </WidgetBody>
          </WidgetCard>

          {/* Widget 4: Quick Actions */}
          <WidgetCard>
            <WidgetHeader title="Quick Actions" />
            <WidgetBody>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                  <DocumentDuplicateIcon className="h-5 w-5 text-slate-400" />
                  <span>Clone Product</span>
                </button>
                <button 
                  onClick={() => setIsAddBomOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add BOM Component</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-slate-400" />
                  <span>Generate Requirements</span>
                </button>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setIsDeleteProductOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-semibold rounded-lg text-red-600 dark:text-red-400 border border-red-50 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            </WidgetBody>
          </WidgetCard>
        </div>               
        {/* Bottom Row: Component Details Table */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <WidgetCard>
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Component Details</h2>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase">
                    {totalComponents} Core Items
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                {components.length === 0 ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-slate-500 dark:text-slate-400 text-base">No components added yet</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-base">
                    <thead className={`${theme.tableHeaderBg} text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                      <tr>
                        <th className="px-6 py-3">Part Code</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3 text-right">Quantity</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {components.map((comp) => (
                        <tr key={comp.partCode} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors">
                          <td className="px-6 py-3 font-bold text-blue-600 dark:text-blue-400">{comp.partCode}</td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{comp.partDescription || "—"}</td>
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
                          <td className="px-6 py-3 text-right font-semibold">{comp.perShipper}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedComponent(comp);
                                  setIsEditBomOpen(true);
                                }}
                                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedComponent(comp);
                                  setIsDeleteBomOpen(true);
                                }}
                                className="text-slate-400 hover:text-red-500"
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
        </div>
      </div>

      {/* Modals */}
      <AddBomComponentModal 
        open={isAddBomOpen} 
        onClose={() => setIsAddBomOpen(false)} 
        productCode={productCode} 
        onSuccess={loadProductData} 
      />
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