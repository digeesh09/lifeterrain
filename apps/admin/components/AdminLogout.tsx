"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function AdminLogout() {
  function handleLogout() {
    signOut(auth);
    window.location.href = "/login";
  }

  return (
    <button 
      onClick={handleLogout}
      className="mt-8 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 hover:bg-white/10"
    >
      Logout
    </button>
  );
}
