import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { CalendarDays, Clock, Laptop } from "lucide-react";

export interface CourseSummary {
  slug: string;
  title: string;
  tagline?: string;
  coverImageUrl?: string;
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
    <Card hoverLift className="group flex h-full flex-col overflow-hidden">
      {course.coverImageUrl && !course.coverImageUrl.toLowerCase().includes('.pdf') ? (
        <div className="h-56 w-full overflow-hidden relative flex flex-col justify-end bg-forest-900/5">
          <img src={course.coverImageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-contain object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/20 to-transparent" />
          <div className="relative p-4 mt-auto">
            <Badge tone={statusTone[course.status]} className="mb-2">{course.status}</Badge>
            <h3 className="font-display text-lg font-bold leading-snug text-white">{course.title}</h3>
          </div>
        </div>
      ) : (
        <div className="bg-forest-700 px-5 py-4">
          <Badge tone={statusTone[course.status]}>{course.status}</Badge>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-white">{course.title}</h3>
        </div>
      )}
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
          <Button size="sm" onClick={() => onView?.(course.slug)}>
            View & Enroll
          </Button>
        </div>
      </div>
    </Card>
  );
}
