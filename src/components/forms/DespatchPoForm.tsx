// src/components/forms/DespatchPoForm.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";

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
    <Dialog open={open} handler={handleOpen} size="sm">
      <DialogHeader>Confirm Despatch Details</DialogHeader>
      <DialogBody divider className="flex flex-col gap-6">
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
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          Cancel
        </Button>
        <Button variant="gradient" color="green" onClick={handleSubmit}>
          Confirm Despatch
        </Button>
      </DialogFooter>
    </Dialog>
  );
}