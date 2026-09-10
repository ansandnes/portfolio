/**
 * Curated resume shown on /resume, in English (`en`) and Norwegian (`no`).
 * The page has an EN/NO toggle; "Download PDF" serves the matching file under
 * web/public/assets/.
 *
 * It is a summary view: recent roles plus a "Projects" section. The full,
 * granular work history (incl. the CCIT internship → employee split) lives in
 * content/experience.ts and renders on /experience.
 */

export type ResumeLang = "en" | "no";
export const RESUME_LANGS: readonly ResumeLang[] = ["en", "no"];

export interface ResumeLink {
  label: string;
  href: string;
}

export interface ResumeJob {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeProject {
  title: string;
  bullets: string[];
  link?: ResumeLink;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeLabels {
  resume: string;
  download: string;
  profile: string;
  skills: string;
  contact: string;
  languages: string;
  experience: string;
  projects: string;
  education: string;
  opensNewTab: string;
  /** Accessible name for the language toggle. */
  toggleLabel: string;
}

export interface ResumeData {
  lang: ResumeLang;
  labels: ResumeLabels;
  profileSummary: string;
  contact: { location: string; phone: string; email: string };
  skills: ResumeSkillGroup[];
  languages: string[];
  experience: ResumeJob[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  /** Path under /public to the downloadable CV for this language. */
  pdfPath: string;
}

const CONTACT_COMMON = { phone: "+47 97 26 78 84", email: "asandnes92@gmail.com" };

export const resumeEn: ResumeData = {
  lang: "en",
  labels: {
    resume: "Resume",
    download: "Download PDF",
    profile: "Profile",
    skills: "Technical skills",
    contact: "Contact",
    languages: "Languages",
    experience: "Professional experience",
    projects: "Projects",
    education: "Education",
    opensNewTab: "(opens new tab)",
    toggleLabel: "Resume language",
  },
  profileSummary:
    "Technically curious and collaborative engineer with experience in data communication, systems monitoring, and troubleshooting. I have worked with the analysis of large volumes of data and with the integration of technical installations, where stable systems, clear communication, and fast problem-solving are essential. I like to work in a structured way and am motivated by understanding how systems fit together.",
  contact: { location: "Trondheim, Norway", ...CONTACT_COMMON },
  skills: [
    { category: "General", items: ["Data communication", "Git", "Programming", "SQL", "AI agents"] },
    { category: "Cloud / HPC", items: ["High-Performance Computing (Computerome)"] },
    { category: "Bioinformatics", items: ["scRNA-seq (10x Genomics, Seurat)", "DGE (DESeq2, EdgeR)"] },
  ],
  languages: ["Norwegian (Native)", "English (Fluent)", "Danish (Fluent)"],
  experience: [
    {
      role: "Technical System Engineer",
      company: "Kiona AS",
      period: "01/26 – Present",
      bullets: [
        "Monitor and maintain technical systems to ensure stable operation of retail and building automation, including troubleshooting and fast problem resolution.",
      ],
    },
    {
      role: "Bioinformatician",
      company: "National Center for Cancer Immune Therapy (CCIT)",
      period: "03/25 – 08/25",
      bullets: [
        "Built a Python web application (Dash/Plotly) to automate the handling of HLA-typing data output, integrating quality control and streamlining data delivery for immunology research.",
        "Automated data-conversion workflows in a high-performance Linux environment, removing bottlenecks and accelerating data access for research teams.",
        "Analysed single-cell RNA-seq data with Seurat to process and interpret complex immunology datasets, directly supporting ongoing cancer immunotherapy research.",
      ],
    },
  ],
  projects: [
    {
      title: "Volunteer developer — Mat til Gaza (politically neutral aid organisation)",
      bullets: ["Development and maintenance of the website that promotes the organisation's work."],
      link: { label: "mattilgaza.vercel.app", href: "https://mattilgaza.vercel.app/" },
    },
    {
      title: "Master's thesis — collaboration with Amgen Research Copenhagen (ARC)",
      bullets: [
        "Applied statistical tools to separate false positives from potential drug candidates in selections from DNA-encoded libraries.",
        "Compared the statistical distributions of different datasets to test the compatibility of different analysis methods.",
      ],
    },
    {
      title: "Dashboard development — Student Assistant for the Computational Science Group at ARC",
      bullets: [
        "Built and maintained interactive Python dashboards giving a structured overview of small-molecule projects.",
        "Monitored sequencing-resource usage, which improved project tracking and decision-making.",
      ],
    },
  ],
  education: [
    {
      degree: "Master's in Bioinformatics",
      institution: "University of Copenhagen (KU)",
      period: "09/21 – 06/24",
    },
    {
      degree: "Bachelor's in Biochemistry",
      institution: "University of Copenhagen (KU)",
      period: "09/16 – 02/20",
    },
  ],
  pdfPath: "/assets/cv_andreas_sandnes_en.pdf",
};

export const resumeNo: ResumeData = {
  lang: "no",
  labels: {
    resume: "CV",
    download: "Last ned PDF",
    profile: "Profil",
    skills: "Tekniske ferdigheter",
    contact: "Kontakt",
    languages: "Språk",
    experience: "Profesjonell erfaring",
    projects: "Prosjekter",
    education: "Utdanning",
    opensNewTab: "(åpnes i ny fane)",
    toggleLabel: "CV-språk",
  },
  profileSummary:
    "Teknisk interessert og samarbeidsorientert ingeniør med erfaring innen datakommunikasjon, systemovervåkning og feilsøking. Har jobbet med analyse av store mengder data og med integrasjon av tekniske anlegg der stabile systemer, tydelig kommunikasjon og raske problemløsninger er avgjørende. Jeg liker å jobbe strukturert og motiveres av å forstå hvordan systemer henger sammen.",
  contact: { location: "Trondheim, Norge", ...CONTACT_COMMON },
  skills: [
    { category: "Generelt", items: ["Datakommunikasjon", "Git", "Programmering", "SQL", "KI-agenter"] },
    { category: "Cloud / HPC", items: ["High-Performance Computing (Computerome)"] },
    { category: "Bioinformatikk", items: ["scRNA-seq (10x Genomics, Seurat)", "DGE (DESeq2, EdgeR)"] },
  ],
  languages: ["Norsk (Morsmål)", "Engelsk (Flytende)", "Dansk (Flytende)"],
  experience: [
    {
      role: "Teknisk System Ingeniør",
      company: "Kiona AS",
      period: "01/26 – Nå",
      bullets: [
        "Overvåking og vedlikehold av tekniske systemer for å sikre stabil drift av butikk- og byggautomasjon, inkludert feilsøking og rask problemløsning.",
      ],
    },
    {
      role: "Bioinformatiker",
      company: "National Center for Cancer Immune Therapy (CCIT)",
      period: "03/25 – 08/25",
      bullets: [
        "Utviklet en Python-basert webapplikasjon (Dash/Plotly) for å automatisere håndteringen av data-output fra HLA-typing, integrerte kvalitetskontroll og effektiviserte dataleveransen for immunologisk forskning.",
        "Automatiserte data-konverteringsflyter i et høytytende Linux-datamiljø, fjernet flaskehalser og akselererte datatilgangen for forskningsteam.",
        "Analyserte single-cell RNA-seq-data med Seurat for å behandle og tolke komplekse immunologiske datasett, som direkte støttet pågående kreftimmunoterapi-forskning.",
      ],
    },
  ],
  projects: [
    {
      title: "Frivillig utvikler — Mat til Gaza (politisk nøytral hjelpeorganisasjon)",
      bullets: ["Utvikling og vedlikehold av nettside som fremmer organisasjonens arbeid."],
      link: { label: "mattilgaza.vercel.app", href: "https://mattilgaza.vercel.app/" },
    },
    {
      title: "Masteroppgave — samarbeid med Amgen Research Copenhagen (ARC)",
      bullets: [
        "Anvendte statistiske verktøy for å skille falske positive molekyler fra potensielle medisin-kandidater i utvalg fra DNA-kodede bibliotek.",
        "Sammenlignet statistiske distribusjoner av ulike datasett for å teste kompatibiliteten av forskjellige analysemetoder.",
      ],
    },
    {
      title: "Dashboard-utvikling — Studentassistent for Computational Science Group hos ARC",
      bullets: [
        "Utviklet og vedlikeholdt interaktive dashboards ved bruk av Python for å gi en strukturert oversikt over småmolekyl-prosjekter.",
        "Overvåket bruk av sekvenseringsressurser, noe som forbedret prosjektsporing og beslutningstaking.",
      ],
    },
  ],
  education: [
    {
      degree: "Master i Bioinformatikk",
      institution: "Københavns Universitet (KU)",
      period: "09/21 – 06/24",
    },
    {
      degree: "Bachelor i Biokjemi",
      institution: "Københavns Universitet (KU)",
      period: "09/16 – 02/20",
    },
  ],
  pdfPath: "/assets/cv_andreas_sandnes_no.pdf",
};

export const resumes: Record<ResumeLang, ResumeData> = { en: resumeEn, no: resumeNo };

export function getResume(lang: string | undefined | null): ResumeData {
  return lang === "no" ? resumeNo : resumeEn;
}

export default resumes;
