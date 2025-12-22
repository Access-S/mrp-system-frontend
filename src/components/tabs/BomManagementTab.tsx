//src/components/tabs/BomManagementTab.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  IconButton,
  Input,
  Spinner,
  Card,
  CardBody
} from "@material-tailwind/react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { productService } from "../../services/product.service";
import { bomService } from "../../services/bom.service";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";

// BLOCK 2: Interface
interface BomManagementTabProps {
  product: any;
  onUpdate: () => void;
}

// BLOCK 3: Main Component
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

  // BLOCK 4: Fetch BOM Components
  useEffect(() => {
    if (product?.productCode) {
      loadBomComponents();
    }
  }, [product]);

  const loadBomComponents = () => {
    setLoading(true);
    productService.getBomForProduct(product.productCode)
      .then(data => {
        // Handle both response formats
        const bomData = data?.data || data || [];
        setComponents(Array.isArray(bomData) ? bomData : []);
      })
      .catch(err => {
        console.error('Error loading BOM:', err);
        setComponents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // BLOCK 5: Filter Components
  const filteredComponents = components.filter(comp => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      comp.partCode?.toLowerCase().includes(query) ||
      comp.partDescription?.toLowerCase().includes(query) ||
      comp.partType?.toLowerCase().includes(query)
    );
  });

// BLOCK 6: Handle Delete
const handleDeleteComponent = async () => {
    if (!selectedComponent?.partCode) return;
    
    setDeleteLoading(true);
    try {
      // ✅ Use real API call
      await bomService.deleteComponent(product.productCode, selectedComponent.partCode);
      
      setIsDeleteDialogOpen(false);
      setSelectedComponent(null);
      loadBomComponents();
      onUpdate(); // Refresh parent component
    } catch (error: any) {
      console.error('Failed to delete component:', error);
      alert(error.message || 'Failed to delete component');
    } finally {
      setDeleteLoading(false);
    }
  };

  // BLOCK 7: Calculate Statistics
  const totalComponents = components.length;
  const totalQuantity = components.reduce((sum, comp) => sum + (comp.perShipper || 0), 0);
  
  const componentsByType = components.reduce((acc: any, comp) => {
    const type = comp.partType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // BLOCK 8: Render
  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70`}>
              Total Components
            </Typography>
            <Typography variant="h4" className={`${theme.text} font-bold`}>
              {totalComponents}
            </Typography>
          </CardBody>
        </Card>

        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70`}>
              Total Quantity
            </Typography>
            <Typography variant="h4" className={`${theme.text} font-bold`}>
              {totalQuantity.toFixed(2)}
            </Typography>
          </CardBody>
        </Card>

        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70`}>
              Raw Materials
            </Typography>
            <Typography variant="h4" className={`${theme.text} font-bold`}>
              {componentsByType['RAW_MATERIAL'] || 0}
            </Typography>
          </CardBody>
        </Card>

        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70`}>
              Components
            </Typography>
            <Typography variant="h4" className={`${theme.text} font-bold`}>
              {componentsByType['COMPONENT'] || 0}
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Input
          label="Search components..."
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          color={theme.isDark ? "white" : "black"}
          className="md:w-96"
        />
        <Button
          className="flex items-center gap-2"
          color="green"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5" />
          Add Component
        </Button>
      </div>

      {/* BOM Table */}
      <Card className={`${theme.cards} shadow-sm`}>
        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : filteredComponents.length === 0 ? (
            <div className="text-center p-8">
              <Typography className={`${theme.text} opacity-70`}>
                {searchQuery 
                  ? `No components found matching "${searchQuery}"`
                  : "No BOM components yet. Click 'Add Component' to get started."}
              </Typography>
            </div>
          ) : (
            <div className={`border-2 ${theme.borderColor} rounded-lg m-4`}>
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
                          <Typography variant="small" className={`font-semibold ${theme.text}`}>
                            {head}
                          </Typography>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredComponents.map((component, index) => {
                    const isLastRow = index === filteredComponents.length - 1;
                    const getCellClasses = (isLast = false) => {
                      let classes = `p-3 text-center ${isLastRow ? '' : `border-b ${theme.borderColor}`}`;
                      if (!isLast) {
                        classes += ` border-r ${theme.borderColor}`;
                      }
                      return classes;
                    };

                    return (
                      <tr key={component.partCode} className={theme.hoverBg}>
                        <td className={getCellClasses()}>
                          <Typography variant="small" className={`font-mono font-bold ${theme.text}`}>
                            {component.partCode}
                          </Typography>
                        </td>
                        <td className={getCellClasses()}>
                          <Typography variant="small" className={theme.text}>
                            {component.partDescription}
                          </Typography>
                        </td>
                        <td className={getCellClasses()}>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            component.partType === 'RAW_MATERIAL' 
                              ? 'bg-blue-100 text-blue-800'
                              : component.partType === 'COMPONENT'
                              ? 'bg-purple-100 text-purple-800'
                              : component.partType === 'PACKAGING'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {component.partType}
                          </span>
                        </td>
                        <td className={getCellClasses()}>
                          <Typography variant="small" className={`font-semibold ${theme.text}`}>
                            {component.perShipper}
                          </Typography>
                        </td>
                        <td className={getCellClasses(true)}>
                          <div className="flex gap-2 justify-center">
                            <IconButton
                              variant="text"
                              size="sm"
                              onClick={() => {
                                setSelectedComponent(component);
                                setIsEditModalOpen(true);
                              }}
                              title="Edit Component"
                            >
                              <PencilIcon className={`h-4 w-4 ${theme.text}`} />
                            </IconButton>
                            <IconButton
                              variant="text"
                              size="sm"
                              color="red"
                              onClick={() => {
                                setSelectedComponent(component);
                                setIsDeleteDialogOpen(true);
                              }}
                              title="Delete Component"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* BLOCK 9: Modals */}
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
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedComponent(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleteLoading}
      />
    </div>
  );
}