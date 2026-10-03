"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Building2, Sparkles, ChevronDown, Compass, Phone } from "lucide-react";
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

// --- Animated Discrete Tab Button (uselayouts pattern) ---
function NavPillButton({
  label,
  icon: Icon,
  isActive,
  onClick,
  indicator,
}: {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
  isActive: boolean;
  onClick: () => void;
  indicator?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] tracking-widest uppercase font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isActive
          ? "text-[#0A0908]"
          : "text-white/75 hover:text-white"
      }`}
      aria-expanded={isActive}
    >
      {isActive && (
        <motion.span
          layoutId="nav-pill-bg"
          className="absolute inset-0 rounded-full bg-accent"
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {Icon && <Icon size={13} className="shrink-0" />}
        {label}
        {indicator && (
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#0A0908]/70" : "bg-accent"} animate-pulse`} />
        )}
        <motion.span
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          <ChevronDown size={11} />
        </motion.span>
      </span>
    </motion.button>
  );
}

export default function Navbar() {
  const { currentProject } = useProject();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [majmuaOpen, setMajmuaOpen] = useState(false);
  const [hududOpen, setHududOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const majmuaRef = useRef<HTMLDivElement>(null);
  const hududRef = useRef<HTMLDivElement>(null);

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

  const scrollToHrefStr = useCallback(
    (href: string) => {
      setMenuOpen(false);
      setMajmuaOpen(false);
      setHududOpen(false);

      if (href === "#hero") {
        window.__lenis?.scrollTo(0, { duration: 1.2 }) ?? window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const el = document.querySelector(href) as HTMLElement | null;
      if (el) {
        window.__lenis?.scrollTo(el, { duration: 1.2 }) ?? el.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  const activeMajmuaItem = MAJMUA_LINKS.find((item) => item.id === activeSection);
  const activeHududItem = HUDUD_LINKS.find((item) => item.id === activeSection);

  // Dropdown menu content
  const DropdownMenu = ({
    links,
    label,
  }: {
    links: NavLinkItem[];
    label: string;
  }) => (
    <div className="py-2 px-2 flex flex-col gap-0.5">
      <span className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.3em] text-accent/70 font-bold block">
        {label}
      </span>
      {links.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              scrollToHref(e, link.href);
            }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.15 }}
            className={`flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all ${
              isActive
                ? "bg-accent/15 text-accent border border-accent/25 font-bold"
                : "text-white/75 hover:text-white hover:bg-white/8"
            }`}
          >
            <span>{link.label}</span>
            {isActive && (
              <motion.span
                layoutId={`active-dot-${link.id}`}
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
            )}
          </motion.a>
        );
      })}
    </div>
  );

  return (
    <header
      role="banner"
      className="fixed top-0 sm:top-3 inset-x-0 z-50 transition-all duration-300 pointer-events-none px-3 sm:px-6 lg:px-8"
    >
      <motion.nav
        aria-label="Asosiy menyu"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
          aria-label={`${currentProject?.developerName || "Murad Buildings"} Premium Residences - Bosh sahifa`}
          className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-accent/30 via-accent/10 to-transparent border border-accent/40 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.25)]"
          >
            <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-accent" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </motion.div>

          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-base font-bold tracking-[0.14em] uppercase text-white group-hover:text-accent transition-colors leading-tight whitespace-nowrap">
              {currentProject?.developerName || "Murad Buildings"}
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-accent/80 uppercase leading-none mt-0.5 whitespace-nowrap">
              Premium Residences
            </span>
          </div>
        </a>

        {/* Desktop Navigation — discrete-tabs pill pattern */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shrink-0">
          {/* Select 1: Majmua */}
          <div ref={majmuaRef} className="relative">
            <NavPillButton
              label={activeMajmuaItem ? `Majmua: ${activeMajmuaItem.label}` : "Majmua"}
              icon={Building2}
              isActive={majmuaOpen || !!activeMajmuaItem}
              onClick={() => {
                setMajmuaOpen((prev) => !prev);
                setHududOpen(false);
              }}
              indicator={!!activeMajmuaItem}
            />

            <AnimatePresence>
              {majmuaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-2.5 w-60 rounded-2xl bg-[#0e0d0c]/96 backdrop-blur-2xl border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-50 overflow-hidden"
                  role="listbox"
                  aria-label="Majmua bo'limlari"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                  <DropdownMenu links={MAJMUA_LINKS} label="Majmua & Arxitektura" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Select 2: Hudud */}
          <div ref={hududRef} className="relative">
            <NavPillButton
              label={activeHududItem ? `Hudud: ${activeHududItem.label}` : "Hudud"}
              icon={Compass}
              isActive={hududOpen || !!activeHududItem}
              onClick={() => {
                setHududOpen((prev) => !prev);
                setMajmuaOpen(false);
              }}
              indicator={!!activeHududItem}
            />

            <AnimatePresence>
              {hududOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-0 mt-2.5 w-52 rounded-2xl bg-[#0e0d0c]/96 backdrop-blur-2xl border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-50 overflow-hidden"
                  role="listbox"
                  aria-label="Hudud bo'limlari"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                  <DropdownMenu links={HUDUD_LINKS} label="Hudud & Infratuzilma" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <motion.a
            href="tel:+998712007400"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white text-xs font-medium tracking-wide transition-colors"
          >
            <Phone size={12} className="text-accent" />
            <span>+998 71 200 74 00</span>
          </motion.a>
          <motion.a
            href="#contact"
            onClick={(e) => scrollToHref(e, "#contact")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden px-6 py-2.5 rounded-full bg-accent text-[#0A0908] text-xs font-bold uppercase tracking-wider shadow-md shadow-accent/25 btn-shimmer"
          >
            <span className="relative z-10">Bog&apos;lanish</span>
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center">
          <motion.button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.92 }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menyuni yopish" : "Asosiy menyuni ochish"}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-2 mx-auto max-w-7xl glass-nav rounded-2xl p-5 border border-white/15 shadow-2xl pointer-events-auto bg-black/90 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="flex flex-col gap-4">
              {/* Group 1 */}
              <div className="flex flex-col space-y-1">
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Majmua & Arxitektura
                </span>
                {MAJMUA_LINKS.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToHref(e, link.href)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
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
                    </motion.a>
                  );
                })}
              </div>

              {/* Group 2 */}
              <div className="flex flex-col space-y-1 pt-2 border-t border-white/10">
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Hudud & Infratuzilma
                </span>
                {HUDUD_LINKS.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToHref(e, link.href)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i + MAJMUA_LINKS.length) * 0.05, duration: 0.2 }}
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
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="tel:+998712007400"
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm font-medium transition-colors"
                >
                  <Phone size={14} className="text-accent" />
                  <span>+998 71 200 74 00</span>
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollToHref(e, "#contact")}
                  className="min-h-[46px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-[#0A0908] text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/20 btn-shimmer"
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
