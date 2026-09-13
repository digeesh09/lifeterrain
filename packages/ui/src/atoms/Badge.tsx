import { HTMLAttributes } from "react";
import clsx from "clsx";

type Tone = "gold" | "leaf" | "forest" | "neutral";

export function Badge({
  tone = "leaf",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  const tones: Record<Tone, string> = {
    gold: "bg-gold-500 text-forest-900",
    leaf: "bg-leaf-100 text-leaf-700",
    forest: "bg-forest-700 text-white",
    neutral: "bg-ink-500/10 text-ink-700",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
