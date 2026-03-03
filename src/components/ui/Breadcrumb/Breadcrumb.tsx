// src/components/ui/Breadcrumb/Breadcrumb.tsx

// ============== BLOCK 1: Imports ==============

import React, {
    HTMLAttributes,
    forwardRef,
    useMemo,
    useState,
    useCallback,
  } from "react";
  import clsx from "clsx";
  
  // ============== BLOCK 2: Types ==============
  
  interface BreadcrumbItem {
    label: string;
    href?: string;
    onClick?: () => void;
  }
  
  interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    maxItems?: number;
    showHome?: boolean;
    homeIcon?: React.ReactNode;
    homeHref?: string;
    onHomeClick?: () => void;
  }
  
  // ============== BLOCK 3: Style Definitions ==============
  
  const navStyles = clsx("flex items-center");
  
  const listStyles = clsx("flex items-center flex-wrap gap-1");
  
  const itemStyles = clsx("flex items-center gap-1");
  
  const linkStyles = clsx(
    "text-sm font-medium",
    "text-gray-500 dark:text-gray-400",
    "hover:text-gray-700 dark:hover:text-gray-200",
    "transition-colors duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
    "rounded-sm"
  );
  
  const currentStyles = clsx(
    "text-sm font-medium",
    "text-gray-900 dark:text-gray-100",
    "cursor-default"
  );
  
  const separatorStyles = clsx(
    "text-gray-400 dark:text-gray-500",
    "mx-1",
    "select-none"
  );
  
  const ellipsisButtonStyles = clsx(
    "text-sm font-medium",
    "text-gray-500 dark:text-gray-400",
    "hover:text-gray-700 dark:hover:text-gray-200",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    "px-1.5 py-0.5 rounded",
    "transition-colors duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  );
  
  // ============== BLOCK 4: Default Icons ==============
  
  const DefaultHomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );
  
  const DefaultSeparator: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
  
  // ============== BLOCK 5: Separator Component ==============
  
  const BreadcrumbSeparator: React.FC<{ separator?: React.ReactNode }> = ({
    separator,
  }) => (
    <span className={separatorStyles} aria-hidden="true">
      {separator || <DefaultSeparator className="h-4 w-4" />}
    </span>
  );
  
  // ============== BLOCK 6: Link Component ==============
  
  const BreadcrumbLink: React.FC<{
    item: BreadcrumbItem;
    isCurrent: boolean;
  }> = ({ item, isCurrent }) => {
    if (isCurrent) {
      return (
        <span className={currentStyles} aria-current="page">
          {item.label}
        </span>
      );
    }
  
    if (item.href) {
      return (
        <a href={item.href} className={linkStyles}>
          {item.label}
        </a>
      );
    }
  
    if (item.onClick) {
      return (
        <button type="button" onClick={item.onClick} className={linkStyles}>
          {item.label}
        </button>
      );
    }
  
    return <span className={linkStyles}>{item.label}</span>;
  };
  
  // ============== BLOCK 7: Component ==============
  
  export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
    (
      {
        items,
        separator,
        maxItems = 0,
        showHome = false,
        homeIcon,
        homeHref = "/",
        onHomeClick,
        className,
        ...props
      },
      ref
    ) => {
      const [isExpanded, setIsExpanded] = useState(false);
  
      // ============== BLOCK 8: Collapse Logic ==============
  
      const shouldCollapse = useMemo(() => {
        if (maxItems <= 0) return false;
        if (isExpanded) return false;
        return items.length > maxItems;
      }, [items.length, maxItems, isExpanded]);
  
      const visibleItems = useMemo(() => {
        if (!shouldCollapse) return items;
  
        // Show first item, ellipsis, and last (maxItems - 1) items
        const firstItem = items[0];
        const lastItems = items.slice(-(maxItems - 1));
  
        return { firstItem, lastItems, hiddenCount: items.length - maxItems };
      }, [items, shouldCollapse, maxItems]);
  
      const handleExpand = useCallback(() => {
        setIsExpanded(true);
      }, []);
  
      // ============== BLOCK 9: Render Home Item ==============
  
      const renderHomeItem = () => {
        if (!showHome) return null;
  
        const homeContent = (
          <>
            {homeIcon || <DefaultHomeIcon className="h-4 w-4" />}
            <span className="sr-only">Home</span>
          </>
        );
  
        return (
          <li className={itemStyles}>
            {onHomeClick ? (
              <button
                type="button"
                onClick={onHomeClick}
                className={linkStyles}
                aria-label="Home"
              >
                {homeContent}
              </button>
            ) : (
              <a href={homeHref} className={linkStyles} aria-label="Home">
                {homeContent}
              </a>
            )}
            <BreadcrumbSeparator separator={separator} />
          </li>
        );
      };
  
      // ============== BLOCK 10: Render Collapsed ==============
  
      const renderCollapsedItems = () => {
        if (!shouldCollapse || typeof visibleItems === "undefined") return null;
  
        const { firstItem, lastItems, hiddenCount } = visibleItems as {
          firstItem: BreadcrumbItem;
          lastItems: BreadcrumbItem[];
          hiddenCount: number;
        };
  
        return (
          <>
            {/* First Item */}
            <li className={itemStyles}>
              <BreadcrumbLink item={firstItem} isCurrent={false} />
              <BreadcrumbSeparator separator={separator} />
            </li>
  
            {/* Ellipsis Button */}
            <li className={itemStyles}>
              <button
                type="button"
                onClick={handleExpand}
                className={ellipsisButtonStyles}
                aria-label={`Show ${hiddenCount} more items`}
                title={`Show ${hiddenCount} more items`}
              >
                •••
              </button>
              <BreadcrumbSeparator separator={separator} />
            </li>
  
            {/* Last Items */}
            {lastItems.map((item, index) => {
              const isLast = index === lastItems.length - 1;
              return (
                <li key={`${item.label}-${index}`} className={itemStyles}>
                  <BreadcrumbLink item={item} isCurrent={isLast} />
                  {!isLast && <BreadcrumbSeparator separator={separator} />}
                </li>
              );
            })}
          </>
        );
      };
  
      // ============== BLOCK 11: Render Expanded ==============
  
      const renderExpandedItems = () => {
        if (shouldCollapse) return null;
  
        return items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={itemStyles}>
              <BreadcrumbLink item={item} isCurrent={isLast} />
              {!isLast && <BreadcrumbSeparator separator={separator} />}
            </li>
          );
        });
      };
  
      // ============== BLOCK 12: Main Render ==============
  
      return (
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={clsx(navStyles, className)}
          {...props}
        >
          <ol className={listStyles}>
            {renderHomeItem()}
            {shouldCollapse ? renderCollapsedItems() : renderExpandedItems()}
          </ol>
        </nav>
      );
    }
  );
  
  // ============== BLOCK 13: Display Name ==============
  
  Breadcrumb.displayName = "Breadcrumb";
  
  export default Breadcrumb;