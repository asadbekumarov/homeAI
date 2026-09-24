"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Loyiha haqida", href: "#about" },
  { label: "3D ko'rinish", href: "#interactive-3d" },
  { label: "Galereya", href: "#gallery" },
  { label: "Qulayliklar", href: "#amenities" },
  { label: "Joylashuv", href: "#location" },
  { label: "Aloqa", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-divider shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleClick(e, "#hero")}
          className={cn(
            "font-serif text-xl lg:text-2xl tracking-[0.2em] uppercase transition-colors duration-500",
            scrolled ? "text-foreground" : "text-white"
          )}
        >
          The Palisades
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={cn(
                "text-xs tracking-[0.1em] uppercase transition-all duration-300 relative py-1 hover:text-accent font-medium",
                scrolled ? "text-foreground/80 hover:text-accent" : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA and Phone */}
        <div className="hidden lg:flex items-center gap-5">
          <a
            href="tel:+998901234567"
            className={cn(
              "text-xs font-mono tracking-wider transition-colors",
              scrolled ? "text-foreground-muted hover:text-foreground" : "text-white/70 hover:text-white"
            )}
          >
            +998 90 123 45 67
          </a>
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="px-5 py-2 rounded-full bg-accent hover:bg-accent-dark text-white text-xs tracking-[0.15em] uppercase font-medium transition-all shadow-md hover:shadow-accent/25 hover:scale-105 active:scale-95"
          >
            Konsultatsiya
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "lg:hidden p-2 transition-colors",
            scrolled ? "text-foreground" : "text-white"
          )}
          aria-label="Menyu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-b border-divider overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-foreground-muted text-sm tracking-wide py-2 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
