"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/app/types";
import TestimonialCard from "@/components/TestimonialCard";
import { useT } from "@/i18n/LocaleProvider";

type ScrollState = { index: number; perView: number; canPrev: boolean; canNext: boolean };

/** Distance between the starts of two neighbouring slides, in px. */
function slideStep(track: HTMLElement): number {
  const slide = track.firstElementChild as HTMLElement | null;
  if (!slide) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return slide.offsetWidth + gap;
}

function ArrowButton({
  dir,
  disabled,
  onClick,
  className = "",
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const t = useT();
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? t.carousel.prev : t.carousel.next}
      className={`h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-foreground shadow-lg transition-all hover:border-emerald-500/60 hover:text-emerald-500 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${className}`}
    >
      <Icon size={22} />
    </button>
  );
}

/**
 * Horizontally scrolling testimonial carousel: one card per view on small
 * screens, two from `md` up. Built on CSS scroll-snap, so swiping, trackpads
 * and focus-scrolling work natively; the arrows and dots just scroll the track.
 */
export default function TestimonialCarousel({
  testimonials,
  className = "",
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const t = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollState>({
    index: 0,
    perView: 1,
    canPrev: false,
    canNext: testimonials.length > 1,
  });

  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const step = slideStep(track);
    if (!step) return;
    const next: ScrollState = {
      index: Math.round(track.scrollLeft / step),
      perView: Math.max(1, Math.round(track.clientWidth / step)),
      canPrev: track.scrollLeft > 1,
      canNext: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    };
    setState((prev) =>
      prev.index === next.index &&
      prev.perView === next.perView &&
      prev.canPrev === next.canPrev &&
      prev.canNext === next.canNext
        ? prev
        : next,
    );
  };

  // Re-measure when the track resizes (breakpoint changes the slides per view).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const pages = Math.max(1, testimonials.length - state.perView + 1);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.min(Math.max(i, 0), pages - 1);
    // Smoothness comes from `scroll-smooth` on the track (off for reduced motion).
    track.scrollTo?.({ left: clamped * slideStep(track) });
  };
  const prev = () => goTo(state.index - 1);
  const next = () => goTo(state.index + 1);

  const dots = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          aria-label={t.carousel.goTo.replace("{n}", String(i + 1))}
          aria-current={i === state.index ? "true" : undefined}
          className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
            i === state.index ? "w-7 bg-emerald-500" : "w-2.5 bg-line-strong hover:bg-emerald-500/50"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.carousel.label}
      onKeyDown={(e) => {
        // Keys pressed inside an open card modal belong to the modal.
        if ((e.target as Element).closest("dialog")) return;
        if (e.key === "ArrowLeft") prev();
        else if (e.key === "ArrowRight") next();
      }}
      className={`relative w-full ${className}`}
    >
      <ArrowButton
        dir="prev"
        disabled={!state.canPrev}
        onClick={prev}
        className="hidden md:flex absolute z-10 top-1/2 -translate-y-1/2 md:-left-3 lg:-left-6"
      />
      <ArrowButton
        dir="next"
        disabled={!state.canNext}
        onClick={next}
        className="hidden md:flex absolute z-10 top-1/2 -translate-y-1/2 md:-right-3 lg:-right-6"
      />

      {/* Padding keeps the cards' quote badge, hover lift and shadow from
          being clipped by the scroll container. The side padding (1rem) equals
          the badge's overhang, so the next card's badge doesn't peek in. */}
      <div
        ref={trackRef}
        onScroll={measure}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth motion-reduce:scroll-auto scroll-pl-4 px-4 pt-6 pb-10 scrollbar-none"
      >
        {testimonials.map((testimonial, i) => (
          <div
            key={testimonial.id}
            role="group"
            aria-roledescription="slide"
            aria-label={t.carousel.slide
              .replace("{n}", String(i + 1))
              .replace("{total}", String(testimonials.length))}
            className="snap-start shrink-0 basis-full md:basis-[calc((100%-2rem)/2)]"
          >
            <TestimonialCard testimonial={testimonial} index={i} />
          </div>
        ))}
      </div>

      {/* Mobile: arrows either side of the dots. Desktop: dots only (arrows sit on the sides). */}
      <div className="flex items-center justify-between md:justify-center gap-4 px-4">
        <ArrowButton dir="prev" disabled={!state.canPrev} onClick={prev} className="flex md:hidden" />
        {dots}
        <ArrowButton dir="next" disabled={!state.canNext} onClick={next} className="flex md:hidden" />
      </div>
    </section>
  );
}
