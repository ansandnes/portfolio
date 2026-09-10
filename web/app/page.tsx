import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { profile } from "@/content/profile";
import { featuredTestimonials } from "@/content/testimonials";
import TestimonialCard from "@/components/TestimonialCard";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-24 mt-10">
      {/* Intro Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        Hi, I&rsquo;m <span className="text-emerald-400">{profile.firstName}</span>. {profile.headline}
      </h1>

      {/* Subheading */}
      <p className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed">{profile.intro}</p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link
          href={ROUTES.projects}
          className="btn-style px-6 py-3 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium transition"
        >
          Explore My Apps
        </Link>

        <Link
          href={ROUTES.resume}
          className="btn-style px-6 py-3 rounded-lg bg-emerald-600/80 hover:bg-white/20 text-slate-200 font-medium transition"
        >
          View My Resume
        </Link>

        <Link
          href={ROUTES.testimonials}
          className="btn-style px-6 py-3 rounded-lg bg-emerald-600/80 hover:bg-white/20 text-slate-200 font-medium transition"
        >
          What People Say
        </Link>
      </div>

      {/* Small tagline */}
      <p className="mt-10 text-sm text-slate-400 max-w-md">{profile.tagline}</p>

      {/* Featured testimonials */}
      <div className="grid gap-12 md:grid-cols-2 max-w-6xl mt-20 text-justify">
        {featuredTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </section>
  );
}
