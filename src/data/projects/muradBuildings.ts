import { ProjectConfig, ProjectConfigSchema } from "@/types/project";
import { mockBuildingData } from "@/data/buildingData";

export const muradBuildingsProject: ProjectConfig = ProjectConfigSchema.parse({
  id: "mb-dostlar",
  slug: "murad-buildings",
  developerName: "Murad Buildings",
  projectName: "Murad Buildings",
  tagline: "Baxtli oilalar uchun qurilgan me'moriy san'at",
  location: "Toshkent · Mirobod tumani",
  address: "Toshkent sh., Mirobod tumani, Oybek ko'chasi, 38a",
  phone: "+998 71 200 88 22",
  email: "sales@m-buildings.uz",
  telegram: "https://t.me/muradbuildings_uz",
  whatsapp: "https://wa.me/998712008822",
  heroVideoUrl: "/videos/professional_qilb_ber_shuni_ma.mp4",
  theaterVideoUrl: "/videos/professional_qilb_ber_shuni_ma.mp4",
  posterUrl: "/gallery/exterior-1.jpg",
  badgeText: "Toshkent · Murad Buildings · Baxt Ulashamiz",
  accentColor: "#C5A059",
  chapters: [
    {
      code: "01",
      title: "Me'moriy Kontseptsiya",
      subtitle: "Murad Buildings monolit fasadlari",
      target: 0.0,
    },
    {
      code: "02",
      title: "Grand Lobbi",
      subtitle: "Marmar va 24/7 xizmat",
      target: 0.38,
    },
    {
      code: "03",
      title: "Xavfsiz Yashil Hudud",
      subtitle: "Maxsus landshaft va osoyishtalik",
      target: 0.68,
    },
    {
      code: "04",
      title: "Premium Xonadonlar",
      subtitle: "Panoramik shahar manzarasi",
      target: 0.92,
    },
  ],
  building: mockBuildingData,
  stats: [
    { value: "3", label: "Minora" },
    { value: "28", label: "Qavat" },
    { value: "460+", label: "Xonadon" },
    { value: "2027", label: "Topshirish yili" },
  ],
});
