// src/components/modals/PoDetailModal.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Card } from "../ui/Card";
import { Spinner } from "../ui/Spinner";
import { getBomForProduct } from "../../services/product.service";
import { useTheme } from "../../contexts/ThemeContext";

// ============== BLOCK 2: Helper function ==============

const formatDate = (date: Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============== BLOCK 3: DetailRow Sub-component ==============

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <div className={`flex justify-between items-center py-2 border-b ${theme.borderColor}`}>
      <span className={`text-sm font-semibold opacity-80 ${theme.text}`}>{label}:</span>
      <span className={`text-sm font-medium ${theme.text}`}>{value}</span>
    </div>
  );
};

// ============== BLOCK 4: Interface and Component Definition ==============

interface PoDetailModalProps {
  open: boolean;
  handleOpen: () => void;
  po: any | null;
}

export function PoDetailModal({ open, handleOpen, po }: PoDetailModalProps) {
  const { theme } = useTheme();
  const [components, setComponents] = useState<any[]>([]);
  const [isLoadingBom, setIsLoadingBom] = useState(false);

  // ============== BLOCK 5: Effects ==============

  useEffect(() => {
    const productCode = po?.product?.productCode;
    if (open && productCode && components.length === 0) {
      setIsLoadingBom(true);
      getBomForProduct(productCode)
        .then((data) => setComponents(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setIsLoadingBom(false));
    } else if (!open) {
      setComponents([]);
    }
  }, [open, po, components.length]);

  // ============== BLOCK 6: Render ==============

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      size="xl"
      title={
        <div className="flex justify-between items-center w-full">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Details for PO: {po?.po_number}
          </span>
          <div className="flex items-center gap-2">
            {po?.statuses?.map((s: { status: string }) => (
              <span
                key={s.status}
                className="py-1 px-2 rounded-lg bg-blue-500 text-white text-xs font-semibold"
              >
                {s.status}
              </span>
            ))}
          </div>
        </div>
      }
    >
      <div className="p-6">
        {po ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Information Card */}
            <Card
              variant="bordered"
              className={`lg:col-span-1 p-4 ${theme.cards}`}
            >
              <h6 className={`text-base font-semibold mb-2 pb-2 border-b-2 ${theme.borderColor}`}>
                Order Information
              </h6>
              <div className="space-y-1">
                <DetailRow label="Customer" value={po.customerName} />
                <DetailRow label="Created Date" value={formatDate(po.poCreatedDate)} />
                <DetailRow label="Received Date" value={formatDate(po.poReceivedDate)} />
                <DetailRow label="Qty (Pieces)" value={po.orderedQtyPieces?.toLocaleString()} />
                <DetailRow label="Qty (Shippers)" value={Number(po.orderedQtyShippers).toFixed(2)} />
                <DetailRow label="Customer Amount" value={`$${Number(po.customerAmount).toFixed(2)}`} />
                <DetailRow label="System Amount" value={`$${Number(po.systemAmount).toFixed(2)}`} />
                <DetailRow label="Hourly Run Rate" value={Number(po.hourlyRunRate).toFixed(2)} />
                <DetailRow label="Mins per Shipper" value={Number(po.minsPerShipper).toFixed(3)} />
                {po.deliveryDate && (
                  <>
                    <DetailRow label="Despatch Date" value={formatDate(po.deliveryDate)} />
                    <DetailRow label="Docket Number" value={po.deliveryDocketNumber || "N/A"} />
                  </>
                )}
              </div>
            </Card>

            {/* Product & BOM Card */}
            <Card
              variant="bordered"
              className={`lg:col-span-2 p-4 ${theme.cards}`}
            >
              <h6 className={`text-base font-semibold mb-2 pb-2 border-b-2 ${theme.borderColor}`}>
                Product & Bill of Materials
              </h6>
              <div
                className={`p-2 my-2 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 ${theme.borderColor}`}
              >
                <DetailRow label="Product Code" value={po.product?.product_code} />
                <DetailRow label="Description" value={po.description} />
              </div>

              {isLoadingBom ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className={`border-2 ${theme.borderColor} rounded-lg overflow-hidden`}>
                  <table className="w-full min-w-max table-auto text-left">
                    <thead className={`border-b-2 ${theme.borderColor}`}>
                      <tr>
                        <th
                          className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}
                        >
                          <span className={`text-sm font-semibold ${theme.text}`}>Part Code</span>
                        </th>
                        <th
                          className={`p-2 border-r ${theme.borderColor} ${theme.tableHeaderBg}`}
                        >
                          <span className={`text-sm font-semibold ${theme.text}`}>Description</span>
                        </th>
                        <th
                          className={`p-2 text-center ${theme.tableHeaderBg}`}
                        >
                          <span className={`text-sm font-semibold ${theme.text}`}>Qty/Shipper</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {components.map((comp, index) => {
                        const isLastRow = index === components.length - 1;
                        return (
                          <tr key={comp.id} className={theme.hoverBg}>
                            <td
                              className={`p-2 border-r ${isLastRow ? "" : "border-b"} ${theme.borderColor}`}
                            >
                              <span className={`text-sm font-mono ${theme.text}`}>
                                {comp.part_code}
                              </span>
                            </td>
                            <td
                              className={`p-2 border-r ${isLastRow ? "" : "border-b"} ${theme.borderColor}`}
                            >
                              <span className={`text-sm ${theme.text}`}>
                                {comp.part_description}
                              </span>
                            </td>
                            <td
                              className={`p-2 text-center ${isLastRow ? "" : "border-b"} ${theme.borderColor}`}
                            >
                              <span className={`text-sm font-semibold ${theme.text}`}>
                                {comp.per_shipper}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    </Dialog>
  );
}