// src/components/forms/CreatePoForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { Dialog } from "../../../components/ui/Dialog";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { FormAlert } from "../../../components/dialogs/FormAlert";
import { createPo } from "@/services/api.service";

// ============== BLOCK 2: Types ==============

interface CreatePoFormProps {
  open: boolean;
  handleOpen: () => void;
  onPoCreated: () => void;
}

// ============== BLOCK 3: Component ==============

export function CreatePoForm({
  open,
  handleOpen,
  onPoCreated,
}: CreatePoFormProps) {
  // ============== BLOCK 4: State Management ==============
  const [poNumber, setPoNumber] = useState("");
  const [productCode, setProductCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [poCreatedDate, setPoCreatedDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");
  const [orderedQtyPieces, setOrderedQtyPieces] = useState<number | string>("");
  const [customerAmount, setCustomerAmount] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ============== BLOCK 5: Handlers ==============
  const resetForm = () => {
    setPoNumber("");
    setProductCode("");
    setCustomerName("");
    setPoCreatedDate("");
    setPoReceivedDate("");
    setOrderedQtyPieces("");
    setCustomerAmount("");
    setIsSubmitting(false);
    setErrorMessage("");
  };

  const handleClose = () => {
    resetForm();
    handleOpen();
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (
      !poNumber ||
      !productCode ||
      !customerName ||
      !poCreatedDate ||
      !poReceivedDate ||
      !orderedQtyPieces ||
      !customerAmount
    ) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    const poData = {
      poNumber: poNumber.trim(),
      productCode: productCode.trim(),
      customerName: customerName.trim(),
      poCreatedDate,
      poReceivedDate,
      orderedQtyPieces: Number(orderedQtyPieces),
      customerAmount: Number(customerAmount),
    };

    try {
      await createPo(poData);
      onPoCreated();
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  // ============== BLOCK 6: Render ==============
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      size="md"
      title="Create New Purchase Order"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
            Submit PO
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="PO Number"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            required
          />
          <Input
            label="Finish Code / Product Code"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            required
          />
        </div>
        <Input
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="PO Created Date"
            value={poCreatedDate}
            onChange={(e) => setPoCreatedDate(e.target.value)}
            required
          />
          <Input
            type="date"
            label="PO Received Date"
            value={poReceivedDate}
            onChange={(e) => setPoReceivedDate(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Ordered Quantity (Pieces)"
            value={orderedQtyPieces}
            onChange={(e) => setOrderedQtyPieces(e.target.value)}
            required
          />
          <Input
            type="number"
            label="Amount"
            value={customerAmount}
            onChange={(e) => setCustomerAmount(e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          System calculations and status will be determined upon submission.
        </p>

        {errorMessage && (
          <FormAlert
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
          />
        )}
      </div>
    </Dialog>
  );
}