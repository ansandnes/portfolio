import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/test/render";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SnakeApp from "@/app/(pages)/projects/_apps/SnakeApp";

const BEST_KEY = "portfolio.snake.best";

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
  // deterministic food placement (top-left, out of the snake's path)
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function tick(times: number) {
  act(() => {
    vi.advanceTimersByTime(130 * times);
  });
}

describe("SnakeApp", () => {
  it("starts idle with a Start button and zero score", () => {
    render(<SnakeApp />);
    expect(screen.getByRole("heading", { name: "Snake" })).toBeInTheDocument();
    expect(screen.getByText("Press Start to play")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    expect(screen.getByText("Score:").textContent).toMatch(/Score:\s*0/);
  });

  it("runs, eats the first food, then ends on a wall and records the best score", () => {
    render(<SnakeApp />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    // head starts at x=5,y=7 moving right; food is at x=11 -> eaten on tick 6
    tick(7);
    expect(screen.getByText("Score:").textContent).toMatch(/Score:\s*1/);

    // wall at x=15 -> game over a few ticks later
    tick(6);
    expect(screen.getByText(/Game over/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play again" })).toBeInTheDocument();
    expect(window.localStorage.getItem(BEST_KEY)).toBe("1");
    expect(screen.getByText("Best:").textContent).toMatch(/Best:\s*1/);
  });

  it("Space pauses and resumes a running game", () => {
    render(<SnakeApp />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    act(() => {
      fireEvent.keyDown(window, { key: " " });
    });
    expect(screen.getByText("Paused")).toBeInTheDocument();
    act(() => {
      fireEvent.keyDown(window, { key: " " });
    });
    expect(screen.queryByText("Paused")).not.toBeInTheDocument();
  });

  it("Play again resets the score", () => {
    render(<SnakeApp />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    tick(13); // eat one, then hit the wall
    fireEvent.click(screen.getByRole("button", { name: "Play again" }));
    expect(screen.getByText("Score:").textContent).toMatch(/Score:\s*0/);
    expect(screen.queryByText(/Game over/)).not.toBeInTheDocument();
  });
});
