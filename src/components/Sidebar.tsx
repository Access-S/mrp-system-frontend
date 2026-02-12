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

// --- Helper Components ---

// 1. Ripple Logic Wrapper
const RippleItem = ({ 
  children, 
  onClick, 
  className = "",
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: (e: React.MouseEvent) => void; 
  className?: string;
  disabled?: boolean;
}) => {
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    // Clean up ripples that are done animating
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  const handleClick = (e: React.MouseEvent) => {
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
      onClick={handleClick}
      className={`relative overflow-hidden cursor-pointer select-none ${className} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-current opacity-10 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%) scale(15)',
            transition: 'transform 0.6s linear, opacity 0.6s linear',
            // Note: simple inline style approximation if 'animate-ripple' isn't in your tailwind config
          }}
        />
      ))}
    </div>
  );
};

// 2. Accordion Component
interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  header: (isOpen: boolean) => React.ReactNode;
  children: React.ReactNode;
}

function Accordion({ isOpen, onToggle, header, children }: AccordionProps) {
  return (
    <div className="w-full">
      <RippleItem onClick={onToggle}>
        {header(isOpen)}
      </RippleItem>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// --- Main Component ---
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
    if (window.innerWidth < 960) {
      setIsDrawerOpen(false);
    }
  };

  // Styling Constants
  const baseItemClass = "flex items-center w-full p-3 leading-tight transition-all outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:text-blue-gray-900 dark:hover:text-white focus:bg-blue-gray-50 focus:text-blue-gray-900 active:text-blue-gray-900";
  const activeItemClass = "bg-blue-gray-50 dark:bg-slate-800 text-blue-gray-900 dark:text-white font-medium";
  const subItemClass = "flex items-center w-full p-2 pl-9 leading-tight transition-all outline-none text-start hover:bg-blue-gray-50 dark:hover:bg-slate-800 hover:text-blue-gray-900 dark:hover:text-white text-sm";
  
  const NavContent = () => (
    <div className="flex flex-col h-full">
      
      {/* 1. Header (Fixed Top) */}
      <div className="p-4 mb-2 flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg ${theme.isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
          MRP
        </div>
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 dark:text-white">
          MRP System
        </h5>
      </div>

      {/* 2. Scrollable Navigation (Middle Section) */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <nav className="flex flex-col gap-1 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-200">
          
          {/* Dashboard */}
          <RippleItem 
            onClick={() => handleNavClick("dashboard")}
            className={`rounded-lg ${baseItemClass} ${activePage === "dashboard" ? activeItemClass : ''}`}
          >
            <div className="grid mr-4 place-items-center">
              <PresentationChartBarIcon className="w-5 h-5" />
            </div>
            Dashboard
          </RippleItem>

          {/* Menu Groups */}
          {MENU_GROUPS.map((group) => (
            <Accordion
              key={group.id}
              isOpen={openAccordion === group.id}
              onToggle={() => toggleAccordion(group.id)}
              header={(isOpen) => (
                <div className={`rounded-lg ${baseItemClass} ${isOpen ? activeItemClass : ''}`}>
                  <div className="grid mr-4 place-items-center">
                    <group.icon className="w-5 h-5" />
                  </div>
                  <p className="mr-auto font-normal leading-relaxed">
                    {group.label}
                  </p>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`w-4 h-4 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              )}
            >
              <div className="py-1">
                {group.items.map((item) => (
                  <RippleItem
                    key={item.id}
                    disabled={item.disabled}
                    onClick={() => handleNavClick(item.id)}
                    className={`rounded-lg ${subItemClass} ${activePage === item.id ? activeItemClass : ''}`}
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

      {/* 3. Footer Navigation (Locked at Bottom) */}
      <div className="px-3 py-4 border-t border-blue-gray-50 dark:border-slate-700 mt-auto bg-white dark:bg-slate-900">
        <nav className="flex flex-col gap-1 font-sans text-base font-normal text-blue-gray-700 dark:text-gray-200">
          
          {/* Profile */}
          <RippleItem 
            className={`rounded-lg ${baseItemClass}`}
          >
            <div className="grid mr-4 place-items-center">
              <UserCircleIcon className="w-5 h-5" />
            </div>
            Profile
          </RippleItem>

          {/* Settings Accordion */}
          <Accordion
            isOpen={settingsOpen}
            onToggle={() => setSettingsOpen(!settingsOpen)}
            header={(isOpen) => (
              <div className={`rounded-lg ${baseItemClass} ${isOpen ? activeItemClass : ''}`}>
                <div className="grid mr-4 place-items-center">
                  <Cog6ToothIcon className="w-5 h-5" />
                </div>
                <p className="mr-auto font-normal leading-relaxed">Settings</p>
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`w-4 h-4 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            )}
          >
            <div className="py-1">
              {SETTINGS_ITEMS.map((item) => (
                <RippleItem key={item} className={`rounded-lg ${subItemClass}`}>
                  <ChevronRightIcon strokeWidth={3} className="w-3 h-3 mr-3" />
                  {item}
                </RippleItem>
              ))}

              {/* Nested Themes Accordion */}
              <div className="relative">
                <RippleItem 
                  onClick={(e) => { e.stopPropagation(); setThemesOpen(!themesOpen); }}
                  className={`rounded-lg ${subItemClass} ${themesOpen ? activeItemClass : ''}`}
                >
                  <ChevronRightIcon strokeWidth={3} className={`w-3 h-3 mr-3 transition-transform ${themesOpen ? 'rotate-90' : ''}`} />
                  <PaintBrushIcon className="w-4 h-4 mr-3 opacity-75" />
                  <span className="flex-1">Themes</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform ${themesOpen ? "rotate-180" : ""}`} />
                </RippleItem>
                
                {/* Theme Options */}
                <div className={`overflow-hidden transition-all duration-300 ${themesOpen ? 'max-h-40 ml-4 border-l border-blue-gray-100 dark:border-slate-700' : 'max-h-0'}`}>
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
          </Accordion>

          {/* Log Out */}
          <RippleItem className={`rounded-lg ${baseItemClass}`}>
            <div className="grid mr-4 place-items-center">
              <PowerIcon className="w-5 h-5" />
            </div>
            Log Out
          </RippleItem>

        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle & Overlay */}
      {/* Note: In a real app, you might want the toggle inside your main layout header, 
          but keeping it here for self-contained functionality as requested */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-gray-200"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Mobile Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full max-w-[20rem] 
        bg-white dark:bg-slate-900 shadow-xl border-r border-blue-gray-100 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block
        flex flex-col h-screen
      `}>
        
        {/* Mobile Close Button (Inside Drawer) */}
        <div className="lg:hidden absolute top-2 right-2">
           <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-500">
             <XMarkIcon className="h-6 w-6" />
           </button>
        </div>

        {/* Content */}
        <NavContent />
      </aside>
    </>
  );
}