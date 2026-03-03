// src/components/ui/Menu/Menu.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
  } from "react";
  import clsx from "clsx";
  import { ChevronRightIcon } from "@heroicons/react/24/outline";
  
  // ============== BLOCK 2: Types ==============
  
  type MenuPosition = "bottom-start" | "bottom-end" | "top-start" | "top-end";
  type MenuSize = "sm" | "md" | "lg";
  
  interface MenuContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    size: MenuSize;
    closeMenu: () => void;
  }
  
  interface MenuProps {
    children: React.ReactNode;
    size?: MenuSize;
  }
  
  interface MenuTriggerProps {
    children: React.ReactNode;
    className?: string;
  }
  
  interface MenuContentProps {
    children: React.ReactNode;
    position?: MenuPosition;
    className?: string;
    minWidth?: number;
  }
  
  interface MenuItemProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    className?: string;
  }
  
  interface MenuLabelProps {
    children: React.ReactNode;
    className?: string;
  }
  
  // ============== BLOCK 3: Context ==============
  
  const MenuContext = createContext<MenuContextType | undefined>(undefined);
  
  const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
      throw new Error("Menu components must be used within a Menu");
    }
    return context;
  };
  
  // ============== BLOCK 4: Size Styles ==============
  
  const sizeStyles: Record<MenuSize, { item: string; icon: string; label: string }> = {
    sm: {
      item: "px-3 py-1.5 text-xs",
      icon: "w-4 h-4",
      label: "px-3 py-1 text-xs",
    },
    md: {
      item: "px-4 py-2 text-sm",
      icon: "w-4 h-4",
      label: "px-4 py-1.5 text-xs",
    },
    lg: {
      item: "px-4 py-2.5 text-base",
      icon: "w-5 h-5",
      label: "px-4 py-2 text-sm",
    },
  };
  
  // ============== BLOCK 5: Position Styles ==============
  
  const positionStyles: Record<MenuPosition, string> = {
    "bottom-start": "top-full left-0 mt-1",
    "bottom-end": "top-full right-0 mt-1",
    "top-start": "bottom-full left-0 mb-1",
    "top-end": "bottom-full right-0 mb-1",
  };
  
  // ============== BLOCK 6: Menu Root ==============
  
  const MenuRoot: React.FC<MenuProps> = ({ children, size = "md" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
  
    const closeMenu = useCallback(() => {
      setIsOpen(false);
    }, []);
  
    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);
  
    // Close on Escape
    useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };
  
      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
      }
  
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);
  
    return (
      <MenuContext.Provider value={{ isOpen, setIsOpen, size, closeMenu }}>
        <div ref={menuRef} className="relative inline-block">
          {children}
        </div>
      </MenuContext.Provider>
    );
  };
  
  // ============== BLOCK 7: Menu Trigger ==============
  
  const MenuTrigger: React.FC<MenuTriggerProps> = ({ children, className }) => {
    const { isOpen, setIsOpen } = useMenuContext();
  
    return (
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx("cursor-pointer", className)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {children}
      </div>
    );
  };
  
  // ============== BLOCK 8: Menu Content ==============
  
  const MenuContent: React.FC<MenuContentProps> = ({
    children,
    position = "bottom-start",
    className,
    minWidth = 180,
  }) => {
    const { isOpen } = useMenuContext();
  
    return (
      <div
        className={clsx(
          "absolute z-50",
          positionStyles[position],
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "rounded-lg shadow-lg",
          "py-1",
          "transition-all duration-200 ease-out",
          "transform origin-top",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
          className
        )}
        style={{ minWidth }}
        role="menu"
      >
        {children}
      </div>
    );
  };
  
  // ============== BLOCK 9: Menu Item ==============
  
  const MenuItem: React.FC<MenuItemProps> = ({
    children,
    icon,
    rightIcon,
    onClick,
    disabled = false,
    danger = false,
    className,
  }) => {
    const { size, closeMenu } = useMenuContext();
    const styles = sizeStyles[size];
  
    const handleClick = () => {
      if (disabled) return;
      onClick?.();
      closeMenu();
    };
  
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={clsx(
          "w-full flex items-center gap-3 text-left",
          "transition-colors duration-100",
          styles.item,
          disabled
            ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
            : danger
            ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
          className
        )}
        role="menuitem"
      >
        {icon && (
          <span className={clsx(styles.icon, "flex-shrink-0")}>
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {rightIcon && (
          <span className={clsx(styles.icon, "flex-shrink-0 text-gray-400")}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  };
  
  // ============== BLOCK 10: Menu Label ==============
  
  const MenuLabel: React.FC<MenuLabelProps> = ({ children, className }) => {
    const { size } = useMenuContext();
    const styles = sizeStyles[size];
  
    return (
      <div
        className={clsx(
          "font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
          styles.label,
          className
        )}
      >
        {children}
      </div>
    );
  };
  
  // ============== BLOCK 11: Menu Divider ==============
  
  const MenuDivider: React.FC = () => {
    return (
      <div className="my-1 border-t border-gray-200 dark:border-gray-700" role="separator" />
    );
  };
  
  // ============== BLOCK 12: Compound Export ==============
  
  export const Menu = Object.assign(MenuRoot, {
    Trigger: MenuTrigger,
    Content: MenuContent,
    Item: MenuItem,
    Label: MenuLabel,
    Divider: MenuDivider,
  });
  
  export default Menu;