"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Globe } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { cn } from "@/lib/cn";
import { useProject } from "@/context/ProjectContext";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function formatUzbekPhone(value: string): string {
  // Strip all non-digits
  let digits = value.replace(/\D/g, "");

  // If user enters 998 prefix, remove it to work with remaining 9 digits
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  // Max 9 digits (operator code + number)
  digits = digits.slice(0, 9);

  if (digits.length === 0) return "";

  let result = "+998";
  if (digits.length > 0) {
    result += ` (${digits.slice(0, 2)}`;
  }
  if (digits.length >= 2) {
    result += `) ${digits.slice(2, 5)}`;
  }
  if (digits.length >= 5) {
    result += `-${digits.slice(5, 7)}`;
  }
  if (digits.length >= 7) {
    result += `-${digits.slice(7, 9)}`;
  }

  return result;
}

const contactSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z
    .string()
    .min(1, "Telefon raqamini kiriting")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        // Must have exactly 9 digits or 12 digits (with 998)
        return digits.length === 9 || (digits.startsWith("998") && digits.length === 12);
      },
      { message: "Telefon raqamini to'liq kiriting: +998 (XX) XXX-XX-XX" }
    ),
  email: z.string().email("Email manzil noto'g'ri"),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { currentProject } = useProject();
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      label: "Call-markaz (24/7)",
      value: currentProject?.phone || "+998 (71) 200-74-00",
      href: `tel:${(currentProject?.phone || "+998712007400").replace(/\D/g, "")}`,
    },
    {
      icon: Mail,
      label: "Rasmiy Email",
      value: currentProject?.email || "info@xonsaroy.uz",
      href: `mailto:${currentProject?.email || "info@xonsaroy.uz"}`,
    },
    {
      icon: MapPin,
      label: "Sotuv ofisi manzili",
      value: currentProject?.address || "Toshkent sh., Yunusobod t., Katta halqa yo‘li bo‘yi",
    },
    {
      icon: Clock,
      label: "Ish tartibi",
      value: "Har kuni 24/7 yagona call-markaz",
    },
  ];

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setSubmitted(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const phoneRegistration = register("phone");

  const onSubmit = async () => {
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    reset();
  };

  return (
    <section id="contact" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background-dark">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-16 bg-accent" />
            <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
              Aloqa
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-16">
            Biz bilan <span className="text-accent">bog&apos;laning</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <ScrollReveal delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="contact-name" className="block text-sm text-foreground-muted tracking-wide font-medium">
                  Ismingiz
                </label>
                <input
                  id="contact-name"
                  type="text"
                  {...register("name")}
                  placeholder="To'liq ismingiz"
                  className={cn(
                    "w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none transition-colors duration-200",
                    errors.name
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                      : "border-card-border focus:border-accent"
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="contact-phone" className="block text-sm text-foreground-muted tracking-wide font-medium">
                  Telefon
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  {...phoneRegistration}
                  onChange={(e) => {
                    e.target.value = formatUzbekPhone(e.target.value);
                    phoneRegistration.onChange(e);
                  }}
                  placeholder="+998 (90) 123-45-67"
                  className={cn(
                    "w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none transition-colors duration-200 font-mono text-sm",
                    errors.phone
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                      : "border-card-border focus:border-accent"
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block text-sm text-foreground-muted tracking-wide font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register("email")}
                  placeholder="sizning@email.uz"
                  className={cn(
                    "w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none transition-colors duration-200",
                    errors.email
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                      : "border-card-border focus:border-accent"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="contact-message" className="block text-sm text-foreground-muted tracking-wide font-medium">
                  Xabaringiz
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  {...register("message")}
                  placeholder="Qiziqtirgan savol yoki taklifingiz..."
                  className={cn(
                    "w-full px-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none transition-colors duration-200 resize-none",
                    errors.message
                      ? "border-red-400 focus:border-red-500 ring-1 ring-red-400/30"
                      : "border-card-border focus:border-accent"
                  )}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <div aria-live="polite" role="status">
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="group flex items-center gap-3 px-8 py-3.5 bg-accent hover:bg-accent-light text-[#0A0908] font-bold rounded-xl transition-all duration-300 disabled:opacity-60 cursor-pointer shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={18} className="text-emerald-300" />
                      <span className="text-sm tracking-wide font-medium">Yuborildi! Tez orada bog&apos;lanamiz</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      <span className="text-sm tracking-wide font-medium">
                        {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </ScrollReveal>

          {/* Contact info */}
          <ScrollReveal delay={0.3} direction="right">
            <div className="space-y-8 lg:pl-8">
              <p className="text-foreground-muted leading-relaxed">
                Loyihamiz haqida batafsil ma&apos;lumot olish, xonadonlar narxi va
                ko&apos;rish uchun biz bilan bog&apos;laning. Mutaxassislarimiz sizga
                yordam berishdan xursand bo&apos;ladi.
              </p>

              {/* Direct messengers and social links */}
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://t.me/XonSaroy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#2AABEE]/15 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white border border-[#2AABEE]/30 text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  <Send size={15} />
                  <span>Telegram (@XonSaroy)</span>
                </a>
                <a
                  href="https://www.instagram.com/xonsaroyuz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#E1306C]/15 hover:bg-[#E1306C] text-[#E1306C] hover:text-white border border-[#E1306C]/30 text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  <InstagramIcon size={15} />
                  <span>Instagram (@xonsaroyuz)</span>
                </a>
                <a
                  href="https://xonsaroy.uz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-accent/15 hover:bg-accent text-accent hover:text-[#0C0B0A] border border-accent/30 text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  <Globe size={15} />
                  <span>xonsaroy.uz</span>
                </a>
              </div>

              <div className="space-y-4 pt-4 border-t border-divider">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border/60 hover:border-accent/40 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                      <info.icon size={18} />
                    </div>
                    <div>
                      <p className="text-foreground text-xs uppercase tracking-widest font-semibold mb-1 text-accent">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-foreground text-sm font-medium hover:text-accent transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-foreground text-sm font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
