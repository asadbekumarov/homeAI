import { z } from 'zod';

/**
 * Kvartiraning bandlik holati (Status)
 * - available: Bo'sh / sotuvda
 * - reserved: Band qilingan (bron)
 * - sold: Sotilgan
 */
export const ApartmentStatusSchema = z
  .enum(['available', 'reserved', 'sold'])
  .describe("Kvartira bandlik holati: 'available', 'reserved' yoki 'sold'");

export type ApartmentStatus = z.infer<typeof ApartmentStatusSchema>;

/**
 * Kvartira (Apartment) sxemasi
 */
export const ApartmentSchema = z.object({
  id: z.string().min(1, "Kvartira ID bo'sh bo'lmasligi kerak"),
  number: z.number().int().positive("Kvartira raqami musbat butun son bo'lishi kerak"),
  floorNumber: z.number().int().min(1, "Qavat raqami 1 yoki undan yuqori bo'lishi kerak"),
  rooms: z.number().int().min(1, "Xonalar soni kamida 1 ta bo'lishi kerak"),
  area: z.number().positive("Maydoni (m²) musbat son bo'lishi kerak"),
  price: z.number().positive("Narxi musbat son bo'lishi kerak"),
  currency: z.enum(['USD', 'UZS']).default('USD'),
  status: ApartmentStatusSchema,
  // Qo'shimcha foydali ixtiyoriy maydonlar
  planImage: z.string().url("Plan rasm URL manzili to'g'ri bo'lishi kerak").optional(),
  features: z.array(z.string()).default([]),
});

export type Apartment = z.infer<typeof ApartmentSchema>;

/**
 * Qavat (Floor) sxemasi
 */
export const FloorSchema = z.object({
  floorNumber: z.number().int().min(1, "Qavat raqami 1 dan kam bo'lmasligi kerak"),
  apartments: z.array(ApartmentSchema).min(1, "Har bir qavatda kamida 1 ta kvartira bo'lishi kerak"),
  // Qo'shimcha reja yoki ma'lumotlar
  totalApartments: z.number().int().nonnegative().optional(),
}).refine(
  (floor) => floor.apartments.every((apt) => apt.floorNumber === floor.floorNumber),
  {
    message: "Qavatdagi barcha kvartiralarning 'floorNumber' qiymati qavat raqamiga mos kelishi kerak",
    path: ['apartments'],
  }
);

export type Floor = z.infer<typeof FloorSchema>;

/**
 * Ko'p qavatli bino (Building) sxemasi
 */
export const BuildingSchema = z.object({
  id: z.string().min(1, "Bino ID bo'sh bo'lmasligi kerak"),
  name: z.string().min(2, "Bino nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  totalFloors: z.number().int().min(1, "Binoda kamida 1 ta qavat bo'lishi kerak"),
  floors: z.array(FloorSchema).min(1, "Kamida 1 ta qavat ma'lumoti kiritilishi kerak"),
}).refine(
  (building) => building.floors.length <= building.totalFloors,
  {
    message: "Kiritilgan qavatlar soni umumiy qavatlar sonidan oshib ketmasligi kerak",
    path: ['floors'],
  }
);

export type Building = z.infer<typeof BuildingSchema>;

/**
 * Yordamchi funksiyalar (Helper Utilities)
 */


/**
 * Bino bo'yicha umumiy kvartiralar va bandlik statistikasini hisoblash
 */
export function calculateBuildingStats(building: Building) {
  const allApartments = building.floors.flatMap((f) => f.apartments);
  const total = allApartments.length;
  const available = allApartments.filter((a) => a.status === 'available').length;
  const reserved = allApartments.filter((a) => a.status === 'reserved').length;
  const sold = allApartments.filter((a) => a.status === 'sold').length;

  return {
    totalApartments: total,
    available,
    reserved,
    sold,
    occupancyRate: total > 0 ? Math.round(((sold + reserved) / total) * 100) : 0,
  };
}
