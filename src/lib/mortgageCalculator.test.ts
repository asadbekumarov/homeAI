import { describe, it, expect } from "vitest";
import {
  calculateInstallment,
  calculateMortgage,
  generateAmortizationSchedule,
  formatCurrency,
} from "./mortgageCalculator";

describe("Mortgage Calculator Engine", () => {
  describe("calculateInstallment", () => {
    it("calculates 0% installment correctly with 30% down payment over 24 months", () => {
      const result = calculateInstallment({
        price: 100000,
        downPaymentPercent: 30,
        months: 24,
      });

      expect(result.totalPrice).toBe(100000);
      expect(result.downPayment).toBe(30000);
      expect(result.loanAmount).toBe(70000);
      expect(result.monthlyPayment).toBeCloseTo(2916.67, 1);
      expect(result.overpayment).toBe(0);
      expect(result.annualRate).toBe(0);
      expect(result.mode).toBe("installment");
    });

    it("handles 100% down payment without errors", () => {
      const result = calculateInstallment({
        price: 50000,
        downPaymentPercent: 100,
        months: 12,
      });

      expect(result.downPayment).toBe(50000);
      expect(result.loanAmount).toBe(0);
      expect(result.monthlyPayment).toBe(0);
    });
  });

  describe("calculateMortgage", () => {
    it("calculates annuity mortgage payment accurately", () => {
      const result = calculateMortgage({
        price: 100000,
        downPaymentPercent: 20,
        years: 15,
        annualRate: 18,
      });

      expect(result.downPayment).toBe(20000);
      expect(result.loanAmount).toBe(80000);
      expect(result.months).toBe(180);
      expect(result.annualRate).toBe(18);
      expect(result.mode).toBe("mortgage");
      // Monthly annuity payment for 80k at 18% over 180 months is approx $1287
      expect(result.monthlyPayment).toBeGreaterThan(1200);
      expect(result.monthlyPayment).toBeLessThan(1400);
      expect(result.overpayment).toBeGreaterThan(0);
    });

    it("handles 0% annual rate mortgage as zero interest", () => {
      const result = calculateMortgage({
        price: 60000,
        downPaymentPercent: 50,
        years: 5,
        annualRate: 0,
      });

      expect(result.monthlyPayment).toBe(500);
      expect(result.overpayment).toBe(0);
    });
  });

  describe("generateAmortizationSchedule", () => {
    it("generates monthly schedule for installment mode", () => {
      const result = calculateInstallment({
        price: 60000,
        downPaymentPercent: 50,
        months: 6,
      });

      const schedule = generateAmortizationSchedule(result, 6);
      expect(schedule.length).toBe(6);
      expect(schedule[0].monthNumber).toBe(1);
      expect(schedule[0].interest).toBe(0);
      expect(schedule[0].principal).toBe(5000);
      expect(schedule[5].remainingBalance).toBe(0);
    });

    it("generates monthly schedule for mortgage mode with interest", () => {
      const result = calculateMortgage({
        price: 80000,
        downPaymentPercent: 25,
        years: 10,
        annualRate: 17,
      });

      const schedule = generateAmortizationSchedule(result, 3);
      expect(schedule.length).toBe(3);
      expect(schedule[0].interest).toBeGreaterThan(0);
      expect(schedule[0].principal).toBeGreaterThan(0);
    });
  });

  describe("formatCurrency", () => {
    it("formats USD currency", () => {
      const formatted = formatCurrency(12500, "USD");
      expect(formatted).toContain("12,500");
      expect(formatted).toContain("$");
    });

    it("formats UZS currency with exchange rate", () => {
      const formatted = formatCurrency(1000, "UZS", 12900);
      expect(formatted).toContain("so'm");
    });
  });
});
