"use client";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "../atoms/Button";

export interface NavLink {
  href: string;
  label: string;
}

export function Navbar({
  links,
  isAuthed,
  onLogout,
  brandHref = "/",
}: {
  links: NavLink[];
  isAuthed?: boolean;
  onLogout?: () => void;
  brandHref?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-forest-700/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href={brandHref} className="flex items-center gap-2 font-display font-extrabold text-forest-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="LifeTerrain Logo" className="h-10 w-auto object-contain" />
          <span className="leading-tight">
            LifeTerrain
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-leaf-500">
              Research &amp; Training
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-semibold text-ink-700 hover:text-forest-700"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-leaf-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          {isAuthed ? (
            <>
              <a href="/dashboard" className="text-sm font-semibold text-ink-700 hover:text-forest-700">
                My Dashboard
              </a>
              <Button size="sm" variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => (window.location.href = "/login")}>
              Login / Register
            </Button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-3 border-t border-forest-700/10 bg-cream px-4 py-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-ink-700">
              {l.label}
            </a>
          ))}
          <Button size="sm" onClick={() => (window.location.href = isAuthed ? "/dashboard" : "/login")}>
            {isAuthed ? "My Dashboard" : "Login / Register"}
          </Button>
        </div>
      )}
    </header>
  );
}
