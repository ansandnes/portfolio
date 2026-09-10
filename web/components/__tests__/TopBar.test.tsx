import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders as render } from "@/test/render";

const setTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme }),
}));

import TopBar from "@/components/TopBar";

afterEach(() => {
  setTheme.mockClear();
  window.localStorage.clear();
});

describe("TopBar", () => {
  it("shows a language group and a theme button", () => {
    render(<TopBar />);
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "en" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "no" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /Switch to light mode/ })).toBeInTheDocument();
  });

  it("switching language updates the pressed state and localStorage", () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole("button", { name: "no" }));
    expect(screen.getByRole("button", { name: "no" })).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem("portfolio.locale")).toBe("no");
    // the theme button's label is localised too
    expect(screen.getByRole("button", { name: /Bytt til lys modus/ })).toBeInTheDocument();
  });

  it("clicking the theme button toggles to light", () => {
    render(<TopBar />);
    fireEvent.click(screen.getByRole("button", { name: /Switch to light mode/ }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
