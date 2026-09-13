import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          "rounded-lg border border-ink-500/20 bg-white px-4 py-2.5 text-ink-900",
          "focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/30",
          error && "border-red-400 focus:ring-red-300",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  )
);
Input.displayName = "Input";
