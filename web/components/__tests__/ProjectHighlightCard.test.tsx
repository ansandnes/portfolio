import { fireEvent, renderWithProviders as render, screen, within } from "@/test/render";
import { describe, expect, it } from "vitest";
import type { ProjectHighlight } from "@/app/types";
import ProjectHighlightCard from "@/components/ProjectHighlightCard";

const tr = {
  label: "Website",
  title: "Direkte",
  tagline: "A local marketplace.",
  bodyLabel: "About",
  body: ["First paragraph.", "Second paragraph."],
  imageAlt: "Home page",
  linkLabel: "Visit Direkte",
};

const project: ProjectHighlight = {
  id: "direkte",
  url: "https://example.com",
  image: { src: "/images/projects/direkte-home.png", width: 1440, height: 900 },
  techStack: ["Next.js"],
  translations: { en: tr, no: tr },
};

function getDialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("ProjectHighlightCard", () => {
  it("opens the modal when the card is clicked", () => {
    render(<ProjectHighlightCard project={project} />);
    expect(getDialog().open).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Direkte" }));

    const dialog = getDialog();
    expect(dialog.open).toBe(true);
    expect(within(dialog).getByRole("heading", { level: 2, name: "Direkte" })).toBeInTheDocument();
    expect(within(dialog).getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("links out in a new tab", () => {
    render(<ProjectHighlightCard project={project} />);
    const link = within(getDialog()).getByRole("link", { name: /Visit Direkte/, hidden: true });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("closes on a backdrop click but not on a click inside the content", () => {
    render(<ProjectHighlightCard project={project} />);
    fireEvent.click(screen.getByRole("button", { name: "Direkte" }));
    const dialog = getDialog();

    const inside = within(dialog).getByText("First paragraph.");
    fireEvent.mouseDown(inside);
    fireEvent.click(inside);
    expect(dialog.open).toBe(true);

    // A drag that starts inside and ends on the backdrop must not close it.
    fireEvent.mouseDown(inside);
    fireEvent.click(dialog);
    expect(dialog.open).toBe(true);

    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);
    expect(dialog.open).toBe(false);
  });

  it("closes from the close button", () => {
    render(<ProjectHighlightCard project={project} />);
    fireEvent.click(screen.getByRole("button", { name: "Direkte" }));
    fireEvent.click(within(getDialog()).getByRole("button", { name: "Close" }));
    expect(getDialog().open).toBe(false);
  });

  it("omits the link when there is no url", () => {
    render(<ProjectHighlightCard project={{ ...project, url: undefined, image: undefined }} />);
    expect(within(getDialog()).queryByRole("link", { hidden: true })).toBeNull();
  });
});
