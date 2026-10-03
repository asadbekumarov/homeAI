import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  it("renders the main page with all sections", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("#main-content")).toBeInTheDocument();
    expect(screen.getAllByText("Loyiha haqida").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nafis me'moriy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Qulayliklar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Joylashuv").length).toBeGreaterThan(0);
    expect(container.querySelector("#interactive-3d")).toBeInTheDocument();
    expect(screen.getByText(/3D formatda/i)).toBeInTheDocument();
    expect(container.querySelector("#calculator")).toBeInTheDocument();
  });
});
