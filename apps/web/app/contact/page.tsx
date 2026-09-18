"use client";
import { useState } from "react";
import { Button, Card, FormField, Input, SectionHeading } from "@lifeterrain/ui";
import { Mail, Phone, MapPin } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side anti-XSS validation
    if (/<.*>/.test(form.name) || /<.*>/.test(form.email) || /<.*>/.test(form.message) || /<.*>/.test(form.phone)) {
      setError("Your message contains invalid characters (HTML tags are not allowed).");
      return;
    }

    setSending(true);
    try {
      // 1. Save directly to Firestore via Client SDK (Bypasses Admin DB needs)
      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        createdAt: serverTimestamp(),
      });

      // 2. Try sending the email notification in the background
      fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(console.error);
      
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <SectionHeading eyebrow="Get in Touch" title="Contact Us" subtitle="Questions about a course, a corporate training request, or a partnership idea — reach out." />
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 md:p-8">
          {sent ? (
            <p className="text-forest-700 font-medium">Thanks — your message has been sent. We'll get back to you shortly.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
              <FormField label="Name" required><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
              <FormField label="Email" required><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
              <FormField label="Phone Number" required><Input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
              <FormField label="Message" required>
                <textarea required className="min-h-32 rounded-lg border border-ink-500/20 px-4 py-2.5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </FormField>
              <Button type="submit" loading={sending}>Send Message</Button>
            </form>
          )}
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="flex items-center gap-4 p-5"><Mail className="h-5 w-5 text-leaf-500" /> anoopecothoughts@gmail.com</Card>
          <Card className="flex items-center gap-4 p-5"><Phone className="h-5 w-5 text-leaf-500" /> +91 87147 29406</Card>
          <Card className="flex items-center gap-4 p-5"><MapPin className="h-5 w-5 text-leaf-500" /> India</Card>
        </div>
      </div>
    </div>
  );
}
