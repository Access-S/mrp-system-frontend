import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Input } from './Input';
import { StatusBadge } from './StatusBadge';

interface Product {
  name: string;
  quantity: number;
  status: string;
}

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [status, setStatus] = useState('Open');

  const handleSave = () => {
    if (!name || quantity === '') {
      alert('Please fill all fields');
      return;
    }
    onSave({ name, quantity: Number(quantity), status });
    setName('');
    setQuantity('');
    setStatus('Open');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create Product"
      footer={
        <>
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary">Save</Button>
        </>
      }
      size="md"
    >
      <div className="space-y-4">
        <Input
          label="Product Name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Quantity"
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <div>
          <label className="text-sm font-semibold mb-1 block">Status</label>
          <StatusBadge status={status} theme={{ isDark: false }} />
          <select
            className="ml-2 p-1 rounded border border-gray-300 dark:border-gray-600"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Open</option>
            <option>Completed</option>
            <option>Despatched/ Completed</option>
            <option>PO Check</option>
            <option>PO Canceled</option>
            <option>Closed</option>
          </select>
        </div>
      </div>
    </Dialog>
  );
};