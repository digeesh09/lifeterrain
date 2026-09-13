"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button, Card, FormField, Input } from "@lifeterrain/ui";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(params.get("error") === "not-admin" ? "This account has no admin access." : "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <Card className="p-8">
        <h1 className="text-center font-display text-xl font-extrabold text-forest-700">Admin Login</h1>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <FormField label="Email" required><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></FormField>
          <FormField label="Password" required><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></FormField>
          <Button type="submit" loading={loading}>Login</Button>
        </form>
      </Card>
    </div>
  );
}
