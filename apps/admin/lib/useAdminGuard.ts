"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

/**
 * Gates every /admin/* page. Admin status comes from a Firebase custom
 * claim (`admin: true`) set via the `grantAdminRole` Cloud Function —
 * never trust a Firestore field alone for this, since Firestore rules
 * are the real enforcement layer server-side.
 */
export function useAdminGuard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) return router.push("/login");
      const token = await u.getIdTokenResult();
      if (!token.claims.admin) {
        router.push("/login?error=not-admin");
        return;
      }
      setIsAdmin(true);
    });
  }, [router]);

  return { user, isAdmin, loading: user === undefined };
}
