"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  Trees,
  Zap,
  ConciergeBell,
  ParkingSquare,
  ShoppingBag,
  Maximize,
  ArrowUpCircle,
} from "lucide-react";

const amenities = [
  {
    icon: ParkingSquare,
    title: "2 qavatli avtoturargoh",
    description:
      "2 qavatli keng yer osti va yer usti avtoturargohi hamda elektroavtomobillarni zaryadlash stansiyalari.",
    color: "from-blue-500/15 to-blue-600/5",
    accent: "text-blue-400",
  },
  {
    icon: Trees,
    title: "Bolalar va sport zonalari",
    description:
      "Ekologik yashil hovli, zamonaviy bolalar o'yin maydonchalari va sun'iy qoplamali professional futbol maydoni.",
    color: "from-emerald-500/15 to-emerald-600/5",
    accent: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Xavfsizlik tizimi",
    description:
      "24/7 uzluksiz video nazorat, professional qo'riqlash xizmati va begonalardan himoyalangan yopiq hovli tizimi.",
    color: "from-accent/15 to-accent/5",
    accent: "text-accent",
  },
  {
    icon: ShoppingBag,
    title: "Tijorat zonalari (3 qavat)",
    description:
      "Binoning pastki 3 qavatida aholi uchun maishiy xizmat ko'rsatish shoxobchalari, kafelar va do'konlar.",
    color: "from-purple-500/15 to-purple-600/5",
    accent: "text-purple-400",
  },
  {
    icon: Maximize,
    title: "3.1 Metr baland shiftlar",
    description:
      "Xonadonlarda kenglik va yorug'lik hissini kuchaytiruvchi 3.1 metrli shiftlar va panoramik oynalar.",
    color: "from-amber-500/15 to-amber-600/5",
    accent: "text-amber-400",
  },
  {
    icon: ConciergeBell,
    title: "Muhtasham Saroy Servis",
    description:
      "Aholi va mehmonlar uchun 24/7 konsyerj xizmati, qabul lobbisi va maishiy masalalarni tezkor hal qilish.",
    color: "from-accent/15 to-accent/5",
    accent: "text-accent",
  },
  {
    icon: ArrowUpCircle,
    title: "Tezyurar shovqinsiz liftlar",
    description:
      "Har bir blokda eng zamonaviy shovqinsiz liftlar — yer osti avtoturargohiga to'g'ridan-to'g'ri chiqish bilan.",
    color: "from-sky-500/15 to-sky-600/5",
    accent: "text-sky-400",
  },
  {
    icon: Zap,
    title: "Elektromobil zaryadlash",
    description:
      "Ekologik transport egalari uchun avtoturargohda maxsus tezkor quvvatlash uskunalari o'rnatilgan.",
    color: "from-lime-500/15 to-lime-600/5",
    accent: "text-lime-400",
  },
];

function AmenityCard({
  amenity,
  index,
}: {
  amenity: (typeof amenities)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.96 }
      }
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.08 + Math.floor(index / 4) * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8, scale: 1.025 }}
      className="group relative p-7 lg:p-8 rounded-2xl bg-card border border-card-border/80 hover:border-accent/30 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] transition-shadow duration-300 h-full flex flex-col justify-between overflow-hidden cursor-default"
    >
      {/* BG gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${amenity.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${amenity.color} border border-white/10 flex items-center justify-center mb-6`}
        >
          <amenity.icon
            size={22}
            strokeWidth={1.75}
            className={amenity.accent}
          />
        </motion.div>

        <h3
          className={`font-serif text-xl text-foreground font-semibold mb-3 group-hover:${amenity.accent} transition-colors duration-300`}
        >
          {amenity.title}
        </h3>
        <p className="text-foreground-muted text-sm leading-relaxed">
          {amenity.description}
        </p>
      </div>

      {/* Bottom accent line — animates width on hover */}
      <motion.div
        className={`relative z-10 h-0.5 bg-gradient-to-r from-accent/40 to-transparent mt-6 rounded-full`}
        initial={{ width: "24px" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export default function Amenities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="amenities"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background-dark relative overflow-hidden"
    >
      {/* Parallax BG noise/glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.04) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.03) 0%, transparent 70%)" }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div ref={titleRef}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isTitleInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-px flex-1 max-w-16 bg-accent origin-left"
            />
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
              Qulayliklar
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-16"
          >
            Hayotingiz uchun{" "}
            <span className="text-gradient-gold">barcha sharoit</span>
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {amenities.map((amenity, i) => (
            <AmenityCard key={amenity.title} amenity={amenity} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
