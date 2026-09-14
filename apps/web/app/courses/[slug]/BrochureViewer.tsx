"use client";

import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function BrochureViewer({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="group relative cursor-zoom-in" 
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-forest-900/0 transition-colors group-hover:bg-forest-900/10 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 text-forest-900 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0">
            <Maximize2 className="w-4 h-4" /> Expand
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/95 p-4 md:p-8"
            onClick={() => setIsOpen(false)}
          >
            <button 
              className="absolute right-6 top-6 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="relative max-h-full max-w-5xl w-full flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[90vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
