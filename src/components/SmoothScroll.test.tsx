import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import SmoothScroll from "./SmoothScroll";

vi.mock("lenis", () => {
  return {
    default: class MockLenis {
      constructor(opts?: { easing?: (t: number) => number }) {
        if (opts?.easing) {
          opts.easing(0.5);
        }
      }
      raf = vi.fn();
      destroy = vi.fn();
    },
  };
});

describe("SmoothScroll Component", () => {
  beforeEach(() => {
    delete (window as unknown as { ontouchstart?: unknown }).ontouchstart;
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      configurable: true,
    });
  });

  it("renders children wrapped inside", () => {
    render(
      <SmoothScroll>
        <div data-testid="page-content">App Page</div>
      </SmoothScroll>
    );

    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  it("initializes Lenis on desktop, runs raf loop, and cleans up on unmount", () => {
    let rafCb: FrameRequestCallback | null = null;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCb = cb;
      return 1;
    });

    const { unmount } = render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );

    expect(window.__lenis).toBeDefined();
    if (rafCb) (rafCb as (time: number) => void)(100);

    unmount();
    expect(window.__lenis).toBeNull();
  });

  it("bypasses Lenis initialization on touch devices", () => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 5,
      configurable: true,
    });

    render(
      <SmoothScroll>
        <div>Mobile Content</div>
      </SmoothScroll>
    );

    expect(window.__lenis).toBeNull();
  });
});
