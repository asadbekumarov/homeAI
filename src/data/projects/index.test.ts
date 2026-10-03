import { describe, it, expect } from "vitest";
import {
  PROJECTS_REGISTRY,
  DEFAULT_PROJECT,
  getProjectBySlug,
} from "./index";

describe("Projects Registry & Helper", () => {
  it("contains default project and valid configurations", () => {
    expect(DEFAULT_PROJECT).toBeDefined();
    expect(PROJECTS_REGISTRY["xon-saroy"]).toBeDefined();
    expect(PROJECTS_REGISTRY["murad-buildings"]).toBeDefined();
  });

  it("getProjectBySlug returns correct project for existing slugs", () => {
    expect(getProjectBySlug("xon-saroy").slug).toBe("xon-saroy");
    expect(getProjectBySlug("murad-buildings").slug).toBe("murad-buildings");
  });

  it("getProjectBySlug falls back to DEFAULT_PROJECT for unknown or empty slug", () => {
    expect(getProjectBySlug("non-existent-slug")).toBe(DEFAULT_PROJECT);
    expect(getProjectBySlug("")).toBe(DEFAULT_PROJECT);
  });
});
