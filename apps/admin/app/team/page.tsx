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
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "teamMembers"), orderBy("order", "asc"));
    return onSnapshot(
      q, 
      (snap) => setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))),
      (error) => {
        console.error("Firestore error:", error);
        alert(`Error loading team: ${error.message}`);
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
        setForm((prev: any) => ({ ...prev, photoUrl: data.url }));
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
      const payload = { ...form, order: Number(form.order), updatedAt: serverTimestamp() };
      if (editingId) await updateDoc(doc(db, "teamMembers", editingId), payload);
      else await addDoc(collection(db, "teamMembers"), { ...payload, createdAt: serverTimestamp() });
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

  function edit(m: MemberRow) {
    setForm({ name: m.name, role: m.role, bio: m.bio, photoUrl: m.photoUrl, order: m.order ?? 0 });
    setEditingId(m.id);
    setIsFormOpen(true);
  }

  async function remove(id: string) {
    if (confirm("Remove this team member?")) await deleteDoc(doc(db, "teamMembers", id));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-forest-700">Team & Resource Persons</h1>
          <p className="mt-1 text-ink-500">Shown on the homepage and About page. Order controls display sequence.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(true); }}>
          Add New Member
        </Button>
      </div>

      {isFormOpen && (
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
            <div className="sm:col-span-2">
              <FormField label="Photo URL" required hint="Upload an image or provide a link">
                <div className="flex flex-col gap-2">
                  <Input required value={form.photoUrl || ""} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
                  <div className="flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    {uploadingImage && <span className="text-sm text-ink-500">Uploading... {Math.round(uploadProgress)}%</span>}
                  </div>
                </div>
              </FormField>
            </div>
            {form.photoUrl && (
              <div className="sm:col-span-2">
                <p className="mb-1 text-xs font-semibold text-ink-500">Preview</p>
                <img src={form.photoUrl} alt="preview" className="h-20 w-20 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
            <FormField label="Display Order"><Input type="number" value={form.order} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, order: e.target.value })} /></FormField>
            <div className="flex gap-3 sm:col-span-2 mt-2">
              <Button type="submit" loading={saving} disabled={uploadingImage}>{editingId ? "Save Changes" : "Add Member"}</Button>
              <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); setIsFormOpen(false); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

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
