import type { Metadata } from "next";
import type { ReactNode } from "react";

// The resume page is a Client Component (download button) so it cannot export
// `metadata` itself. This server layout supplies it. Phase 3 makes the page a
// Server Component (data moves to content/), after which this can be inlined.
export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Andreas Sandnes — profile, skills, experience, projects, and education.",
};

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return children;
}
