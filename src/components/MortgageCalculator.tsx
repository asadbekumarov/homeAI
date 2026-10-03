"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Percent,
  Calendar,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { useProject } from "@/context/ProjectContext";
import {
  calculateInstallment,
  calculateMortgage,
  generateAmortizationSchedule,
  formatCurrency,
} from "@/lib/mortgageCalculator";
import { CalculatorMode, Currency } from "@/types/calculator";

export default function MortgageCalculator() {
  const { currentProject } = useProject();

  const [mode, setMode] = useState<CalculatorMode>("installment");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [price, setPrice] = useState<number>(85000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentMonths, setInstallmentMonths] = useState<number>(24);
  const [mortgageYears, setMortgageYears] = useState<number>(15);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Calculation memo
  const calculation = useMemo(() => {
    if (mode === "installment") {
      return calculateInstallment({
        price,
        downPaymentPercent,
        months: installmentMonths,
      });
    }
    return calculateMortgage({
      price,
      downPaymentPercent,
      years: mortgageYears,
      annualRate: 18,
    });
  }, [mode, price, downPaymentPercent, installmentMonths, mortgageYears]);

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(calculation, 12);
  }, [calculation]);

  const quickPercentages = [20, 30, 50];
  const quickMonths = [12, 18, 24, 30, 36];
  const quickYears = [10, 15, 20];

  return (
    <section
      id="calculator"
      className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-10 bg-[#0A0908] relative overflow-hidden"
    >
      {/* Background glow decorations */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              <Calculator className="w-3.5 h-3.5" />
              <span>
                {currentProject?.projectName || "Xon Saroy"} · Moliyaviy
                Hisoblagich
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight">
              Ipoteka va{" "}
              <span className="text-gradient-gold italic font-medium">
                0% Rassrochka
              </span>{" "}
              kalkulyatori
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-foreground-muted mt-3 text-sm sm:text-base leading-relaxed">
              Orzuingizdagi xonadon uchun oylik to&apos;lov, boshlang&apos;ich
              badal va eng maqbul moliyaviy muddatni hisoblang.
            </p>
          </ScrollReveal>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 glass-panel-luxury p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            {/* Mode & Currency Switcher Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border/60">
              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-card-border/60" role="group" aria-label="Hisoblash rejimi">
                <button
                  type="button"
                  onClick={() => setMode("installment")}
                  aria-pressed={mode === "installment"}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    mode === "installment"
                      ? "bg-accent text-[#0C0B0A] font-semibold shadow-lg shadow-accent/20"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>0% Rassrochka</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("mortgage")}
                  aria-pressed={mode === "mortgage"}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    mode === "mortgage"
                      ? "bg-accent text-[#0C0B0A] font-semibold shadow-lg shadow-accent/20"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bank Ipotekasi</span>
                </button>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-card-border/40 text-xs" role="group" aria-label="Valyuta tanlash">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  aria-pressed={currency === "USD"}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currency === "USD"
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("UZS")}
                  aria-pressed={currency === "UZS"}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currency === "UZS"
                      ? "bg-white/15 text-accent font-semibold"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  UZS (so&apos;m)
                </button>
              </div>
            </div>

            {/* Price Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="price-input"
                  className="text-xs uppercase tracking-wider text-foreground-muted font-medium flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-accent" />
                  <span>Kvartira narxi</span>
                </label>
                <span className="text-base sm:text-lg font-semibold text-accent font-mono">
                  {formatCurrency(price, currency)}
                </span>
              </div>

              <input
                id="price-input"
                type="range"
                min={35000}
                max={250000}
                step={1000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 bg-card-border/60 rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-[11px] text-foreground-muted mt-1 font-mono">
                <span>$35,000</span>
                <span>$250,000</span>
              </div>
            </div>

            {/* Down Payment Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="down-payment-input"
                  className="text-xs uppercase tracking-wider text-foreground-muted font-medium flex items-center gap-1.5"
                >
                  <Percent className="w-3.5 h-3.5 text-accent" />
                  <span>Boshlang&apos;ich to&apos;lov</span>
                </label>
                <div className="text-right">
                  <span className="text-base font-semibold text-foreground font-mono mr-2">
                    {downPaymentPercent}%
                  </span>
                  <span className="text-xs text-accent font-mono">
                    ({formatCurrency(calculation.downPayment, currency)})
                  </span>
                </div>
              </div>

              <input
                id="down-payment-input"
                type="range"
                min={20}
                max={70}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-card-border/60 rounded-lg appearance-none cursor-pointer accent-accent"
              />

              {/* Quick Percentage Pills */}
              <div className="flex items-center gap-2 mt-3" role="group" aria-label="Boshlang'ich badal foizlari">
                {quickPercentages.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPaymentPercent(pct)}
                    aria-pressed={downPaymentPercent === pct}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors ${
                      downPaymentPercent === pct
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-black/30 border-card-border/60 text-foreground-muted hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-foreground-muted font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>
                    {mode === "installment"
                      ? "To'lov muddati (oy)"
                      : "Ipoteka muddati (yil)"}
                  </span>
                </span>
                <span className="text-base font-semibold text-accent font-mono">
                  {mode === "installment"
                    ? `${installmentMonths} oy`
                    : `${mortgageYears} yil`}
                </span>
              </div>

              {/* Quick Duration Pills */}
              <div className="flex items-center gap-2" role="group" aria-label="To'lov muddati variantlari">
                {mode === "installment"
                  ? quickMonths.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setInstallmentMonths(m)}
                        aria-pressed={installmentMonths === m}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                          installmentMonths === m
                            ? "bg-accent text-[#0C0B0A] border-accent font-semibold shadow-md shadow-accent/20 scale-[1.02]"
                            : "bg-black/30 border-card-border/60 text-foreground-muted hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {m} oy
                      </button>
                    ))
                  : quickYears.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setMortgageYears(y)}
                        aria-pressed={mortgageYears === y}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                          mortgageYears === y
                            ? "bg-accent text-[#0C0B0A] border-accent font-semibold shadow-md shadow-accent/20 scale-[1.02]"
                            : "bg-black/30 border-card-border/60 text-foreground-muted hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {y} yil
                      </button>
                    ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculation Result Card */}
          <div className="lg:col-span-5 glass-panel-luxury p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between border border-accent/30 relative">
            <div>
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-semibold">
                  {mode === "installment"
                    ? "0% Foizsiz muddatli to'lov"
                    : "18% Yillik bank ipotekasi"}
                </span>
                <span className="text-xs text-foreground-muted flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  Kafolatlangan shartlar
                </span>
              </div>

              {/* Monthly Payment Headline */}
              <div className="p-5 rounded-2xl bg-black/50 border border-card-border/80 mb-6">
                <span className="block text-xs uppercase tracking-wider text-foreground-muted mb-1">
                  Taxminiy oylik to&apos;lov
                </span>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-gradient-gold">
                  {formatCurrency(calculation.monthlyPayment, currency)}
                  <span className="text-sm sm:text-base font-sans text-foreground-muted font-normal ml-1">
                    / oy
                  </span>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-3 pb-6 border-b border-card-border/60 text-xs sm:text-sm">
                <div className="flex justify-between text-foreground-muted">
                  <span>Kvartira umumiy qiymati:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(calculation.totalPrice, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>Dastlabki badal ({downPaymentPercent}%):</span>
                  <span className="font-semibold text-accent font-mono">
                    {formatCurrency(calculation.downPayment, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>Qarz miqdori:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {formatCurrency(calculation.loanAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground-muted">
                  <span>Ortiqcha to&apos;lov (Foizlar):</span>
                  <span
                    className={`font-semibold font-mono ${
                      calculation.overpayment === 0
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {calculation.overpayment === 0
                      ? "0 so'm (0%)"
                      : formatCurrency(calculation.overpayment, currency)}
                  </span>
                </div>
              </div>

              {/* Schedule Accordion Toggle */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setShowSchedule(!showSchedule)}
                  aria-expanded={showSchedule}
                  aria-controls="amortization-schedule-table"
                  className="w-full flex items-center justify-between text-xs text-foreground-muted hover:text-accent transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-accent" />
                    Dastlabki 12 oylik to&apos;lov jadvalini ko&apos;rish
                  </span>
                  {showSchedule ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showSchedule && (
                  <div id="amortization-schedule-table" className="mt-3 max-h-48 overflow-y-auto rounded-xl bg-black/40 border border-card-border/40 p-2 text-[11px] font-mono">
                    <div className="grid grid-cols-4 pb-1 mb-1 border-b border-card-border/40 text-foreground-muted">
                      <span>Oy</span>
                      <span>To&apos;lov</span>
                      <span>Asosiy</span>
                      <span>Qoldiq</span>
                    </div>
                    {schedule.map((row) => (
                      <div
                        key={row.monthNumber}
                        className="grid grid-cols-4 py-1 text-foreground border-b border-card-border/20 last:border-0"
                      >
                        <span>#{row.monthNumber}</span>
                        <span>{formatCurrency(row.payment, currency)}</span>
                        <span>{formatCurrency(row.principal, currency)}</span>
                        <span className="text-foreground-muted">
                          {formatCurrency(row.remainingBalance, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Booking CTA */}
            <div className="mt-6 pt-4 border-t border-card-border/60 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-accent text-[#0C0B0A] text-sm font-semibold hover:bg-accent-light transition-all shadow-xl shadow-accent/25 btn-shimmer"
              >
                <span>Ushbu shartlar bilan bron qilish</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
