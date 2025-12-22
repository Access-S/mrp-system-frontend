//src/components/ui/ElasticTabsGlass.tsx

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

// BLOCK 3: Main Component - Glassmorphism Style
export function ElasticTabsGlass({ tabs, activeTab, onTabChange }: ElasticTabsProps) {
  const { theme } = useTheme();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [selectorStyle, setSelectorStyle] = useState({ left: 0, width: 0 });

  // BLOCK 4: Update Selector Position
  useEffect(() => {
    updateSelector();
  }, [activeTab]);

  useEffect(() => {
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

  // BLOCK 6: Render - Glassmorphism Style
  return (
    <div className="flex justify-start">
      <nav 
        ref={tabsRef}
        className="relative inline-flex items-center p-1.5 rounded-2xl"
        style={{
          background: theme.isDark 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.70)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: theme.isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: theme.isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
        }}
      >
        {/* Animated Selector - Glass Effect */}
        <div 
          className="absolute h-[calc(100%-12px)] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-0"
          style={{
            left: `${selectorStyle.left}px`,
            width: `${selectorStyle.width}px`,
            top: '6px',
            background: theme.isDark
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
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
              text-sm font-semibold tracking-wide
              rounded-xl
              transition-all duration-300
              ${tab.disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : 'cursor-pointer'
              }
              ${activeTab === tab.value
                ? 'text-white drop-shadow-sm'
                : theme.isDark 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
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