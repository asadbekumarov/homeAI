"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProjectConfig } from "@/types/project";
import { DEFAULT_PROJECT, PROJECTS_REGISTRY, getProjectBySlug } from "@/data/projects";

interface ProjectContextType {
  currentProject: ProjectConfig;
  setProjectSlug: (slug: string) => void;
  availableProjects: ProjectConfig[];
}

const ProjectContext = createContext<ProjectContextType>({
  currentProject: DEFAULT_PROJECT,
  setProjectSlug: () => {},
  availableProjects: [DEFAULT_PROJECT],
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectConfig>(DEFAULT_PROJECT);

  useEffect(() => {
    try {
      const savedSlug = localStorage.getItem("showcase_project_slug");
      if (savedSlug && PROJECTS_REGISTRY[savedSlug]) {
        const project = PROJECTS_REGISTRY[savedSlug];
        queueMicrotask(() => {
          setCurrentProject(project);
        });
      }
    } catch {}
  }, []);

  const setProjectSlug = (slug: string) => {
    const proj = getProjectBySlug(slug);
    setCurrentProject(proj);
    try {
      localStorage.setItem("showcase_project_slug", slug);
    } catch {}
  };

  const availableProjects = Object.values(PROJECTS_REGISTRY);

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setProjectSlug,
        availableProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
