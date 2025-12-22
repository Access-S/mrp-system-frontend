//src/components/pages/ProductsPage.tsx

// BLOCK 1: Imports
import React, { useState, useEffect, useMemo } from "react";
import {
  Card, Typography, CardBody, Spinner, Input, Button
} from "@material-tailwind/react";
import { Product } from "../../types/mrp.types";
import { fetchAllProducts } from "../../services/api.service";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  MagnifyingGlassIcon, 
  PlusIcon
} from "@heroicons/react/24/outline";
import { CreateProductForm } from "../forms/CreateProductForm";

// BLOCK 2: Main ProductsPage Component
interface ProductsPageProps {
  onViewProduct?: (productCode: string) => void;
}

export function ProductsPage({ onViewProduct }: ProductsPageProps) {
  const { theme } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const TABLE_HEAD = ["Product Code", "Description"];

// BLOCK 3: Fetch Products
useEffect(() => {
  loadProducts();
}, []);

const loadProducts = () => {
  setLoading(true);
  
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
                thClasses = thClasses.replace('text-center', 'text-left');  // ✅ Left-align description header
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
              let classes = `p-4 border-b ${theme.borderColor} text-${align}`;  // ✅ Increased padding from p-1 to p-4
              if (!isLast) {
                classes += ` border-r ${theme.borderColor}`;
              }
              return classes;
            };

            return (
              <tr 
                key={product.id} 
                className={`${theme.hoverBg} cursor-pointer transition-colors`}  // ✅ Added cursor-pointer
                onClick={() => onViewProduct?.(product.productCode)}  // ✅ Make entire row clickable
              >
                <td className={getCellClasses()}>
                  <Typography variant="small" className={`font-bold ${theme.text}`}>
                    {product.productCode || '-'}
                  </Typography>
                </td>
                <td className={getCellClasses(true, 'left')}>  {/* ✅ Left-align description, mark as last */}
                  <Typography variant="small" className={`font-normal ${theme.text}`}>
                    {product.description || '-'}
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