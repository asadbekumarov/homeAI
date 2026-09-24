"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const contactSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqam noto'g'ri"),
  email: z.string().email("Email manzil noto'g'ri"),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    label: "Telefon",
    value: "+998 90 123 45 67",
    href: "tel:+998901234567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@thepalisades.uz",
    href: "mailto:info@thepalisades.uz",
  },
  {
    icon: MapPin,
    label: "Manzil",
    value: "Toshkent sh., Yunusobod tumani, Bog'ishamol ko'chasi, 12-uy",
  },
  {
    icon: Clock,
    label: "Ish vaqti",
    value: "Har kuni 09:00 - 19:00",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Form submitted:", data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 lg:py-36 px-6 bg-background-dark">
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
              <div>
                <label htmlFor="contact-name" className="block text-sm text-foreground-muted mb-2 tracking-wide">
                  Ismingiz
                </label>
                <input
                  id="contact-name"
                  type="text"
                  {...register("name")}
                  placeholder="To'liq ismingiz"
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-accent transition-colors duration-300"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="contact-phone" className="block text-sm text-foreground-muted mb-2 tracking-wide">
                  Telefon
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-accent transition-colors duration-300"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="contact-email" className="block text-sm text-foreground-muted mb-2 tracking-wide">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  {...register("email")}
                  placeholder="sizning@email.uz"
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-accent transition-colors duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm text-foreground-muted mb-2 tracking-wide">
                  Xabaringiz
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  {...register("message")}
                  placeholder="Qiziqtirgan savol yoki taklifingiz..."
                  className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted/40 focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center gap-3 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-lg transition-all duration-300 disabled:opacity-60"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span className="text-sm tracking-wide">Yuborildi!</span>
                  </>
                ) : (
                  <>
                    <Send size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    <span className="text-sm tracking-wide">
                      {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                    </span>
                  </>
                )}
              </button>
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

              {/* Direct messengers */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://t.me/thepalisades_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#2AABEE]/15 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white border border-[#2AABEE]/30 text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  <span>Telegram orqali yozish</span>
                </a>
                <a
                  href="https://wa.me/998901234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  <span>WhatsApp</span>
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
