import { ProjectConfig } from "@/types/project";
import { muradBuildingsProject } from "./muradBuildings";
import { xonSaroyProject } from "./xonSaroy";

export const PROJECTS_REGISTRY: Record<string, ProjectConfig> = {
  "xon-saroy": xonSaroyProject,
  "murad-buildings": muradBuildingsProject,
};

export const DEFAULT_PROJECT = xonSaroyProject;

export function getProjectBySlug(slug: string): ProjectConfig {
  return PROJECTS_REGISTRY[slug] || DEFAULT_PROJECT;
}
