"use client";

import { Badge } from "../atoms/Badge";
import { Card } from "../atoms/Card";
import { CalendarDays, Clock, Laptop } from "lucide-react";

export interface CourseSummary {
  slug: string;
  title: string;
  tagline?: string;
  startDate: string; // human formatted e.g. "30 Nov 2026"
  endDate?: string;
  time?: string; // "7:30 - 8:30 PM IST"
  mode?: string; // "Online | Live Interactive"
  fee: number;
  earlyBirdFee?: number;
  earlyBirdDeadline?: string;
  seatsLeft?: number;
  status: "upcoming" | "open" | "closed" | "completed";
}

export function CourseCard({ course, onView }: { course: CourseSummary; onView?: (slug: string) => void }) {
  const statusTone = { upcoming: "gold", open: "leaf", closed: "neutral", completed: "neutral" } as const;
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="bg-forest-700 px-5 py-4">
        <Badge tone={statusTone[course.status]}>{course.status}</Badge>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">{course.title}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-4">
        {course.tagline && <p className="text-sm text-ink-500">{course.tagline}</p>}
        <div className="flex flex-col gap-1.5 text-sm text-ink-700">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-leaf-500" />
            {course.startDate}
            {course.endDate ? ` – ${course.endDate}` : ""}
          </span>
          {course.time && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-leaf-500" /> {course.time}
            </span>
          )}
          {course.mode && (
            <span className="flex items-center gap-2">
              <Laptop className="h-4 w-4 text-leaf-500" /> {course.mode}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-display text-xl font-bold text-forest-700">₹{course.fee}</span>
            {course.earlyBirdFee && (
              <span className="ml-2 text-xs text-ink-500 line-through">₹{course.earlyBirdFee}</span>
            )}
          </div>
          <a href={`/courses/${course.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-3 py-1.5 text-sm font-display font-semibold text-white transition-colors hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500">
            View & Enroll
          </a>
        </div>
      </div>
    </Card>
  );
}
