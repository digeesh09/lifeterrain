import Image from "next/image";
import { ReactNode } from "react";
import { Badge } from "../atoms/Badge";

export function AboutSplit({
  eyebrow,
  title,
  children,
  imageUrl,
  imageAlt,
  reverse,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative h-64 overflow-hidden rounded-xl2 shadow-card md:h-96">
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div>
          <Badge tone="leaf">{eyebrow}</Badge>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-forest-700 md:text-3xl">{title}</h2>
          <div className="mt-4 space-y-3 text-ink-700">{children}</div>
        </div>
      </div>
    </section>
  );
}
