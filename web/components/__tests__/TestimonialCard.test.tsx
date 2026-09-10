import { renderWithProviders as render, screen } from "@/test/render";
import { describe, expect, it } from "vitest";
import type { Testimonial } from "@/app/types";
import TestimonialCard from "@/components/TestimonialCard";

const base: Testimonial = {
  id: 1,
  name: "Jane Doe",
  role: "Engineer",
  company: "Acme",
  relation: "colleague",
  image: null,
  content: "Great to work with.",
  tech: ["TypeScript"],
  traits: ["Focused"],
  impact: [],
};

describe("TestimonialCard", () => {
  it("renders the quote, author, role and company", () => {
    render(<TestimonialCard testimonial={base} />);
    expect(screen.getByText(/Great to work with\./)).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText(/Engineer/)).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("renders non-empty tag rows and omits empty ones", () => {
    render(<TestimonialCard testimonial={base} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Focused")).toBeInTheDocument();
    // `impact` is empty -> no tag rendered for it
    expect(screen.queryByText("High impact")).not.toBeInTheDocument();
  });
});
