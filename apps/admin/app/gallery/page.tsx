"use client";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Badge, Button, Card, FormField, Input, Spinner } from "@lifeterrain/ui";
import { RichTextEditor } from "../courses/RichTextEditor";

interface PhotoRow {
  id: string;
  url: string;
  alt: string;
  category: string;
  addedAt?: string;
  type?: "image" | "video";
}

const emptyForm = { url: "", alt: "", category: "Workshops", description: "", type: "image" };
const CATEGORY_OPTIONS = ["Workshops", "Team", "Fieldwork", "Sustainability"];

export default function AdminGalleryPage() {
  const { loading } = useAdminGuard();
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "galleryPhotos"), orderBy("addedAt", "desc"));
    return onSnapshot(
      q, 
      (snap) => setPhotos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))),
      (error) => {
        console.error("Firestore error:", error);
        alert(`Error loading gallery: ${error.message}`);
      }
    );
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(90);

      const data = await res.json();
      if (data.success) {
        setForm((prev: any) => ({ ...prev, url: data.url }));
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadProgress(100);
      setUploadingImage(false);
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, addedAt: new Date().toISOString().slice(0, 10), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "galleryPhotos", editingId), payload);
      else await addDoc(collection(db, "galleryPhotos"), { ...payload, createdAt: serverTimestamp() });
      setForm(emptyForm);
      setEditingId(null);
      setIsFormOpen(false);
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  function edit(p: PhotoRow) {
    setForm({ url: p.url || "", alt: p.alt || "", category: p.category || "Workshops", description: (p as any).description || "", type: p.type || "image" });
    setEditingId(p.id);
    setIsFormOpen(true);
  }

  async function remove(id: string) {
    if (confirm("Remove this photo from the gallery?")) await deleteDoc(doc(db, "galleryPhotos", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-forest-700">Gallery</h1>
          <p className="mt-1 text-ink-500">Manage photos shown on the public Gallery page and the homepage's "Latest from the Gallery" strip.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(true); }}>
          Add New Item
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-bold text-ink-900">{editingId ? "Edit Item" : "Add New Item"}</h2>
          </div>
          <form onSubmit={handleSave} className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Type">
              <select className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </FormField>
            <FormField label="Category">
              <select className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="URL" required hint={`Upload a ${form.type === "video" ? "video" : "file"} or provide a link`}>
                <div className="flex flex-col gap-2">
                  <Input required value={form.url || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
                  <div className="flex items-center gap-2">
                    <Input type="file" accept={form.type === "video" ? "video/*" : "image/*,application/pdf"} onChange={handleImageUpload} disabled={uploadingImage} />
                    {uploadingImage && <span className="text-sm text-ink-500">Uploading... {Math.round(uploadProgress)}%</span>}
                  </div>
                </div>
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Caption / Alt Text" required>
                <Input required value={form.alt || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, alt: e.target.value })} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Description">
                <RichTextEditor value={form.description || ""} onChange={(val: string) => setForm({ ...form, description: val })} />
              </FormField>
            </div>
            {form.url && (
              <div className="sm:col-span-2">
                <p className="mb-1 text-xs font-semibold text-ink-500">Preview</p>
                {form.type === "video" ? (
                  <video src={form.url} controls className="h-48 w-auto rounded-lg object-contain bg-ink-900" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <img src={form.url} alt="preview" className="h-32 w-48 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>
            )}
            <div className="flex gap-3 sm:col-span-2 mt-4">
              <Button type="submit" loading={saving} disabled={uploadingImage}>{editingId ? "Save Changes" : "Add Item"}</Button>
              <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(false); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            {p.type === "video" ? (
              <video src={p.url} className="h-36 w-full object-cover bg-ink-900" />
            ) : (
              <img src={p.url} alt={p.alt} className="h-36 w-full object-cover" />
            )}
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{p.alt}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tone="leaf">{p.category}</Badge>
                  {p.type === "video" && <Badge tone="gold">Video</Badge>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" onClick={() => edit(p)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {photos.length === 0 && <p className="text-ink-500">No items yet — the public site is showing placeholders until you add some here.</p>}
      </div>
    </div>
  );
}
