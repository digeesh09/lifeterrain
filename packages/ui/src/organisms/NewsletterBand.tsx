"use client";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { Mail } from "lucide-react";

export function NewsletterBand({ onSubscribe }: { onSubscribe?: (email: string) => Promise<void> | void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (/<.*>/.test(email)) {
      setError("Invalid email format (HTML tags are not allowed).");
      return;
    }

    setLoading(true);
    try {
      await onSubscribe?.(email);
      setDone(true);
      setEmail("");
    } catch (err: any) {
      if (err.message?.includes("permission-denied") || err.code === "permission-denied") {
        setError("Rejected by security policies.");
      } else {
        setError("Failed to subscribe.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-sage-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-14 text-center md:px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
          <Mail className="h-5 w-5" />
        </span>
        <h2 className="font-display text-2xl font-extrabold text-forest-700">Stay Updated on New Courses</h2>
        <p className="max-w-md text-ink-500">
          Get notified when new workshops, seminars and master classes open for registration.
        </p>
        {done ? (
          <p className="font-semibold text-leaf-700">Thanks — you're subscribed!</p>
        ) : (
          <div className="flex w-full max-w-md flex-col items-center gap-2">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-forest-700/20 bg-white px-5 py-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
              <Button type="submit" loading={loading} className="shrink-0">Subscribe</Button>
            </form>
            {error && <p className="text-sm text-red-600 font-medium mt-1">{error}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
