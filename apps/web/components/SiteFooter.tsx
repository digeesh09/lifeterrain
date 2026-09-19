"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Footer, ContactInfo } from "@lifeterrain/ui";

export function SiteFooter() {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    getDoc(doc(db, "settings", "contact")).then((snap) => {
      if (snap.exists()) {
        setContact(snap.data() as ContactInfo);
      } else {
        setContact({ email: "anoopecothoughts@gmail.com", phone: "+91 87147 29406", address: "India" });
      }
    });
  }, []);

  return <Footer contact={contact} />;
}
