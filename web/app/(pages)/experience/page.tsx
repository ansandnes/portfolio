import type { Metadata } from "next";
import { experience } from "@/content/experience";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience",
  description: "Andreas Sandnes' professional journey — roles, responsibilities, and tech stacks.",
};

export default function Experience() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-6 animate-slide-up">
      <h1 className="text-3xl font-bold text-white mb-12">Professional Journey</h1>
      <ExperienceTimeline items={experience} />
    </div>
  );
}
