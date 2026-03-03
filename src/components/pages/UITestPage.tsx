// src/components/pages/UITestPage.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Dialog } from "../ui/Dialog";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import { StatusBadge, Status } from "../ui/StatusBadge";
import { WidgetCard, WidgetHeader, WidgetBody, MiniActionButton } from "../ui/WidgetCard";
import { Table } from "../ui/Table";
import { Select, SelectOption } from "../ui/Select";
import { useToast } from "../ui/Toast";
import { Skeleton, SkeletonTableRow, SkeletonCard, SkeletonAvatar, SkeletonButton } from "../ui/Skeleton";
import { Spinner, SpinnerPage } from "../ui/Spinner";
import { EmptyState, EmptySearchState, EmptyProductState, ErrorState } from "../ui/EmptyState";
import { Menu } from "../ui/Menu";
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Input */}
          <Input
            label="Basic Input"
            placeholder="Enter some text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {/* With Helper Text */}
          <Input
            label="With Helper Text"
            placeholder="Enter your email"
            helperText="We'll never share your email with anyone."
          />

          {/* Error State */}
          <Input
            label="Error State"
            placeholder="Required field"
            error={true}
            helperText="This field is required"
          />

          {/* Toggle Error */}
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

          {/* Disabled */}
          <Input
            label="Disabled Input"
            placeholder="You can't edit this"
            disabled
            value="Disabled value"
          />

          {/* Different Types */}
          <Input label="Password Input" type="password" placeholder="Enter password" />
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

      {/* ============== BLOCK 8: Section 3 - Status Badges ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          {allStatuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Simple Card */}
          <Card>
            <CardContent>
              <h3 className={`font-semibold ${theme.text}`}>Simple Card</h3>
              <p className={`text-sm ${theme.text} opacity-60 mt-2`}>
                This is a basic card with just content.
              </p>
            </CardContent>
          </Card>

          {/* Card with Header */}
          <Card>
            <CardHeader>
              <h3 className={`font-semibold ${theme.text}`}>Card with Header</h3>
              <Button size="sm" variant="ghost">
                Action
              </Button>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${theme.text} opacity-60`}>
                This card has a header section with a title and action button.
              </p>
            </CardContent>
          </Card>

          {/* Full Card */}
          <Card>
            <CardHeader>
              <h3 className={`font-semibold ${theme.text}`}>Full Card</h3>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${theme.text} opacity-60`}>
                This card has header, content, and footer sections.
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ============== BLOCK 11: Section 6 - Widget Cards ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Widget Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Widget */}
          <WidgetCard>
            <WidgetHeader
              title="Sales Overview"
              icon={<EyeIcon className="w-5 h-5" />}
              actions={
                <>
                  <MiniActionButton icon={<ArrowPathIcon className="w-4 h-4" />} title="Refresh" />
                  <MiniActionButton icon={<PlusIcon className="w-4 h-4" />} title="Add" />
                </>
              }
            />
            <WidgetBody>
              <p className={`text-sm ${theme.text} opacity-60`}>
                Widget content goes here. This component is great for dashboard widgets.
              </p>
            </WidgetBody>
          </WidgetCard>

          {/* Widget with Badge */}
          <WidgetCard>
            <WidgetHeader
              title="Active Orders"
              badge={<StatusBadge status="Open" />}
            />
            <WidgetBody>
              <div className="flex items-center justify-center h-32">
                <span className={`text-4xl font-bold ${theme.text}`}>24</span>
              </div>
            </WidgetBody>
          </WidgetCard>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Button", status: "done" },
            { name: "Input", status: "done" },
            { name: "Select", status: "done" },
            { name: "Toast", status: "done" },
            { name: "Skeleton", status: "done" },
            { name: "Spinner", status: "done" },
            { name: "Empty State", status: "done" },
            { name: "Menu/Dropdown", status: "done" },
            { name: "Dialog", status: "done" },
            { name: "Card", status: "done" },
            { name: "StatusBadge", status: "done" },
            { name: "WidgetCard", status: "done" },
            { name: "Table", status: "done" },
            { name: "Accordion", status: "pending" },
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
      </section>
    </div>
  );
};

// ============== BLOCK 14: Export ==============

export default UITestPage;