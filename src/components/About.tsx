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
          <p className="text-foreground-muted leading-relaxed max-w-3xl mb-16">
            Loyihamiz xalqaro me&apos;morchilik standartlariga mos ravishda ishlab chiqilgan
            bo&apos;lib, yashovchilarimizga faqat eng yuqori darajadagi qulaylik va
            xavfsizlikni taqdim etadi. Zamonaviy texnologiyalar, ekologik materiallar va
            noyob dizayn yechimlari — barchasi sizning osoyishta hayotingiz uchun.
          </p>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-12 border-t border-divider">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.1 * i}>
              <div className="text-center md:text-left">
                <div className="font-serif text-4xl lg:text-5xl text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm tracking-wide text-foreground-muted uppercase">
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
