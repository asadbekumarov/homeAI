import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MortgageCalculator from "./MortgageCalculator";
import { ProjectProvider } from "@/context/ProjectContext";

describe("MortgageCalculator Component", () => {
  const renderCalculator = () => {
    return render(
      <ProjectProvider>
        <MortgageCalculator />
      </ProjectProvider>
    );
  };

  it("renders calculator section and default 0% installment state", () => {
    const { container } = renderCalculator();
    expect(container.querySelector("#calculator")).toBeInTheDocument();
    expect(screen.getAllByText(/0% Rassrochka/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Bank Ipotekasi/i })).toBeInTheDocument();
    expect(screen.getByText(/Kvartira narxi/i)).toBeInTheDocument();
    expect(screen.getByText(/Boshlang'ich to'lov/i)).toBeInTheDocument();
    expect(screen.getByText(/0% Foizsiz muddatli to'lov/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "24 oy" })).toBeInTheDocument();
  });

  it("switches to Bank Ipotekasi mode and back", () => {
    renderCalculator();
    const mortgageBtn = screen.getByRole("button", { name: /Bank Ipotekasi/i });
    fireEvent.click(mortgageBtn);

    expect(screen.getByText(/18% Yillik bank ipotekasi/i)).toBeInTheDocument();
    expect(screen.getByText(/Ipoteka muddati \(yil\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "15 yil" })).toBeInTheDocument();

    const installmentBtn = screen.getByRole("button", { name: /0% Rassrochka/i });
    fireEvent.click(installmentBtn);
    expect(screen.getByText(/0% Foizsiz muddatli to'lov/i)).toBeInTheDocument();
  });

  it("toggles currency between USD and UZS", () => {
    renderCalculator();
    const uzsBtn = screen.getByRole("button", { name: /UZS/i });
    fireEvent.click(uzsBtn);

    expect(screen.getAllByText(/so'm/i).length).toBeGreaterThan(0);

    const usdBtn = screen.getByRole("button", { name: /USD/i });
    fireEvent.click(usdBtn);
    expect(screen.getAllByText(/\$/i).length).toBeGreaterThan(0);
  });

  it("updates down payment percentage using quick pills and range input", () => {
    renderCalculator();
    const pill50 = screen.getByRole("button", { name: "50%" });
    fireEvent.click(pill50);

    expect(pill50).toHaveClass("border-accent");

    const rangeInput = screen.getByLabelText(/Boshlang'ich to'lov/i);
    fireEvent.change(rangeInput, { target: { value: "40" } });
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("updates price using price slider", () => {
    renderCalculator();
    const priceInput = screen.getByLabelText(/Kvartira narxi/i);
    fireEvent.change(priceInput, { target: { value: "120000" } });
    expect(screen.getAllByText("$120,000").length).toBeGreaterThan(0);
  });

  it("updates duration using quick duration pills in both modes", () => {
    renderCalculator();
    // Installment mode months
    const pill36 = screen.getByRole("button", { name: "36 oy" });
    fireEvent.click(pill36);
    expect(pill36).toHaveClass("bg-accent");

    // Switch to mortgage mode
    const mortgageBtn = screen.getByRole("button", { name: /Bank Ipotekasi/i });
    fireEvent.click(mortgageBtn);

    const pill20 = screen.getByRole("button", { name: "20 yil" });
    fireEvent.click(pill20);
    expect(pill20).toHaveClass("bg-accent");
  });

  it("toggles the 12-month amortization schedule accordion", () => {
    renderCalculator();
    const scheduleToggle = screen.getByRole("button", {
      name: /Dastlabki 12 oylik to'lov jadvalini ko'rish/i,
    });

    expect(screen.queryByText("#1")).not.toBeInTheDocument();

    fireEvent.click(scheduleToggle);
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#12")).toBeInTheDocument();

    fireEvent.click(scheduleToggle);
    expect(screen.queryByText("#1")).not.toBeInTheDocument();
  });

  it("renders booking CTA button linking to #contact", () => {
    renderCalculator();
    const ctaLink = screen.getByRole("link", {
      name: /Ushbu shartlar bilan bron qilish/i,
    });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "#contact");
  });

  it("renders with fallback project name when rendered outside ProjectProvider", () => {
    render(<MortgageCalculator />);
    expect(screen.getByText(/Moliyaviy Hisoblagich/i)).toBeInTheDocument();
  });
});
