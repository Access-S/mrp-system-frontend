// src/components/pages/UITestPage.tsx


import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Dialog } from "../ui/Dialog";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import { StatusBadge, Status } from "../ui/StatusBadge";
import { WidgetCard, WidgetHeader, WidgetBody, MiniActionButton } from "../ui/WidgetCard";
import { PlusIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";

const UITestPage: React.FC = () => {
  const { theme, themeName, setThemeName } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogWithFooterOpen, setIsDialogWithFooterOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  const allStatuses: Status[] = [
    "Open",
    "Completed",
    "Despatched/ Completed",
    "PO Check",
    "PO Canceled",
    "Closed",
  ];

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

      {/* Section 1: Buttons */}
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
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* States */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>States</h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button loading variant="secondary">Loading Secondary</Button>
          </div>
        </div>

        {/* With Icons */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>With Icons</h3>
          <div className="flex flex-wrap gap-3">
            <Button leftIcon={<PlusIcon className="w-4 h-4" />}>Add Item</Button>
            <Button rightIcon={<ArrowPathIcon className="w-4 h-4" />} variant="secondary">
              Refresh
            </Button>
            <Button
              leftIcon={<EyeIcon className="w-4 h-4" />}
              rightIcon={<span className="text-xs">→</span>}
              variant="ghost"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Full Width */}
        <div>
          <h3 className={`text-sm font-medium ${theme.text} opacity-70 mb-3`}>Full Width</h3>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </section>

      {/* Section 2: Inputs */}
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

      {/* Section 3: Status Badges */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          {allStatuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      {/* Section 4: Cards */}
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

      {/* Section 5: Widget Cards */}
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

      {/* Section 6: Dialogs */}
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

      {/* Section 7: Component Checklist */}
      <section className={`${theme.cards} rounded-xl p-6 shadow-sm border ${theme.borderColor}`}>
        <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Migration Checklist</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Button", status: "done" },
            { name: "Input", status: "done" },
            { name: "Dialog", status: "done" },
            { name: "Card", status: "done" },
            { name: "StatusBadge", status: "done" },
            { name: "WidgetCard", status: "done" },
            { name: "Typography", status: "pending" },
            { name: "Spinner", status: "pending" },
            { name: "IconButton", status: "pending" },
            { name: "Menu/Dropdown", status: "pending" },
            { name: "Accordion", status: "pending" },
            { name: "Alert", status: "pending" },
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

export default UITestPage;