// BLOCK 1: Imports
import React, { useState } from "react";
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

// BLOCK 2: Types
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

// BLOCK 3: Menu Configuration
const MENU_GROUPS: MenuGroup[] = [
  {
    id: "operations",
    label: "Operations",
    icon: Cog6ToothIcon,
    items: [
      { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingBagIcon },
      { id: "inventory", label: "Inventory", icon: ArchiveBoxIcon },
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

// BLOCK 4: Custom Accordion Component (No Material Tailwind)
interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
}

function Accordion({ isOpen, onToggle, header, children }: AccordionProps) {
  return (
    <div className="w-full">
      <div onClick={onToggle} className="cursor-pointer select-none">
        {header}
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// BLOCK 5: Component
export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { theme, themeName, setThemeName } = useTheme();

  const toggleAccordion = (value: string) => {
    setOpenAccordion(openAccordion === value ? "" : value);
  };

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsDrawerOpen(false);
  };

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const onClick = (page: Page) => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMobile) {
        handleNavClick(page);
      } else {
        setActivePage(page);
      }
    };

    const menuItemClass = (isActive: boolean) => `
      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
      ${isActive 
        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }
    `;

    const subMenuItemClass = (isActive: boolean, isDisabled?: boolean) => `
      flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
      ${isDisabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer'
      }
      ${isActive 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }
    `;

    return (
      <>
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 p-4">
          <div className={`h-8 w-8 rounded-lg ${theme.isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center text-white font-bold text-sm`}>
            MRP
          </div>
          <span className={`text-xl font-bold ${theme.sidebarText}`}>
            MRP System
          </span>
        </div>

        {/* Main Menu */}
        <div className="flex-1 px-2">
          <nav className="space-y-1">
            {/* Dashboard */}
            <div onClick={onClick("dashboard")} className={menuItemClass(activePage === "dashboard")}>
              <PresentationChartBarIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </div>

            {/* Menu Groups */}
            {MENU_GROUPS.map((group) => (
              <Accordion
                key={group.id}
                isOpen={openAccordion === group.id}
                onToggle={() => toggleAccordion(group.id)}
                header={
                  <div className={menuItemClass(openAccordion === group.id)}>
                    <group.icon className="h-5 w-5" />
                    <span className="flex-1">{group.label}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openAccordion === group.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                }
              >
                <div className="ml-4 mt-1 space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={item.disabled ? undefined : onClick(item.id)}
                      className={subMenuItemClass(activePage === item.id, item.disabled)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </Accordion>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto px-2">
          <hr className={`my-4 ${theme.isDark ? 'border-slate-700' : 'border-gray-300'}`} />
          <nav className="space-y-1">
            {/* Profile */}
            <div className={menuItemClass(false)}>
              <UserCircleIcon className="h-5 w-5" />
              <span>Profile</span>
            </div>

            {/* Settings Accordion */}
            <Accordion
              isOpen={openAccordion === "settings"}
              onToggle={() => toggleAccordion("settings")}
              header={
                <div className={menuItemClass(openAccordion === "settings")}>
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span className="flex-1">Settings</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      openAccordion === "settings" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              }
            >
              <div className="ml-4 mt-1 space-y-1">
                {SETTINGS_ITEMS.map((item) => (
                  <div key={item} className={subMenuItemClass(false)}>
                    <ChevronRightIcon className="h-3 w-3" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}

                {/* Themes Nested Accordion */}
                <Accordion
                  isOpen={settingsOpen}
                  onToggle={() => setSettingsOpen(!settingsOpen)}
                  header={
                    <div className={`${subMenuItemClass(settingsOpen)} pl-0`}>
                      <PaintBrushIcon className="h-4 w-4" />
                      <span className="text-sm flex-1">Themes</span>
                      <ChevronDownIcon
                        className={`h-3 w-3 transition-transform duration-300 ${
                          settingsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  }
                >
                  <div className="ml-6 mt-1 space-y-1">
                    {Object.entries(themes).map(([key, themeOption]) => (
                      <div
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          setThemeName(key as keyof typeof themes);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          themeName === key
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          theme.isDark ? "border-gray-400" : "border-gray-700"
                        }`}>
                          <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${
                            theme.isDark ? "bg-gray-200" : "bg-gray-800"
                          } ${themeName === key ? "scale-100" : "scale-0"}`} />
                        </div>
                        <span className={`text-xs ${themeName === key ? "font-medium" : ""}`}>
                          {themeOption.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </div>
            </Accordion>

            {/* Logout */}
            <div className={menuItemClass(false)}>
              <PowerIcon className="h-5 w-5" />
              <span>Log Out</span>
            </div>
          </nav>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${theme.cards} border ${
          theme.isDark ? 'border-slate-700' : 'border-slate-200'
        } shadow-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className={`lg:hidden fixed inset-y-0 left-0 w-64 ${theme.cards} z-50 transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="h-full flex flex-col overflow-y-auto p-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <NavContent isMobile />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 ${theme.cards} border-r ${
        theme.isDark ? 'border-slate-700' : 'border-slate-200'
      } h-screen sticky top-0 overflow-y-auto`}>
        <div className="flex flex-col h-full p-4">
          <NavContent />
        </div>
      </aside>
    </>
  );
}