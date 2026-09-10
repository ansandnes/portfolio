"use client";

import { Building2, Quote, User } from "lucide-react";
import type { Testimonial } from "@/app/types";
import { TagRow } from "@/components/ui/Tag";
import { useT } from "@/i18n/LocaleProvider";

export default function TestimonialCard({
  testimonial,
  index = 0,
}: {
  testimonial: Testimonial;
  /** Alternates the corner gradient tint. */
  index?: number;
}) {
  const t = useT();

  return (
    <div className="group relative bg-card/60 backdrop-blur-sm p-8 rounded-2xl border border-line hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-elevated rounded-full border border-line flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
        <Quote size={20} fill="currentColor" />
      </div>

      <div className="relative z-10">
        <blockquote className="whitespace-pre-line text-muted leading-relaxed mb-8 text-lg font-light italic">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        <div className="flex items-center gap-4 pt-6 border-t border-line">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-4 ring-background">
            <User size={20} />
          </div>
          <div>
            <div className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted flex flex-wrap items-center gap-x-1.5">
              <Building2 size={12} className="shrink-0" />
              <span>
                {testimonial.role} {t.testimonials.at}{" "}
                <span className="font-medium text-foreground">{testimonial.company}</span>
              </span>
            </div>
          </div>
        </div>

        <TagRow items={testimonial.traits} className="mt-6" />
        <TagRow items={testimonial.tech} className="mt-6" />
        <TagRow items={testimonial.impact} className="mt-6" />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          index % 2 === 0 ? "from-emerald-500/5" : "from-indigo-500/5"
        } to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
    </div>
  );
}
