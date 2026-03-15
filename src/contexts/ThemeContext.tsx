// src/contexts/ThemeContext.tsx

// ============== BLOCK 1: Imports ==============

import React, { createContext, useState, useContext, useMemo, useEffect } from "react";

import { themes, ThemeName, Theme } from "../styles/themes";

// ============== BLOCK 2: Types ==============

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============== BLOCK 3: Provider Component ==============

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>("dark");

  // Sync dark mode class + data-theme attribute with document
  useEffect(() => {
    const currentTheme = themes[themeName];

    // Set data-theme for CSS variable switching
    document.documentElement.setAttribute("data-theme", themeName);

    // Set dark class for Tailwind dark: prefix
    if (currentTheme.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeName]);

  // Dynamically inject scrollbar styles
  useEffect(() => {
    const currentTheme = themes[themeName];
    if (!currentTheme || !currentTheme.scrollbar) {
      return;
    }
    const styleId = "dynamic-scrollbar-styles";
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      /* Global scrollbar styles */
      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      *::-webkit-scrollbar-track {
        background: transparent;
      }
      
      *::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      *:hover::-webkit-scrollbar-thumb,
      *:active::-webkit-scrollbar-thumb,
      *:focus::-webkit-scrollbar-thumb {
        background: ${currentTheme.scrollbar.thumb};
      }
      
      *::-webkit-scrollbar-thumb:hover {
        background: ${currentTheme.scrollbar.thumbHover};
      }
      
      *::-webkit-scrollbar-corner {
        background: transparent;
      }

      /* Body/HTML scrollbar */
      html::-webkit-scrollbar,
      body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      html::-webkit-scrollbar-track,
      body::-webkit-scrollbar-track {
        background: transparent;
      }
      
      html::-webkit-scrollbar-thumb,
      body::-webkit-scrollbar-thumb {
        background: ${currentTheme.scrollbar.thumb};
        border-radius: 4px;
      }
      
      html::-webkit-scrollbar-thumb:hover,
      body::-webkit-scrollbar-thumb:hover {
        background: ${currentTheme.scrollbar.thumbHover};
      }

      /* Drawer content */
      .drawer-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .drawer-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .drawer-content::-webkit-scrollbar-thumb {
        background: ${currentTheme.scrollbar.thumb};
        border-radius: 4px;
      }
      
      .drawer-content::-webkit-scrollbar-thumb:hover {
        background: ${currentTheme.scrollbar.thumbHover};
      }
    `;
  }, [themeName]);

  const theme = useMemo(() => themes[themeName], [themeName]);

  const value = {
    themeName,
    setThemeName,
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============== BLOCK 4: Hook ==============

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};