"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { profile } from "@/content/profile";
import { homeTestimonials } from "@/content/testimonials";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { useT } from "@/i18n/LocaleProvider";

export default function HomePage() {
  const t = useT();

  return (
    <section className="flex flex-col items-center text-center gap-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {t.home.greetingLead}
        <span className="text-emerald-500">{profile.firstName}</span>
        {t.home.greetingTail}
      </h1>

      <p className="max-w-2xl text-lg md:text-xl text-muted leading-relaxed">{t.home.intro}</p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link
          href={ROUTES.projects}
          className="btn-style px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
        >
          {t.home.ctaProjects}
        </Link>
        <Link
          href={ROUTES.resume}
          className="btn-style px-6 py-3 rounded-lg border border-line-strong text-foreground hover:bg-elevated font-medium transition"
        >
          {t.home.ctaResume}
        </Link>
        <Link
          href={ROUTES.testimonials}
          className="btn-style px-6 py-3 rounded-lg border border-line-strong text-foreground hover:bg-elevated font-medium transition"
        >
          {t.home.ctaTestimonials}
        </Link>
      </div>

      <p className="mt-10 text-sm text-subtle max-w-md">{t.home.tagline}</p>

      {/* Testimonials carousel — featured ones first */}
      <TestimonialCarousel testimonials={homeTestimonials} className="max-w-6xl mt-20" />
    </section>
  );
}
