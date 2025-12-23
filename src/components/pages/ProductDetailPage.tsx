//src/components/pages/ProductDetailPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
  IconButton
} from "@material-tailwind/react";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  PencilIcon, 
  TrashIcon,
  EllipsisVerticalIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { productService } from "../../services/product.service";
import { bomService } from "../../services/bom.service";
import { EditProductForm } from "../forms/EditProductForm";
import { AddBomComponentModal } from "../modals/AddBomComponentModal";
import { EditBomComponentModal } from "../modals/EditBomComponentModal";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";

// BLOCK 2: Interface
interface ProductDetailPageProps {
  productCode: string;
  onBack: () => void;
}

// BLOCK 3: Main Component
export function ProductDetailPage({ productCode, onBack }: ProductDetailPageProps) {
  const { theme } = useTheme();
  const [product, setProduct] = useState<any | null>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isAddBomOpen, setIsAddBomOpen] = useState(false);
  const [isEditBomOpen, setIsEditBomOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isDeleteBomOpen, setIsDeleteBomOpen] = useState(false);
  
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // BLOCK 4: Fetch Data
  useEffect(() => {
    loadProductData();
  }, [productCode]);

  const loadProductData = () => {
    setLoading(true);
    
    Promise.all([
      productService.getAllProducts(),
      productService.getBomForProduct(productCode)
    ])
      .then(([products, bomData]) => {
        const foundProduct = products.find(p => p.productCode === productCode);
        setProduct(foundProduct || null);
        
        const bomArray = bomData?.data || bomData || [];
        setComponents(Array.isArray(bomArray) ? bomArray : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // BLOCK 5: Delete Handlers
  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productCode);
      onBack();
    } catch (error: any) {
      alert(error.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
      setIsDeleteProductOpen(false);
    }
  };

  const handleDeleteComponent = async () => {
    if (!selectedComponent?.partCode) return;
    
    setDeleteLoading(true);
    try {
      await bomService.deleteComponent(productCode, selectedComponent.partCode);
      setIsDeleteBomOpen(false);
      setSelectedComponent(null);
      loadProductData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete component');
    } finally {
      setDeleteLoading(false);
    }
  };

  // BLOCK 6: Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  // BLOCK 7: Product Not Found
  if (!product) {
    return (
      <div className="text-center p-8">
        <Typography variant="h5" className={theme.text}>
          Product not found: {productCode}
        </Typography>
        <Button onClick={onBack} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

    // BLOCK 8: Section Header Component
    const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
      <div className={`flex justify-between items-center px-4 py-3 ${theme.isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <Typography variant="h6" className={`${theme.text} font-semibold uppercase text-sm tracking-wide`}>
          {title}
        </Typography>
        {action}
      </div>
    );

      // BLOCK 9: Info Row Component
        const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
          <div className={`flex border-b-2 ${theme.borderColor} last:border-b-0`}>
            <div className={`w-1/3 px-4 py-3 ${theme.isDark ? 'bg-gray-800/30' : 'bg-gray-50/50'} border-r-2 ${theme.borderColor}`}>
              <Typography variant="small" className={`${theme.text} opacity-70 font-medium`}>
                {label}
              </Typography>
            </div>
            <div className="w-2/3 px-4 py-3">
              <Typography variant="small" className={`${theme.text} font-medium`}>
                {value || '-'}
              </Typography>
            </div>
          </div>
        );

// BLOCK 10: Main Render
return (
  <div className="space-y-6">
    {/* Menu Bar - DaisyUI Style */}
    <div className={`rounded-lg ${theme.isDark ? 'bg-gray-800' : 'bg-base-200'}`}>
      <ul className="menu menu-horizontal px-1">
        {/* Edit Product */}
        <li>
          <a 
            className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
            onClick={() => setIsEditProductOpen(true)}
          >
            <PencilIcon className="h-4 w-4" />
            Edit Product
          </a>
        </li>

        {/* Delete Product */}
        <li>
          <a 
            className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
            onClick={() => setIsDeleteProductOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
            Delete Product
          </a>
        </li>

        {/* Parts - Dropdown */}
        <li>
          <details>
            <summary className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}>
              Parts
            </summary>
            <ul className={`z-20 ${theme.isDark ? 'bg-gray-800' : 'bg-base-100'} rounded-lg shadow-lg`}>
              <li>
                <a 
                  className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
                  onClick={() => console.log('View Parts clicked')}
                >
                  View Parts
                </a>
              </li>
              <li>
                <a 
                  className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
                  onClick={() => console.log('Add Part clicked')}
                >
                  Add Part
                </a>
              </li>
            </ul>
          </details>
        </li>

        {/* Edit BOM - Dropdown */}
        <li>
          <details>
            <summary className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}>
              Edit BOM
            </summary>
            <ul className={`z-20 ${theme.isDark ? 'bg-gray-800' : 'bg-base-100'} rounded-lg shadow-lg`}>
              <li>
                <a 
                  className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
                  onClick={() => setIsAddBomOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Component
                </a>
              </li>
              <li>
                <a 
                  className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
                  onClick={() => console.log('Import BOM clicked')}
                >
                  Import BOM
                </a>
              </li>
              <li>
                <a 
                  className={`${theme.isDark ? 'text-gray-200 hover:bg-gray-700' : ''}`}
                  onClick={() => console.log('Export BOM clicked')}
                >
                  Export BOM
                </a>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>

    {/* Product Information Section */}
    <Card className={`${theme.cards} shadow-sm overflow-hidden`}>
      <SectionHeader title="Product Information" />
      <CardBody className="p-4">
        <div className={`border-2 ${theme.borderColor} rounded-lg overflow-hidden`}>
          <InfoRow label="Product Code" value={product.productCode} />
          <InfoRow label="Description" value={product.description} />
          <InfoRow label="Units Per Shipper" value={product.unitsPerShipper} />
          <InfoRow label="Price Per Shipper" value={product.pricePerShipper ? `$${product.pricePerShipper.toFixed(2)}` : '-'} />
        </div>
      </CardBody>
    </Card>

    {/* Bill of Materials Section */}
    <Card className={`${theme.cards} shadow-sm overflow-hidden`}>
      <SectionHeader title="Bill of Materials (BOM)" />
      <CardBody className="p-4">
        {components.length === 0 ? (
          <div className={`p-8 text-center border-2 ${theme.borderColor} rounded-lg`}>
            <Typography className={`${theme.text} opacity-60`}>
              No components in BOM. Click "Edit BOM" → "Add Component" to add components.
            </Typography>
          </div>
        ) : (
          <div className={`border-2 ${theme.borderColor} rounded-lg overflow-hidden`}>
            <table className="w-full">
              <thead>
                <tr className={`${theme.isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <th className={`px-4 py-3 text-left border-b-2 border-r-2 ${theme.borderColor}`}>
                    <Typography variant="small" className={`${theme.text} font-semibold`}>Part #</Typography>
                  </th>
                  <th className={`px-4 py-3 text-left border-b-2 border-r-2 ${theme.borderColor}`}>
                    <Typography variant="small" className={`${theme.text} font-semibold`}>Description</Typography>
                  </th>
                  <th className={`px-4 py-3 text-left border-b-2 border-r-2 ${theme.borderColor}`}>
                    <Typography variant="small" className={`${theme.text} font-semibold`}>Type</Typography>
                  </th>
                  <th className={`px-4 py-3 text-center border-b-2 border-r-2 ${theme.borderColor}`}>
                    <Typography variant="small" className={`${theme.text} font-semibold`}>Qty</Typography>
                  </th>
                  <th className={`px-4 py-3 text-center border-b-2 ${theme.borderColor}`}>
                    <Typography variant="small" className={`${theme.text} font-semibold`}>Actions</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp) => (
                  <tr 
                    key={comp.partCode} 
                    className={`${theme.hoverBg} border-b-2 ${theme.borderColor} last:border-b-0`}
                  >
                    <td className={`px-4 py-3 border-r-2 ${theme.borderColor}`}>
                      <Typography variant="small" className={`${theme.text} font-mono font-bold`}>
                        {comp.partCode}
                      </Typography>
                    </td>
                    <td className={`px-4 py-3 border-r-2 ${theme.borderColor}`}>
                      <Typography variant="small" className={theme.text}>
                        {comp.partDescription}
                      </Typography>
                    </td>
                    <td className={`px-4 py-3 border-r-2 ${theme.borderColor}`}>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        comp.partType === 'RAW_MATERIAL' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : comp.partType === 'COMPONENT'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          : comp.partType === 'PACKAGING'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {comp.partType?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-center border-r-2 ${theme.borderColor}`}>
                      <Typography variant="small" className={`${theme.text} font-semibold`}>
                        {comp.perShipper}
                      </Typography>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={() => {
                            setSelectedComponent(comp);
                            setIsEditBomOpen(true);
                          }}
                        >
                          <PencilIcon className={`h-4 w-4 ${theme.text}`} />
                        </IconButton>
                        <IconButton
                          variant="text"
                          size="sm"
                          color="red"
                          onClick={() => {
                            setSelectedComponent(comp);
                            setIsDeleteBomOpen(true);
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>

    {/* Production Information Section */}
    <Card className={`${theme.cards} shadow-sm overflow-hidden`}>
      <SectionHeader title="Production Information" />
      <CardBody className="p-4">
        <div className={`border-2 ${theme.borderColor} rounded-lg overflow-hidden`}>
          <InfoRow label="Hourly Run Rate" value={product.hourlyRunRate ? `${product.hourlyRunRate} units/hr` : '-'} />
          <InfoRow label="Daily Run Rate" value={product.dailyRunRate ? `${product.dailyRunRate} units/day` : '-'} />
          <InfoRow label="Minutes Per Shipper" value={product.minsPerShipper ? `${product.minsPerShipper} mins` : '-'} />
        </div>
      </CardBody>
    </Card>

    {/* Stock Information Section */}
    <Card className={`${theme.cards} shadow-sm overflow-hidden`}>
      <SectionHeader title="Stock Information" />
      <CardBody className="p-4">
        <div className={`border-2 ${theme.borderColor} rounded-lg overflow-hidden`}>
          <InfoRow label="On Hand" value="Coming soon..." />
          <InfoRow label="Reserved" value="Coming soon..." />
          <InfoRow label="Available" value="Coming soon..." />
          <InfoRow label="On Order" value="Coming soon..." />
        </div>
      </CardBody>
    </Card>

    {/* BLOCK 11: Modals */}
    <EditProductForm
      open={isEditProductOpen}
      handleOpen={() => setIsEditProductOpen(false)}
      product={product}
      onProductUpdated={loadProductData}
    />

    <AddBomComponentModal
      open={isAddBomOpen}
      onClose={() => setIsAddBomOpen(false)}
      productCode={productCode}
      onSuccess={loadProductData}
    />

    <EditBomComponentModal
      open={isEditBomOpen}
      onClose={() => {
        setIsEditBomOpen(false);
        setSelectedComponent(null);
      }}
      productCode={productCode}
      component={selectedComponent}
      onSuccess={loadProductData}
    />

    <ConfirmationDialog
      open={isDeleteProductOpen}
      title="Delete Product"
      message={`Are you sure you want to delete product "${productCode}"? This will also delete all BOM components. This action cannot be undone.`}
      onConfirm={handleDeleteProduct}
      onCancel={() => setIsDeleteProductOpen(false)}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="red"
      loading={deleteLoading}
    />

    <ConfirmationDialog
      open={isDeleteBomOpen}
      title="Delete Component"
      message={`Are you sure you want to delete component "${selectedComponent?.partCode}" from BOM?`}
      onConfirm={handleDeleteComponent}
      onCancel={() => {
        setIsDeleteBomOpen(false);
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