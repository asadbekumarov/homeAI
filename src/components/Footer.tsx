"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, ExternalLink, Send, ArrowUp } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

const footerLinks = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Loyiha haqida", href: "#about" },
  { label: "3D Ko'rinish", href: "#interactive-3d" },
  { label: "Kvartiralar", href: "#apartments" },
  { label: "Galereya", href: "#gallery" },
  { label: "Qulayliklar", href: "#amenities" },
  { label: "Joylashuv", href: "#location" },
  { label: "Aloqa", href: "#contact" },
];

const socialLinks = [
  { icon: Globe, href: "https://instagram.com/xonsaroyuz", label: "Instagram" },
  { icon: ExternalLink, href: "https://facebook.com/xonsaroyuz", label: "Facebook" },
  { icon: Send, href: "https://t.me/xonsaroyuz", label: "Telegram" },
];

export default function Footer() {
  const { currentProject } = useProject();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-80px" });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href) as HTMLElement | null;
      if (el) {
        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
          window.__lenis.scrollTo(el, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const scrollToTop = () => {
    if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#080706] text-white/70 border-t border-white/10 relative overflow-hidden"
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.04) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 py-16 lg:py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="font-serif text-2xl text-white tracking-[0.15em] uppercase mb-4"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {currentProject?.projectName || "Xon Saroy — Orzular"}
            </motion.h3>
            <p className="text-sm leading-relaxed mb-6">
              {currentProject?.tagline || "Orzulardan ilhomlangan"}. Zamonaviy
              arxitektura va ilg&apos;or infratuzilmani o&apos;zida mujassam
              etgan Komfort va Biznes klass majmuasi.
            </p>
            <div className="space-y-1.5 text-xs">
              <motion.p
                whileHover={{ x: 4, color: "#C5A059" }}
                transition={{ duration: 0.2 }}
                className="text-white/80 cursor-default"
              >
                {currentProject?.phone || "+998 71 200 74 00"}
              </motion.p>
              <motion.p
                whileHover={{ x: 4, color: "#C5A059" }}
                transition={{ duration: 0.2 }}
                className="text-white/80 cursor-default"
              >
                {currentProject?.email || "info@xonsaroy.uz"}
              </motion.p>
              <p className="text-white/50">
                {currentProject?.address || "Toshkent shahri"}
              </p>
            </div>
          </motion.div>

          {/* Nav Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white text-sm tracking-[0.2em] uppercase mb-5 font-semibold">
              Havolalar
            </h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  whileHover={{ x: 5, color: "#C5A059" }}
                  transition={{ duration: 0.15 }}
                  className="text-sm text-white/60 hover:text-accent transition-colors duration-200 w-fit flex items-center gap-1.5 group"
                >
                  <motion.span
                    className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent group-hover:scale-150 transition-all"
                  />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white text-sm tracking-[0.2em] uppercase mb-5 font-semibold">
              Ijtimoiy tarmoqlar
            </h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:bg-accent hover:text-[#0A0908] transition-all duration-300"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Yangi yangiliklar, xonadonlar narxlari va maxsus takliflardan
              xabardor bo&apos;ling.
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()}{" "}
            {currentProject?.developerName || "Xon Saroy"}. Barcha huquqlar
            himoyalangan.
          </p>

          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/25 bg-accent/10 text-accent hover:bg-accent hover:text-[#0A0908] text-xs font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            <ArrowUp size={12} />
            <span>Tepaga qaytish</span>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
