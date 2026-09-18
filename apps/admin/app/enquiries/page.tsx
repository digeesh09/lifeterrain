"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Card, Spinner } from "@lifeterrain/ui";

export default function AdminEnquiriesPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Contact Enquiries</h1>
      <p className="mt-1 text-ink-500">Messages submitted via the public Contact page.</p>

      <div className="mt-6 flex flex-col gap-3">
        {rows.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink-900">
                {r.name} 
                <span className="font-normal text-ink-500">
                  {" "}· {r.email}
                  {r.phone && ` · ${r.phone}`}
                </span>
              </p>
              <span className="text-xs text-ink-500">{r.createdAt?.toDate?.().toLocaleString?.() ?? ""}</span>
            </div>
            <p className="mt-2 text-sm text-ink-700 whitespace-pre-wrap">{r.message}</p>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-ink-500">No enquiries yet.</p>}
      </div>
    </div>
  );
}
