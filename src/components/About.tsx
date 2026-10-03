"use client";

import { useRef } from "react";
import { motion, useInView, useScroll } from "framer-motion";
import { useProject } from "@/context/ProjectContext";

const FEATURES = [
  {
    tag: "Shift Balandligi",
    title: "3.1 Metr",
    desc: "Kenglik va havodorlik baxsh etuvchi 3.1 metrli baland shiftlar",
    num: "01",
  },
  {
    tag: "Majmua Ko'lami",
    title: "14 Blok · 1600",
    desc: "16 qavatli monolit binolar va 10 xildan ortiq rejaviy yechimlar",
    num: "02",
  },
  {
    tag: "Xavfsizlik",
    title: "Muhtasham Saroy",
    desc: "24/7 video nazorat, professional qo'riqlash va yopiq xavfsiz hovli",
    num: "03",
  },
  {
    tag: "To'lov Imtiyozi",
    title: "18–36 Oy 0%",
    desc: "30% yoki 50% boshlang'ich to'lov bilan foizsiz muddatli to'lov",
    num: "04",
  },
];

function FeatureCard({
  item,
  index,
}: {
  item: (typeof FEATURES)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.97 }
      }
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative p-5 rounded-2xl bg-card border border-card-border/80 hover:border-accent/40 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),_0_0_20px_rgba(197,160,89,0.12)] transition-shadow duration-300 cursor-default overflow-hidden"
    >
      {/* Gradient sweep on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(197,160,89,0.07), transparent 70%)",
        }}
      />
      <span className="font-mono text-[10px] tracking-[0.25em] text-accent/50 font-bold absolute top-4 right-4">
        {item.num}
      </span>
      <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold block mb-2 relative z-10">
        {item.tag}
      </span>
      <h3 className="font-serif text-xl text-foreground font-semibold mb-2 group-hover:text-accent transition-colors duration-300 relative z-10">
        {item.title}
      </h3>
      <p className="text-xs text-foreground-muted leading-relaxed relative z-10">
        {item.desc}
      </p>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-accent-light"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function StatCounter({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      className="p-6 rounded-2xl bg-card/60 border border-card-border/60 text-center md:text-left hover:border-accent/30 hover:bg-card transition-all duration-300 cursor-default"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.5, delay: 0.15 * index + 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-4xl lg:text-5xl text-foreground font-light mb-1"
      >
        {value}
      </motion.div>
      <div className="text-xs tracking-[0.15em] text-accent uppercase font-medium">
        {label}
      </div>
    </motion.div>
  );
}

export default function About() {
  const { currentProject } = useProject();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const stats = currentProject.stats || [
    { value: "14", label: "Blok" },
    { value: "16", label: "Qavat" },
    { value: "1600+", label: "Xonadon" },
    { value: "2026", label: "Topshirish yili" },
  ];

  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-80px" });

  const badgeRef = useRef(null);
  const isBadgeInView = useInView(badgeRef, { once: true, margin: "-50px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section label */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, x: -30 }}
          animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-12"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-px flex-1 max-w-16 bg-accent origin-left"
          />
          <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
            Loyiha haqida
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8"
        >
          {currentProject.tagline ? (
            <>
              {currentProject.tagline.split(" ")[0]}{" "}
              <span className="text-gradient-gold">
                {currentProject.tagline.split(" ").slice(1).join(" ")}
              </span>
            </>
          ) : (
            <>
              Zamonaviy hashamat va{" "}
              <br className="hidden md:block" />
              <span className="text-gradient-gold">tabiiy go&apos;zallik</span>{" "}
              uyg&apos;unligi
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-foreground-muted text-lg lg:text-xl leading-relaxed max-w-3xl mb-5"
        >
          <span className="text-foreground font-semibold">
            {currentProject.projectName}
          </span>{" "}
          — zamonaviy arxitektura va ilg&apos;or infratuzilmani o&apos;zida
          mujassam etgan Komfort va Biznes klass toifasidagi muhtasham
          turar-joy majmuasi.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="text-foreground-muted leading-relaxed max-w-3xl mb-8"
        >
          Majmuamiz me&apos;morchilik va muhandislikning eng ilg&apos;or
          standartlariga mos ravishda barpo etilmoqda. Ekologik toza materiallar,
          xavfsiz ko&apos;kalamzorlashtirilgan shaxsiy hovli hamda 24/7 konsyerj
          xizmatlari siz va yaqinlaringizning farovon hayotini ta&apos;minlaydi.
        </motion.p>

        {/* Status badge */}
        <motion.div
          ref={badgeRef}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={isBadgeInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-12"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 rounded-full bg-accent block"
          />
          <span>
            Loyihaning ma&apos;lum bloklari to&apos;liq topshirilgan va
            foydalanishga shay. Yangi bloklar 2026-yil davomida
            bosqichma-bosqich topshirilmoqda.
          </span>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {FEATURES.map((item, idx) => (
            <FeatureCard key={item.title} item={item} index={idx} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pt-10 border-t border-divider">
          {stats.map((stat, i) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
