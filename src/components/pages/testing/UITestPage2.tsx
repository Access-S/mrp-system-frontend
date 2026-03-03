// src/components/pages/testing/UITestPage2.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Pagination, PaginationInfo } from "../../ui/Pagination";
import { Table } from "../../ui/Table";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";

// ============== BLOCK 2: Sample Data ==============

const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(4, "0")}`,
  price: `$${(Math.random() * 500 + 10).toFixed(2)}`,
}));

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
          Testing additional UI components (Pagination, Tooltip, etc.)
        </p>
      </div>

      {/* ============== BLOCK 5: Pagination Section ============== */}

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
              onPageChange={() => {}}
              disabled
            />
          </div>
        </div>
      </section>

      {/* ============== BLOCK 6: Pagination with Table ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Pagination with Table</h2>

        <Table>
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
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell>{item.sku}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
      </section>

      {/* ============== BLOCK 7: Component Checklist ============== */}

      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Page 2 Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Pagination", status: "done" },
            { name: "Tooltip", status: "pending" },
            { name: "Breadcrumb", status: "pending" },
            { name: "Badge", status: "pending" },
            { name: "Avatar", status: "pending" },
          ].map((component) => (
            <div
              key={component.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${theme.borderColor}`}
            >
              <span className={theme.text}>{component.name}</span>
              <span
                className={`px-2 py-0.5 rounded-sm text-xs font-medium ${
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

// ============== BLOCK 8: Export ==============

export default UITestPage2;