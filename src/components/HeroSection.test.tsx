import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { ProjectProvider } from "@/context/ProjectContext";

describe("HeroSection Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ProjectProvider>{ui}</ProjectProvider>);
  };

  it("renders the primary project title", () => {
    renderWithProvider(<HeroSection />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the scroll down explore prompt", () => {
    renderWithProvider(<HeroSection />);

    const scrollBtn = screen.getByRole("button", { name: /pastga aylantirib ko'rish/i });
    expect(scrollBtn).toBeInTheDocument();
  });
});
