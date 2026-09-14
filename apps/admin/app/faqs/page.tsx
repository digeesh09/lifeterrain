"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";

interface FAQRow { id: string; question: string; answer: string; order: number; }

const emptyForm = { question: "", answer: "", order: 0 };

export default function AdminFAQsPage() {
  const { loading } = useAdminGuard();
  const [rows, setRows] = useState<FAQRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "faqs"), orderBy("order", "asc"));
    return onSnapshot(q, (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "faqs", editingId), payload);
      else await addDoc(collection(db, "faqs"), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function edit(f: FAQRow) {
    setForm({ question: f.question, answer: f.answer, order: f.order ?? 0 });
    setEditingId(f.id);
  }

  async function remove(id: string) {
    if (confirm("Delete this FAQ?")) await deleteDoc(doc(db, "faqs", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">FAQs</h1>
      <p className="mt-1 text-ink-500">Shown in the homepage FAQ accordion, in order.</p>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit FAQ" : "Add New FAQ"}</h2>
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
          <FormField label="Question" required><Input required value={form.question} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, question: e.target.value })} /></FormField>
          <FormField label="Answer" required>
            <textarea required className="min-h-24 rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </FormField>
          <FormField label="Display Order"><Input type="number" className="max-w-[8rem]" value={form.order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: e.target.value })} /></FormField>
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Add FAQ"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="mt-8 flex flex-col gap-3">
        {rows.map((f) => (
          <Card key={f.id} className="flex items-start justify-between gap-4 p-4">
            <div>
              <p className="font-semibold text-ink-900">{f.question}</p>
              <p className="mt-1 text-sm text-ink-500">{f.answer}</p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Button size="sm" variant="outline" onClick={() => edit(f)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(f.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-ink-500">No FAQs yet — the site is showing placeholder Q&amp;As until you add some here.</p>}
      </div>
    </div>
  );
}
