import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Location from "./Location";
import { ProjectProvider } from "@/context/ProjectContext";

describe("Location Component", () => {
  it("renders address, landmarks, and project information", () => {
    render(
      <ProjectProvider>
        <Location />
      </ProjectProvider>
    );

    expect(screen.getByText("Joylashuv")).toBeInTheDocument();
    expect(screen.getByText(/Shahar/i)).toBeInTheDocument();
    expect(screen.getByText("Manzil")).toBeInTheDocument();
    expect(screen.getByText("Asosiy mo'ljallar va masofa")).toBeInTheDocument();
  });

  it("renders map links for external navigation", () => {
    render(
      <ProjectProvider>
        <Location />
      </ProjectProvider>
    );

    const googleLink = screen.getByRole("link", { name: /Google Maps/i });
    const yandexLink = screen.getByRole("link", { name: /Yandex Maps/i });

    expect(googleLink).toHaveAttribute("href", expect.stringContaining("maps.google.com"));
    expect(yandexLink).toHaveAttribute("href", expect.stringContaining("yandex.com/maps"));
  });
});
