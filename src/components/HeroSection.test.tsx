import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroSection from "./HeroSection";
import Hero from "./Hero";
import { ProjectProvider } from "@/context/ProjectContext";

describe("HeroSection Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ProjectProvider>{ui}</ProjectProvider>);
  };

  it("renders the primary project title", () => {
    renderWithProvider(<HeroSection />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("renders the scroll down explore prompt and handles click", async () => {
    const user = userEvent.setup();
    window.scrollTo = vi.fn();

    renderWithProvider(<HeroSection />);

    const scrollBtn = screen.getByRole("button", { name: /pastga aylantirib ko'rish/i });
    expect(scrollBtn).toBeInTheDocument();

    await user.click(scrollBtn);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("handles video loadedmetadata, loadeddata, and canplay events", () => {
    const { container } = renderWithProvider(<HeroSection />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();

    if (video) {
      Object.defineProperty(video, "duration", { value: 60, configurable: true });
      fireEvent.loadedMetadata(video);
      fireEvent.loadedData(video);
      fireEvent.canPlay(video);
      fireEvent.seeked(video);
    }
  });

  it("runs scrollytelling updateVideoTime RAF loop when video has duration", () => {
    Object.defineProperty(HTMLMediaElement.prototype, "duration", {
      value: 60,
      configurable: true,
      writable: true,
    });

    const originalRaf = window.requestAnimationFrame;
    const callbacks: FrameRequestCallback[] = [];
    window.requestAnimationFrame = (cb) => {
      callbacks.push(cb);
      return callbacks.length;
    };

    const { container } = renderWithProvider(<HeroSection />);
    const section = container.querySelector("#hero") as HTMLElement;
    if (section) {
      Object.defineProperty(section, "offsetHeight", {
        value: 3000,
        configurable: true,
      });
      section.getBoundingClientRect = () => ({
        top: -500,
        bottom: 2500,
        height: 3000,
        left: 0,
        right: 1000,
        width: 1000,
        x: 0,
        y: -500,
        toJSON: () => {},
      });
    }

    const video = container.querySelector("video");
    if (video) {
      fireEvent.loadedMetadata(video);
    }

    act(() => {
      // Run two iterations of the RAF loop
      const initialBatch = [...callbacks];
      callbacks.length = 0;
      initialBatch.forEach((cb) => cb(performance.now()));

      const secondBatch = [...callbacks];
      callbacks.length = 0;
      secondBatch.forEach((cb) => cb(performance.now() + 100));
    });

    window.requestAnimationFrame = originalRaf;
  });

  it("handles user interactions to cancel auto-play", () => {
    renderWithProvider(<HeroSection />);

    fireEvent.wheel(window);
    fireEvent.touchStart(window);
    fireEvent.keyDown(window, { code: "ArrowDown" });
    fireEvent.keyDown(window, { code: "Space" });
  });

  it("handles video error and retry button click", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProvider(<HeroSection />);

    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();

    if (video) {
      fireEvent.error(video);
    }

    expect(screen.getByText("Video yuklanmadi")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /Qayta/i });
    await user.click(retryBtn);
  });

  it("navigates chapters via quick jump pills", async () => {
    const user = userEvent.setup();
    window.scrollTo = vi.fn();
    renderWithProvider(<Hero />);

    const chapterBtn = screen
      .getByText(/Muhtasham Saroy Servis/i)
      .closest("button")!;
    await user.click(chapterBtn);
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
