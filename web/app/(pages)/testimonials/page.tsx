import type { Metadata } from "next";
import TestimonialsView from "./TestimonialsView";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What colleagues, managers, and collaborators say about working with Andreas Sandnes.",
};

export default function TestimonialsPage() {
  return <TestimonialsView />;
}
