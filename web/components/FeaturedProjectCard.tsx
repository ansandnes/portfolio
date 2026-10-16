"use client";

import { Fragment } from "react";
import type { FeaturedProject, ProjectHighlight } from "@/app/types";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import ProjectHighlightCard from "@/components/ProjectHighlightCard";
import { useLocale } from "@/i18n/LocaleProvider";

const sectionHeading = "mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-foreground";

/**
 * A featured project shown as the same compact card as the highlights; the
 * modal carries its goal, motivation and architecture diagram.
 */
export default function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  const { locale, t } = useLocale();
  const tr = project.translations[locale];

  // Already resolved for the current locale, so both keys get the same text.
  const resolved = {
    label: tr.label,
    title: project.name,
    tagline: tr.tagline,
    bodyLabel: t.projects.featured.goalLabel,
    body: [tr.goal],
    imageAlt: tr.imageAlt,
    linkLabel: t.projects.featured.viewProject,
  };
  const card: ProjectHighlight = {
    id: project.id,
    url: project.url,
    image: project.image,
    techStack: project.techStack,
    translations: { en: resolved, no: resolved },
  };

  return (
    <ProjectHighlightCard project={card}>
      <h3 className={sectionHeading}>{t.projects.featured.motivationLabel}</h3>
      <p className="text-muted leading-relaxed">
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

      <h3 className={sectionHeading}>{t.projects.featured.architectureLabel}</h3>
      <ArchitectureDiagram nodes={tr.architecture} note={t.projects.featured.architectureNote} />
    </ProjectHighlightCard>
  );
}
