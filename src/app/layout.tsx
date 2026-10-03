import type { Metadata } from "next";
// Inter olib tashlandi — Outfit uni to'liq almashtiradi (ikki font bir xil vazifani bajaradi)
import { Cormorant, Outfit, Space_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  // 5 weight → 3 weight: sahifada ishlatiladigan minimumga tushirildi
  weight: ["300", "400", "600"],
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  // Faqat ishlatiladigan weightlar
  weight: ["300", "400", "500"],
  preload: true,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  // Faqat regular — mono font LCP'ga ta'sir qilmaydi
  weight: ["400"],
  // preload: false — sahifa yuklangandan keyin yuklanadi
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xonsaroy.uz"),
  title: {
    default: "Xon Saroy — Orzular | Toshkentdagi Zamonaviy Turar-Joy Majmuasi",
    template: "%s | Xon Saroy",
  },
  description:
    "Xon Saroy — Orzular turar-joy majmuasi. Toshkent, Yunusobod tumani. 14 ta blok, 1600 ta xonadon, 3.1m shiftlar, 2 qavatli avtoturargoh va 18–36 oygacha foizsiz muddatli to‘lov (rassrochka).",
  keywords: [
    "Xon Saroy",
    "Xon Saroy Orzular",
    "Xon Saroy Yunusobod",
    "Toshkentda yangi uylar",
    "Yunusobodda kvartira sotib olish",
    "Toshkent turar joy majmualari",
    "Kvartira rassrochka Toshkent",
    "1 xonali kvartira Toshkent",
    "2 xonali kvartira Toshkent",
    "novostroyki Tashkent Yunusabad",
    "kupit kvartiru v Tashkente",
    "rassrochka uylar Toshkent",
    "Muhtasham Saroy servis",
    "Xon Saroy rasmiy sayti",
  ],
  authors: [{ name: "Xon Saroy", url: "https://xonsaroy.uz" }],
  creator: "Xon Saroy",
  publisher: "Xon Saroy Development",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png" },
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Xon Saroy — Orzular | Orzulardan ilhomlangan",
    description:
      "14 ta blok, 1600 ta zamonaviy xonadon, 3.1m baland shiftlar va 18–36 oygacha foizsiz muddatli to‘lov. Toshkent shahri, Yunusobod tumani.",
    url: "https://xonsaroy.uz",
    siteName: "Xon Saroy",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU"],
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Xon Saroy — Orzular turar-joy majmuasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xon Saroy — Orzular | Toshkent",
    description:
      "14 ta blok, 1600 ta xonadon, 3.1m shiftlar va 18–36 oygacha 0% muddatli to‘lov (rassrochka).",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://xonsaroy.uz",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "Xon Saroy — Orzular",
  alternateName: "Xon Saroy Orzular",
  description:
    "Zamonaviy arxitektura va ilg‘or infratuzilmani o‘zida mujassam etgan Komfort va Biznes klass toifasidagi muhtasham turar-joy majmuasi. 14 ta blok, 1600 ta xonadon, 3.1 metrli shiftlar va 18-36 oygacha foizsiz muddatli to'lov.",
  url: "https://xonsaroy.uz",
  telephone: "+998712007400",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Katta halqa yo‘li bo‘yi",
    addressLocality: "Toshkent",
    addressRegion: "Yunusobod tumani",
    addressCountry: "UZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.368,
    longitude: 69.288,
  },
  numberOfAccommodationUnits: 1600,
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "2 qavatli yer osti va yer usti avtoturargohi",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Elektromobil zaryadlash stansiyalari",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Sun'iy qoplamali futbol maydoni",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "24/7 video nazorat va qo'riqlash xizmati",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "3.1 metr shift balandligi",
      value: true,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      // Inter o'chirildi — fontlar 4 ta → 3 ta
      className={cn("antialiased", "dark", cormorant.variable, outfit.variable, spaceMono.variable, "font-sans", geist.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          --vh skripti o'chirildi:
          globals.css da '--vh: 1svh' fallback allaqachon mavjud.
          svh unit zamonaviy iOS Safari (15.4+), Chrome 108+ da ishlaydi.
          Agarda eski iOS qo'llab-quvvatlash kerak bo'lsa, bu blokni qaytarish mumkin.
        */}
      </head>
      <body className="min-h-screen bg-[#0C0B0A] text-[#F6F4F0] antialiased">
        {children}
      </body>
    </html>
  );
}
