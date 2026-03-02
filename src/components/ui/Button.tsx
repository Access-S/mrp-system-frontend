import React, {
  ButtonHTMLAttributes,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

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
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const createRipple = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      const button = internalRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(button.clientWidth, button.clientHeight);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      const rippleColor =
        variant === "secondary" || variant === "ghost"
          ? "bg-black/20"
          : "bg-white/40";

      ripple.className = clsx(
        "absolute rounded-full pointer-events-none animate-ripple",
        rippleColor
      );

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    const baseStyles =
      "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variantStyles: Record<Variant, string> = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
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
        disabled={disabled || loading}
        onClick={(e) => {
          createRipple(e);
          props.onClick?.(e);
        }}
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