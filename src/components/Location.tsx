"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

const LANDMARKS = [
  { label: "Metro 3-bekati", distance: "650 m", time: "8 min", icon: "🚇" },
  { label: "\"Oltin Kalitcha\" bog'chasi", distance: "250 m", time: "3 min", icon: "🌿" },
  { label: "255-sonli maktab", distance: "300 m", time: "4 min", icon: "🏫" },
  { label: "Katta halqa yo'li", distance: "0 m", time: "To'g'ri", icon: "🛣️" },
];

export default function Location() {
  const { currentProject } = useProject();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(null);
  const mapRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-80px" });
  const isMapInView = useInView(mapRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mapY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 relative overflow-hidden"
    >
      {/* BG subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(197,160,89,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Panel */}
          <div ref={contentRef}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isContentInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-px flex-1 max-w-16 bg-accent origin-left"
              />
              <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
                Joylashuv
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6"
            >
              Shahar{" "}
              <span className="text-gradient-gold">markazida</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground-muted text-lg leading-relaxed mb-8"
            >
              {currentProject?.projectName || "Xon Saroy — Orzular"} majmuasi
              Toshkent shahrining nufuzli va qulay hududlaridan birida joylashgan.
              Yaqin atrofda yirik savdo markazlari, ta&apos;lim muassasalari,
              bog&apos;lar va qulay transport tarmoqlari mavjud.
            </motion.p>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.24 }}
              className="flex items-start gap-4 mb-6 p-4 rounded-2xl bg-card border border-card-border/60"
            >
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-0.5">Manzil</p>
                <p className="text-foreground-muted text-sm">
                  {currentProject?.address || "Toshkent shahri, Yunusobod tumani, Katta halqa yo'li bo'yi"}
                </p>
              </div>
            </motion.div>

            {/* Landmarks */}
            <div className="space-y-2">
              {LANDMARKS.map((lm, i) => (
                <motion.div
                  key={lm.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-card/50 border border-card-border/40 hover:border-accent/25 transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{lm.icon}</span>
                    <span className="text-foreground-muted text-sm group-hover:text-foreground transition-colors">
                      {lm.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-accent text-xs font-mono font-bold">
                      {lm.distance}
                    </span>
                    <span className="text-foreground-dim text-xs ml-2">
                      · {lm.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map Panel */}
          <motion.div
            ref={mapRef}
            style={{ y: mapY }}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={isMapInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-card-border shadow-2xl bg-background-dark group"
          >
            {/* Glowing border on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(197,160,89,0.35), 0 0 40px rgba(197,160,89,0.1)",
              }}
            />

            <iframe
              title="Xon Saroy — Orzular Joylashuvi"
              src="https://www.openstreetmap.org/export/embed.html?bbox=69.260%2C41.350%2C69.310%2C41.385&layer=mapnik&marker=41.3680%2C69.2880"
              className="w-full h-full border-0 filter invert-[0.92] hue-rotate-180 contrast-[1.15] opacity-80 group-hover:opacity-100 transition-opacity duration-400"
              loading="lazy"
            />

            {/* Floating Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isMapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="absolute top-4 left-4 right-4 md:right-auto md:max-w-xs bg-background-dark/92 backdrop-blur-md p-4 rounded-xl border border-card-border shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0"
                >
                  <MapPin size={16} />
                </motion.div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    {currentProject?.projectName || "Xon Saroy — Orzular"}
                  </h3>
                  <p className="text-foreground-muted text-xs">
                    Yunusobod t., Katta halqa yo&apos;li bo&apos;yi
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Map Buttons */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
              {[
                { label: "Google Maps", href: "https://maps.google.com/?q=41.3680,69.2880" },
                { label: "Yandex Maps", href: "https://yandex.com/maps/?pt=69.2880,41.3680&z=15&l=map" },
              ].map((btn) => (
                <motion.a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-dark/92 hover:bg-accent hover:text-[#0A0908] transition-all duration-200 text-foreground-muted text-xs border border-card-border backdrop-blur-sm font-medium"
                >
                  <ExternalLink size={10} />
                  {btn.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
