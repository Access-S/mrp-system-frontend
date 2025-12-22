//src/components/ui/ElasticTabs.tsx

// BLOCK 1: Imports
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

// BLOCK 2: Interface
interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

interface ElasticTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

// BLOCK 3: Main Component
export function ElasticTabs({ tabs, activeTab, onTabChange }: ElasticTabsProps) {
  const { theme } = useTheme();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0 });

  // BLOCK 4: Update Selector Position
  useEffect(() => {
    updateSelector();
  }, [activeTab]);

  useEffect(() => {
    // Update on mount and window resize
    updateSelector();
    window.addEventListener('resize', updateSelector);
    return () => window.removeEventListener('resize', updateSelector);
  }, []);

  const updateSelector = () => {
    if (!tabsRef.current) return;
    
    const activeElement = tabsRef.current.querySelector(`[data-value="${activeTab}"]`) as HTMLElement;
    if (activeElement) {
      setSelectorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth
      });
    }
  };

  // BLOCK 5: Handle Tab Click
  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return;
    onTabChange(tab.value);
  };

  // BLOCK 6: Render
  return (
    <div className="flex justify-start">  {/* ✅ Changed to justify-start for left alignment */}
      <nav 
        ref={tabsRef}
        className={`
          relative inline-flex items-center
          px-1.5 py-1.5
          rounded-full
          ${theme.isDark ? 'bg-gray-800' : 'bg-gray-100'}
        `}
        style={{
          boxShadow: theme.isDark 
            ? '0px 4px 15px rgba(0,0,0,0.3)' 
            : '0px 4px 15px rgba(0,0,0,0.08)'
        }}
      >
        {/* Animated Selector */}
        <div 
          className={`
            absolute h-[calc(100%-12px)] rounded-full 
            transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
            z-0
            ${theme.isDark ? 'bg-blue-600' : 'bg-blue-500'}
          `}
          style={{
            left: `${selectorStyle.left}px`,
            width: `${selectorStyle.width}px`,
            top: '6px'
          }}
        />

        {/* Tab Items */}
        {tabs.map((tab) => (
          <button
            key={tab.value}
            data-value={tab.value}
            onClick={() => handleTabClick(tab)}
            disabled={tab.disabled}
            className={`
              relative z-10
              px-6 py-3
              text-base font-semibold
              rounded-full
              transition-colors duration-300
              ${tab.disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : 'cursor-pointer'
              }
              ${activeTab === tab.value
                ? 'text-white'
                : theme.isDark 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}