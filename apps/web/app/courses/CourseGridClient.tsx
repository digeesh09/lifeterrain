"use client";
import { useRouter } from "next/navigation";
import { CourseGrid } from "@lifeterrain/ui";

export default function CourseGridClient({ courses }: { courses: any[] }) {
  const router = useRouter();
  return <CourseGrid courses={courses} onView={(slug) => router.push(`/courses/${slug}`)} />;
}
