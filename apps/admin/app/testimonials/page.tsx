"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Badge, Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";

interface TestimonialRow {
  id: string;
  quote: string;
  name: string;
  role: string;
  published: boolean;
  order: number;
}

const emptyForm = { quote: "", name: "", role: "", published: true, order: 0 };

export default function AdminTestimonialsPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "testimonials", editingId), payload);
      else await addDoc(collection(db, "testimonials"), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function edit(t: TestimonialRow) {
    setForm({ quote: t.quote, name: t.name, role: t.role, published: t.published, order: t.order ?? 0 });
    setEditingId(t.id);
  }

  async function remove(id: string) {
    if (confirm("Delete this testimonial?")) await deleteDoc(doc(db, "testimonials", id));
  }

  async function togglePublished(t: TestimonialRow) {
    await updateDoc(doc(db, "testimonials", t.id), { published: !t.published });
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Testimonials</h1>
      <p className="mt-1 text-ink-500">Only testimonials marked "Published" appear on the homepage. Order controls display sequence (lower first).</p>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
        <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Quote" required>
              <textarea required className="min-h-24 w-full rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Name / Title" required hint="e.g. 'Environmental Consultant' — first names optional for privacy">
            <Input required value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Role / Course Batch" required>
            <Input required value={form.role} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, role: e.target.value })} placeholder="e.g. GHG Accounting Master Class" />
          </FormField>
          <FormField label="Display Order">
            <Input type="number" value={form.order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <label className="flex items-center gap-2 pt-2 text-sm font-semibold text-ink-700">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published (visible on site)
            </label>
          </FormField>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Add Testimonial"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        {rows.map((t) => (
          <Card key={t.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="text-sm italic text-ink-700">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">{t.name} · <span className="font-normal text-ink-500">{t.role}</span></p>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-2">
              <Badge tone={t.published ? "leaf" : "neutral"} className="cursor-pointer" onClick={() => togglePublished(t)}>
                {t.published ? "Published" : "Hidden"}
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => edit(t)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(t.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-ink-500">No testimonials yet — the homepage is showing placeholder quotes until you add some here.</p>}
      </div>
    </div>
  );
}
