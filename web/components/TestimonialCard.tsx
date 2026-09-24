"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight, Building2, Quote, User } from "lucide-react";
import type { Testimonial } from "@/app/types";
import Modal from "@/components/ui/Modal";
import { TagRow } from "@/components/ui/Tag";
import { useT } from "@/i18n/LocaleProvider";

/** How many trait tags the (fixed-size) card previews; the modal shows all. */
const PREVIEW_TRAITS = 3;

function Author({
  testimonial,
  nameAs,
  clamp = false,
}: {
  testimonial: Testimonial;
  nameAs: ReactNode;
  /** Cap role/company at two lines (card preview). */
  clamp?: boolean;
}) {
  const t = useT();
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-4 ring-background">
        <User size={20} />
      </div>
      <div className="min-w-0">
        {nameAs}
        <div className="text-sm text-muted flex items-start gap-x-1.5">
          <Building2 size={12} className="shrink-0 mt-1" />
          <span className={clamp ? "line-clamp-2" : undefined}>
            {testimonial.role} {t.testimonials.at}{" "}
            <span className="font-medium text-foreground">{testimonial.company}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Fixed-shape testimonial preview (clamped quote, author, a few traits) that
 * opens the full quote, context and all tags in a modal. Place it in a grid
 * with `auto-rows-fr` to make every card the same size.
 */
export default function TestimonialCard({
  testimonial,
  index = 0,
}: {
  testimonial: Testimonial;
  /** Alternates the corner gradient tint. */
  index?: number;
}) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `testimonial-${testimonial.id}-title`;
  const hiddenTraits = testimonial.traits.length - PREVIEW_TRAITS;

  return (
    <article className="group relative flex h-full flex-col bg-card/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-line hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1 text-left">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          index % 2 === 0 ? "from-emerald-500/5" : "from-indigo-500/5"
        } to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-elevated rounded-full border border-line flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
        <Quote size={20} fill="currentColor" />
      </div>

      {/* flex-1 lives on the wrapper: a line-clamped box stretched taller than
          its clamp would show the next line below the ellipsis. */}
      <div className="flex-1 mb-6">
        <blockquote className="whitespace-pre-line text-muted leading-relaxed text-lg font-light italic line-clamp-5">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>
      </div>

      <div className="pt-6 border-t border-line">
        <Author
          testimonial={testimonial}
          clamp
          nameAs={
            <h3 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
              {/* Stretched button: its ::after covers the whole card, so the card
                  is one click target. */}
              <button
                type="button"
                onClick={() => dialogRef.current?.showModal()}
                aria-haspopup="dialog"
                className="text-left after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-emerald-400"
              >
                {testimonial.name}
              </button>
            </h3>
          }
        />
      </div>

      {testimonial.traits.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <TagRow items={testimonial.traits.slice(0, PREVIEW_TRAITS)} />
          {hiddenTraits > 0 && <span className="text-xs text-subtle">+{hiddenTraits}</span>}
        </div>
      )}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
        {t.modal.readMore}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>

      <Modal ref={dialogRef} labelledBy={titleId}>
        <div className="pr-10">
          <Author
            testimonial={testimonial}
            nameAs={
              <h2 id={titleId} className="text-xl font-bold text-foreground">
                {testimonial.name}
              </h2>
            }
          />
        </div>

        {testimonial.relation && (
          <p className="mt-5 text-sm text-subtle">
            <span className="font-semibold uppercase tracking-wide text-xs text-muted">
              {t.testimonials.relationLabel}
            </span>{" "}
            {testimonial.relation}
          </p>
        )}

        <blockquote className="mt-6 pt-6 border-t border-line whitespace-pre-line text-muted leading-relaxed text-lg font-light italic">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        <TagRow items={testimonial.traits} className="mt-6" />
        <TagRow items={testimonial.tech} className="mt-4" />
        <TagRow items={testimonial.impact} className="mt-4" />
      </Modal>
    </article>
  );
}
