import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility function", () => {
  it("should merge single or multiple class names", () => {
    expect(cn("class-a", "class-b")).toBe("class-a class-b");
  });

  it("should handle conditional and falsy classes", () => {
    expect(cn("base", false && "ignored", null, undefined, "active")).toBe("base active");
  });

  it("should correctly resolve Tailwind conflict overrides", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle array and object inputs", () => {
    expect(cn(["btn", "btn-primary"], { "opacity-50": true, hidden: false })).toBe(
      "btn btn-primary opacity-50"
    );
  });
});
