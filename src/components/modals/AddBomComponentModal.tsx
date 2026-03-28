// src/components/modals/AddBomComponentModal.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { useTheme } from "../../contexts/ThemeContext";
import { bomService } from "../../services/bom.service";

// ============== BLOCK 2: Types ==============

interface AddBomComponentModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
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

export function AddBomComponentModal({
  open,
  onClose,
  productCode,
  onSuccess,
}: AddBomComponentModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partCode: "",
    partDescription: "",
    partType: "RAW_MATERIAL",
    perShipper: 0,
  });

  // ============== BLOCK 5: Handlers ==============

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.partCode.trim()) {
      setError("Part Code is required");
      return;
    }
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
      await bomService.addComponent(productCode, formData);

      // Reset form
      setFormData({
        partCode: "",
        partDescription: "",
        partType: "RAW_MATERIAL",
        perShipper: 0,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add component";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset form on close
      setFormData({
        partCode: "",
        partDescription: "",
        partType: "RAW_MATERIAL",
        perShipper: 0,
      });
      setError(null);
      onClose();
    }
  };

  // ============== BLOCK 6: Render ==============

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="md"
      title={
        <span>
          Add BOM Component
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
            Add Component
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Part Code */}
        <div>
          <label className={`block text-sm mb-2 ${theme.text}`}>
            Part Code *
          </label>
          <Input
            label="Enter part code"
            value={formData.partCode}
            onChange={(e) => handleChange("partCode", e.target.value.toUpperCase())}
            disabled={loading}
          />
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

        {/* Helper Text */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-3">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> The quantity represents how many units of this component are needed per shipper of the final product.
          </p>
        </div>
      </div>
    </Dialog>
  );
}