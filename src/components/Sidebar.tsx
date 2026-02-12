import React, { useState, useRef, useEffect } from "react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  CubeIcon,
  ServerStackIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../styles/themes";
import { Page } from "../App";

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

interface MenuItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    id: "operations",
    label: "Operations",
    icon: ShoppingBagIcon,
    items: [
      { id: "purchase-orders", label: "Purchase Orders", icon: ArchiveBoxIcon },
      { id: "inventory", label: "Inventory", icon: CubeIcon },
    ],
  },
  {
    id: "insights",
    label: "Insights & Reporting",
    icon: ChartPieIcon,
    items: [
      { id: "analytics", label: "Analytics", icon: ChartBarSquareIcon, disabled: true },
      { id: "reporting", label: "Reporting", icon: DocumentTextIcon, disabled: true },
    ],
  },
  {
    id: "system-data",
    label: "System Data",
    icon: ServerStackIcon,
    items: [
      { id: "products", label: "Products (BOM)", icon: CubeIcon },
      { id: "forecasts", label: "Forecasts", icon: ChartBarSquareIcon },
      { id: "soh", label: "Stock on Hand", icon: ClipboardDocumentListIcon },
    ],
  },
];

const SETTINGS_ITEMS = ["General", "Notifications", "Privacy"];

// Accordion Component with proper animation
const Accordion: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
}> = ({ isOpen, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div
      style={{
        maxHeight: `${height}px`,
        transition: "max-height 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [themesOpen, setThemesOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { theme, themeName, setThemeName } = useTheme();

  const toggleAccordion = (value: string) => {
    setOpenAccordion(openAccordion === value ? "" : value);
  };

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsDrawerOpen(false);
  };

  const sidebarClasses = `flex h-screen w-full max-w-[20rem] flex-col bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 shadow-xl border-r dark:border-slate-700`;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            MRP
          </div>
          <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
            MRP System
          </h5>
        </div>
      </div>

      {/* Scrollable Middle Section */}
      <nav className="flex-1 px-2 overflow-y-auto flex flex-col gap-1">
        {/* Dashboard */}
        <button
          onClick={() => handleNavClick("dashboard")}
          className={`flex items-center w-full p-3 rounded-lg transition-all text-left ${
            activePage === "dashboard"
              ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
              : "hover:bg-blue-50 dark:hover:bg-slate-800"
          }`}
        >
          <PresentationChartBarIcon className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </button>

        {/* Menu Groups */}
        {MENU_GROUPS.map((group) => {
          const isOpen = openAccordion === group.id;
          return (
            <div key={group.id}>
              <button
                onClick={() => toggleAccordion(group.id)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-all text-left ${
                  isOpen
                    ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                    : "hover:bg-blue-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center">
                  <group.icon className="w-5 h-5 mr-3" />
                  <span>{group.label}</span>
                </div>
                <ChevronDownIcon
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              <Accordion isOpen={isOpen}>
                <div className="py-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.disabled && handleNavClick(item.id)}
                      disabled={item.disabled}
                      className={`flex items-center w-full p-2.5 pl-12 rounded-lg transition-all text-sm text-left ${
                        activePage === item.id
                          ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
                          : "hover:bg-blue-50 dark:hover:bg-slate-800"
                      } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <ChevronRightIcon className="w-3 h-3 mr-2 opacity-50" />
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {item.disabled && (
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          (Soon)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </Accordion>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - Locked to bottom */}
      <div className="mt-auto pt-4 px-2 border-t border-gray-200 dark:border-slate-700">
        <nav className="flex flex-col gap-1">
          {/* Profile */}
          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center w-full p-3 rounded-lg transition-all text-left hover:bg-blue-50 dark:hover:bg-slate-800"
          >
            <UserCircleIcon className="w-5 h-5 mr-3" />
            <span>Profile</span>
          </button>

          {/* Settings Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion("settings")}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-all text-left ${
                openAccordion === "settings"
                  ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                  : "hover:bg-blue-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center">
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </div>
              <ChevronDownIcon
                className="w-4 h-4 transition-transform duration-300"
                style={{
                  transform:
                    openAccordion === "settings" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <Accordion isOpen={openAccordion === "settings"}>
              <div className="py-1">
                {SETTINGS_ITEMS.map((item) => (
                  <button
                    key={item}
                    className="flex items-center w-full p-2.5 pl-12 rounded-lg transition-all text-sm text-left hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <ChevronRightIcon className="w-3 h-3 mr-2 opacity-50" />
                    {item}
                  </button>
                ))}

                {/* Nested Themes Accordion */}
                <div>
                  <button
                    onClick={() => setThemesOpen(!themesOpen)}
                    className="flex items-center justify-between w-full p-2.5 pl-12 rounded-lg transition-all text-sm text-left hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <ChevronRightIcon
                        className="w-3 h-3 mr-2 opacity-50 transition-transform"
                        style={{ transform: themesOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                      />
                      <PaintBrushIcon className="w-4 h-4 mr-2" />
                      <span>Themes</span>
                    </div>
                    <ChevronDownIcon
                      className="w-3 h-3 transition-transform"
                      style={{ transform: themesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  <Accordion isOpen={themesOpen}>
                    <div className="ml-6 py-1 border-l border-gray-200 dark:border-slate-700 pl-3">
                      {Object.entries(themes).map(([key, themeOption]) => (
                        <button
                          key={key}
                          onClick={() => setThemeName(key as keyof typeof themes)}
                          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-sm text-left ${
                            themeName === key
                              ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                            <div
                              className={`w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 transition-transform ${
                                themeName === key ? "scale-100" : "scale-0"
                              }`}
                            />
                          </div>
                          <span>{themeOption.name}</span>
                        </button>
                      ))}
                    </div>
                  </Accordion>
                </div>
              </div>
            </Accordion>
          </div>

          {/* Log Out */}
          <button
            onClick={() => console.log("Logging out...")}
            className="flex items-center w-full p-3 rounded-lg transition-all text-left hover:bg-blue-50 dark:hover:bg-slate-800"
          >
            <PowerIcon className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg"
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Mobile Overlay */}
      {isDrawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            className={`lg:hidden fixed inset-y-0 left-0 w-80 ${sidebarClasses} z-50 transition-transform duration-300 ${
              isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <NavContent />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${sidebarClasses}`}>
        <NavContent />
      </aside>
    </>
  );
}