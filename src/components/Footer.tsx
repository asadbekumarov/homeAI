"use client";

import { Globe, ExternalLink, Send } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const footerLinks = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Loyiha haqida", href: "#about" },
  { label: "Galereya", href: "#gallery" },
  { label: "Qulayliklar", href: "#amenities" },
  { label: "Joylashuv", href: "#location" },
  { label: "Aloqa", href: "#contact" },
];

const socialLinks = [
  { icon: Globe, href: "https://instagram.com", label: "Instagram" },
  { icon: ExternalLink, href: "https://facebook.com", label: "Facebook" },
  { icon: Send, href: "https://t.me", label: "Telegram" },
];

export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-white/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Logo & tagline */}
            <div>
              <h3 className="font-serif text-2xl text-white tracking-[0.15em] uppercase mb-4">
                The Palisades
              </h3>
              <p className="text-sm leading-relaxed mb-6">
                Osmon bilan yer chegarasida yashang. Toshkentning eng hashamatli
                va nufuzli turar-joy majmuasi.
              </p>
              <div className="space-y-2 text-xs">
                <p className="text-white/80">+998 90 123 45 67</p>
                <p className="text-white/80">info@thepalisades.uz</p>
                <p className="text-white/50">Toshkent sh., Yunusobod tumani</p>
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
            © {new Date().getFullYear()} The Palisades Luxury Residences. Barcha huquqlar himoyalangan.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
