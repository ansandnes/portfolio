"use client";

import { Fragment } from "react";
import { ExternalLink, Sparkles, Target, Workflow } from "lucide-react";
import type { FeaturedProject } from "@/app/types";
import { TagRow } from "@/components/ui/Tag";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { useLocale } from "@/i18n/LocaleProvider";

export default function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  const { locale, t } = useLocale();
  const tr = project.translations[locale];

  return (
    <article className="bg-card rounded-2xl border border-line shadow-2xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{project.name}</h3>
            <p className="text-muted mt-1">{tr.tagline}</p>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25 transition-colors shrink-0"
          >
            {t.projects.featured.viewProject}
            <ExternalLink size={16} />
          </a>
        </div>

        <TagRow items={project.techStack} className="mb-8" />

        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
            <Target size={14} className="text-emerald-500" />
            {t.projects.featured.goalLabel}
          </h4>
          <p className="text-muted leading-relaxed max-w-3xl">{tr.goal}</p>
        </div>

        <div className="mb-8">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
            <Sparkles size={14} className="text-emerald-500" />
            {t.projects.featured.motivationLabel}
          </h4>
          <p className="text-muted leading-relaxed max-w-3xl">
            {tr.motivation.map((segment, i) =>
              typeof segment === "string" ? (
                <Fragment key={i}>{segment}</Fragment>
              ) : (
                <a
                  key={i}
                  href={segment.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-500"
                >
                  {segment.text}
                </a>
              ),
            )}
          </p>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wide mb-2">
            <Workflow size={14} className="text-emerald-500" />
            {t.projects.featured.architectureLabel}
          </h4>
          <ArchitectureDiagram
            nodes={tr.architecture}
            note={t.projects.featured.architectureNote}
          />
        </div>
      </div>
    </article>
  );
}
