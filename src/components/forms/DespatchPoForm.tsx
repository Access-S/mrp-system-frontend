// src/components/forms/DespatchPoForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";

// ============== BLOCK 2: Types & Interfaces ==============

interface DespatchPoFormProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (deliveryDate: string, docketNumber: string) => void;
}

// ============== BLOCK 3: Component ==============

export function DespatchPoForm({
  open,
  handleOpen,
  onSubmit,
}: DespatchPoFormProps) {
  const { toast } = useToast();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [docketNumber, setDocketNumber] = useState("");

  // ============== BLOCK 4: Handlers ==============

  const handleSubmit = () => {
    if (!deliveryDate || !docketNumber) {
      toast.error("Please fill out both delivery date and docket number.");
      return;
    }
    onSubmit(deliveryDate, docketNumber);
    handleOpen();
  };

  // ============== BLOCK 5: Render ==============

  return (
    <Dialog
      open={open}
      onClose={handleOpen}
      size="sm"
      title="Confirm Despatch Details"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Confirm Despatch
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          type="date"
          label="Delivery Date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />
        <Input
          label="Delivery Docket Number"
          value={docketNumber}
          onChange={(e) => setDocketNumber(e.target.value)}
          required
        />
      </div>
    </Dialog>
  );
}