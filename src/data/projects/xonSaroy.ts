import { ProjectConfig, ProjectConfigSchema } from "@/types/project";
import { mockBuildingData } from "@/data/buildingData";

export const xonSaroyProject: ProjectConfig = ProjectConfigSchema.parse({
  id: "xs-orzular",
  slug: "xon-saroy",
  developerName: "Xon Saroy",
  projectName: "Xon Saroy — Orzular",
  tagline: "Orzulardan ilhomlangan",
  location: "Toshkent · Yunusobod tumani",
  address: "Toshkent sh., Yunusobod tumani, Katta halqa yo‘li bo‘yi",
  phone: "+998 (71) 200-74-00",
  email: "info@xonsaroy.uz",
  telegram: "https://t.me/XonSaroy",
  whatsapp: "https://wa.me/998712007400",
  heroVideoUrl: "/videos/professional_qilb_ber_shuni_ma.mp4",
  theaterVideoUrl: "/videos/professional_qilb_ber_shuni_ma.mp4",
  posterUrl: "/gallery/exterior-1.jpg",
  badgeText: "Toshkent · Xon Saroy — Orzular · Muhtasham Hayot",
  accentColor: "#C5A059",
  chapters: [
    {
      code: "01",
      title: "Me'moriy Kontseptsiya",
      subtitle: "14 ta blokdan iborat zamonaviy majmua",
      target: 0.0,
    },
    {
      code: "02",
      title: "Muhtasham Saroy Servis",
      subtitle: "24/7 xavfsizlik, qo'riqlash va konsyerj",
      target: 0.38,
    },
    {
      code: "03",
      title: "Ekologik Yashil Hovli",
      subtitle: "Bolalar maydonchasi va futbol maydoni",
      target: 0.68,
    },
    {
      code: "04",
      title: "1600 ta Zamonaviy Xonadon",
      subtitle: "3.1m shiftlar va 10 xildan ortiq reja",
      target: 0.92,
    },
  ],
  building: {
    ...mockBuildingData,
    name: "Xon Saroy — Orzular",
  },
  stats: [
    { value: "14", label: "Blok" },
    { value: "16", label: "Qavat" },
    { value: "1600", label: "Xonadon" },
    { value: "2026", label: "Topshirish muddati" },
  ],
});
