import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-white hover:bg-forest-900 focus-visible:ring-forest-500",
  secondary: "bg-leaf-500 text-white hover:bg-leaf-700 focus-visible:ring-leaf-300",
  outline: "border-2 border-forest-700 text-forest-700 hover:bg-forest-50 focus-visible:ring-forest-500",
  ghost: "text-forest-700 hover:bg-forest-50",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-5 py-2.5",
  lg: "text-lg px-7 py-3.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
