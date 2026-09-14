"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";

interface MemberRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order: number;
}

const emptyForm = { name: "", role: "", bio: "", photoUrl: "", order: 0 };

export default function AdminTeamPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "teamMembers", editingId), payload);
      else await addDoc(collection(db, "teamMembers"), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function edit(m: MemberRow) {
    setForm({ name: m.name, role: m.role, bio: m.bio, photoUrl: m.photoUrl, order: m.order ?? 0 });
    setEditingId(m.id);
  }

  async function remove(id: string) {
    if (confirm("Remove this team member?")) await deleteDoc(doc(db, "teamMembers", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Team & Resource Persons</h1>
      <p className="mt-1 text-ink-500">Shown on the homepage and About page. Order controls display sequence.</p>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit Member" : "Add New Member"}</h2>
        <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Name" required><Input required value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Role / Title" required><Input required value={form.role} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, role: e.target.value })} /></FormField>
          <div className="sm:col-span-2">
            <FormField label="Bio" required>
              <textarea required className="min-h-24 w-full rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Photo URL" required><Input required value={form.photoUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." /></FormField>
          <FormField label="Display Order"><Input type="number" value={form.order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: e.target.value })} /></FormField>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Add Member"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((m) => (
          <Card key={m.id} className="flex flex-col items-center p-5 text-center">
            <img src={m.photoUrl} alt={m.name} className="h-20 w-20 rounded-full object-cover" />
            <p className="mt-3 font-display font-bold text-ink-900">{m.name}</p>
            <p className="text-xs text-leaf-700">{m.role}</p>
            <p className="mt-2 text-xs text-ink-500">{m.bio}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => edit(m)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-ink-500">No team members yet — the site is showing placeholder profiles until you add some here.</p>}
      </div>
    </div>
  );
}
