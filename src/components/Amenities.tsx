"use client";

import {
  Wifi,
  ShieldCheck,
  Trees,
  Zap,
  ConciergeBell,
  Dumbbell,
  ParkingSquare,
  Waves,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const amenities = [
  {
    icon: Trees,
    title: "Tomdagi terassa",
    description:
      "Panoramik shahar manzarasiga ega bo'lgan ko'kalamzor dam olish maydoni, oqshom sayridan rohatlaning.",
  },
  {
    icon: Zap,
    title: "Elektromobil zaryadlash",
    description:
      "Har bir parking joyida tezkor zaryadlash stansiyalari — kelajak transporti uchun tayyor.",
  },
  {
    icon: ParkingSquare,
    title: "Yopiq parking",
    description:
      "Ko'p qavatli yopiq avtomobil to'xtash joyi, xavfsizlik kameralari va avtomatik kirish tizimi.",
  },
  {
    icon: ConciergeBell,
    title: "Lobbi va konsyerj",
    description:
      "24/7 konsyerj xizmati — mehmonlarni kutib olishdan tortib, har qanday so'rovingizni hal qilishgacha.",
  },
  {
    icon: ShieldCheck,
    title: "Xususiy koridorlar",
    description:
      "Shaxsiy kirish tizimlari va alohida koridorlar — sizning maxfiyligingiz bizning ustuvorligimiz.",
  },
  {
    icon: Dumbbell,
    title: "Sport va salomatlik",
    description:
      "Zamonaviy sport zali, yoga xonasi va SPA markazi — salomatligingiz uchun barcha sharoit.",
  },
  {
    icon: Waves,
    title: "Ochiq basseyn",
    description:
      "Tomdagi basseyn va yonidagi dam olish zonasi — shahar hayotidan qochish uchun mukammal joy.",
  },
  {
    icon: Wifi,
    title: "Aqlli uy tizimi",
    description:
      "Barcha xonadonlarda zamonaviy aqlli uy texnologiyalari — yoritish, harorat va xavfsizlikni boshqaring.",
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 lg:py-36 px-6 bg-background-dark">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-16 bg-accent" />
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
              Qulayliklar
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-16">
            Hayotingiz uchun <span className="text-accent">barcha sharoit</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {amenities.map((amenity, i) => (
            <ScrollReveal key={amenity.title} delay={i * 0.08}>
              <div className="group p-6 lg:p-8 rounded-2xl bg-card border border-card-border hover:border-accent/40 transition-all duration-500 h-full">
                <amenity.icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-accent mb-5 transition-transform duration-500 group-hover:scale-110"
                />
                <h3 className="font-serif text-xl text-foreground mb-3">
                  {amenity.title}
                </h3>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
