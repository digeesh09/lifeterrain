"use client";

import { useEffect, useState } from "react";
import { Navbar, NavLink } from "@lifeterrain/ui";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function SiteNavbar({ links }: { links: NavLink[] }) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
    });
    return unsubscribe;
  }, []);

  function handleLogout() {
    signOut(auth);
    window.location.href = "/";
  }

  return (
    <Navbar 
      links={links} 
      isAuthed={isAuthed} 
      onLogout={handleLogout} 
    />
  );
}
