// src/components/ui/Tabs/Tabs.tsx

// ============== BLOCK 1: Imports ==============

import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type TabsVariant = "default" | "glass" | "material" | "underline" | "pills";
type TabsSize = "sm" | "md" | "lg";

interface Tab {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  fullWidth?: boolean;
  className?: string;
}

// ============== BLOCK 3: Size Styles ==============

const sizeStyles: Record<TabsSize, { tab: string; container: string }> = {
  sm: {
    tab: "px-4 py-2 text-xs",
    container: "p-1",
  },
  md: {
    tab: "px-5 py-2.5 text-sm",
    container: "p-1.5",
  },
  lg: {
    tab: "px-6 py-3 text-base",
    container: "p-2",
  },
};

// ============== BLOCK 4: Variant Styles ==============

const getVariantStyles = (variant: TabsVariant, isDark: boolean) => {
  const styles = {
    default: {
      container: isDark ? "bg-gray-800" : "bg-gray-100",
      containerStyle: {
        boxShadow: isDark
          ? "0px 4px 15px rgba(0,0,0,0.3)"
          : "0px 4px 15px rgba(0,0,0,0.08)",
      },
      selector: isDark ? "bg-blue-600" : "bg-blue-500",
      selectorStyle: {},
      activeText: "text-white",
      inactiveText: isDark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-600 hover:text-gray-800",
      borderRadius: "rounded-full",
      selectorRadius: "rounded-full",
    },
    glass: {
      container: "",
      containerStyle: {
        background: isDark
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(255, 255, 255, 0.70)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      selector: "",
      selectorStyle: {
        background: isDark
          ? "linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)",
        boxShadow:
          "0 4px 15px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
      },
      activeText: "text-white drop-shadow-sm",
      inactiveText: isDark
        ? "text-gray-300 hover:text-white"
        : "text-gray-600 hover:text-gray-900",
      borderRadius: "rounded-2xl",
      selectorRadius: "rounded-xl",
    },
    material: {
      container: isDark ? "bg-gray-800/80" : "bg-blue-50",
      containerStyle: {
        boxShadow: isDark
          ? "0 1px 3px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(0,0,0,0.08)",
      },
      selector: isDark ? "bg-blue-600" : "bg-white",
      selectorStyle: {
        boxShadow: isDark
          ? "0 2px 8px rgba(37, 99, 235, 0.5)"
          : "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },
      activeText: isDark ? "text-white" : "text-blue-600",
      inactiveText: isDark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-600 hover:text-gray-900",
      borderRadius: "rounded-full",
      selectorRadius: "rounded-full",
    },
    underline: {
      container: "border-b border-gray-200 dark:border-gray-700",
      containerStyle: {},
      selector: "bg-blue-600",
      selectorStyle: {
        height: "2px",
        bottom: "0",
        top: "auto",
      },
      activeText: "text-blue-600 dark:text-blue-400",
      inactiveText: isDark
        ? "text-gray-400 hover:text-gray-200"
        : "text-gray-600 hover:text-gray-800",
      borderRadius: "rounded-none",
      selectorRadius: "rounded-none",
    },
    pills: {
      container: "gap-2",
      containerStyle: {},
      selector: isDark ? "bg-blue-600" : "bg-blue-500",
      selectorStyle: {},
      activeText: "text-white",
      inactiveText: isDark
        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
      borderRadius: "rounded-lg",
      selectorRadius: "rounded-lg",
    },
  };

  return styles[variant];
};

// ============== BLOCK 5: Component ==============

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0 });
  
  // Detect dark mode from document
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkDarkMode();
    
    // Watch for class changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // ============== BLOCK 6: Selector Update ==============

  const updateSelector = useCallback(() => {
    if (!tabsRef.current) return;

    const activeElement = tabsRef.current.querySelector(
      `[data-value="${activeTab}"]`
    ) as HTMLElement;

    if (activeElement) {
      setSelectorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateSelector();
  }, [activeTab, updateSelector]);

  useEffect(() => {
    updateSelector();
    window.addEventListener("resize", updateSelector);
    return () => window.removeEventListener("resize", updateSelector);
  }, [updateSelector]);

  // ============== BLOCK 7: Event Handlers ==============

  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return;
    onTabChange(tab.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tab: Tab) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabClick(tab);
    }
  };

  // ============== BLOCK 8: Get Styles ==============

  const variantStyles = getVariantStyles(variant, isDark);
  const sizes = sizeStyles[size];

  // ============== BLOCK 9: Render ==============

  return (
    <div className={clsx("flex", fullWidth ? "w-full" : "justify-start", className)}>
      <nav
        ref={tabsRef}
        role="tablist"
        className={clsx(
          "relative inline-flex items-center",
          sizes.container,
          variantStyles.container,
          variantStyles.borderRadius,
          fullWidth && "w-full"
        )}
        style={variantStyles.containerStyle as React.CSSProperties}
      >
        {/* Animated Selector */}
        {variant !== "pills" && (
          <div
            className={clsx(
              "absolute transition-all duration-500 z-0",
              variant === "underline"
                ? "ease-out"
                : "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
              variantStyles.selector,
              variantStyles.selectorRadius,
              variant !== "underline" && "h-[calc(100%-12px)] top-[6px]"
            )}
            style={{
              left: `${selectorStyle.left}px`,
              width: `${selectorStyle.width}px`,
              ...variantStyles.selectorStyle,
            } as React.CSSProperties}
          />
        )}

        {/* Tab Items */}
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            data-value={tab.value}
            aria-selected={activeTab === tab.value}
            aria-disabled={tab.disabled}
            tabIndex={tab.disabled ? -1 : 0}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab)}
            disabled={tab.disabled}
            className={clsx(
              "relative z-10",
              "font-semibold",
              "transition-all duration-300",
              "flex items-center gap-2",
              sizes.tab,
              variantStyles.selectorRadius,
              fullWidth && "flex-1 justify-center",
              tab.disabled
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer",
              activeTab === tab.value
                ? variantStyles.activeText
                : variantStyles.inactiveText
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// ============== BLOCK 10: Display Name ==============

Tabs.displayName = "Tabs";

export default Tabs;