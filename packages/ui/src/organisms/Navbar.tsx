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
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-white">
            <Leaf className="h-5 w-5" />
          </span>
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
            <a href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-3 py-1.5 text-sm font-display font-semibold text-white transition-colors hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500">
              Login / Register
            </a>
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
          <a href={isAuthed ? "/dashboard" : "/login"} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-3 py-1.5 text-sm font-display font-semibold text-white transition-colors hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500">
            {isAuthed ? "My Dashboard" : "Login / Register"}
          </a>
        </div>
      )}
    </header>
  );
}
