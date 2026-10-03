import { describe, it, expect } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

describe("App Metadata Handlers", () => {
  it("robots generates correct rules and points to sitemap", () => {
    const res = robots();
    expect(res.rules).toBeDefined();
    expect(res.sitemap).toContain("sitemap.xml");
  });

  it("sitemap generates indexed pages with priority and frequency", () => {
    const urls = sitemap();
    expect(Array.isArray(urls)).toBe(true);
    expect(urls.length).toBeGreaterThan(0);
    expect(urls[0].url).toBe("https://xonsaroy.uz");
    expect(urls.some((item) => item.url.includes("#apartments"))).toBe(true);
  });
});
