import { describe, it, expect } from "vitest";
import Hero, * as HeroExports from "./Hero";
import HeroSection from "./HeroSection";

describe("Hero Re-export", () => {
  it("re-exports HeroSection as default export", () => {
    expect(Hero).toBe(HeroSection);
  });

  it("exports modules appropriately", () => {
    expect(HeroExports.default).toBe(HeroSection);
  });
});
