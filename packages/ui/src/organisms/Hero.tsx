"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative h-[85vh] min-h-[560px] overflow-hidden bg-forest-900">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=70"
          alt="Sunlight through a forest canopy"
          fill
          priority
          className="object-cover opacity-40"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/80 to-forest-700/40" />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto flex h-full max-w-6xl flex-col items-start justify-center gap-6 px-4 md:px-6"
      >
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge tone="leaf">Climate Knowledge for a Better Tomorrow</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-5xl"
        >
          Turning Scientific Research into Real-World Environmental Impact
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-lg text-cream/85"
        >
          LifeTerrain Research &amp; Training runs practical courses, workshops and expert-led
          sessions in environment, biodiversity, and sustainability — measure, reduce, verify, monetise.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Button size="lg" variant="secondary" onClick={() => (window.location.href = "/courses")}>
            Explore Courses
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => (window.location.href = "/about")}>
            About Us
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 h-9 w-5 -translate-x-1/2 rounded-full border-2 border-white/50"
      >
        <span className="mx-auto mt-1.5 block h-1.5 w-1 rounded-full bg-white/70" />
      </motion.div>
    </section>
  );
}
