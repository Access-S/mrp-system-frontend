// src/components/ui/EmptyState/EmptyState.tsx

// ============== BLOCK 1: Imports ==============

import React from "react";
import clsx from "clsx";
import {
  FolderOpenIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";

// ============== BLOCK 2: Types ==============

type EmptyStateVariant =
  | "default"
  | "search"
  | "document"
  | "cart"
  | "users"
  | "product"
  | "error"
  | "offline";

type EmptyStateSize = "sm" | "md" | "lg";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// ============== BLOCK 3: Default Content ==============

const variantDefaults: Record<EmptyStateVariant, { icon: React.ReactNode; title: string; description: string }> = {
  default: {
    icon: <FolderOpenIcon />,
    title: "No data found",
    description: "There's nothing here yet. Start by adding some data.",
  },
  search: {
    icon: <MagnifyingGlassIcon />,
    title: "No results found",
    description: "We couldn't find anything matching your search. Try different keywords.",
  },
  document: {
    icon: <DocumentIcon />,
    title: "No documents",
    description: "You haven't uploaded any documents yet.",
  },
  cart: {
    icon: <ShoppingCartIcon />,
    title: "Your cart is empty",
    description: "Looks like you haven't added any items to your cart yet.",
  },
  users: {
    icon: <UsersIcon />,
    title: "No users found",
    description: "There are no users matching your criteria.",
  },
  product: {
    icon: <CubeIcon />,
    title: "No products",
    description: "You haven't added any products yet. Start by creating one.",
  },
  error: {
    icon: <ExclamationTriangleIcon />,
    title: "Something went wrong",
    description: "We encountered an error while loading. Please try again.",
  },
  offline: {
    icon: <WifiIcon />,
    title: "You're offline",
    description: "Please check your internet connection and try again.",
  },
};

// ============== BLOCK 4: Size Styles ==============

const sizeStyles: Record<EmptyStateSize, { container: string; icon: string; title: string; description: string }> = {
  sm: {
    container: "py-6 px-4",
    icon: "w-10 h-10",
    title: "text-sm font-medium",
    description: "text-xs",
  },
  md: {
    container: "py-10 px-6",
    icon: "w-14 h-14",
    title: "text-lg font-semibold",
    description: "text-sm",
  },
  lg: {
    container: "py-16 px-8",
    icon: "w-20 h-20",
    title: "text-xl font-bold",
    description: "text-base",
  },
};

// ============== BLOCK 5: Component ==============

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = "default",
  size = "md",
  icon,
  title,
  description,
  action,
  className,
}) => {
  const defaults = variantDefaults[variant];
  const styles = sizeStyles[size];

  const displayIcon = icon || defaults.icon;
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.description;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        styles.container,
        className
      )}
    >
      {/* Icon */}
      <div
        className={clsx(
          "text-gray-400 dark:text-gray-500 mb-4",
          styles.icon
        )}
      >
        {React.isValidElement(displayIcon) &&
          React.cloneElement(displayIcon as React.ReactElement, {
            className: clsx(styles.icon),
          })}
      </div>

      {/* Title */}
      <h3
        className={clsx(
          "text-gray-900 dark:text-gray-100 mb-2",
          styles.title
        )}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      <p
        className={clsx(
          "text-gray-500 dark:text-gray-400 max-w-sm mb-4",
          styles.description
        )}
      >
        {displayDescription}
      </p>

      {/* Action */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

// ============== BLOCK 6: Preset Components ==============

// For tables
export const EmptyTableState: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
  colSpan?: number;
}> = ({ title, description, action, colSpan = 5 }) => (
  <tr>
    <td colSpan={colSpan}>
      <EmptyState
        variant="default"
        size="md"
        title={title}
        description={description}
        action={action}
      />
    </td>
  </tr>
);

// For search results
export const EmptySearchState: React.FC<{
  query?: string;
  action?: React.ReactNode;
}> = ({ query, action }) => (
  <EmptyState
    variant="search"
    title="No results found"
    description={
      query
        ? `No results found for "${query}". Try different keywords.`
        : "We couldn't find anything matching your search."
    }
    action={action}
  />
);

// For product lists
export const EmptyProductState: React.FC<{
  action?: React.ReactNode;
}> = ({ action }) => (
  <EmptyState
    variant="product"
    title="No products yet"
    description="Get started by adding your first product."
    action={action}
  />
);

// For error states
export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <EmptyState
    variant="error"
    title={title}
    description={description}
    action={action}
  />
);

// ============== BLOCK 7: Display Name ==============

EmptyState.displayName = "EmptyState";

export default EmptyState;