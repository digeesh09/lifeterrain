"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../atoms/Badge";

export interface TimelineDay { day: string; heading: string; points: string[]; }

/**
 * A click-through day selector for a course's curriculum — replaces a flat
 * grid of cards with a single focused panel, so scanning a 10-day course
 * feels like progress through a story rather than a wall of bullet lists.
 */
export function CourseTimeline({ days }: { days: TimelineDay[] }) {
  const [active, setActive] = useState(0);
  const current = days[active];

  return (
    <div className="rounded-xl2 bg-white p-5 shadow-card md:p-8">
      <div className="flex flex-wrap gap-2">
        {days.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              i === active
                ? "bg-forest-700 text-white shadow-md"
                : "bg-sage-50 text-ink-700 hover:bg-leaf-100"
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div className="relative mt-6 min-h-[10rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <Badge tone="forest">{current.day}</Badge>
            <h3 className="mt-3 font-display text-xl font-bold text-forest-700">{current.heading}</h3>
            <ul className="mt-3 space-y-2">
              {current.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-leaf-500" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-forest-700/10 pt-4">
        <button
          disabled={active === 0}
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          className="text-sm font-semibold text-forest-700 disabled:opacity-30"
        >
          ← Previous
        </button>
        <span className="text-xs font-semibold text-ink-500">{active + 1} / {days.length}</span>
        <button
          disabled={active === days.length - 1}
          onClick={() => setActive((a) => Math.min(days.length - 1, a + 1))}
          className="text-sm font-semibold text-forest-700 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
