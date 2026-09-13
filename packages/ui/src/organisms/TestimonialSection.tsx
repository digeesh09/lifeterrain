import { Quote } from "lucide-react";
import { SectionHeading } from "../molecules/SectionHeading";

export interface Testimonial { quote: string; name: string; role: string; }

export function TestimonialSection({ items }: { items: Testimonial[] }) {
  return (
    <section className="bg-forest-900">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading eyebrow="Participant Voices" title="What Learners Say" />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="rounded-xl2 bg-white/5 p-6 text-cream ring-1 ring-white/10">
              <Quote className="h-6 w-6 text-leaf-500" />
              <p className="mt-3 text-sm text-cream/90">{t.quote}</p>
              <p className="mt-4 font-display text-sm font-bold">{t.name}</p>
              <p className="text-xs text-cream/60">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
