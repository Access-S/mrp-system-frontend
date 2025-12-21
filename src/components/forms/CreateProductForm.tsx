//src/components/forms/CreateProductForm.tsx

// BLOCK 1: Imports
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography
} from "@material-tailwind/react";
import { useTheme } from "../../contexts/ThemeContext";
import { productService } from "../../services/product.service";

// BLOCK 2: Interface
interface CreateProductFormProps {
  open: boolean;
  handleOpen: () => void;
  onProductCreated: () => void;
}

// BLOCK 3: Component
export function CreateProductForm({ open, handleOpen, onProductCreated }: CreateProductFormProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    productCode: "",
    description: "",
    unitsPerShipper: 0,
    dailyRunRate: 0,
    hourlyRunRate: 0,
    minsPerShipper: 0,
    pricePerShipper: 0
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        pricePerShipper: 0
      });
      
      onProductCreated();
      handleOpen();
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className={theme.text}>Create New Product</DialogHeader>
      <DialogBody divider className="h-[28rem] overflow-y-auto">
        <div className="grid gap-4">
          {/* Product Code */}
          <Input
            label="Product Code *"
            value={formData.productCode}
            onChange={(e) => handleChange("productCode", e.target.value)}
            color={theme.isDark ? "white" : "black"}
            required
          />

          {/* Description */}
          <Input
            label="Description *"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            color={theme.isDark ? "white" : "black"}
            required
          />

          {/* Units Per Shipper */}
          <Input
            type="number"
            label="Units Per Shipper"
            value={formData.unitsPerShipper}
            onChange={(e) => handleChange("unitsPerShipper", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
          />

          {/* Daily Run Rate */}
          <Input
            type="number"
            label="Daily Run Rate"
            value={formData.dailyRunRate}
            onChange={(e) => handleChange("dailyRunRate", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
          />

          {/* Hourly Run Rate */}
          <Input
            type="number"
            label="Hourly Run Rate"
            value={formData.hourlyRunRate}
            onChange={(e) => handleChange("hourlyRunRate", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
          />

          {/* Mins Per Shipper */}
          <Input
            type="number"
            label="Minutes Per Shipper"
            value={formData.minsPerShipper}
            onChange={(e) => handleChange("minsPerShipper", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
          />

          {/* Price Per Shipper */}
          <Input
            type="number"
            step="0.01"
            label="Price Per Shipper"
            value={formData.pricePerShipper}
            onChange={(e) => handleChange("pricePerShipper", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
          />

          {error && (
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={handleOpen} className="mr-2">
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading} color="green">
          Create Product
        </Button>
      </DialogFooter>
    </Dialog>
  );
}