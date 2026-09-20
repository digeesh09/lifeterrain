"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [paymentSettings, setPaymentSettings] = useState<any>({ mode: "razorpay", upiId: "", bankDetails: "", qrCodeUrl: "" });
  const [contactSettings, setContactSettings] = useState<any>({ email: "anoopecothoughts@gmail.com", phone: "+91 87147 29406", address: "India" });
  const [authSettings, setAuthSettings] = useState<any>({ allowGoogleSignIn: true, allowRegistration: true });
  
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [savingContact, setSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const [savingAuth, setSavingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  
  const [statsSettings, setStatsSettings] = useState<any>({ programmes: 3, days: 5, interactive: 1, experts: 5 });
  const [savingStats, setSavingStats] = useState(false);
  const [statsMessage, setStatsMessage] = useState("");

  useEffect(() => {
    getDoc(doc(db, "settings", "payment")).then((snap) => {
      if (snap.exists()) setPaymentSettings(snap.data());
    });
    getDoc(doc(db, "settings", "contact")).then((snap) => {
      if (snap.exists()) setContactSettings(snap.data());
    });
    getDoc(doc(db, "settings", "auth")).then((snap) => {
      if (snap.exists()) setAuthSettings(snap.data());
    });
    getDoc(doc(db, "settings", "stats")).then((snap) => {
      if (snap.exists()) setStatsSettings(snap.data());
    });
  }, []);

  async function handleSaveStats(e: React.FormEvent) {
    e.preventDefault();
    setSavingStats(true);
    setStatsMessage("");
    try {
      await setDoc(doc(db, "settings", "stats"), statsSettings);
      setStatsMessage("Stats settings saved successfully.");
    } catch (err: any) {
      setStatsMessage("Failed to save: " + err.message);
    } finally {
      setSavingStats(false);
    }
  }

  async function handleSavePayment(e: React.FormEvent) {
    e.preventDefault();
    setSavingPayment(true);
    setPaymentMessage("");
    try {
      await setDoc(doc(db, "settings", "payment"), paymentSettings);
      setPaymentMessage("Payment settings saved successfully.");
    } catch (err: any) {
      setPaymentMessage("Failed to save: " + err.message);
    } finally {
      setSavingPayment(false);
    }
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setSavingContact(true);
    setContactMessage("");
    try {
      await setDoc(doc(db, "settings", "contact"), contactSettings);
      setContactMessage("Contact settings saved successfully.");
    } catch (err: any) {
      setContactMessage("Failed to save: " + err.message);
    } finally {
      setSavingContact(false);
    }
  }

  async function handleSaveAuth(e: React.FormEvent) {
    e.preventDefault();
    setSavingAuth(true);
    setAuthMessage("");
    try {
      await setDoc(doc(db, "settings", "auth"), authSettings);
      setAuthMessage("Auth settings saved successfully.");
    } catch (err: any) {
      setAuthMessage("Failed to save: " + err.message);
    } finally {
      setSavingAuth(false);
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-10">
      
      {/* Auth Settings */}
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-700">Authentication Settings</h1>
        <p className="mb-4 text-sm text-ink-500">Configure login and registration behavior.</p>
        
        <form onSubmit={handleSaveAuth} className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="googleSignIn"
              checked={authSettings.allowGoogleSignIn} 
              onChange={e => setAuthSettings({...authSettings, allowGoogleSignIn: e.target.checked})}
              className="h-4 w-4 rounded border-ink-500 text-leaf-500 focus:ring-leaf-500"
            />
            <label htmlFor="googleSignIn" className="text-sm font-semibold text-ink-700">Enable Google Sign-In</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="allowRegistration"
              checked={authSettings.allowRegistration} 
              onChange={e => setAuthSettings({...authSettings, allowRegistration: e.target.checked})}
              className="h-4 w-4 rounded border-ink-500 text-leaf-500 focus:ring-leaf-500"
            />
            <label htmlFor="allowRegistration" className="text-sm font-semibold text-ink-700">Enable New User Registrations (for Courses)</label>
          </div>
          
          <button 
            type="submit" 
            disabled={savingAuth}
            className="mt-2 w-fit rounded-lg bg-leaf-500 px-4 py-2 font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
          >
            {savingAuth ? "Saving..." : "Save Auth Settings"}
          </button>
          {authMessage && <p className="text-sm font-semibold text-forest-700">{authMessage}</p>}
        </form>
      </div>

      {/* Contact Settings */}
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-700">Contact Settings</h1>
        <p className="mb-4 text-sm text-ink-500">Configure global contact details shown on the website footer and contact pages.</p>
        
        <form onSubmit={handleSaveContact} className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-ink-700">Email Address</label>
            <input 
              type="email" required
              value={contactSettings.email} 
              onChange={e => setContactSettings({...contactSettings, email: e.target.value})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700">Phone Number</label>
            <input 
              type="text" required
              value={contactSettings.phone} 
              onChange={e => setContactSettings({...contactSettings, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700">Address / Location</label>
            <input 
              type="text" required
              value={contactSettings.address} 
              onChange={e => setContactSettings({...contactSettings, address: e.target.value})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <button 
            type="submit" 
            disabled={savingContact}
            className="mt-2 w-fit rounded-lg bg-leaf-500 px-4 py-2 font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
          >
            {savingContact ? "Saving..." : "Save Contact Info"}
          </button>
          {contactMessage && <p className="text-sm font-semibold text-forest-700">{contactMessage}</p>}
        </form>
      </div>

      {/* Stats Settings */}
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-700">Statistics Settings</h1>
        <p className="mb-4 text-sm text-ink-500">Configure the statistics shown on the home and about pages.</p>
        
        <form onSubmit={handleSaveStats} className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-ink-700">Live Programmes Launched</label>
            <input 
              type="number" required
              value={statsSettings.programmes} 
              onChange={e => setStatsSettings({...statsSettings, programmes: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700">Days of Practical Training</label>
            <input 
              type="number" required
              value={statsSettings.days} 
              onChange={e => setStatsSettings({...statsSettings, days: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700">Online & Interactive</label>
            <input 
              type="number" required
              value={statsSettings.interactive} 
              onChange={e => setStatsSettings({...statsSettings, interactive: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink-700">Expert Resource Persons</label>
            <input 
              type="number" required
              value={statsSettings.experts} 
              onChange={e => setStatsSettings({...statsSettings, experts: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            />
          </div>
          <button 
            type="submit" 
            disabled={savingStats}
            className="mt-2 w-fit rounded-lg bg-leaf-500 px-4 py-2 font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
          >
            {savingStats ? "Saving..." : "Save Statistics"}
          </button>
          {statsMessage && <p className="text-sm font-semibold text-forest-700">{statsMessage}</p>}
        </form>
      </div>

      {/* Payment Settings */}
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-700">Payment Settings</h1>
        <p className="mb-4 text-sm text-ink-500">Configure how students pay for courses.</p>
        
        <form onSubmit={handleSavePayment} className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-ink-700">Payment Mode</label>
            <select 
              value={paymentSettings.mode} 
              onChange={e => setPaymentSettings({...paymentSettings, mode: e.target.value})}
              className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
            >
              <option value="razorpay">Razorpay Gateway (Automatic)</option>
              <option value="manual">Manual Bank Transfer / UPI (Verification required)</option>
            </select>
          </div>

          {paymentSettings.mode === "manual" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-ink-700">UPI ID</label>
                <input 
                  type="text" 
                  value={paymentSettings.upiId} 
                  onChange={e => setPaymentSettings({...paymentSettings, upiId: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2"
                  placeholder="e.g. lifeterrain@okhdfcbank"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700">Bank Details</label>
                <textarea 
                  value={paymentSettings.bankDetails} 
                  onChange={e => setPaymentSettings({...paymentSettings, bankDetails: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2 h-24"
                  placeholder="Account Name: ...&#10;Account No: ...&#10;IFSC: ..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700">QR Code Image</label>
                {paymentSettings.qrCodeUrl && (
                  <img src={paymentSettings.qrCodeUrl} alt="QR Code" className="my-2 h-32 w-32 rounded-lg border border-ink-500/20 object-cover" />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2000000) {
                      alert("Image too large. Max 2MB.");
                      return;
                    }
                    
                    try {
                      setSavingPayment(true);
                      
                      const mode = process.env.NEXT_PUBLIC_STORAGE_MODE || 'local';
                      let downloadUrl = "";

                      if (mode === 'cloud') {
                        const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
                        const { storage } = await import("@/lib/firebase");
                        const storageRef = ref(storage, `settings/qr_${Date.now()}_${file.name}`);
                        await uploadBytes(storageRef, file);
                        downloadUrl = await getDownloadURL(storageRef);
                      } else {
                        // Physical/Local Storage
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        });
                        const data = await res.json();
                        if (!data.success) throw new Error(data.error);
                        downloadUrl = data.url;
                      }

                      setPaymentSettings({...paymentSettings, qrCodeUrl: downloadUrl});
                    } catch (error: any) {
                      alert("Failed to upload image: " + error.message);
                    } finally {
                      setSavingPayment(false);
                    }
                  }}
                  className="mt-1 block w-full rounded-md border border-ink-500/20 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-ink-500">Max size: 2MB. The image will be securely uploaded to {process.env.NEXT_PUBLIC_STORAGE_MODE === 'cloud' ? 'Firebase Storage' : 'local server'}.</p>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={savingPayment}
            className="mt-4 w-fit rounded-lg bg-leaf-500 px-4 py-2 font-semibold text-white hover:bg-leaf-600 disabled:opacity-50"
          >
            {savingPayment ? "Saving..." : "Save Payment Settings"}
          </button>
          {paymentMessage && <p className="text-sm font-semibold text-forest-700">{paymentMessage}</p>}
        </form>
      </div>
    </div>
  );
}
