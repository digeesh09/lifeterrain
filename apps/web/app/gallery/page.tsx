import { Lightbox, CTABanner, Reveal } from "@lifeterrain/ui";
import { GALLERY_PHOTOS, GALLERY_CATEGORIES } from "@/lib/gallery";

export const metadata = { title: "Gallery — LifeTerrain Research & Training" };

export default function GalleryPage() {
  return (
    <>
      <div className="bg-forest-700 py-16 text-center text-white">
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">Gallery</h1>
        <p className="mx-auto mt-3 max-w-2xl text-cream/80">
          Moments from our workshops, master classes and fieldwork — click any photo to view it larger.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <Reveal>
          <Lightbox images={GALLERY_PHOTOS} categories={GALLERY_CATEGORIES} />
        </Reveal>
      </div>

      <Reveal>
        <CTABanner />
      </Reveal>
    </>
  );
}
