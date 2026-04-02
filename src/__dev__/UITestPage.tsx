// dev/UITestPage.tsx 

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";

// ✅ Use @/ alias for all src/ references
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { StatusBadge, Status } from "@/components/ui/StatusBadge";
import { WidgetCard, WidgetHeader, WidgetBody, WidgetFooter, MiniActionButton } from "@/components/ui/WidgetCard";
import { Table } from "@/components/ui/Table";
import { Select, SelectOption } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { Skeleton, SkeletonTableRow, SkeletonCard, SkeletonAvatar, SkeletonButton } from "@/components/ui/Skeleton";
import { Spinner, SpinnerPage } from "@/components/ui/Spinner";
import { EmptyState, EmptySearchState, EmptyProductState, ErrorState } from "@/components/ui/EmptyState";
import { Menu } from "@/components/ui/Menu";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { DatePicker } from "@/components/ui/DatePicker";

// ✅ Heroicons are npm packages - no change needed
import {
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  EllipsisVerticalIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon,
  CubeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// ============== BLOCK 2: Sample Data ==============

const sampleTableData = [
  { id: 1, name: "Widget Pro X1", sku: "WPX-001", stock: 150, price: "$299.00", status: "In Stock" },
  { id: 2, name: "Gadget Elite", sku: "GDE-042", stock: 23, price: "$149.00", status: "Low Stock" },
  { id: 3, name: "Component Alpha", sku: "CPA-118", stock: 0, price: "$49.00", status: "Out of Stock" },
  { id: 4, name: "Module Beta Plus", sku: "MBP-205", stock: 89, price: "$199.00", status: "In Stock" },
  { id: 5, name: "Assembly Kit Pro", sku: "AKP-331", stock: 12, price: "$599.00", status: "Low Stock" },
  { id: 6, name: "Connector Series Z", sku: "CSZ-087", stock: 200, price: "$29.00", status: "In Stock" },
];

const allStatuses: Status[] = [
  "Open",
  "Completed",
  "Despatched/ Completed",
  "PO Check",
  "PO Canceled",
  "Closed",
];

// Sample options for Select component
const categoryOptions: SelectOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverages" },
  { value: "other", label: "Other" },
];

const statusOptions: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending Review" },
  { value: "archived", label: "Archived", disabled: true },
];

const supplierOptions: SelectOption[] = [
  { value: "acme", label: "Acme Corporation" },
  { value: "globex", label: "Globex Industries" },
  { value: "initech", label: "Initech Solutions" },
  { value: "umbrella", label: "Umbrella Corp" },
  { value: "wayne", label: "Wayne Enterprises" },
];

// ============== BLOCK 3: Component Definition & State ==============

const UITestPage: React.FC = () => {
  const { theme, themeName, setThemeName } = useTheme();
  const { toast, setPosition } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogWithFooterOpen, setIsDialogWithFooterOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  // Select states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectError, setSelectError] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState("products");

  // DatePicker state
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Tab options
  const tabOptions = [
    { label: "Products", value: "products", icon: <CubeIcon className="w-4 h-4" /> },
    { label: "Orders", value: "orders", icon: <ShoppingCartIcon className="w-4 h-4" /> },
    { label: "Analytics", value: "analytics", icon: <ChartBarIcon className="w-4 h-4" /> },
    { label: "Reports", value: "reports", icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
  ];

  const simpleTabOptions = [
    { label: "Overview", value: "overview" },
    { label: "Details", value: "details" },
    { label: "History", value: "history" },
    { label: "Settings", value: "settings", disabled: true },
  ];

  // ============== BLOCK 4: Helper Function for Stock Status ==============

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 dark:text-green-400";
      case "Low Stock":
        return "text-yellow-600 dark:text-yellow-400";
      case "Out of Stock":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // ============== BLOCK 5: Return Statement Start + Page Header ==============

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${theme.text}`}>UI Component Test Page</h1>
          <p className={`${theme.text} opacity-60 mt-1`}>
            Testing all custom UI components before global rollout
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme.text} opacity-60`}>Theme:</span>
          <select
            value={themeName}
            onChange={(e) => setThemeName(e.target.value as "classic" | "sunset" | "dark")}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="classic">Classic Blue</option>
            <option value="sunset">Sunset Orange</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      {/* ============== BLOCK 6: Section 1 - Buttons ============== */}
      
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Buttons</h2>

        {/* Variants */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="black">Black Glossy</Button>
          </div>
        </div>

        {/* States */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>States</h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button loading variant="secondary">Loading Secondary</Button>
            <Button loading variant="black">Loading Black</Button>
          </div>
        </div>

        {/* With Icons */}
        <div>
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Icons</h3>
          <div className="flex flex-wrap gap-3">
            <Button leftIcon={<PlusIcon className="w-4 h-4" />}>Add Item</Button>
            <Button rightIcon={<ArrowPathIcon className="w-4 h-4" />} variant="secondary">
              Refresh
            </Button>
            <Button
              leftIcon={<EyeIcon className="w-4 h-4" />}
              variant="black"
            >
              View Details
            </Button>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 7: Section 2 - Inputs ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Inputs</h2>

        <div className="space-y-8">
          {/* Basic Inputs */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Basic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Basic Input"
                placeholder="Enter some text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="With Helper Text"
                placeholder="Enter your email"
                helperText="We'll never share your email with anyone."
              />
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Icons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Left Icon"
                placeholder="Search..."
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
              />
              <Input
                label="Right Icon"
                placeholder="Enter email"
                rightIcon={<EnvelopeIcon className="w-5 h-5" />}
              />
              <Input
                label="Both Icons"
                placeholder="Search products..."
                leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                rightIcon={<CubeIcon className="w-5 h-5" />}
              />
              <Input
                label="Calendar Input"
                placeholder="Select date..."
                leftIcon={<CalendarIcon className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Small"
                size="sm"
                placeholder="Small input"
              />
              <Input
                label="Medium (Default)"
                size="md"
                placeholder="Medium input"
              />
              <Input
                label="Large"
                size="lg"
                placeholder="Large input"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Default Variant"
                variant="default"
                placeholder="Default styling"
              />
              <Input
                label="Filled Variant"
                variant="filled"
                placeholder="Filled styling"
              />
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Error State"
                placeholder="Required field"
                error={true}
                helperText="This field is required"
              />
              <div>
                <Input
                  label="Interactive Error Toggle"
                  placeholder="Click button to toggle error"
                  error={inputError}
                  helperText={inputError ? "This field has an error!" : "Click below to simulate error"}
                />
                <Button
                  size="sm"
                  variant={inputError ? "danger" : "secondary"}
                  onClick={() => setInputError(!inputError)}
                  className="mt-2"
                >
                  {inputError ? "Clear Error" : "Trigger Error"}
                </Button>
              </div>
              <Input
                label="Disabled Input"
                placeholder="You can't edit this"
                disabled
                value="Disabled value"
              />
              <Input
                label="Password Input"
                type="password"
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 7.5: Section 2.5 - Select/Dropdown ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Select / Dropdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Select */}
          <Select
            label="Category"
            options={categoryOptions}
            placeholder="Select a category"
            value={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* With Helper Text */}
          <Select
            label="Status"
            options={statusOptions}
            placeholder="Select status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            helperText="Archived items cannot be selected"
          />

          {/* With Left Icon */}
          <Select
            label="Supplier"
            options={supplierOptions}
            placeholder="Choose supplier"
            value={selectedSupplier}
            onChange={setSelectedSupplier}
            leftIcon={<TagIcon className="w-5 h-5" />}
          />

          {/* Filled Variant */}
          <Select
            label="Filled Variant"
            variant="filled"
            options={categoryOptions}
            placeholder="Select category"
          />

          {/* Error State */}
          <div>
            <Select
              label="With Error"
              options={categoryOptions}
              placeholder="Select category"
              error={selectError}
              helperText={selectError ? "This field is required" : "Click button to toggle error"}
            />
            <Button
              size="sm"
              variant={selectError ? "danger" : "secondary"}
              onClick={() => setSelectError(!selectError)}
              className="mt-2"
            >
              {selectError ? "Clear Error" : "Trigger Error"}
            </Button>
          </div>

          {/* Disabled State */}
          <Select
            label="Disabled"
            options={categoryOptions}
            placeholder="Cannot select"
            disabled
          />

          {/* Loading State */}
          <Select
            label="Loading"
            options={categoryOptions}
            placeholder="Loading options..."
            loading
          />

          {/* Size Small */}
          <Select
            label="Small Size"
            size="sm"
            options={categoryOptions}
            placeholder="Small select"
          />

          {/* Size Large */}
          <Select
            label="Large Size"
            size="lg"
            options={categoryOptions}
            placeholder="Large select"
          />
        </div>
      </section>

            {/* ============== BLOCK 7.6: Section 2.6 - Toast/Notifications ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Toast / Notifications</h2>

        <div className="space-y-6">
          {/* Toast Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => toast.success("Product saved successfully!")}
              >
                Success Toast
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error("Failed to create purchase order")}
              >
                Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.warning("Stock is running low")}
              >
                Warning Toast
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.info("Importing data in progress...")}
              >
                Info Toast
              </Button>
            </div>
          </div>

          {/* Custom Duration */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Custom Duration</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => toast.success("Quick toast (2s)", 2000)}
              >
                2 Second Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.info("Long toast (10s)", 10000)}
              >
                10 Second Toast
              </Button>
            </div>
          </div>

          {/* Stacking Demo */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Stacking</h3>
            <Button
              variant="black"
              onClick={() => {
                toast.success("First notification");
                setTimeout(() => toast.info("Second notification"), 300);
                setTimeout(() => toast.warning("Third notification"), 600);
                setTimeout(() => toast.error("Fourth notification"), 900);
              }}
            >
              Show Multiple Toasts
            </Button>
          </div>

          {/* Position Control */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Position</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("top-right");
                  toast.info("Position: Top Right");
                }}
              >
                Top Right
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("top-left");
                  toast.info("Position: Top Left");
                }}
              >
                Top Left
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("top-center");
                  toast.info("Position: Top Center");
                }}
              >
                Top Center
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("bottom-right");
                  toast.info("Position: Bottom Right");
                }}
              >
                Bottom Right
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("bottom-left");
                  toast.info("Position: Bottom Left");
                }}
              >
                Bottom Left
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setPosition("bottom-center");
                  toast.info("Position: Bottom Center");
                }}
              >
                Bottom Center
              </Button>
            </div>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.7: Section 2.7 - Skeleton Loaders ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Skeleton Loaders</h2>

        <div className="space-y-8">
          {/* Text Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Text Variants</h3>
            <div className="space-y-4 max-w-md">
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" lines={3} />
            </div>
          </div>

          {/* Shape Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Shape Variants</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="text-center">
                <SkeletonAvatar size={48} />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Avatar</p>
              </div>
              <div className="text-center">
                <Skeleton variant="rectangular" width={100} height={60} />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Rectangular</p>
              </div>
              <div className="text-center">
                <Skeleton variant="rounded" width={100} height={60} />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Rounded</p>
              </div>
              <div className="text-center">
                <SkeletonButton width={120} />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Button</p>
              </div>
            </div>
          </div>

          {/* Animation Types */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Animation Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Pulse (Default)</p>
                <Skeleton variant="rounded" height={60} animation="pulse" />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Shimmer</p>
                <Skeleton variant="rounded" height={60} animation="shimmer" />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>None</p>
                <Skeleton variant="rounded" height={60} animation="none" />
              </div>
            </div>
          </div>

          {/* Card Skeleton */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Card Skeleton</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>

          {/* Table Skeleton */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Table Skeleton</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                  <SkeletonTableRow columns={5} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.8: Section 2.8 - Spinners ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Spinners</h2>

        <div className="space-y-8">
          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <Spinner size="xs" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>XS</p>
              </div>
              <div className="text-center">
                <Spinner size="sm" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>SM</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>MD</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>LG</p>
              </div>
              <div className="text-center">
                <Spinner size="xl" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>XL</p>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <Spinner variant="primary" size="md" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Primary</p>
              </div>
              <div className="text-center">
                <Spinner variant="secondary" size="md" />
                <p className={`text-xs ${theme.text} opacity-50 mt-2`}>Secondary</p>
              </div>
              <div className="text-center p-3 bg-gray-800 rounded-lg">
                <Spinner variant="white" size="md" />
                <p className="text-xs text-white opacity-50 mt-2">White</p>
              </div>
              <div className="text-center text-green-500">
                <Spinner variant="current" size="md" />
                <p className={`text-xs opacity-50 mt-2`}>Current</p>
              </div>
            </div>
          </div>

          {/* With Label */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Label</h3>
            <div className="flex flex-wrap items-start gap-8">
              <Spinner size="sm" showLabel label="Loading..." />
              <Spinner size="md" showLabel label="Please wait..." />
              <Spinner size="lg" showLabel label="Fetching data..." />
            </div>
          </div>

          {/* Page Loading */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Page Loading</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <SpinnerPage label="Loading content..." />
            </div>
          </div>

          {/* In Buttons */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>In Buttons (Compare)</h3>
            <div className="flex flex-wrap gap-3">
              <Button loading>Button Loading</Button>
              <Button variant="secondary">
                <Spinner size="xs" variant="current" />
                <span>Custom Spinner</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.9: Section 2.9 - Empty States ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Empty States</h2>

        <div className="space-y-8">
          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState variant="default" size="sm" />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState variant="search" size="sm" />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState variant="product" size="sm" />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState variant="error" size="sm" />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState size="sm" title="Small" description="Compact empty state for tight spaces." />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState size="md" title="Medium" description="Default size for most use cases." />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyState size="lg" title="Large" description="Full page empty state for main content areas." />
              </div>
            </div>
          </div>

          {/* With Actions */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <EmptyProductState
                  action={
                    <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
                      Add Product
                    </Button>
                  }
                />
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <ErrorState
                  title="Failed to load data"
                  description="Something went wrong while fetching the data."
                  action={
                    <Button variant="secondary" leftIcon={<ArrowPathIcon className="w-4 h-4" />}>
                      Try Again
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Search Empty State */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Search Results</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <EmptySearchState
                query="xyz123"
                action={
                  <Button variant="ghost" size="sm">
                    Clear Search
                  </Button>
                }
              />
            </div>
          </div>

          {/* In Table */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>In Table</h3>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Product Name</Table.Head>
                  <Table.Head>SKU</Table.Head>
                  <Table.Head>Stock</Table.Head>
                  <Table.Head>Price</Table.Head>
                  <Table.Head>Status</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      variant="product"
                      size="sm"
                      title="No products found"
                      description="Try adjusting your filters or add a new product."
                      action={
                        <Button size="sm" leftIcon={<PlusIcon className="w-4 h-4" />}>
                          Add Product
                        </Button>
                      }
                    />
                  </td>
                </tr>
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.10: Section 2.10 - Menu/Dropdown ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Menu / Dropdown</h2>

        <div className="space-y-8">
          {/* Basic Menu */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Basic Menu</h3>
            <div className="flex flex-wrap gap-4">
              <Menu>
                <Menu.Trigger>
                  <Button variant="secondary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                    Options
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item icon={<EyeIcon className="w-4 h-4" />}>View Details</Menu.Item>
                  <Menu.Item icon={<PencilIcon className="w-4 h-4" />}>Edit</Menu.Item>
                  <Menu.Item icon={<DocumentDuplicateIcon className="w-4 h-4" />}>Duplicate</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item icon={<TrashIcon className="w-4 h-4" />} danger>Delete</Menu.Item>
                </Menu.Content>
              </Menu>

              {/* Icon Button Trigger */}
              <Menu>
                <Menu.Trigger>
                  <Button variant="ghost" className="p-2">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </Button>
                </Menu.Trigger>
                <Menu.Content position="bottom-end">
                  <Menu.Item icon={<PencilIcon className="w-4 h-4" />}>Edit</Menu.Item>
                  <Menu.Item icon={<ArchiveBoxIcon className="w-4 h-4" />}>Archive</Menu.Item>
                  <Menu.Item icon={<TrashIcon className="w-4 h-4" />} danger>Delete</Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          </div>

          {/* With Labels & Sections */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Labels & Sections</h3>
            <Menu>
              <Menu.Trigger>
                <Button variant="primary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                  Account
                </Button>
              </Menu.Trigger>
              <Menu.Content minWidth={220}>
                <Menu.Label>My Account</Menu.Label>
                <Menu.Item icon={<UserIcon className="w-4 h-4" />}>Profile</Menu.Item>
                <Menu.Item icon={<Cog6ToothIcon className="w-4 h-4" />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item icon={<PlusIcon className="w-4 h-4" />}>New Project</Menu.Item>
                <Menu.Item icon={<DocumentDuplicateIcon className="w-4 h-4" />}>Import Data</Menu.Item>
                <Menu.Divider />
                <Menu.Item icon={<ArrowRightOnRectangleIcon className="w-4 h-4" />} danger>
                  Sign Out
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="flex flex-wrap gap-4">
              <Menu size="sm">
                <Menu.Trigger>
                  <Button size="sm" variant="secondary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                    Small
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>Option 1</Menu.Item>
                  <Menu.Item>Option 2</Menu.Item>
                  <Menu.Item>Option 3</Menu.Item>
                </Menu.Content>
              </Menu>

              <Menu size="md">
                <Menu.Trigger>
                  <Button variant="secondary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                    Medium
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>Option 1</Menu.Item>
                  <Menu.Item>Option 2</Menu.Item>
                  <Menu.Item>Option 3</Menu.Item>
                </Menu.Content>
              </Menu>

              <Menu size="lg">
                <Menu.Trigger>
                  <Button size="lg" variant="secondary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                    Large
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>Option 1</Menu.Item>
                  <Menu.Item>Option 2</Menu.Item>
                  <Menu.Item>Option 3</Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          </div>

          {/* Positions */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Positions</h3>
            <div className="flex flex-wrap gap-4">
              <Menu>
                <Menu.Trigger>
                  <Button variant="ghost">Bottom Start</Button>
                </Menu.Trigger>
                <Menu.Content position="bottom-start">
                  <Menu.Item>Option 1</Menu.Item>
                  <Menu.Item>Option 2</Menu.Item>
                </Menu.Content>
              </Menu>

              <Menu>
                <Menu.Trigger>
                  <Button variant="ghost">Bottom End</Button>
                </Menu.Trigger>
                <Menu.Content position="bottom-end">
                  <Menu.Item>Option 1</Menu.Item>
                  <Menu.Item>Option 2</Menu.Item>
                </Menu.Content>
              </Menu>
            </div>
          </div>

          {/* Disabled Items */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Disabled Items</h3>
            <Menu>
              <Menu.Trigger>
                <Button variant="secondary" rightIcon={<ChevronDownIcon className="w-4 h-4" />}>
                  Actions
                </Button>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item icon={<EyeIcon className="w-4 h-4" />}>View</Menu.Item>
                <Menu.Item icon={<PencilIcon className="w-4 h-4" />}>Edit</Menu.Item>
                <Menu.Item icon={<DocumentDuplicateIcon className="w-4 h-4" />} disabled>
                  Duplicate (Disabled)
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item icon={<TrashIcon className="w-4 h-4" />} disabled danger>
                  Delete (Disabled)
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </div>

          {/* In Table Row */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>In Table (Action Column)</h3>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Product Name</Table.Head>
                  <Table.Head>SKU</Table.Head>
                  <Table.Head>Stock</Table.Head>
                  <Table.Head className="text-right">Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="font-medium">Widget Pro X1</Table.Cell>
                  <Table.Cell>WPX-001</Table.Cell>
                  <Table.Cell>150</Table.Cell>
                  <Table.Cell className="text-right">
                    <Menu>
                      <Menu.Trigger>
                        <Button variant="ghost" size="sm" className="p-1">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </Button>
                      </Menu.Trigger>
                      <Menu.Content position="bottom-end">
                        <Menu.Item icon={<EyeIcon className="w-4 h-4" />}>View</Menu.Item>
                        <Menu.Item icon={<PencilIcon className="w-4 h-4" />}>Edit</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item icon={<TrashIcon className="w-4 h-4" />} danger>Delete</Menu.Item>
                      </Menu.Content>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="font-medium">Gadget Elite</Table.Cell>
                  <Table.Cell>GDE-042</Table.Cell>
                  <Table.Cell>23</Table.Cell>
                  <Table.Cell className="text-right">
                    <Menu>
                      <Menu.Trigger>
                        <Button variant="ghost" size="sm" className="p-1">
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </Button>
                      </Menu.Trigger>
                      <Menu.Content position="bottom-end">
                        <Menu.Item icon={<EyeIcon className="w-4 h-4" />}>View</Menu.Item>
                        <Menu.Item icon={<PencilIcon className="w-4 h-4" />}>Edit</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item icon={<TrashIcon className="w-4 h-4" />} danger>Delete</Menu.Item>
                      </Menu.Content>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.11: Section 2.11 - Accordion ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Accordion</h2>

        <div className="space-y-8">
          {/* Default Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Default Variant</h3>
            <Accordion defaultExpanded={["item-1"]}>
              <Accordion.Item id="item-1">
                <Accordion.Trigger>What is your return policy?</Accordion.Trigger>
                <Accordion.Content>
                  We offer a 30-day return policy for all unused items in their original packaging. 
                  Simply contact our support team to initiate a return.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="item-2">
                <Accordion.Trigger>How long does shipping take?</Accordion.Trigger>
                <Accordion.Content>
                  Standard shipping takes 5-7 business days. Express shipping is available 
                  for 2-3 business day delivery at an additional cost.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="item-3">
                <Accordion.Trigger>Do you offer international shipping?</Accordion.Trigger>
                <Accordion.Content>
                  Yes, we ship to over 50 countries worldwide. International shipping times 
                  vary by location and typically take 10-15 business days.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Bordered Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Bordered Variant</h3>
            <Accordion variant="bordered">
              <Accordion.Item id="bordered-1">
                <Accordion.Trigger icon={<QuestionMarkCircleIcon className="w-5 h-5" />}>
                  Frequently Asked Questions
                </Accordion.Trigger>
                <Accordion.Content>
                  Find answers to common questions about our products and services.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="bordered-2">
                <Accordion.Trigger icon={<CreditCardIcon className="w-5 h-5" />}>
                  Payment Methods
                </Accordion.Trigger>
                <Accordion.Content>
                  We accept all major credit cards, PayPal, and bank transfers.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="bordered-3">
                <Accordion.Trigger icon={<TruckIcon className="w-5 h-5" />}>
                  Shipping Information
                </Accordion.Trigger>
                <Accordion.Content>
                  Free shipping on orders over $50. Standard delivery in 5-7 business days.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Separated Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Separated Variant</h3>
            <Accordion variant="separated" allowMultiple>
              <Accordion.Item id="sep-1">
                <Accordion.Trigger icon={<ShieldCheckIcon className="w-5 h-5" />}>
                  Security & Privacy
                </Accordion.Trigger>
                <Accordion.Content>
                  Your data is encrypted and securely stored. We never share your 
                  information with third parties without your consent.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="sep-2">
                <Accordion.Trigger icon={<Cog6ToothIcon className="w-5 h-5" />}>
                  Account Settings
                </Accordion.Trigger>
                <Accordion.Content>
                  Manage your profile, notifications, and preferences from your account dashboard.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="sep-3">
                <Accordion.Trigger icon={<UserIcon className="w-5 h-5" />}>
                  User Permissions
                </Accordion.Trigger>
                <Accordion.Content>
                  Control access levels and permissions for team members in your organization.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Small */}
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Small</p>
                <Accordion variant="bordered" size="sm">
                  <Accordion.Item id="sm-1">
                    <Accordion.Trigger>Small Item 1</Accordion.Trigger>
                    <Accordion.Content>Compact content for tight spaces.</Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="sm-2">
                    <Accordion.Trigger>Small Item 2</Accordion.Trigger>
                    <Accordion.Content>More compact content here.</Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>

              {/* Medium */}
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Medium (Default)</p>
                <Accordion variant="bordered" size="md">
                  <Accordion.Item id="md-1">
                    <Accordion.Trigger>Medium Item 1</Accordion.Trigger>
                    <Accordion.Content>Standard content size for most use cases.</Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="md-2">
                    <Accordion.Trigger>Medium Item 2</Accordion.Trigger>
                    <Accordion.Content>More standard content here.</Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>

              {/* Large */}
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Large</p>
                <Accordion variant="bordered" size="lg">
                  <Accordion.Item id="lg-1">
                    <Accordion.Trigger>Large Item 1</Accordion.Trigger>
                    <Accordion.Content>Spacious content for prominent sections.</Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="lg-2">
                    <Accordion.Trigger>Large Item 2</Accordion.Trigger>
                    <Accordion.Content>More spacious content here.</Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Allow Multiple */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Allow Multiple Open</h3>
            <Accordion variant="bordered" allowMultiple defaultExpanded={["multi-1", "multi-2"]}>
              <Accordion.Item id="multi-1">
                <Accordion.Trigger>First Section (Expanded)</Accordion.Trigger>
                <Accordion.Content>
                  This accordion allows multiple items to be open at the same time.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="multi-2">
                <Accordion.Trigger>Second Section (Expanded)</Accordion.Trigger>
                <Accordion.Content>
                  Both this and the first section can be open simultaneously.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="multi-3">
                <Accordion.Trigger>Third Section (Collapsed)</Accordion.Trigger>
                <Accordion.Content>
                  Click to expand this section while keeping others open.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Disabled Items */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Disabled Items</h3>
            <Accordion variant="bordered">
              <Accordion.Item id="dis-1">
                <Accordion.Trigger>Active Item</Accordion.Trigger>
                <Accordion.Content>This item can be expanded and collapsed.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="dis-2" disabled>
                <Accordion.Trigger>Disabled Item</Accordion.Trigger>
                <Accordion.Content>This content cannot be accessed.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="dis-3">
                <Accordion.Trigger>Another Active Item</Accordion.Trigger>
                <Accordion.Content>This item works normally.</Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>

            {/* ============== BLOCK 7.12: Section 2.12 - Tabs ============== */}

            <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Tabs</h2>

        <div className="space-y-8">
          {/* Default Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Default Variant</h3>
            <Tabs
              tabs={simpleTabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="default"
            />
            <p className={`text-sm ${theme.text} opacity-50 mt-3`}>
              Active tab: <span className="font-semibold">{activeTab}</span>
            </p>
          </div>

          {/* Glass Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Glass Variant</h3>
            <Tabs
              tabs={simpleTabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="glass"
            />
          </div>

          {/* Material Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Material Variant</h3>
            <Tabs
              tabs={simpleTabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="material"
            />
          </div>

          {/* Underline Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Underline Variant</h3>
            <Tabs
              tabs={simpleTabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="underline"
            />
          </div>

          {/* Pills Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Pills Variant</h3>
            <Tabs
              tabs={simpleTabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="pills"
            />
          </div>

          {/* With Icons */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Icons</h3>
            <Tabs
              tabs={tabOptions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="default"
            />
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Small</p>
                <Tabs
                  tabs={simpleTabOptions.slice(0, 3)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="default"
                  size="sm"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Medium (Default)</p>
                <Tabs
                  tabs={simpleTabOptions.slice(0, 3)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="default"
                  size="md"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Large</p>
                <Tabs
                  tabs={simpleTabOptions.slice(0, 3)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="default"
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Full Width */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Full Width</h3>
            <Tabs
              tabs={simpleTabOptions.slice(0, 3)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              variant="material"
              fullWidth
            />
          </div>
        </div>
      </section>

      {/* ============== BLOCK 7.13: Section 2.13 - DatePicker ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Date Picker</h2>

        <div className="space-y-8">
          {/* Basic DatePicker */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Choose a date"
            />

            <DatePicker
              label="With Helper Text"
              value={selectedDate}
              onChange={setSelectedDate}
              helperText="Select your preferred delivery date"
            />

            <DatePicker
              label="Required Field"
              value={selectedDate}
              onChange={setSelectedDate}
              required
            />
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DatePicker
                label="Small"
                size="sm"
                value={selectedDate}
                onChange={setSelectedDate}
              />
              <DatePicker
                label="Medium (Default)"
                size="md"
                value={selectedDate}
                onChange={setSelectedDate}
              />
              <DatePicker
                label="Large"
                size="lg"
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>States</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DatePicker
                label="Error State"
                value=""
                onChange={() => {}}
                error
                helperText="Please select a valid date"
              />
              <DatePicker
                label="Disabled"
                value="2025-06-15"
                onChange={() => {}}
                disabled
              />
              <DatePicker
                label="With Min/Max Date"
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                helperText="Cannot select past dates"
              />
            </div>
          </div>

          {/* Date Range Example */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Date Range (Two Pickers)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                placeholder="From"
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                placeholder="To"
                minDate={startDate ? new Date(startDate) : undefined}
              />
            </div>
            {startDate && endDate && (
              <p className={`text-sm ${theme.text} opacity-50 mt-3`}>
                Selected range: <span className="font-semibold">{startDate}</span> to <span className="font-semibold">{endDate}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============== BLOCK 8: Section 3 - Status Badges ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Status Badges</h2>

        <div className="space-y-8">
          {/* Default (Subtle) */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Subtle Variant (Default)</h3>
            <div className="flex flex-wrap gap-3">
              {allStatuses.map((status) => (
                <StatusBadge key={status} status={status} variant="subtle" />
              ))}
            </div>
          </div>

          {/* Filled Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Filled Variant</h3>
            <div className="flex flex-wrap gap-3">
              {allStatuses.map((status) => (
                <StatusBadge key={status} status={status} variant="filled" />
              ))}
            </div>
          </div>

          {/* Outlined Variant */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Outlined Variant</h3>
            <div className="flex flex-wrap gap-3">
              {allStatuses.map((status) => (
                <StatusBadge key={status} status={status} variant="outlined" />
              ))}
            </div>
          </div>

          {/* With Dot Indicator */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Dot Indicator</h3>
            <div className="flex flex-wrap gap-3">
              {allStatuses.map((status) => (
                <StatusBadge key={status} status={status} dot />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="Open" size="sm" />
              <StatusBadge status="Open" size="md" />
              <StatusBadge status="Open" size="lg" />
              <span className={`text-xs ${theme.text} opacity-50 ml-4`}>sm → md → lg</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 9: Section 4 - Tables (NEW) ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Tables</h2>

        {/* Default Table - Striped & Hoverable */}
        <div className="mb-8">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>
            Default (Striped + Hoverable + Sticky Header)
          </h3>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Product Name</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Stock</Table.Head>
                <Table.Head>Price</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sampleTableData.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="font-medium">{item.name}</Table.Cell>
                  <Table.Cell>{item.sku}</Table.Cell>
                  <Table.Cell>{item.stock}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                  <Table.Cell>
                    <span className={`font-medium ${getStockStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="sm" variant="ghost">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Table Sizes */}
        <div className="mb-8">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>
            Size Variants
          </h3>
          <div className="space-y-6">
            {/* Small */}
            <div>
              <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Small (sm)</p>
              <Table size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>SKU</Table.Head>
                    <Table.Head>Stock</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sampleTableData.slice(0, 3).map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.sku}</Table.Cell>
                      <Table.Cell>{item.stock}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Large */}
            <div>
              <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Large (lg)</p>
              <Table size="lg">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>SKU</Table.Head>
                    <Table.Head>Stock</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sampleTableData.slice(0, 3).map((item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.sku}</Table.Cell>
                      <Table.Cell>{item.stock}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>

        {/* Bordered Variant */}
        <div className="mb-8">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>
            Bordered Variant
          </h3>
          <Table variant="bordered" hoverable={false}>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Stock</Table.Head>
                <Table.Head>Price</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sampleTableData.slice(0, 3).map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.sku}</Table.Cell>
                  <Table.Cell>{item.stock}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Wide Table - Horizontal Scroll Demo */}
        <div>
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>
            Wide Table (Horizontal Scroll)
          </h3>
          <p className={`text-xs ${theme.text} opacity-50 mb-2`}>
            Resize your browser to see horizontal scroll behavior
          </p>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Product Name</Table.Head>
                <Table.Head>SKU</Table.Head>
                <Table.Head>Stock Quantity</Table.Head>
                <Table.Head>Unit Price</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Supplier</Table.Head>
                <Table.Head>Last Updated</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sampleTableData.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="font-medium">{item.name}</Table.Cell>
                  <Table.Cell>{item.sku}</Table.Cell>
                  <Table.Cell>{item.stock}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                  <Table.Cell>
                    <span className={`font-medium ${getStockStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>Electronics</Table.Cell>
                  <Table.Cell>Acme Corp</Table.Cell>
                  <Table.Cell>2025-06-15</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <EyeIcon className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ArrowPathIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </section>

      {/* ============== BLOCK 10: Section 5 - Cards ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Cards</h2>

        <div className="space-y-8">
          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default">
                <CardContent>
                  <h4 className={`font-semibold ${theme.text} mb-2`}>Default</h4>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Standard card with subtle shadow.
                  </p>
                </CardContent>
              </Card>
              <Card variant="bordered">
                <CardContent>
                  <h4 className={`font-semibold ${theme.text} mb-2`}>Bordered</h4>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Card with prominent border.
                  </p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardContent>
                  <h4 className={`font-semibold ${theme.text} mb-2`}>Elevated</h4>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Card with larger shadow.
                  </p>
                </CardContent>
              </Card>
              <Card variant="flat">
                <CardContent>
                  <h4 className={`font-semibold ${theme.text} mb-2`}>Flat</h4>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Card with subtle background.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* With Sections */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent>
                  <h4 className={`font-semibold ${theme.text}`}>Simple Card</h4>
                  <p className={`text-sm ${theme.text} opacity-60 mt-2`}>
                    This is a basic card with just content.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className={`font-semibold ${theme.text}`}>Card with Header</h4>
                  <Button size="sm" variant="ghost">
                    Action
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    This card has a header with title and action.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className={`font-semibold ${theme.text}`}>Full Card</h4>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Header, content, and footer sections.
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Cancel</Button>
                    <Button size="sm">Save</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* With Padding Prop */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Padding Prop</h3>
            <Card padding>
              <h4 className={`font-semibold ${theme.text} mb-2`}>Padded Card</h4>
              <p className={`text-sm ${theme.text} opacity-60`}>
                This card uses the `padding` prop for automatic padding without CardContent.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 11: Section 6 - Widget Cards ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Widget Cards</h2>

        <div className="space-y-8">
          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WidgetCard variant="default">
                <WidgetHeader title="Default" />
                <WidgetBody>
                  <p className={`text-sm ${theme.text} opacity-60`}>Default widget style.</p>
                </WidgetBody>
              </WidgetCard>
              <WidgetCard variant="bordered">
                <WidgetHeader title="Bordered" />
                <WidgetBody>
                  <p className={`text-sm ${theme.text} opacity-60`}>Bordered widget style.</p>
                </WidgetBody>
              </WidgetCard>
              <WidgetCard variant="elevated">
                <WidgetHeader title="Elevated" />
                <WidgetBody>
                  <p className={`text-sm ${theme.text} opacity-60`}>Elevated widget style.</p>
                </WidgetBody>
              </WidgetCard>
            </div>
          </div>

          {/* Full Featured */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Full Featured</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WidgetCard>
                <WidgetHeader
                  title="Sales Overview"
                  icon={<ChartBarIcon className="w-5 h-5" />}
                  actions={
                    <>
                      <MiniActionButton icon={<ArrowPathIcon className="w-4 h-4" />} title="Refresh" />
                      <MiniActionButton icon={<PlusIcon className="w-4 h-4" />} title="Add" />
                    </>
                  }
                />
                <WidgetBody>
                  <p className={`text-sm ${theme.text} opacity-60`}>
                    Widget with icon, title, and action buttons.
                  </p>
                </WidgetBody>
                <WidgetFooter>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${theme.text} opacity-50`}>Last updated: 5 min ago</span>
                    <Button size="sm" variant="ghost">View All</Button>
                  </div>
                </WidgetFooter>
              </WidgetCard>

              <WidgetCard>
                <WidgetHeader
                  title="Active Orders"
                  badge={<StatusBadge status="Open" size="sm" />}
                />
                <WidgetBody>
                  <div className="flex items-center justify-center h-24">
                    <span className={`text-4xl font-bold ${theme.text}`}>24</span>
                  </div>
                </WidgetBody>
                <WidgetFooter>
                  <div className="flex justify-center">
                    <Button size="sm" variant="primary" fullWidth>
                      View Orders
                    </Button>
                  </div>
                </WidgetFooter>
              </WidgetCard>
            </div>
          </div>

          {/* No Padding Example */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>No Padding Body</h3>
            <WidgetCard>
              <WidgetHeader title="Chart Widget" />
              <WidgetBody noPadding>
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium">Chart would go here (no padding)</span>
                </div>
              </WidgetBody>
            </WidgetCard>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 12: Section 7 - Dialogs ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Dialogs</h2>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsDialogOpen(true)}>Open Simple Dialog</Button>
          <Button variant="secondary" onClick={() => setIsDialogWithFooterOpen(true)}>
            Open Dialog with Footer
          </Button>
        </div>

        {/* Simple Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Simple Dialog"
        >
          <p className={`${theme.text} opacity-70`}>
            This is a simple dialog with a title. Press Escape or click outside to close.
          </p>
        </Dialog>

        {/* Dialog with Footer */}
        <Dialog
          open={isDialogWithFooterOpen}
          onClose={() => setIsDialogWithFooterOpen(false)}
          title="Confirm Action"
          size="sm"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsDialogWithFooterOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setIsDialogWithFooterOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          <p className={`${theme.text} opacity-70`}>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </Dialog>
      </section>

      {/* ============== BLOCK 13: Section 8 - Migration Checklist ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Migration Checklist</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Button", status: "done" },
            { name: "Input", status: "done" },
            { name: "Select", status: "done" },
            { name: "DatePicker", status: "done" },
            { name: "Tabs", status: "done" },
            { name: "Toast", status: "done" },
            { name: "Skeleton", status: "done" },
            { name: "Spinner", status: "done" },
            { name: "Empty State", status: "done" },
            { name: "Menu/Dropdown", status: "done" },
            { name: "Accordion", status: "done" },
            { name: "Dialog", status: "done" },
            { name: "Card", status: "done" },
            { name: "StatusBadge", status: "done" },
            { name: "WidgetCard", status: "done" },
            { name: "Table", status: "done" },
          ].map((component) => (
            <div
              key={component.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${theme.borderColor}`}
            >
              <span className={theme.text}>{component.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  component.status === "done"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {component.status === "done" ? "✓ Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>

        {/* Celebration Banner */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-300 font-medium text-center">
            🎉 All 16 components completed! Your custom UI library is ready to use.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">16</p>
            <p className={`text-xs ${theme.text} opacity-60`}>Components</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</p>
            <p className={`text-xs ${theme.text} opacity-60`}>External UI Deps</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">100%</p>
            <p className={`text-xs ${theme.text} opacity-60`}>Tailwind CSS</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">✓</p>
            <p className={`text-xs ${theme.text} opacity-60`}>Dark Mode</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============== BLOCK 14: Export ==============

export default UITestPage;