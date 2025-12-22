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
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { productService } from "../../services/product.service";
import { ProductInfoTab } from "../tabs/ProductInfoTab";
import { BomManagementTab } from "../tabs/BomManagementTab";
import { ElasticTabs } from "../ui/ElasticTabs";  // ✅ Add this import

// BLOCK 2: Interface
interface ProductDetailPageProps {
  productCode: string;
  onBack: () => void;
}

// BLOCK 3: Main Component
export function ProductDetailPage({ productCode, onBack }: ProductDetailPageProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("info");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // BLOCK 4: Fetch Product Data
  useEffect(() => {
    loadProductData();
  }, [productCode]);

  const loadProductData = () => {
    setLoading(true);
    productService.getAllProducts()
      .then(products => {
        const foundProduct = products.find(p => p.productCode === productCode);
        setProduct(foundProduct || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

// BLOCK 5: Tab Configuration
const tabs = [
    { label: "Product Info", value: "info" },
    { label: "Bill of Materials", value: "bom" },
    { label: "Inventory", value: "inventory", disabled: true },
    { label: "Purchase Orders", value: "po", disabled: true }
  ];

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

  // BLOCK 8: Main Render
return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className={`${theme.cards} shadow-sm`}>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconButton
                variant="text"
                onClick={onBack}
                className={theme.text}
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </IconButton>
              <div>
                <Typography variant="h4" className={`${theme.text} font-bold`}>
                  {product.productCode}
                </Typography>
                <Typography variant="small" className={`${theme.text} opacity-70`}>
                  {product.description}
                </Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="small" className={`${theme.text} opacity-70`}>
                Hourly Run Rate
              </Typography>
              <Typography variant="h5" className={`${theme.text} font-bold`}>
                {product.hourlyRunRate ? product.hourlyRunRate.toFixed(2) : 'N/A'}
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
  
      {/* Elastic Tabs Section */}
      <ElasticTabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
  
      {/* Tab Content Section */}
      <Card className={`${theme.cards} shadow-sm`}>
        <CardBody className="p-6">
          {activeTab === "info" && (
            <ProductInfoTab 
              product={product} 
              onUpdate={loadProductData}
            />
          )}
          {activeTab === "bom" && (
            <BomManagementTab 
              product={product}
              onUpdate={loadProductData}
            />
          )}
          {activeTab === "inventory" && (
            <Typography className={theme.text}>
              Inventory tracking coming soon...
            </Typography>
          )}
          {activeTab === "po" && (
            <Typography className={theme.text}>
              Purchase orders related to this product coming soon...
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}