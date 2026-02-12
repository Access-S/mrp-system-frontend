import React, { useState, useEffect } from "react";
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

// --- Types ---
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

// --- Configuration ---
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

// --- 1. Robust Ripple Component ---
// Uses inline styles for animation to bypass Tailwind config issues
const RippleItem = ({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples((r) => r.slice(1)), 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const addRipple = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    if (onClick) onClick(e);
  };

  return (
    <div
      onClick={addRipple}
      className={`relative overflow-hidden cursor-pointer select-none transition-colors duration-200 ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: r.x,
            top: r.y,
            transform: "translate(-50%, -50%)",
            width: "200%", // Large enough to cover button
            paddingBottom: "200%", // Maintains aspect ratio
            backgroundColor: "currentColor",
            opacity: 0.1,
            animation: "ripple-effect 0.6s linear forwards",
          }}
        />
      ))}
    </div>
  );
};

// --- 2. Bulletproof Accordion (Grid Method) ---
// This uses inline styles to FORCE the animation, overriding any foreign CSS.
const Accordion = ({
  isOpen,
  onToggle,
  header,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full">
      <RippleItem onClick={onToggle}>{header}</RippleItem>
      
      {/* 
        GRID TRANSITION TRICK: 
        This animates grid-template-rows from 0fr to 1fr.
        It is the most robust way to animate height: auto in CSS.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 300ms ease-in-out",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: "0" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Sidebar Component ---
export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { theme, themeName, setThemeName } = useTheme();

  // Helper styles
  const itemBase = `flex items-center w-full p-3 leading-tight outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:text-blue-gray-900 dark:hover:text-white`;
  const itemActive = `bg-blue-gray-50 dark:bg-slate-800 text-blue-gray-900 dark:text-white font-medium`;
  const subItemBase = `flex items-center w-full p-2 pl-9 leading-tight outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:text-blue-gray-900 dark:hover:text-white text-sm`;

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    if (window.innerWidth < 960) setIsDrawerOpen(false);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 mb-2 flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg ${theme.isDark ? "bg-blue-500" : "bg-blue-600"} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
          MRP
        </div>
        <h5 className="block font-sans text-xl font-semibold text-blue-gray-900 dark:text-white">
          MRP System
        </h5>
      </div>

      {/* Scrollable Middle */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <nav className="flex flex-col gap-1 text-blue-gray-700 dark:text-gray-200">
          <RippleItem
            onClick={() => handleNavClick("dashboard")}
            className={`rounded-lg ${itemBase} ${activePage === "dashboard" ? itemActive : ""}`}
          >
            <PresentationChartBarIcon className="w-5 h-5 mr-4" />
            Dashboard
          </RippleItem>

          {MENU_GROUPS.map((group) => (
            <Accordion
              key={group.id}
              isOpen={openAccordion === group.id}
              onToggle={() => setOpenAccordion(openAccordion === group.id ? "" : group.id)}
              header={
                <div className={`rounded-lg ${itemBase} ${openAccordion === group.id ? itemActive : ""}`}>
                  <group.icon className="w-5 h-5 mr-4" />
                  <span className="flex-1">{group.label}</span>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`w-4 h-4 ml-auto transition-transform duration-300 ${openAccordion === group.id ? "rotate-180" : ""}`}
                  />
                </div>
              }
            >
              <div className="py-1">
                {group.items.map((item) => (
                  <RippleItem
                    key={item.id}
                    disabled={item.disabled}
                    onClick={() => handleNavClick(item.id)}
                    className={`rounded-lg ${subItemBase} ${activePage === item.id ? itemActive : ""}`}
                  >
                    <ChevronRightIcon strokeWidth={3} className="w-3 h-3 mr-3" />
                    <item.icon className="w-4 h-4 mr-3 opacity-75" />
                    {item.label}
                    {item.disabled && <span className="ml-auto text-[10px] opacity-60">(Soon)</span>}
                  </RippleItem>
                ))}
              </div>
            </Accordion>
          ))}
        </nav>
      </div>

      {/* Locked Footer */}
      <div className="px-3 py-4 border-t border-blue-gray-50 dark:border-slate-700 mt-auto bg-white dark:bg-slate-900">
        <nav className="flex flex-col gap-1 text-blue-gray-700 dark:text-gray-200">
          <RippleItem className={`rounded-lg ${itemBase}`}>
            <UserCircleIcon className="w-5 h-5 mr-4" />
            Profile
          </RippleItem>

          <Accordion
            isOpen={settingsOpen}
            onToggle={() => setSettingsOpen(!settingsOpen)}
            header={
              <div className={`rounded-lg ${itemBase} ${settingsOpen ? itemActive : ""}`}>
                <Cog6ToothIcon className="w-5 h-5 mr-4" />
                <span className="flex-1">Settings</span>
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${settingsOpen ? "rotate-180" : ""}`}
                />
              </div>
            }
          >
            <div className="py-1">
              {SETTINGS_ITEMS.map((item) => (
                <RippleItem key={item} className={`rounded-lg ${subItemBase}`}>
                  <ChevronRightIcon strokeWidth={3} className="w-3 h-3 mr-3" />
                  {item}
                </RippleItem>
              ))}
              
              {/* Nested Themes - Using the same Grid trick inline */}
              <div className="relative">
                <RippleItem
                  onClick={(e) => { e.stopPropagation(); setThemesOpen(!themesOpen); }}
                  className={`rounded-lg ${subItemBase} ${themesOpen ? itemActive : ""}`}
                >
                  <ChevronRightIcon strokeWidth={3} className={`w-3 h-3 mr-3 transition-transform ${themesOpen ? 'rotate-90' : ''}`} />
                  <PaintBrushIcon className="w-4 h-4 mr-3 opacity-75" />
                  <span className="flex-1">Themes</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform ${themesOpen ? "rotate-180" : ""}`} />
                </RippleItem>
                
                {/* Manual Grid Animation for Nested Item */}
                <div style={{
                  display: "grid",
                  gridTemplateRows: themesOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 300ms ease-in-out",
                }}>
                   <div style={{ overflow: "hidden", minHeight: "0", marginLeft: "1rem", borderLeft: "1px solid #e2e8f0" }}>
                      {Object.entries(themes).map(([key, themeOption]) => (
                          <RippleItem
                            key={key}
                            onClick={(e) => { e.stopPropagation(); setThemeName(key as keyof typeof themes); }}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-gray-50 dark:hover:bg-slate-800"
                          >
                            <div className={`w-3 h-3 rounded-full border ${themeName === key ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></div>
                            {themeOption.name}
                          </RippleItem>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </Accordion>

          <RippleItem className={`rounded-lg ${itemBase}`}>
            <PowerIcon className="w-5 h-5 mr-4" />
            Log Out
          </RippleItem>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* 
        INLINE STYLES FOR RIPPLE ANIMATION
        This ensures the ripple animation works even if Tailwind purges keyframes.
      */}
      <style>{`
        @keyframes ripple-effect {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `}</style>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-gray-200"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-[20rem] 
        bg-white dark:bg-slate-900 shadow-xl border-r border-blue-gray-100 dark:border-slate-700
        flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block
      `}
      >
        <div className="lg:hidden absolute top-2 right-2">
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <NavContent />
      </aside>
    </>
  );
}