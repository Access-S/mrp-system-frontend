// src/components/ui/Accordion/Accordion.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
  } from "react";
  import clsx from "clsx";
  import { ChevronDownIcon } from "@heroicons/react/24/outline";
  
  // ============== BLOCK 2: Types ==============
  
  type AccordionVariant = "default" | "bordered" | "separated";
  type AccordionSize = "sm" | "md" | "lg";
  
  interface AccordionContextType {
    expandedItems: string[];
    toggleItem: (id: string) => void;
    allowMultiple: boolean;
    variant: AccordionVariant;
    size: AccordionSize;
  }
  
  interface AccordionProps {
    children: React.ReactNode;
    allowMultiple?: boolean;
    defaultExpanded?: string[];
    variant?: AccordionVariant;
    size?: AccordionSize;
    className?: string;
  }
  
  interface AccordionItemProps {
    children: React.ReactNode;
    id: string;
    disabled?: boolean;
    className?: string;
  }
  
  interface AccordionTriggerProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
  }
  
  interface AccordionContentProps {
    children: React.ReactNode;
    className?: string;
  }
  
  // ============== BLOCK 3: Context ==============
  
  const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
  const AccordionItemContext = createContext<{ id: string; disabled: boolean } | undefined>(undefined);
  
  const useAccordionContext = () => {
    const context = useContext(AccordionContext);
    if (!context) {
      throw new Error("Accordion components must be used within an Accordion");
    }
    return context;
  };
  
  const useAccordionItemContext = () => {
    const context = useContext(AccordionItemContext);
    if (!context) {
      throw new Error("AccordionTrigger/Content must be used within an AccordionItem");
    }
    return context;
  };
  
  // ============== BLOCK 4: Size Styles ==============
  
  const sizeStyles: Record<AccordionSize, { trigger: string; content: string; icon: string }> = {
    sm: {
      trigger: "px-3 py-2 text-sm",
      content: "px-3 pb-3 text-sm",
      icon: "w-4 h-4",
    },
    md: {
      trigger: "px-4 py-3 text-base",
      content: "px-4 pb-4 text-sm",
      icon: "w-5 h-5",
    },
    lg: {
      trigger: "px-5 py-4 text-lg",
      content: "px-5 pb-5 text-base",
      icon: "w-5 h-5",
    },
  };
  
  // ============== BLOCK 5: Accordion Root ==============
  
  const AccordionRoot: React.FC<AccordionProps> = ({
    children,
    allowMultiple = false,
    defaultExpanded = [],
    variant = "default",
    size = "md",
    className,
  }) => {
    const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);
  
    const toggleItem = useCallback(
      (id: string) => {
        setExpandedItems((prev) => {
          if (prev.includes(id)) {
            return prev.filter((item) => item !== id);
          }
          if (allowMultiple) {
            return [...prev, id];
          }
          return [id];
        });
      },
      [allowMultiple]
    );
  
    const variantContainerStyles: Record<AccordionVariant, string> = {
      default: "divide-y divide-gray-200 dark:divide-gray-700",
      bordered: "border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden",
      separated: "space-y-2",
    };
  
    return (
      <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple, variant, size }}>
        <div className={clsx(variantContainerStyles[variant], className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  };
  
  // ============== BLOCK 6: Accordion Item ==============
  
  const AccordionItem: React.FC<AccordionItemProps> = ({
    children,
    id,
    disabled = false,
    className,
  }) => {
    const { variant } = useAccordionContext();
  
    const variantItemStyles: Record<AccordionVariant, string> = {
      default: "bg-white dark:bg-gray-900",
      bordered: "bg-white dark:bg-gray-900",
      separated: "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900",
    };
  
    return (
      <AccordionItemContext.Provider value={{ id, disabled }}>
        <div
          className={clsx(
            variantItemStyles[variant],
            disabled && "opacity-50",
            className
          )}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  };
  
  // ============== BLOCK 7: Accordion Trigger ==============
  
  const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
    children,
    icon,
    className,
  }) => {
    const { expandedItems, toggleItem, size } = useAccordionContext();
    const { id, disabled } = useAccordionItemContext();
    const isExpanded = expandedItems.includes(id);
    const styles = sizeStyles[size];
  
    const handleClick = () => {
      if (!disabled) {
        toggleItem(id);
      }
    };
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        toggleItem(id);
      }
    };
  
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${id}`}
        className={clsx(
          "w-full flex items-center justify-between gap-3",
          "text-left font-medium",
          "text-gray-900 dark:text-gray-100",
          "transition-colors duration-150",
          !disabled && "hover:bg-gray-50 dark:hover:bg-gray-800",
          disabled && "cursor-not-allowed",
          styles.trigger,
          className
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
              {icon}
            </span>
          )}
          <span className="flex-1">{children}</span>
        </div>
        <ChevronDownIcon
          className={clsx(
            styles.icon,
            "text-gray-500 dark:text-gray-400 flex-shrink-0",
            "transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    );
  };
  
  // ============== BLOCK 8: Accordion Content ==============
  
  const AccordionContent: React.FC<AccordionContentProps> = ({
    children,
    className,
  }) => {
    const { expandedItems, size } = useAccordionContext();
    const { id } = useAccordionItemContext();
    const isExpanded = expandedItems.includes(id);
    const styles = sizeStyles[size];
  
    return (
      <div
        id={`accordion-content-${id}`}
        role="region"
        aria-labelledby={`accordion-trigger-${id}`}
        className={clsx(
          "overflow-hidden transition-all duration-200 ease-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={clsx(
            "text-gray-600 dark:text-gray-400",
            styles.content,
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  };
  
  // ============== BLOCK 9: Compound Export ==============
  
  export const Accordion = Object.assign(AccordionRoot, {
    Item: AccordionItem,
    Trigger: AccordionTrigger,
    Content: AccordionContent,
  });
  
  export default Accordion;