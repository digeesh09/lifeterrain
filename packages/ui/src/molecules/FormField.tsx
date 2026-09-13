import { ReactNode } from "react";

export function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-ink-700">
        {label} {required && <span className="text-leaf-700">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
