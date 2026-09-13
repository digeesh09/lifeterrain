"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Badge, Card, Spinner } from "@lifeterrain/ui";

export default function AdminEnrollmentsPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "enrollments"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  if (loading) return <Spinner />;

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const statusTone: Record<string, "leaf" | "gold" | "neutral"> = { confirmed: "leaf", pending_payment: "gold", cancelled: "neutral" };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-forest-700">Enrollments</h1>
        <select className="rounded-lg border border-ink-500/20 px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-700 text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-forest-700/10">
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3">{r.courseTitle}</td>
                <td className="px-4 py-3 text-ink-500">{r.email}<br />{r.phone}</td>
                <td className="px-4 py-3">₹{r.amount}</td>
                <td className="px-4 py-3"><Badge tone={statusTone[r.status] ?? "neutral"}>{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-ink-500">No enrollments found.</p>}
      </div>
    </div>
  );
}
