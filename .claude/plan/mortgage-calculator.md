# Implementation Plan: Onlayn Ipoteka va 0% Rassrochka Kalkulyatori

### Task Type
- [x] Fullstack (→ Parallel: Backend Calculation Models & Validation + Frontend Interactive Visuals)

---

## Technical Solution (Synthesized Codex & Antigravity Analysis)

### 1. Backend & Matematik hisob-kitoblar (Codex tahlili)
- **0% Rassrochka (Foizsiz muddatli to'lov)**:
  - Formula: $\text{Oylik to'lov} = \frac{\text{Umumiy narx} - \text{Dastlabki to'lov}}{\text{Muddat (oylarda)}}$
  - Muddatlar: 12, 18, 24, 30, 36 oylar
  - Boshlang'ich badal chegarasi: 20% – 70%
  - Ortiqcha to'lov: 0 UZS / 0 USD
- **Bank Ipoteka Krediti**:
  - Annuitet to'lov formulasi:
    $$M = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
    Bu yerda:
    - $P$ — Qarz summasi ($\text{Narx} - \text{Boshlang'ich badal}$)
    - $r$ — Oylik foiz stavkasi ($\frac{\text{Yillik stavka}}{12 \times 100}$)
    - $n$ — Oylar soni ($\text{Yillar} \times 12$)
  - Standart foiz stavkasi: 17.5% – 21%
  - Muddat: 10, 15, 20 yil
- **Valyuta va Kurs konvertatsiyasi**:
  - USD ($) va UZS (so'm) o'rtasida dinamik konvertatsiya (Markaziy Bank taxminiy kursi: $1 = 12,900$ UZS).
- **Zod Schemas**:
  - `MortgageParamsSchema`, `MortgageResultSchema`, `BookingLeadSchema`

### 2. Foydalanuvchi Interfeysi va UX (Antigravity tahlili)
- **Interaktiv Ikki Rejimli Tanlov (Toggle)**:
  - 🌟 **0% Xon Saroy Rassrochka** (Tavsiya etiladi, foizsiz)
  - 🏦 **Davlat / Bank Ipotekasi**
- **Silliq Slider va Raqamli Inputlar**:
  - Kvartira narxi (qo'lda kiritish yoki BuildingExplorer ro'yxatidan tanlash)
  - Dastlabki to'lov (slider + foiz tugmalari: 20%, 30%, 50%)
  - Muddat (slider + oylar/yillar pills)
- **Vizual Tahlil va Natija Paneli**:
  - Katta oltin gradientli raqam: `Oylik to'lov: $980 / oy`
  - Rangli segmentli progress bar: Boshlang'ich to'lov vs Qarz summasi vs Bank foizi
  - Oylik to'lovlar jadvali (Amortization schedule) modali
- **Zudlik bilan Bron Qilish Integratsiyasi**:
  - Foydalanuvchi hisoblagan shartlar avtomatik tarzda ariza formasi bilan bog'lanadi va savdo bo'limiga uzatiladi.

---

## Implementation Steps

### 1-bosqich: Moliyaviy modellar va turlar (Data & Types)
- **Fayl**: `src/types/calculator.ts`
- **Kutilayotgan natija**: Zod orqali `CalculatorType` ('installment' | 'mortgage'), hisoblash parametrlari va oylik jadval (Amortization row) turlari yaratiladi.
- **Unit test**: `src/types/calculator.test.ts` (100% type coverage).

### 2-bosqich: Matematik kalkulyator moduli (Calculation Engine)
- **Fayl**: `src/lib/mortgageCalculator.ts`
- **Kutilayotgan natija**: 
  - `calculateInstallment(price, downPaymentPercent, months)`
  - `calculateMortgage(price, downPaymentPercent, years, annualRate)`
  - `generateAmortizationSchedule(...)`
  - Barcha chekka holatlar (nolga bo'lish, manfiy qiymatlar, yaxlitlash) to'liq himoyalanadi.
- **Unit test**: `src/lib/mortgageCalculator.test.ts` (annuitet formula va 0% rassrochka aniqligi 100% testlanadi).

### 3-bosqich: Interaktiv Kalkulyator Komponenti (UI Component)
- **Fayl**: `src/components/MortgageCalculator.tsx`
- **Kutilayotgan natija**:
  - Zamonaviy `.glass-panel-luxury` kartochkasi
  - Rejim almashtirgich (0% Rassrochka vs Ipoteka)
  - Sliderlar va tezkor tanlov tugmalari (20%, 30%, 50%)
  - Dinamik vizual diagramma va hisob-kitob natijalari
  - "Ushbu shartlar asosida bron qilish" CTA tugmasi
- **Unit test**: `src/components/MortgageCalculator.test.tsx` (foydalanuvchi o'zaro ta'siri, slider o'zgarishi, to'lov rejimi almashinuvi).

### 4-bosqich: Bosh sahifa va BuildingExplorer bilan integratsiya
- **Fayllar**: `src/app/page.tsx`, `src/components/BuildingExplorer.tsx`, `src/components/Navbar.tsx`
- **Kutilayotgan natija**:
  - `BuildingExplorer` dagi har bir kvartira kartasida "Kalkulyatorda hisoblash" tugmasi bosilganda narx avtomatik kalkulyatorga o'tadi
  - Bosh sahifada alohida `#calculator` bo'limi ochiladi
  - Navigatsiya menyusiga havola qo'shiladi.

---

## Key Files to Create / Modify

| Fayl | Amaliyot | Tavsif |
|---|---|---|
| `src/types/calculator.ts` | CREATE | Zod sxemalari va moliyaviy hisob-kitob turlari |
| `src/lib/mortgageCalculator.ts` | CREATE | Annuitet ipoteka va 0% rassrochka hisoblash mantiqiy yadrosi |
| `src/lib/mortgageCalculator.test.ts` | CREATE | Matematik hisob-kitoblar va formulalarning unit testlari |
| `src/components/MortgageCalculator.tsx` | CREATE | Foydalanuvchi uchun interaktiv UI/UX kalkulyator komponenti |
| `src/components/MortgageCalculator.test.tsx` | CREATE | Komponent renderingi, rejim almashtirish va ariza testlari |
| `src/app/page.tsx` | UPDATE | Yangi hisob-kitob bo'limini bosh sahifaga ulash |

---

## Pseudo-code Example

```typescript
// Calculation engine pseudo-code
export function calculateInstallment(totalPrice: number, downPaymentPercent: number, months: number): InstallmentResult {
  const downPayment = (totalPrice * downPaymentPercent) / 100;
  const loanAmount = totalPrice - downPayment;
  const monthlyPayment = loanAmount / months;

  return {
    totalPrice,
    downPayment,
    loanAmount,
    monthlyPayment,
    months,
    overpayment: 0,
    interestRate: 0,
  };
}

export function calculateMortgage(totalPrice: number, downPaymentPercent: number, years: number, annualRate: number): MortgageResult {
  const downPayment = (totalPrice * downPaymentPercent) / 100;
  const principal = totalPrice - downPayment;
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  // Annuity formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = principal * ((monthlyRate * factor) / (factor - 1));
  const totalPayment = downPayment + monthlyPayment * months;

  return {
    totalPrice,
    downPayment,
    loanAmount: principal,
    monthlyPayment,
    months,
    totalPayment,
    overpayment: totalPayment - totalPrice,
    annualRate,
  };
}
```

---

## Risks and Mitigation

| Xavf | Ehtimollik | Yechim |
|---|---|---|
| Foydalanuvchi manfiy yoki haddan tashqari katta raqam kiritishi | O'rta | Zod schema orqali min/max tekshiruvi va input sanitization |
| Valyuta kurslarining o'zgarishi | O'rta | Standart asosiy valyutani USD qilib, so'mda indikativ narx sifatida ko'rsatish |
| Mobil ekranlarda katta kalkulyatorning noqulayligi | O'rta | Ixcham accordion/tab interfeysi va responsiv sliderlar |

---

### SESSION_ID (for /ccg:execute use)
- CODEX_SESSION: codex-mortgage-calc-20261003-01
- ANTIGRAVITY_SESSION: agy-mortgage-calc-20261003-01
