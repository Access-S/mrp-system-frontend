// src/features/products/modals/EditBomComponentModal.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useTheme } from "@/contexts/ThemeContext";
import { bomService } from "../services/bom.service";

// ============== BLOCK 2: Types ==============

interface EditBomComponentModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
  component: any | null;
  onSuccess: () => void;
}

// ============== BLOCK 3: Part Type Options ==============

const PART_TYPES = [
  { value: "RAW_MATERIAL", label: "Raw Material" },
  { value: "COMPONENT", label: "Component" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "CONSUMABLE", label: "Consumable" },
];

// ============== BLOCK 4: Component ==============

export function EditBomComponentModal({
  open,
  onClose,
  productCode,
  component,
  onSuccess,
}: EditBomComponentModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partCode: "",
    partDescription: "",
    partType: "RAW_MATERIAL",
    perShipper: 0,
  });

  // ============== BLOCK 5: Populate Form Data ==============

  useEffect(() => {
    if (component) {
      setFormData({
        partCode: component.partCode || "",
        partDescription: component.partDescription || "",
        partType: component.partType || "RAW_MATERIAL",
        perShipper: component.perShipper || 0,
      });
    }
  }, [component]);

  // ============== BLOCK 6: Handlers ==============

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.partDescription.trim()) {
      setError("Part Description is required");
      return;
    }
    if (formData.perShipper <= 0) {
      setError("Quantity per shipper must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await bomService.updateComponent(productCode, formData.partCode, {
        partDescription: formData.partDescription,
        partType: formData.partType as
          | "RAW_MATERIAL"
          | "COMPONENT"
          | "PACKAGING"
          | "CONSUMABLE",
        perShipper: formData.perShipper,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update component";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  // ============== BLOCK 7: Render ==============

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="md"
      title={
        <span>
          Edit BOM Component
          <span className={`ml-2 text-sm opacity-70 ${theme.text}`}>
            for {productCode}
          </span>
        </span>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Part Code (Read-only) */}
        <div>
          <label className={`block text-sm mb-2 ${theme.text}`}>Part Code</label>
          <Input
            value={formData.partCode}
            disabled
            className="opacity-100"
          />
          <p className={`text-xs mt-1 opacity-60 ${theme.text}`}>
            Part code cannot be changed
          </p>
        </div>

        {/* Part Description */}
        <div>
          <label className={`block text-sm mb-2 ${theme.text}`}>
            Part Description *
          </label>
          <Input
            label="Enter description"
            value={formData.partDescription}
            onChange={(e) => handleChange("partDescription", e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Part Type */}
        <div>
          <label className={`block text-sm mb-2 ${theme.text}`}>
            Part Type *
          </label>
          <Select
            label="Select part type"
            value={formData.partType}
            onChange={(value) => handleChange("partType", value || "RAW_MATERIAL")}
            disabled={loading}
            options={PART_TYPES}
          />
        </div>

        {/* Quantity Per Shipper */}
        <div>
          <label className={`block text-sm mb-2 ${theme.text}`}>
            Quantity Per Shipper *
          </label>
          <Input
            type="number"
            label="Enter quantity"
            value={formData.perShipper}
            onChange={(e) => handleChange("perShipper", Number(e.target.value))}
            disabled={loading}
            min="0"
            step="0.01"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Info Message */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded p-3">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            ⚠️ <strong>Note:</strong> Changes will affect all calculations using this BOM component.
          </p>
        </div>
      </div>
    </Dialog>
  );
}