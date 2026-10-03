import { z } from "zod";

export const CalculatorModeSchema = z.enum(["installment", "mortgage"]);
export type CalculatorMode = z.infer<typeof CalculatorModeSchema>;

export const CurrencySchema = z.enum(["USD", "UZS"]);
export type Currency = z.infer<typeof CurrencySchema>;

export const InstallmentParamsSchema = z.object({
  price: z.number().positive("Narx musbat son bo'lishi kerak"),
  downPaymentPercent: z.number().min(10).max(90),
  months: z.number().int().min(6).max(60),
});
export type InstallmentParams = z.infer<typeof InstallmentParamsSchema>;

export const MortgageParamsSchema = z.object({
  price: z.number().positive("Narx musbat son bo'lishi kerak"),
  downPaymentPercent: z.number().min(10).max(90),
  years: z.number().int().min(1).max(30),
  annualRate: z.number().min(0).max(40),
});
export type MortgageParams = z.infer<typeof MortgageParamsSchema>;

export const CalculationResultSchema = z.object({
  totalPrice: z.number().nonnegative(),
  downPayment: z.number().nonnegative(),
  loanAmount: z.number().nonnegative(),
  monthlyPayment: z.number().nonnegative(),
  totalPayment: z.number().nonnegative(),
  overpayment: z.number().nonnegative(),
  months: z.number().int().positive(),
  annualRate: z.number().nonnegative(),
  mode: CalculatorModeSchema,
});
export type CalculationResult = z.infer<typeof CalculationResultSchema>;

export const AmortizationScheduleItemSchema = z.object({
  monthNumber: z.number().int().positive(),
  payment: z.number().nonnegative(),
  principal: z.number().nonnegative(),
  interest: z.number().nonnegative(),
  remainingBalance: z.number().nonnegative(),
});
export type AmortizationScheduleItem = z.infer<
  typeof AmortizationScheduleItemSchema
>;
