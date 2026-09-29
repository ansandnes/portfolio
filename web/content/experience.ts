import type { ExperienceItem } from "@/app/types";

/**
 * Full work history, newest first. Period format normalised to `MM/YY – MM/YY`
 * (year-only for the two apprenticeship roles) so it agrees with the resume.
 * Role, period, description and tags are translated per locale; company names
 * are proper nouns and stay the same across languages.
 */
export const experience: ExperienceItem[] = [
  {
    id: "8",
    company: "Kiona AS",
    translations: {
      en: {
        role: "Technical System Specialist",
        period: "01/26 – 01/27",
        description: [
          "Managing projects where software, data, and physical technical systems meet to lower foodwaste, and increase energy efficiency in retail and industry.",
          "Collaboration is a big part of my work. With my team, I work closely with technicians to solve problems and drive projects forward.",
        ],
        techStack: ["Data Communication", "Integrations", "Troubleshooting", "SQL", "Teamwork"],
      },
      no: {
        role: "Teknisk systemspesialist",
        period: "01/26 – 01/27",
        description: [
          "Ledelse av prosjekter der programvare, data og fysiske tekniske systemer møtes for å redusere matsvinn og øke energieffektiviteten i varehandel og industri.",
          "Samarbeid er en sentral del av arbeidet mitt. Sammen med teamet mitt jobber jeg tett med teknikere for å løse problemer og drive prosjekter fremover.",
        ],
        techStack: ["Datakommunikasjon", "Integrasjoner", "Feilsøking", "SQL", "Teamarbeid"],
      },
    },
  },
  {
    id: "1",
    company: "CCIT - National Center for Cancer Immune Therapy",
    translations: {
      en: {
        role: "Bioinformatician",
        period: "05/25 – 08/25",
        description: [
          "Automated the reformatting of scRNA-seq raw data (BCL) into FASTQ files in an HPC environment, leveraging Python and Bash for robust, scalable pipelines.",
          "Generated immune repertoire profiles by applying TRUST4 to reconstruct TCR and BCR sequences from scRNA-seq samples.",
        ],
        techStack: ["Linux", "Bash", "Python", "R", "Seurat"],
      },
      no: {
        role: "Bioinformatiker",
        period: "05/25 – 08/25",
        description: [
          "Automatiserte omformatering av rådata fra scRNA-seq (BCL) til FASTQ-filer i et HPC-miljø, med Python og Bash for robuste og skalerbare pipelines.",
          "Genererte immunrepertoarprofiler ved å bruke TRUST4 til å rekonstruere TCR- og BCR-sekvenser fra scRNA-seq-prøver.",
        ],
        techStack: ["Linux", "Bash", "Python", "R", "Seurat"],
      },
    },
  },
  {
    id: "2",
    company: "CCIT - National Center for Cancer Immune Therapy",
    translations: {
      en: {
        role: "Bioinformatician Intern",
        period: "03/25 – 05/25",
        description: [
          "In this role I am gaining experience in bioinformatics, and I am contributing with my programming and software development skills.",
          "Handle whole exome sequencing fastq, bam, and cram files through bioinformatics algorithms using nf-core pipelines in Nextflow.",
          "Retrieving public single-cell RNA sequencing data and cooperating with researchers on data analysis using Seurat in R.",
          "Human Leukocyte Antigen (HLA) typing using the HLA-LA algorithm.",
          "Developed a web-application handling the HLA-LA typing output by answering which patients have (or have not) a specific HLA type.",
        ],
        techStack: ["Python", "Dash-Plotly", "Nextflow", "R", "Seurat", "HLA-LA"],
      },
      no: {
        role: "Bioinformatiker (praktikant)",
        period: "03/25 – 05/25",
        description: [
          "I denne rollen får jeg erfaring innen bioinformatikk, og bidrar med mine ferdigheter innen programmering og programvareutvikling.",
          "Behandler fastq-, bam- og cram-filer fra heleksomsekvensering gjennom bioinformatiske algoritmer med nf-core-pipelines i Nextflow.",
          "Henter offentlige single-cell RNA-sekvenseringsdata og samarbeider med forskere om dataanalyse med Seurat i R.",
          "HLA-typing (humant leukocyttantigen) med HLA-LA-algoritmen.",
          "Utviklet en webapplikasjon som håndterer resultatene fra HLA-LA-typingen ved å svare på hvilke pasienter som har (eller ikke har) en bestemt HLA-type.",
        ],
        techStack: ["Python", "Dash-Plotly", "Nextflow", "R", "Seurat", "HLA-LA"],
      },
    },
  },
  {
    id: "3",
    company: "Amgen Research Copenhagen",
    translations: {
      en: {
        role: "Software Developer - Student Assistant for the Computational Science Group",
        period: "12/21 – 06/24",
        description: [
          "Developed interactive dashboard applications using Python.",
          "Provided managers in drug discovery research with a comprehensive overview and structure display of medicine candidate molecules.",
          "Facilitated data analysis of the experimental pipeline.",
          "Collaborated with scientists to gather software requirements.",
          "Studied scientific problems and found creative solutions.",
          "Documenting software development projects.",
          "Conducted collaborative projects with Amgen and the University of Copenhagen (including my MSc thesis).",
          "Successfully applied differential gene expression statistical tools to investigate ways to partition false positive molecules from potential medicine candidates in DNA-encoded libraries.",
        ],
        techStack: ["Python", "Dash-Plotly", "Pandas", "NumPy", "SciPy", "LaTeX - Overleaf"],
      },
      no: {
        role: "Programvareutvikler - studentassistent i Computational Science-gruppen",
        period: "12/21 – 06/24",
        description: [
          "Utviklet interaktive dashboard-applikasjoner i Python.",
          "Ga ledere innen legemiddelforskning en helhetlig oversikt over og strukturvisning av kandidatmolekyler til legemidler.",
          "Tilrettela for dataanalyse av den eksperimentelle pipelinen.",
          "Samarbeidet med forskere for å kartlegge krav til programvaren.",
          "Satte meg inn i vitenskapelige problemstillinger og fant kreative løsninger.",
          "Dokumenterte programvareutviklingsprosjekter.",
          "Gjennomførte samarbeidsprosjekter mellom Amgen og Københavns Universitet (inkludert masteroppgaven min).",
          "Anvendte statistiske verktøy for differensiell genuttrykksanalyse for å skille falske positive molekyler fra potensielle legemiddelkandidater i DNA-kodede bibliotek.",
        ],
        techStack: ["Python", "Dash-Plotly", "Pandas", "NumPy", "SciPy", "LaTeX - Overleaf"],
      },
    },
  },
  {
    id: "4",
    company: "Amgen Research Copenhagen",
    translations: {
      en: {
        role: "Student Assistant",
        period: "02/20 – 12/21",
        description: [
          "Responsible for lab-waste management.",
          "Prepared solvents for lab instruments.",
          "Ordered lab supplies.",
          "Set up office equipment and other handy tasks.",
          "Reorganized and labeled toxic compounds to comply with up-to-date regulations.",
          "Reorganized and optimized a big category of compound solutions stored in the laboratories. This simplified the retrieval of compounds for biologists and simultaneously made it easier for other student workers to place compound solutions back in place after use.",
        ],
        techStack: [
          "Excel",
          "Word",
          "Organizational Skills",
          "Attention to Detail",
          "Time Management",
          "Communication Skills",
          "Teamwork",
        ],
      },
      no: {
        role: "Studentassistent",
        period: "02/20 – 12/21",
        description: [
          "Ansvarlig for håndtering av laboratorieavfall.",
          "Klargjorde løsemidler til laboratorieinstrumenter.",
          "Bestilte laboratorieutstyr.",
          "Satte opp kontorutstyr og tok meg av andre praktiske oppgaver.",
          "Omorganiserte og merket giftige forbindelser i tråd med gjeldende regelverk.",
          "Omorganiserte og optimaliserte en stor kategori av stoffløsninger som ble lagret i laboratoriene. Dette gjorde det enklere for biologene å finne stoffene, og samtidig enklere for andre studentarbeidere å sette løsningene tilbake på plass etter bruk.",
        ],
        techStack: [
          "Excel",
          "Word",
          "Organisering",
          "Nøyaktighet",
          "Tidsstyring",
          "Kommunikasjon",
          "Teamarbeid",
        ],
      },
    },
  },
  {
    id: "5",
    company: "Aquaduct ApS",
    translations: {
      en: {
        role: "Assistant Gardener",
        period: "05/17 – 12/19",
        description: [
          "General gardening tasks such as lawn mowing, hedge trimming, planting, weeding, and garden maintenance.",
          "Building and maintaining garden paths and patios.",
          "Tree trimming and removal.",
          "Building small garden structures such as fences, compost heaps, and sheds.",
        ],
        techStack: [
          "Landscaping",
          "Garden Maintenance",
          "Plant Care",
          "Tool Operation",
          "Customer Service",
          "Time Management",
        ],
      },
      no: {
        role: "Gartnerassistent",
        period: "05/17 – 12/19",
        description: [
          "Generelle hagearbeidsoppgaver som plenklipping, hekkeklipping, planting, luking og vedlikehold av hager.",
          "Bygging og vedlikehold av hagestier og terrasser.",
          "Beskjæring og felling av trær.",
          "Bygging av små hagekonstruksjoner som gjerder, kompostbinger og boder.",
        ],
        techStack: [
          "Anleggsgartnerarbeid",
          "Hagevedlikehold",
          "Plantestell",
          "Verktøybruk",
          "Kundeservice",
          "Tidsstyring",
        ],
      },
    },
  },
  {
    id: "6",
    company: "A. Sandnes Mur og Flis",
    translations: {
      en: {
        role: "Bricklayer",
        period: "2013 – 2014",
        description: ["Building bathrooms.", "Made a lot of mistakes, learned a ton!"],
        techStack: [
          "Running a Business",
          "Customer Service",
          "Administration",
          "Bricklaying",
          "Tile Laying",
          "Bathroom Construction",
          "Planning",
        ],
      },
      no: {
        role: "Murer",
        period: "2013 – 2014",
        description: ["Bygde bad.", "Gjorde mange feil, og lærte masse!"],
        techStack: [
          "Drift av eget firma",
          "Kundeservice",
          "Administrasjon",
          "Muring",
          "Flislegging",
          "Baderomsbygging",
          "Planlegging",
        ],
      },
    },
  },
  {
    id: "7",
    company: "Ivar S. Moe A/S",
    image: "/images/bricklayer.png",
    translations: {
      en: {
        role: "Bricklayer - Journeyman Letter",
        period: "2011 – 2013",
        description: [
          "Laying tiles - ceramic, natural stone, and mosaics.",
          "Building bathrooms.",
          "Bricklaying.",
        ],
        techStack: ["Bricklaying", "Tile Laying", "Bathroom Construction", "Planning"],
      },
      no: {
        role: "Murer - svennebrev",
        period: "2011 – 2013",
        description: ["Flislegging - keramikk, naturstein og mosaikk.", "Bygde bad.", "Muring."],
        techStack: ["Muring", "Flislegging", "Baderomsbygging", "Planlegging"],
      },
    },
  },
];

export default experience;
