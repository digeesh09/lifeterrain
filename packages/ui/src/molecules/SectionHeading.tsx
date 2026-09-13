export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && (
        <span className="mb-2 inline-block rounded-full bg-leaf-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-extrabold text-forest-700 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-500">{subtitle}</p>}
    </div>
  );
}
