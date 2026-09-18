import "./globals.css";
import type { Metadata } from "next";
import { AdminLogout } from "@/components/AdminLogout";

export const metadata: Metadata = { title: "LifeTerrain Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body text-ink-900 antialiased">
        <div className="flex min-h-screen">
          <aside className="hidden w-60 flex-col bg-forest-900 p-5 text-cream md:flex">
            <div className="mb-8 flex items-center gap-3 font-display text-lg font-extrabold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="LifeTerrain" className="h-10 w-auto object-contain" />
              <span>LifeTerrain <span className="text-leaf-400">Admin</span></span>
            </div>
            <nav className="flex flex-col gap-1 text-sm font-semibold">
              <a href="/" className="rounded-lg px-3 py-2 hover:bg-white/10">Overview</a>
              <a href="/courses" className="rounded-lg px-3 py-2 hover:bg-white/10">Courses</a>
              <a href="/users" className="rounded-lg px-3 py-2 hover:bg-white/10">Users</a>
              <a href="/enrollments" className="rounded-lg px-3 py-2 hover:bg-white/10">Enrollments</a>
              <a href="/notifications" className="rounded-lg px-3 py-2 hover:bg-white/10">Notifications</a>
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wide text-cream/40">Site Content</p>
              <a href="/gallery" className="rounded-lg px-3 py-2 hover:bg-white/10">Gallery</a>
              <a href="/testimonials" className="rounded-lg px-3 py-2 hover:bg-white/10">Testimonials</a>
              <a href="/team" className="rounded-lg px-3 py-2 hover:bg-white/10">Team</a>
              <a href="/faqs" className="rounded-lg px-3 py-2 hover:bg-white/10">FAQs</a>
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wide text-cream/40">Leads</p>
              <a href="/subscribers" className="rounded-lg px-3 py-2 hover:bg-white/10">Subscribers</a>
              <a href="/enquiries" className="rounded-lg px-3 py-2 hover:bg-white/10">Enquiries</a>
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wide text-cream/40">Configuration</p>
              <a href="/settings" className="rounded-lg px-3 py-2 hover:bg-white/10">Payment Settings</a>
              <AdminLogout />
            </nav>
          </aside>
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
