import { collection, getDocs, doc, getDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase";
import type { CourseSummary } from "@lifeterrain/ui";

export interface CourseDoc extends CourseSummary {
  description: string;
  coverImageUrl?: string;
  curriculum: { day: string; heading: string; points: string[] }[];
  resourcePersons: { name: string; role: string; photoUrl?: string }[];
}

export async function listOpenCourses(): Promise<CourseDoc[]> {
  const q = query(collection(db, "courses"), where("status", "in", ["open", "upcoming"]), orderBy("startDateISO", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ slug: d.id, ...(d.data() as any) }));
}

export async function getCourseBySlug(slug: string): Promise<CourseDoc | null> {
  const q = query(collection(db, "courses"), where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.empty ? null : ({ slug: snap.docs[0].id, ...(snap.docs[0].data() as any) });
}
