//src/components/ui/Button.tsx

import React, {
  ButtonHTMLAttributes,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "black";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Ripple animation duration in milliseconds - keep in sync with tailwind.config.js
const RIPPLE_DURATION = 1000;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = internalRef.current;
      if (!button || disabled || loading) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(button.clientWidth, button.clientHeight);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Ripple color based on variant
      const rippleColor =
        variant === "secondary" || variant === "ghost"
          ? "bg-black/20"
          : "bg-white/30";

      ripple.className = clsx(
        "absolute rounded-full pointer-events-none animate-ripple",
        rippleColor
      );

      button.appendChild(ripple);

      // Remove ripple after animation completes (1000ms)
      setTimeout(() => {
        ripple.remove();
      }, RIPPLE_DURATION);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(e);
      onClick?.(e);
    };

    const baseStyles = clsx(
      "relative overflow-hidden inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-200",
      "rounded-md",
      "select-none",
      "disabled:opacity-50 disabled:pointer-events-none",
      "focus:outline-none"
    );

    const variantStyles: Record<Variant, string> = {
      primary: clsx(
        "bg-blue-600 text-white",
        "hover:bg-blue-700",
        "active:bg-blue-800"
      ),
      secondary: clsx(
        "bg-gray-200 text-gray-900",
        "hover:bg-gray-300",
        "active:bg-gray-400",
        "dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      ),
      danger: clsx(
        "bg-red-600 text-white",
        "hover:bg-red-700",
        "active:bg-red-800"
      ),
      ghost: clsx(
        "bg-transparent text-gray-700",
        "hover:bg-gray-100",
        "active:bg-gray-200",
        "dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700"
      ),
      black: clsx(
        "text-white",
        "bg-gradient-to-b from-gray-700 via-gray-900 to-black",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
        "hover:from-gray-600 hover:via-gray-800 hover:to-gray-900",
        "active:from-gray-800 active:via-gray-950 active:to-black",
        "border border-gray-600"
      ),
    };

    const sizeStyles: Record<Size, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const spinnerSize: Record<Size, string> = {
      sm: "h-3 w-3 border-2",
      md: "h-4 w-4 border-2",
      lg: "h-5 w-5 border-2",
    };

    return (
      <button
        ref={internalRef}
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <span
            className={clsx(
              "animate-spin rounded-full border-current border-t-transparent",
              spinnerSize[size]
            )}
          />
        )}

        {!loading && leftIcon && leftIcon}

        <span>{children}</span>

        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";