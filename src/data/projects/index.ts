import { ProjectConfig } from "@/types/project";
import { muradBuildingsProject } from "./muradBuildings";

export const PROJECTS_REGISTRY: Record<string, ProjectConfig> = {
  "murad-buildings": muradBuildingsProject,
};

export const DEFAULT_PROJECT = muradBuildingsProject;

export function getProjectBySlug(slug: string): ProjectConfig {
  return PROJECTS_REGISTRY[slug] || DEFAULT_PROJECT;
}
