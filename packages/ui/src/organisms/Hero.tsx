"use client";

import Image from "next/image";
import { Badge } from "../atoms/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest-900">
      <Image
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=70"
        alt="Sunlight through a forest canopy"
        fill
        priority
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/80 to-forest-700/40" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 md:px-6 md:py-32">
        <Badge tone="gold">Climate Knowledge for a Better Tomorrow</Badge>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
          Turning Scientific Research into Real-World Environmental Impact
        </h1>
        <p className="max-w-xl text-lg text-cream/85">
          LifeTerrain Research &amp; Training runs practical courses, workshops and expert-led
          sessions in environment, biodiversity, and sustainability — measure, reduce, verify, monetise.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/courses" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-lg font-display font-semibold text-forest-900 transition-colors hover:bg-gold-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-300">
            Explore Courses
          </a>
          <a href="/about" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-3.5 text-lg font-display font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500">
            About Us
          </a>
        </div>
      </div>
    </section>
  );
}
