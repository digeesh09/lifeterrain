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
        <h1 className="font-display text-2xl font-bold text-forest-700">Complete Your Enrollment</h1>
        <p className="mt-2 text-ink-600">
          Almost there! To gain access to the course, please complete the payment using the details below.
        </p>
        
        <div className="mt-6 rounded-lg bg-sage-50 p-6 border border-sage-100">
          <h3 className="font-display font-semibold text-forest-700 mb-3">Step 1: Transfer the Course Fee</h3>
          {settings.upiId && <p className="mb-2"><strong>UPI ID:</strong> {settings.upiId}</p>}
          {settings.bankDetails && <p className="whitespace-pre-wrap mb-4"><strong>Bank Details:</strong><br/>{settings.bankDetails}</p>}
          {settings.qrCodeUrl && (
            <div className="mt-2">
              <p className="text-sm text-ink-500 mb-2">Or scan to pay via any UPI app:</p>
              <img src={settings.qrCodeUrl} alt="UPI QR Code" className="h-48 w-48 rounded-xl border border-forest-700/10 shadow-sm" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <h3 className="font-display font-semibold text-forest-700 mb-1">Step 2: Submit Reference Number</h3>
            <p className="text-sm text-ink-500 mb-4">After paying, enter the 12-digit UTR or Transaction Reference number so we can verify it.</p>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          <FormField label="Transaction UTR / Reference Number" required>
            <Input required placeholder="e.g. 312345678901" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
          </FormField>
          
          <Button type="submit" loading={submitting} className="mt-2">Submit & Complete Purchase</Button>
          <p className="text-center text-xs text-ink-400 mt-2">Our team will verify the payment and confirm your enrollment shortly.</p>
        </form>
      </Card>
    </div>
  );
}
