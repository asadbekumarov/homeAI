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
  | "Qulayliklar"
  | "Ichki xonalar";

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<Category, "Barchasi">;
  featured?: boolean;
}

const images: GalleryImage[] = [
  {
    src: "/gallery/exterior-1.jpg",
    alt: "Bino tashqi ko'rinishi — kunduzgi",
    category: "Tashqi ko'rinish",
    featured: true,
  },
  {
    src: "/gallery/interior-1.jpg",
    alt: "Zamonaviy yashash xonasi",
    category: "Ichki xonalar",
  },
  {
    src: "/gallery/amenity-1.jpg",
    alt: "Tomdagi terassa",
    category: "Qulayliklar",
  },
  {
    src: "/gallery/exterior-2.jpg",
    alt: "Bino tashqi ko'rinishi — kechqurun",
    category: "Tashqi ko'rinish",
  },
  {
    src: "/gallery/interior-2.jpg",
    alt: "Oshxona dizayni",
    category: "Ichki xonalar",
  },
  {
    src: "/gallery/amenity-2.jpg",
    alt: "Lobbi maydoni",
    category: "Qulayliklar",
  },
  {
    src: "/gallery/interior-3.jpg",
    alt: "Master yotoq xonasi",
    category: "Ichki xonalar",
  },
  {
    src: "/gallery/exterior-3.jpg",
    alt: "Bog' va hovli",
    category: "Tashqi ko'rinish",
  },
];

const categories: Category[] = [
  "Barchasi",
  "Tashqi ko'rinish",
  "Qulayliklar",
  "Ichki xonalar",
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Barchasi");

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    null
  );

  const filtered =
    activeCategory === "Barchasi"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const lightboxImage =
    lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filtered.length === 0) return;

    setLightboxIndex(
      (lightboxIndex - 1 + filtered.length) % filtered.length
    );
  }, [lightboxIndex, filtered.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filtered.length === 0) return;

    setLightboxIndex(
      (lightboxIndex + 1) % filtered.length
    );
  }, [lightboxIndex, filtered.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        handlePrev();
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
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
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-32 xl:px-10"
    >
      <div className="mx-auto max-w-7xl">

        {/* --------------------------------
            HEADER
        -------------------------------- */}
        <ScrollReveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />

            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-accent sm:text-xs">
              Galereya
            </span>

            <span className="h-px flex-1 bg-divider" />
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <ScrollReveal delay={0.05}>
            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground-muted">
                01 — Visual experience
              </p>

              <h2 className="font-serif text-4xl leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Nafis{" "}
                <span className="text-accent">detallar.</span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-foreground-muted sm:text-base">
                Har bir detal puxta o‘ylangan. Arxitektura,
                interyer va kundalik hayot uchun yaratilgan
                qulayliklarni kashf eting.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="font-mono text-xs uppercase tracking-widest text-foreground-muted">
              <span className="text-foreground">
                {String(filtered.length).padStart(2, "0")}
              </span>{" "}
              / {String(images.length).padStart(2, "0")} views
            </div>
          </ScrollReveal>
        </div>

        {/* --------------------------------
            FILTERS
        -------------------------------- */}
        <ScrollReveal delay={0.15}>
          <div className="mt-12 border-y border-divider py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => changeCategory(category)}
                    className={`
                      relative shrink-0 px-4 py-2.5
                      text-[11px] font-medium uppercase
                      tracking-[0.12em]
                      transition-colors duration-300
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-accent
                      focus-visible:ring-offset-2
                    `}
                  >
                    <span
                      className={
                        active
                          ? "text-foreground"
                          : "text-foreground-muted hover:text-foreground"
                      }
                    >
                      {category}
                    </span>

                    {active && (
                      <motion.span
                        layoutId="gallery-filter"
                        className="absolute inset-x-4 -bottom-[17px] h-px bg-accent"
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
            </div>
          </div>
        </ScrollReveal>

        {/* --------------------------------
            GALLERY
        -------------------------------- */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((image, index) => {
              const isFirst = index === 0;
              const isLarge = isFirst && filtered.length > 1;

              return (
                <motion.button
                  key={image.src}
                  layout
                  type="button"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  onClick={() => setLightboxIndex(index)}
                  className={`
                    group relative block w-full
                    overflow-hidden rounded-sm
                    bg-background-dark
                    text-left
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-accent
                    focus-visible:ring-offset-4
                    ${
                      isLarge
                        ? "sm:col-span-2 lg:col-span-7 lg:row-span-2"
                        : "lg:col-span-5"
                    }
                  `}
                  style={{
                    aspectRatio: isLarge ? "1.18 / 1" : "1.45 / 1",
                  }}
                  aria-label={`${image.alt}. Kattalashtirib ko'rish`}
                >
                  {/* Image */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index === 0}
                    sizes={
                      isLarge
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                    }
                    className="
                      object-cover
                      transition-transform
                      duration-1000
                      ease-out
                      group-hover:scale-[1.045]
                    "
                  />

                  {/* Cinematic overlay */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-black/5
                      to-transparent
                      opacity-80
                      transition-opacity
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* Top metadata */}
                  <div className="absolute left-5 top-5 flex items-center gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="h-px w-6 bg-white/40" />

                    <span className="text-[9px] uppercase tracking-[0.18em] text-white/60">
                      {image.category}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                    <div>
                      <p
                        className="
                          max-w-[300px]
                          translate-y-2
                          text-sm font-medium
                          text-white
                          opacity-0
                          transition-all
                          duration-500
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        {image.alt}
                      </p>

                      <div
                        className="
                          mt-2 h-px w-0
                          bg-white/70
                          transition-all
                          duration-700
                          group-hover:w-12
                        "
                      />
                    </div>

                    <span
                      className="
                        flex h-10 w-10 shrink-0
                        translate-y-2
                        items-center justify-center
                        rounded-full
                        border border-white/30
                        bg-black/10
                        text-white
                        opacity-0
                        backdrop-blur-sm
                        transition-all
                        duration-500
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >
                      <ArrowUpRight size={17} strokeWidth={1.5} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center border border-divider">
            <p className="text-sm text-foreground-muted">
              Bu kategoriyada rasmlar mavjud emas.
            </p>
          </div>
        )}
      </div>

      {/* --------------------------------
          LIGHTBOX
      -------------------------------- */}
      <AnimatePresence>
        {lightboxImage && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed inset-0 z-[100]
              flex items-center justify-center
              bg-black/95
              px-4 py-6
              backdrop-blur-md
              sm:px-8
            "
            role="dialog"
            aria-modal="true"
            aria-label="Galereya rasmini to'liq ko'rish"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div
              className="
                absolute left-0 right-0 top-0
                flex items-center justify-between
                px-5 py-5 sm:px-8
              "
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                <span className="text-white">
                  {String(lightboxIndex + 1).padStart(2, "0")}
                </span>{" "}
                / {String(filtered.length).padStart(2, "0")}
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full border border-white/15
                  bg-white/5 text-white/80
                  transition-all duration-300
                  hover:border-white/30
                  hover:bg-white/10
                  hover:text-white
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-accent
                "
                aria-label="Yopish"
              >
                <X size={19} strokeWidth={1.5} />
              </button>
            </div>

            {/* Previous */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handlePrev();
              }}
              className="
                absolute left-3 top-1/2 z-20
                flex h-11 w-11
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-white/15
                bg-white/5
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-white/15
                sm:left-8
                sm:h-12 sm:w-12
              "
              aria-label="Oldingi rasm"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleNext();
              }}
              className="
                absolute right-3 top-1/2 z-20
                flex h-11 w-11
                -translate-y-1/2
                items-center justify-center
                rounded-full
                border border-white/15
                bg-white/5
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-white/15
                sm:right-8
                sm:h-12 sm:w-12
              "
              aria-label="Keyingi rasm"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxImage.src}
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.35,
              }}
              className="
                relative
                flex h-[72vh] w-[88vw]
                max-w-6xl
                flex-col
                items-center
                justify-center
                sm:h-[78vh]
              "
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.alt}
                  fill
                  priority
                  sizes="90vw"
                  className="object-contain"
                />
              </div>

              {/* Caption */}
              <div className="absolute -bottom-12 left-0 right-0 text-center sm:-bottom-14">
                <p className="text-sm font-medium text-white">
                  {lightboxImage.alt}
                </p>

                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                  {lightboxImage.category}
                </p>
              </div>
            </motion.div>

            {/* Bottom hint */}
            <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 sm:block">
              ← → navigate · ESC close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}