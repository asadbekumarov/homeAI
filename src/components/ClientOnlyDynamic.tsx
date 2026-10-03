"use client";

import dynamic from "next/dynamic";

// ssr: false bo'lgan komponentlar Client Component ichida bo'lishi kerak
// (Next.js 16+ qoidasi — Server Component ichida ssr:false ruxsat etilmaydi)

export const XonSaroy3DShowcase = dynamic(
  () => import("@/components/XonSaroy3DShowcase"),
  {
    ssr: false,
    loading: () => (
      <div id="interactive-3d" className="py-20 text-center text-accent/60 font-mono">
        3D formatda bino yuklanmoqda...
      </div>
    ),
  }
);

export const SmoothScroll = dynamic(
  () => import("@/components/SmoothScroll"),
  { ssr: false }
);

export const MobileQuickBar = dynamic(
  () => import("@/components/MobileQuickBar"),
  { ssr: false }
);
