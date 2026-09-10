/** Identity and home-page copy. Single source for name / contact / headline. */
export const profile = {
  name: "Andreas Sandnes",
  firstName: "Andreas",
  headline: "Welcome to my website!",
  intro:
    "I'm an aspiring software engineer with a passion for building tools that solve real problems. This portfolio is your gateway into my work, journey, and experiences.",
  tagline: "Built with technical curiosity.",
  location: "Trondheim, Norway",
  email: "asandnes92@gmail.com",
  phone: "+47 97 26 78 84",
} as const;

export type Profile = typeof profile;
