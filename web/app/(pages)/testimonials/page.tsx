import type { Metadata } from "next";
import { testimonials } from "@/content/testimonials";
import TestimonialCard from "@/components/TestimonialCard";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What colleagues, managers, and collaborators say about working with Andreas Sandnes.",
};

export default function Testimonials() {
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 animate-slide-up">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          What People{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            Say
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Feedback from colleagues, managers, and clients I&rsquo;ve had the pleasure of working with.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
}
