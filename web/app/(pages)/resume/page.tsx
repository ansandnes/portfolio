import type { Metadata } from "next";
import { Suspense } from "react";
import ResumeView from "./ResumeView";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Andreas Sandnes (English / Norwegian) — profile, skills, experience, projects, and education.",
};

export default function ResumePage() {
  // Suspense so `useSearchParams` in ResumeView doesn't opt the route out of
  // static rendering.
  return (
    <Suspense fallback={null}>
      <ResumeView />
    </Suspense>
  );
}
