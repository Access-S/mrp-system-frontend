// src/services/export.service.ts

// ============== BLOCK 1: Imports ==============

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

// ============== BLOCK 2: Types & Interfaces ==============

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  orientation?: "portrait" | "landscape";
  dateGenerated?: boolean;
}

export type ExportFormat = "csv" | "excel" | "pdf";

// ============== BLOCK 3: CSV Export ==============

/**
 * Exports data to CSV format
 * @param options - Export configuration options
 */
export const exportToCSV = (options: ExportOptions): void => {
  const { filename, columns, data } = options;

  try {
    // Build header row
    const headers = columns.map((col) => col.header);

    // Build data rows
    const rows = data.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
    );

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const finalFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    saveAs(blob, finalFilename);

    console.log(`✅ CSV exported: ${finalFilename}`);
  } catch (error) {
    console.error("❌ CSV export failed:", error);
    throw new Error("Failed to export CSV file");
  }
};

// ============== BLOCK 4: Excel Export ==============

/**
 * Exports data to Excel format (.xlsx)
 * @param options - Export configuration options
 */
export const exportToExcel = (options: ExportOptions): void => {
  const { filename, title, subtitle, columns, data, dateGenerated = true } = options;

  try {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare data with headers
    const headers = columns.map((col) => col.header);
    const rows = data.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        return value !== null && value !== undefined ? value : "";
      })
    );

    // Build worksheet data
    const worksheetData: any[][] = [];

    // Add title if provided
    if (title) {
      worksheetData.push([title]);
      worksheetData.push([]); // Empty row
    }

    // Add subtitle if provided
    if (subtitle) {
      worksheetData.push([subtitle]);
      worksheetData.push([]); // Empty row
    }

    // Add generation date if enabled
    if (dateGenerated) {
      worksheetData.push([`Generated: ${new Date().toLocaleString()}`]);
      worksheetData.push([]); // Empty row
    }

    // Add headers and data
    worksheetData.push(headers);
    worksheetData.push(...rows);

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const columnWidths = columns.map((col) => ({
      wch: col.width || Math.max(col.header.length, 12),
    }));
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    const sheetName = title ? title.substring(0, 31) : "Data"; // Excel sheet name limit is 31 chars
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const finalFilename = filename.endsWith(".xlsx")
      ? filename
      : `${filename}.xlsx`;
    saveAs(blob, finalFilename);

    console.log(`✅ Excel exported: ${finalFilename}`);
  } catch (error) {
    console.error("❌ Excel export failed:", error);
    throw new Error("Failed to export Excel file");
  }
};

// ============== BLOCK 5: PDF Export ==============

/**
 * Exports data to PDF format (landscape by default for tables)
 * @param options - Export configuration options
 */
export const exportToPDF = (options: ExportOptions): void => {
  const {
    filename,
    title,
    subtitle,
    columns,
    data,
    orientation = "landscape",
    dateGenerated = true,
  } = options;

  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = { top: 10, right: 14, bottom: 10, left: 14 };
    const usableWidth = pageWidth - margins.left - margins.right;
    let yPosition = 15;

    // Add title if provided
    if (title) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(title, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 8;
    }

    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(subtitle, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 6;
    }

    // Add generation date if enabled
    if (dateGenerated) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(130);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 10;
    }

    // Reset text color
    doc.setTextColor(0);

    // Prepare table data
    const headers = columns.map((col) => col.header);
    const rows = data.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        return value !== null && value !== undefined ? String(value) : "-";
      })
    );

    // Calculate proportional column widths based on defined widths
    const totalDefinedWidth = columns.reduce((sum, col) => sum + (col.width || 15), 0);
    const columnStyles = columns.reduce((acc, col, index) => {
      const proportionalWidth = ((col.width || 15) / totalDefinedWidth) * usableWidth;
      acc[index] = {
        cellWidth: proportionalWidth,
        halign: index <= 1 ? "left" : "center", // First 2 columns left-aligned, rest centered
      };
      return acc;
    }, {} as Record<number, any>);

    // Generate table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: yPosition,
      theme: "grid",
      tableWidth: usableWidth,
      headStyles: {
        fillColor: [55, 65, 81], // gray-700
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // gray-50
      },
      columnStyles: columnStyles,
      margin: margins,
      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 7,
          { align: "center" }
        );
      },
    });

    // Save PDF
    const finalFilename = filename.endsWith(".pdf")
      ? filename
      : `${filename}.pdf`;
    doc.save(finalFilename);

    console.log(`✅ PDF exported: ${finalFilename}`);
  } catch (error) {
    console.error("❌ PDF export failed:", error);
    throw new Error("Failed to export PDF file");
  }
};

// ============== BLOCK 6: Universal Export Function ==============

/**
 * Universal export function that handles all formats
 * @param format - Export format (csv, excel, pdf)
 * @param options - Export configuration options
 */
export const exportData = (format: ExportFormat, options: ExportOptions): void => {
  switch (format) {
    case "csv":
      exportToCSV(options);
      break;
    case "excel":
      exportToExcel(options);
      break;
    case "pdf":
      exportToPDF(options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// ============== BLOCK 7: Forecast-Specific Export Helper ==============

export interface ForecastExportData {
  productCode: string;
  description: string;
  [weekKey: string]: string | number; // Dynamic week columns
}

/**
 * Prepares forecast data for export with proper column formatting
 * @param data - Raw forecast data
 * @param weekColumns - Array of week column keys and labels
 * @param filename - Base filename (without extension)
 * @param format - Export format
 */
export const exportForecastData = (
  data: ForecastExportData[],
  weekColumns: { key: string; label: string }[],
  filename: string,
  format: ExportFormat
): void => {
  // Build columns configuration
  const columns: ExportColumn[] = [
    { key: "productCode", header: "Product Code", width: 15 },
    { key: "description", header: "Description", width: 30 },
    ...weekColumns.map((week) => ({
      key: week.key,
      header: week.label,
      width: 12,
    })),
  ];

  // Add total column
  columns.push({ key: "total", header: "Total", width: 12 });

  // Calculate totals for each row
  const dataWithTotals = data.map((row) => {
    const total = weekColumns.reduce((sum, week) => {
      const value = row[week.key];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
    return { ...row, total };
  });

  // Export with appropriate options
  exportData(format, {
    filename,
    title: "Sales Forecast Report",
    subtitle: `Forecast data for ${weekColumns.length} weeks`,
    columns,
    data: dataWithTotals,
    orientation: "landscape",
    dateGenerated: true,
  });
};

// ============== BLOCK 8: Export Service Class (Optional OOP Interface) ==============

class ExportService {
  exportCSV = exportToCSV;
  exportExcel = exportToExcel;
  exportPDF = exportToPDF;
  export = exportData;
  exportForecast = exportForecastData;
}

export const exportService = new ExportService();
export default exportService;