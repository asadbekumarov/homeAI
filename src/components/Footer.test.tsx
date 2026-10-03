import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "./Footer";
import { ProjectProvider } from "@/context/ProjectContext";

describe("Footer Component", () => {
  it("renders branding, contact details, and copyright", () => {
    render(
      <ProjectProvider>
        <Footer />
      </ProjectProvider>
    );

    expect(screen.getByText(/Havolalar/i)).toBeInTheDocument();
    expect(screen.getByText(/Ijtimoiy tarmoqlar/i)).toBeInTheDocument();
    expect(screen.getByText(/Barcha huquqlar himoyalangan/i)).toBeInTheDocument();
  });

  it("handles smooth scrolling on anchor click with lenis or native fallback", async () => {
    const user = userEvent.setup();
    const mockScrollTo = vi.fn();
    window.__lenis = { scrollTo: mockScrollTo } as unknown as typeof window.__lenis;

    const mockTarget = document.createElement("div");
    mockTarget.id = "about";
    document.body.appendChild(mockTarget);

    render(
      <ProjectProvider>
        <Footer />
      </ProjectProvider>
    );

    const aboutLink = screen.getByRole("link", { name: "Loyiha haqida" });
    await user.click(aboutLink);

    expect(mockScrollTo).toHaveBeenCalledWith(mockTarget, { duration: 1.2 });

    // Test scrollToTop button
    const toTopBtn = screen.getByRole("button", { name: /Tepaga qaytish/i });
    await user.click(toTopBtn);
    expect(mockScrollTo).toHaveBeenCalledWith(0, { duration: 1.2 });

    // Clean up
    document.body.removeChild(mockTarget);
    delete window.__lenis;
  });

  it("falls back to window.scrollTo when lenis is not present", async () => {
    const user = userEvent.setup();
    window.scrollTo = vi.fn();

    render(
      <ProjectProvider>
        <Footer />
      </ProjectProvider>
    );

    const toTopBtn = screen.getByRole("button", { name: /Tepaga qaytish/i });
    await user.click(toTopBtn);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    // Test anchor click fallback
    const mockTarget = document.createElement("div");
    mockTarget.id = "location";
    document.body.appendChild(mockTarget);

    const locationLink = screen.getByRole("link", { name: "Joylashuv" });
    await user.click(locationLink);

    document.body.removeChild(mockTarget);
  });
});
