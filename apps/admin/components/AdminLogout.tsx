"use client";

import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function AdminLogout() {
  function handleLogout() {
    signOut(auth);
    window.location.href = "/login";
  }

  async function handleResetPassword() {
    if (!auth.currentUser?.email) {
      alert("No email found for current user.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      alert(`Password reset link sent to ${auth.currentUser.email}. Please check your inbox.`);
    } catch (e: any) {
      alert("Error sending password reset email: " + e.message);
    }
  }

  return (
    <>
      <button 
        onClick={handleResetPassword}
        className="mt-8 rounded-lg px-3 py-2 text-left text-sm font-semibold text-leaf-400 hover:bg-white/10"
      >
        Change Password
      </button>
      <button 
        onClick={handleLogout}
        className="mt-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-400 hover:bg-white/10"
      >
        Logout
      </button>
    </>
  );
}
