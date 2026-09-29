import type { Metadata } from "next";
import { Cormorant, Inter, Outfit, Space_Mono } from "next/font/google";
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

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Murad Buildings — Toshkentdagi hashamatli turar-joy majmualari",
  description:
    "Murad Buildings — Baxt ulashamiz. Toshkent shahrining nufuzli hududidagi hashamatli minoralar, panoramik shahar manzarasi, xavfsiz yashil hovli va 5 yulduzli qulayliklar.",
  keywords: [
    "Murad Buildings",
    "Do'stlar rezidensiyasi",
    "Toshkent turar-joy",
    "hashamatli xonadon",
    "yangi binolar Toshkent",
    "premium turar-joy",
    "Nest One",
  ],
  openGraph: {
    title: "Murad Buildings — Baxt ulashamiz",
    description:
      "Murad Buildings tomonidan barpo etilayotgan premium darajadagi zamonaviy turar-joy majmuasi.",
    type: "website",
    locale: "uz_UZ",
    siteName: "Murad Buildings",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${cormorant.variable} ${inter.variable} ${outfit.variable} ${spaceMono.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-[#0C0B0A] text-[#F6F4F0] antialiased">
        {children}
      </body>
    </html>
  );
}
