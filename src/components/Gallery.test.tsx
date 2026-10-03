import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "./Gallery";

describe("Gallery Component", () => {
  it("renders gallery title and category filter buttons", () => {
    render(<Gallery />);

    expect(screen.getByText(/Nafis me'moriy/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Barchasi" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tashqi ko'rinish" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ichki xonalar" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Qulayliklar" })
    ).toBeInTheDocument();
  });

  it("filters gallery items when category button is clicked", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    const interiorBtn = screen.getByRole("button", { name: "Ichki xonalar" });
    await user.click(interiorBtn);

    expect(screen.getByText("Grand Penthouse")).toBeInTheDocument();
    expect(screen.getByText("Dizaynerlik oshxonasi")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Monolit fasad")).not.toBeInTheDocument();
    });
  });

  it("opens lightbox modal, navigates next/prev and closes modal", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    // Click on an image card to open lightbox
    const firstCard = screen.getByText("Monolit fasad");
    await user.click(firstCard);

    // Lightbox modal should be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Navigate to next
    const nextBtn = screen.getByRole("button", { name: "Keyingi fotosurat" });
    await user.click(nextBtn);

    // Navigate to prev
    const prevBtn = screen.getByRole("button", { name: "Oldingi fotosurat" });
    await user.click(prevBtn);

    // Close via close button
    const closeBtn = screen.getByRole("button", { name: "Yopish (ESC)" });
    await user.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes lightbox on Escape key", async () => {
    const user = userEvent.setup();
    render(<Gallery />);

    const card = screen.getByText("Monolit fasad");
    await user.click(card);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
