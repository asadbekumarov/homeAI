"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Image, LayoutGrid, Phone, LucideIcon } from "lucide-react";

export interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MOBILE_QUICK_ACTIONS: MobileNavItem[] = [
  { id: "3d", label: "3D Bino", href: "#interactive-3d", icon: Building2 },
  { id: "gallery", label: "Galereya", href: "#gallery", icon: Image },
  { id: "apartments", label: "Kvartiralar", href: "#apartments", icon: LayoutGrid },
  { id: "contact", label: "Aloqa", href: "#contact", icon: Phone },
];

export default function MobileQuickBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState<string>("3d");

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string, href: string) => {
    setActiveItem(id);
    const target = document.querySelector(href);
    if (target) {
      if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
        window.__lenis.scrollTo(target as HTMLElement, { duration: 1.0 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          aria-label="Mobil tezkor harakat paneli"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="fixed bottom-4 left-4 right-4 z-40 lg:hidden flex justify-center pointer-events-none"
        >
          <nav className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-2xl glass-panel-luxury shadow-2xl max-w-sm w-full relative overflow-hidden">
            {/* Top shimmer */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

            {MOBILE_QUICK_ACTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item.id, item.href);
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 text-center relative"
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.span
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 rounded-xl bg-accent/15 border border-accent/25"
                      transition={{ type: "spring", damping: 22, stiffness: 260 }}
                    />
                  )}
                  <motion.div
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative z-10"
                  >
                    <Icon
                      className={`w-4 h-4 mb-0.5 transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-foreground-muted"
                      }`}
                      aria-hidden="true"
                    />
                  </motion.div>
                  <span
                    className={`text-[10px] tracking-tight relative z-10 transition-colors duration-200 ${
                      isActive ? "text-accent font-semibold" : "text-foreground-dim"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
