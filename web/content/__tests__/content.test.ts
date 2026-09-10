import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { resume } from "@/content/resume";
import {
  FEATURED_TESTIMONIAL_IDS,
  featuredTestimonials,
  testimonials,
} from "@/content/testimonials";

describe("testimonials", () => {
  it("every testimonial has a name and non-empty content", () => {
    for (const t of testimonials) {
      expect(t.name.trim()).not.toBe("");
      expect(t.content.trim().length).toBeGreaterThan(20);
    }
  });

  it("ids are unique", () => {
    const ids = testimonials.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("featured ids all resolve, in order", () => {
    expect(featuredTestimonials.map((t) => t.id)).toEqual([...FEATURED_TESTIMONIAL_IDS]);
    expect(featuredTestimonials).toHaveLength(FEATURED_TESTIMONIAL_IDS.length);
  });
});

describe("experience", () => {
  it("has unique ids and required fields", () => {
    const ids = experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of experience) {
      expect(e.role.trim()).not.toBe("");
      expect(e.company.trim()).not.toBe("");
      expect(e.period.trim()).not.toBe("");
      expect(e.description.length).toBeGreaterThan(0);
    }
  });

  it("keeps the CCIT internship and employee roles as separate entries", () => {
    const ccit = experience.filter((e) => e.company.includes("CCIT"));
    expect(ccit.map((e) => e.period)).toEqual(["05/25 – 08/25", "03/25 – 05/25"]);
  });
});

describe("resume", () => {
  it("has the sections the page renders", () => {
    expect(resume.profileSummary.length).toBeGreaterThan(20);
    expect(resume.skills.length).toBeGreaterThan(0);
    expect(resume.experience.length).toBeGreaterThan(0);
    expect(resume.projects.length).toBeGreaterThan(0);
    expect(resume.education.length).toBeGreaterThan(0);
    expect(resume.languages.length).toBeGreaterThan(0);
  });

  it("points at a downloadable PDF that exists in /public", () => {
    expect(resume.pdfPath).toBe("/assets/cv_andreas_sandnes.pdf");
  });

  it("agrees with the profile on contact details", () => {
    expect(resume.contact.email).toBe(profile.email);
    expect(resume.contact.phone).toBe(profile.phone);
    expect(resume.contact.location).toBe(profile.location);
  });
});
