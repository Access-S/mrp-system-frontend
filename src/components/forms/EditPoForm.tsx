// src/components/forms/EditPoForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { FormAlert } from "../dialogs/FormAlert";
import { updatePo } from "../../services/api.service";

// ============== BLOCK 2: Types ==============

interface EditPoFormProps {
  open: boolean;
  handleOpen: () => void;
  po: any | null;
  onUpdate: (updatedData: any) => void;
}

// ============== BLOCK 3: Simple Collapse Component ==============

const Collapse: React.FC<{ open: boolean; children: React.ReactNode }> = ({
  open,
  children,
}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const content = contentRef.current;
      if (content) {
        setHeight(content.scrollHeight);
      }
    } else {
      setHeight(0);
    }
  }, [open, children]);

  return (
    <div
      style={{ height: height !== undefined ? height : "auto" }}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? "" : "invisible opacity-0"
      }`}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

// ============== BLOCK 4: Component ==============

export function EditPoForm({ open, handleOpen, po, onUpdate }: EditPoFormProps) {
  // ============== BLOCK 5: State ==============
  const [formData, setFormData] = useState({
    poNumber: "",
    customerName: "",
    poCreatedDate: "",
    poReceivedDate: "",
    orderedQtyPieces: "",
    customerAmount: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [calculatedShippers, setCalculatedShippers] = useState(0);
  const [systemAmount, setSystemAmount] = useState(0);
  const [amountDifference, setAmountDifference] = useState(0);
  const [isAmountMismatch, setIsAmountMismatch] = useState(false);

  // ============== BLOCK 6: Effects ==============
  useEffect(() => {
    if (po) {
      setFormData({
        poNumber: po.poNumber || "",
        customerName: po.customerName || "",
        poCreatedDate: po.poCreatedDate
          ? new Date(po.poCreatedDate).toISOString().split("T")[0]
          : "",
        poReceivedDate: po.poReceivedDate
          ? new Date(po.poReceivedDate).toISOString().split("T")[0]
          : "",
        orderedQtyPieces: po.orderedQtyPieces?.toString() || "",
        customerAmount: po.customerAmount?.toString() || "",
      });
    }
  }, [po]);

  useEffect(() => {
    if (!po || !po.product) {
      setCalculatedShippers(0);
      setSystemAmount(0);
      return;
    }

    const unitsPerShipper = po.product.unitsPerShipper || 0;
    const pricePerShipper = po.product.pricePerShipper || 0;
    const pieces = Number(formData.orderedQtyPieces) || 0;
    const shippers = unitsPerShipper > 0 ? pieces / unitsPerShipper : 0;
    const calculatedSystemAmount = shippers * pricePerShipper;

    setCalculatedShippers(shippers);
    setSystemAmount(calculatedSystemAmount);

    const custAmount = Number(formData.customerAmount) || 0;
    const diff = Math.abs(custAmount - calculatedSystemAmount);
    setAmountDifference(diff);
    setIsAmountMismatch(diff > 5);
  }, [formData.orderedQtyPieces, formData.customerAmount, po]);

  // ============== BLOCK 7: Handlers ==============
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!po) return;
    setErrorMessage("");
    setIsSaving(true);

    const updatedData = {
      ...formData,
      orderedQtyPieces: Number(formData.orderedQtyPieces),
      customerAmount: Number(formData.customerAmount),
    };

    try {
      const updatedPo = await updatePo(po.id, updatedData);
      onUpdate(updatedPo);
      handleOpen();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ============== BLOCK 8: Render ==============
  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      size="md"
      title={po ? `Edit PO: ${po.poNumber}` : "Edit Purchase Order"}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleOpen} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} loading={isSaving}>
            Save Changes
          </Button>
        </div>
      }
    >
      {po ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="poNumber"
              label="PO Number"
              value={formData.poNumber}
              onChange={handleInputChange}
            />
            <Input
              name="customerName"
              label="Customer Name"
              value={formData.customerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="poCreatedDate"
              type="date"
              label="PO Created Date"
              value={formData.poCreatedDate}
              onChange={handleInputChange}
            />
            <Input
              name="poReceivedDate"
              type="date"
              label="PO Received Date"
              value={formData.poReceivedDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="orderedQtyPieces"
              type="number"
              label="Ordered Quantity (Pieces)"
              value={formData.orderedQtyPieces}
              onChange={handleInputChange}
            />
            <Input
              name="customerAmount"
              type="number"
              label="Amount"
              value={formData.customerAmount}
              onChange={handleInputChange}
            />
          </div>

          <Collapse open={!!po.product}>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm space-y-2">
              <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                System Calculation
              </h6>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipper Quantity:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {calculatedShippers.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expected Amount:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ${systemAmount.toFixed(2)}
                </span>
              </div>
              {Number(formData.customerAmount) > 0 && (
                <div
                  className={`flex justify-between p-2 rounded ${
                    isAmountMismatch
                      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  }`}
                >
                  <span>Amount Difference:</span>
                  <span className="font-bold">${amountDifference.toFixed(2)}</span>
                </div>
              )}
            </div>
          </Collapse>

          {errorMessage && (
            <FormAlert
              type="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" />
        </div>
      )}
    </Dialog>
  );
}