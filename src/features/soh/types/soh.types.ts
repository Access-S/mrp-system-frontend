// src/features/soh/types/soh.types.ts

// ============== BLOCK 1: SOH Types ==============

export interface SohRecord {
  id: string;
  part_code: string;
  description: string;
  stock_on_hand: number;
  stock_value: number;
  import_batch_id: string;
  import_source: string;
  created_at: string;
  is_active: boolean;
}

export interface SohSummary {
  totalRecords: number;
  totalStock: number;
  totalStockValue: number;
  zeroStockCount: number;
}

export interface SohImportResult {
  success: boolean;
  message: string;
  data: {
    imported: number;
    skipped: number;
    archived: number;
    import_batch_id: string;
    detected_columns: {
      part_code: string | null;
      description: string | null;
      stock_on_hand: string | null;
    };
  };
}

export interface SohTableData {
  summary: SohSummary;
  records: SohRecord[];
}