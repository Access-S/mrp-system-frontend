//src/components/pages/ProductsPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect, useMemo } from "react";
import {
  Card, Typography, CardBody, Spinner, Input, IconButton, Button
} from "@material-tailwind/react";
import { Product } from "../../types/mrp.types";
import { fetchAllProducts } from "../../services/api.service";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  MagnifyingGlassIcon, 
  ArrowTopRightOnSquareIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { BomDetailModal } from "../modals/BomDetailModal";
import { CreateProductForm } from "../forms/CreateProductForm";
import { EditProductForm } from "../forms/EditProductForm";
import { ConfirmationDialog } from "../dialogs/ConfirmationDialog";
import { productService } from "../../services/product.service";

// BLOCK 2: Main ProductsPage Component
interface ProductsPageProps {
  onViewProduct?: (productCode: string) => void;  // ✅ Add this interface
}

export function ProductsPage({ onViewProduct }: ProductsPageProps) {  // ✅ Accept prop
  const { theme } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [productToView, setProductToView] = useState<any | null>(null);
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const TABLE_HEAD = ["Actions", "Product Code", "Description", "Hourly Run Rate"];

  // BLOCK 3: Fetch Products
useEffect(() => {
  loadProducts();
}, []);

const loadProducts = () => {
  setLoading(true);
  setDeleteLoading(false);
  
  fetchAllProducts()
    .then(productsArray => {
      setProducts(productsArray || []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
};

  // BLOCK 4: Filter Products
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.productCode.toLowerCase().includes(lowercasedQuery) ||
        product.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [products, searchQuery]);

  // BLOCK 5: Calculate Statistics
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const productsWithBom = products.filter(p => p.components && p.components.length > 0).length;
    const totalComponents = products.reduce((sum, p) => sum + (p.components?.length || 0), 0);
    const avgRunRate = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.hourlyRunRate || 0), 0) / products.length 
      : 0;

    return {
      totalProducts,
      productsWithBom,
      totalComponents,
      avgRunRate
    };
  }, [products]);

  // BLOCK 6: Handler Functions
  const handleOpenBomModal = (product: any | null) => {
    setProductToView(product);
    setIsBomModalOpen(!!product);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete?.productCode) return;
    
    setDeleteLoading(true);
    try {
      await productService.deleteProduct(productToDelete.productCode);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      // Call loadProducts directly instead of passing it
      await loadProducts();
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      alert(error.message || 'Failed to delete product');
      setDeleteLoading(false); // Only set false on error
    }
    // Don't set loading false here - let loadProducts finish first
  };

  if (loading) {
    return (<div className="flex justify-center items-center h-64"><Spinner className="h-12 w-12" /></div>);
  }

  return (
    <>
      {/* BLOCK 7: Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Products Card */}
        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70 mb-1`}>
              Total Products
            </Typography>
            <Typography variant="h3" className={`${theme.text} font-bold`}>
              {stats.totalProducts}
            </Typography>
            <Typography variant="small" className={`${theme.text} opacity-60 mt-1`}>
              Active in system
            </Typography>
          </CardBody>
        </Card>

        {/* Products with BOM Card */}
        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70 mb-1`}>
              Products with BOM
            </Typography>
            <Typography variant="h3" className={`${theme.text} font-bold`}>
              {stats.productsWithBom}
            </Typography>
            <Typography variant="small" className={`${theme.text} opacity-60 mt-1`}>
              {stats.totalProducts > 0 ? ((stats.productsWithBom / stats.totalProducts) * 100).toFixed(1) : 0}% coverage
            </Typography>
          </CardBody>
        </Card>

        {/* Total Components Card */}
        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70 mb-1`}>
              Total Components
            </Typography>
            <Typography variant="h3" className={`${theme.text} font-bold`}>
              {stats.totalComponents}
            </Typography>
            <Typography variant="small" className={`${theme.text} opacity-60 mt-1`}>
              Across all BOMs
            </Typography>
          </CardBody>
        </Card>

        {/* Average Run Rate Card */}
        <Card className={`${theme.cards} shadow-sm`}>
          <CardBody className="p-4">
            <Typography variant="small" className={`${theme.text} opacity-70 mb-1`}>
              Avg Hourly Run Rate
            </Typography>
            <Typography variant="h3" className={`${theme.text} font-bold`}>
              {stats.avgRunRate.toFixed(1)}
            </Typography>
            <Typography variant="small" className={`${theme.text} opacity-60 mt-1`}>
              Units per hour
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* BLOCK 8: Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className={theme.text}>
          Products List
        </Typography>
        <Button 
          className="flex items-center gap-2" 
          color="green"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5" />
          Create Product
        </Button>
      </div>

      {/* BLOCK 9: Products Table */}
      <Card className={`h-full w-full ${theme.cards} shadow-sm`}>
        <div className={`p-4 border-b ${theme.borderColor}`}>
          <Input
            label="Search by Product Code or Description"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color={theme.isDark ? "white" : "black"}
          />
        </div>
        <CardBody className="overflow-x-auto p-0">
          <div className={`border-2 ${theme.borderColor} rounded-lg m-4`}>
            <table className="w-full min-w-max table-auto text-left">
              <thead className={`border-b-2 ${theme.borderColor}`}>
                <tr>
                  {TABLE_HEAD.map((head, index) => {
                    let thClasses = `${theme.tableHeaderBg} p-4 text-center`; 
                    if (index < TABLE_HEAD.length - 1) {
                      thClasses += ` border-r ${theme.borderColor}`;
                    }
                    if (head === "Description") {
                        thClasses = thClasses.replace('text-center', 'text-center');
                    }
                    return (
                      <th key={head} className={thClasses}>
                        <Typography variant="small" className={`font-semibold leading-none ${theme.text}`}>
                          {head}
                        </Typography>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
  {filteredProducts.map((product) => {
    const getCellClasses = (isLast = false, align = 'center') => {
      let classes = `p-1 border-b ${theme.borderColor} text-${align}`;
      if (!isLast) {
        classes += ` border-r ${theme.borderColor}`;
      }
      return classes;
    };

    return (
      <tr key={product.id} className={theme.hoverBg}>
        <td className={getCellClasses()}>
          <div className="flex gap-1 justify-center">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => handleOpenBomModal(product)}
              title="View BOM"
            >
              <ArrowTopRightOnSquareIcon className={`h-5 w-5 ${theme.text}`} />
            </IconButton>
            <IconButton
              variant="text"
              size="sm"
              onClick={() => {
                setProductToEdit(product);
                setIsEditModalOpen(true);
              }}
              title="Edit Product"
            >
              <PencilIcon className={`h-5 w-5 ${theme.text}`} />
            </IconButton>
            <IconButton
              variant="text"
              size="sm"
              onClick={() => {
                setProductToDelete(product);
                setIsDeleteDialogOpen(true);
              }}
              title="Delete Product"
              color="red"
            >
              <TrashIcon className={`h-5 w-5`} />
            </IconButton>
          </div>
        </td>
        
        {/* ✅ UPDATED: Make Product Code clickable */}
        <td className={getCellClasses()}>
          <Typography 
            variant="small" 
            className={`font-bold ${theme.text} cursor-pointer hover:text-blue-500 transition-colors`}
            onClick={() => onViewProduct?.(product.productCode)}  // ✅ Click handler
          >
            {product.productCode || '-'}
          </Typography>
        </td>
        
        <td className={getCellClasses(false, 'left')}>
          <Typography variant="small" className={`font-normal ${theme.text}`}>
            {product.description || '-'}
          </Typography>
        </td>
        <td className={getCellClasses(true)}>
          <Typography variant="small" className={`font-normal ${theme.text}`}>
            {product.hourlyRunRate ? Number(product.hourlyRunRate).toFixed(2) : 'N/A'}
          </Typography>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center p-8">
              <Typography color="gray" className={theme.text}>
                No products found matching "{searchQuery}"
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
      
      
      {/* BLOCK 10: Modals */}
<BomDetailModal
  open={isBomModalOpen}
  handleOpen={() => handleOpenBomModal(null)}
  product={productToView}
/>

<CreateProductForm
  open={isCreateModalOpen}
  handleOpen={() => setIsCreateModalOpen(false)}
  onProductCreated={() => loadProducts()}
/>

<EditProductForm
  open={isEditModalOpen}
  handleOpen={() => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  }}
  product={productToEdit}
  onProductUpdated={() => loadProducts()}
/>

<ConfirmationDialog
  open={isDeleteDialogOpen}
  title="Delete Product"
  message={`Are you sure you want to delete product "${productToDelete?.productCode}"? This action cannot be undone.`}
  onConfirm={handleDeleteProduct}
  onCancel={() => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  }}
  confirmText="Delete"
  cancelText="Cancel"
  confirmColor="red"
  loading={deleteLoading}
/>
    </>
  );
}