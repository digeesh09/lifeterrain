"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
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

function toDateInputValue(value: unknown): string {
  if (!value) return "";

  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    return toDateInputValue(value.toDate());
  }

  if (typeof value === "object" && value !== null && "seconds" in value && typeof value.seconds === "number") {
    return toDateInputValue(new Date(value.seconds * 1000));
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  const isoDate = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

export default function AdminCoursesPage() {
  const { loading } = useAdminGuard();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  function edit(c: any) {
    setForm({
      ...emptyForm,
      ...c,
      startDate: toDateInputValue(c.startDate || c.startDateISO),
      endDate: toDateInputValue(c.endDate),
    });
    setEditingId(c.id);
    setIsFormOpen(true);
  }

  async function remove(id: string) {
    if (confirm("Delete this course? This cannot be undone.")) await deleteDoc(doc(db, "courses", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-forest-700">Courses & Workshops</h1>
          <p className="mt-1 text-sm text-ink-500">Manage upcoming and past training programmes.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(true); }}>
          Add New Course
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {courses.length === 0 && (
          <Card className="p-8 text-center text-ink-500">No courses have been added yet.</Card>
        )}
        {courses.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-ink-900">{c.title}</p>
              <p className="text-sm text-ink-500">{c.startDate} · ₹{c.fee}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge tone={c.status === "open" ? "leaf" : "gold"}>{c.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => edit(c)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-900/60 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-form-title"
          onClick={() => !saving && setIsFormOpen(false)}
        >
          <Card className="my-4 w-full max-w-3xl p-6 md:my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <h2 id="course-form-title" className="font-display font-bold text-ink-900">{editingId ? "Edit Course" : "Add New Course"}</h2>
              <Button type="button" variant="ghost" onClick={() => !saving && setIsFormOpen(false)} aria-label="Close course form">
                X
              </Button>
            </div>
            <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Title" required><Input required value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Slug (URL, optional)"><Input value={form.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" /></FormField>
          <FormField label="Start Date" required><Input type="date" required value={form.startDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, startDate: e.target.value })} /></FormField>
          <FormField label="End Date"><Input type="date" value={form.endDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, endDate: e.target.value })} /></FormField>
          <FormField label="Time"><Input value={form.time} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, time: e.target.value })} placeholder="7:30 - 8:30 PM IST" /></FormField>
          <FormField label="Mode"><Input value={form.mode} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, mode: e.target.value })} /></FormField>
          <FormField label="Fee (₹)" required><Input type="number" required value={form.fee} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, fee: Number(e.target.value) })} /></FormField>
          <FormField label="Early-bird Fee (₹)"><Input type="number" value={form.earlyBirdFee} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, earlyBirdFee: Number(e.target.value) })} /></FormField>
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
              <Input value={form.coverImageUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Description">
              <textarea className="min-h-24 rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormField>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Create Course"}</Button>
            <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(false); }}>Cancel</Button>
          </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
