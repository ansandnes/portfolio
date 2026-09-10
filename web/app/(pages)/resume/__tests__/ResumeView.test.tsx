import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/test/render";
import { describe, expect, it, vi } from "vitest";
import { resumeNo } from "@/content/resume";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace }),
  usePathname: () => "/resume",
}));

import ResumeView from "@/app/(pages)/resume/ResumeView";

describe("ResumeView", () => {
  it("renders the English resume by default", () => {
    render(<ResumeView />);
    expect(screen.getByRole("heading", { level: 1, name: "Resume" })).toBeInTheDocument();
    expect(screen.getByText("Professional experience")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Download PDF/ })).toHaveAttribute(
      "href",
      "/assets/cv_andreas_sandnes_en.pdf",
    );
  });

  it("switches content and the download target when toggled to Norwegian", () => {
    render(<ResumeView />);
    fireEvent.click(screen.getByRole("button", { name: "Norsk" }));

    expect(screen.getByRole("heading", { level: 1, name: resumeNo.labels.resume })).toBeInTheDocument();
    expect(screen.getByText(resumeNo.labels.experience)).toBeInTheDocument();
    // a value straight from the NO content file (survives CMS edits)
    expect(screen.getByText(resumeNo.experience[0].role)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Last ned PDF/ })).toHaveAttribute(
      "href",
      "/assets/cv_andreas_sandnes_no.pdf",
    );
    expect(screen.getByRole("button", { name: "Norsk" })).toHaveAttribute("aria-pressed", "true");
    expect(replace).toHaveBeenCalledWith("/resume?lang=no", { scroll: false });
  });
});
