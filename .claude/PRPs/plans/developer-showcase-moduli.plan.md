# Plan: Developer Showcase Moduli (Multi-Developer / Multi-Project Showcase Engine)

## Summary
Yangi ko'chmas mulk developerlari (*Murad Buildings, Xon Saroy, The Palisades*) uchun 3D scrollytelling platformasini bir necha daqiqada moslashtirish, har bir developerning o'z brendi, video/3D modeli, binosi va qavatlar rejasini dinamik yuklash imkonini beruvchi modulli konfiguratsiya tizimi va mijozlarga taqdimot qilish uchun interaktiv **"Developer Switcher"** modulini ishlab chiqish.

## User Story
**As a** digital agency / 3D web developer,  
**I want** a modular project configuration system and interactive developer showcase switcher,  
**So that** I can pitch and demonstrate personalized, branded 3D interactive landing pages to Murad Buildings, Xon Saroy, and other developers within minutes without rewriting core UI or 3D engine code.

## Problem → Solution
- **Hozirgi holat**: Barcha matnlar, video yo'li, boblar (chapters) va bino ma'lumotlari kod ichida statik qattiq kodlangan (hardcoded). Xon Saroy yoki Murad Buildings ga namoyish qilish uchun kodni qayta yozish kerak.
- **Kutilayotgan holat**: To'liq typesafe `ProjectConfig` arxitekturasi orqali har bir developer uchun bitta fayl (`src/data/projects/{slug}.ts`) yaratish kifoya qiladi. Saytda esa mijozlarga platforma imkoniyatini ko'rsatish uchun 1-bosish bilan developerlar o'rtasida o'tuvchi elita **"Developer Switcher"** moduli paydo bo'ladi.

## Metadata
- **Complexity**: Medium (5 ta fayl yaratish/o'zgartirish, 250-450 qator kod)
- **Source PRD**: [.claude/PRPs/prds/developer-3d-showcase.prd.md](file:///d:/projects/home/.claude/PRPs/prds/developer-3d-showcase.prd.md)
- **PRD Phase**: Phase 5 — Developer Showcase Moduli
- **Estimated Files**: 6 ta fayl

---

## UX Design

### Before
```
┌────────────────────────────────────────────────────────┐
│  The Palisades (Faqat bitta statik loyiha)             │
│  - Barcha videolarga yo'llar qotirilgan                │
│  - Qavatlar rejasi faqat bitta bino uchun              │
│  - Murad Buildings yoki Xon Saroyga ko'rsatib bo'lmaydi│
└────────────────────────────────────────────────────────┘
```

### After
```
┌────────────────────────────────────────────────────────┐
│  [✦ Pitch Mode: Murad Buildings ▾] (Floating Pill)     │
│                                                        │
│  [Hero 60FPS Scrollytelling]                           │
│  - Tanlangan developer logosi, videolari va boblari    │
│                                                        │
│  [Interactive 3D & Building Explorer]                  │
│  - Tanlangan developer binosi, qavatlari va narxlari   │
│                                                        │
│  [Smart Contact & Lead Routing]                        │
│  - Tanlangan developerning aloqa raqami va manzili     │
└────────────────────────────────────────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| **Developer Switcher Pill** | Mavjud emas | Yuqori o'ng burchakda suzib yuruvchi elita shisha tugmacha | 1-bosish bilan Murad Buildings, Xon Saroy va The Palisades o'rtasida darhol almashtiradi |
| **Hero Tarkibi** | Statik The Palisades | Dinamik `currentProject.projectName`, `chapters`, `heroVideoUrl` | Developer o'zgarganda video va boblar ravon o'zgaradi |
| **Building Explorer** | Statik Blok A | Dinamik `currentProject.building` | Har bir developerning o'z qavatlari va kvartiralari ko'rinadi |
| **Navbar & Footer** | Qotirilgan telefon va nom | `currentProject.phone`, `currentProject.developerName` | Developerga xos brending to'liq aks etadi |

---

## Mandatory Reading

Fayllarni o'zgartirishdan oldin o'qilishi SHART bo'lgan namunaviy manbalar:

| Muhimlik | Fayl | Qatorlar | Nega o'qish shart |
|---|---|---|---|
| **P0 (critical)** | [src/types/building.ts](file:///d:/projects/home/src/types/building.ts) | 1-70 | Zod schema va TypeScript tipografiya qoidalari |
| **P0 (critical)** | [src/components/Hero.tsx](file:///d:/projects/home/src/components/Hero.tsx) | 20-35, 490-515 | `CHAPTERS` va video `src` qanday boshqarilayotgani |
| **P1 (important)** | [src/components/BuildingExplorer.tsx](file:///d:/projects/home/src/components/BuildingExplorer.tsx) | 29-45 | `initialBuilding` prop qabul qilish tartibi |
| **P2 (reference)** | [src/data/buildingData.ts](file:///d:/projects/home/src/data/buildingData.ts) | 1-40 | Real bino ma'lumotlari strukturalanishi |

---

## Patterns to Mirror

Loyihadagi amaldagi kod uslublari (bularga qat'iy rioya qilinadi):

### 1. Zod Schema va Type Inference
```ts
// SOURCE: src/types/building.ts:9-13
export const ApartmentStatusSchema = z
  .enum(['available', 'reserved', 'sold'])
  .describe("Kvartira bandlik holati: 'available', 'reserved' yoki 'sold'");

export type ApartmentStatus = z.infer<typeof ApartmentStatusSchema>;
```

### 2. Glassmorphic Luxury UI
```tsx
// SOURCE: src/components/Hero.tsx:518-523
className="min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/90 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer text-xs font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
```

### 3. LocalStorage Persistence
```ts
// SOURCE: src/components/Hero.tsx:66-78
try {
  const saved = localStorage.getItem("palisades_project");
  if (saved) { ... }
} catch {}
```

---

## Files to Change

| Fayl | Amaliyot | Asoslash |
|---|---|---|
| `src/types/project.ts` | **CREATE** | `ProjectConfig` va `Chapter` uchun Zod schema va interfeyslar |
| `src/data/projects/palisades.ts` | **CREATE** | The Palisades loyihasining to'liq konfiguratsiyasi |
| `src/data/projects/xonSaroy.ts` | **CREATE** | Xon Saroy (Sayram Residence / Ocean) loyihasi konfiguratsiyasi |
| `src/data/projects/muradBuildings.ts` | **CREATE** | Murad Buildings (Nest One / Do'stlar) loyihasi konfiguratsiyasi |
| `src/data/projects/index.ts` | **CREATE** | Loyihalar reestri va loyihani slug bo'yicha olish funksiyasi |
| `src/context/ProjectContext.tsx` | **CREATE** | React Context orqali butun saytga loyihani yetkazish |
| `src/components/DeveloperSwitcher.tsx` | **CREATE** | Taqdimot paytida 1-bosish bilan developerlarni almashtiruvchi HUD |
| `src/app/page.tsx` | **UPDATE** | `ProjectProvider` va `DeveloperSwitcher` ni ulash |
| `src/components/Hero.tsx` | **UPDATE** | `currentProject` dagi video, nom va boblarni qabul qilish |
| `src/components/Navbar.tsx` | **UPDATE** | Tanlangan developer logosi va aloqa telefonini aks ettirish |

## NOT Building

- [ ] Backend ma'lumotlar bazasi (PostgreSQL / MongoDB) — Barcha developer loyihalari statik JSON/TypeScript sifatida tezkor keshlanadi.
- [ ] Admin panel (CMS login/password) — 1-versiyada konfiguratsiyalar kod orqali qo'shiladi.

---

## Step-by-Step Tasks

### Task 1: `src/types/project.ts` sxemasini yaratish
- **ACTION**: `ProjectConfig` va `ProjectChapter` Zod sxemalarini tuzish.
- **IMPLEMENT**:
  - `slug`: string (masalan: `palisades`, `xon-saroy`, `murad-buildings`)
  - `developerName`: string
  - `projectName`: string
  - `tagline`: string
  - `location`: string
  - `phone`, `email`, `address`: string
  - `heroVideoUrl`, `theaterVideoUrl`, `posterUrl`: string
  - `chapters`: array of `{ code, title, subtitle, target }`
  - `building`: `Building` (from `@/types/building`)
  - `accentColor`: optional string
- **VALIDATE**: `npx tsc --noEmit` bilan tekshirish.

### Task 2: Developer loyihalarini yaratish (`src/data/projects/`)
- **ACTION**: 3 ta asosiy developer profilini yaratish:
  1. `palisades.ts`: Hozirgi to'liq ma'lumotlar.
  2. `xonSaroy.ts`: "Xon Saroy — Sayram Residence", maxsus boblar, qavatlar va telefon.
  3. `muradBuildings.ts`: "Murad Buildings — Do'stlar Rezidensiyasi", maxsus boblar va telefon.
  4. `index.ts`: `PROJECTS` massivi va `DEFAULT_PROJECT`.
- **VALIDATE**: Barcha obyektlar `ProjectConfigSchema.parse()` orqali validatsiyadan o'tishi kerak.

### Task 3: `src/context/ProjectContext.tsx` yaratish
- **ACTION**: React Context provayderi:
  - `currentProject`: `ProjectConfig`
  - `setProjectSlug`: `(slug: string) => void`
  - `allProjects`: `ProjectConfig[]`
  - `localStorage` orqali tanlangan loyihani eslab qolish.
- **VALIDATE**: Server Side Rendering (SSR) paytida hydration mismatch bo'lmasligi uchun default qiymat qo'yish.

### Task 4: `src/components/DeveloperSwitcher.tsx` yaratish
- **ACTION**: Yuqori burchakda taqdimot paytida ko'rinib turadigan yoki ochiladigan zamonaviy menyu.
  - "Loyiha: Murad Buildings", "Xon Saroy", "The Palisades".
  - Bosilganda butun sayt (Hero, Explorer, Aloqa) soniyaning ulushida moslashadi.
- **VALIDATE**: Brauzerda bosib tekshirish.

### Task 5: Asosiy komponentlarni Context ga ulash
- **ACTION**:
  - [src/app/page.tsx](file:///d:/projects/home/src/app/page.tsx) ni `<ProjectProvider>` bilan o'rash.
  - [src/components/Hero.tsx](file:///d:/projects/home/src/components/Hero.tsx) da `useProject()` chaqirib, video va sarlavhalarni kontekstdan olish.
  - [src/components/BuildingExplorer.tsx](file:///d:/projects/home/src/components/BuildingExplorer.tsx) ga `initialBuilding={currentProject.building}` uzatish.
  - [src/components/Navbar.tsx](file:///d:/projects/home/src/components/Navbar.tsx) da loyiha nomi va telefonini dinamik ko'rsatish.
- **VALIDATE**: `npm run build` orqali 0 xato bilan yig'ilishini tekshirish.

---

## Validation Commands

```bash
# 1. Type tekshiruvi
npx tsc --noEmit

# 2. ESLint
npx eslint src/

# 3. Next.js to'liq build
npm run build
```
**Kutilayotgan natija**: 0 ta TypeScript xatosi, Next.js muvaffaqiyatli statik sahifalarni generatsiya qiladi.

---

## Acceptance Criteria
- [ ] Xon Saroy, Murad Buildings va The Palisades profillari mavjud.
- [ ] Developer Switcher orqali loyihani almashtirganda sahifani qayta yuklamasdan barcha ma'lumotlar o'zgaradi.
- [ ] Scrollytelling video va boblar har bir loyiha uchun moslashuvchan bo'ladi.
- [ ] `npm run build` 100% muvaffaqiyatli o'tadi.

---

*Reja yaratildi: 2026-09-29*  
*Reja holati: TAYYOR (READY FOR IMPLEMENTATION)*
