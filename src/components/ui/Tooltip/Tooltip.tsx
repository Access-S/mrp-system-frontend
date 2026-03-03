// src/components/ui/Tooltip/Tooltip.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    HTMLAttributes,
    forwardRef,
    useState,
    useRef,
    useCallback,
    useEffect,
  } from "react";
  import clsx from "clsx";
  
  // ============== BLOCK 2: Types ==============
  
  type TooltipPosition = "top" | "bottom";
  type TooltipTrigger = "hover" | "focus" | "both";
  
  interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
    content: React.ReactNode;
    position?: TooltipPosition;
    trigger?: TooltipTrigger;
    delay?: number;
    disabled?: boolean;
    arrow?: boolean;
    children: React.ReactElement;
  }
  
  // ============== BLOCK 3: Style Definitions ==============
  
  const baseTooltipStyles = clsx(
    "absolute z-50",
    "px-2.5 py-1.5",
    "text-sm font-medium text-white",
    "bg-gray-900 dark:bg-gray-700",
    "rounded-md shadow-lg",
    "whitespace-nowrap",
    "pointer-events-none",
    "transition-opacity duration-200"
  );
  
  const positionStyles: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };
  
  const arrowBaseStyles = clsx(
    "absolute",
    "w-0 h-0",
    "border-solid border-transparent"
  );
  
  const arrowPositionStyles: Record<TooltipPosition, string> = {
    top: clsx(
      "top-full left-1/2 -translate-x-1/2",
      "border-t-gray-900 dark:border-t-gray-700",
      "border-l-transparent border-r-transparent border-b-transparent",
      "border-t-[6px] border-l-[6px] border-r-[6px] border-b-0"
    ),
    bottom: clsx(
      "bottom-full left-1/2 -translate-x-1/2",
      "border-b-gray-900 dark:border-b-gray-700",
      "border-l-transparent border-r-transparent border-t-transparent",
      "border-b-[6px] border-l-[6px] border-r-[6px] border-t-0"
    ),
  };
  
  // ============== BLOCK 4: Component ==============
  
  export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
    (
      {
        content,
        position = "top",
        trigger = "both",
        delay = 200,
        disabled = false,
        arrow = true,
        children,
        className,
        ...props
      },
      ref
    ) => {
      const [isVisible, setIsVisible] = useState(false);
      const [shouldRender, setShouldRender] = useState(false);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);
      const wrapperRef = useRef<HTMLDivElement>(null);
  
      // ============== BLOCK 5: Cleanup ==============
  
      useEffect(() => {
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);
  
      // ============== BLOCK 6: Show/Hide Handlers ==============
  
      const showTooltip = useCallback(() => {
        if (disabled) return;
  
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
  
        timeoutRef.current = setTimeout(() => {
          setShouldRender(true);
          // Small delay to allow render before showing (for animation)
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }, delay);
      }, [disabled, delay]);
  
      const hideTooltip = useCallback(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
  
        setIsVisible(false);
        // Wait for fade out animation before unmounting
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false);
        }, 200);
      }, []);
  
      // ============== BLOCK 7: Event Handlers ==============
  
      const handleMouseEnter = useCallback(() => {
        if (trigger === "hover" || trigger === "both") {
          showTooltip();
        }
      }, [trigger, showTooltip]);
  
      const handleMouseLeave = useCallback(() => {
        if (trigger === "hover" || trigger === "both") {
          hideTooltip();
        }
      }, [trigger, hideTooltip]);
  
      const handleFocus = useCallback(() => {
        if (trigger === "focus" || trigger === "both") {
          showTooltip();
        }
      }, [trigger, showTooltip]);
  
      const handleBlur = useCallback(() => {
        if (trigger === "focus" || trigger === "both") {
          hideTooltip();
        }
      }, [trigger, hideTooltip]);
  
      // ============== BLOCK 8: Clone Child with Event Handlers ==============
  
      const childElement = React.Children.only(children);
  
      const triggerElement = React.cloneElement(childElement, {
        onMouseEnter: (e: React.MouseEvent) => {
          handleMouseEnter();
          childElement.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleMouseLeave();
          childElement.props.onMouseLeave?.(e);
        },
        onFocus: (e: React.FocusEvent) => {
          handleFocus();
          childElement.props.onFocus?.(e);
        },
        onBlur: (e: React.FocusEvent) => {
          handleBlur();
          childElement.props.onBlur?.(e);
        },
        "aria-describedby": shouldRender ? "tooltip" : undefined,
      });
  
      // ============== BLOCK 9: Render ==============
  
      return (
        <div
          ref={wrapperRef}
          className={clsx("relative inline-flex", className)}
          {...props}
        >
          {triggerElement}
  
          {shouldRender && (
            <div
              ref={ref}
              id="tooltip"
              role="tooltip"
              className={clsx(
                baseTooltipStyles,
                positionStyles[position],
                isVisible ? "opacity-100" : "opacity-0"
              )}
            >
              {content}
  
              {arrow && (
                <span
                  className={clsx(arrowBaseStyles, arrowPositionStyles[position])}
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </div>
      );
    }
  );
  
  // ============== BLOCK 10: Display Name ==============
  
  Tooltip.displayName = "Tooltip";
  
  export default Tooltip;