"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Badge, Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";

interface PhotoRow {
  id: string;
  url: string;
  alt: string;
  category: string;
  addedAt?: string;
}

const emptyForm = { url: "", alt: "", category: "Workshops" };
const CATEGORY_OPTIONS = ["Workshops", "Team", "Fieldwork", "Sustainability"];

export default function AdminGalleryPage() {
  const { loading } = useAdminGuard();
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "galleryPhotos"), orderBy("addedAt", "desc"));
    return onSnapshot(q, (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, addedAt: new Date().toISOString().slice(0, 10), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "galleryPhotos", editingId), payload);
      else await addDoc(collection(db, "galleryPhotos"), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function edit(p: PhotoRow) {
    setForm({ url: p.url, alt: p.alt, category: p.category });
    setEditingId(p.id);
  }

  async function remove(id: string) {
    if (confirm("Remove this photo from the gallery?")) await deleteDoc(doc(db, "galleryPhotos", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Gallery</h1>
      <p className="mt-1 text-ink-500">Manage photos shown on the public Gallery page and the homepage's "Latest from the Gallery" strip.</p>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit Photo" : "Add New Photo"}</h2>
        <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Image URL" required hint="A hosted image link (Firebase Storage, Unsplash, etc.)">
              <Input required value={form.url} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </FormField>
          </div>
          <FormField label="Caption / Alt Text" required>
            <Input required value={form.alt} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, alt: e.target.value })} />
          </FormField>
          <FormField label="Category">
            <select className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          {form.url && (
            <div className="sm:col-span-2">
              <p className="mb-1 text-xs font-semibold text-ink-500">Preview</p>
              <img src={form.url} alt="preview" className="h-32 w-48 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>{editingId ? "Save Changes" : "Add Photo"}</Button>
            {editingId && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <img src={p.url} alt={p.alt} className="h-36 w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{p.alt}</p>
                <Badge tone="leaf" className="mt-1">{p.category}</Badge>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" onClick={() => edit(p)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {photos.length === 0 && <p className="text-ink-500">No photos yet — the public site is showing placeholder images until you add some here.</p>}
      </div>
    </div>
  );
}
