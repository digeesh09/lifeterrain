import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("rounded-xl2 bg-white shadow-card ring-1 ring-forest-700/5", className)} {...props}>
      {children}
    </div>
  );
}
