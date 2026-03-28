// src/components/modals/BomDetailModal.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Spinner } from "../ui/Spinner";
import { getBomForProduct } from "../../services/product.service";
import { useTheme } from "../../contexts/ThemeContext";

// ============== BLOCK 2: Types ==============

interface BomDetailModalProps {
  open: boolean;
  handleOpen: () => void;
  product: any | null;
}

// ============== BLOCK 3: Component ==============

export function BomDetailModal({
  open,
  handleOpen,
  product,
}: BomDetailModalProps) {
  const { theme } = useTheme();
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ============== BLOCK 4: Effects ==============

  useEffect(() => {
    if (open && product?.productCode && components.length === 0) {
      setIsLoading(true);
      getBomForProduct(product.productCode)
        .then((data) => {
          setComponents(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Failed to load BOM components:", error);
          setComponents([]);
        })
        .finally(() => setIsLoading(false));
    } else if (!open) {
      setComponents([]);
    }
  }, [open, product, components.length]);

  // ============== BLOCK 5: Render ==============

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      size="lg"
      title={`BOM for: ${product?.productCode} - ${product?.description}`}
    >
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner size="lg" />
          </div>
        ) : components.length > 0 ? (
          <div className={`border rounded-lg ${theme.borderColor}`}>
            <table className="w-full min-w-max table-auto text-left">
              <thead className={`border-b ${theme.borderColor}`}>
                <tr>
                  <th
                    className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}
                  >
                    <span className={`text-sm font-semibold ${theme.text}`}>
                      Part Code
                    </span>
                  </th>
                  <th
                    className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}
                  >
                    <span className={`text-sm font-semibold ${theme.text}`}>
                      Description
                    </span>
                  </th>
                  <th
                    className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}
                  >
                    <span className={`text-sm font-semibold ${theme.text}`}>
                      Part Type
                    </span>
                  </th>
                  <th
                    className={`p-2 text-center ${theme.tableHeaderBg}`}
                  >
                    <span className={`text-sm font-semibold ${theme.text}`}>
                      Qty / Shipper
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp, index) => {
                  const isLastRow = index === components.length - 1;
                  return (
                    <tr key={comp.partCode} className={theme.hoverBg}>
                      <td
                        className={`p-2 border-r ${
                          isLastRow ? "" : "border-b"
                        } ${theme.borderColor}`}
                      >
                        <span className={`text-sm font-mono ${theme.text}`}>
                          {comp.partCode}
                        </span>
                      </td>
                      <td
                        className={`p-2 border-r ${
                          isLastRow ? "" : "border-b"
                        } ${theme.borderColor}`}
                      >
                        <span className={`text-sm ${theme.text}`}>
                          {comp.partDescription}
                        </span>
                      </td>
                      <td
                        className={`p-2 border-r ${
                          isLastRow ? "" : "border-b"
                        } ${theme.borderColor}`}
                      >
                        <span className={`text-sm opacity-80 ${theme.text}`}>
                          {comp.partType}
                        </span>
                      </td>
                      <td
                        className={`p-2 text-center ${
                          isLastRow ? "" : "border-b"
                        } ${theme.borderColor}`}
                      >
                        <span className={`text-sm font-semibold ${theme.text}`}>
                          {comp.perShipper}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`p-4 text-center ${theme.text}`}>
            No Bill of Materials found for this product.
          </p>
        )}
      </div>
    </Dialog>
  );
}