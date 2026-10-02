"use client";

import { MapPin, Navigation } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useProject } from "@/context/ProjectContext";

export default function Location() {
  const { currentProject } = useProject();

  return (
    <section id="location" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-16 bg-accent" />
                <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
                  Joylashuv
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
                Shahar <span className="text-accent">markazida</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-foreground-muted text-lg leading-relaxed mb-8">
                {currentProject?.projectName || "Xon Saroy — Orzular"} majmuasi Toshkent shahrining nufuzli va qulay hududlaridan
                birida joylashgan. Yaqin atrofda yirik savdo markazlari, ta&apos;lim muassasalari,
                bog&apos;lar va qulay transport tarmoqlari mavjud.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-foreground font-medium mb-1">Manzil</p>
                    <p className="text-foreground-muted text-sm">
                      {currentProject?.address || "Toshkent shahri"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Navigation size={20} className="text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      Asosiy mo&apos;ljallar va masofa
                    </p>
                    <p className="text-foreground-muted text-sm leading-relaxed">
                      Metro 3-bekati — 650 m (8 daqiqa) · &quot;Oltin Kalitcha&quot; bog‘chasi — 250 m (3 daqiqa) · 
                      255-sonli umumta&apos;lim maktabi — 300 m (4 daqiqa) · Katta halqa yo‘li bo‘yida
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Map */}
          <ScrollReveal delay={0.2} direction="right">
            <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-card-border shadow-2xl bg-background-dark">
              {/* Styled map frame */}
              <iframe
                title="Xon Saroy — Orzular Joylashuvi"
                src="https://www.openstreetmap.org/export/embed.html?bbox=69.260%2C41.350%2C69.310%2C41.385&layer=mapnik&marker=41.3680%2C69.2880"
                className="w-full h-full border-0 filter invert-[0.92] hue-rotate-180 contrast-[1.15] opacity-85 transition-opacity duration-300 hover:opacity-100"
                loading="lazy"
              />

              {/* Luxury Floating Card */}
              <div className="absolute top-4 left-4 right-4 md:right-auto md:max-w-xs bg-background-dark/90 backdrop-blur-md p-4 rounded-xl border border-card-border shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm font-semibold">
                      {currentProject?.projectName || "Xon Saroy — Orzular"}
                    </h4>
                    <p className="text-foreground-muted text-xs">
                      Yunusobod t., Katta halqa yo‘li bo‘yi
                    </p>
                  </div>
                </div>
              </div>

              {/* External map buttons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <a
                  href="https://maps.google.com/?q=41.3680,69.2880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-background-dark/90 hover:bg-accent hover:text-white transition-colors duration-200 text-foreground-muted text-xs border border-card-border backdrop-blur-sm"
                >
                  Google Maps
                </a>
                <a
                  href="https://yandex.com/maps/?pt=69.2880,41.3680&z=15&l=map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-background-dark/90 hover:bg-accent hover:text-white transition-colors duration-200 text-foreground-muted text-xs border border-card-border backdrop-blur-sm"
                >
                  Yandex Maps
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
