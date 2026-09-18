"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Badge, Card, Spinner, Button } from "@lifeterrain/ui";
import { useRouter } from "next/navigation";

interface Enrollment {
  id: string;
  courseTitle: string;
  courseSlug: string;
  status: string;
  amount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Record<string, any>>({});

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return router.push("/login");
      const q = query(collection(db, "enrollments"), where("email", "==", u.email), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const enrs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setEnrollments(enrs);
      
      // Fetch courses for confirmed enrollments to get meeting links
      const courseMap: Record<string, any> = {};
      for (const e of enrs) {
        if (e.status === "confirmed" && !courseMap[e.courseSlug]) {
          const cq = query(collection(db, "courses"), where("slug", "==", e.courseSlug));
          const cSnap = await getDocs(cq);
          if (!cSnap.empty) {
            courseMap[e.courseSlug] = cSnap.docs[0].data();
          }
        }
      }
      setCourses(courseMap);
    });
  }, [router]);

  if (user === undefined) return <div className="flex justify-center py-24"><Spinner /></div>;

  const statusTone: Record<string, "leaf" | "gold" | "neutral"> = {
    confirmed: "leaf",
    pending_payment: "gold",
    cancelled: "neutral",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-2xl font-extrabold text-forest-700">My Enrollments</h1>
      <p className="mt-1 text-sm text-ink-500">
        You'll receive email &amp; WhatsApp reminders as your enrolled sessions approach.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {enrollments.length === 0 && (
          <Card className="p-6 text-ink-500">You haven't enrolled in any course yet. <a href="/courses" className="font-semibold text-forest-700">Browse courses →</a></Card>
        )}
        {enrollments.map((e) => {
          const course = courses[e.courseSlug];
          return (
            <Card key={e.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-bold text-ink-900 text-lg">{e.courseTitle}</p>
                  <p className="text-sm text-ink-500">Fee to pay: ₹{e.amount}</p>
                </div>
                <Badge tone={statusTone[e.status] ?? "neutral"}>{e.status.replace("_", " ")}</Badge>
              </div>

              {e.status === "pending_payment" && (
                <div className="mt-4 flex gap-3 border-t border-ink-500/10 pt-4">
                  <Button size="sm" onClick={() => router.push(`/register/${e.courseSlug}/manual-pay?id=${e.id}`)}>
                    Submit Payment Details
                  </Button>
                </div>
              )}

              {e.status === "confirmed" && course?.meetingLink && (
                <div className="mt-4 rounded-lg bg-forest-50 p-4 border border-forest-500/20">
                  <h3 className="text-sm font-bold text-forest-800">Meeting Details</h3>
                  <a href={course.meetingLink} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800 transition-colors">
                    Join Meeting
                  </a>
                  {course.meetingInfo && (
                    <p className="mt-3 text-sm text-forest-700 whitespace-pre-wrap">{course.meetingInfo}</p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
