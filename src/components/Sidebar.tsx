// src/components/Sidebar.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState } from "react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  CubeIcon,
  ServerStackIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  DocumentTextIcon,
  BeakerIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { Button } from "./ui/Button";
import { Accordion } from "./ui/Accordion";
import { Card } from "./ui/Card";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../styles/themes";
import { Page } from "../App";

// ============== BLOCK 2: Types ==============

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

// ============== BLOCK 3: Component ==============

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, themeName, setThemeName } = useTheme();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // ============== BLOCK 4: Helper to render a list item ==============
  const renderListItem = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    isSelected: boolean,
    disabled = false
  ) => (
    <li
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
        ${isSelected ? "bg-gray-100 dark:bg-gray-700" : ""}
        ${theme.sidebarText}
      `}
      aria-disabled={disabled}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      <span className="flex-1 text-sm font-normal">{label}</span>
    </li>
  );

  // ============== BLOCK 5: Sidebar content (shared) ==============
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 mb-6 flex justify-center items-center">
        <h1 className="font-sora font-semibold tracking-widest text-[#E6EAF2] text-3xl uppercase">
          EON
          <span className="text-[#00C2FF] drop-shadow-[0_0_2px_rgba(0,194,255,0.5)]">Ξ</span>
          XIS
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion allowMultiple={false} variant="default" size="md">
          {/* Dashboard (non-accordion item) */}
          <div className="mb-1">
            {renderListItem(
              "Dashboard",
              <PresentationChartBarIcon className={`h-5 w-5 ${theme.sidebarText}`} />,
              () => {
                setActivePage("dashboard");
                closeMobileMenu();
              },
              activePage === "dashboard"
            )}
          </div>

          {/* Operations Accordion */}
          <Accordion.Item id="operations">
            <Accordion.Trigger
              icon={<Cog6ToothIcon className={`h-5 w-5 ${theme.sidebarText}`} />}
            >
              <span className={`text-sm font-normal ${theme.sidebarText}`}>Operations</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <ul className="space-y-1">
                {renderListItem(
                  "Purchase Orders",
                  <ShoppingBagIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("purchase-orders");
                    closeMobileMenu();
                  },
                  activePage === "purchase-orders"
                )}
                {renderListItem(
                  "Inventory",
                  <ArchiveBoxIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("inventory");
                    closeMobileMenu();
                  },
                  activePage === "inventory"
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          {/* Insights & Reporting Accordion */}
          <Accordion.Item id="insights">
            <Accordion.Trigger
              icon={<ChartPieIcon className={`h-5 w-5 ${theme.sidebarText}`} />}
            >
              <span className={`text-sm font-normal ${theme.sidebarText}`}>Insights & Reporting</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <ul className="space-y-1">
                {renderListItem(
                  "Analytics",
                  <ChartBarSquareIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("analytics");
                    closeMobileMenu();
                  },
                  activePage === "analytics",
                  true
                )}
                {renderListItem(
                  "Reporting",
                  <DocumentTextIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("reporting");
                    closeMobileMenu();
                  },
                  activePage === "reporting",
                  true
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          {/* System Data Accordion */}
          <Accordion.Item id="system-data">
            <Accordion.Trigger
              icon={<ServerStackIcon className={`h-5 w-5 ${theme.sidebarText}`} />}
            >
              <span className={`text-sm font-normal ${theme.sidebarText}`}>System Data</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <ul className="space-y-1">
                {renderListItem(
                  "Products (BOM)",
                  <CubeIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("products");
                    closeMobileMenu();
                  },
                  activePage === "products"
                )}
                {renderListItem(
                  "Forecasts",
                  <ChartBarSquareIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("forecasts");
                    closeMobileMenu();
                  },
                  activePage === "forecasts"
                )}
                {renderListItem(
                  "Stock on Hand",
                  <ClipboardDocumentListIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("soh");
                    closeMobileMenu();
                  },
                  activePage === "soh"
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>

          {/* Testing Room Accordion */}
          <Accordion.Item id="testing">
            <Accordion.Trigger
              icon={<BeakerIcon className={`h-5 w-5 ${theme.sidebarText}`} />}
            >
              <span className={`text-sm font-normal ${theme.sidebarText}`}>Testing Room</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <ul className="space-y-1">
                {renderListItem(
                  "UI Components",
                  <CubeIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("ui-test");
                    closeMobileMenu();
                  },
                  activePage === "ui-test"
                )}
                {renderListItem(
                  "UI Components 2",
                  <CubeIcon className={`h-4 w-4 ${theme.sidebarText}`} />,
                  () => {
                    setActivePage("ui-test-2");
                    closeMobileMenu();
                  },
                  activePage === "ui-test-2"
                )}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Bottom section */}
      <div className="mt-auto">
        <hr className="my-4 border-gray-300" />
        <ul className="space-y-1">
          {renderListItem(
            "Profile",
            <UserCircleIcon className={`h-5 w-5 ${theme.sidebarText}`} />,
            () => {},
            false
          )}

          {/* Settings Accordion with nested theme selector */}
          <Accordion allowMultiple={false} variant="default" size="md">
            <Accordion.Item id="settings">
              <Accordion.Trigger
                icon={<Cog6ToothIcon className={`h-5 w-5 ${theme.sidebarText}`} />}
              >
                <span className={`text-sm font-normal ${theme.sidebarText}`}>Settings</span>
              </Accordion.Trigger>
              <Accordion.Content>
                <ul className="space-y-1">
                  {renderListItem(
                    "General",
                    <ChevronRightIcon className={`h-3 w-5 ${theme.sidebarText}`} />,
                    () => {},
                    false
                  )}
                  {renderListItem(
                    "Notifications",
                    <ChevronRightIcon className={`h-3 w-5 ${theme.sidebarText}`} />,
                    () => {},
                    false
                  )}
                  {/* Themes sub-accordion */}
                  <Accordion allowMultiple={false} variant="default" size="sm">
                    <Accordion.Item id="themes">
                      <Accordion.Trigger
                        icon={<PaintBrushIcon className={`h-4 w-4 ${theme.sidebarText}`} />}
                      >
                        <span className={`text-sm font-normal ${theme.sidebarText}`}>Themes</span>
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <ul className="space-y-1">
                          {Object.entries(themes).map(([key, themeOption]) => (
                            <li
                              key={key}
                              onClick={() => setThemeName(key as keyof typeof themes)}
                              className={`
                                flex items-center gap-3 px-2 py-1 rounded-lg cursor-pointer transition-colors
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                ${themeName === key ? (theme.isDark ? "bg-gray-700" : theme.activeRowBg) : ""}
                                ${theme.sidebarText}
                              `}
                            >
                              <div
                                className={`
                                  w-4 h-4 rounded-full flex items-center justify-center
                                  border-2 ${theme.isDark ? "border-gray-400" : "border-gray-700"}
                                `}
                              >
                                <div
                                  className={`
                                    w-2 h-2 rounded-full transition-transform duration-200 ease-in-out
                                    ${theme.isDark ? "bg-gray-200" : "bg-gray-800"}
                                    ${themeName === key ? "scale-100" : "scale-0"}
                                  `}
                                />
                              </div>
                              <span className={`text-xs ${themeName === key ? "font-medium" : ""}`}>
                                {themeOption.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                  {renderListItem(
                    "Privacy",
                    <ChevronRightIcon className={`h-3 w-5 ${theme.sidebarText}`} />,
                    () => {},
                    false
                  )}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          {renderListItem(
            "Log Out",
            <PowerIcon className={`h-5 w-5 ${theme.sidebarText}`} />,
            () => {},
            false
          )}
        </ul>
      </div>
    </div>
  );

  // ============== BLOCK 6: Render ==============
  return (
    <>
      {/* Mobile trigger button */}
      <Button
        variant="ghost"
        size="lg"
        onClick={toggleMobileMenu}
        className="lg:hidden"
        aria-label="Open sidebar"
      >
        {mobileMenuOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <svg className="h-8 w-8 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </Button>

      {/* Mobile overlay drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div
            className={`fixed top-0 left-0 h-full w-64 z-50 lg:hidden ${theme.cards} border-r ${theme.isDark ? 'border-slate-700' : 'border-slate-200'} shadow-xl transition-transform duration-300`}
          >
            <div className="h-full overflow-y-auto p-4">
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col w-64 h-screen sticky top-0 overflow-y-auto
          ${theme.cards} border-r ${theme.isDark ? "border-slate-700" : "border-slate-200"}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}