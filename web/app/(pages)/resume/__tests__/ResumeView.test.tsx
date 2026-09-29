import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders as render } from "@/test/render";
import { describe, expect, it, vi } from "vitest";
import { resumeEn, resumeNo } from "@/content/resume";

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
    // One download link in the page header, one inside the (closed) preview modal.
    for (const link of screen.getAllByRole("link", { name: /Download PDF/, hidden: true })) {
      expect(link).toHaveAttribute("href", resumeEn.pdfPath);
    }
  });

  it("opens the downloadable version in a preview modal", () => {
    render(<ResumeView />);
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: resumeEn.labels.preview }));

    expect(dialog.open).toBe(true);
    expect(
      within(dialog).getByRole("img", { name: resumeEn.labels.previewTitle }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Download PDF/ })).toHaveAttribute(
      "href",
      resumeEn.pdfPath,
    );
  });

  it("switches content and the download target when toggled to Norwegian", () => {
    render(<ResumeView />);
    fireEvent.click(screen.getByRole("button", { name: "Norsk" }));

    expect(
      screen.getByRole("heading", { level: 1, name: resumeNo.labels.resume }),
    ).toBeInTheDocument();
    expect(screen.getByText(resumeNo.labels.experience)).toBeInTheDocument();
    // a value straight from the NO content file (survives CMS edits)
    expect(screen.getByText(resumeNo.experience[0].role)).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: /Last ned PDF/, hidden: true })) {
      expect(link).toHaveAttribute("href", resumeNo.pdfPath);
    }
    expect(screen.getByRole("button", { name: "Norsk" })).toHaveAttribute("aria-pressed", "true");
    expect(replace).toHaveBeenCalledWith("/resume?lang=no", { scroll: false });
  });
});
