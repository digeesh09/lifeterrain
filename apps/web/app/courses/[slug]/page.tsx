import { getCourseBySlug } from "@/lib/courses";
import { Badge, Button, Reveal, CourseTimeline } from "@lifeterrain/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, Laptop, Users } from "lucide-react";

export const revalidate = 60;

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return notFound();

  return (
    <>
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <Image
          src={course.coverImageUrl || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=70"}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-forest-900/50" />
      </div>
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <Reveal>
        <Badge tone="leaf">{course.status}</Badge>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-forest-700 md:text-4xl">{course.title}</h1>
        <p className="mt-4 text-ink-700">{course.description}</p>

        <div className="mt-6 grid gap-4 rounded-xl2 bg-white p-6 shadow-card sm:grid-cols-2">
          <span className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-leaf-500" /> {course.startDate}{course.endDate ? ` – ${course.endDate}` : ""}</span>
          {course.time && <span className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-leaf-500" /> {course.time}</span>}
          {course.mode && <span className="flex items-center gap-2 text-sm"><Laptop className="h-4 w-4 text-leaf-500" /> {course.mode}</span>}
          {course.seatsLeft !== undefined && <span className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-leaf-500" /> {course.seatsLeft} seats left</span>}
        </div>
      </Reveal>

      {course.curriculum?.length > 0 && (
        <Reveal className="mt-10">
          <h2 className="font-display text-2xl font-bold text-forest-700">Course Structure</h2>
          <p className="mt-1 text-sm text-ink-500">Click through each day to see what's covered.</p>
          <div className="mt-4">
            <CourseTimeline days={course.curriculum} />
          </div>
        </Reveal>
      )}

      {course.resourcePersons?.length > 0 && (
        <Reveal className="mt-10">
          <h2 className="font-display text-2xl font-bold text-forest-700">Resource Persons</h2>
          <div className="mt-4 flex flex-wrap gap-6">
            {course.resourcePersons.map((r) => (
              <div key={r.name} className="text-center">
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-leaf-100" />
                <p className="mt-2 font-semibold text-ink-900">{r.name}</p>
                <p className="text-xs text-ink-500">{r.role}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <div className="sticky bottom-4 mt-10 flex items-center justify-between rounded-xl2 bg-forest-700 p-5 text-white shadow-card">
        <div>
          <p className="text-sm text-cream/70">Course Fee</p>
          <p className="font-display text-2xl font-extrabold">₹{course.fee}</p>
        </div>
        <Link href={`/register/${course.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-lg font-display font-semibold text-forest-900 transition-colors hover:bg-gold-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-300">
          Register &amp; Pay
        </Link>
      </div>
    </div>
    </>
  );
}
