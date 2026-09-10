import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const metadata: Metadata = {
  title: "Experience",
  description: "Andreas Sandnes' professional journey — roles, responsibilities, and tech stacks.",
};

export default function ExperiencePage() {
  return <ExperienceView />;
}
