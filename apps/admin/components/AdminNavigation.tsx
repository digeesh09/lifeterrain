"use client";

import { useState } from "react";
import { AdminLogout } from "./AdminLogout";

export function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-forest-900 text-white rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-60 shrink-0 transform flex-col bg-forest-900 p-5 text-cream transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}`}>
        <div className="mb-8 flex items-center justify-between font-display text-lg font-extrabold">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="LifeTerrain" className="h-10 w-auto object-contain" />
            <span>LifeTerrain <span className="text-leaf-400">Admin</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 text-sm font-semibold overflow-y-auto">
          <a href="/" className="rounded-lg px-3 py-2 hover:bg-white/10">Overview</a>
          <a href="/courses" className="rounded-lg px-3 py-2 hover:bg-white/10">Courses</a>
          <a href="/users" className="rounded-lg px-3 py-2 hover:bg-white/10">Users</a>
          <a href="/enrollments" className="rounded-lg px-3 py-2 hover:bg-white/10">Enrollments</a>
          {process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true" && (
            <a href="/notifications" className="rounded-lg px-3 py-2 hover:bg-white/10">Notifications</a>
          )}
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
    </>
  );
}
