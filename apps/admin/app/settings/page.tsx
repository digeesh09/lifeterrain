"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({ mode: "razorpay", upiId: "", bankDetails: "", qrCodeUrl: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getDoc(doc(db, "settings", "payment")).then((snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "settings", "payment"), settings);
      setMessage("Settings saved successfully.");
    } catch (err: any) {
      setMessage("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-forest-700">Payment Settings</h1>
      <p className="mb-6 text-sm text-ink-500">Configure how students pay for courses.</p>
      
      <form onSubmit={handleSave} className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-ink-700">Payment Mode</label>
          <select 
            value={settings.mode} 
            onChange={e => setSettings({...settings, mode: e.target.value})}
            className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
          >
            <option value="razorpay">Razorpay Gateway (Automatic)</option>
            <option value="manual">Manual Bank Transfer / UPI (Verification required)</option>
          </select>
        </div>

        {settings.mode === "manual" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-ink-700">UPI ID</label>
              <input 
                type="text" 
                value={settings.upiId} 
                onChange={e => setSettings({...settings, upiId: e.target.value})}
                className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
                placeholder="e.g. lifeterrain@okhdfcbank"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700">Bank Details</label>
              <textarea 
                value={settings.bankDetails} 
                onChange={e => setSettings({...settings, bankDetails: e.target.value})}
                className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2 h-24"
                placeholder="Account Name: ...&#10;Account No: ...&#10;IFSC: ..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-700">QR Code Image</label>
              {settings.qrCodeUrl && (
                <img src={settings.qrCodeUrl} alt="QR Code" className="my-2 h-32 w-32 rounded-lg border border-ink-500/20 object-cover" />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 800000) {
                    alert("Image too large. Max 800KB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setSettings({...settings, qrCodeUrl: ev.target?.result as string});
                  };
                  reader.readAsDataURL(file);
                }}
                className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-ink-500">Max size: 800KB. The image will be securely saved into the database.</p>
            </div>
          </>
        )}

        <button 
          type="submit" 
          disabled={saving}
          className="mt-4 rounded-lg bg-leaf-500 px-4 py-2 font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p className="text-sm font-semibold text-forest-700">{message}</p>}
      </form>
    </div>
  );
}
