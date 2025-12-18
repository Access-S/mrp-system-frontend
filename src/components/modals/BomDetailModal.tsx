//src/components/modals/BomDetailModal.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Dialog, DialogHeader, DialogBody, Typography, Spinner
} from "@material-tailwind/react";
import { BomComponent, Product } from "../../types/mrp.types";
import { fetchBomForProduct } from "../../services/api.service";
import { useTheme } from "../../contexts/ThemeContext";

// BLOCK 2: Interface and Component Definition
interface BomDetailModalProps {
  open: boolean;
  handleOpen: () => void;
  product: any | null;
}

export function BomDetailModal({ open, handleOpen, product }: BomDetailModalProps) {
  const { theme } = useTheme();
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && product?.productCode && components.length === 0) {  // ✅ Changed to productCode
      setIsLoading(true);
      fetchBomForProduct(product.productCode)  // ✅ Changed to productCode
        .then(response => {
          // Handle API response format: { success: true, data: [...] }
          if (response.success && Array.isArray(response.data)) {
            setComponents(response.data);
          } else {
            console.error('Unexpected API response:', response);
            setComponents([]);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (!open) {
      setComponents([]);
    }
  }, [open, product, components.length]);

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader>
        BOM for: {product?.productCode} - {product?.description}  {/* ✅ Changed to productCode */}
      </DialogHeader>
      <DialogBody divider>
        {isLoading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : components.length > 0 ? (
          <div className={`border-2 ${theme.borderColor} rounded-lg`}>
            <table className="w-full min-w-max table-auto text-left">
              <thead className={`border-b-2 ${theme.borderColor}`}>
                <tr>
                  <th className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}><Typography variant="small" className={`font-semibold ${theme.text}`}>Part Code</Typography></th>
                  <th className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}><Typography variant="small" className={`font-semibold ${theme.text}`}>Description</Typography></th>
                  <th className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}><Typography variant="small" className={`font-semibold ${theme.text}`}>Part Type</Typography></th>
                  <th className={`p-2 text-center ${theme.tableHeaderBg}`}><Typography variant="small" className={`font-semibold ${theme.text}`}>Qty / Shipper</Typography></th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp, index) => {
                  const isLastRow = index === components.length - 1;
                  return (
                    <tr key={comp.partCode} className={theme.hoverBg}>  {/* ✅ Changed to partCode */}
                      <td className={`p-2 border-r ${isLastRow ? '' : `border-b`} ${theme.borderColor}`}>
                        <Typography variant="small" className={`font-mono ${theme.text}`}>
                          {comp.partCode}  {/* ✅ Changed to partCode */}
                        </Typography>
                      </td>
                      <td className={`p-2 border-r ${isLastRow ? '' : `border-b`} ${theme.borderColor}`}>
                        <Typography variant="small" className={theme.text}>
                          {comp.partDescription}  {/* ✅ Changed to partDescription */}
                        </Typography>
                      </td>
                      <td className={`p-2 border-r ${isLastRow ? '' : `border-b`} ${theme.borderColor}`}>
                        <Typography variant="small" className={`${theme.text} opacity-80`}>
                          {comp.partType}  {/* ✅ Changed to partType */}
                        </Typography>
                      </td>
                      <td className={`p-2 text-center ${isLastRow ? '' : `border-b`} ${theme.borderColor}`}>
                        <Typography variant="small" className={`font-semibold ${theme.text}`}>
                          {comp.perShipper}  {/* ✅ Changed to perShipper */}
                        </Typography>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Typography className={theme.text}>No Bill of Materials found for this product.</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
}