import type { FeaturedProject, ProjectHighlight } from "@/app/types";

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

const THESIS_TITLE =
  "Utilizing Differential Gene Expression Analysis Tools for DNA-Encoded Library Data Partitioning";

// Verbatim from the submitted thesis (English only), split into paragraphs
// for readability. Both locales show the original.
const THESIS_ABSTRACT = [
  "DNA-encoded libraries (DELs) are collections of billions of small molecules each conjugated with a DNA-tag enabling next generation sequencing (NGS) techniques to quantify signal from selection experiments. In DEL data, an observation after sequencing could be due to signal from specific target binding but also from noise generated from either a random occurrence, background binding, or unspecific target binding. In fact, the information content is low because the data contains a large proportion of noise. Annotating the molecules to these events is a manual process. Furthermore, to successfully find that one molecule out of several billion which specifically interacts with the target exceeds the meaning of finding a needle in a haystack. Due to these underlying challenges, an expansion of the DEL data analysis toolbox would be beneficial for the field.",
  "Differential gene expression (DGE) analysis tools are well documented for the purpose of investigating differentially expressed genes. DGE and DEL share the objective of pursuing the few amongst many. Moreover, the count data from both these fields are generated from NGS, suggesting potentially similar solutions to similar problems. In this project, the three most utilized DGE analysis tools are being tested on DEL data to inspect the possibility of one field’s established techniques being innovative in another.",
  "Even with different normalization procedures and statistical testing, sensible clustering patterns are found in the output of all tools when given DEL data. Furthermore, specific target binders confirmed by affinity assays are systemically being rendered significant. This suggests that there is a potential for exploiting DGE analysis methods for partitioning DEL data.",
];

/**
 * Smaller projects shown side by side under the featured projects. Each
 * card opens a modal with the full write-up.
 */
export const projectHighlights: ProjectHighlight[] = [
  {
    id: "direkte",
    url: "https://direkte-next.vercel.app",
    image: { src: "/images/projects/direkte-home.png", width: 1440, height: 900 },
    techStack: ["Next.js", "React", "Tailwind CSS", "FastAPI", "SQLAlchemy", "PostgreSQL", "Leaflet"],
    translations: {
      en: {
        label: "Website",
        title: "Direkte",
        tagline: "A local marketplace for buying food directly from people in Trondheim — no middleman.",
        bodyLabel: "About",
        body: [
          "Direkte (“Fra Bonden til Folket”) is a marketplace where anyone can both buy and sell locally produced food — vegetables, fruit, dairy, meat, baked goods, berries and mushrooms — directly from the people who make it. Products can be browsed as a list or on a map, filtered by category, and ordered through a shopping cart.",
          "It's built as two independent apps: a FastAPI backend that owns the data and business logic (SQLAlchemy, Alembic migrations, PostgreSQL in production), and a Next.js frontend. The browser never talks to the API directly — requests go through the frontend's own server-side routes, which proxy to the backend and keep authentication in HttpOnly cookies.",
        ],
        imageAlt: "The Direkte home page, showing a product list of local food for sale",
        linkLabel: "Visit Direkte",
      },
      no: {
        label: "Nettsted",
        title: "Direkte",
        tagline: "En lokal markedsplass for å kjøpe mat direkte fra folk i Trondheim — uten mellomledd.",
        bodyLabel: "Om prosjektet",
        body: [
          "Direkte («Fra Bonden til Folket») er en markedsplass der hvem som helst kan både kjøpe og selge lokalprodusert mat — grønnsaker, frukt, meieri, kjøtt, bakst, bær og sopp — direkte fra de som lager den. Produktene kan blas i som liste eller på kart, filtreres etter kategori og bestilles via en handlekurv.",
          "Løsningen består av to uavhengige apper: en FastAPI-backend som eier data og forretningslogikk (SQLAlchemy, Alembic-migreringer, PostgreSQL i produksjon), og en Next.js-frontend. Nettleseren snakker aldri direkte med API-et — forespørsler går via frontendens egne server-ruter, som videresender til backenden og holder innloggingen i HttpOnly-cookies.",
        ],
        imageAlt: "Forsiden til Direkte, med en produktliste over lokal mat til salgs",
        linkLabel: "Besøk Direkte",
      },
    },
  },
  {
    id: "msc-thesis",
    // TODO: add `url` once the HTML version of the thesis is published.
    translations: {
      en: {
        label: "Master's thesis",
        title: THESIS_TITLE,
        tagline:
          "MSc in Bioinformatics, University of Copenhagen — in collaboration with Amgen Research Copenhagen (2024).",
        bodyLabel: "Abstract",
        body: THESIS_ABSTRACT,
        linkLabel: "Read the full thesis",
      },
      no: {
        label: "Masteroppgave",
        title: THESIS_TITLE,
        tagline:
          "MSc i bioinformatikk, Københavns Universitet — i samarbeid med Amgen Research Copenhagen (2024).",
        bodyLabel: "Sammendrag (engelsk original)",
        body: THESIS_ABSTRACT,
        linkLabel: "Les hele oppgaven",
      },
    },
  },
];

export default featuredProjects;
