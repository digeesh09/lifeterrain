import { getCourseBySlug } from "@/lib/courses";
import { Badge, Button, Reveal, CourseTimeline } from "@lifeterrain/ui";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, Laptop, Users } from "lucide-react";
import { BrochureViewer } from "./BrochureViewer";

export const revalidate = 10;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: "Course Not Found" };

  const plainDescription = course.description?.replace(/<[^>]+>/g, '').substring(0, 160) || "Join LifeTerrain Research & Training.";
  const title = `${course.title} | LifeTerrain`;

  return {
    title,
    description: plainDescription,
    openGraph: {
      title,
      description: plainDescription,
      images: course.coverImageUrl ? [course.coverImageUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: plainDescription,
      images: course.coverImageUrl ? [course.coverImageUrl] : [],
    },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        
        {/* Brochure / Cover Image */}
        <div>
          <Reveal>
            <div className="w-full overflow-hidden rounded-xl shadow-card bg-forest-900/5">
              {course.coverImageUrl?.toLowerCase().includes('.pdf') ? (
                <iframe src={course.coverImageUrl} className="w-full h-[600px] border-0" title={course.title} />
              ) : (
                <BrochureViewer 
                  src={course.coverImageUrl || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=70"}
                  alt={course.title}
                />
              )}
            </div>
          </Reveal>
        </div>

        {/* Details */}
        <div>
          <Reveal>
            <Badge tone="leaf">{course.status}</Badge>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-forest-700 md:text-4xl">{course.title}</h1>
            <div 
              className="mt-4 prose prose-ink max-w-none text-ink-700 prose-p:leading-relaxed prose-a:text-forest-600 hover:prose-a:text-forest-700" 
              dangerouslySetInnerHTML={{ __html: course.description || "" }} 
            />

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
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-leaf-100">
                  {r.photoUrl && (
                    <Image src={r.photoUrl} alt={r.name} fill unoptimized={true} className="object-cover" sizes="80px" />
                  )}
                </div>
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
        <Link href={`/register/${course.slug}`}>
          <Button variant="secondary" size="lg">Register & Pay</Button>
        </Link>
      </div>
        </div>
      </div>
    </div>
  );
}
