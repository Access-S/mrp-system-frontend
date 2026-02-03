// src/components/tabs/ProductInfoTab.tsx

import React, { useState, useEffect } from "react";
import { PencilIcon, CheckIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { productService } from "../../services/product.service";

interface ProductInfoTabProps {
  product: any;
  onUpdate: () => void;
  onBack?: () => void; // optional if you have navigation
}

export function ProductInfoTab({ product, onUpdate, onBack }: ProductInfoTabProps) {
  const { theme } = useTheme();
  const isDark = theme.isDark;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    unitsPerShipper: 0,
    dailyRunRate: 0,
    hourlyRunRate: 0,
    minsPerShipper: 0,
    pricePerShipper: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        description: product.description || "",
        unitsPerShipper: product.unitsPerShipper || 0,
        dailyRunRate: product.dailyRunRate || 0,
        hourlyRunRate: product.hourlyRunRate || 0,
        minsPerShipper: product.minsPerShipper || 0,
        pricePerShipper: product.pricePerShipper || 0,
      });
    }
  }, [product]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setSaving(true);
    try {
      await productService.updateProduct(product.productCode, formData);
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: product.description || "",
      unitsPerShipper: product.unitsPerShipper || 0,
      dailyRunRate: product.dailyRunRate || 0,
      hourlyRunRate: product.hourlyRunRate || 0,
      minsPerShipper: product.minsPerShipper || 0,
      pricePerShipper: product.pricePerShipper || 0,
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Header - Exactly like your dream sample */}
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <h2 className="text-lg font-bold tracking-tight">Product Details</h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </header>

      <main className="pb-24">
        {/* Profile Header */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-5 items-start">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-28 flex-shrink-0" />
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

        {/* Product Specifications Grid */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 px-6 pb-3">
            Product Specifications
          </h3>
          <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2">
              {/* Product Code */}
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Product Code</p>
                <p className="text-sm font-semibold">{product.productCode}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Description</p>
                <p className="text-sm font-semibold">{product.description || "—"}</p>
              </div>

              {/* Units Per Shipper */}
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Units Per Shipper</p>
                <p className="text-sm font-semibold">{formData.unitsPerShipper || "—"}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Price Per Shipper</p>
                <p className="text-sm font-semibold">${formData.pricePerShipper.toFixed(2)}</p>
              </div>

              {/* Daily Run Rate */}
              <div className="flex flex-col gap-1 border-b border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Daily Run Rate</p>
                <p className="text-sm font-semibold">{formData.dailyRunRate || "—"}</p>
              </div>
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Hourly Run Rate</p>
                <p className="text-sm font-semibold">{formData.hourlyRunRate || "—"}</p>
              </div>

              {/* Mins Per Shipper */}
              <div className="flex flex-col gap-1 border-r border-slate-100 dark:border-slate-800 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Minutes Per Shipper</p>
                <p className="text-sm font-semibold">{formData.minsPerShipper || "—"}</p>
              </div>
              <div className="flex flex-col gap-1 p-5">
                <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-semibold">{product.createdAt ? formatDate(product.createdAt) : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Future BOM Section (ready when you are) */}
        {/* <div className="mt-8 px-6">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">BOM Components</h3>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">0 Items</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <p className="text-center text-slate-500 py-12">No components added yet</p>
          </div>
        </div> */}
      </main>
    </>
  );
}