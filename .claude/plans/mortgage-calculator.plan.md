# Plan: Onlayn Ipoteka va 0% Rassrochka Kalkulyatori

**Manba reja**: [.claude/plan/mortgage-calculator.md](file:///d:/projects/home/.claude/plan/mortgage-calculator.md)
**Murakkablik**: Medium (O'rta)

## Xulosa
Ushbu reja **Xon Saroy** veb-saytiga interaktiv moliyaviy kalkulyatorni qo'shadi. Xaridorlar 0% muddatli to'lov (rassrochka) yoki bank ipoteka kreditini real vaqt rejimida hisoblab, oylik to'lov, dastlabki badal va to'lov jadvalini ko'rishlari hamda shu shartlar asosida to'g'ridan-to'g'ri kvartirani bron qilishlari mumkin bo'ladi.

## Qadamlar
1. `src/types/calculator.ts` - Zod sxemalari va ma'lumot turlari
2. `src/lib/mortgageCalculator.ts` - Hisoblash mantiqiy yadrosi va testlar
3. `src/components/MortgageCalculator.tsx` - Interaktiv UI/UX komponenti
4. `src/app/page.tsx` - Bosh sahifaga integratsiya qilish
5. Testlar va 80%+ test qamrovi
