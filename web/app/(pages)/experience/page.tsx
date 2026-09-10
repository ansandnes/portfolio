import { ExperienceItem } from '../../types';

const experienceData: ExperienceItem[] = [
    {
        id: '1',
        role: 'Bioinformatician',
        company: 'CCIT - National Center for Cancer Immune Therapy',
        period: '05/2025 - 08/2025',
        description: [
            "Automated the reformatting of scRNA-seq raw data (BCL) into FASTQ files in an HPC environment, leveraging Python and Bash for robust, scalable pipelines.",
            "Generated immune repertoire profiles by applying TRUST4 to reconstruct TCR and BCR sequences from scRNA-seq samples."
        ],
        techStack: ["Linux", "Bash", "Python", "TRUST4"]
    },
    {
        id: '2',
        role: 'Bioinformatician Intern',
        company: 'CCIT - National Center for Cancer Immune Therapy',
        period: '03/2025 - 05/2025',
        description: [
            "In this role I am gaining experience in bioinformatics, and I am contributing with my programming and software development skills.",
            "Handle whole exome sequencing fastq, bam, and cram files through bioinformatics algorithms using nf-core pipelines in Nextflow.",
            "Retrieving public single-cell RNA sequencing data and cooperating with researchers on data analysis using Seurat in R.",
            "Human Leukocyte Antigen (HLA) typing using the HLA-LA algorithm.",
            "Developed a web-application handling the HLA-LA typing output by answering which patients have (or have not) a specific HLA type."
        ],
        techStack: ['Python', 'Dash-Plotly', 'Nextflow', 'R', 'Seurat', 'HLA-LA']
    },
    {
        id: '3',
        role: 'Software Developer - Student Assistant for the Computational Science Group',
        company: 'Amgen Research Copenhagen',
        period: '12/2021 - 06/2024',
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
        techStack: ['Python', 'Dash-Plotly', 'Pandas', 'NumPy', 'SciPy', 'LaTeX - Overleaf']
    },
    {
        id: '4',
        role: 'Student Assistant',
        company: 'Amgen Research Copenhagen',
        period: '02/2020 - 12/2021',
        description: [
            "Responsible for lab-waste management.",
            "Prepared solvents for lab instruments.",
            "Ordered lab supplies.",
            "Set up office equipment and other handy tasks.",
            "Reorganized and labeled toxic compounds to comply with up-to-date regulations.",
            "Reorganized and optimized a big category of compound solutions stored in the laboratories. This simplified the retrieval of compounds for biologists and simultaneously made it easier for other student workers to place compound solutions back in place after use."
        ],
        techStack: ['Excel', 'Word', 'Organizational Skills', 'Attention to Detail', 'Time Management', 'Communication Skills', 'Teamwork']
    },
    {
        id: '5',
        role: 'Assistant Gardener',
        company: 'Aquaduct ApS',
        period: '05/2017 - 12/2019',
        description: [
            "General gardening tasks such as lawn mowing, hedge trimming, planting, weeding, and garden maintenance.",
            "Building and maintaining garden paths and patios.",
            "Tree triming and removal.",
            "Building small garden structures such as fences, compost heaps, and sheds.",
        ],
        techStack: ['Landscaping', 'Garden Maintenance', 'Plant Care', 'Tool Operation', 'Customer Service', 'Time Management']
    },
    {
        id: '6',
        role: 'Bricklayer',
        company: 'A. Sandnes Mur og Flis',
        period: '2013 - 2014',
        description: [
            "Building bathrooms.",
        ],
        techStack: ['Running a Business', 'Customer Service', 'Administration', 'Bricklaying', 'Tile Laying', 'Bathroom Construction', 'Planning']
    },
    {
        id: '7',
        role: 'Bricklayer - Journeyman Letter',
        company: 'Ivar S. Moe A/S',
        period: '2011 - 2013',
        description: [
            "Laying tiles - ceramic, natural stone, and mosaics.",
            "Building bathrooms.",
            "Bricklaying."
        ],
        techStack: ['Bricklaying', 'Tile Laying', 'Bathroom Construction', 'Planning']
    }
];

export default async function Experience() {
    return (
        <div className="pt-24 pb-20 max-w-4xl mx-auto px-6 animate-slide-up">
            <h1 className="text-3xl font-bold text-white mb-12">Professional Journey</h1>

            <div className="relative border-l border-slate-700 ml-3 space-y-12">
                {experienceData.map((item) => (
                    <div key={item.id} className="relative pl-8 sm:pl-12 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-dark group-hover:ring-emerald-500/20 transition-all duration-300"></div>

                        <div className="bg-surface rounded-xl p-6 sm:p-8 hover:bg-slate-700/50 transition-colors duration-300 border border-slate-700/50 hover:border-emerald-500/30 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {item.role}
                                    </h3>
                                    <p className="text-lg text-slate-400">{item.company}</p>
                                </div>
                                <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                    {item.period}
                                </span>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {item.description.map((desc, idx) => (
                                    <li key={idx} className="text-slate-300 flex items-start text-sm leading-relaxed">
                                        <span className="mr-2 mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                        {desc}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                                {item.techStack.map((tech) => (
                                    <span key={tech} className="px-2 py-1 text-xs rounded bg-slate-900 text-emerald-400 border border-emerald-900/30">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
