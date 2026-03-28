// src/components/forms/CreateProductForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { productService } from "../../services/product.service";

// ============== BLOCK 2: Types ==============

interface CreateProductFormProps {
  open: boolean;
  handleOpen: () => void;
  onProductCreated: () => void;
}

// ============== BLOCK 3: Component ==============

export function CreateProductForm({
  open,
  handleOpen,
  onProductCreated,
}: CreateProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productCode: "",
    description: "",
    unitsPerShipper: 0,
    dailyRunRate: 0,
    hourlyRunRate: 0,
    minsPerShipper: 0,
    pricePerShipper: 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.productCode.trim()) {
      setError("Product Code is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await productService.createProduct(formData);

      // Reset form
      setFormData({
        productCode: "",
        description: "",
        unitsPerShipper: 0,
        dailyRunRate: 0,
        hourlyRunRate: 0,
        minsPerShipper: 0,
        pricePerShipper: 0,
      });

      onProductCreated();
      handleOpen();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create product";
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
      title="Create New Product"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create Product
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        {/* Product Code */}
        <Input
          label="Product Code *"
          value={formData.productCode}
          onChange={(e) => handleChange("productCode", e.target.value)}
          required
        />

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