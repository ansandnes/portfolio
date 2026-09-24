import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { getResume, RESUME_LANGS, resumes } from "@/content/resume";
import {
  FEATURED_TESTIMONIAL_IDS,
  featuredTestimonials,
  homeTestimonials,
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

  it("home carousel shows every testimonial once, featured first", () => {
    const ids = homeTestimonials.map((t) => t.id);
    expect(ids.slice(0, FEATURED_TESTIMONIAL_IDS.length)).toEqual([...FEATURED_TESTIMONIAL_IDS]);
    expect([...ids].sort()).toEqual(testimonials.map((t) => t.id).sort());
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
  it.each(RESUME_LANGS)("[%s] has every section the page renders", (lang) => {
    const r = resumes[lang];
    expect(r.lang).toBe(lang);
    expect(r.profileSummary.length).toBeGreaterThan(20);
    expect(r.skills.length).toBeGreaterThan(0);
    expect(r.experience.length).toBeGreaterThan(0);
    expect(r.projects.length).toBeGreaterThan(0);
    expect(r.education.length).toBeGreaterThan(0);
    expect(r.languages.length).toBeGreaterThan(0);
    for (const key of Object.values(r.labels)) expect(key.trim()).not.toBe("");
  });

  it.each(RESUME_LANGS)("[%s] points at its own PDF under /assets", (lang) => {
    expect(resumes[lang].pdfPath).toBe(`/assets/cv_andreas_sandnes_${lang}.pdf`);
  });

  it.each(RESUME_LANGS)("[%s] agrees with the profile on email/phone", (lang) => {
    expect(resumes[lang].contact.email).toBe(profile.email);
    expect(resumes[lang].contact.phone).toBe(profile.phone);
  });

  it("both languages have matching structure (same job/project/education counts)", () => {
    const { en, no } = resumes;
    expect(no.experience).toHaveLength(en.experience.length);
    expect(no.projects).toHaveLength(en.projects.length);
    expect(no.education).toHaveLength(en.education.length);
  });

  it("getResume defaults to English and returns Norwegian for 'no'", () => {
    expect(getResume(undefined).lang).toBe("en");
    expect(getResume("en").lang).toBe("en");
    expect(getResume("no").lang).toBe("no");
    expect(getResume("xx").lang).toBe("en");
  });
});
