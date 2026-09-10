import type { Metadata } from "next";
import type { ReactNode } from "react";

// The projects page is a Client Component (tab state) so it cannot export
// `metadata` itself. This server layout supplies it.
export const metadata: Metadata = {
  title: "Projects",
  description: "Interactive mini-app demos — a task manager, an AI recipe assistant, and more.",
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
