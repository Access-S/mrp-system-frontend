// src/services/import.service.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ============== BLOCK 1: Interfaces ==============
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


// ============== BLOCK 2: API Functions ==============


export const getImportTemplate = async (): Promise<ImportTemplate> => {
  const response = await fetch(`${API_BASE_URL}/import/template`);
  if (!response.ok) {
    throw new Error('Failed to fetch import template');
  }
  const result = await response.json();
  return result.data;
};

export const validateImportData = async (data: ImportRow[]): Promise<ValidationResult> => {
  const response = await fetch(`${API_BASE_URL}/import/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Validation failed');
  }
  
  const result = await response.json();
  return result.data;
};

export const importPurchaseOrders = async (
  data: ImportRow[], 
  skipInvalid: boolean = true
): Promise<ImportResult> => {
  const response = await fetch(`${API_BASE_URL}/import/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, skipInvalid })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Import failed');
  }
  
  const result = await response.json();
  return result.data;
};


// ============== BLOCK 3: CSV Parser ==============


export const parseCSV = (csvText: string): ImportRow[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }

  // Parse header
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  // Map common header variations
  const headerMap: Record<string, string> = {
    'po_number': 'po_number',
    'ponumber': 'po_number',
    'po': 'po_number',
    'product_code': 'product_code',
    'productcode': 'product_code',
    'sku': 'product_code',
    'customer_name': 'customer_name',
    'customername': 'customer_name',
    'customer': 'customer_name',
    'ordered_qty_pieces': 'ordered_qty_pieces',
    'orderedqtypieces': 'ordered_qty_pieces',
    'qty': 'ordered_qty_pieces',
    'quantity': 'ordered_qty_pieces',
    'pieces': 'ordered_qty_pieces',
    'customer_amount': 'customer_amount',
    'customeramount': 'customer_amount',
    'amount': 'customer_amount',
    'price': 'customer_amount',
    'po_created_date': 'po_created_date',
    'pocreateddate': 'po_created_date',
    'created_date': 'po_created_date',
    'po_received_date': 'po_received_date',
    'poreceiveddate': 'po_received_date',
    'received_date': 'po_received_date',
    'delivery_date': 'delivery_date',
    'deliverydate': 'delivery_date',
    'delivery_number': 'delivery_number',
    'deliverynumber': 'delivery_number',
    'docket': 'delivery_number',
    'status': 'status'
  };

  const normalizedHeaders = headers.map(h => headerMap[h] || h);

  // Parse data rows
  const data: ImportRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = parseCSVLine(line);
    const row: any = {};
    
    normalizedHeaders.forEach((header, index) => {
      let value = values[index]?.trim() || '';
      
      // Clean up values
      if (header === 'customer_amount') {
        // Remove $ and commas
        value = value.replace(/[$,]/g, '');
      }
      
      if (header === 'ordered_qty_pieces') {
        // Remove commas
        value = value.replace(/,/g, '');
      }
      
      row[header] = value;
    });
    
    // Convert numeric fields
    row.ordered_qty_pieces = Number(row.ordered_qty_pieces) || 0;
    row.customer_amount = Number(row.customer_amount) || 0;
    
    data.push(row as ImportRow);
  }
  
  return data;
};

// Helper to parse CSV line (handles quoted values)
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if ((char === ',' || char === '\t') && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};


// ============== BLOCK 4: TSV Parser (Tab-separated - from Excel copy/paste) ==============


export const parseTSV = (tsvText: string): ImportRow[] => {
  // Convert TSV to CSV format and use CSV parser
  const csvText = tsvText.split('\n').map(line => {
    return line.split('\t').map(cell => {
      // Wrap in quotes if contains comma
      if (cell.includes(',')) {
        return `"${cell}"`;
      }
      return cell;
    }).join(',');
  }).join('\n');
  
  return parseCSV(csvText);
};