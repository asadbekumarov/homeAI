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
              <p className="text-sm leading-relaxed">
                Osmon bilan yer chegarasida yashang. Toshkentning eng hashamatli
                turar-joy majmuasi.
              </p>
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
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Divider & copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} The Palisades. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs">
            Toshkent, O&apos;zbekiston
          </p>
        </div>
      </div>
    </footer>
  );
}
