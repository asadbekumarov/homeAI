"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Category = "Barchasi" | "Tashqi ko'rinish" | "Qulayliklar" | "Ichki xonalar";

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, "Barchasi">;
  span?: string; // grid span classes
}

const images: GalleryImage[] = [
  { src: "/gallery/exterior-1.jpg", alt: "Bino tashqi ko'rinishi — kunduzgi", category: "Tashqi ko'rinish", span: "md:col-span-2 md:row-span-2" },
  { src: "/gallery/interior-1.jpg", alt: "Zamonaviy yashash xonasi", category: "Ichki xonalar" },
  { src: "/gallery/amenity-1.jpg", alt: "Tomdagi terassa", category: "Qulayliklar" },
  { src: "/gallery/exterior-2.jpg", alt: "Bino tashqi ko'rinishi — kechqurun", category: "Tashqi ko'rinish" },
  { src: "/gallery/interior-2.jpg", alt: "Oshxona dizayni", category: "Ichki xonalar" },
  { src: "/gallery/amenity-2.jpg", alt: "Lobbi maydoni", category: "Qulayliklar", span: "md:col-span-2" },
  { src: "/gallery/interior-3.jpg", alt: "Master yotoq xonasi", category: "Ichki xonalar" },
  { src: "/gallery/exterior-3.jpg", alt: "Bog' va hovli", category: "Tashqi ko'rinish" },
];

const categories: Category[] = ["Barchasi", "Tashqi ko'rinish", "Qulayliklar", "Ichki xonalar"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("Barchasi");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filtered = activeCategory === "Barchasi"
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <section id="gallery" className="py-24 lg:py-36 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-16 bg-accent" />
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
              Galereya
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-12">
            Nafis <span className="text-accent">detallar</span>
          </h2>
        </ScrollReveal>

        {/* Category filter */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wide rounded-full border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-accent text-white border-accent"
                    : "bg-transparent text-foreground-muted border-divider hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group ${
                  img.span || ""
                }`}
                onClick={() => setLightboxImage(img)}
              >
                {/* Placeholder bg while image loads */}
                <div className="absolute inset-0 bg-background-dark" />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm">{img.alt}</p>
                  <p className="text-white/60 text-xs mt-1">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>


      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lightbox-overlay"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
              onClick={() => setLightboxImage(null)}
              aria-label="Yopish"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
