"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Badge, Card, Spinner } from "@lifeterrain/ui";
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

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return router.push("/login");
      const q = query(collection(db, "enrollments"), where("email", "==", u.email), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setEnrollments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
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
        {enrollments.map((e) => (
          <Card key={e.id} className="flex items-center justify-between p-5">
            <div>
              <p className="font-display font-bold text-ink-900">{e.courseTitle}</p>
              <p className="text-sm text-ink-500">Fee paid: ₹{e.amount}</p>
            </div>
            <Badge tone={statusTone[e.status] ?? "neutral"}>{e.status.replace("_", " ")}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
