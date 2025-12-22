//src/components/modals/AddBomComponentModal.tsx

// BLOCK 1: Imports
import React, { useState } from "react";
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
import { bomService } from "../../services/bom.service";

// BLOCK 2: Interface
interface AddBomComponentModalProps {
  open: boolean;
  onClose: () => void;
  productCode: string;
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
export function AddBomComponentModal({ 
  open, 
  onClose, 
  productCode, 
  onSuccess 
}: AddBomComponentModalProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    partCode: "",
    partDescription: "",
    partType: "RAW_MATERIAL",
    perShipper: 0
  });

// BLOCK 5: Handlers
const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      // ✅ Use real API call
      await bomService.addComponent(productCode, formData);
      
      // Reset form
      setFormData({
        partCode: "",
        partDescription: "",
        partType: "RAW_MATERIAL",
        perShipper: 0
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add component");
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
        perShipper: 0
      });
      setError(null);
      onClose();
    }
  };

  // BLOCK 6: Render
  return (
    <Dialog open={open} handler={handleClose} size="md">
      <DialogHeader className={theme.text}>
        Add BOM Component
        <Typography variant="small" className={`${theme.text} opacity-70 font-normal ml-2`}>
          for {productCode}
        </Typography>
      </DialogHeader>
      
      <DialogBody divider className="space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Part Code */}
        <div>
          <Typography variant="small" className={`${theme.text} mb-2`}>
            Part Code *
          </Typography>
          <Input
            label="Enter part code"
            value={formData.partCode}
            onChange={(e) => handleChange("partCode", e.target.value.toUpperCase())}
            color={theme.isDark ? "white" : "black"}
            disabled={loading}
          />
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

        {/* Helper Text */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <Typography className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> The quantity represents how many units of this component are needed per shipper of the final product.
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
          color="green"
        >
          Add Component
        </Button>
      </DialogFooter>
    </Dialog>
  );
}