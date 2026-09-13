export function PartnerStrip({ names, title = "Aligned With" }: { names: string[]; title?: string }) {
  return (
    <section className="border-y border-forest-700/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-500">{title}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {names.map((n) => (
            <span key={n} className="font-display text-sm font-bold text-forest-700/70 md:text-base">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
