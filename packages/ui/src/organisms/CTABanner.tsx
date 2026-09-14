"use client";

import { Button } from "../atoms/Button";

export function CTABanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-forest-700 to-forest-900 px-8 py-12 text-center shadow-card">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-leaf-300/20" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-forest-300/20" />
        <h2 className="relative font-display text-2xl font-extrabold text-white md:text-3xl">
          Smaller Footprints, Brighter Futures.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-cream/80">
          Join our next live cohort and build career-ready expertise in environment, sustainability and policy.
        </p>
        <Button variant="secondary" size="lg" className="relative mt-6" onClick={() => (window.location.href = "/courses")}>
          View Upcoming Courses
        </Button>
      </div>
    </section>
  );
}
