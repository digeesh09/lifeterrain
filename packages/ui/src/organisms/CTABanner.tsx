export function CTABanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-forest-700 to-forest-900 px-8 py-12 text-center shadow-card">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/20" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-leaf-500/20" />
        <h2 className="relative font-display text-2xl font-extrabold text-white md:text-3xl">
          Smaller Footprints, Brighter Futures.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-cream/80">
          Join our next live cohort and build career-ready expertise in environment, sustainability and policy.
        </p>
        <a href="/courses" className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-lg font-display font-semibold text-forest-900 transition-colors hover:bg-gold-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-300">
          View Upcoming Courses
        </a>
      </div>
    </section>
  );
}
