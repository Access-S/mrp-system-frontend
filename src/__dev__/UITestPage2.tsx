// dev/UITestPage2.tsx 
// 
// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Pagination, PaginationInfo } from "@/components/ui/Pagination";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Tooltip } from "@/components/ui/Tooltip";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";

// ============== BLOCK 2: Sample Data ==============

const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, "0")}`,
  price: `$${(Math.random() * 500 + 10).toFixed(2)}`,
}));

const sampleUsers = [
  { name: "John Doe", src: "https://i.pravatar.cc/150?img=1" },
  { name: "Jane Smith", src: "https://i.pravatar.cc/150?img=2" },
  { name: "Bob Johnson", src: "https://i.pravatar.cc/150?img=3" },
  { name: "Alice Brown", src: "https://i.pravatar.cc/150?img=4" },
  { name: "Charlie Wilson", src: "https://i.pravatar.cc/150?img=5" },
  { name: "Diana Prince", src: "https://i.pravatar.cc/150?img=6" },
];

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Electronics", href: "/products/electronics" },
  { label: "Laptops", href: "/products/electronics/laptops" },
  { label: "MacBook Pro" },
];

const shortBreadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
  { label: "Profile" },
];

// ============== BLOCK 3: Component ==============

const UITestPage2: React.FC = () => {
  const { theme } = useTheme();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate paginated data for table
  const paginatedData = sampleData.slice(
    (tableCurrentPage - 1) * itemsPerPage,
    tableCurrentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);

  // ============== BLOCK 4: Render ==============

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>UI Components Test - Page 2</h1>
        <p className={`${theme.text} opacity-60 mt-1`}>
          Testing additional UI components (Pagination, Badge, Avatar, Tooltip, Breadcrumb)
        </p>
      </div>

      {/* ============== BLOCK 5: Badge Section ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Badge</h2>

        <div className="space-y-8">
          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="solid" color="primary">Solid</Badge>
              <Badge variant="outline" color="primary">Outline</Badge>
              <Badge variant="subtle" color="primary">Subtle</Badge>
            </div>
          </div>

          {/* Colors - Solid */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Colors (Solid)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="solid" color="gray">Gray</Badge>
              <Badge variant="solid" color="primary">Primary</Badge>
              <Badge variant="solid" color="success">Success</Badge>
              <Badge variant="solid" color="warning">Warning</Badge>
              <Badge variant="solid" color="error">Error</Badge>
            </div>
          </div>

          {/* Colors - Outline */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Colors (Outline)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" color="gray">Gray</Badge>
              <Badge variant="outline" color="primary">Primary</Badge>
              <Badge variant="outline" color="success">Success</Badge>
              <Badge variant="outline" color="warning">Warning</Badge>
              <Badge variant="outline" color="error">Error</Badge>
            </div>
          </div>

          {/* Colors - Subtle */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Colors (Subtle)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="subtle" color="gray">Gray</Badge>
              <Badge variant="subtle" color="primary">Primary</Badge>
              <Badge variant="subtle" color="success">Success</Badge>
              <Badge variant="subtle" color="warning">Warning</Badge>
              <Badge variant="subtle" color="error">Error</Badge>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm" color="primary">Small</Badge>
              <Badge size="md" color="primary">Medium</Badge>
              <Badge size="lg" color="primary">Large</Badge>
            </div>
          </div>

          {/* With Dot */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Dot Indicator</h3>
            <div className="flex flex-wrap gap-3">
              <Badge dot color="success">Online</Badge>
              <Badge dot color="error">Offline</Badge>
              <Badge dot color="warning">Away</Badge>
              <Badge dot color="primary">Active</Badge>
            </div>
          </div>

          {/* With Icon */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Icon</h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                color="success"
                icon={
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Verified
              </Badge>
              <Badge
                color="error"
                icon={
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                }
              >
                Rejected
              </Badge>
              <Badge
                color="warning"
                icon={
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Warning
              </Badge>
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Use Cases</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={theme.text}>Notifications</span>
                <Badge variant="solid" color="error" size="sm">5</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className={theme.text}>Status:</span>
                <Badge variant="subtle" color="success" dot>Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className={theme.text}>Version</span>
                <Badge variant="outline" color="gray">v2.1.0</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 6: Avatar Section ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Avatar</h2>

        <div className="space-y-8">
          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="flex items-end gap-4">
              <Avatar size="xs" name="John Doe" />
              <Avatar size="sm" name="John Doe" />
              <Avatar size="md" name="John Doe" />
              <Avatar size="lg" name="John Doe" />
              <Avatar size="xl" name="John Doe" />
            </div>
          </div>

          {/* With Images */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Images</h3>
            <div className="flex items-center gap-4">
              {sampleUsers.slice(0, 4).map((user, index) => (
                <Avatar key={index} src={user.src} name={user.name} />
              ))}
            </div>
          </div>

          {/* Initials Fallback */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Initials Fallback (No Image)</h3>
            <div className="flex items-center gap-4">
              <Avatar name="John Doe" />
              <Avatar name="Jane Smith" />
              <Avatar name="Bob" />
              <Avatar name="Alice Brown" />
              <Avatar name="Charlie Wilson" />
            </div>
          </div>

          {/* Default Icon Fallback */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Default Icon (No Name/Image)</h3>
            <div className="flex items-center gap-4">
              <Avatar size="sm" />
              <Avatar size="md" />
              <Avatar size="lg" />
            </div>
          </div>

          {/* Broken Image Fallback */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Broken Image (Falls back to Initials)</h3>
            <div className="flex items-center gap-4">
              <Avatar src="https://broken-link.jpg" name="Fallback User" />
              <Avatar src="https://invalid-url.png" name="Test Person" />
            </div>
          </div>

          {/* With Status */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Status Indicator</h3>
            <div className="flex items-center gap-4">
              <Avatar name="Online User" status="online" />
              <Avatar name="Offline User" status="offline" />
              <Avatar name="Busy User" status="busy" />
              <Avatar name="Away User" status="away" />
            </div>
          </div>

          {/* With Status - Different Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Status with Different Sizes</h3>
            <div className="flex items-end gap-4">
              <Avatar size="xs" name="User" status="online" />
              <Avatar size="sm" name="User" status="online" />
              <Avatar size="md" name="User" status="online" />
              <Avatar size="lg" name="User" status="online" />
              <Avatar size="xl" name="User" status="online" />
            </div>
          </div>

          {/* Rounded Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Shape Variants</h3>
            <div className="flex items-center gap-4">
              <Avatar name="Round Avatar" rounded={true} />
              <Avatar name="Square Avatar" rounded={false} />
            </div>
          </div>

          {/* Avatar Group */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Avatar Group</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Default (max 4)</p>
                <AvatarGroup>
                  {sampleUsers.map((user, index) => (
                    <Avatar key={index} src={user.src} name={user.name} />
                  ))}
                </AvatarGroup>
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Max 3</p>
                <AvatarGroup max={3}>
                  {sampleUsers.map((user, index) => (
                    <Avatar key={index} src={user.src} name={user.name} />
                  ))}
                </AvatarGroup>
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Different Sizes</p>
                <div className="flex items-center gap-6">
                  <AvatarGroup max={3} size="sm">
                    {sampleUsers.map((user, index) => (
                      <Avatar key={index} name={user.name} />
                    ))}
                  </AvatarGroup>
                  <AvatarGroup max={3} size="lg">
                    {sampleUsers.map((user, index) => (
                      <Avatar key={index} name={user.name} />
                    ))}
                  </AvatarGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 7: Tooltip Section ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Tooltip</h2>

        <div className="space-y-8">
          {/* Basic */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Basic (Hover + Focus)</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="This is a tooltip">
                <Button>Hover me</Button>
              </Tooltip>
              <Tooltip content="Click to submit the form">
                <Button variant="secondary">With helpful text</Button>
              </Tooltip>
            </div>
          </div>

          {/* Positions */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Positions</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Tooltip on top" position="top">
                <Button variant="secondary">Top</Button>
              </Tooltip>
              <Tooltip content="Tooltip on bottom" position="bottom">
                <Button variant="secondary">Bottom</Button>
              </Tooltip>
            </div>
          </div>

          {/* Triggers */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Trigger Types</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Hover only tooltip" trigger="hover">
                <Button variant="secondary">Hover Only</Button>
              </Tooltip>
              <Tooltip content="Focus only tooltip (Tab to focus)" trigger="focus">
                <Button variant="secondary">Focus Only (Tab)</Button>
              </Tooltip>
              <Tooltip content="Both hover and focus" trigger="both">
                <Button variant="secondary">Both (Default)</Button>
              </Tooltip>
            </div>
          </div>

          {/* Without Arrow */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Without Arrow</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="No arrow tooltip" arrow={false}>
                <Button variant="secondary">No Arrow</Button>
              </Tooltip>
              <Tooltip content="With arrow (default)" arrow={true}>
                <Button variant="secondary">With Arrow</Button>
              </Tooltip>
            </div>
          </div>

          {/* Custom Delay */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Custom Delay</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Instant tooltip" delay={0}>
                <Button variant="secondary">No Delay</Button>
              </Tooltip>
              <Tooltip content="Default delay (200ms)" delay={200}>
                <Button variant="secondary">200ms (Default)</Button>
              </Tooltip>
              <Tooltip content="Slow tooltip" delay={500}>
                <Button variant="secondary">500ms Delay</Button>
              </Tooltip>
            </div>
          </div>

          {/* Disabled */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Disabled Tooltip</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="You won't see this" disabled>
                <Button variant="secondary">Disabled Tooltip</Button>
              </Tooltip>
            </div>
          </div>

          {/* With Different Elements */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Different Elements</h3>
            <div className="flex flex-wrap items-center gap-6">
              <Tooltip content="User avatar info">
                <Avatar name="Hover Avatar" status="online" />
              </Tooltip>
              <Tooltip content="This badge indicates status">
                <Badge color="success" dot>Active</Badge>
              </Tooltip>
              <Tooltip content="Click to view more info">
                <span className={`text-blue-500 underline cursor-pointer ${theme.text}`}>
                  Hover this link
                </span>
              </Tooltip>
              <Tooltip content="Icon button action">
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Rich Content */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Rich Content</h3>
            <div className="flex flex-wrap gap-4">
              <Tooltip
                content={
                  <div className="text-center">
                    <div className="font-semibold">Pro Feature</div>
                    <div className="text-xs opacity-80">Upgrade to unlock</div>
                  </div>
                }
              >
                <Button variant="secondary">Multi-line Tooltip</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 8: Breadcrumb Section ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Breadcrumb</h2>

        <div className="space-y-8">
          {/* Basic */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Basic</h3>
            <Breadcrumb items={shortBreadcrumbItems} />
          </div>

          {/* With Home Icon */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Home Icon</h3>
            <Breadcrumb
              showHome
              homeHref="/"
              items={[
                { label: "Products", href: "/products" },
                { label: "Electronics", href: "/electronics" },
                { label: "Laptops" },
              ]}
            />
          </div>

          {/* Long Path */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Long Path (No Collapse)</h3>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Collapsible */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Collapsible (maxItems=3)</h3>
            <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Click "•••" to expand</p>
            <Breadcrumb items={breadcrumbItems} maxItems={3} />
          </div>

          {/* Collapsible with Home */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Collapsible with Home Icon</h3>
            <Breadcrumb
              showHome
              homeHref="/"
              items={[
                { label: "Category", href: "/category" },
                { label: "Subcategory", href: "/category/sub" },
                { label: "Products", href: "/category/sub/products" },
                { label: "Item Details", href: "/category/sub/products/item" },
                { label: "Edit" },
              ]}
              maxItems={3}
            />
          </div>

          {/* Custom Separator */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Custom Separator</h3>
            <div className="space-y-3">
              <Breadcrumb
                items={shortBreadcrumbItems}
                separator="/"
              />
              <Breadcrumb
                items={shortBreadcrumbItems}
                separator="→"
              />
              <Breadcrumb
                items={shortBreadcrumbItems}
                separator="|"
              />
            </div>
          </div>

          {/* With onClick Handlers */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Click Handlers</h3>
            <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Check console for click events</p>
            <Breadcrumb
              items={[
                { label: "Home", onClick: () => console.log("Navigate to Home") },
                { label: "Products", onClick: () => console.log("Navigate to Products") },
                { label: "Current Page" },
              ]}
            />
          </div>

          {/* Real World Example */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Real World Example</h3>
            <div className={`p-4 rounded-lg border ${theme.borderColor} bg-gray-50 dark:bg-gray-800/50`}>
              <Breadcrumb
                showHome
                homeHref="/"
                items={[
                  { label: "Inventory", href: "/inventory" },
                  { label: "Products", href: "/inventory/products" },
                  { label: "SKU-001234" },
                ]}
              />
              <h1 className={`text-xl font-bold ${theme.text} mt-4`}>Product Details: SKU-001234</h1>
              <p className={`text-sm ${theme.text} opacity-60 mt-1`}>
                View and manage product information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BLOCK 9: Pagination Section ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-6`}>Pagination</h2>

        <div className="space-y-10">
          {/* Basic Pagination */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Basic</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
            <p className={`text-sm ${theme.text} opacity-50 mt-2`}>
              Current page: {currentPage}
            </p>
          </div>

          {/* Variants */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Variants</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Default</p>
                <Pagination
                  currentPage={currentPage2}
                  totalPages={10}
                  onPageChange={setCurrentPage2}
                  variant="default"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Outlined</p>
                <Pagination
                  currentPage={currentPage2}
                  totalPages={10}
                  onPageChange={setCurrentPage2}
                  variant="outlined"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Filled</p>
                <Pagination
                  currentPage={currentPage2}
                  totalPages={10}
                  onPageChange={setCurrentPage2}
                  variant="filled"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Small</p>
                <Pagination
                  currentPage={currentPage3}
                  totalPages={10}
                  onPageChange={setCurrentPage3}
                  size="sm"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Medium (Default)</p>
                <Pagination
                  currentPage={currentPage3}
                  totalPages={10}
                  onPageChange={setCurrentPage3}
                  size="md"
                />
              </div>
              <div>
                <p className={`text-xs ${theme.text} opacity-50 mb-2`}>Large</p>
                <Pagination
                  currentPage={currentPage3}
                  totalPages={10}
                  onPageChange={setCurrentPage3}
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Without First/Last */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Without First/Last Buttons</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              showFirstLast={false}
            />
          </div>

          {/* Without Page Numbers */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Without Page Numbers (Simple)</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
              showPageNumbers={false}
              showFirstLast={false}
            />
          </div>

          {/* With Info */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Page Info</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <PaginationInfo
                currentPage={currentPage}
                totalPages={10}
                totalItems={100}
                itemsPerPage={10}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          {/* Many Pages */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Many Pages (with ellipsis)</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={50}
              onPageChange={setCurrentPage}
              maxVisiblePages={7}
            />
          </div>

          {/* Disabled */}
          <div>
            <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Disabled</h3>
            <Pagination
              currentPage={5}
              totalPages={10}
              onPageChange={() => { }}
              disabled
            />
          </div>
        </div>
      </section>

      {/* ============== BLOCK 10: Pagination with Table ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>
          Pagination with Table
        </h2>

        {/* TABLE CONTAINER */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">

          {/* TABLE SCROLL AREA */}
          <div className="overflow-x-auto">
            <Table stickyHeader hoverable variant="striped" size="md">
              <Table.Header>
                <Table.Row>
                  <Table.Head>ID</Table.Head>
                  <Table.Head>Product Name</Table.Head>
                  <Table.Head>SKU</Table.Head>
                  <Table.Head>Price</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {paginatedData.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-100">
                      {item.id}
                    </Table.Cell>
                    <Table.Cell className="font-semibold">
                      {item.name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-500 dark:text-gray-400">
                      {item.sku}
                    </Table.Cell>
                    <Table.Cell className="font-medium">
                      {item.price}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {/* FOOTER SEPARATOR */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
            <PaginationInfo
              currentPage={tableCurrentPage}
              totalPages={totalPages}
              totalItems={sampleData.length}
              itemsPerPage={itemsPerPage}
            />
            <Pagination
              currentPage={tableCurrentPage}
              totalPages={totalPages}
              onPageChange={setTableCurrentPage}
            />
          </div>

        </div>
      </section>

      {/* ============== BLOCK 11: Component Checklist ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Page 2 Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Pagination", status: "done" },
            { name: "Badge", status: "done" },
            { name: "Avatar", status: "done" },
            { name: "Tooltip", status: "done" },
            { name: "Breadcrumb", status: "done" },
          ].map((component) => (
            <div
              key={component.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${theme.borderColor}`}
            >
              <span className={theme.text}>{component.name}</span>
              <Badge
                variant="subtle"
                color={component.status === "done" ? "success" : "warning"}
                size="sm"
              >
                {component.status === "done" ? "✓ Done" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============== BLOCK 12: Export ==============

export default UITestPage2;