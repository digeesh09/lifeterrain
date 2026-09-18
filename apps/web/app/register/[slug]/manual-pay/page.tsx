"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Button, FormField, Input } from "@lifeterrain/ui";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManualPayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get("id");
  
  const [settings, setSettings] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoc(doc(db, "settings", "payment")).then((snap) => {
      setSettings(snap.exists() ? snap.data() : null);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollmentId) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "enrollments", enrollmentId), {
        status: "pending_verification",
        utrNumber,
        updatedAt: serverTimestamp(),
      });
      router.push("/dashboard?status=pending_verification");
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit transaction details. " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <Card className="p-8">
        <h1 className="font-display text-2xl font-bold text-forest-700">Manual Payment</h1>
        <p className="mt-2 text-ink-600">Please transfer the course fee to the following account and provide the UTR/Reference number below.</p>
        
        <div className="mt-6 rounded-lg bg-sage-50 p-6">
          {settings.upiId && <p><strong>UPI ID:</strong> {settings.upiId}</p>}
          {settings.bankDetails && <p className="mt-2 whitespace-pre-wrap"><strong>Bank Details:</strong><br/>{settings.bankDetails}</p>}
          {settings.qrCodeUrl && (
            <div className="mt-4">
              <img src={settings.qrCodeUrl} alt="UPI QR Code" className="h-48 w-48 rounded-lg border border-forest-700/10" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <FormField label="Transaction UTR / Reference Number" required>
            <Input required value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
          </FormField>
          <Button type="submit" loading={submitting}>Submit Payment for Verification</Button>
        </form>
      </Card>
    </div>
  );
}
