import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "LifeTerrain Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body text-ink-900 antialiased">
        <div className="flex min-h-screen">
          <aside className="hidden w-60 flex-col bg-forest-900 p-5 text-cream md:flex">
            <div className="mb-8 font-display text-lg font-extrabold">LifeTerrain <span className="text-leaf-400">Admin</span></div>
            <nav className="flex flex-col gap-1 text-sm font-semibold">
              <a href="/" className="rounded-lg px-3 py-2 hover:bg-white/10">Overview</a>
              <a href="/courses" className="rounded-lg px-3 py-2 hover:bg-white/10">Courses</a>
              <a href="/enrollments" className="rounded-lg px-3 py-2 hover:bg-white/10">Enrollments</a>
              <a href="/notifications" className="rounded-lg px-3 py-2 hover:bg-white/10">Notifications</a>
            </nav>
          </aside>
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
