"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Registered Users</h1>
      <p className="mt-1 mb-6 text-sm text-ink-500">All users who have created an account.</p>

      <div className="overflow-hidden rounded-xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-forest-700/10 bg-sage-50 text-ink-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Institution</th>
              <th className="px-4 py-3 font-semibold">Joined At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-700/10">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-sage-50/50">
                <td className="px-4 py-3 font-medium text-forest-700">{u.name || "N/A"}</td>
                <td className="px-4 py-3 text-ink-600">{u.email}</td>
                <td className="px-4 py-3 text-ink-600">{u.phone || "-"}</td>
                <td className="px-4 py-3 text-ink-600">{u.institution || "-"}</td>
                <td className="px-4 py-3 text-ink-500">{u.createdAt?.toDate()?.toLocaleDateString() || "-"}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-ink-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
