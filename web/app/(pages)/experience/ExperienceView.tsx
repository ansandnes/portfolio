"use client";

import { experience } from "@/content/experience";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { useT } from "@/i18n/LocaleProvider";

export default function ExperienceView() {
  const t = useT();
  return (
    <div className="pb-20 max-w-4xl mx-auto px-6 animate-slide-up">
      <h1 className="text-3xl font-bold text-foreground mb-12">{t.experience.title}</h1>
      <ExperienceTimeline items={experience} />
    </div>
  );
}
