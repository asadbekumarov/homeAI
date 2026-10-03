import { describe, it, expect } from "vitest";
import {
  CalculatorModeSchema,
  InstallmentParamsSchema,
  MortgageParamsSchema,
  CalculationResultSchema,
  AmortizationScheduleItemSchema,
} from "./calculator";

describe("Calculator Schemas", () => {
  it("validates valid calculator modes", () => {
    expect(CalculatorModeSchema.parse("installment")).toBe("installment");
    expect(CalculatorModeSchema.parse("mortgage")).toBe("mortgage");
    expect(() => CalculatorModeSchema.parse("invalid")).toThrow();
  });

  it("validates installment parameters correctly", () => {
    const valid = {
      price: 100000,
      downPaymentPercent: 30,
      months: 24,
    };
    expect(InstallmentParamsSchema.parse(valid)).toEqual(valid);

    // Negative price
    expect(() =>
      InstallmentParamsSchema.parse({ ...valid, price: -500 })
    ).toThrow();

    // Out of bound downPaymentPercent
    expect(() =>
      InstallmentParamsSchema.parse({ ...valid, downPaymentPercent: 5 })
    ).toThrow();
  });

  it("validates mortgage parameters correctly", () => {
    const valid = {
      price: 120000,
      downPaymentPercent: 25,
      years: 15,
      annualRate: 18,
    };
    expect(MortgageParamsSchema.parse(valid)).toEqual(valid);

    // Too high annual rate
    expect(() =>
      MortgageParamsSchema.parse({ ...valid, annualRate: 50 })
    ).toThrow();
  });

  it("validates calculation result schema", () => {
    const validResult = {
      totalPrice: 100000,
      downPayment: 30000,
      loanAmount: 70000,
      monthlyPayment: 2916.67,
      totalPayment: 100000,
      overpayment: 0,
      months: 24,
      annualRate: 0,
      mode: "installment" as const,
    };
    expect(CalculationResultSchema.parse(validResult)).toEqual(validResult);
  });

  it("validates amortization schedule item schema", () => {
    const scheduleItem = {
      monthNumber: 1,
      payment: 1500,
      principal: 1000,
      interest: 500,
      remainingBalance: 49000,
    };
    expect(AmortizationScheduleItemSchema.parse(scheduleItem)).toEqual(
      scheduleItem
    );
  });
});
