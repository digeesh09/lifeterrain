import Image from "next/image";

export function GalleryBand({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img, i) => (
          <div key={i} className={`relative overflow-hidden rounded-xl2 shadow-card ${i === 0 ? "col-span-2 row-span-2 h-full min-h-[16rem]" : "h-40 md:h-48"}`}>
            <Image src={img.url} alt={img.alt} fill className="object-cover transition-transform hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
