import { describe, it, expect } from "vitest";
import {
  calculateBuildingStats,
  ApartmentStatusSchema,
  ApartmentSchema,
  FloorSchema,
  BuildingSchema,
  type Building,
} from "./building";

describe("Building Types and Utilities", () => {
  describe("calculateBuildingStats", () => {
    it("should calculate correct stats for a building with mixed apartments", () => {
      const mockBuilding: Building = {
        id: "b1",
        name: "Test Tower",
        totalFloors: 2,
        floors: [
          {
            floorNumber: 1,
            apartments: [
              {
                id: "apt-1",
                number: 101,
                floorNumber: 1,
                rooms: 2,
                area: 55,
                price: 60000,
                currency: "USD",
                status: "available",
                features: ["Balcon"],
              },
              {
                id: "apt-2",
                number: 102,
                floorNumber: 1,
                rooms: 3,
                area: 80,
                price: 85000,
                currency: "USD",
                status: "reserved",
                features: [],
              },
            ],
          },
          {
            floorNumber: 2,
            apartments: [
              {
                id: "apt-3",
                number: 201,
                floorNumber: 2,
                rooms: 1,
                area: 40,
                price: 45000,
                currency: "USD",
                status: "sold",
                features: [],
              },
              {
                id: "apt-4",
                number: 202,
                floorNumber: 2,
                rooms: 2,
                area: 60,
                price: 65000,
                currency: "USD",
                status: "sold",
                features: [],
              },
            ],
          },
        ],
      };

      const stats = calculateBuildingStats(mockBuilding);
      expect(stats.totalApartments).toBe(4);
      expect(stats.available).toBe(1);
      expect(stats.reserved).toBe(1);
      expect(stats.sold).toBe(2);
      // (1 reserved + 2 sold) / 4 = 75%
      expect(stats.occupancyRate).toBe(75);
    });

    it("should handle an empty building gracefully", () => {
      const emptyBuilding = {
        id: "empty",
        name: "Empty Tower",
        totalFloors: 1,
        floors: [],
      } as unknown as Building;

      const stats = calculateBuildingStats(emptyBuilding);
      expect(stats.totalApartments).toBe(0);
      expect(stats.available).toBe(0);
      expect(stats.reserved).toBe(0);
      expect(stats.sold).toBe(0);
      expect(stats.occupancyRate).toBe(0);
    });
  });

  describe("Zod Schemas Validation", () => {
    it("ApartmentStatusSchema validates valid and invalid statuses", () => {
      expect(ApartmentStatusSchema.parse("available")).toBe("available");
      expect(ApartmentStatusSchema.parse("reserved")).toBe("reserved");
      expect(ApartmentStatusSchema.parse("sold")).toBe("sold");
      expect(() => ApartmentStatusSchema.parse("unknown")).toThrow();
    });

    it("ApartmentSchema parses valid apartment and rejects invalid inputs", () => {
      const valid = {
        id: "apt-1",
        number: 10,
        floorNumber: 2,
        rooms: 2,
        area: 60,
        price: 70000,
        currency: "USD",
        status: "available",
      };
      const parsed = ApartmentSchema.parse(valid);
      expect(parsed.id).toBe("apt-1");
      expect(parsed.features).toEqual([]);

      // Invalid negative area
      expect(() => ApartmentSchema.parse({ ...valid, area: -10 })).toThrow();
      // Invalid empty id
      expect(() => ApartmentSchema.parse({ ...valid, id: "" })).toThrow();
      // Invalid floorNumber < 1
      expect(() => ApartmentSchema.parse({ ...valid, floorNumber: 0 })).toThrow();
    });

    it("FloorSchema validates apartment floor consistency", () => {
      const validFloor = {
        floorNumber: 3,
        apartments: [
          {
            id: "apt-31",
            number: 31,
            floorNumber: 3,
            rooms: 2,
            area: 55,
            price: 60000,
            status: "available",
            currency: "USD",
          },
        ],
      };
      expect(FloorSchema.parse(validFloor).floorNumber).toBe(3);

      // Inconsistent floor number in apartment
      const inconsistentFloor = {
        floorNumber: 3,
        apartments: [
          {
            id: "apt-31",
            number: 31,
            floorNumber: 2, // mismatch!
            rooms: 2,
            area: 55,
            price: 60000,
            status: "available",
            currency: "USD",
          },
        ],
      };
      expect(() => FloorSchema.parse(inconsistentFloor)).toThrow();
    });

    it("BuildingSchema validates floors length against totalFloors", () => {
      const validBuilding = {
        id: "b-test",
        name: "Test",
        totalFloors: 2,
        floors: [
          {
            floorNumber: 1,
            apartments: [
              {
                id: "a1",
                number: 1,
                floorNumber: 1,
                rooms: 1,
                area: 40,
                price: 40000,
                status: "available",
                currency: "USD",
              },
            ],
          },
        ],
      };
      expect(BuildingSchema.parse(validBuilding).name).toBe("Test");

      // Too many floors compared to totalFloors
      const invalidBuilding = {
        ...validBuilding,
        totalFloors: 1,
        floors: [
          validBuilding.floors[0],
          {
            floorNumber: 2,
            apartments: [
              {
                id: "a2",
                number: 2,
                floorNumber: 2,
                rooms: 1,
                area: 40,
                price: 40000,
                status: "available",
                currency: "USD",
              },
            ],
          },
        ],
      };
      expect(() => BuildingSchema.parse(invalidBuilding)).toThrow();
    });
  });
});
