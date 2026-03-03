// src/components/ui/Avatar/Avatar.tsx

// ============== BLOCK 1: Imports ==============

import React, { HTMLAttributes, forwardRef, useState, useMemo } from "react";
import clsx from "clsx";

// ============== BLOCK 2: Types ==============

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "busy" | "away";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  rounded?: boolean;
}

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  children: React.ReactNode;
}

// ============== BLOCK 3: Style Definitions ==============

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5 border",
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-2",
  lg: "h-3 w-3 border-2",
  xl: "h-4 w-4 border-2",
};

const statusColorStyles: Record<AvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

const fallbackColors: string[] = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

// ============== BLOCK 4: Helper Functions ==============

const getInitials = (name: string): string => {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  if (!name) return fallbackColors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % fallbackColors.length;
  return fallbackColors[index];
};

// ============== BLOCK 5: Default Icon Component ==============

const DefaultUserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M12 4a4 4 0 100 8 4 4 0 000-8zm-2 9a4 4 0 00-4 4v1a2 2 0 002 2h8a2 2 0 002-2v-1a4 4 0 00-4-4h-4z"
      clipRule="evenodd"
    />
  </svg>
);

// ============== BLOCK 6: Avatar Component ==============

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = "md",
      status,
      rounded = true,
      className,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const initials = useMemo(() => (name ? getInitials(name) : ""), [name]);
    const bgColor = useMemo(() => (name ? getColorFromName(name) : "bg-gray-400"), [name]);

    const showImage = src && !imageError;
    const showInitials = !showImage && initials;
    const showIcon = !showImage && !showInitials;

    // ============== BLOCK 7: Render ==============

    return (
      <div
        ref={ref}
        className={clsx(
          "relative inline-flex items-center justify-center",
          "font-medium text-white",
          "overflow-hidden flex-shrink-0",
          sizeStyles[size],
          rounded ? "rounded-full" : "rounded-md",
          !showImage && bgColor,
          className
        )}
        {...props}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        )}

        {showInitials && <span>{initials}</span>}

        {showIcon && <DefaultUserIcon className="h-3/5 w-3/5 text-white" />}

        {status && (
          <span
            className={clsx(
              "absolute bottom-0 right-0",
              "rounded-full",
              "border-white dark:border-gray-900",
              statusSizeStyles[size],
              statusColorStyles[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

// ============== BLOCK 8: Avatar Display Name ==============

Avatar.displayName = "Avatar";

// ============== BLOCK 9: AvatarGroup Component ==============

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      max = 4,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = childrenArray.length - max;

    // ============== BLOCK 10: AvatarGroup Render ==============

    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center -space-x-2",
          className
        )}
        {...props}
      >
        {visibleChildren.map((child, index) => {
          if (React.isValidElement<AvatarProps>(child)) {
            return React.cloneElement(child, {
              key: index,
              size: size,
              className: clsx(
                "ring-2 ring-white dark:ring-gray-900",
                child.props.className
              ),
            });
          }
          return child;
        })}

        {remainingCount > 0 && (
          <div
            className={clsx(
              "relative inline-flex items-center justify-center",
              "font-medium text-gray-600 dark:text-gray-300",
              "bg-gray-200 dark:bg-gray-700",
              "rounded-full",
              "ring-2 ring-white dark:ring-gray-900",
              sizeStyles[size]
            )}
          >
            <span>+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

// ============== BLOCK 11: AvatarGroup Display Name ==============

AvatarGroup.displayName = "AvatarGroup";

export default Avatar;