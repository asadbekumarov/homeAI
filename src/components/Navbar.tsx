"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Building2, Sparkles, ChevronDown, Compass } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export interface NavLinkItem {
  label: string;
  href: string;
  id: string;
}

export const MAJMUA_LINKS: NavLinkItem[] = [
  { label: "Loyiha", href: "#about", id: "about" },
  { label: "3D Ko'rinish", href: "#interactive-3d", id: "interactive-3d" },
  { label: "Kvartiralar", href: "#apartments", id: "apartments" },
  { label: "Galereya", href: "#gallery", id: "gallery" },
];

export const HUDUD_LINKS: NavLinkItem[] = [
  { label: "Qulayliklar", href: "#amenities", id: "amenities" },
  { label: "Joylashuv", href: "#location", id: "location" },
];

export const ALL_NAV_LINKS: NavLinkItem[] = [...MAJMUA_LINKS, ...HUDUD_LINKS];
export const PRIMARY_LINKS: NavLinkItem[] = MAJMUA_LINKS;
export const SECONDARY_LINKS: NavLinkItem[] = HUDUD_LINKS;

export default function Navbar() {
  const { currentProject } = useProject();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [majmuaOpen, setMajmuaOpen] = useState(false);
  const [hududOpen, setHududOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const majmuaRef = useRef<HTMLDivElement>(null);
  const hududRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (majmuaRef.current && !majmuaRef.current.contains(target)) {
        setMajmuaOpen(false);
      }
      if (hududRef.current && !hududRef.current.contains(target)) {
        setHududOpen(false);
      }
    }
    if (majmuaOpen || hududOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [majmuaOpen, hududOpen]);

  // Scroll detection for compact navbar and active link
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      const sections = ALL_NAV_LINKS.map((link) =>
        document.getElementById(link.id)
      ).filter(Boolean) as HTMLElement[];

      let current = "";
      for (const section of sections) {
        const top = section.offsetTop - 220;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation: Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMajmuaOpen(false);
        setHududOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToHref = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      setMajmuaOpen(false);
      setHududOpen(false);

      if (href === "#hero") {
        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
          window.__lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      const el = document.querySelector(href) as HTMLElement | null;
      if (el) {
        if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
          window.__lenis.scrollTo(el, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    []
  );

  const activeMajmuaItem = MAJMUA_LINKS.find((item) => item.id === activeSection);
  const activeHududItem = HUDUD_LINKS.find((item) => item.id === activeSection);

  return (
    <header
      role="banner"
      className="fixed top-0 sm:top-3 inset-x-0 z-50 transition-all duration-300 pointer-events-none px-3 sm:px-6 lg:px-8"
    >
      <nav
        aria-label="Asosiy menyu"
        className={`mx-auto max-w-7xl transition-all duration-300 pointer-events-auto rounded-2xl flex items-center justify-between gap-4 border ${
          isScrolled
            ? "glass-nav py-2.5 px-4 sm:px-6 shadow-[0_12px_40px_rgba(0,0,0,0.7)] border-white/15 bg-black/75 backdrop-blur-md"
            : "bg-black/60 backdrop-blur-md py-3 px-4 sm:px-6 border-white/10 shadow-2xl"
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToHref(e, "#hero")}
          aria-label={`${currentProject?.developerName || "Murad Buildings"} bosh sahifa`}
          className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0"
        >
          {/* Architectural Crest Monogram */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent border border-accent/40 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.25)] group-hover:border-accent group-hover:scale-105 transition-all">
            <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-accent" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-base font-bold tracking-[0.14em] uppercase text-white group-hover:text-accent transition-colors leading-tight whitespace-nowrap">
              {currentProject?.developerName || "Murad Buildings"}
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-accent/80 uppercase leading-none mt-0.5 whitespace-nowrap">
              Premium Residences
            </span>
          </div>
        </a>

        {/* Desktop Categorized Navigation (Two Separate Select Dropdowns) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Select 1: Majmua & Arxitektura */}
          <div ref={majmuaRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMajmuaOpen((prev) => !prev);
                setHududOpen(false);
              }}
              aria-expanded={majmuaOpen}
              aria-haspopup="listbox"
              aria-label="Majmua va arxitektura bo'limlari"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs tracking-wider uppercase font-medium transition-all shadow-md backdrop-blur-md cursor-pointer group ${
                majmuaOpen || activeMajmuaItem
                  ? "bg-accent/20 border-accent/60 text-accent font-semibold"
                  : "bg-white/10 hover:bg-white/15 border-white/20 hover:border-accent/40 text-white/90 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span className="whitespace-nowrap">
                {activeMajmuaItem ? `Majmua: ${activeMajmuaItem.label}` : "Majmua & Arxitektura"}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  majmuaOpen ? "rotate-180 text-accent" : "text-white/60 group-hover:text-accent"
                }`}
              />
            </button>

            {/* Majmua Dropdown Menu */}
            <div
              className={`absolute top-full left-0 mt-2.5 w-60 rounded-2xl bg-[#0e0d0c]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50 flex flex-col gap-1 transition-all duration-200 origin-top ${
                majmuaOpen
                  ? "opacity-100 scale-100 pointer-events-auto visible"
                  : "opacity-0 scale-95 pointer-events-none invisible"
              }`}
              role="listbox"
              aria-label="Majmua bo'limlari ro'yxati"
            >
              <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-accent/80 font-bold block">
                Majmua & Arxitektura
              </span>
              {MAJMUA_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      scrollToHref(e, link.href);
                      setMajmuaOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs uppercase tracking-wider rounded-xl transition-all ${
                      isActive
                        ? "bg-accent/20 text-accent border border-accent/40 font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Select 2: Hudud & Infratuzilma */}
          <div ref={hududRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setHududOpen((prev) => !prev);
                setMajmuaOpen(false);
              }}
              aria-expanded={hududOpen}
              aria-haspopup="listbox"
              aria-label="Hudud va infratuzilma bo'limlari"
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs tracking-wider uppercase font-medium transition-all shadow-md backdrop-blur-md cursor-pointer group ${
                hududOpen || activeHududItem
                  ? "bg-accent/20 border-accent/60 text-accent font-semibold"
                  : "bg-white/10 hover:bg-white/15 border-white/20 hover:border-accent/40 text-white/90 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span className="whitespace-nowrap">
                {activeHududItem ? `Hudud: ${activeHududItem.label}` : "Hudud & Infratuzilma"}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  hududOpen ? "rotate-180 text-accent" : "text-white/60 group-hover:text-accent"
                }`}
              />
            </button>

            {/* Hudud Dropdown Menu */}
            <div
              className={`absolute top-full left-0 mt-2.5 w-60 rounded-2xl bg-[#0e0d0c]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50 flex flex-col gap-1 transition-all duration-200 origin-top ${
                hududOpen
                  ? "opacity-100 scale-100 pointer-events-auto visible"
                  : "opacity-0 scale-95 pointer-events-none invisible"
              }`}
              role="listbox"
              aria-label="Hudud bo'limlari ro'yxati"
            >
              <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-accent/80 font-bold block">
                Hudud & Infratuzilma
              </span>
              {HUDUD_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      scrollToHref(e, link.href);
                      setHududOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs uppercase tracking-wider rounded-xl transition-all ${
                      isActive
                        ? "bg-accent/20 text-accent border border-accent/40 font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section Action: Primary Consultation CTA */}
        <div className="hidden lg:flex items-center shrink-0">
          <a
            href="#contact"
            onClick={(e) => scrollToHref(e, "#contact")}
            className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent-light text-[#0A0908] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/25 hover:shadow-accent/40 hover:scale-105 active:scale-95 text-center whitespace-nowrap shrink-0"
          >
            <span>Bog&apos;lanish</span>
          </a>
        </div>

        {/* Mobile & Tablet hamburger toggle button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menyuni yopish" : "Asosiy menyuni ochish"}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile & Tablet Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden mt-2 mx-auto max-w-7xl glass-nav rounded-2xl p-5 border border-white/15 shadow-2xl pointer-events-auto bg-black/90 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4">
              {/* Group 1: Majmua & Arxitektura */}
              <div className="flex flex-col space-y-1">
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Majmua & Arxitektura
                </span>
                {MAJMUA_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToHref(e, link.href)}
                      className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-colors ${
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/25 font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Group 2: Hudud & Infratuzilma */}
              <div className="flex flex-col space-y-1 pt-2 border-t border-white/10">
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Hudud & Infratuzilma
                </span>
                {HUDUD_LINKS.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToHref(e, link.href)}
                      className={`min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-colors ${
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/25 font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Action Button: Bog'lanish */}
              <div className="pt-3 border-t border-white/10">
                <a
                  href="#contact"
                  onClick={(e) => scrollToHref(e, "#contact")}
                  className="min-h-[46px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-[#0A0908] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/20"
                >
                  <Sparkles size={14} />
                  <span>Bog&apos;lanish</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
