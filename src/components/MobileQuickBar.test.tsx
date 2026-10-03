import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileQuickBar from "./MobileQuickBar";

describe("MobileQuickBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  it("does not render when window.scrollY <= 250", () => {
    const { container } = render(<MobileQuickBar />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when user scrolls past 250px", () => {
    render(<MobileQuickBar />);

    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 300,
        writable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.getByRole("complementary", { name: "Mobil tezkor harakat paneli" })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "3D Bino" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Galereya" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kvartiralar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Aloqa" })).toBeInTheDocument();
  });

  it("handles clicking nav items and scrolls to section", async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();

    // Create target dummy elements in document
    const targetEl = document.createElement("div");
    targetEl.id = "apartments";
    targetEl.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(targetEl);

    render(<MobileQuickBar />);

    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 400,
        writable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    const apartmentsBtn = screen.getByRole("link", { name: "Kvartiralar" });
    await user.click(apartmentsBtn);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    // Clean up
    document.body.removeChild(targetEl);
  });
});
