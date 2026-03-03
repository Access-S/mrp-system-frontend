// src/components/pages/testing/UITestPage2.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

// ============== BLOCK 2: Component ==============

const UITestPage2: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text}`}>UI Components Test - Page 2</h1>
        <p className={`${theme.text} opacity-60 mt-1`}>
          Testing additional UI components (Pagination, Tooltip, etc.)
        </p>
      </div>

      {/* Pagination Section - Coming Soon */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Pagination</h2>
        <p className={`${theme.text} opacity-60`}>Pagination component will be added here.</p>
      </section>

      {/* Tooltip Section - Coming Soon */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Tooltip</h2>
        <p className={`${theme.text} opacity-60`}>Tooltip component will be added here.</p>
      </section>

      {/* Breadcrumb Section - Coming Soon */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Breadcrumb</h2>
        <p className={`${theme.text} opacity-60`}>Breadcrumb component will be added here.</p>
      </section>

      {/* Badge Section - Coming Soon */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Badge</h2>
        <p className={`${theme.text} opacity-60`}>Badge component will be added here.</p>
      </section>

      {/* Avatar Section - Coming Soon */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Avatar</h2>
        <p className={`${theme.text} opacity-60`}>Avatar component will be added here.</p>
      </section>

      {/* Component Checklist */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Page 2 Components</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Pagination", status: "pending" },
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

// ============== BLOCK 3: Export ==============

export default UITestPage2;