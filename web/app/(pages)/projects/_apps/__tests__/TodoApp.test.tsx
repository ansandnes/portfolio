import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/test/render";
import { beforeEach, describe, expect, it } from "vitest";
import TodoApp from "@/app/(pages)/projects/_apps/TodoApp";

const STORAGE_KEY = "portfolio.todos.v1";

beforeEach(() => window.localStorage.clear());

function addTask(text: string) {
  fireEvent.change(screen.getByLabelText("New task"), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
}

describe("TodoApp", () => {
  it("renders the seed tasks", () => {
    render(<TodoApp />);
    expect(screen.getByText("Skim through Andreas' resume")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("adds, toggles and deletes a task", () => {
    render(<TodoApp />);

    addTask("Book an interview");
    const item = screen.getByText("Book an interview").closest("li")!;
    expect(item).toBeInTheDocument();

    const toggle = within(item).getByRole("button", { name: /Mark "Book an interview" complete/ });
    fireEvent.click(toggle);
    expect(
      within(item).getByRole("button", { name: /Mark "Book an interview" incomplete/ }),
    ).toBeInTheDocument();

    fireEvent.click(within(item).getByRole("button", { name: /Delete "Book an interview"/ }));
    expect(screen.queryByText("Book an interview")).not.toBeInTheDocument();
  });

  it("persists tasks to localStorage", () => {
    render(<TodoApp />);
    addTask("Persist me");

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored.some((t: { text: string }) => t.text === "Persist me")).toBe(true);
  });

  it("restores tasks from localStorage on mount", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: "x", text: "From storage", completed: false }]),
    );
    render(<TodoApp />);
    expect(screen.getByText("From storage")).toBeInTheDocument();
    expect(screen.queryByText("Skim through Andreas' resume")).not.toBeInTheDocument();
  });
});
