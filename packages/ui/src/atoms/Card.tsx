import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, children, hoverLift, ...props }: HTMLAttributes<HTMLDivElement> & { hoverLift?: boolean }) {
  return (
    <div
      className={clsx(
        "rounded-xl2 bg-white shadow-card ring-1 ring-forest-700/5 transition-all duration-300",
        hoverLift && "hover:-translate-y-1.5 hover:shadow-xl hover:ring-leaf-500/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
