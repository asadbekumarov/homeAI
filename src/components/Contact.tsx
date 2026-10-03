"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Globe, Loader2 } from "lucide-react";
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
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  if (digits.length === 0) return "";
  let result = "+998";
  if (digits.length > 0) result += ` (${digits.slice(0, 2)}`;
  if (digits.length >= 2) result += `) ${digits.slice(2, 5)}`;
  if (digits.length >= 5) result += `-${digits.slice(5, 7)}`;
  if (digits.length >= 7) result += `-${digits.slice(7, 9)}`;
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
        return digits.length === 9 || (digits.startsWith("998") && digits.length === 12);
      },
      { message: "Telefon raqamini to'liq kiriting: +998 (XX) XXX-XX-XX" }
    ),
  email: z.string().email("Email manzil noto'g'ri"),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Animated input field component
function FormField({
  id,
  label,
  error,
  children,
  delay = 0,
  isInView,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  delay?: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-2"
    >
      <label
        htmlFor={id}
        className="block text-xs text-foreground-muted tracking-[0.15em] uppercase font-semibold"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
            className="text-red-400 text-xs font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Contact() {
  const { currentProject } = useProject();
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-60px" });
  const isInfoInView = useInView(infoRef, { once: true, margin: "-60px" });
  const isTitleInView = useInView(sectionRef, { once: true, margin: "-80px" });

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
      value:
        currentProject?.address ||
        "Toshkent sh., Yunusobod t., Katta halqa yo'li bo'yi",
    },
    {
      icon: Clock,
      label: "Ish tartibi",
      value: "Har kuni 24/7 yagona call-markaz",
    },
  ];

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 4000);
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
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    reset();
  };

  const inputBase =
    "w-full px-4 py-3.5 bg-card border rounded-xl text-foreground placeholder:text-foreground-dim/60 focus:outline-none transition-all duration-300 text-sm";
  const inputNormal = "border-card-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(197,160,89,0.1)]";
  const inputError = "border-red-400/60 focus:border-red-500 shadow-[0_0_0_3px_rgba(248,113,113,0.1)]";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-background-dark relative overflow-hidden"
    >
      {/* BG glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(197,160,89,0.04) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isTitleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-px flex-1 max-w-16 bg-accent origin-left"
          />
          <span className="text-xs tracking-[0.3em] uppercase text-accent font-medium">
            Aloqa
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-16"
        >
          Biz bilan{" "}
          <span className="text-gradient-gold">bog&apos;laning</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div ref={formRef}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField id="contact-name" label="Ismingiz" error={errors.name?.message} delay={0.1} isInView={isFormInView}>
                <input
                  id="contact-name"
                  type="text"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name")}
                  placeholder="To'liq ismingiz"
                  className={cn(inputBase, errors.name ? inputError : inputNormal)}
                />
              </FormField>

              <FormField id="contact-phone" label="Telefon" error={errors.phone?.message} delay={0.17} isInView={isFormInView}>
                <input
                  id="contact-phone"
                  type="tel"
                  aria-invalid={errors.phone ? "true" : "false"}
                  {...phoneRegistration}
                  onChange={(e) => {
                    e.target.value = formatUzbekPhone(e.target.value);
                    phoneRegistration.onChange(e);
                  }}
                  placeholder="+998 (90) 123-45-67"
                  className={cn(inputBase, "font-mono", errors.phone ? inputError : inputNormal)}
                />
              </FormField>

              <FormField id="contact-email" label="Email" error={errors.email?.message} delay={0.24} isInView={isFormInView}>
                <input
                  id="contact-email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                  placeholder="sizning@email.uz"
                  className={cn(inputBase, errors.email ? inputError : inputNormal)}
                />
              </FormField>

              <FormField id="contact-message" label="Xabaringiz" error={errors.message?.message} delay={0.31} isInView={isFormInView}>
                <textarea
                  id="contact-message"
                  rows={4}
                  aria-invalid={errors.message ? "true" : "false"}
                  {...register("message")}
                  placeholder="Qiziqtirgan savol yoki taklifingiz..."
                  className={cn(inputBase, "resize-none", errors.message ? inputError : inputNormal)}
                />
              </FormField>

              {/* Submit button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.4 }}
                aria-live="polite"
                role="status"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  whileHover={!isSubmitting && !submitted ? { scale: 1.03, y: -2 } : {}}
                  whileTap={!isSubmitting && !submitted ? { scale: 0.97 } : {}}
                  className="relative group flex items-center gap-3 px-8 py-3.5 bg-accent hover:bg-accent-light text-[#0A0908] font-bold rounded-xl transition-colors duration-300 disabled:opacity-60 cursor-pointer shadow-lg shadow-accent/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 overflow-hidden btn-shimmer"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {submitted ? (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="flex items-center gap-2.5"
                      >
                        <CheckCircle2 size={18} className="text-emerald-700" />
                        <span className="text-sm tracking-wide">Yuborildi! Tez orada bog&apos;lanamiz</span>
                      </motion.span>
                    ) : isSubmitting ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2.5"
                      >
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Yuborilmoqda...</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2.5"
                      >
                        <Send size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        <span className="text-sm tracking-wide font-medium">Yuborish</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>
          </div>

          {/* Info panel */}
          <div ref={infoRef} className="space-y-8 lg:pl-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-foreground-muted leading-relaxed"
            >
              Loyihamiz haqida batafsil ma&apos;lumot olish, xonadonlar narxi va
              ko&apos;rish uchun biz bilan bog&apos;laning. Mutaxassislarimiz
              sizga yordam berishdan xursand bo&apos;ladi.
            </motion.p>

            {/* Social / messenger links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="flex flex-wrap gap-2.5"
            >
              {[
                {
                  href: "https://t.me/XonSaroy",
                  icon: <Send size={14} />,
                  label: "Telegram",
                  style: "bg-[#2AABEE]/15 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white border-[#2AABEE]/30",
                },
                {
                  href: "https://www.instagram.com/xonsaroyuz/",
                  icon: <InstagramIcon size={14} />,
                  label: "Instagram",
                  style: "bg-[#E1306C]/15 hover:bg-[#E1306C] text-[#E1306C] hover:text-white border-[#E1306C]/30",
                },
                {
                  href: "https://xonsaroy.uz/",
                  icon: <Globe size={14} />,
                  label: "xonsaroy.uz",
                  style: "bg-accent/15 hover:bg-accent text-accent hover:text-[#0C0B0A] border-accent/30",
                },
              ].map((btn, i) => (
                <motion.a
                  key={btn.label}
                  href={btn.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInfoInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 ${btn.style}`}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Contact info cards */}
            <div className="space-y-3 pt-2 border-t border-divider">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInfoInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-card-border/60 hover:border-accent/35 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-default"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0"
                  >
                    <info.icon size={18} />
                  </motion.div>
                  <div>
                    <p className="text-accent text-[10px] uppercase tracking-widest font-bold mb-0.5">
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
