"use client";

import ScrollReveal from "./ScrollReveal";

const stats = [
  { value: "3", label: "Minora" },
  { value: "28", label: "Qavat" },
  { value: "460+", label: "Xonadon" },
  { value: "2027", label: "Topshirish yili" },
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-36 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 max-w-16 bg-accent" />
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
              Loyiha haqida
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8">
            Zamonaviy hashamat va <br className="hidden md:block" />
            <span className="text-accent">tabiiy go&apos;zallik</span> uyg&apos;unligi
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-foreground-muted text-lg lg:text-xl leading-relaxed max-w-3xl mb-6">
            The Palisades — Toshkent shahrining eng nufuzli hududida qurilayotgan uchta
            hashamatli minoradan iborat turar-joy majmuasi. Har bir burchagi nafislik bilan
            loyihalashtirilgan binolar, ko&apos;kalamzorlashtirilgan ichki hovli va panoramik
            shahar manzarasi bilan ajralib turadi.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-foreground-muted leading-relaxed max-w-3xl mb-12">
            Loyihamiz xalqaro me&apos;morchilik standartlariga mos ravishda ishlab chiqilgan
            bo&apos;lib, yashovchilarimizga faqat eng yuqori darajadagi qulaylik va
            xavfsizlikni taqdim etadi. Zamonaviy texnologiyalar, ekologik materiallar va
            noyob dizayn yechimlari — barchasi sizning osoyishta hayotingiz uchun.
          </p>
        </ScrollReveal>

        {/* Architectural Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { tag: "Balandlik", title: "3.4 Metr", desc: "Kenglik va havodorlik baxsh etuvchi baland shiftlar" },
            { tag: "Panoramik", title: "Schüco Oynalari", desc: "Germaniya texnologiyasi, shovqin va issiqlik izolyatsiyasi" },
            { tag: "Xavfsizlik", title: "Smart Access", desc: "Yuzni tanish va biometrik kirish tizimlari" },
            { tag: "Ekologiya", title: "45% Yashil Maydon", desc: "Faqat piyodalar uchun ajratilgan park va hovli" },
          ].map((item, idx) => (
            <ScrollReveal key={item.title} delay={0.08 * idx}>
              <div className="p-5 rounded-2xl bg-card border border-card-border/80 hover:border-accent/40 hover:shadow-lg transition-all duration-300">
                <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold block mb-2">
                  {item.tag}
                </span>
                <h3 className="font-serif text-xl text-foreground font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pt-10 border-t border-divider">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.1 * i}>
              <div className="p-6 rounded-2xl bg-card/60 border border-card-border/60 text-center md:text-left hover:border-accent/30 transition-all">
                <div className="font-serif text-4xl lg:text-5xl text-foreground font-light mb-1">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.15em] text-accent uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
