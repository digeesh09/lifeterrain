"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage { url: string; alt: string; category: string; description?: string; type?: "image" | "video"; }

/** A filterable photo grid with a click-to-expand lightbox (arrow-key + click navigation). */
export function Lightbox({ images, categories }: { images: GalleryImage[]; categories: string[] }) {
  const [filter, setFilter] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = filter === "All" ? images : images.filter((i) => i.category === filter);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, filtered.length]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => { setFilter(c); setOpenIndex(null); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === c ? "bg-forest-700 text-white" : "bg-sage-50 text-ink-700 hover:bg-leaf-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {filtered.map((img, i) => (
          <button
            key={img.url + i}
            onClick={() => setOpenIndex(i)}
            className="group relative block w-full overflow-hidden rounded-xl2 shadow-card"
          >
            {img.type === "video" ? (
              <video src={img.url} className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105" muted playsInline />
            ) : (
              <Image
                src={img.url}
                alt={img.alt}
                width={600}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-900/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-semibold text-white">{img.alt}</span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && filtered[openIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/90 p-4"
            onClick={() => setOpenIndex(null)}
          >
            <button className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={() => setOpenIndex(null)} aria-label="Close">
              <X className="h-7 w-7" />
            </button>
            <button
              className="absolute left-4 text-white/70 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)); }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[80vh] w-full max-w-3xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered[openIndex].type === "video" ? (
                <video src={filtered[openIndex].url} controls autoPlay className="h-auto max-h-[65vh] w-full rounded-xl2 object-contain" />
              ) : (
                <Image
                  src={filtered[openIndex].url}
                  alt={filtered[openIndex].alt}
                  width={1200}
                  height={800}
                  className="h-auto max-h-[65vh] w-full rounded-xl2 object-contain"
                />
              )}
              <p className="mt-3 text-center text-lg font-semibold text-white">{filtered[openIndex].alt}</p>
              {filtered[openIndex].description && (
                <div 
                  className="mt-2 text-center text-sm text-white/80 prose prose-invert mx-auto prose-p:my-1 prose-a:text-leaf-400 max-h-[15vh] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: filtered[openIndex].description! }}
                />
              )}
            </motion.div>
            <button
              className="absolute right-4 text-white/70 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i === null ? null : (i + 1) % filtered.length)); }}
              aria-label="Next"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
