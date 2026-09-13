"use client";
import { useEffect, useState } from "react";
import { useAdminGuard } from "@/lib/useAdminGuard";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Button, Card, FormField, Spinner } from "@lifeterrain/ui";

export default function AdminNotificationsPage() {
  const { loading } = useAdminGuard();
  const [courses, setCourses] = useState<any[]>([]);
  const [courseSlug, setCourseSlug] = useState("");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "both">("both");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, "courses"), (snap) => setCourses(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const token = await auth.currentUser?.getIdToken();
      const base = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL;
      const res = await fetch(`${base}/notifyEnrolled`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseSlug, channel, message }),
      });
      const data = await res.json();
      setResult(`Sent to ${data.count ?? 0} enrolled participants.`);
    } catch (err: any) {
      setResult(`Failed: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-forest-700">Send Notification</h1>
      <p className="mt-1 text-ink-500">
        Broadcast an update to everyone confirmed for a course — new material, a Zoom link change,
        or a manual reminder. Automatic day-before reminders already run on a schedule (see
        <code className="mx-1 rounded bg-forest-50 px-1">services/functions/src/notifications/reminders.ts</code>).
      </p>

      <Card className="mt-6 max-w-xl p-6">
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <FormField label="Course" required>
            <select required className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={courseSlug} onChange={(e) => setCourseSlug(e.target.value)}>
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c.id} value={c.slug ?? c.id}>{c.title}</option>)}
            </select>
          </FormField>
          <FormField label="Channel">
            <select className="rounded-lg border border-ink-500/20 px-4 py-2.5" value={channel} onChange={(e) => setChannel(e.target.value as any)}>
              <option value="both">Email + WhatsApp</option>
              <option value="email">Email only</option>
              <option value="whatsapp">WhatsApp only</option>
            </select>
          </FormField>
          <FormField label="Message" required>
            <textarea required className="min-h-32 rounded-lg border border-ink-500/20 px-4 py-2.5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Tomorrow's session link: ..." />
          </FormField>
          <Button type="submit" loading={sending}>Send to Enrolled Participants</Button>
          {result && <p className="text-sm text-forest-700">{result}</p>}
        </form>
      </Card>
    </div>
  );
}
