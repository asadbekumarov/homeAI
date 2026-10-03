import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import XonSaroy3DShowcase from "./XonSaroy3DShowcase";
import { ProjectProvider } from "@/context/ProjectContext";

// Mock Three.js / Fiber Canvas for jsdom
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drei-html">{children}</div>
  ),
}));

describe("XonSaroy3DShowcase Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <ProjectProvider>
        <XonSaroy3DShowcase />
      </ProjectProvider>
    );

  it("renders 3D showcase header, badges, and highlights", () => {
    renderComponent();

    expect(
      screen.getByText(/3D formatda/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3D Reklama Tur/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Majmua ko'lami")).toBeInTheDocument();
    expect(screen.getByText("14 ta blok")).toBeInTheDocument();
    expect(screen.getByText("36 oygacha 0%")).toBeInTheDocument();
  });

  it("switches day and night lighting modes", async () => {
    const user = userEvent.setup();
    renderComponent();

    const nightBtn = screen.getByRole("button", { name: "Tungi arxitektura" });
    const dayBtn = screen.getByRole("button", { name: "Kunduzgi yoritish" });

    // Switch to night
    await user.click(nightBtn);
    expect(nightBtn).toHaveClass("bg-accent");
    expect(dayBtn).not.toHaveClass("bg-accent");

    // Switch back to day
    await user.click(dayBtn);
    expect(dayBtn).toHaveClass("bg-accent");
    expect(nightBtn).not.toHaveClass("bg-accent");
  });

  it("toggles auto-rotate button state", async () => {
    const user = userEvent.setup();
    renderComponent();

    const rotateBtn = screen.getByRole("button", {
      name: "Avto-aylanishni to'xtatish",
    });
    await user.click(rotateBtn);

    expect(
      screen.getByRole("button", { name: "Avto-aylanishni yoqish" })
    ).toBeInTheDocument();
  });

  it("renders hotspots, selects a hotspot, and closes the detail card", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Hotspots are rendered in canvas Html
    const parkingHotspot = screen.getByRole("button", {
      name: "2 Qavatli Avtoturargoh",
    });
    await user.click(parkingHotspot);

    // Check detail card
    expect(
      screen.getByText(/Aholi va mehmonlar uchun 2 qavatli keng avtoturargoh/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Kvartiralar narxi/i })
    ).toHaveAttribute("href", "#apartments");

    // Close detail card
    const closeBtn = screen.getByRole("button", { name: "Tafsilotni yopish" });
    await user.click(closeBtn);

    expect(
      screen.queryByText(/Yer osti va yer usti zaryadlash stansiyalari/i)
    ).not.toBeInTheDocument();
  });
});
