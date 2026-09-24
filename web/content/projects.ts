import type { FeaturedProject } from "@/app/types";

/**
 * Featured, from-scratch projects — shown above the mini apps on the
 * projects page. The prose fields (tagline / goal / motivation /
 * architecture) are translated per locale; name, url and techStack are
 * proper nouns and stay the same across languages.
 */
export const featuredProjects: FeaturedProject[] = [
  {
    id: "mattilgaza",
    name: "Mat Til Gaza",
    url: "https://mattilgaza.vercel.app",
    techStack: ["Sanity", "Next.js", "React", "Tailwind CSS"],
    translations: {
      en: {
        tagline: "A donation site connecting givers to families in Gaza.",
        goal:
          "The goal of Mat Til Gaza is simple: raise donations for families in Gaza. We have a trusted network on the ground there who help the families around them, and we wanted to contribute to that. Click through to learn more about the work that's been done.",
        motivation: [
          "I wanted to learn how to build professional websites with a modern tech stack. For this project I used ",
          { text: "Sanity", href: "https://www.sanity.io" },
          " as the CMS (content library), ",
          { text: "Next.js / React", href: "https://nextjs.org" },
          " as the framework, and ",
          { text: "Tailwind", href: "https://tailwindcss.com" },
          " for styling.",
        ],
        architecture: [
          { id: "update", label: "Update", description: "Content Creation" },
          { id: "db", label: "Sanity", description: "Content Library" },
          { id: "client", label: "Client", description: "Next.js/React" },
          { id: "website", label: "Charity Website", description: "Visit to learn more" },
        ],
      },
      no: {
        tagline: "Et donasjonsnettsted som knytter givere til familier i Gaza.",
        goal:
          "Målet med Mat Til Gaza er enkelt: samle inn donasjoner til familier i Gaza. Vi har et nettverk vi stoler på i Gaza, som hjelper familiene rundt seg, og det ønsket vi å bidra til. Klikk deg inn for å lære mer om arbeidet som er gjort.",
        motivation: [
          "Jeg ville lære å bygge profesjonelle nettsider med en moderne tech-stack. For dette prosjektet brukte jeg ",
          { text: "Sanity", href: "https://www.sanity.io" },
          " som CMS (innholdsbibliotek), ",
          { text: "Next.js / React", href: "https://nextjs.org" },
          " som rammeverk, og ",
          { text: "Tailwind", href: "https://tailwindcss.com" },
          " til styling.",
        ],
        architecture: [
          { id: "update", label: "Oppdatering", description: "Innholdsproduksjon" },
          { id: "db", label: "Sanity", description: "Innholdsbibliotek" },
          { id: "client", label: "Klient", description: "Next.js/React" },
          { id: "website", label: "Veldedighetsnettsted", description: "Besøk for å lære mer" },
        ],
      },
    },
  },
];

export default featuredProjects;
