# Xon Saroy — Virtual 360° Xonadonlar Turi (VR / Scroll-Driven 3D Tour)

## Problem
Ko'chmas mulk xaridorlari va investorlar xonadonlarning haqiqiy hajmi, shift balandligi va ichki ta'mir muhitini ko'rish uchun faqatgina savdo ofisidagi jismoniy 3D maketlarga borishga majbur. Mavjud veb-saytlardagi statik 2D planirovka va rasmlar xonaning fazoviy tuyg'usini bera olmaydi, bu esa qaror qabul qilish jarayonini sekinlashtiradi va mijozlarning ofisga kelish xarajatini oshiradi.

## Evidence
- Raqobatchilar veb-saytlarida faqat 2D chizmalar va oddiy rasmlar mavjudligi.
- Xaridorlarning ofisga bormasdan turib interyer va xonalar ko'rinishini istalgan joydan (masofadan) ko'rishga bo'lgan ehtiyoji.
- `Assumption — needs validation via scroll-driven prototype analytics and user feedback`.

## Users
- **Primary**: O'zbekiston viloyatlaridagi yoki xorijdagi yangi xonadon xaridorlari, vaqti tig'iz investorlar hamda zamonaviy oilalar (sotuv ofisiga bormasdan qaror qabul qiluvchilar).
- **Not for**: Faqat ikkilamchi bozordan arzon xonadon izlovchilar yoki jismoniy ofisga borishni afzal ko'radigan an'anaviy xaridorlar.

## Hypothesis
Bizningcha, **veb-saytda skrollga bog'langan 3D simulyatsiyali xonadonlar sayri va interaktiv xona ko'rgazmasi**, **xaridorlarning ofisga bormasdan uy ichini to'liq tasavvur qilishini ta'minlaydi va brendni raqobatchilardan keskin ajratib beradi**. Bunga erishganimizni **saytda qolish vaqti +50% oshishi va interaktiv turdan keyingi ariza qoldirish konversiyasi +30% ko'payishi** orqali bilamiz.

## Success Metrics
| Metric | Target | How measured |
|---|---|---|
| Saytda o'rtacha qolish vaqti (Time on Page) | >= 2.5 daqiqa (+50% o'sish) | Google Analytics / Yandex Metrika |
| 3D VR Tour orqali ariza (Lead) yuborish konversiyasi | >= 4.5% | Form submission & CTA click events |
| Skroll orqali 3D turning oxirigacha yetib borish ko'rsatkichi (Completion Rate) | >= 65% | Skroll chuqurligi hodisalari (Scroll depth events) |

## Scope
**MVP** — Skrollga bog'langan 3D xonadon sayri (video-scrubbing simulyatsiyasi), asosiy xonalar (Mehmonxona, Oshxona, Yotoqxona) o'rtasida o'tish tugmalari, xonaning asosiy xususiyatlari (maydon, shift 3.1m, panoramik oyna) infokartochkalari va zudlik bilan savdo bo'limi bilan bog'lanish (CTA) moduli.

**Out of scope**
- Real-time 3D mebel almashtirish / devor ranglarini bo'yash konstruktori — dastlabki gipotezani tekshirish uchun ortiqcha murakkablik.
- Maxsus VR ko'zoynaklari (Meta Quest / HTC Vive) uchun nativ WebXR ilova — foydalanuvchilarning asosiy qismi mobil telefon yoki brauzerdan kiradi.
- To'liq onlayn to'lov va shartnoma rasmiylashtirish — huquqiy va bank integratsiyalari keyingi bosqichlarga qoldiriladi.

## Delivery Milestones

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | Scroll-Driven 3D Tour Player | Foydalanuvchi sahifani skroll qilganda silliq aylanuvchi 3D xonadon video simulyatsiyasi | complete | [.claude/plans/xon-saroy-vr-tour.plan.md](file:///d:/projects/home/.claude/plans/xon-saroy-vr-tour.plan.md) |
| 2 | Interaktiv Xona Hotspotlari | Mehmonxona, oshxona va yotoqxona nuqtalariga o'tuvchi tezkor boshqaruv paneli | complete | [.claude/plans/xon-saroy-vr-tour.plan.md](file:///d:/projects/home/.claude/plans/xon-saroy-vr-tour.plan.md) |
| 3 | Xonadon Parametrlari va CTA | Xona o'lchamlari, shift balandligi va bron qilish arizasini ochuvchi interfeys | complete | [.claude/plans/xon-saroy-vr-tour.plan.md](file:///d:/projects/home/.claude/plans/xon-saroy-vr-tour.plan.md) |

## Open Questions
- [ ] Foydalanuvchi skroll qilganda video kadrlari (frame-by-frame) mobil telefonlarda (iOS Safari, Android Chrome) qotmasdan silliq ishlashini ta'minlash optimal formati qaysi (MP4 vs WebM yoki canvas drawImage)?
- [ ] Video simulyatsiyasi uchun fayl hajmini optimallashtirish (maksimal 5-8MB) va lazy-loading strategiyasi.

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mobil qurilmalarda sekin internet oqibatida videoning kech yuklanishi | O'rta | Yuqori | Poster (preview rasm) va dastlabki 2 soniyali yengil video bufferlash, progress bar ko'rsatish |
| Safari brauzerida video scrub (currentTime o'zgartirish) animatsiyasining qotishi | O'rta | O'rta | `requestAnimationFrame` va silliq lerp (linear interpolation) orqali vaqtni tekislash |

---
*Status: DRAFT — requirements only. Implementation planning pending via /plan.*
