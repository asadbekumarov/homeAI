"use client";

import dynamic from "next/dynamic";
import ScrollReveal from "./ScrollReveal";

const BuildingScene = dynamic(() => import("./BuildingScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

export default function Interactive3D() {
  return (
    <section id="interactive-3d" className="py-24 lg:py-36 px-6 bg-background-dark">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-16 bg-accent" />
                <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
                  3D Ko&apos;rinish
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
                Uchta noyob minora — har biri o&apos;ziga xos balandlik va
                nisbatlarga ega. Qurilish majmuasining umumiy ko&apos;rinishini
                sichqonchangiz yordamida aylantiring va har tomondan ko&apos;ring.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-foreground-muted leading-relaxed mb-8">
                Geometrik shakllardagi soddalik va muvozanat — bizning
                me&apos;morchilik falsafamizning asosi. Har bir minora atrofidagi
                maydon va masofa sinchiklab o&apos;lchangan, tabiiy yorug&apos;lik
                va shamol oqimini ta&apos;minlash uchun.
              </p>

              {/* Tower spec pills */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-divider/60">
                <div className="p-3 rounded-xl bg-card border border-card-border text-center">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block">A Minora</span>
                  <span className="text-base font-serif text-foreground font-semibold">22 Qavat</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-card-border text-center">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block">B Minora</span>
                  <span className="text-base font-serif text-foreground font-semibold">28 Qavat</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-card-border text-center">
                  <span className="text-[10px] tracking-wider uppercase text-accent font-semibold block">C Minora</span>
                  <span className="text-base font-serif text-foreground font-semibold">24 Qavat</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 3D Canvas */}
          <ScrollReveal delay={0.2} direction="right">
            <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-background border border-card-border shadow-2xl">
              <BuildingScene />

              {/* Interactive badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>360° interaktiv model</span>
                </div>
                <span className="text-[11px] text-white/70 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 hidden sm:block">
                  Aylantirish uchun torting
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
