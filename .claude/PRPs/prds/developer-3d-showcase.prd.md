# Developer 3D Showcase — Interaktiv Ko'chmas Mulk Promo Platformasi

## Problem Statement (Muammo Bayoni)

O'zbekistondagi yirik developerlar (*Murad Buildings, Xon Saroy, Golden House, NRG* va boshqalar) yangi turar-joy majmualarini loyiha bosqichidayoq (off-plan / kotlovan) sotishda an'anaviy, statik va zerikarli veb-saytlardan (oddiy 2D rasmlar va PDF kataloglar) foydalanmoqda. Xaridorlar hali qad ko'tarmagan binoni tasavvur qila olmagani sababli sotuv ofislariga borishga majbur bo'lmoqda, bu esa sotuv siklini (sales cycle) cho'zib yuboradi, chet eldagi va viloyatlardagi investorlarni jalb qilish imkonini keskin cheklaydi va developerlarning yuz minglab dollarlik marketing byudjetlari samarasiz sarflanishiga olib keladi.

## Evidence (Dalillar va Kuzatuvlar)

- **Sotuv ofislariga haddan tashqari bog'liqlik**: O'zbekistonda elita xonadonlarni sotib oluvchi xaridorlarning 85%+ qismi faqat sotuv ofisidagi jismoniy 3D maketni ko'rgandan keyingina qaror qabul qiladi.
- **Raqamli vositalarning nochorligi**: Hozirgi deyarli barcha developer saytlari shunchaki JPEG renderinglar va matnlardan iborat bo'lib, xaridorda hissiy bog'lanish va "WOW" effekti yaratmaydi.
- **Jahon tendensiyasi**: Dubay (*Emaar, Sobha*) va London bozorlarida interaktiv 3D scrollytelling vositalariga o'tgan developerlarda onlayn lid konversiyasi 2.8 barobarga, xalqaro xaridorlar ulushi esa 45% ga oshgan.

## Proposed Solution (Taklif Etilayotgan Yechim)

Developerlar uchun maxsus moslashtirilgan **"Interactive 3D Scrollytelling Promo Showcase"** platformasi. Developer o'zining arxitektura va 3D modelini (Blender/3ds Max yoki 4K video render ketma-ketligini) taqdim etadi, platforma esa uni brauzerda apparat tezlanishi (GPU hardware acceleration) orqali scroll harakatiga bog'laydi. Xaridor sahifani shunchaki aylantirish (scroll) orqali binoning poydevordan boshlab tomi yopilishigacha bo'lgan "Time-lapse" jarayonini, so'ngra fasaddan lobbi va penthauslargacha virtual ichiga kirib borishini jonli his qiladi. Platforma interaktiv 360° 3D ko'rinish, qavatlar va xonadonlar rejasini filtrlash hamda bir zumda Telegram/WhatsApp/Telefon orqali sotuv bo'limiga yuqori qiziqishdagi (hot leads) mijozlarni yetkazib berish bilan to'liq jihozlanadi.

## Key Hypothesis (Asosiy Gipoteza)

Biz ishonamizki, **qurilish jarayoni va bino ichiga virtual kirishni scrollytelling 3D orqali ko'rsatish** developerlarning marketing bo'limlari va sotuv rahbarlari uchun **onlayn qiziqish bildirgan elita xaridorlar oqimini keskin oshiradi**.  
Biz gipotezamiz to'g'riligini **saytga tashrif buyuruvchilarning o'rtacha sessiya vaqti 2.5 daqiqadan oshishi va an'anaviy saytlarga nisbatan 2 barobar ko'proq bron/konsultatsiya arizalari (lidlar) tushishi** orqali isbotlaymiz.

## What We're NOT Building (1-versiyaga kirmaydigan narsalar)

- **Onlayn to'liq to'lov / Tranzaksiya tizimi (Payment Gateway)** — Kvartiralar narxi katta bo'lgani sababli to'lovlar bank yoki sotuv ofisida amalga oshiriladi, 1-versiyada karta orqali to'liq to'lov integratsiyasi qilinmaydi.
- **Murakkab ichki CRM / Buxgalteriya** — Developerning ichki moliyaviy hisob-kitob tizimlari qurilmaydi; lidlar to'g'ridan-to'g'ri Telegram Bot, Webhook yoki mavjud AmoCRM/Bitrix24 ga yo'naltiriladi.
- **Foydalanuvchilar shaxsiy kabineti (Client Portal)** — Ro'yxatdan o'tish, shaxsiy shartnomalarni yuklash kabi funksiyalar MVP doirasidan tashqarida.
- **Haddan tashqari og'ir va yuklanmaydigan xom 3D modellar** — Optimizatsiya qilinmagan 200+ MB li og'ir CAD fayllar brauzerga to'g'ridan-to'g'ri tiqilmaydi (veb uchun maxsus siqilgan GLTF/WebGL yoki 60fps Scrolly-Video stream ishlatiladi).

## Success Metrics (Muvaffaqiyat Ko'rsatkichlari)

| Ko'rsatkich (Metric) | Maqsad (Target) | Qanday o'lchanadi |
|---|---|---|
| **O'rtacha sahifada qolish vaqti (Avg. Time on Page)** | > 2 daqiqa 30 soniya | Google Analytics / Umami analytics |
| **Scrollytelling yakuniga yetish (Completion Rate)** | > 65% tashrif buyuruvchilar | Video / Scroll trigger eventlari |
| **Lid konversiyasi (Lead Conversion Rate)** | > 4.5% umumiy tashrifdan | Kontakt forma va telefon/Telegram bosishlari |
| **Mobil qurilmalardagi yuklanish tezligi** | LCP < 2.2 soniya, 60 FPS | Google Lighthouse & Chrome Web Vitals |
| **Developer qoniqishi (Sales feedback)** | 100% ijobiy qabul qilish | Sotuv rahbarlarining arizalar sifati bo'yicha bahosi |

## Open Questions (Ochiq Savollar)

- [ ] Developerlar 3D ma'lumotlarni qanday formatda beradi (tayyor 3D model: `.glb`/`.fbx` mi yoki oldindan render qilingan 4K 60FPS video ketma-ketliklari)?
- [ ] Har bir developer uchun alohida brend ranglari va shriftlarini tezda sozlash uchun qulay konfiguratsiya fayli (`theme.config.ts`) yaratish kerakmi?
- [ ] Lidlar sotuv bo'limiga qanday formatda yetkaziladi: Telegram guruhi, CRM webhook (AmoCRM) yoki email orqali?

---

## Users & Context (Foydalanuvchilar va Kontekst)

### 1. Asosiy Xaridor (Buyer Persona — Ultimate User)
- **Kim**: 28–55 yosh oralig'idagi tadbirkorlar, top-menejerlar, chet eldagi vatandoshlar yoki ko'chmas mulk investorlari.
- **Hozirgi xatti-harakati**: Instagram yoki Telegramdagi reklamani ko'radi, saytga kiradi. Oddiy rasmlarni ko'rib zerikadi va sahifani yopadi yoki sotuv ofisiga borishga vaqt topolmaydi.
- **Ehtiyojni uyg'otuvchi moment (Trigger)**: O'z jamg'armalarini nufuzli, hashamatli va qulay majmuaga investitsiya qilish yoki o'z oilasi uchun orzusidagi xonadonni tanlash istagi.
- **Muvaffaqiyatli yakun**: Uyidan yoki ofisidan chiqmagan holda binoning qanday qurilishini, oynasidan qanday manzara ko'rinishini va xonadon loyihasini to'liq ko'rib, bir tugma bilan sotuv menejeridan aniq qavat va xonadon uchun bron so'rash.

### 2. B2B Mijoz (Developer — Primary Customer)
- **Kim**: Murad Buildings, Xon Saroy va boshqa qurilish kompaniyalarining Marketing direktori (CMO) va Sotuvlar boshqarmasi boshlig'i (Head of Sales).
- **Vazifasi (Job to Be Done)**: "Biz yangi loyihani boshlaganimizda, uni bozordagi boshqa barcha raqobatchilardan ajratib turadigan va xaridorda bir zumda orzu uyg'otadigan vizual platformaga ega bo'lishni xohlaymiz, toki sotuv ofisimizga eng to'lovga qobil va qaror qabul qilishga tayyor xaridorlar kelsin."

---

## Solution Detail (Yechim Tafsilotlari)

### Core Capabilities (MoSCoW tahlili)

| Muhimlik (Priority) | Imkoniyat (Capability) | Rationale (Asoslash) |
|---|---|---|
| **Must (Shart)** | **60FPS Scrollytelling Qurilish Tajribasi** | Bino 0 dan to'liq bitishigacha bo'lgan evolyutsiyasi scrollga bog'langan holda ko'rsatiladi. Foydalanuvchini jalb etuvchi asosiy yadro. |
| **Must (Shart)** | **Interaktiv 360° 3D Me'moriy Ko'rinish** | Xaridor binoni barcha taraflardan aylantirib, quyosh tushishi va fasad detallarini ko'ra olishi kerak. |
| **Must (Shart)** | **Interaktiv Qavatlar va Kvartiralar Tanlagichi** | Har bir qavatdagi xonadonlar soni, maydoni ($m^2$), xonalar soni va bo'sh/band holati (Real-time status). |
| **Must (Shart)** | **O'zbekiston formati uchun moslashtirilgan Lid Tizimi** | `+998 (XX) XXX-XX-XX` telefon maskasi, xatoliklarni tekshirish va bir martalik bron yuborish. |
| **Must (Shart)** | **Mobil Safari & Chrome uchun to'liq optimizatsiya** | Trafikning 75%+ qismi smartfonlardan kirgani sababli 100dvh, sensorli aylantirish va xotira (RAM) optimizatsiyasi. |
| **Should (Kutiladi)** | **Kinematik Teatr Modali (Full-screen Video)** | Bino haqidagi rasmiy ovozli taqdimotni bitta tugma orqali to'liq ekranda ko'rish. |
| **Should (Kutiladi)** | **Ovozli Jo'rlik (Ambient Sound & Audio Narration)** | Sayt aylantirilganda elita muhitni yaratuvchi fon musiqasi va professional diktor ovozi (ovozni o'chirish/yoqish imkoniyati bilan). |
| **Could (Ixtiyoriy)** | **Kvartira PDF Rejasini Generatsiya Qilish** | Tanlangan xonadon arxitektura rejasini bir tugma bilan PDF formatda yuklab olish. |
| **Won't (Keyinga)** | **Onlayn Bank Karta orqali To'lov** | 1-bosqichda talab etilmaydi, bron qilish faqat menejer orqali tasdiqlanadi. |

### MVP Scope (Minimal Ishga Tushirish Hajmi)
1. **Hero Scrollytelling**: 4 ta asosiy bob (Tashqi fasad, Grand lobbi, Maxsus koridorlar, Penthouse interyeri).
2. **Interactive 3D**: WebGL orqali 3 minorali arxitektura modeli, aylantirish imkoniyati.
3. **Building Explorer**: 7 qavatli blok modeli, xonadonlar kartochkalari, narx kalkulyatori ($/m^2$).
4. **Gallery Lightbox**: Klaviatura va sensor bilan boshqariladigan foto/renderlar galereyasi.
5. **Smart Contact Form**: Xonadon tanlanganda avtomatik forma ichiga ID raqamini biriktirish.

### User Flow (Foydalanuvchi Yo'li)

```
[Reklama / Havola] 
       ↓
[Hero: 0 dan boshlanuvchi 3D Scrollytelling] → [Egalik va qiziqish hissi]
       ↓
[Interactive 3D Scene: Binoni 360° ko'rish]
       ↓
[Qavatlar va Kvartiralar Tanlagichi] → [Xonadon maydoni, narxi va rejasini tanlash]
       ↓
["Bron qilish" tugmasi] → [Tanlangan xonadon bilan bog'langan Aloqa formasi]
       ↓
[Sotuv bo'limiga ariza yetkazildi (Lid hosil bo'ldi)]
```

---

## Technical Approach (Texnik Yondashuv)

**Texnik Imkoniyat Darajasi**: **YUQORI (HIGH)** — Barcha asosiy texnologik bloklar va me'moriy qismlar ishlab chiqilgan va sinovdan o'tgan.

### Me'moriy Yechimlar
1. **Scrollytelling Engine**: React state re-render laridan xoli to'g'ridan-to'g'ri DOM manipulyatsiyasi va `requestAnimationFrame`. Bu orqali 60 FPS / 120 FPS ravonlik ta'minlanadi.
2. **3D WebGL / Canvas**: Three.js va `@react-three/fiber` orqali qurilgan. Ekranda ko'rinmagan paytda GPU yuklanishini 0 ga tushirish uchun `frameloop="never"` rejimiga o'tadi.
3. **Silliq Harakat (Smooth Scrolling)**: `Lenis` dvigateli orqali barcha qurilmalarda bir xil elita, og'ir va ravon aylanish ta'minlanadi.
4. **Dizayn Tizimi**: Tailwind CSS v4, Champagne Gold (`#C5A059`) aksentlari, chuqur qora luxury fon (`#0C0B0A`), Cormorant Serif va Outfit zamonaviy shriftlari.

### Texnik Xavflar va Ularni Bartaraf Etish

| Xavf (Risk) | Ehtimollik | Ta'siri | Bartaraf etish chorasi (Mitigation) |
|---|---|---|---|
| Katta video/3D fayllar mobil internetda sekin yuklanishi | O'rta | Yuqori | WebM/H.264 video kompressiyasi, poster fallback va qismlarga bo'lingan stream yuklash. |
| Mobil telefonlarda qizib ketish yoki qotish | Past | Yuqori | IntersectionObserver orqali ekrandan chiqqan komponentlar (WebGL, Video) pauza qilinadi. |
| Har xil developerlarning 3D formatlari turlicha bo'lishi | O'rta | O'rta | Developerlarga aniq 3D export talablarini (Polygon count, GLTF/GLB yoki 60fps render) beruvchi standart qo'llanma tayyorlash. |

---

## Implementation Phases (Amalga Oshirish Bosqichlari)

| # | Bosqich (Phase) | Tavsif | Holat (Status) | Parallel | Bog'liqlik |
|---|---|---|---|---|---|
| **1** | **Core Scrolly Engine & Video Sync** | 60FPS to'g'ridan-to'g'ri DOM scrollytelling dvigatelini barqarorlashtirish | **Bajarildi** | - | - |
| **2** | **Interactive 3D WebGL & Optimizer** | Three.js bino modeli, aylanuvchi kamera va GPU yukini tejash | **Bajarildi** | - | 1 |
| **3** | **Building & Floor Explorer** | Qavatlar filtri, xonadonlar ma'lumotlar bazasi va interaktiv reja | **Bajarildi** | - | 1 |
| **4** | **Lead Capture & Mobile Hardening** | O'zbekiston raqamlari validatsiyasi, teatr rejimi va to'liq responsivlik | **Bajarildi** | - | 3 |
| **5** | **Developer Showcase Moduli** | Yangi developer loyihasini (Xon Saroy, Murad Buildings) tezkor sozlash shabloni ([Hisobot](file:///d:/projects/home/.claude/PRPs/reports/developer-showcase-moduli-report.md)) | **Bajarildi** | - | 4 |

---

## Decisions Log (Qarorlar Qaydnomasi)

| Qaror | Tanlangan Yo'l | Ko'rib Chiqilgan Muqobillar | Sabab va Asoslash |
|---|---|---|---|
| **Scrollytelling formati** | Yuqori aniqlikdagi video-stream + Three.js gibrid | Sof 100% og'ir WebGL 3D model | Sof 3D modellar arzon smartfonlarda qotadi; gibrid video-scrollytelling esa har qanday telefonda 60fps ravon ishlaydi. |
| **Boshqaruv usuli** | Direct DOM Reference (`useRef`) | React `useState` / `useScroll` | Scrollytelling paytida har bir scroll piksellari uchun React qayta render bo'lishi brauzerni qotirib qo'yadi. |
| **Silliq aylanish dvigateli** | `Lenis` Smooth Scroll | GSAP ScrollSmoother, CSS scroll-behavior | Lenis eng yengil, bepul va Three.js hamda video elementlari bilan mukammal sinxronlashadi. |

---

*Hujjat yaratildi: 2026-09-29*  
*Muallif: Antigravity AI & Product Team*  
*Holat: TASDIQLANGAN (APPROVED DRAFT)*
