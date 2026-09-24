"use client";

import { testimonials } from "@/content/testimonials";
import TestimonialCard from "@/components/TestimonialCard";
import { useT } from "@/i18n/LocaleProvider";

export default function TestimonialsView() {
  const t = useT();
  return (
    <div className="pb-20 max-w-7xl mx-auto px-6 animate-slide-up">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          {t.testimonials.titleLead}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            {t.testimonials.titleAccent}
          </span>
        </h1>
        <p className="text-muted text-lg max-w-3xl mx-auto">{t.testimonials.subtitle}</p>
      </div>

      {/* auto-rows-fr: every row as tall as the tallest, so all cards match. */}
      <div className="grid gap-10 lg:grid-cols-2 auto-rows-fr">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
}
