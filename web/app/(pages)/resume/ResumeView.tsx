"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { RESUME_LANGS, resumes, type ResumeLang } from "@/content/resume";
import { useLocale } from "@/i18n/LocaleProvider";

const LANG_LABEL: Record<ResumeLang, string> = { en: "English", no: "Norsk" };

export default function ResumeView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  // `?lang=` wins; otherwise follow the site language.
  const [lang, setLang] = useState<ResumeLang>(searchParams.get("lang") === "no" ? "no" : "en");
  const [userChose, setUserChose] = useState(false);

  useEffect(() => {
    if (!userChose && !searchParams.get("lang")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(locale === "no" ? "no" : "en");
    }
  }, [locale, userChose, searchParams]);

  const data = resumes[lang];
  const { labels } = data;

  const selectLang = (l: ResumeLang) => {
    setUserChose(true);
    setLang(l);
    router.replace(l === "no" ? `${pathname}?lang=no` : pathname, { scroll: false });
  };

  return (
    <div className="pb-20 max-w-6xl mx-auto px-6 animate-slide-up print:pt-0 print:pb-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">{labels.resume}</h1>

        <div className="flex items-center gap-3" data-print-hide>
          {/* Language toggle */}
          <div
            role="group"
            aria-label={labels.toggleLabel}
            className="inline-flex rounded-lg border border-line p-0.5 text-sm"
          >
            {RESUME_LANGS.map((l) => {
              const active = l === lang;
              return (
                <button
                  key={l}
                  type="button"
                  onClick={() => selectLang(l)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    active
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {LANG_LABEL[l]}
                </button>
              );
            })}
          </div>

          <a
            href={data.pdfPath}
            download
            className="inline-flex items-center gap-2 rounded-lg border-2 border-line-strong px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Download size={16} />
            {labels.download}
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="resume-print-card bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="col-span-1 space-y-8 bg-gray-100 p-4 rounded-lg">
          <section className="break-inside-avoid">
            <div className="text-2xl font-bold mb-4">Andreas Sandnes</div>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.profile}
            </h3>
            <p className="text-sm text-slate-700">{data.profileSummary}</p>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.skills}
            </h3>
            <ul className="space-y-2">
              {data.skills.map((skill) => (
                <li key={skill.category}>
                  <div className="font-semibold text-sm">{skill.category}</div>
                  <div className="text-slate-600 text-sm">{skill.items.join(", ")}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.contact}
            </h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>{data.contact.location}</li>
              <li>{data.contact.phone}</li>
              <li>{data.contact.email}</li>
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.languages}
            </h3>
            <ul className="space-y-1 text-sm text-slate-700">
              {data.languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right content */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.experience}
            </h3>
            {data.experience.map((job) => (
              <div key={`${job.company}-${job.period}`} className="mb-6 break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{job.role}</h4>
                  <span className="text-sm text-slate-500 italic">{job.period}</span>
                </div>
                <div className="text-emerald-600 font-medium mb-2">{job.company}</div>
                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                  {job.bullets.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.projects}
            </h3>
            {data.projects.map((proj) => (
              <div key={proj.title} className="mb-4 break-inside-avoid">
                <div className="font-bold">{proj.title}</div>
                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                  {proj.bullets.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                  {proj.link && (
                    <li>
                      <a
                        href={proj.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 underline"
                      >
                        {proj.link.label} {labels.opensNewTab}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              {labels.education}
            </h3>
            <div className="flex flex-wrap gap-8">
              {data.education.map((edu) => (
                <div key={edu.degree} className="mb-4 w-64 break-inside-avoid">
                  <div className="font-bold">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-sm text-slate-500 italic">{edu.period}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
