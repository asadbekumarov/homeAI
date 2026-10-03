import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollReveal from "./ScrollReveal";

describe("ScrollReveal Component", () => {
  it("renders children content accurately", () => {
    render(
      <ScrollReveal>
        <span data-testid="child-element">Reveal Content</span>
      </ScrollReveal>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Reveal Content")).toBeInTheDocument();
  });

  it("applies custom class names and handles direction props", () => {
    const { container, rerender } = render(
      <ScrollReveal className="custom-class" direction="left" delay={0.2}>
        <div>Animated Child</div>
      </ScrollReveal>
    );

    expect(container.firstChild).toHaveClass("custom-class");

    // test directions: down, right, none
    rerender(
      <ScrollReveal direction="down">
        <div>Down</div>
      </ScrollReveal>
    );
    expect(screen.getByText("Down")).toBeInTheDocument();

    rerender(
      <ScrollReveal direction="right">
        <div>Right</div>
      </ScrollReveal>
    );
    expect(screen.getByText("Right")).toBeInTheDocument();

    rerender(
      <ScrollReveal direction="none">
        <div>None</div>
      </ScrollReveal>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
