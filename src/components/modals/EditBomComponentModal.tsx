//src/components/modals/EditBomComponentModal.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
  Select,
  Option
} from "@material-tailwind/react";
import { useTheme } from "../../contexts/ThemeContext";

// BLOCK 2: Interface
interface EditBomComponentModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
  component: any | null;
  onSuccess: () => void;
}

// BLOCK 3: Part Type Options
const PART_TYPES = [
  { value: "RAW_MATERIAL", label: "Raw Material" },
  { value: "COMPONENT", label: "Component" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "CONSUMABLE", label: "Consumable" }
];

// BLOCK 4: Main Component
export function EditBomComponentModal({ 
  open, 
  onClose, 
  productCode, 
  component,
  onSuccess 
}: EditBomComponentModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partCode: "",
    partDescription: "",
    partType: "RAW_MATERIAL",
    perShipper: 0
  });

  // BLOCK 5: Populate Form Data when component changes
  useEffect(() => {
    if (component) {
      setFormData({
        partCode: component.partCode || "",
        partDescription: component.partDescription || "",
        partType: component.partType || "RAW_MATERIAL",
        perShipper: component.perShipper || 0
      });
    }
  }, [component]);

  // BLOCK 6: Handlers
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      // TODO: Implement API call when backend is ready
      // await bomService.updateComponent(productCode, formData.partCode, {
      //   partDescription: formData.partDescription,
      //   partType: formData.partType,
      //   perShipper: formData.perShipper
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Updating component:', { productCode, ...formData });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update component");
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

  // BLOCK 7: Render
  return (
    <Dialog open={open} handler={handleClose} size="md">
      <DialogHeader className={theme.text}>
        Edit BOM Component
        <Typography variant="small" className={`${theme.text} opacity-70 font-normal ml-2`}>
          for {productCode}
        </Typography>
      </DialogHeader>
      
      <DialogBody divider className="space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Part Code (Read-only) */}
        <div>
          <Typography variant="small" className={`${theme.text} mb-2`}>
            Part Code
          </Typography>
          <Input
            value={formData.partCode}
            disabled
            color={theme.isDark ? "white" : "black"}
            className="opacity-100"
          />
          <Typography variant="small" className={`${theme.text} opacity-60 mt-1`}>
            Part code cannot be changed
          </Typography>
        </div>

        {/* Part Description */}
        <div>
          <Typography variant="small" className={`${theme.text} mb-2`}>
            Part Description *
          </Typography>
          <Input
            label="Enter description"
            value={formData.partDescription}
            onChange={(e) => handleChange("partDescription", e.target.value)}
            color={theme.isDark ? "white" : "black"}
            disabled={loading}
          />
        </div>

        {/* Part Type */}
        <div>
          <Typography variant="small" className={`${theme.text} mb-2`}>
            Part Type *
          </Typography>
          <Select
            label="Select part type"
            value={formData.partType}
            onChange={(value) => handleChange("partType", value || "RAW_MATERIAL")}
            disabled={loading}
          >
            {PART_TYPES.map(type => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Quantity Per Shipper */}
        <div>
          <Typography variant="small" className={`${theme.text} mb-2`}>
            Quantity Per Shipper *
          </Typography>
          <Input
            type="number"
            label="Enter quantity"
            value={formData.perShipper}
            onChange={(e) => handleChange("perShipper", Number(e.target.value))}
            color={theme.isDark ? "white" : "black"}
            disabled={loading}
            min="0"
            step="0.01"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          </div>
        )}

        {/* Info Message */}
        <div className="bg-amber-50 border border-amber-200 rounded p-3">
          <Typography className="text-sm text-amber-800">
            ⚠️ <strong>Note:</strong> Changes will affect all calculations using this BOM component.
          </Typography>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button
          variant="text"
          onClick={handleClose}
          className="mr-2"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={loading}
          color="blue"
        >
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}