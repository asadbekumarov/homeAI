"use client";

import React, { useState, useSyncExternalStore, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  SunMedium,
  Moon,
  RotateCw,
  Compass,
  Building2,
  ArrowRight,
  Maximize2,
  ShieldCheck,
  Trees,
  Car,
  CreditCard,
  X,
  LucideIcon,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useProject } from "@/context/ProjectContext";

export interface Hotspot {
  id: string;
  position: [number, number, number];
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: LucideIcon;
  badge: string;
}

export const XON_SAROY_HOTSPOTS: Hotspot[] = [
  {
    id: "ceiling",
    position: [0, 4.2, 1.2],
    title: "3.1 Metr Shiftlar",
    shortDesc: "Baland shiftlar va panoramik oynalar",
    fullDesc:
      "Har bir xonadonda tabiiy yorug'lik va kenglik bag'ishlovchi 3.1 metrli shiftlar hamda Germaniya texnologiyasidagi akustik vitrajlar.",
    icon: Maximize2,
    badge: "Kenglik",
  },
  {
    id: "parking",
    position: [0, 0.4, 3.2],
    title: "2 Qavatli Avtoturargoh",
    shortDesc: "Yer osti va yer usti zaryadlash stansiyalari",
    fullDesc:
      "Aholi va mehmonlar uchun 2 qavatli keng avtoturargoh, elektroavtomobillar uchun tezkor quvvatlash tizimi va to'g'ridan-to'g'ri liftga chiqish.",
    icon: Car,
    badge: "Qulaylik",
  },
  {
    id: "courtyard",
    position: [-2.2, 0.5, 0.5],
    title: "Eko-Hovli va Park",
    shortDesc: "Avtomobilsiz xavfsiz bolalar maydonchasi",
    fullDesc:
      "1.5 gektardan ortiq ko'kalamzorlashtirilgan sokin hovli, zamonaviy bolalar atraksionlari va sun'iy chimli mini-futbol maydoni.",
    icon: Trees,
    badge: "Ekologiya",
  },
  {
    id: "service",
    position: [1.8, 1.8, 1.8],
    title: "Muhtasham Saroy Servis",
    shortDesc: "24/7 konsyerj va professional qo'riqlash",
    fullDesc:
      "Yopiq hudud, yuzni tanish tizimiga ega domofonlar, 24/7 video-kuzatuv va istalgan maishiy masalani hal qiluvchi xususiy boshqaruv kompaniyasi.",
    icon: ShieldCheck,
    badge: "Xavfsizlik",
  },
  {
    id: "payment",
    position: [0, 2.8, -2.2],
    title: "18–36 Oygacha 0%",
    shortDesc: "Foizsiz muddatli to'lov imtiyozi",
    fullDesc:
      "Boshlang'ich 30% yoki 50% to'lov bilan qolgan summani 36 oygacha foizsiz bo'lib to'lash (rassrochka) imkoniyati.",
    icon: CreditCard,
    badge: "Imtiyoz",
  },
];

// 3D Building Tower component
function BuildingTower({
  position,
  width,
  height,
  depth,
  isNight,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  isNight: boolean;
  label?: string;
}) {
  const facadeColor = isNight ? "#1C2430" : "#D4C8B8";
  const windowColor = isNight ? "#F5D061" : "#557288";
  const glassColor = isNight ? "#EBB844" : "#8DAEC4";

  return (
    <group position={position}>
      {/* Main Facade Concrete Box */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={facadeColor}
          roughness={0.5}
          metalness={isNight ? 0.3 : 0.15}
        />
      </mesh>

      {/* Decorative Bronze Architectural Accent Ribs */}
      <mesh position={[0, height / 2, depth / 2 + 0.02]}>
        <boxGeometry args={[width * 0.9, height * 0.96, 0.03]} />
        <meshStandardMaterial
          color={isNight ? "#C5A059" : "#A67C38"}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Glazed Windows Lattice */}
      <mesh position={[0, height / 2, depth / 2 + 0.04]}>
        <boxGeometry args={[width * 0.78, height * 0.88, 0.01]} />
        <meshStandardMaterial
          color={windowColor}
          emissive={isNight ? glassColor : "#000000"}
          emissiveIntensity={isNight ? 0.75 : 0}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Rooftop Sky Lounge / Crown Pergola */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width * 0.92, 0.3, depth * 0.92]} />
        <meshStandardMaterial
          color={isNight ? "#C5A059" : "#8C7142"}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

// 3D Scene Complex
function XonSaroyScene({
  isNight,
  autoRotate,
  activeHotspotId,
  onSelectHotspot,
}: {
  isNight: boolean;
  autoRotate: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: Hotspot) => void;
}) {
  return (
    <>
      {/* Dynamic Architectural Lighting */}
      <ambientLight intensity={isNight ? 0.45 : 1.1} />
      <directionalLight
        position={isNight ? [8, 12, -6] : [12, 18, 10]}
        intensity={isNight ? 0.6 : 1.8}
        castShadow
        color={isNight ? "#8AA4D6" : "#FFF7EB"}
      />
      {isNight && (
        <>
          <pointLight position={[0, 4, 3]} intensity={2.5} color="#F5C04A" distance={8} />
          <pointLight position={[-3, 1, 0]} intensity={1.8} color="#45A29E" distance={6} />
          <pointLight position={[3, 1, -2]} intensity={1.8} color="#F5C04A" distance={6} />
        </>
      )}

      {/* Ground & Landscaped Podium */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7.2, 0.2, 32]} />
        <meshStandardMaterial
          color={isNight ? "#11141A" : "#ECE7DE"}
          roughness={0.8}
        />
      </mesh>

      {/* Central Courtyard & Park Garden */}
      <mesh position={[-0.2, 0.08, 0.4]}>
        <boxGeometry args={[3.2, 0.1, 2.4]} />
        <meshStandardMaterial
          color={isNight ? "#172A1C" : "#5B8C5A"}
          roughness={0.9}
        />
      </mesh>

      {/* Commercial Podium (1st to 3rd floors) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 0.8, 4.4]} />
        <meshStandardMaterial
          color={isNight ? "#1A222D" : "#BAAEA0"}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* 4 Architectural Towers (Blok A, B, C, D) */}
      <BuildingTower
        label="Blok A"
        position={[-1.6, 0.8, 1.2]}
        width={1.4}
        height={3.8}
        depth={1.4}
        isNight={isNight}
      />
      <BuildingTower
        label="Blok B (Dominanta)"
        position={[0.2, 0.8, 1.0]}
        width={1.6}
        height={4.8}
        depth={1.6}
        isNight={isNight}
      />
      <BuildingTower
        label="Blok C"
        position={[1.8, 0.8, -0.8]}
        width={1.4}
        height={4.2}
        depth={1.4}
        isNight={isNight}
      />
      <BuildingTower
        label="Blok D"
        position={[-1.4, 0.8, -1.2]}
        width={1.4}
        height={3.6}
        depth={1.4}
        isNight={isNight}
      />

      {/* Interactive 3D Hotspot Pins (3D glowing markers without nested React roots) */}
      {XON_SAROY_HOTSPOTS.map((hotspot) => {
        const isActive = activeHotspotId === hotspot.id;

        return (
          <group key={hotspot.id} position={hotspot.position}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(hotspot);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[isActive ? 0.22 : 0.16, 16, 16]} />
              <meshStandardMaterial
                color={isActive ? "#D4AF37" : "#E5A93C"}
                emissive={isActive ? "#D4AF37" : "#C49726"}
                emissiveIntensity={isActive ? 1.4 : 0.6}
              />
            </mesh>
          </group>
        );
      })}

      {/* Camera & Orbit Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        enableDamping
        dampingFactor={0.06}
        minDistance={5}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

export default function XonSaroy3DShowcase() {
  const { currentProject } = useProject();
  const [isNight, setIsNight] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(
    XON_SAROY_HOTSPOTS[0]
  );
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <section
      id="interactive-3d"
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-[#0A0908] relative overflow-hidden"
    >
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-accent" />
                <span className="text-xs tracking-[0.25em] uppercase text-accent font-semibold">
                  {currentProject?.projectName || "Xon Saroy — Orzular"} · 3D Reklama Tur
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight">
                Binolarni <span className="text-gradient-gold italic font-medium">3D formatda</span> o&apos;rganing
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-foreground-muted mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
                Minoralar joylashuvi, shahar panoramasi va majmuaning barcha qulayliklarini
                real vaqt rejimida 360° aylantirib ko&apos;ring.
              </p>
            </ScrollReveal>
          </div>

          {/* Quick HUD Controls */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel-luxury shadow-xl">
              {/* Day / Night toggle */}
              <button
                type="button"
                onClick={() => setIsNight(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  !isNight
                    ? "bg-accent text-[#0C0B0A] shadow-md shadow-accent/25"
                    : "text-foreground-muted hover:text-foreground"
                }`}
                aria-label="Kunduzgi yoritish"
              >
                <SunMedium className="w-3.5 h-3.5" />
                <span>Kunduzgi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNight(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isNight
                    ? "bg-accent text-[#0C0B0A] shadow-md shadow-accent/25"
                    : "text-foreground-muted hover:text-foreground"
                }`}
                aria-label="Tungi arxitektura"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Tungi</span>
              </button>

              <span className="w-px h-4 bg-divider/60 mx-1" />

              {/* Auto rotate toggle */}
              <button
                type="button"
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  autoRotate
                    ? "bg-white/15 text-white"
                    : "text-foreground-muted hover:text-foreground"
                }`}
                aria-label={autoRotate ? "Avto-aylanishni to'xtatish" : "Avto-aylanishni yoqish"}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
                <span>Aylanish</span>
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* 3D Canvas Showcase Viewport */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] w-full rounded-3xl overflow-hidden border border-card-border bg-[#0B0F14] shadow-2xl">
          {isMounted ? (
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-accent text-sm font-mono">
                  3D Bino Modeli yuklanmoqda...
                </div>
              }
            >
              <Canvas
                shadows
                camera={{ position: [7, 5, 8], fov: 42 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
              >
                <color attach="background" args={[isNight ? "#080B10" : "#DCD5CA"]} />
                <fog attach="fog" args={[isNight ? "#080B10" : "#DCD5CA", 10, 24]} />
                <XonSaroyScene
                  isNight={isNight}
                  autoRotate={autoRotate}
                  activeHotspotId={selectedHotspot?.id || null}
                  onSelectHotspot={(h) => setSelectedHotspot(h)}
                />
              </Canvas>
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted text-sm">
              3D Modellashtirish yuklanmoqda...
            </div>
          )}

          {/* Floating Instructions Pill */}
          <div className="absolute top-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span>Sichqoncha yoki barmoq bilan 360° aylantiring</span>
          </div>

          {/* Interactive Floating Hotspots Navigation Pill Bar */}
          <div className="absolute top-4 right-4 z-20 flex flex-wrap max-w-sm sm:max-w-md justify-end gap-1.5 pointer-events-auto">
            {XON_SAROY_HOTSPOTS.map((hotspot) => {
              const isActive = selectedHotspot?.id === hotspot.id;
              const Icon = hotspot.icon;

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setSelectedHotspot(hotspot)}
                  aria-label={hotspot.title}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-xl backdrop-blur-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-[#0C0B0A] border-accent ring-2 ring-accent/30 font-semibold scale-105"
                      : "bg-black/75 text-white/90 border-white/20 hover:border-accent hover:text-accent"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" aria-hidden="true" />
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                  <span>{hotspot.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Hotspot Advertising Drawer / Card */}
          {selectedHotspot && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md glass-panel-luxury p-5 sm:p-6 rounded-2xl shadow-2xl text-left border border-accent/40 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold px-2 py-0.5 rounded bg-accent/15 border border-accent/30">
                  {selectedHotspot.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Tafsilotni yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-white text-base sm:text-lg font-serif font-semibold mb-1">
                {selectedHotspot.title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4">
                {selectedHotspot.fullDesc}
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="#apartments"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-[#0C0B0A] font-semibold text-xs hover:bg-accent-light transition-all shadow-lg shadow-accent/25 btn-shimmer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Kvartiralar narxi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/10"
                >
                  <span>Bron qilish</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Highlights Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Majmua ko'lami", value: "14 ta blok" },
            { label: "Shift balandligi", value: "3.1 metr" },
            { label: "Avtoturargoh", value: "2 qavatli" },
            { label: "Muddatli to'lov", value: "36 oygacha 0%" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-2xl bg-card border border-card-border/80 text-center sm:text-left"
            >
              <div className="text-xs text-foreground-muted uppercase tracking-wider">
                {item.label}
              </div>
              <div className="font-serif text-xl sm:text-2xl text-foreground font-semibold mt-1">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
