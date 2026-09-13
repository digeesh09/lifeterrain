"use client";
import { useEffect, useRef, useState } from "react";

export interface Stat { value: number; suffix?: string; label: string; }

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / durationMs, 1);
      setN(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);
  return n;
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setActive(true), { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const n = useCountUp(stat.value, active);
  return (
    <div ref={ref}>
      <p className="font-display text-4xl font-extrabold text-white md:text-5xl">
        {n}
        {stat.suffix}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cream/80 md:text-sm">{stat.label}</p>
    </div>
  );
}

/** Scroll-triggered count-up stats, in the register of WTI's "SOUL ACCOUNTING" / BRI's homepage counters. */
export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-forest-700">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-14 text-center md:grid-cols-4 md:px-6">
        {stats.map((s) => (
          <Counter key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}
