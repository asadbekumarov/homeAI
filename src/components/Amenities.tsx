"use client";

import {
  ShieldCheck,
  Trees,
  Zap,
  ConciergeBell,
  ParkingSquare,
  ShoppingBag,
  Maximize,
  ArrowUpCircle,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const amenities = [
  {
    icon: ParkingSquare,
    title: "2 qavatli avtoturargoh",
    description:
      "2 qavatli keng yer osti va yer usti avtoturargohi hamda elektroavtomobillarni zaryadlash stansiyalari.",
  },
  {
    icon: Trees,
    title: "Bolalar va sport zonalari",
    description:
      "Ekologik yashil hovli, zamonaviy bolalar o‘yin maydonchalari va sun'iy qoplamali professional futbol maydoni.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Xavfsizlik tizimi",
    description:
      "24/7 uzluksiz video nazorat, professional qo‘riqlash xizmati va begonalardan himoyalangan yopiq hovli tizimi.",
  },
  {
    icon: ShoppingBag,
    title: "Tijorat zonalari (3 qavat)",
    description:
      "Binoning pastki 3 qavatida aholi uchun maishiy xizmat ko‘rsatish shoxobchalari, kafelar va do‘konlar.",
  },
  {
    icon: Maximize,
    title: "3.1 Metr baland shiftlar",
    description:
      "Xonadonlarda kenglik va yorug'lik hissini kuchaytiruvchi 3.1 metrli shiftlar va panoramik oynalar.",
  },
  {
    icon: ConciergeBell,
    title: "Muhtasham Saroy Servis",
    description:
      "Aholi va mehmonlar uchun 24/7 konsyerj xizmati, qabul lobbisi va maishiy masalalarni tezkor hal qilish.",
  },
  {
    icon: ArrowUpCircle,
    title: "Tezyurar shovqinsiz liftlar",
    description:
      "Har bir blokda eng zamonaviy shovqinsiz liftlar — yer osti avtoturargohiga to'g'ridan-to'g'ri chiqish bilan.",
  },
  {
    icon: Zap,
    title: "Elektromobil zaryadlash",
    description:
      "Ekologik transport egalari uchun avtoturargohda maxsus tezkor quvvatlash uskunalari o'rnatilgan.",
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background-dark">
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
            <ScrollReveal key={amenity.title} delay={i * 0.06}>
              <div className="group p-7 lg:p-8 rounded-2xl bg-card border border-card-border/80 hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    <amenity.icon
                      size={22}
                      strokeWidth={1.75}
                      className="text-accent group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-foreground font-semibold mb-3 group-hover:text-accent transition-colors">
                    {amenity.title}
                  </h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">
                    {amenity.description}
                  </p>
                </div>
                <div className="w-6 h-0.5 bg-accent/30 mt-6 group-hover:w-12 group-hover:bg-accent transition-all duration-300" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
