"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Sparkles,
  SunMedium,
  Moon,
  Compass,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useProject } from "@/context/ProjectContext";

interface ArchitecturalView {
  id: string;
  label: string;
  tag: string;
  src: string;
  alt: string;
  description: string;
  icon: typeof SunMedium;
}

const architecturalViews: ArchitecturalView[] = [
  {
    id: "day",
    label: "Kunduzgi fasad",
    tag: "Quyosh nurlari ostida",
    src: "/gallery/exterior-1.jpg",
    alt: "Murad Buildings majmuasi — zamonaviy kunduzgi fasad",
    description: "Tabiiy quyosh nurlarida tovlanuvchi monolit va alyuminiy kompozit fasad panellari",
    icon: SunMedium,
  },
  {
    id: "night",
    label: "Tungi panorama",
    tag: "Arxitektura chiroqlari",
    src: "/gallery/exterior-2.jpg",
    alt: "Murad Buildings majmuasi — tungi me'moriy yoritish",
    description: "Poytaxt ufqini bezab turuvchi maxsus individual tungi yoritish tizimi",
    icon: Moon,
  },
  {
    id: "perspective",
    label: "Panoramik burchak",
    tag: "Ufq chizig'i",
    src: "/gallery/exterior-3.jpg",
    alt: "Murad Buildings minoralarining umumiy panoramik arxitekturasi",
    description: "Uch minoraning uyg'un kompozitsiyasi va keng ko'lamli yashil hudud",
    icon: Compass,
  },
];

export default function Interactive3D() {
  const { currentProject } = useProject();
  const [activeViewId, setActiveViewId] = useState<string>("day");

  const currentView =
    architecturalViews.find((v) => v.id === activeViewId) ??
    architecturalViews[0];

  return (
    <section
      id="interactive-3d"
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background-dark relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Architectural Description */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-16 bg-accent" />
                <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
                  Me&apos;moriy Kontseptsiya
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
                Shaklni <span className="text-accent">his qiling</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-foreground-muted text-lg leading-relaxed mb-4">
                Uchta muhtasham minora — har biri o&apos;ziga xos balandlik va zamonaviy
                nisbatlarga ega bo&apos;lib, poytaxt osmonida betakror siluet hosil qiladi.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-foreground-muted leading-relaxed mb-8">
                Geometrik shakllardagi soddalik, tabiiy yorug&apos;lik va oqlangan
                fasad chiziqlari — bizning me&apos;morchilik falsafamizning asosi.
                Har bir minora atrofidagi maydon va masofa tabiiy shamol oqimi hamda
                xonadonlarning panoramik manzarasi uchun sinchiklab o&apos;lchangan.
              </p>

              {/* Tower spec pills */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-divider/60 mb-8">
                <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center hover:border-accent/40 transition-colors">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block mb-1">
                    A Minora
                  </span>
                  <span className="text-lg font-serif text-foreground font-semibold block">
                    22 Qavat
                  </span>
                  <span className="text-[11px] text-foreground-dim block mt-0.5">
                    78m · Sharqiy
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-accent/40 text-center shadow-[0_0_20px_rgba(197,160,89,0.12)]">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block mb-1">
                    B Minora
                  </span>
                  <span className="text-lg font-serif text-foreground font-semibold block">
                    28 Qavat
                  </span>
                  <span className="text-[11px] text-accent-light block mt-0.5 font-medium">
                    Dominanta · 100m
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-card-border/80 text-center hover:border-accent/40 transition-colors">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block mb-1">
                    C Minora
                  </span>
                  <span className="text-lg font-serif text-foreground font-semibold block">
                    24 Qavat
                  </span>
                  <span className="text-[11px] text-foreground-dim block mt-0.5">
                    86m · G&apos;arbiy
                  </span>
                </div>
              </div>

              {/* Action Button to Apartments Section */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#apartments"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent text-[#0C0B0A] font-medium text-sm hover:bg-accent-light transition-all shadow-lg shadow-accent/20 group"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Kvartiralarni tanlash</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-white/10 text-foreground-muted hover:text-foreground hover:border-accent/40 text-sm transition-all"
                >
                  <span>To&apos;liq galereya</span>
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Architectural Photography Showcase */}
          <ScrollReveal delay={0.2} direction="right">
            <div className="space-y-4">
              {/* Perspective Switcher Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface/80 border border-card-border/70 backdrop-blur-md">
                {architecturalViews.map((view) => {
                  const Icon = view.icon;
                  const isActive = view.id === activeViewId;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setActiveViewId(view.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-accent text-[#0C0B0A] shadow-md shadow-accent/25"
                          : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{view.label}</span>
                      <span className="sm:hidden">{view.label.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Featured Visual Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-background border border-card-border shadow-[0_25px_60px_rgba(0,0,0,0.6)] group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={currentView.src}
                      alt={currentView.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />

                    {/* Gradient shadows for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                    {/* Top Tag */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="font-medium">{currentView.tag}</span>
                      </div>
                      <span className="text-[11px] text-white/80 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        {currentProject?.developerName || "Xon Saroy"}
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm font-serif font-semibold text-white tracking-wide">
                          {currentView.label}
                        </h3>
                        <span className="text-[10px] tracking-wider uppercase text-accent font-semibold px-2 py-0.5 rounded bg-accent/15 border border-accent/30">
                          Premium Render
                        </span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                        {currentView.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
