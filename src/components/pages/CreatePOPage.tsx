//src/components/pages/CreatePOPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Card, Typography, Input, Button,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  CalculatorIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { createPo } from "../../services/api.service";
import { getAllProducts } from "../../services/product.service";
import { FormAlert } from "../dialogs/FormAlert";
import toast from "react-hot-toast";
import { DatePicker } from "../ui/DatePicker";

// BLOCK 2: Interfaces
interface CreatePoPageProps {
  onBack: () => void;
  onPoCreated: () => void;
}

interface ProductOption {
  productCode: string;
  description: string;
  unitsPerShipper: number;
  pricePerShipper: number;
  hourlyRunRate: number;
  minsPerShipper: number;
}

// BLOCK 3: Searchable Product Select Component
function ProductSearchSelect({
  products,
  selectedProduct,
  onSelect,
  theme,
}: {
  products: ProductOption[];
  selectedProduct: ProductOption | null;
  onSelect: (product: ProductOption | null) => void;
  theme: any;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query) return products;
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.productCode.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }, [products, query]);

  const handleSelect = (product: ProductOption) => {
    onSelect(product);
    setQuery(product.productCode);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Product Code *
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className={`h-5 w-5 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onSelect(null);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search by product code or description..."
          className={`w-full pl-10 pr-20 py-3 rounded-lg border-2 text-sm font-medium transition-colors
            ${theme.isDark
              ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-500 focus:border-blue-500'
              : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          {selectedProduct && (
            <button
              onClick={handleClear}
              className={`p-1 rounded-full transition-colors ${theme.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              <XMarkIcon className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <ChevronUpDownIcon className={`h-5 w-5 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Selected product indicator */}
      {selectedProduct && (
        <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm
          ${theme.isDark ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold">{selectedProduct.productCode}</span>
          <span className="opacity-70">— {selectedProduct.description}</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border-2 shadow-xl
          ${theme.isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
          {filteredProducts.length === 0 ? (
            <div className={`p-4 text-center text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No products found matching "{query}"
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.productCode}
                onClick={() => handleSelect(product)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors border-b last:border-b-0
                  ${theme.isDark
                    ? 'border-slate-700 hover:bg-slate-700'
                    : 'border-slate-100 hover:bg-blue-50'
                  }
                  ${selectedProduct?.productCode === product.productCode
                    ? (theme.isDark ? 'bg-blue-900/30' : 'bg-blue-50')
                    : ''
                  }`}
              >
                <div>
                  <span className={`font-bold text-sm ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {product.productCode}
                  </span>
                  <span className={`ml-3 text-sm ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {product.description}
                  </span>
                </div>
                <span className={`text-xs font-mono ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  ${product.pricePerShipper?.toFixed(2)}/shipper
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// BLOCK 4: Section Header Component
function SectionHeader({ icon, title, theme }: { icon: React.ReactNode; title: string; theme: any }) {
  return (
    <div className={`flex items-center gap-3 pb-3 mb-4 border-b-2 ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
        {icon}
      </div>
      <h3 className={`text-base font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
        {title}
      </h3>
    </div>
  );
}

// BLOCK 5: Form Field Component
function FormField({
  label,
  required,
  children,
  theme,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  theme: any;
}) {
  return (
    <div>
      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${theme.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// BLOCK 6: Calculation Row Component
function CalcRow({
  label,
  value,
  highlight,
  warning,
  theme,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
  theme: any;
}) {
  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-lg mb-2
      ${warning
        ? (theme.isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200')
        : highlight
          ? (theme.isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200')
          : (theme.isDark ? 'bg-slate-800/50' : 'bg-slate-50')
      }`}
    >
      <span className={`text-sm font-medium ${
        warning
          ? (theme.isDark ? 'text-red-400' : 'text-red-700')
          : theme.isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {label}
      </span>
      <span className={`text-sm font-bold ${
        warning
          ? (theme.isDark ? 'text-red-400' : 'text-red-700')
          : highlight
            ? (theme.isDark ? 'text-blue-400' : 'text-blue-700')
            : (theme.isDark ? 'text-slate-200' : 'text-slate-800')
      }`}>
        {value}
      </span>
    </div>
  );
}

// BLOCK 7: Input Style Helper
function getInputClassName(theme: any): string {
  return `w-full py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors
    ${theme.isDark
      ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-500 focus:border-blue-500'
      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500/20`;
}

// BLOCK 8: Main CreatePoPage Component
export function CreatePoPage({ onBack, onPoCreated }: CreatePoPageProps) {
  const { theme } = useTheme();

  // Products data
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [poNumber, setPoNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [poCreatedDate, setPoCreatedDate] = useState("");
  const [poReceivedDate, setPoReceivedDate] = useState("");
  const [orderedQtyPieces, setOrderedQtyPieces] = useState<string>("");
  const [customerAmount, setCustomerAmount] = useState<string>("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // BLOCK 9: Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await getAllProducts();
        const mapped: ProductOption[] = (data || []).map((p: any) => ({
          productCode: p.productCode || p.product_code,
          description: p.description || "",
          unitsPerShipper: p.unitsPerShipper || p.units_per_shipper || 0,
          pricePerShipper: p.pricePerShipper || p.price_per_shipper || 0,
          hourlyRunRate: p.hourlyRunRate || p.hourly_run_rate || 0,
          minsPerShipper: p.minsPerShipper || p.mins_per_shipper || 0,
        }));
        setProducts(mapped);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // BLOCK 10: Live Calculations
  const calculations = useMemo(() => {
    const pieces = Number(orderedQtyPieces) || 0;
    const custAmount = Number(customerAmount) || 0;
    const unitsPerShipper = selectedProduct?.unitsPerShipper || 0;
    const pricePerShipper = selectedProduct?.pricePerShipper || 0;
    const hourlyRunRate = selectedProduct?.hourlyRunRate || 0;

    const shipperQty = unitsPerShipper > 0 ? pieces / unitsPerShipper : 0;
    const systemAmount = shipperQty * pricePerShipper;
    const amountDifference = Math.abs(custAmount - systemAmount);
    const isAmountMismatch = custAmount > 0 && amountDifference > 5;
    const productionHours = hourlyRunRate > 0 ? shipperQty / hourlyRunRate : 0;

    return {
      shipperQty,
      systemAmount,
      amountDifference,
      isAmountMismatch,
      productionHours,
      hasProduct: !!selectedProduct,
      hasPieces: pieces > 0,
      hasAmount: custAmount > 0,
    };
  }, [orderedQtyPieces, customerAmount, selectedProduct]);

  // BLOCK 11: Form Submission
  const handleSubmit = async () => {
    setErrorMessage("");

    // Validation
    if (!poNumber.trim()) { setErrorMessage("PO Number is required."); return; }
    if (!selectedProduct) { setErrorMessage("Please select a product."); return; }
    if (!customerName.trim()) { setErrorMessage("Customer Name is required."); return; }
    if (!poCreatedDate) { setErrorMessage("PO Created Date is required."); return; }
    if (!poReceivedDate) { setErrorMessage("PO Received Date is required."); return; }
    if (!orderedQtyPieces || Number(orderedQtyPieces) <= 0) { setErrorMessage("Ordered Quantity must be greater than 0."); return; }
    if (!customerAmount || Number(customerAmount) <= 0) { setErrorMessage("Customer Amount must be greater than 0."); return; }

    // Date validation
    if (new Date(poCreatedDate) > new Date(poReceivedDate)) {
      setErrorMessage("PO Created Date cannot be after PO Received Date.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPo({
        poNumber: poNumber.trim(),
        productCode: selectedProduct.productCode,
        customerName: customerName.trim(),
        poCreatedDate,
        poReceivedDate,
        orderedQtyPieces: Number(orderedQtyPieces),
        customerAmount: Number(customerAmount),
      });

      toast.success("Purchase Order created successfully!");
      onPoCreated();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // BLOCK 12: Loading state
  if (loadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <svg className="animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600" />
          <path d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-gray-100" />
        </svg>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Loading product data...</p>
      </div>
    );
  }

  // BLOCK 13: Main Render
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Form Fields (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Order Information */}
          <Card className={`${theme.cards} shadow-sm p-6`}>
            <SectionHeader
              icon={<DocumentTextIcon className="h-5 w-5" />}
              title="Order Information"
              theme={theme}
            />
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="PO Number" required theme={theme}>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="Enter PO number..."
                    className={getInputClassName(theme)}
                  />
                </FormField>
                <FormField label="Customer Name" required theme={theme}>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name..."
                    className={getInputClassName(theme)}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DatePicker
                  label="PO Created Date"
                  value={poCreatedDate}
                  onChange={setPoCreatedDate}
                  required
                  theme={theme}
                />
                <DatePicker
                  label="PO Received Date"
                  value={poReceivedDate}
                  onChange={setPoReceivedDate}
                  required
                  theme={theme}
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Product Selection */}
          <Card className={`${theme.cards} shadow-sm p-6`}>
            <SectionHeader
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              title="Product Selection"
              theme={theme}
            />
            <ProductSearchSelect
              products={products}
              selectedProduct={selectedProduct}
              onSelect={setSelectedProduct}
              theme={theme}
            />

            {/* Product details when selected */}
            {selectedProduct && (
              <div className={`mt-4 grid grid-cols-2 md:grid-cols-4 gap-3`}>
                {[
                  { label: "Units/Shipper", value: selectedProduct.unitsPerShipper.toString() },
                  { label: "Price/Shipper", value: `$${selectedProduct.pricePerShipper.toFixed(2)}` },
                  { label: "Hourly Rate", value: `${selectedProduct.hourlyRunRate} pcs/hr` },
                  { label: "Mins/Shipper", value: `${selectedProduct.minsPerShipper} min` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`p-3 rounded-lg border ${theme.isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <p className={`text-xs font-bold uppercase tracking-wider ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm font-bold mt-1 ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Section 3: Quantities & Amount */}
          <Card className={`${theme.cards} shadow-sm p-6`}>
            <SectionHeader
              icon={<CalculatorIcon className="h-5 w-5" />}
              title="Quantities & Amount"
              theme={theme}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Ordered Quantity (Pieces)" required theme={theme}>
                <input
                  type="number"
                  value={orderedQtyPieces}
                  onChange={(e) => setOrderedQtyPieces(e.target.value)}
                  placeholder="Enter quantity in pieces..."
                  min="0"
                  className={getInputClassName(theme)}
                />
              </FormField>
              <FormField label="Customer Amount ($)" required theme={theme}>
                <input
                  type="number"
                  value={customerAmount}
                  onChange={(e) => setCustomerAmount(e.target.value)}
                  placeholder="Enter customer amount..."
                  min="0"
                  step="0.01"
                  className={getInputClassName(theme)}
                />
              </FormField>
            </div>
          </Card>

          {/* Error Message */}
          {errorMessage && (
            <FormAlert
              type="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Button
              variant="text"
              color="red"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              color="green"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="px-8"
            >
              Submit Purchase Order
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN — Live Calculations (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className={`${theme.cards} shadow-sm p-6`}>
              <SectionHeader
                icon={<CalculatorIcon className="h-5 w-5" />}
                title="Live Calculations"
                theme={theme}
              />

              {!calculations.hasProduct ? (
                <div className={`text-center py-8 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <CalculatorIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Select a product to see calculations</p>
                </div>
              ) : !calculations.hasPieces ? (
                <div className={`text-center py-8 ${theme.isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <CalculatorIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Enter quantity to see calculations</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <CalcRow
                    label="Shipper Quantity"
                    value={calculations.shipperQty.toFixed(2)}
                    theme={theme}
                  />
                  <CalcRow
                    label="System Amount"
                    value={`$${calculations.systemAmount.toFixed(2)}`}
                    highlight
                    theme={theme}
                  />
                  <CalcRow
                    label="Production Time"
                    value={`${calculations.productionHours.toFixed(2)} hrs`}
                    theme={theme}
                  />

                  {calculations.hasAmount && (
                    <>
                      <div className={`my-3 border-t ${theme.isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                      
                      <CalcRow
                        label="Customer Amount"
                        value={`$${Number(customerAmount).toFixed(2)}`}
                        theme={theme}
                      />
                      <CalcRow
                        label="Amount Difference"
                        value={`$${calculations.amountDifference.toFixed(2)}`}
                        warning={calculations.isAmountMismatch}
                        theme={theme}
                      />

                      {calculations.isAmountMismatch ? (
                        <div className={`flex items-start gap-2 mt-3 p-3 rounded-lg
                          ${theme.isDark ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                          <ExclamationTriangleIcon className={`h-5 w-5 flex-shrink-0 ${theme.isDark ? 'text-red-400' : 'text-red-600'}`} />
                          <p className={`text-xs font-medium ${theme.isDark ? 'text-red-400' : 'text-red-700'}`}>
                            Amount difference exceeds $5.00. This PO will be flagged with "PO Check" status for review.
                          </p>
                        </div>
                      ) : (
                        <div className={`flex items-start gap-2 mt-3 p-3 rounded-lg
                          ${theme.isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                          <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${theme.isDark ? 'text-green-400' : 'text-green-600'}`} />
                          <p className={`text-xs font-medium ${theme.isDark ? 'text-green-400' : 'text-green-700'}`}>
                            Amounts match within acceptable range.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>

            {/* Product Info Card */}
            {selectedProduct && (
              <Card className={`${theme.cards} shadow-sm p-6 mt-6`}>
                <h4 className={`text-sm font-bold mb-3 ${theme.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Selected Product
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={theme.isDark ? 'text-slate-400' : 'text-slate-500'}>Code</span>
                    <span className={`font-bold ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedProduct.productCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme.isDark ? 'text-slate-400' : 'text-slate-500'}>Description</span>
                    <span className={`font-medium text-right max-w-[60%] ${theme.isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedProduct.description}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}