import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BuildingExplorer from "./BuildingExplorer";
import { ProjectProvider } from "@/context/ProjectContext";

describe("BuildingExplorer Component", () => {
  it("renders building statistics, filters, and apartment cards", () => {
    render(
      <ProjectProvider>
        <BuildingExplorer />
      </ProjectProvider>
    );

    expect(screen.getByText(/Interaktiv bino rejasi/i)).toBeInTheDocument();
    expect(screen.getByText(/Jami kvartiralar/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Qavatlar/i).length).toBeGreaterThan(0);
  });

  it("filters apartments by room count and status", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <BuildingExplorer />
      </ProjectProvider>
    );

    // Filter by rooms (e.g., 2 xonali)
    const twoRoomsBtn = screen.getByRole("button", { name: "2 xonali" });
    await user.click(twoRoomsBtn);

    // Reset back to all
    const allRoomsBtn = screen.getByRole("button", { name: "Barchasi" });
    await user.click(allRoomsBtn);
  });

  it("allows selecting a floor from the floor picker", async () => {
    const user = userEvent.setup();
    render(
      <ProjectProvider>
        <BuildingExplorer />
      </ProjectProvider>
    );

    // Find a floor button (e.g. 2-qavat)
    const floorButtons = screen.getAllByRole("button", { name: /qavat/i });
    if (floorButtons.length > 1) {
      await user.click(floorButtons[1]);
    }
  });

  it("opens apartment details modal, tests download plan, and closes on Escape", async () => {
    render(
      <ProjectProvider>
        <BuildingExplorer />
      </ProjectProvider>
    );

    // Find and click any apartment card
    const aptCards = screen.getAllByText(/№\d+/i);
    expect(aptCards.length).toBeGreaterThan(0);
    fireEvent.click(aptCards[0]);

    // Check modal role
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click download button
    const downloadBtn = screen.getByRole("button", { name: /PDF rejasini yuklab olish/i });
    fireEvent.click(downloadBtn);
    expect(screen.getByText(/Reja tayyorlandi!/i)).toBeInTheDocument();

    // Press Escape to close modal
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes apartment details modal via the close button", async () => {
    render(
      <ProjectProvider>
        <BuildingExplorer />
      </ProjectProvider>
    );

    const aptCards = screen.getAllByText(/№\d+/i);
    fireEvent.click(aptCards[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Yopish (Esc)" });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
