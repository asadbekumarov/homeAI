"use client";

import ScrollReveal from "./ScrollReveal";
import { useProject } from "@/context/ProjectContext";

export default function About() {
  const { currentProject } = useProject();

  const stats = currentProject.stats || [
    { value: "4", label: "Blok" },
    { value: "16", label: "Qavat" },
    { value: "380+", label: "Xonadon" },
    { value: "2026", label: "Topshirish yili" },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
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
            {currentProject.tagline ? (
              <>
                {currentProject.tagline.split(" ")[0]}{" "}
                <span className="text-accent">
                  {currentProject.tagline.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              <>
                Zamonaviy hashamat va <br className="hidden md:block" />
                <span className="text-accent">tabiiy go&apos;zallik</span> uyg&apos;unligi
              </>
            )}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-foreground-muted text-lg lg:text-xl leading-relaxed max-w-3xl mb-6">
            <span className="text-foreground font-semibold">
              {currentProject.projectName}
            </span>{" "}
            — zamonaviy arxitektura va ilg‘or infratuzilmani o‘zida mujassam
            etgan Komfort va Biznes klass toifasidagi muhtasham turar-joy
            majmuasi. Aholi xavfsizligi va qulayligini ta&apos;minlash uchun
            maxsus &quot;Muhtasham Saroy&quot; servis tizimi joriy etilgan.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-foreground-muted leading-relaxed max-w-3xl mb-8">
            Majmuamiz me&apos;morchilik va muhandislikning eng ilg&apos;or
            standartlariga mos ravishda barpo etilmoqda. Ekologik toza
            materiallar, xavfsiz ko&apos;kalamzorlashtirilgan shaxsiy hovli hamda
            24/7 konsyerj xizmatlari siz va yaqinlaringizning farovon hayotini
            ta&apos;minlaydi.
          </p>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-12">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>
              Loyihaning ma&apos;lum bloklari to&apos;liq topshirilgan va foydalanishga shay. Yangi bloklar 2026-yil davomida bosqichma-bosqich topshirilmoqda.
            </span>
          </div>
        </ScrollReveal>

        {/* Architectural Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { tag: "Shift Balandligi", title: "3.1 Metr", desc: "Kenglik va havodorlik baxsh etuvchi 3.1 metrli baland shiftlar" },
            { tag: "Majmua Ko'lami", title: "14 Blok · 1600 Xonadon", desc: "16 qavatli monolit binolar va 10 xildan ortiq rejaviy yechimlar" },
            { tag: "Xavfsizlik", title: "Muhtasham Saroy Servis", desc: "24/7 video nazorat, professional qo'riqlash va yopiq xavfsiz hovli" },
            { tag: "To'lov Imtiyozi", title: "18–36 Oygacha 0%", desc: "30% yoki 50% boshlang'ich to'lov bilan foizsiz muddatli to'lov (rassrochka)" },
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
