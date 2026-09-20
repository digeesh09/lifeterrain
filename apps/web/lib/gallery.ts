export interface GalleryPhoto {
  url: string;
  alt: string;
  category: string;
  addedAt: string; // ISO date — used to sort "latest" on the homepage
}

// Single source of truth for gallery imagery — both the homepage teaser
// and the full /gallery page read from this list, so they never drift
// out of sync. Swap these placeholder Unsplash entries for real photos
// (from Firebase Storage or wherever they're hosted) as they come in —
// just keep `addedAt` current so the homepage always shows the newest ones.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
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
  { url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=70", alt: "Forest path", category: "Fieldwork", addedAt: "2026-07-10" },
  { url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=70", alt: "Sunbeams through green forest", category: "Fieldwork", addedAt: "2026-07-01" },
];

export const GALLERY_CATEGORIES = ["Workshops", "Team", "Fieldwork", "Sustainability"];

export function getLatestGalleryPhotos(count: number): GalleryPhoto[] {
  return [...GALLERY_PHOTOS].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, count);
}
