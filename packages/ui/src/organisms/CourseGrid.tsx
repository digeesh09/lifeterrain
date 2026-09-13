import { CourseCard, CourseSummary } from "../molecules/CourseCard";
import { SectionHeading } from "../molecules/SectionHeading";

export function CourseGrid({ courses, onView }: { courses: CourseSummary[]; onView?: (slug: string) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading
        eyebrow="Upcoming Programmes"
        title="Courses & Workshops"
        subtitle="Live, interactive, and led by practicing researchers and policy experts."
      />
      {courses.length === 0 ? (
        <p className="text-ink-500">No courses are open for registration right now. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} onView={onView} />
          ))}
        </div>
      )}
    </section>
  );
}
