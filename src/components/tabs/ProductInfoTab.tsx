//src/components/tabs/ProductInfoTab.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
  CardBody
} from "@material-tailwind/react";
import { useTheme } from "../../contexts/ThemeContext";
import { productService, UpdateProductData } from "../../services/product.service";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

// BLOCK 2: Interface
interface ProductInfoTabProps {
  product: any;
  onUpdate: () => void;
}

// BLOCK 3: Main Component
export function ProductInfoTab({ product, onUpdate }: ProductInfoTabProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    description: "",
    unitsPerShipper: 0,
    dailyRunRate: 0,
    hourlyRunRate: 0,
    minsPerShipper: 0,
    pricePerShipper: 0
  });

  // BLOCK 4: Initialize Form Data
  useEffect(() => {
    if (product) {
      setFormData({
        description: product.description || "",
        unitsPerShipper: product.unitsPerShipper || 0,
        dailyRunRate: product.dailyRunRate || 0,
        hourlyRunRate: product.hourlyRunRate || 0,
        minsPerShipper: product.minsPerShipper || 0,
        pricePerShipper: product.pricePerShipper || 0
      });
    }
  }, [product]);

  // BLOCK 5: Handlers
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = () => {
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setSaving(true);
    setError(null);

    productService.updateProduct(product.productCode, formData)
      .then(() => {
        setIsEditing(false);
        onUpdate();
      })
      .catch(err => {
        setError(err.message || "Failed to update product");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      description: product.description || "",
      unitsPerShipper: product.unitsPerShipper || 0,
      dailyRunRate: product.dailyRunRate || 0,
      hourlyRunRate: product.hourlyRunRate || 0,
      minsPerShipper: product.minsPerShipper || 0,
      pricePerShipper: product.pricePerShipper || 0
    });
    setIsEditing(false);
    setError(null);
  };

  // BLOCK 6: Render
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Typography variant="h5" className={theme.text}>
          Product Information
        </Typography>
        {!isEditing ? (
          <Button
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsEditing(true)}
            color="blue"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlined"
              className="flex items-center gap-2"
              onClick={handleCancel}
              disabled={saving}
            >
              <XMarkIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSave}
              loading={saving}
              color="green"
            >
              <CheckIcon className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-50 border border-red-200">
          <CardBody className="p-3">
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          </CardBody>
        </Card>
      )}

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Code (Read-only) */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Product Code
          </Typography>
          <Input
            value={product.productCode}
            disabled
            color={theme.isDark ? "white" : "black"}
            className="opacity-100"
          />
        </div>

        {/* Description */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Description *
          </Typography>
          <Input
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Units Per Shipper */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Units Per Shipper
          </Typography>
          <Input
            type="number"
            value={formData.unitsPerShipper}
            onChange={(e) => handleChange("unitsPerShipper", Number(e.target.value))}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Daily Run Rate */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Daily Run Rate
          </Typography>
          <Input
            type="number"
            value={formData.dailyRunRate}
            onChange={(e) => handleChange("dailyRunRate", Number(e.target.value))}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Hourly Run Rate */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Hourly Run Rate
          </Typography>
          <Input
            type="number"
            value={formData.hourlyRunRate}
            onChange={(e) => handleChange("hourlyRunRate", Number(e.target.value))}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Mins Per Shipper */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Minutes Per Shipper
          </Typography>
          <Input
            type="number"
            value={formData.minsPerShipper}
            onChange={(e) => handleChange("minsPerShipper", Number(e.target.value))}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Price Per Shipper */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Price Per Shipper ($)
          </Typography>
          <Input
            type="number"
            step="0.01"
            value={formData.pricePerShipper}
            onChange={(e) => handleChange("pricePerShipper", Number(e.target.value))}
            disabled={!isEditing}
            color={theme.isDark ? "white" : "black"}
          />
        </div>

        {/* Created At (Read-only) */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Created At
          </Typography>
          <Input
            value={product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
            disabled
            color={theme.isDark ? "white" : "black"}
            className="opacity-100"
          />
        </div>

        {/* Updated At (Read-only) */}
        <div>
          <Typography variant="small" className={`${theme.text} opacity-70 mb-2`}>
            Last Updated
          </Typography>
          <Input
            value={product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
            disabled
            color={theme.isDark ? "white" : "black"}
            className="opacity-100"
          />
        </div>
      </div>
    </div>
  );
}