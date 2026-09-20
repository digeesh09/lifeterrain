import { collection, getDocs, query, orderBy, limit as fbLimit, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Firestore-backed site content — gallery photos, testimonials, team/
 * resource-person bios, and FAQs. All four are managed from the admin
 * panel (Gallery / Testimonials / Team / FAQs pages) so non-technical
 * staff can update the public site without a code change.
 *
 * Each fetcher falls back to a small seed list if the collection is still
 * empty (e.g. right after first deploy, before an admin has added real
 * content), so the site never renders a blank section.
 */

export interface GalleryPhoto {
  id?: string;
  url: string;
  alt: string;
  category: string;
  description?: string;
  addedAt?: string; // ISO date string
}

export interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  published?: boolean;
  order?: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  order?: number;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

const FALLBACK_GALLERY: GalleryPhoto[] = [
  { url: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=800&q=70", alt: "Live online workshop session", category: "Workshops", addedAt: "2026-09-10" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=70", alt: "Participants in an interactive class", category: "Workshops", addedAt: "2026-09-08" },
  { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=70", alt: "Conference-style discussion", category: "Workshops", addedAt: "2026-08-30" },
  { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=70", alt: "Team planning a session", category: "Team", addedAt: "2026-08-25" },
  { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=70", alt: "Group discussion at an event", category: "Team", addedAt: "2026-08-20" },
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=70", alt: "Forest canopy — fieldwork terrain", category: "Fieldwork", addedAt: "2026-08-12" },
  { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=70", alt: "Tall trees in a green forest", category: "Fieldwork", addedAt: "2026-08-05" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=70", alt: "Mountain forest landscape", category: "Fieldwork", addedAt: "2026-07-28" },
  { url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=70", alt: "Solar panel installation", category: "Sustainability", addedAt: "2026-07-20" },
  { url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=70", alt: "Wind turbines on a green field", category: "Sustainability", addedAt: "2026-07-15" },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { quote: "The GHG accounting sessions were extremely practical — I could apply the ISO 14064-2 framework to my own project the same week.", name: "Environmental Consultant", role: "EIA Workshop Participant" },
  { quote: "Clear, structured, and taught by people who actually work in this space. The carbon markets module demystified Article 6 for me.", name: "Research Scholar", role: "Carbon Credit Mechanisms Batch" },
  { quote: "Best online format I've attended — live, interactive, and the resource persons stayed back to answer every question.", name: "Sustainability Officer", role: "Master Class Alumnus" },
];

const FALLBACK_TEAM: TeamMember[] = [
  {
    name: "Dr. Anoop V.",
    role: "Environmental Researcher, Trainer & Founder",
    bio: "Founder of LifeTerrain Research and Training, leading course design and delivery across GHG accounting, carbon markets and environmental impact assessment.",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=70",
  },
  {
    name: "Somnath Banerjee",
    role: "Environmental Policy Expert, Researcher & Consultant",
    bio: "Brings policy and regulatory depth to our carbon markets and sustainability programmes, consulting across compliance and voluntary carbon schemes.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=70",
  },
];

const FALLBACK_FAQS: FAQItem[] = [
  { question: "Are these courses live or pre-recorded?", answer: "All sessions are 100% online, live and interactive — you can ask questions in real time. Recordings are usually shared with enrolled participants afterward." },
  { question: "Will I get a certificate?", answer: "Yes, every course includes an E-Certificate of Participation on successful completion." },
  { question: "How do I pay the course fee?", answer: "Registration and payment happen together on our site via Razorpay — cards, UPI, netbanking and wallets are all supported." },
  { question: "I registered but haven't received a confirmation — what do I do?", answer: "Check your dashboard after logging in; if payment succeeded but you don't see a confirmation email/WhatsApp within a few minutes, contact us at anoopecothoughts@gmail.com or +91 87147 29406." },
];

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const snap = await getDocs(query(collection(db, "galleryPhotos"), orderBy("addedAt", "desc")));
    if (snap.empty) return FALLBACK_GALLERY;
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return FALLBACK_GALLERY;
  }
}

export async function getLatestGalleryPhotos(count: number): Promise<GalleryPhoto[]> {
  const all = await getGalleryPhotos();
  return all.slice(0, count);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const snap = await getDocs(query(collection(db, "testimonials"), where("published", "==", true), orderBy("order", "asc")));
    if (snap.empty) return FALLBACK_TESTIMONIALS;
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return FALLBACK_TESTIMONIALS;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const snap = await getDocs(query(collection(db, "teamMembers"), orderBy("order", "asc")));
    if (snap.empty) return FALLBACK_TEAM;
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return FALLBACK_TEAM;
  }
}

export async function getFAQs(): Promise<FAQItem[]> {
  try {
    const snap = await getDocs(query(collection(db, "faqs"), orderBy("order", "asc")));
    if (snap.empty) return FALLBACK_FAQS;
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    return FALLBACK_FAQS;
  }
}

import { doc, getDoc } from "firebase/firestore";

export async function getStats() {
  try {
    const snap = await getDoc(doc(db, "settings", "stats"));
    if (snap.exists()) {
      const data = snap.data();
      return [
        { value: data.programmes || 3, label: "Live Programmes Launched" },
        { value: data.days || 10, label: "Days of Practical Training" },
        { value: data.interactive || 100, suffix: "%", label: "Online & Interactive" },
        { value: data.experts || 2, label: "Expert Resource Persons" },
      ];
    }
  } catch {}
  return [
    { value: 3, label: "Live Programmes Launched" },
    { value: 10, label: "Days of Practical Training" },
    { value: 100, suffix: "%", label: "Online & Interactive" },
    { value: 2, label: "Expert Resource Persons" },
  ];
}
