"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function subscribeToNewsletter(email: string) {
  await addDoc(collection(db, "newsletterSubscribers"), {
    email,
    createdAt: serverTimestamp(),
  });
}
