// src/features/import/types/import.types.ts

// ============== BLOCK 1: Import Types ==============

export interface ImportRow {
  po_number: string;
  product_code: string;
  customer_name: string;
  ordered_qty_pieces: number;
  customer_amount: number;
  po_created_date: string;
  po_received_date: string;
  delivery_date?: string;
  delivery_number?: string;
  status?: string;
}

export interface ValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingProducts: string[];
  duplicatePOs: string[];
  errors: { row: number; po_number: string; errors: string[] }[];
}

export interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  errors: { row: number; po_number: string; error: string }[];
}

export interface ImportTemplate {
  headers: string[];
  sampleRow: Record<string, any>;
  statusOptions: string[];
  notes: string[];
}   