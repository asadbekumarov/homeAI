import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeveloperSwitcher from "./DeveloperSwitcher";
import { ProjectProvider } from "@/context/ProjectContext";

describe("DeveloperSwitcher (TDD)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<ProjectProvider>{ui}</ProjectProvider>);
  };

  it("renders the trigger button with the default active project", () => {
    renderWithProvider(<DeveloperSwitcher />);

    const trigger = screen.getByRole("button", { name: /loyihani tanlash/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the dropdown menu with available projects when clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<DeveloperSwitcher />);

    const trigger = screen.getByRole("button", { name: /loyihani tanlash/i });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("listbox");
    expect(menu).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options.length).toBeGreaterThanOrEqual(1);
  });

  it("closes the dropdown when Escape key is pressed", async () => {
    const user = userEvent.setup();
    renderWithProvider(<DeveloperSwitcher />);

    const trigger = screen.getByRole("button", { name: /loyihani tanlash/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects a project, saves to localStorage, and closes the dropdown", async () => {
    const user = userEvent.setup();
    renderWithProvider(<DeveloperSwitcher />);

    const trigger = screen.getByRole("button", { name: /loyihani tanlash/i });
    await user.click(trigger);

    const options = screen.getAllByRole("option");
    await user.click(options[0]);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(localStorage.getItem("showcase_project_slug")).toBeTruthy();
  });

  it("closes the dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <div>
        <span data-testid="outside">Tashqi hudud</span>
        <DeveloperSwitcher />
      </div>
    );

    const trigger = screen.getByRole("button", { name: /loyihani tanlash/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByTestId("outside"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
