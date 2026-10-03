import {
  CalculationResult,
  InstallmentParams,
  MortgageParams,
  AmortizationScheduleItem,
} from "@/types/calculator";

/**
 * 0% Foizsiz muddatli to'lov (Rassrochka) hisob-kitobi
 */
export function calculateInstallment(
  params: InstallmentParams
): CalculationResult {
  const { price, downPaymentPercent, months } = params;
  const safePrice = Math.max(price, 0);
  const safePercent = Math.min(Math.max(downPaymentPercent, 0), 100);
  const safeMonths = Math.max(months, 1);

  const downPayment = Math.round((safePrice * safePercent) / 100);
  const loanAmount = Math.max(safePrice - downPayment, 0);
  const monthlyPayment = Math.round((loanAmount / safeMonths) * 100) / 100;

  return {
    totalPrice: safePrice,
    downPayment,
    loanAmount,
    monthlyPayment,
    totalPayment: safePrice,
    overpayment: 0,
    months: safeMonths,
    annualRate: 0,
    mode: "installment",
  };
}

/**
 * Bank Ipoteka krediti (Annuitet to'lov) hisob-kitobi
 */
export function calculateMortgage(params: MortgageParams): CalculationResult {
  const { price, downPaymentPercent, years, annualRate } = params;
  const safePrice = Math.max(price, 0);
  const safePercent = Math.min(Math.max(downPaymentPercent, 0), 100);
  const safeMonths = Math.max(years * 12, 1);
  const safeRate = Math.max(annualRate, 0);

  const downPayment = Math.round((safePrice * safePercent) / 100);
  const loanAmount = Math.max(safePrice - downPayment, 0);

  let monthlyPayment = 0;
  if (loanAmount === 0) {
    monthlyPayment = 0;
  } else if (safeRate === 0) {
    monthlyPayment = Math.round((loanAmount / safeMonths) * 100) / 100;
  } else {
    const monthlyRate = safeRate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, safeMonths);
    monthlyPayment =
      Math.round(loanAmount * ((monthlyRate * factor) / (factor - 1)) * 100) /
      100;
  }

  const totalMonthlyPayments = monthlyPayment * safeMonths;
  const totalPayment = Math.round((downPayment + totalMonthlyPayments) * 100) / 100;
  const overpayment = Math.max(
    Math.round((totalPayment - safePrice) * 100) / 100,
    0
  );

  return {
    totalPrice: safePrice,
    downPayment,
    loanAmount,
    monthlyPayment,
    totalPayment,
    overpayment,
    months: safeMonths,
    annualRate: safeRate,
    mode: "mortgage",
  };
}

/**
 * Oylik to'lovlar jadvali (Amortization schedule)
 */
export function generateAmortizationSchedule(
  result: CalculationResult,
  limitMonths = 12
): AmortizationScheduleItem[] {
  const schedule: AmortizationScheduleItem[] = [];
  let remaining = result.loanAmount;
  const monthlyRate =
    result.mode === "mortgage" && result.annualRate > 0
      ? result.annualRate / 100 / 12
      : 0;

  const totalMonths = Math.min(result.months, limitMonths);

  for (let m = 1; m <= totalMonths; m++) {
    let interest = 0;
    let principal = 0;

    if (result.mode === "installment" || monthlyRate === 0) {
      principal = Math.min(result.monthlyPayment, remaining);
      interest = 0;
    } else {
      interest = Math.round(remaining * monthlyRate * 100) / 100;
      principal = Math.round((result.monthlyPayment - interest) * 100) / 100;
    }

    remaining = Math.max(Math.round((remaining - principal) * 100) / 100, 0);

    schedule.push({
      monthNumber: m,
      payment: result.monthlyPayment,
      principal,
      interest,
      remainingBalance: remaining,
    });
  }

  return schedule;
}

/**
 * Valyuta formatlash yordamchisi
 */
export function formatCurrency(
  amount: number,
  currency: "USD" | "UZS" = "USD",
  exchangeRate = 12900
): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const uzsAmount = Math.round(amount * exchangeRate);
  return `${new Intl.NumberFormat("uz-UZ").format(uzsAmount)} so'm`;
}
