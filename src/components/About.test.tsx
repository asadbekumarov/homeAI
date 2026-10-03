import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";
import { ProjectProvider } from "@/context/ProjectContext";

describe("About Component", () => {
  it("renders with default project context data", () => {
    render(
      <ProjectProvider>
        <About />
      </ProjectProvider>
    );

    expect(screen.getByText("Loyiha haqida")).toBeInTheDocument();
    expect(screen.getByText(/Xon Saroy — Orzular/i)).toBeInTheDocument();
    expect(screen.getByText("Shift Balandligi")).toBeInTheDocument();
    expect(screen.getByText("Majmua Ko'lami")).toBeInTheDocument();
  });

  it("renders key stats items properly", () => {
    render(
      <ProjectProvider>
        <About />
      </ProjectProvider>
    );

    expect(screen.getByText("Topshirish muddati")).toBeInTheDocument();
    expect(screen.getByText("Blok")).toBeInTheDocument();
  });
});
