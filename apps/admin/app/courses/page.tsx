"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Badge, Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";

interface CourseRow {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  fee: number;
  status: string;
}

const emptyForm = { title: "", slug: "", startDate: "", endDate: "", time: "", mode: "Online | Live Interactive", fee: 0, earlyBirdFee: 0, description: "", status: "upcoming", coverImageUrl: "" };

export default function AdminCoursesPage() {
  const { loading } = useAdminGuard();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, "courses"), (snap) => {
      setCourses(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const startDateISO = form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString();
      const payload = { ...form, slug, startDateISO, updatedAt: serverTimestamp() };
      if (editingId) {
        await updateDoc(doc(db, "courses", editingId), payload);
      } else {
        await addDoc(collection(db, "courses"), { ...payload, createdAt: serverTimestamp() });
      }
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function edit(c: any) {
    setForm(c);
    setEditingId(c.id);
  }

  async function remove(id: string) {
    if (confirm("Delete this course? This cannot be undone.")) await deleteDoc(doc(db, "courses", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Courses & Workshops</h1>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit Course" : "Add New Course"}</h2>
        <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Title" required><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Slug (URL, optional)"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" /></FormField>
          <FormField label="Start Date" required><Input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></FormField>
          <FormField label="End Date"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></FormField>
          <FormField label="Time"><Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="7:30 - 8:30 PM IST" /></FormField>
          <FormField label="Mode"><Input value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} /></FormField>
          <FormField label="Fee (₹)" required><Input type="number" required value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></FormField>
          <FormField label="Early-bird Fee (₹)"><Input type="number" value={form.earlyBirdFee} onChange={(e) => setForm({ ...form, earlyBirdFee: Number(e.target.value) })} /></FormField>
          <FormField label="Status">
            <select className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="upcoming">Upcoming</option>
              <option value="open">Open for Registration</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Cover Image URL" hint="Shown on the course detail page banner (e.g. an Unsplash or your own hosted image link)">
              <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Description">
              <textarea className="min-h-24 rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormField>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Create Course"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        {courses.map((c) => (
          <Card key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-display font-bold text-ink-900">{c.title}</p>
              <p className="text-sm text-ink-500">{c.startDate} · ₹{c.fee}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={c.status === "open" ? "leaf" : "gold"}>{c.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => edit(c)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
