//src/components/ui/ElasticTabs.tsx

// BLOCK 1: Imports
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

// BLOCK 2: Interface
interface Tab {
  label: string;
  value: string;
  icon?: string;
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
    <div className="flex justify-center mb-6">
      <nav 
        ref={tabsRef}
        className={`
          relative inline-flex items-center
          px-1 py-1
          rounded-full
          ${theme.isDark ? 'bg-gray-800' : 'bg-white'}
          shadow-lg
        `}
        style={{
          boxShadow: '0px 5px 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Animated Selector */}
        <div 
          className="absolute h-[calc(100%-8px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-0"
          style={{
            left: `${selectorStyle.left}px`,
            width: `${selectorStyle.width}px`,
            top: '4px',
            background: 'linear-gradient(45deg, #05abe0 0%, #8200f4 100%)'
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
              px-5 py-2.5
              text-sm font-medium
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
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}