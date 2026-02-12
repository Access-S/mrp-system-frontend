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

// BLOCK 2: Types & Interfaces
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
    icon: ShoppingBagIcon, // Changed to match inspiration style
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

// BLOCK 4: Animated Accordion Component (Inspired by Material Tailwind)
interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function Accordion({ isOpen, onToggle, header, children, className = "" }: AccordionProps) {
  return (
    <div className={`w-full ${className}`}>
      <div onClick={onToggle} className="cursor-pointer select-none">
        {header}
      </div>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// BLOCK 5: Main Sidebar Component
export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  // Inspiration-based styling classes
  const sidebarClasses = `relative flex h-screen w-full max-w-[20rem] flex-col rounded-none lg:rounded-xl bg-white dark:bg-slate-900 bg-clip-border p-4 text-gray-700 dark:text-gray-200 shadow-xl shadow-blue-gray-900/5 border-r lg:border-r-0 dark:border-slate-700 ${
    theme.isDark ? 'dark' : ''
  }`;

  const headerClasses = "p-4 mb-2";
  const titleClasses = "block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 dark:text-white";
  
  const menuItemBaseClasses = "flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:bg-opacity-80 hover:text-blue-gray-900 dark:hover:text-white focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900";
  
  const menuItemActiveClasses = "bg-blue-gray-50/50 dark:bg-slate-800/80 text-blue-gray-900 dark:text-white";
  
  const subMenuItemClasses = "flex items-center w-full p-2 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:bg-opacity-80 hover:text-blue-gray-900 dark:hover:text-white text-sm";
  
  const subMenuItemActiveClasses = "bg-blue-gray-50/50 dark:bg-slate-800/80 text-blue-gray-900 dark:text-white font-medium";
  
  const iconClasses = "w-5 h-5 mr-4";
  const chevronClasses = "w-4 h-4 mx-auto transition-transform";
  const subChevronClasses = "w-3 h-3 mr-3";

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const onClick = (page: Page) => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.disabled) return;
      if (isMobile) {
        handleNavClick(page);
      } else {
        setActivePage(page);
      }
    };

    return (
      <div className="flex flex-col h-full">
        {/* Header - Always at top */}
        <div className={headerClasses}>
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg ${theme.isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center text-white font-bold text-sm`}>
              MRP
            </div>
            <h5 className={titleClasses}>
              MRP System
            </h5>
          </div>
        </div>

        {/* Main Navigation - Scrollable middle section */}
        <nav className="flex-1 min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-200 overflow-y-auto">
          {/* Dashboard */}
          <div 
            role="button"
            onClick={onClick("dashboard")}
            className={`${menuItemBaseClasses} ${activePage === "dashboard" ? menuItemActiveClasses : ''}`}
          >
            <div className="grid mr-4 place-items-center">
              <PresentationChartBarIcon className="w-5 h-5" />
            </div>
            <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
              Dashboard
            </p>
          </div>

          {/* Menu Groups */}
          {MENU_GROUPS.map((group) => (
            <Accordion
              key={group.id}
              isOpen={openAccordion === group.id}
              onToggle={() => toggleAccordion(group.id)}
              header={
                <div 
                  role="button"
                  className={`${menuItemBaseClasses} ${openAccordion === group.id ? menuItemActiveClasses : ''}`}
                >
                  <div className="grid mr-4 place-items-center">
                    <group.icon className="w-5 h-5" />
                  </div>
                  <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
                    {group.label}
                  </p>
                  <span className="ml-4">
                    <ChevronDownIcon
                      className={`${chevronClasses} ${
                        openAccordion === group.id ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </div>
              }
            >
              <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-300">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    onClick={item.disabled ? undefined : onClick(item.id)}
                    className={`${subMenuItemClasses} ${activePage === item.id ? subMenuItemActiveClasses : ''} ${
                      item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="grid mr-3 place-items-center">
                      <ChevronRightIcon className="w-3 h-3" />
                    </div>
                    <div className="grid mr-3 place-items-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    {item.label}
                    {item.disabled && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Soon)</span>
                    )}
                  </div>
                ))}
              </nav>
            </Accordion>
          ))}
        </nav>

        {/* Bottom Section - Fixed at bottom with border */}
        <div className="mt-auto pt-4 px-2 border-t border-blue-gray-50 dark:border-slate-700">
          <nav className="flex min-w-[240px] flex-col gap-1 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-200">
            {/* Profile */}
            <div 
              role="button"
              className={menuItemBaseClasses}
            >
              <div className="grid mr-4 place-items-center">
                <UserCircleIcon className="w-5 h-5" />
              </div>
              <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
                Profile
              </p>
            </div>

            {/* Settings Accordion */}
            <Accordion
              isOpen={openAccordion === "settings"}
              onToggle={() => toggleAccordion("settings")}
              header={
                <div 
                  role="button"
                  className={`${menuItemBaseClasses} ${openAccordion === "settings" ? menuItemActiveClasses : ''}`}
                >
                  <div className="grid mr-4 place-items-center">
                    <Cog6ToothIcon className="w-5 h-5" />
                  </div>
                  <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
                    Settings
                  </p>
                  <span className="ml-4">
                    <ChevronDownIcon
                      className={`${chevronClasses} ${
                        openAccordion === "settings" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </div>
              }
            >
              <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-300">
                {SETTINGS_ITEMS.map((item) => (
                  <div
                    key={item}
                    role="button"
                    className={subMenuItemClasses}
                  >
                    <div className="grid mr-3 place-items-center">
                      <ChevronRightIcon className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}

                {/* Themes Nested Accordion */}
                <Accordion
                  isOpen={themesOpen}
                  onToggle={() => setThemesOpen(!themesOpen)}
                  header={
                    <div 
                      role="button"
                      className={`${subMenuItemClasses} ${themesOpen ? subMenuItemActiveClasses : ''}`}
                    >
                      <div className="grid mr-3 place-items-center">
                        <ChevronRightIcon className={`w-3 h-3 transition-transform ${themesOpen ? 'rotate-90' : ''}`} />
                      </div>
                      <div className="grid mr-3 place-items-center">
                        <PaintBrushIcon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-left">Themes</span>
                      <ChevronDownIcon
                        className={`w-3 h-3 transition-transform ${
                          themesOpen ? "rotate-180" : ""
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
                        role="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                          themeName === key
                            ? 'bg-blue-gray-50/50 dark:bg-slate-800/80 text-blue-gray-900 dark:text-white font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:bg-opacity-80'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          theme.isDark ? 'border-gray-400' : 'border-gray-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            theme.isDark ? 'bg-gray-200' : 'bg-gray-800'
                          } ${themeName === key ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <span>{themeOption.name}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </nav>
            </Accordion>

            {/* Log Out */}
            <div 
              role="button"
              className={menuItemBaseClasses}
            >
              <div className="grid mr-4 place-items-center">
                <PowerIcon className="w-5 h-5" />
              </div>
              <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed">
                Log Out
              </p>
            </div>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 border ${
          theme.isDark ? 'border-slate-700' : 'border-slate-200'
        } shadow-xl shadow-blue-gray-900/5 hover:bg-blue-gray-50 dark:hover:bg-slate-800 transition-colors`}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className={`lg:hidden fixed inset-y-0 left-0 w-64 ${sidebarClasses} z-50 transform transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="flex justify-end mb-2 p-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-blue-gray-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
            <NavContent isMobile />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block ${sidebarClasses}`}>
        <NavContent />
      </aside>
    </>
  );
}