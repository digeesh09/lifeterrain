"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading";

export interface FAQItem { q: string; a: string; }

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
      <div className="flex flex-col divide-y divide-forest-700/10 rounded-xl2 bg-white shadow-card">
        {items.map((item, i) => (
          <div key={item.q} className="px-5">
            <button
              className="flex w-full items-center justify-between py-4 text-left font-semibold text-ink-900"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
              <ChevronDown className={`h-4 w-4 flex-shrink-0 text-forest-700 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-4 text-sm text-ink-500">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
