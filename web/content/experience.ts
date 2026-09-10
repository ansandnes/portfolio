import type { ExperienceItem } from "@/app/types";

/**
 * Full work history, newest first. Period format normalised to `MM/YY – MM/YY`
 * (year-only for the two apprenticeship roles) so it agrees with the resume.
 */
export const experience: ExperienceItem[] = [
  {
    id: "1",
    role: "Bioinformatician",
    company: "CCIT - National Center for Cancer Immune Therapy",
    period: "05/25 – 08/25",
    description: [
      "Automated the reformatting of scRNA-seq raw data (BCL) into FASTQ files in an HPC environment, leveraging Python and Bash for robust, scalable pipelines.",
      "Generated immune repertoire profiles by applying TRUST4 to reconstruct TCR and BCR sequences from scRNA-seq samples.",
    ],
    techStack: ["Linux", "Bash", "Python", "TRUST4"],
  },
  {
    id: "2",
    role: "Bioinformatician Intern",
    company: "CCIT - National Center for Cancer Immune Therapy",
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
  {
    id: "3",
    role: "Software Developer - Student Assistant for the Computational Science Group",
    company: "Amgen Research Copenhagen",
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
  {
    id: "4",
    role: "Student Assistant",
    company: "Amgen Research Copenhagen",
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
  {
    id: "5",
    role: "Assistant Gardener",
    company: "Aquaduct ApS",
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
  {
    id: "6",
    role: "Bricklayer",
    company: "A. Sandnes Mur og Flis",
    period: "2013 – 2014",
    description: ["Building bathrooms."],
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
  {
    id: "7",
    role: "Bricklayer - Journeyman Letter",
    company: "Ivar S. Moe A/S",
    period: "2011 – 2013",
    description: [
      "Laying tiles - ceramic, natural stone, and mosaics.",
      "Building bathrooms.",
      "Bricklaying.",
    ],
    techStack: ["Bricklaying", "Tile Laying", "Bathroom Construction", "Planning"],
  },
];

export default experience;
