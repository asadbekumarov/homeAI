import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Interactive3D from "./Interactive3D";
import { ProjectProvider } from "@/context/ProjectContext";

describe("Interactive3D Component", () => {
  it("renders architecture concepts and tower specs", () => {
    render(
      <ProjectProvider>
        <Interactive3D />
      </ProjectProvider>
    );

    expect(screen.getByText("Me'moriy Kontseptsiya")).toBeInTheDocument();
    expect(screen.getByText("A Minora")).toBeInTheDocument();
    expect(screen.getByText("B Minora")).toBeInTheDocument();
    expect(screen.getByText("C Minora")).toBeInTheDocument();
    expect(screen.getByText("Kvartiralarni tanlash")).toBeInTheDocument();
  });

  it("switches active tab when perspective buttons are clicked", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <Interactive3D />
      </ProjectProvider>
    );

    const nightBtn = screen.getByText("Tungi panorama").closest("button")!;
    expect(nightBtn).not.toHaveClass("bg-accent");

    await user.click(nightBtn);
    expect(nightBtn).toHaveClass("bg-accent");

    const perspectiveBtn = screen.getByText("Panoramik burchak").closest("button")!;
    await user.click(perspectiveBtn);
    expect(perspectiveBtn).toHaveClass("bg-accent");
    expect(nightBtn).not.toHaveClass("bg-accent");
  });
});
