"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, FormField, Input } from "@lifeterrain/ui";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Extra fields for signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authConfig, setAuthConfig] = useState<any>({ allowGoogleSignIn: true, allowRegistration: true });

  useEffect(() => {
    import("firebase/firestore").then(({ getDoc, doc }) => {
      getDoc(doc(db, "settings", "auth")).then((snap) => {
        if (snap.exists()) setAuthConfig(snap.data());
      });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      if (!authConfig.allowRegistration) {
        setError("New user registrations are currently disabled.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        // Save additional user info to firestore
        await setDoc(doc(db, "users", cred.user.uid), {
          name,
          email,
          phone,
          institution,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      // On first sign in, we should save them to users collection if they don't exist
      // Since setDoc with merge: true won't overwrite existing createdAt, it's safe to do this
      await setDoc(doc(db, "users", cred.user.uid), {
        name: cred.user.displayName,
        email: cred.user.email,
        lastLogin: serverTimestamp(),
      }, { merge: true });
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
          {mode === "signup" && (
            <>
              <FormField label="Full Name" required>
                <Input required value={name} onChange={(e) => setName(e.target.value)} />
              </FormField>
              <FormField label="Phone Number" required>
                <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormField>
              <FormField label="Institution / Organization" required>
                <Input required value={institution} onChange={(e) => setInstitution(e.target.value)} />
              </FormField>
            </>
          )}
          <FormField label="Email" required>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Password" required>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
          {mode === "signup" && (
            <FormField label="Confirm Password" required>
              <Input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormField>
          )}
          <Button type="submit" loading={loading}>{mode === "signin" ? "Login" : "Create Account"}</Button>
        </form>
        
        {authConfig.allowGoogleSignIn && (
          <>
            <div className="my-4 flex items-center gap-3">
              <hr className="flex-1 border-forest-700/10" />
              <span className="text-xs uppercase tracking-widest text-ink-500">Or</span>
              <hr className="flex-1 border-forest-700/10" />
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogle}>Continue with Google</Button>
          </>
        )}

        {authConfig.allowRegistration && (
          <p className="mt-4 text-center text-sm text-ink-500">
            {mode === "signin" ? "New here?" : "Already registered?"}{" "}
            <button className="font-semibold text-forest-700" onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}>
              {mode === "signin" ? "Create an account" : "Login instead"}
            </button>
          </p>
        )}
      </Card>
    </div>
  );
}
