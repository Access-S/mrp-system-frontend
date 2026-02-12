// Sidebar.tsx
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

// BLOCK 1: Types & Interfaces
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

// BLOCK 2: Menu Configuration
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

// BLOCK 3: Ripple Effect Hook
const useRipple = () => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return { ripples, createRipple };
};

// BLOCK 4: Ripple Component
const Ripple: React.FC<{ ripples: Array<{ x: number; y: number; id: number }> }> = ({ ripples }) => {
  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-black/10 dark:bg-white/10 pointer-events-none animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: "20px",
            height: "20px",
          }}
        />
      ))}
    </>
  );
};

// BLOCK 5: Main Sidebar Component
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

  // Base classes
  const sidebarClasses = `flex h-screen w-full max-w-[20rem] flex-col bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 shadow-xl border-r dark:border-slate-700 ${
    theme.isDark ? "dark" : ""
  }`;

  const navButtonClasses = `relative overflow-hidden flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer select-none`;

  const navButtonActiveClasses = `bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium`;

  const subItemClasses = `relative overflow-hidden flex items-center w-full p-2.5 pl-12 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer text-sm`;

  const subItemActiveClasses = `bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium`;

  // BLOCK 6: Nav Content Component
  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const dashboardRipple = useRipple();

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-lg ${
                theme.isDark ? "bg-blue-500" : "bg-blue-600"
              } flex items-center justify-center text-white font-bold text-sm shadow-md`}
            >
              MRP
            </div>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              MRP System
            </h5>
          </div>
        </div>

        {/* Scrollable Middle Section */}
        <nav className="flex-1 px-2 overflow-y-auto flex flex-col gap-1">
          {/* Dashboard */}
          <div
            role="button"
            onClick={(e) => {
              dashboardRipple.createRipple(e);
              handleNavClick("dashboard");
            }}
            className={`${navButtonClasses} ${
              activePage === "dashboard" ? navButtonActiveClasses : ""
            }`}
          >
            <Ripple ripples={dashboardRipple.ripples} />
            <PresentationChartBarIcon className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </div>

          {/* Menu Groups */}
          {MENU_GROUPS.map((group) => (
            <MenuGroupAccordion
              key={group.id}
              group={group}
              isOpen={openAccordion === group.id}
              onToggle={() => toggleAccordion(group.id)}
              activePage={activePage}
              onNavClick={handleNavClick}
              navButtonClasses={navButtonClasses}
              navButtonActiveClasses={navButtonActiveClasses}
              subItemClasses={subItemClasses}
              subItemActiveClasses={subItemActiveClasses}
            />
          ))}
        </nav>

        {/* Bottom Section - Locked to bottom */}
        <div className="mt-auto pt-4 px-2 border-t border-gray-200 dark:border-slate-700">
          <nav className="flex flex-col gap-1">
            {/* Profile */}
            <NavButton
              icon={UserCircleIcon}
              label="Profile"
              onClick={() => handleNavClick("dashboard")}
              navButtonClasses={navButtonClasses}
            />

            {/* Settings Accordion */}
            <SettingsAccordion
              isOpen={openAccordion === "settings"}
              onToggle={() => toggleAccordion("settings")}
              themesOpen={themesOpen}
              setThemesOpen={setThemesOpen}
              themeName={themeName}
              setThemeName={setThemeName}
              theme={theme}
              navButtonClasses={navButtonClasses}
              navButtonActiveClasses={navButtonActiveClasses}
              subItemClasses={subItemClasses}
            />

            {/* Log Out */}
            <NavButton
              icon={PowerIcon}
              label="Log Out"
              onClick={() => console.log("Logging out...")}
              navButtonClasses={navButtonClasses}
            />
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
          theme.isDark ? "border-slate-700" : "border-slate-200"
        } shadow-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors`}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Mobile Overlay */}
      {isDrawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            className={`lg:hidden fixed inset-y-0 left-0 w-80 ${sidebarClasses} z-50 transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
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
      <aside className={`hidden lg:flex ${sidebarClasses}`}>
        <NavContent />
      </aside>
    </>
  );
}

// BLOCK 7: Menu Group Accordion Component
interface MenuGroupAccordionProps {
  group: MenuGroup;
  isOpen: boolean;
  onToggle: () => void;
  activePage: Page;
  onNavClick: (page: Page) => void;
  navButtonClasses: string;
  navButtonActiveClasses: string;
  subItemClasses: string;
  subItemActiveClasses: string;
}

const MenuGroupAccordion: React.FC<MenuGroupAccordionProps> = ({
  group,
  isOpen,
  onToggle,
  activePage,
  onNavClick,
  navButtonClasses,
  navButtonActiveClasses,
  subItemClasses,
  subItemActiveClasses,
}) => {
  const ripple = useRipple();

  return (
    <div>
      <button
        onClick={(e) => {
          ripple.createRipple(e);
          onToggle();
        }}
        className={`${navButtonClasses} ${isOpen ? navButtonActiveClasses : ""}`}
        aria-expanded={isOpen}
      >
        <Ripple ripples={ripple.ripples} />
        <group.icon className="w-5 h-5 mr-3" />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-1">
          {group.items.map((item) => {
            const itemRipple = useRipple();
            return (
              <div
                key={item.id}
                role="button"
                onClick={(e) => {
                  if (!item.disabled) {
                    itemRipple.createRipple(e);
                    onNavClick(item.id);
                  }
                }}
                className={`${subItemClasses} ${
                  activePage === item.id ? subItemActiveClasses : ""
                } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {!item.disabled && <Ripple ripples={itemRipple.ripples} />}
                <ChevronRightIcon className="w-3 h-3 mr-2 opacity-50" />
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {item.disabled && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    (Soon)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// BLOCK 8: Settings Accordion Component
interface SettingsAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  themesOpen: boolean;
  setThemesOpen: (open: boolean) => void;
  themeName: string;
  setThemeName: (name: keyof typeof themes) => void;
  theme: any;
  navButtonClasses: string;
  navButtonActiveClasses: string;
  subItemClasses: string;
}

const SettingsAccordion: React.FC<SettingsAccordionProps> = ({
  isOpen,
  onToggle,
  themesOpen,
  setThemesOpen,
  themeName,
  setThemeName,
  theme,
  navButtonClasses,
  navButtonActiveClasses,
  subItemClasses,
}) => {
  const ripple = useRipple();
  const themesRipple = useRipple();

  return (
    <div>
      <button
        onClick={(e) => {
          ripple.createRipple(e);
          onToggle();
        }}
        className={`${navButtonClasses} ${isOpen ? navButtonActiveClasses : ""}`}
        aria-expanded={isOpen}
      >
        <Ripple ripples={ripple.ripples} />
        <Cog6ToothIcon className="w-5 h-5 mr-3" />
        <span className="flex-1 text-left">Settings</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-1">
          {SETTINGS_ITEMS.map((item) => {
            const settingRipple = useRipple();
            return (
              <div
                key={item}
                role="button"
                onClick={(e) => {
                  settingRipple.createRipple(e);
                }}
                className={subItemClasses}
              >
                <Ripple ripples={settingRipple.ripples} />
                <ChevronRightIcon className="w-3 h-3 mr-2 opacity-50" />
                {item}
              </div>
            );
          })}

          {/* Nested Themes Accordion */}
          <div>
            <div
              role="button"
              onClick={(e) => {
                themesRipple.createRipple(e);
                setThemesOpen(!themesOpen);
              }}
              className={subItemClasses}
            >
              <Ripple ripples={themesRipple.ripples} />
              <ChevronRightIcon
                className={`w-3 h-3 mr-2 opacity-50 transition-transform ${
                  themesOpen ? "rotate-90" : ""
                }`}
              />
              <PaintBrushIcon className="w-4 h-4 mr-2" />
              <span className="flex-1">Themes</span>
              <ChevronDownIcon
                className={`w-3 h-3 transition-transform ${
                  themesOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ml-6 border-l border-gray-200 dark:border-slate-700 ${
                themesOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="py-1 pl-3">
                {Object.entries(themes).map(([key, themeOption]) => {
                  const themeRipple = useRipple();
                  return (
                    <div
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        themeRipple.createRipple(e);
                        setThemeName(key as keyof typeof themes);
                      }}
                      role="button"
                      className={`relative overflow-hidden flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                        themeName === key
                          ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Ripple ripples={themeRipple.ripples} />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          theme.isDark ? "border-gray-400" : "border-gray-600"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            theme.isDark ? "bg-gray-200" : "bg-gray-800"
                          } ${themeName === key ? "scale-100" : "scale-0"}`}
                        />
                      </div>
                      <span>{themeOption.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// BLOCK 9: Simple Nav Button Component
interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  navButtonClasses: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  navButtonClasses,
}) => {
  const ripple = useRipple();

  return (
    <div
      role="button"
      onClick={(e) => {
        ripple.createRipple(e);
        onClick();
      }}
      className={navButtonClasses}
    >
      <Ripple ripples={ripple.ripples} />
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </div>
  );
};