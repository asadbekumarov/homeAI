import type { Metadata } from "next";
import { Cormorant, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Palisades — Toshkentdagi hashamatli turar-joy majmuasi",
  description:
    "The Palisades — Toshkent shahrining Yunusobod tumanidagi uchta hashamatli minoradan iborat zamonaviy turar-joy loyihasi. Panoramik manzara, ko'kalamzor hovli va premium qulayliklar.",
  keywords: [
    "The Palisades",
    "Toshkent turar-joy",
    "hashamatli xonadon",
    "yangi binolar Toshkent",
    "premium turar-joy",
    "Yunusobod",
  ],
  openGraph: {
    title: "The Palisades — Osmon bilan yer chegarasida yashang",
    description:
      "Toshkentning eng nufuzli hududida joylashgan uchta hashamatli minoradan iborat turar-joy majmuasi.",
    type: "website",
    locale: "uz_UZ",
    siteName: "The Palisades",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
