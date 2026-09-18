"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { Badge, Button, Card, Spinner } from "@lifeterrain/ui";

export default function AdminEnrollmentsPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "enrollments"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function verifyPayment(id: string) {
    if (confirm("Mark this payment as confirmed?")) {
      await updateDoc(doc(db, "enrollments", id), { status: "confirmed", updatedAt: new Date() });
    }
  }

  if (loading) return <Spinner />;

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const statusTone: Record<string, "leaf" | "gold" | "neutral" | "forest"> = { 
    confirmed: "leaf", 
    pending_payment: "gold", 
    pending_verification: "forest",
    cancelled: "neutral" 
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-forest-700">Enrollments</h1>
        <select className="rounded-lg border border-ink-500/20 px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="pending_verification">Pending Verification (Manual)</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-700 text-white">
            <tr>
              <th className="px-4 py-3">Student Details</th>
              <th className="px-4 py-3">Course & Org</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-forest-700/10">
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-500">{r.email}</p>
                  <p className="text-xs text-ink-500">{r.phone}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold text-ink-900 line-clamp-1" title={r.courseTitle}>{r.courseTitle}</p>
                  <p className="text-xs text-ink-500">{r.organisation || "No org"} • {r.qualification || "No qual"}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-semibold text-ink-900">₹{r.amount}</p>
                  <div className="mt-1">
                    <Badge tone={statusTone[r.status] ?? "neutral"}>
                      {r.status === "pending_verification" ? "Verify UTR" : r.status}
                    </Badge>
                  </div>
                  {r.utrNumber && <p className="text-xs text-ink-500 mt-1 font-mono">UTR: {r.utrNumber}</p>}
                </td>
                <td className="px-4 py-3 align-top text-right">
                  {r.status === "pending_verification" && (
                    <Button size="sm" onClick={() => verifyPayment(r.id)}>Confirm</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-ink-500">No enrollments found.</p>}
      </div>
    </div>
  );
}
