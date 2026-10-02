"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

type Category =
  | "Barchasi"
  | "Tashqi ko'rinish"
  | "Ichki xonalar"
  | "Qulayliklar";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: Exclude<Category, "Barchasi">;
  year: string;
  subtitle: string;
  details: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: "ext-1",
    src: "/gallery/exterior-1.jpg",
    alt: "Monolit fasad va shahar panoramasi",
    title: "Monolit fasad",
    category: "Tashqi ko'rinish",
    year: "2026",
    subtitle: "Kundalik shahar manzarasi",
    details: "Shveytsariya texnologiyasi asosidagi energiya tejamkor vitraj oynaband fasad va bronza profillar.",
  },
  {
    id: "int-1",
    src: "/gallery/interior-1.jpg",
    alt: "Grand Penthouse mehmonxonasi",
    title: "Grand Penthouse",
    category: "Ichki xonalar",
    year: "2026",
    subtitle: "Panoramik shiftlar va marmar",
    details: "3.4 metr balandlikdagi shiftlar, tabiiy italyan marmari va sokin akustik muhit.",
  },
  {
    id: "amen-1",
    src: "/gallery/amenity-1.jpg",
    alt: "Tomdagi ochiq terassa va Sky Lounge",
    title: "Sky Lounge",
    category: "Qulayliklar",
    year: "2026",
    subtitle: "360° shahar ufqini kuzatish",
    details: "Poytaxtning kechki chiroqlarini ochiq osmon ostida tomosha qilish uchun shaxsiy klub terassasi.",
  },
  {
    id: "ext-2",
    src: "/gallery/exterior-2.jpg",
    alt: "Bino tashqi ko'rinishi — tungi arxitektura",
    title: "Tungi fasad",
    category: "Tashqi ko'rinish",
    year: "2026",
    subtitle: "Maxsus arxitektura chiroqlari",
    details: "Poytaxt ufqida minoralar siluetini nozik ta'kidlab turuvchi individual chiroqlar kompozitsiyasi.",
  },
  {
    id: "int-2",
    src: "/gallery/interior-2.jpg",
    alt: "Minimalist dizaynerlik oshxonasi",
    title: "Dizaynerlik oshxonasi",
    category: "Ichki xonalar",
    year: "2026",
    subtitle: "Ergonomik tosh orolcha",
    details: "Miele maishiy texnikasi, yashirin yoritish liniyalari va ekologik toza tabiiy tosh qoplamalari.",
  },
  {
    id: "amen-2",
    src: "/gallery/amenity-2.jpg",
    alt: "5 yulduzli tizimdagi Grand Lobbi",
    title: "Grand Lobbi",
    category: "Qulayliklar",
    year: "2026",
    subtitle: "Konsyerj va kutish maydoni",
    details: "24/7 konsyerj xizmati, biznes kutish hududi, qahva bari va sokin kutubxona maskani.",
  },
  {
    id: "int-3",
    src: "/gallery/interior-3.jpg",
    alt: "Master Bedroom va shaxsiy garderob",
    title: "Master Suite",
    category: "Ichki xonalar",
    year: "2026",
    subtitle: "Panoramik vitraj oynalar",
    details: "Shahar panoramasi ochiluvchi vitraj oynalar, tovush izolyatsiyasi va keng garderob xonasi.",
  },
  {
    id: "ext-3",
    src: "/gallery/exterior-3.jpg",
    alt: "Yashil hovli va landshaft bog'i",
    title: "Landshaft bog'i",
    category: "Tashqi ko'rinish",
    year: "2026",
    subtitle: "Avtomobillarsiz sokin hovli",
    details: "1.5 gektarli sokin xususiy dam olish hududi: yashil xiyobonlar, favvoralar va soyali ayvonlar.",
  },
];

const categories: Category[] = [
  "Barchasi",
  "Tashqi ko'rinish",
  "Ichki xonalar",
  "Qulayliklar",
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("Barchasi");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Barchasi"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const lightboxImage =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filtered.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : 0
    );
  }, [lightboxIndex, filtered.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filtered.length === 0) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : 0
    );
  }, [lightboxIndex, filtered.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, handlePrev, handleNext]);

  const changeCategory = (category: Category) => {
    setActiveCategory(category);
    setLightboxIndex(null);
  };

  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-12 lg:py-36 xl:px-16 bg-[#0C0B0A]"
    >
      <div className="mx-auto max-w-7xl">
        {/* ── 1. SECTION HEADER (Minimal Swiss Editorial) ── */}
        <div className="mb-14 lg:mb-20">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                01 — Architecture &amp; Details
              </span>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <ScrollReveal delay={0.05} className="lg:col-span-8">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F6F4F0] font-light tracking-tight leading-[1.05]">
                Nafis me&apos;moriy<br />
                <span className="italic font-normal text-accent">detallar</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1} className="lg:col-span-4 pb-2">
              <p className="text-sm text-[#A39E96] leading-relaxed font-light">
                Har bir chiziq va proporsiya puxta o&apos;ylangan. Fasadlar, interyerlar
                va eksklyuziv hududlarning fotosuratlar orqali aks etgan me&apos;moriy uyg&apos;unligi.
              </p>
            </ScrollReveal>
          </div>

          {/* ── CATEGORY NAVIGATION (Editorial Tab Line) ── */}
          <ScrollReveal delay={0.15}>
            <div className="mt-12 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-6">
              <nav
                aria-label="Galereya kategoriyalari"
                className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-hide py-1"
              >
                {categories.map((category) => {
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => changeCategory(category)}
                      className="group relative pb-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <span
                        className={`transition-colors duration-300 ${
                          isActive
                            ? "text-[#F6F4F0] font-medium"
                            : "text-[#666159] group-hover:text-[#A39E96]"
                        }`}
                      >
                        {category}
                      </span>

                      {/* Active minimal line indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="editorial-gallery-indicator"
                          className="absolute inset-x-0 bottom-0 h-[1.5px] bg-accent"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#666159] uppercase tracking-widest shrink-0">
                <span className="text-[#A39E96]">
                  {String(filtered.length).padStart(2, "0")}
                </span>
                <span>/</span>
                <span>{String(galleryImages.length).padStart(2, "0")} views</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── 2. UNIFORM EDITORIAL GALLERY GRID (EQUAL SIZES) ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-14"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((image, index) => {
              return (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  className="group"
                >
                  {/* Clean Photography Frame (Uniform Size across all cards) */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxIndex(index);
                      }
                    }}
                    aria-label={`${image.title} — ${image.subtitle}. Kattalashtirish`}
                    className="cursor-pointer block focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <div
                      className="relative w-full aspect-[16/11] overflow-hidden bg-[#141312] rounded-none sm:rounded-sm border border-white/[0.04] group-hover:border-accent/40 transition-colors duration-500"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        priority={index < 3}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      />

                      {/* Extremely subtle editorial vignette only on edge */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* ── 3. METADATA ROW UNDERNEATH THE IMAGE ── */}
                    <div className="pt-4 flex items-start justify-between gap-4 border-b border-white/[0.04] pb-3">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[11px] text-accent/80 tracking-widest">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-serif text-lg sm:text-xl text-[#F6F4F0] font-normal tracking-tight group-hover:text-accent transition-colors duration-300">
                            {image.title}
                          </h3>
                        </div>

                        <p className="text-xs text-[#A39E96] font-light leading-relaxed">
                          {image.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-1 text-right">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#666159] hidden sm:inline">
                          {image.category} · {image.year}
                        </span>

                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/10 text-[#666159] group-hover:text-accent group-hover:border-accent/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state fallback */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[260px] border border-white/[0.06] text-center p-8">
            <p className="text-sm text-[#A39E96] font-light">
              Bu bo&apos;limda hozircha suratlar mavjud emas.
            </p>
          </div>
        )}
      </div>

      {/* ── 4. QUIET EDITORIAL LIGHTBOX ── */}
      <AnimatePresence>
        {lightboxImage && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[120] flex flex-col justify-between bg-[#0A0908]/96 backdrop-blur-md p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Fotosuratni to'liq ko'rish"
            onClick={closeLightbox}
          >
            {/* Top Bar */}
            <div
              className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-accent tracking-widest">
                  {String(lightboxIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                </span>
                <span className="w-px h-3.5 bg-white/20" />
                <span className="font-serif text-sm sm:text-base text-[#F6F4F0] font-normal">
                  {lightboxImage.title}
                </span>
                <span className="font-mono text-[10px] uppercase text-[#666159] tracking-widest hidden md:inline">
                  {lightboxImage.category}
                </span>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-[#A39E96] hover:text-[#F6F4F0] hover:border-white/30 transition-all duration-300"
                aria-label="Yopish (ESC)"
              >
                <span>Yopish</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Canvas / Main View */}
            <div
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-1 sm:left-4 z-20 p-3 rounded-full border border-white/10 bg-[#0C0B0A]/70 text-[#A39E96] hover:text-accent hover:border-accent/40 backdrop-blur-sm transition-all duration-300"
                aria-label="Oldingi fotosurat"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-1 sm:right-4 z-20 p-3 rounded-full border border-white/10 bg-[#0C0B0A]/70 text-[#A39E96] hover:text-accent hover:border-accent/40 backdrop-blur-sm transition-all duration-300"
                aria-label="Keyingi fotosurat"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Large Image */}
              <div className="relative w-full h-full max-w-6xl max-h-[75vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxImage.id}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={lightboxImage.src}
                      alt={lightboxImage.alt}
                      fill
                      priority
                      sizes="95vw"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Bar: Architectural Caption & Keyboard Shortcuts */}
            <div
              className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-0.5 max-w-xl">
                <p className="text-xs text-[#F6F4F0] font-normal">
                  {lightboxImage.subtitle}
                </p>
                <p className="text-[11px] text-[#A39E96] font-light leading-relaxed">
                  {lightboxImage.details}
                </p>
              </div>

              <div className="flex items-center gap-4 font-mono text-[10px] text-[#666159] uppercase tracking-widest shrink-0">
                <span>[← / →] o&apos;tkazish</span>
                <span>·</span>
                <span>[ESC] yopish</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}