"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ProjectHighlight } from "@/app/types";
import Modal from "@/components/ui/Modal";
import { TagRow } from "@/components/ui/Tag";
import { useLocale } from "@/i18n/LocaleProvider";

/** Compact project card; clicking it opens the full write-up in a modal. */
export default function ProjectHighlightCard({ project }: { project: ProjectHighlight }) {
  const { locale, t } = useLocale();
  const tr = project.translations[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `${project.id}-modal-title`;

  const open = () => dialogRef.current?.showModal();

  return (
    <article className="group relative flex flex-col bg-card rounded-2xl border border-line shadow-xl overflow-hidden transition-shadow hover:shadow-2xl hover:border-emerald-500/40">
      {/* Preview: screenshot if there is one, otherwise the opening paragraph */}
      <div className="aspect-[16/10] overflow-hidden border-b border-line bg-elevated/60">
        {project.image ? (
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt={tr.imageAlt ?? ""}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="relative h-full p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-subtle mb-2">
              {tr.bodyLabel}
            </div>
            <p className="text-sm text-muted leading-relaxed">{tr.body[0]}</p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
          {tr.label}
        </div>
        <h3 className="text-xl font-bold text-foreground line-clamp-2">
          {/* Stretched button: its ::after covers the whole card, so the card is
              one click target while the markup stays valid (no block content
              inside a <button>). */}
          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:rounded-2xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-emerald-400"
          >
            {tr.title}
          </button>
        </h3>
        <p className="text-muted text-sm mt-2">{tr.tagline}</p>
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {t.modal.readMore}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <Modal ref={dialogRef} labelledBy={titleId}>
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1 pr-10">
          {tr.label}
        </div>
        <h2 id={titleId} className="text-2xl font-bold text-foreground pr-10">
          {tr.title}
        </h2>
        <p className="text-muted mt-2">{tr.tagline}</p>

        {project.url && tr.linkLabel && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25 transition-colors"
          >
            {tr.linkLabel}
            <ExternalLink size={16} aria-hidden />
            <span className="sr-only">{t.projects.featured.opensNewTab}</span>
          </a>
        )}

        {project.image && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden
            className="mt-6 block overflow-hidden rounded-xl border border-line"
          >
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt=""
              sizes="(min-width: 800px) 704px, 100vw"
              className="w-full h-auto"
            />
          </a>
        )}

        {project.techStack && <TagRow items={project.techStack} className="mt-6" />}

        <h3 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-foreground">
          {tr.bodyLabel}
        </h3>
        <div className="space-y-4 text-muted leading-relaxed">
          {tr.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Modal>
    </article>
  );
}
