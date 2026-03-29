// src/features/products/components/BomManagementTab.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { productService } from "../services/product.service";
import { bomService } from "../services/bom.service";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

// ============== BLOCK 2: Types ==============

interface BomManagementTabProps {
  product: any;
  onUpdate: () => void;
}

// ============== BLOCK 3: Main Component ==============

export function BomManagementTab({ product, onUpdate }: BomManagementTabProps) {
  const { theme } = useTheme();
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected component for edit/delete
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const TABLE_HEAD = ["Part Code", "Description", "Part Type", "Qty/Shipper", "Actions"];

  // ============== BLOCK 4: Fetch BOM Components ==============

  useEffect(() => {
    if (product?.productCode) {
      loadBomComponents();
    }
  }, [product]);

  const loadBomComponents = () => {
    setLoading(true);
    productService
      .getBomForProduct(product.productCode)
      .then((data) => {
        // Handle both response formats
        const bomData = data?.data || data || [];
        setComponents(Array.isArray(bomData) ? bomData : []);
      })
      .catch((err) => {
        console.error("Error loading BOM:", err);
        setComponents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ============== BLOCK 5: Filter Components ==============

  const filteredComponents = components.filter((comp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      comp.partCode?.toLowerCase().includes(query) ||
      comp.partDescription?.toLowerCase().includes(query) ||
      comp.partType?.toLowerCase().includes(query)
    );
  });

  // ============== BLOCK 6: Handle Delete ==============

  const handleDeleteComponent = async () => {
    if (!selectedComponent?.partCode) return;

    setDeleteLoading(true);
    try {
      await bomService.deleteComponent(product.productCode, selectedComponent.partCode);

      setIsDeleteDialogOpen(false);
      setSelectedComponent(null);
      loadBomComponents();
      onUpdate(); // Refresh parent component
    } catch (error: any) {
      console.error("Failed to delete component:", error);
      alert(error.message || "Failed to delete component");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============== BLOCK 7: Statistics ==============

  const totalComponents = components.length;
  const totalQuantity = components.reduce((sum, comp) => sum + (comp.perShipper || 0), 0);

  const componentsByType = components.reduce((acc: any, comp) => {
    const type = comp.partType || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // ============== BLOCK 8: Render ==============

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="bordered" className={`${theme.cards} shadow-sm`}>
          <CardContent className="p-4">
            <span className={`text-sm opacity-70 ${theme.text}`}>Total Components</span>
            <span className={`text-2xl font-bold block ${theme.text}`}>{totalComponents}</span>
          </CardContent>
        </Card>

        <Card variant="bordered" className={`${theme.cards} shadow-sm`}>
          <CardContent className="p-4">
            <span className={`text-sm opacity-70 ${theme.text}`}>Total Quantity</span>
            <span className={`text-2xl font-bold block ${theme.text}`}>{totalQuantity.toFixed(2)}</span>
          </CardContent>
        </Card>

        <Card variant="bordered" className={`${theme.cards} shadow-sm`}>
          <CardContent className="p-4">
            <span className={`text-sm opacity-70 ${theme.text}`}>Raw Materials</span>
            <span className={`text-2xl font-bold block ${theme.text}`}>
              {componentsByType["RAW_MATERIAL"] || 0}
            </span>
          </CardContent>
        </Card>

        <Card variant="bordered" className={`${theme.cards} shadow-sm`}>
          <CardContent className="p-4">
            <span className={`text-sm opacity-70 ${theme.text}`}>Components</span>
            <span className={`text-2xl font-bold block ${theme.text}`}>
              {componentsByType["COMPONENT"] || 0}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="md:w-96 w-full">
          <Input
            label="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Component
        </Button>
      </div>

      {/* BOM Table */}
      <Card variant="bordered" className={`${theme.cards} shadow-sm`}>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center p-8">
              <span className={`opacity-70 ${theme.text}`}>
                {searchQuery
                  ? `No components found matching "${searchQuery}"`
                  : "No BOM components yet. Click 'Add Component' to get started."}
              </span>
            </div>
          ) : (
            <div className={`border-2 ${theme.borderColor} rounded-lg m-4 overflow-hidden`}>
              <table className="w-full min-w-max table-auto text-left">
                <thead className={`border-b-2 ${theme.borderColor}`}>
                  <tr>
                    {TABLE_HEAD.map((head, index) => {
                      let thClasses = `${theme.tableHeaderBg} p-4 text-center`;
                      if (index < TABLE_HEAD.length - 1) {
                        thClasses += ` border-r ${theme.borderColor}`;
                      }
                      return (
                        <th key={head} className={thClasses}>
                          <span className={`text-sm font-semibold ${theme.text}`}>{head}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map((component, index) => {
                    const isLastRow = index === filteredComponents.length - 1;
                    const getCellClasses = (isLast = false) => {
                      let classes = `p-3 text-center ${isLastRow ? "" : `border-b ${theme.borderColor}`}`;
                      if (!isLast) {
                        classes += ` border-r ${theme.borderColor}`;
                      }
                      return classes;
                    };

                    return (
                      <tr key={component.partCode} className={theme.hoverBg}>
                        <td className={getCellClasses()}>
                          <span className={`text-sm font-mono font-bold ${theme.text}`}>
                            {component.partCode}
                          </span>
                        </td>
                        <td className={getCellClasses()}>
                          <span className={`text-sm ${theme.text}`}>{component.partDescription}</span>
                        </td>
                        <td className={getCellClasses()}>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              component.partType === "RAW_MATERIAL"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : component.partType === "COMPONENT"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : component.partType === "PACKAGING"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {component.partType}
                          </span>
                        </td>
                        <td className={getCellClasses()}>
                          <span className={`text-sm font-semibold ${theme.text}`}>
                            {component.perShipper}
                          </span>
                        </td>
                        <td className={getCellClasses(true)}>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedComponent(component);
                                setIsEditModalOpen(true);
                              }}
                              title="Edit Component"
                              className="p-1"
                            >
                              <PencilIcon className={`h-4 w-4 ${theme.text}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedComponent(component);
                                setIsDeleteDialogOpen(true);
                              }}
                              title="Delete Component"
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============== BLOCK 9: Modals ============== */}
      <AddBomComponentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        productCode={product.productCode}
        onSuccess={() => {
          loadBomComponents();
          onUpdate();
        }}
      />

      <EditBomComponentModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedComponent(null);
        }}
        productCode={product.productCode}
        component={selectedComponent}
        onSuccess={() => {
          loadBomComponents();
          onUpdate();
        }}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Component"
        message={`Are you sure you want to delete component "${selectedComponent?.partCode}"? This action cannot be undone.`}
        onConfirm={handleDeleteComponent}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedComponent(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}