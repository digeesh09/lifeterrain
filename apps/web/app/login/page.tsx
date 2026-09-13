"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, FormField, Input } from "@lifeterrain/ui";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signin") await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Card className="w-full p-8">
        <h1 className="text-center font-display text-2xl font-extrabold text-forest-700">
          {mode === "signin" ? "Welcome Back" : "Create Your Account"}
        </h1>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <FormField label="Email" required>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Password" required>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
          <Button type="submit" loading={loading}>{mode === "signin" ? "Login" : "Sign Up"}</Button>
        </form>
        <Button variant="outline" className="mt-3 w-full" onClick={handleGoogle}>Continue with Google</Button>
        <p className="mt-4 text-center text-sm text-ink-500">
          {mode === "signin" ? "New here?" : "Already registered?"}{" "}
          <button className="font-semibold text-forest-700" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create an account" : "Login instead"}
          </button>
        </p>
      </Card>
    </div>
  );
}
