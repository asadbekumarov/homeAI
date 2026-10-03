import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Amenities from "./Amenities";

describe("Amenities Component", () => {
  it("renders section header and badge", () => {
    render(<Amenities />);

    expect(screen.getByText("Qulayliklar")).toBeInTheDocument();
    expect(screen.getByText(/Hayotingiz uchun/i)).toBeInTheDocument();
  });

  it("renders all key amenities cards", () => {
    render(<Amenities />);

    expect(screen.getByText("2 qavatli avtoturargoh")).toBeInTheDocument();
    expect(screen.getByText("Bolalar va sport zonalari")).toBeInTheDocument();
    expect(screen.getByText("24/7 Xavfsizlik tizimi")).toBeInTheDocument();
    expect(screen.getByText("Tijorat zonalari (3 qavat)")).toBeInTheDocument();
    expect(screen.getByText("3.1 Metr baland shiftlar")).toBeInTheDocument();
    expect(screen.getByText("Muhtasham Saroy Servis")).toBeInTheDocument();
    expect(screen.getByText("Tezyurar shovqinsiz liftlar")).toBeInTheDocument();
    expect(screen.getByText("Elektromobil zaryadlash")).toBeInTheDocument();
  });
});
