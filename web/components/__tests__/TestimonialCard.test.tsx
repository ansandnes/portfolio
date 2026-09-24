import { fireEvent, renderWithProviders as render, screen, within } from "@/test/render";
import { describe, expect, it } from "vitest";
import type { Testimonial } from "@/app/types";
import TestimonialCard from "@/components/TestimonialCard";

const base: Testimonial = {
  id: 1,
  name: "Jane Doe",
  role: "Engineer",
  company: "Acme",
  relation: "Jane was my team lead.",
  image: null,
  content: "Great to work with.",
  tech: ["TypeScript"],
  traits: ["Focused", "Kind", "Curious", "Driven", "Calm"],
  impact: [],
};

const card = () => screen.getByRole("article");
const dialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("TestimonialCard", () => {
  it("previews the quote, author, role and company", () => {
    render(<TestimonialCard testimonial={base} />);
    const c = card();
    expect(within(c).getAllByText(/Great to work with\./)[0]).toBeInTheDocument();
    expect(within(c).getByRole("button", { name: "Jane Doe" })).toBeInTheDocument();
    expect(within(c).getAllByText(/Engineer/)[0]).toBeInTheDocument();
    expect(within(c).getAllByText("Acme")[0]).toBeInTheDocument();
  });

  it("previews only the first three traits, with a count of the rest", () => {
    render(<TestimonialCard testimonial={base} />);
    expect(dialog().open).toBe(false);
    // Tags rendered in the card itself, i.e. outside the (closed) modal.
    const inCard = (text: string) =>
      screen.queryAllByText(text).filter((el) => !dialog().contains(el)).length;
    expect(inCard("Focused")).toBe(1);
    expect(inCard("Curious")).toBe(1);
    expect(inCard("Driven")).toBe(0);
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("opens a modal with the full quote, context and all tags", () => {
    render(<TestimonialCard testimonial={base} />);
    fireEvent.click(screen.getByRole("button", { name: "Jane Doe" }));

    const d = dialog();
    expect(d.open).toBe(true);
    const m = within(d);
    expect(m.getByRole("heading", { level: 2, name: "Jane Doe" })).toBeInTheDocument();
    expect(m.getByText(/Great to work with\./)).toBeInTheDocument();
    expect(m.getByText("Jane was my team lead.")).toBeInTheDocument();
    expect(m.getByText("Calm")).toBeInTheDocument();
    expect(m.getByText("TypeScript")).toBeInTheDocument();
  });

  it("closes on a backdrop click", () => {
    render(<TestimonialCard testimonial={base} />);
    fireEvent.click(screen.getByRole("button", { name: "Jane Doe" }));
    fireEvent.mouseDown(dialog());
    fireEvent.click(dialog());
    expect(dialog().open).toBe(false);
  });

  it("omits empty tag rows", () => {
    render(<TestimonialCard testimonial={base} />);
    // `impact` is empty -> no tag rendered for it
    expect(screen.queryByText("High impact")).not.toBeInTheDocument();
  });
});
