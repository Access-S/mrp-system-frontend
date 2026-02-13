// src/components/Sidebar.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
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

// ============================================
// TYPES
// ============================================
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

// ============================================
// MENU DATA
// ============================================
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

// ============================================
// COLLAPSIBLE PANEL COMPONENT
// Fixed with SLOWER animation (450ms) and smooth easing
// ============================================
interface CollapsiblePanelProps {
  isOpen: boolean;
  children: React.ReactNode;
}
function CollapsiblePanel({ isOpen, children }: CollapsiblePanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // OPENING
      // Step 1: Set to 0 with no transition
      el.style.transition = "none";
      el.style.maxHeight = "0px";
      // Step 2: Force browser to paint
      el.offsetHeight;
      // Step 3: Enable transition and animate to full height
      el.style.transition = "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.maxHeight = `${el.scrollHeight}px`;

      // After animation completes, remove limit for nested content
      const onEnd = () => {
        if (el.style.maxHeight !== "0px") {
          el.style.maxHeight = "none";
        }
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
      return () => el.removeEventListener("transitionend", onEnd);
    } else {
      // CLOSING
      // If already closed, skip
      if (el.style.maxHeight === "0px") return;

      // Step 1: Lock current height with no transition
      //         (handles both pixel values AND "none")
      const currentHeight = el.scrollHeight;
      el.style.transition = "none";
      el.style.maxHeight = `${currentHeight}px`;
      // Step 2: Force browser to paint this concrete value
      el.offsetHeight;
      // Step 3: Enable transition and animate to 0
      el.style.transition = "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1)";
      el.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        maxHeight: "0px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================
export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [themesOpen, setThemesOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { theme, themeName, setThemeName } = useTheme();

  // Use theme context instead of DOM query — this triggers re-renders properly
  const isDark = theme.isDark;

  // Simple toggle — no more double-RAF hack
  const toggleAccordion = useCallback((value: string) => {
    setOpenAccordion((prev) => (prev === value ? "" : value));
  }, []);

  const handleNavClick = useCallback((page: Page) => {
    setActivePage(page);
    setIsDrawerOpen(false);
  }, [setActivePage]);


  // ============================================
  // NAV CONTENT (shared between mobile & desktop)
  // ============================================
  const NavContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "16px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              height: "32px",
              width: "32px",
              borderRadius: "8px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            MRP
          </div>
          <h5
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: isDark ? "#fff" : "#111827",
              margin: 0,
            }}
          >
            MRP System
          </h5>
        </div>
      </div>

      {/* Scrollable Middle Section */}
      <nav
        style={{
          flex: 1,
          padding: "0 8px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >

        {/* TEMPORARY TEST — DELETE AFTER */}
  <button
    onClick={() => {
      const panels = document.querySelectorAll('[style*="overflow: hidden"]');
      panels.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const current = htmlEl.scrollHeight;
        console.log('=== MANUAL CLOSE TEST ===');
        console.log('scrollHeight:', current);
        console.log('current maxHeight:', htmlEl.style.maxHeight);
        console.log('computed maxHeight:', getComputedStyle(htmlEl).maxHeight);
        console.log('computed transition:', getComputedStyle(htmlEl).transition);
        
        htmlEl.style.transition = "none";
        htmlEl.style.maxHeight = `${current}px`;
        
        const afterSet = getComputedStyle(htmlEl).maxHeight;
        console.log('after setting px:', afterSet);
        
        void htmlEl.offsetHeight;
        
        const afterReflow = getComputedStyle(htmlEl).maxHeight;
        console.log('after reflow:', afterReflow);
        
        htmlEl.style.transition = "max-height 2000ms linear";
        
        const transitionCheck = getComputedStyle(htmlEl).transition;
        console.log('transition after setting:', transitionCheck);
        
        htmlEl.style.maxHeight = "0px";
        
        const final = getComputedStyle(htmlEl).maxHeight;
        console.log('final maxHeight:', final);
        console.log('=== END TEST ===');
      });
    }}
    style={{
      padding: "12px",
      background: "red",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      width: "100%",
      marginBottom: "8px",
      fontWeight: "bold",
    }}
  >
    🔴 TEST CLOSE ANIMATION
  </button>
  
        {/* Dashboard */}
        <button
          onClick={() => handleNavClick("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "left",
            background:
              activePage === "dashboard"
                ? isDark
                  ? "#1e293b"
                  : "#eff6ff"
                : "transparent",
            color:
              activePage === "dashboard"
                ? isDark
                  ? "#60a5fa"
                  : "#2563eb"
                : isDark
                ? "#e5e7eb"
                : "#374151",
            fontWeight: activePage === "dashboard" ? "500" : "400",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            if (activePage !== "dashboard") {
              e.currentTarget.style.background = isDark ? "#1e293b" : "#eff6ff";
            }
          }}
          onMouseLeave={(e) => {
            if (activePage !== "dashboard") {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <PresentationChartBarIcon
            style={{ width: "20px", height: "20px", marginRight: "12px" }}
          />
          <span>Dashboard</span>
        </button>

        {/* Menu Groups with Accordion */}
        {MENU_GROUPS.map((group) => {
          const isOpen = openAccordion === group.id;
          return (
            <div key={group.id}>
              {/* Group Header Button */}
              <button
                onClick={() => toggleAccordion(group.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  textAlign: "left",
                  background: isOpen
                    ? isDark
                      ? "#1e293b"
                      : "#eff6ff"
                    : "transparent",
                  color: isOpen
                    ? isDark
                      ? "#60a5fa"
                      : "#2563eb"
                    : isDark
                    ? "#e5e7eb"
                    : "#374151",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.background = isDark
                      ? "#1e293b"
                      : "#eff6ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <group.icon
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "12px",
                    }}
                  />
                  <span>{group.label}</span>
                </div>
                <ChevronDownIcon
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </button>

              {/* Collapsible Content — FIXED */}
              <CollapsiblePanel isOpen={isOpen}>
                <div style={{ padding: "4px 0" }}>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.disabled && handleNavClick(item.id)}
                      disabled={item.disabled}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "10px 12px 10px 48px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        textAlign: "left",
                        background:
                          activePage === item.id
                            ? isDark
                              ? "#1e293b"
                              : "#eff6ff"
                            : "transparent",
                        color:
                          activePage === item.id
                            ? isDark
                              ? "#60a5fa"
                              : "#2563eb"
                            : isDark
                            ? "#e5e7eb"
                            : "#374151",
                        fontWeight: activePage === item.id ? "500" : "400",
                        opacity: item.disabled ? 0.5 : 1,
                        cursor: item.disabled ? "not-allowed" : "pointer",
                        border: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!item.disabled && activePage !== item.id) {
                          e.currentTarget.style.background = isDark
                            ? "#1e293b"
                            : "#eff6ff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activePage !== item.id) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <ChevronRightIcon
                        style={{
                          width: "12px",
                          height: "12px",
                          marginRight: "8px",
                          opacity: 0.5,
                        }}
                      />
                      <item.icon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      />
                      {item.label}
                      {item.disabled && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "12px",
                            color: isDark ? "#9ca3af" : "#6b7280",
                          }}
                        >
                          (Soon)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsiblePanel>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "16px",
          padding: "16px 8px 8px 8px",
          borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Profile */}
          <button
            onClick={() => handleNavClick("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "left",
              background: "transparent",
              color: isDark ? "#e5e7eb" : "#374151",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark ? "#1e293b" : "#eff6ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <UserCircleIcon
              style={{ width: "20px", height: "20px", marginRight: "12px" }}
            />
            <span>Profile</span>
          </button>

          {/* Settings Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion("settings")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                textAlign: "left",
                background:
                  openAccordion === "settings"
                    ? isDark
                      ? "#1e293b"
                      : "#eff6ff"
                    : "transparent",
                color:
                  openAccordion === "settings"
                    ? isDark
                      ? "#60a5fa"
                      : "#2563eb"
                    : isDark
                    ? "#e5e7eb"
                    : "#374151",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (openAccordion !== "settings") {
                  e.currentTarget.style.background = isDark
                    ? "#1e293b"
                    : "#eff6ff";
                }
              }}
              onMouseLeave={(e) => {
                if (openAccordion !== "settings") {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Cog6ToothIcon
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "12px",
                  }}
                />
                <span>Settings</span>
              </div>
              <ChevronDownIcon
                style={{
                  width: "16px",
                  height: "16px",
                  transform:
                    openAccordion === "settings"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition:
                    "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </button>

            {/* Settings Collapsible — FIXED */}
            <CollapsiblePanel isOpen={openAccordion === "settings"}>
              <div style={{ padding: "4px 0" }}>
                {SETTINGS_ITEMS.map((item) => (
                  <button
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "10px 12px 10px 48px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      textAlign: "left",
                      background: "transparent",
                      color: isDark ? "#e5e7eb" : "#374151",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "#1e293b"
                        : "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <ChevronRightIcon
                      style={{
                        width: "12px",
                        height: "12px",
                        marginRight: "8px",
                        opacity: 0.5,
                      }}
                    />
                    {item}
                  </button>
                ))}

                {/* Nested Themes Accordion */}
                <div>
                  <button
                    onClick={() => setThemesOpen(!themesOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "10px 12px 10px 48px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      textAlign: "left",
                      background: "transparent",
                      color: isDark ? "#e5e7eb" : "#374151",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "#1e293b"
                        : "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ChevronRightIcon
                        style={{
                          width: "12px",
                          height: "12px",
                          marginRight: "8px",
                          opacity: 0.5,
                          transform: themesOpen
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition:
                            "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                      <PaintBrushIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          marginRight: "8px",
                        }}
                      />
                      <span>Themes</span>
                    </div>
                    <ChevronDownIcon
                      style={{
                        width: "12px",
                        height: "12px",
                        transform: themesOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition:
                          "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </button>

                  {/* Themes Collapsible — FIXED */}
                  <CollapsiblePanel isOpen={themesOpen}>
                    <div
                      style={{
                        marginLeft: "24px",
                        padding: "4px 0",
                        borderLeft: `1px solid ${
                          isDark ? "#374151" : "#e5e7eb"
                        }`,
                        paddingLeft: "12px",
                      }}
                    >
                      {Object.entries(themes).map(([key, themeOption]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setThemeName(key as keyof typeof themes)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            textAlign: "left",
                            background:
                              themeName === key
                                ? isDark
                                  ? "#1e293b"
                                  : "#eff6ff"
                                : "transparent",
                            color:
                              themeName === key
                                ? isDark
                                  ? "#60a5fa"
                                  : "#2563eb"
                                : isDark
                                ? "#9ca3af"
                                : "#6b7280",
                            fontWeight: themeName === key ? "500" : "400",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            if (themeName !== key) {
                              e.currentTarget.style.background = isDark
                                ? "#1e293b"
                                : "#eff6ff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (themeName !== key) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: `2px solid ${
                                isDark ? "#6b7280" : "#9ca3af"
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: isDark ? "#60a5fa" : "#3b82f6",
                                transform:
                                  themeName === key ? "scale(1)" : "scale(0)",
                                transition: "transform 150ms",
                              }}
                            />
                          </div>
                          <span>{themeOption.name}</span>
                        </button>
                      ))}
                    </div>
                  </CollapsiblePanel>
                </div>
              </div>
            </CollapsiblePanel>
          </div>

          {/* Log Out */}
          <button
            onClick={() => console.log("Logging out...")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              textAlign: "left",
              background: "transparent",
              color: isDark ? "#e5e7eb" : "#374151",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? "#1e293b"
                : "#eff6ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <PowerIcon
              style={{ width: "20px", height: "20px", marginRight: "12px" }}
            />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );

  // ============================================
  // RENDER
  // ============================================
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
            className="lg:hidden fixed inset-y-0 left-0 w-80 z-50"
            style={{
              display: "flex",
              height: "100vh",
              width: "100%",
              maxWidth: "20rem",
              flexDirection: "column",
              background: isDark ? "#0f172a" : "#fff",
              color: isDark ? "#e5e7eb" : "#374151",
              boxShadow:
                "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              borderRight: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
              transform: isDrawerOpen
                ? "translateX(0)"
                : "translateX(-100%)",
              transition: "transform 300ms",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "8px",
              }}
            >
              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "#1e293b"
                    : "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <XMarkIcon style={{ height: "24px", width: "24px" }} />
              </button>
            </div>
            <NavContent />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          maxWidth: "20rem",
          flexDirection: "column",
          background: isDark ? "#0f172a" : "#fff",
          color: isDark ? "#e5e7eb" : "#374151",
          boxShadow:
            "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          borderRight: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
        }}
      >
        <NavContent />
      </aside>
    </>
  );
}