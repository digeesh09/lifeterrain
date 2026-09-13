import { listOpenCourses } from "@/lib/courses";
import CourseGridClient from "./CourseGridClient";

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await listOpenCourses().catch(() => []);
  return (
    <div className="pt-4">
      <CourseGridClient courses={courses} />
    </div>
  );
}
