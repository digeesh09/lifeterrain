"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Card, Spinner } from "@lifeterrain/ui";

export default function AdminSubscribersPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "newsletterSubscribers"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-forest-700">Newsletter Subscribers</h1>
        <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-semibold text-leaf-700">{rows.length} total</span>
      </div>
      <p className="mt-1 text-ink-500">People who signed up via the homepage newsletter form. Use with your notification tool of choice, or export for a mailing list.</p>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-700 text-white">
            <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Subscribed</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-forest-700/10">
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3 text-ink-500">{r.createdAt?.toDate?.().toLocaleDateString?.() ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-ink-500">No subscribers yet.</p>}
      </div>
    </div>
  );
}
