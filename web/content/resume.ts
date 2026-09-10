/**
 * Resume shown on /resume, in English (`en`) and Norwegian (`no`).
 *
 * The text is a file-based CMS: edit `content/cv/en.json` and `content/cv/no.json`
 * (see content/cv/README.md). This module just validates those files and adds
 * the derived `lang` / `pdfPath`. An invalid edit fails the build with a message
 * pointing at the offending field.
 *
 * After editing the JSON, regenerate the downloadable PDFs so they match:
 *   npm run dev            # (or npm run preview)
 *   npm run cv:pdf
 */

import { z } from "zod";
import enData from "./cv/en.json";
import noData from "./cv/no.json";

export type ResumeLang = "en" | "no";
export const RESUME_LANGS: readonly ResumeLang[] = ["en", "no"];

export interface ResumeLink {
  label: string;
  href: string;
}
export interface ResumeJob {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}
export interface ResumeProject {
  title: string;
  bullets: string[];
  link?: ResumeLink;
}
export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
}
export interface ResumeSkillGroup {
  category: string;
  items: string[];
}
export interface ResumeLabels {
  resume: string;
  download: string;
  profile: string;
  skills: string;
  contact: string;
  languages: string;
  experience: string;
  projects: string;
  education: string;
  opensNewTab: string;
  toggleLabel: string;
}
export interface ResumeData {
  lang: ResumeLang;
  labels: ResumeLabels;
  profileSummary: string;
  contact: { location: string; phone: string; email: string };
  skills: ResumeSkillGroup[];
  languages: string[];
  experience: ResumeJob[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  /** Path under /public to the downloadable CV for this language. */
  pdfPath: string;
}

const nonEmpty = z.string().trim().min(1);
const nonEmptyList = z.array(nonEmpty).min(1);

/** Shape of each content/cv/<lang>.json file (everything except lang/pdfPath). */
const cvFileSchema = z.object({
  labels: z.object({
    resume: nonEmpty,
    download: nonEmpty,
    profile: nonEmpty,
    skills: nonEmpty,
    contact: nonEmpty,
    languages: nonEmpty,
    experience: nonEmpty,
    projects: nonEmpty,
    education: nonEmpty,
    opensNewTab: nonEmpty,
    toggleLabel: nonEmpty,
  }),
  profileSummary: nonEmpty.min(20),
  contact: z.object({
    location: nonEmpty,
    phone: nonEmpty,
    email: z.string().email(),
  }),
  skills: z.array(z.object({ category: nonEmpty, items: nonEmptyList })).min(1),
  languages: nonEmptyList,
  experience: z
    .array(z.object({ role: nonEmpty, company: nonEmpty, period: nonEmpty, bullets: nonEmptyList }))
    .min(1),
  projects: z
    .array(
      z.object({
        title: nonEmpty,
        bullets: nonEmptyList,
        link: z.object({ label: nonEmpty, href: z.string().url() }).optional(),
      }),
    )
    .min(1),
  education: z
    .array(z.object({ degree: nonEmpty, institution: nonEmpty, period: nonEmpty }))
    .min(1),
});

function load(lang: ResumeLang, raw: unknown): ResumeData {
  const parsed = cvFileSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content/cv/${lang}.json:\n${details}`);
  }
  return {
    lang,
    pdfPath: `/assets/cv_andreas_sandnes_${lang}.pdf`,
    ...parsed.data,
  };
}

export const resumeEn: ResumeData = load("en", enData);
export const resumeNo: ResumeData = load("no", noData);

export const resumes: Record<ResumeLang, ResumeData> = { en: resumeEn, no: resumeNo };

export function getResume(lang: string | undefined | null): ResumeData {
  return lang === "no" ? resumeNo : resumeEn;
}

export default resumes;
