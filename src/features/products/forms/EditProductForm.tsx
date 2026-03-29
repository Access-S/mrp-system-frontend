// src/features/products/forms/EditProductForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { productService, UpdateProductData } from "../services/product.service";

// ============== BLOCK 2: Types ==============

interface EditProductFormProps {
  open: boolean;
  handleOpen: () => void;
  product: any | null;
  onProductUpdated: () => void;
}

// ============== BLOCK 3: Component ==============

export function EditProductForm({
  open,
  handleOpen,
  product,
  onProductUpdated,
}: EditProductFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    unitsPerShipper: 0,
    dailyRunRate: 0,
    hourlyRunRate: 0,
    minsPerShipper: 0,
    pricePerShipper: 0,
  });

  // Populate form when product changes
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!product?.productCode) {
      setError("Product code is missing");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await productService.updateProduct(product.productCode, formData);
      onProductUpdated();
      handleOpen();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      size="lg"
      title={`Edit Product: ${product?.productCode || ""}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Update Product
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        {/* Description */}
        <Input
          label="Description *"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />

        {/* Units Per Shipper */}
        <Input
          type="number"
          label="Units Per Shipper"
          value={formData.unitsPerShipper}
          onChange={(e) => handleChange("unitsPerShipper", Number(e.target.value))}
        />

        {/* Daily Run Rate */}
        <Input
          type="number"
          label="Daily Run Rate"
          value={formData.dailyRunRate}
          onChange={(e) => handleChange("dailyRunRate", Number(e.target.value))}
        />

        {/* Hourly Run Rate */}
        <Input
          type="number"
          label="Hourly Run Rate"
          value={formData.hourlyRunRate}
          onChange={(e) => handleChange("hourlyRunRate", Number(e.target.value))}
        />

        {/* Mins Per Shipper */}
        <Input
          type="number"
          label="Minutes Per Shipper"
          value={formData.minsPerShipper}
          onChange={(e) => handleChange("minsPerShipper", Number(e.target.value))}
        />

        {/* Price Per Shipper */}
        <Input
          type="number"
          step="0.01"
          label="Price Per Shipper"
          value={formData.pricePerShipper}
          onChange={(e) => handleChange("pricePerShipper", Number(e.target.value))}
        />

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </Dialog>
  );
}