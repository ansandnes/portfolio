import { fireEvent, renderWithProviders as render, screen } from "@/test/render";
import { describe, expect, it, vi } from "vitest";
import type { Testimonial } from "@/app/types";
import TestimonialCarousel from "@/components/TestimonialCarousel";

const make = (id: number): Testimonial => ({
  id,
  name: `Person ${id}`,
  role: "Engineer",
  company: "Acme",
  relation: "",
  image: null,
  content: `Quote ${id}.`,
  tech: [],
  traits: [],
  impact: [],
});

const items = [1, 2, 3].map(make);

describe("TestimonialCarousel", () => {
  it("renders every testimonial as a labelled slide", () => {
    render(<TestimonialCarousel testimonials={items} />);
    const slides = screen.getAllByRole("group");
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute("aria-label", "1 of 3");
    expect(screen.getByRole("button", { name: "Person 3" })).toBeInTheDocument();
  });

  it("starts at the beginning: previous disabled, next enabled", () => {
    render(<TestimonialCarousel testimonials={items} />);
    for (const btn of screen.getAllByRole("button", { name: "Previous testimonial" })) {
      expect(btn).toBeDisabled();
    }
    for (const btn of screen.getAllByRole("button", { name: "Next testimonial" })) {
      expect(btn).toBeEnabled();
    }
  });

  it("scrolls the track when a dot is clicked", () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", { value: scrollTo, configurable: true });
    render(<TestimonialCarousel testimonials={items} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Go to testimonial 2" })[0]);
    expect(scrollTo).toHaveBeenCalled();
    Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
  });
});
