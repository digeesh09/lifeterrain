import { Lightbox, CTABanner, Reveal } from "@lifeterrain/ui";
import { getGalleryPhotos } from "@/lib/content";

export const metadata = { title: "Gallery — LifeTerrain Research & Training" };
export const revalidate = 10;

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();
  const categories = Array.from(new Set(photos.map((p) => p.category)));

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
          <Lightbox images={photos} categories={categories} />
        </Reveal>
      </div>

      <Reveal>
        <CTABanner />
      </Reveal>
    </>
  );
}
