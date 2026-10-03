// Server Component — "use client" yo'q!
// Og'ir komponentlar faqat lazim bo'lganda yuklanadi (dynamic import).

import { Suspense } from "react";
import dynamic from "next/dynamic";

// ssr: false bo'lgan komponentlar — Client Component wrapper orqali
import {
  XonSaroy3DShowcase,
  SmoothScroll,
  MobileQuickBar,
} from "@/components/ClientOnlyDynamic";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import { ProjectProvider } from "@/context/ProjectContext";

// --- Dynamic (lazy) imports — og'ir komponentlar ---

// BuildingExplorer (32 KB) — viewport'ga yetganda yuklanadi
const BuildingExplorer = dynamic(
  () => import("@/components/BuildingExplorer"),
  {
    loading: () => (
      <div className="py-24 min-h-[600px] bg-background animate-pulse" aria-hidden="true" />
    ),
  }
);

// MortgageCalculator (19 KB) — lazy
const MortgageCalculator = dynamic(
  () => import("@/components/MortgageCalculator"),
  {
    loading: () => (
      <div className="py-24 min-h-[400px] bg-background animate-pulse" aria-hidden="true" />
    ),
  }
);

// Gallery (19 KB) — rasmlari bilan birga lazy
const Gallery = dynamic(
  () => import("@/components/Gallery"),
  {
    loading: () => (
      <div className="py-24 min-h-[500px] bg-background animate-pulse" aria-hidden="true" />
    ),
  }
);

// Contact forma (14 KB) — lazy
const Contact = dynamic(
  () => import("@/components/Contact"),
  {
    loading: () => (
      <div className="py-24 min-h-[400px] bg-background animate-pulse" aria-hidden="true" />
    ),
  }
);

export default function Home() {
  return (
    <ProjectProvider>
      <SmoothScroll>
        <Navbar />
        <main id="main-content" className="relative bg-background">
          {/* LCP elementi — eager, hech qanday lazy yo'q */}
          <HeroSection />
          {/* Above-the-fold bo'lmagan komponentlar — Suspense bilan */}
          <About />
          <Suspense fallback={<div className="py-20 min-h-[400px]" />}>
            <XonSaroy3DShowcase />
          </Suspense>
          <BuildingExplorer />
          <MortgageCalculator />
          <Gallery />
          <Amenities />
          <Location />
          <Contact />
        </main>
        <Footer />
        <MobileQuickBar />
      </SmoothScroll>
    </ProjectProvider>
  );
}
