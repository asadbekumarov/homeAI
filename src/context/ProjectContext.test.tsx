import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectProvider, useProject } from "./ProjectContext";
import { muradBuildingsProject } from "@/data/projects/muradBuildings";
import { xonSaroyProject } from "@/data/projects/xonSaroy";

function TestConsumer() {
  const { currentProject, setProjectSlug, availableProjects } = useProject();
  return (
    <div>
      <span data-testid="current-project">{currentProject.projectName}</span>
      <span data-testid="current-slug">{currentProject.slug}</span>
      <span data-testid="projects-count">{availableProjects.length}</span>
      <button
        onClick={() => setProjectSlug("murad-buildings")}
        data-testid="switch-murad"
      >
        Murad
      </button>
      <button
        onClick={() => setProjectSlug("xon-saroy")}
        data-testid="switch-xon"
      >
        Xon
      </button>
    </div>
  );
}

describe("ProjectContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders with default project and available projects list", () => {
    render(
      <ProjectProvider>
        <TestConsumer />
      </ProjectProvider>
    );

    expect(screen.getByTestId("current-project")).toHaveTextContent(
      xonSaroyProject.projectName
    );
    expect(screen.getByTestId("projects-count")).toHaveTextContent("2");
  });

  it("switches project via setProjectSlug and persists to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <TestConsumer />
      </ProjectProvider>
    );

    await user.click(screen.getByTestId("switch-murad"));
    expect(screen.getByTestId("current-slug")).toHaveTextContent("murad-buildings");
    expect(localStorage.getItem("showcase_project_slug")).toBe("murad-buildings");

    await user.click(screen.getByTestId("switch-xon"));
    expect(screen.getByTestId("current-slug")).toHaveTextContent("xon-saroy");
    expect(localStorage.getItem("showcase_project_slug")).toBe("xon-saroy");
  });

  it("loads stored project from localStorage on mount", async () => {
    localStorage.setItem("showcase_project_slug", "murad-buildings");

    render(
      <ProjectProvider>
        <TestConsumer />
      </ProjectProvider>
    );

    // queueMicrotask resolves after current tick
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("current-slug")).toHaveTextContent("murad-buildings");
  });

  it("gracefully handles localStorage failures without crashing", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    render(
      <ProjectProvider>
        <TestConsumer />
      </ProjectProvider>
    );

    await user.click(screen.getByTestId("switch-murad"));
    expect(screen.getByTestId("current-slug")).toHaveTextContent("murad-buildings");
  });
});
