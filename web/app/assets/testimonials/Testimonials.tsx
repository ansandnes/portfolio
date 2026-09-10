const testimonials = [
    {
        id: 1,
        name: "Evdoxia Karadoulama, PhD",
        role: "Postdoctoral Bioinformatics Researcher",
        company: "TIL group, CCIT-DK (National Center for Cancer Immune Therapy)",
        relation: "Evdoxia was the primary bioinformatician taking over the projects I worked on after I left the TIL group. We collaborated closely on several projects during my time there.",
        image: null,
        content: `It is my pleasure to recommend Andreas Sandnes for a software engineering role in biological research. During the period of less than six months that I had the opportunity to supervise Andreas in a bioinformatics setting, he consistently demonstrated exceptional technical skills, adaptability, and a collaborative spirit.
                
                Andreas made impactful contributions in a remarkably short time. He developed a custom HLA typing output handler that automates reporting and integrates quality control checks, significantly streamlining immunology research workflows. He also automated BCL-to-FASTQ conversion using Python and Bash in a high-performance computing environment, improving both efficiency and reliability in our data processing pipeline. In addition, he applied Seurat for single-cell RNA-seq analysis performing quality control, normalization, clustering, and dimensionality reduction enabling clearer downstream interpretation of complex immunology datasets.

                Across all these projects, Andreas wrote well-structured, modular, and thoroughly documented code, making his tools easy to maintain, adapt, and integrate into larger collaborative frameworks. He approaches challenges with creativity, takes ownership of his work, and learns rapidly from any feedback or obstacles, applying those lessons to deliver even stronger results.

                From my perspective, Andreas stands out for his ability to bridge the gap between software engineering and biological research. His technical abilities, curiosity, and strong communication skills make him a valuable addition to any interdisciplinary team. I am confident he will bring the same level of dedication, innovation, and professionalism to any future role he undertakes.`,
        tech: ["Automation", "Workflow optimization", "Data processing pipelines", "Quality control", "High-performance computing (HPC)", "Well-documented code", "Maintainable code", "Scalable code"],
        traits: ["Problem-solving", "Adaptability", "Curiosity", "Creativity", "Strong communication skills", "Takes ownership", "Collaborative", "Dedicated", "Innovative"],
        impact: ["High velocity", "Streamlining workflows", "Improving efficiency", "Improving reliability", "User-oriented solutions", "Adds value quickly", "Strong code quality"]
    },
    {
        id: 2,
        name: "Marco Donia, M.D. Ph.D.",
        role: "Professor of Clinical Oncology at the University of Copenhagen, and Group Leader",
        company: "TIL group, CCIT-DK (National Center for Cancer Immune Therapy)",
        relation: "Marco was the head of the immunology research group where I worked as a bioinformatician.",
        image: null,
        content: `Andreas has been working in the Tumor-infiltrating lymphocyte group at National Center for Cancer Immune Therapy, Denmark, from March 2025 to August 2025.

                I have received consistent and detailed feedback from colleagues who have collaborated with him closely in the context of bioinformatics and software development for biological research. Based on these reports, I can say with confidence that Andreas brings a valuable blend of technical skill, adaptability, and collaborative spirit to his work.

                In his role, Andreas has contributed to single-cell RNA-seq analysis using Seurat, supporting the processing and interpretation of complex immunology datasets. He has also developed a custom HLA typing output handler automating the delivery of data, including integrated quality control. Furthermore, he has automated BCL-to-FASTQ conversion workflows in a high-performance computing environment, streamlining data delivery to researchers and eliminating processing bottlenecks.

                What stands out from the feedback I have received is Andreas’ ability to rapidly learn new tools and apply them effectively to real research needs. He engages productively with interdisciplinary teams, bridging computational approaches and biological objectives. Even without direct day-to-day interaction, it is clear to me that his contributions have had a positive impact on ongoing research efforts.

                I believe Andreas would be a strong asset to any software engineering position within biological research. He combines the technical foundation needed to tackle challenging data workflows with the adaptability to work effectively in diverse scientific environments.`,
        tech: ["R programming", "Single-cell RNA-seq analysis", "Seurat", "Python programming", "HLA typing"],
        traits: ["Rapid learner", "Collaborative", "Professional", "Interdisciplinary thinker", "Team player"],
        impact: ["High impact contributions", "Supporting research teams", "Bridges software engineering and research"]
    },
    {
        id: 3,
        name: "Arianna Draghi, MD PhD",
        role: "Postdoctoral Researcher",
        company: "TIL group, CCIT-DK (National Center for Cancer Immune Therapy)",
        relation: "I reported to Arianna on single-cell data analysis and other bioinformatics projects during my time at the TIL group.",
        image: null,
        content: `I am pleased to recommend Andreas Sandnes for a software engineering role in biological research.
            M.Sc. Andreas Sandnes joined the TIL group at the National Center for Cancer Immunotherapy (Denmark) in March 2025. In less than six months in bioinformatics, Andreas has already delivered valuable results, combining solid programming ability with a cooperative and flexible attitude.

            He created a custom HLA typing output handler that streamlines reporting and includes quality control, directly supporting immunology research workflows. He also set up automated BCL-to-FASTQ conversion using Python and Bash on a high-performance computing system, increasing both speed and reliability of data processing. In addition, he has applied Seurat to single-cell RNA-seq analysis, performing quality control, normalization, clustering, and dimensionality reduction to support interpretation of complex datasets. In all these projects, Andreas produces clean, modular, and well-documented code, making it straightforward to maintain and adapt. He takes responsibility for his work, improves quickly from feedback, and consistently turns challenges into stronger outcomes.

            Although still early in his tumor immunology training, Andreas learns quickly and transfers knowledge from different fields, as shown by the rapid progress he has made in just a few months. His diverse academic and professional background demonstrates that he performs well when facing new challenges.

            Andreas works with focus, solves problems with creativity, and communicates clearly across interdisciplinary teams. His technical skills, curiosity, adaptability, and innate attitude to support colleagues make him a strong asset to any organization working at the interface of software engineering and biological research.

            I am confident Andreas will excel in any goal he sets for himself, and I recommend him without hesitation for this position.`,
        tech: ["R programming", "Single-cell RNA-seq analysis", "Seurat", "Python programming", "HLA typing"],
        traits: ["Rapid learner", "Collaborative", "Professional", "Interdisciplinary thinker", "Team player"],
        impact: ["High impact contributions", "Supporting research teams", "Bridges software engineering and research"]
    },
    {
        id: 4,
        name: "Johannes Dolberg",
        role: "Computational Scientist",
        company: "Amgen Research Copenhagen",
        relation: "Johannes was the leader I reported to in all projects, and he was the primary supervisor of my master’s thesis.",
        image: null,
        content: `We enjoyed having Andreas working with our computational science group as a studenthelper for two years before completing his thesis. During this time, he diligently pursued learning Python and became well-versed in Dash Enterprise. He has a keen eye for creating insightful dashboards, often in close collaboration with subject matter experts. Andreas demonstrated this ability multiple times with projects related to both biology andchemistry. Additionally, he engaged in various analyses related to his thesis on applying RNA seq analysis on DNA-encoded libraries, which led to insights for further exploration.`,
        tech: ["Data Analysis", "DNA-encoded Chemical Libraries", "R programming", "RNAseq", "Differential Gene Expression", "DEseq2", "EdgeR", "Limma", "Python programming", "Dash-Plotly", "Dashboard Development", "Pandas", "NumPy", "SciPy", "LaTeX - Overleaf"],
        traits: ["Collaborative", "Focused", "Diligent"],
        impact: ["Insightful Dashboards", "Data-driven Insights"]
    },
    {
        id: 5,
        name: "Martin Bengtsson",
        role: "Biologist",
        company: "Amgen Research Copenhagen",
        relation: "Martin is a biologist analyzing data from Illuminasequencing. I collaborated with him on multipledashboard projects facilitating his analysis.",
        image: null,
        content: `Andreas immediately understood our needs and quickly delivered a useful prototype that we could build on together. If we weren't sure where to go, he did not hesitate to suggest a direction that in the end turned out to be the right call. He created complex visualizations and data extractions involving multiple database calls, while always making sure performance was good for the user.`,
        tech: ["Python programming", "Dash-Plotly", "Dashboard Development"],
        traits: ["Takes initiative", "Problem-solving", "User-focused"],
        impact: ["Complex Visualizations", "Quick Results", "Insightful Dashboards", "User-friendly Solutions"]
    },
    {
        id: 6,
        name: "Daniel Vik",
        role: "Computational Scientist",
        company: "Amgen Research Copenhagen",
        relation: "Daniel is a biochemist and data scientist, he was the secondary supervisor of my master’s thesis.",
        image: null,
        content: `One of the things that struck me while working with Andreas is that he is ambitious and driven. He is eager to throw himself at projects that might be out of his depth at first. However, he is a fast learner, and immediately picks up the skills needed to achieve his goals. His "can-do attitude", grit, and ability to learn quickly makes him an incredibly promising scientist/engineer.`,
        tech: ["Data Analysis", "DNA-encoded Chemical Libraries",],
        traits: ["Driven", "Ambitious", "Fast learner", "Has Grit", "Can-do attitude"],
        impact: []
    }

];

export default testimonials;