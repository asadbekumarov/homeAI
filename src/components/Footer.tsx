"use client";

import { Globe, ExternalLink, Send } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
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

  return (
    <footer className="bg-[#080706] text-white/70 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10 py-16 lg:py-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Logo & tagline */}
            <div>
              <h3 className="font-serif text-2xl text-white tracking-[0.15em] uppercase mb-4">
                {currentProject?.projectName || "Xon Saroy — Orzular"}
              </h3>
              <p className="text-sm leading-relaxed mb-6">
                {currentProject?.tagline || "Orzulardan ilhomlangan"}. Zamonaviy arxitektura va ilg‘or infratuzilmani o‘zida mujassam etgan Komfort va Biznes klass majmuasi.
              </p>
              <div className="space-y-2 text-xs">
                <p className="text-white/80">{currentProject?.phone || "+998 71 200 74 00"}</p>
                <p className="text-white/80">{currentProject?.email || "info@xonsaroy.uz"}</p>
                <p className="text-white/50">{currentProject?.address || "Toshkent shahri"}</p>
              </div>
            </div>

            {/* Nav links */}
            <div>
              <h4 className="text-white text-sm tracking-[0.2em] uppercase mb-4">
                Havolalar
              </h4>
              <nav className="flex flex-col gap-2.5">
                {footerLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm hover:text-accent transition-colors duration-300 w-fit"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white text-sm tracking-[0.2em] uppercase mb-4">
                Ijtimoiy tarmoqlar
              </h4>
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Yangi yangiliklar, xonadonlar narxlari va maxsus takliflardan xabardor bo&apos;ling.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Divider & copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {currentProject?.developerName || "Xon Saroy"}. Barcha huquqlar himoyalangan.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="text-xs text-accent hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Tepaga qaytish</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
