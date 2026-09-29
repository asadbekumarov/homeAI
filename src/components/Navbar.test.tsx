import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { ProjectProvider } from "@/context/ProjectContext";

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ProjectProvider>{ui}</ProjectProvider>);
  };

  it("renders the brand header and default developer name", () => {
    renderWithProvider(<Navbar />);

    const brandLink = screen.getByRole("link", { name: /murad buildings bosh sahifa/i });
    expect(brandLink).toBeInTheDocument();
  });

  it("renders desktop navigation links in both selects", () => {
    renderWithProvider(<Navbar />);

    expect(screen.getByRole("button", { name: /majmua va arxitektura bo'limlari/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hudud va infratuzilma bo'limlari/i })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /loyiha/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /3d ko'rinish/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /kvartiralar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /galereya/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /qulayliklar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /joylashuv/i })).toBeInTheDocument();
  });

  it("renders the primary Bog'lanish CTA button", () => {
    renderWithProvider(<Navbar />);

    const ctaLinks = screen.getAllByRole("link", { name: /bog'lanish/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]).toHaveAttribute("href", "#contact");
  });

  it("toggles the mobile drawer menu on hamburger button click", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /asosiy menyuni ochish/i });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Close menu
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when Escape key is pressed", async () => {
    const user = userEvent.setup();
    renderWithProvider(<Navbar />);

    const menuButton = screen.getByRole("button", { name: /asosiy menyuni ochish/i });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
