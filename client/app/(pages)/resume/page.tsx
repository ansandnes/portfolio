// app/resume/page.tsx
"use client";

import { Download } from "lucide-react";
import Button from "../../components/Button";
import Link from "next/link";
import ResumeDownload from "../../utils/ResumeDownload";

export default function ResumePage() {
    const contactInfo = {
        location: "Trondheim, Norge",
        phone: "+47 97 26 78 84",
        email: "asandnes92@gmail.com",
    };

    const technicalSkills = [
        { category: "Software Utvikling", items: ["Git", "Python", "Dash-Plotly (Flask)", "R", "Bash", "Next.js/React", "AI Vibe-coding", "Flere kommer.."] },
        { category: "Cloud", items: ["High-Performance Computing (Computerome)"] },
        { category: "Bioinformatics", items: ["scRNA-seq (10x Genomics, Seurat)", "DGE (DEseq2, EdgeR)"] },
    ];

    const professionalExperience = [
        {
            role: "Bioinformatiker",
            company: "National Center for Cancer Immune Therapy (CCIT)",
            period: "03/25 - 08/25",
            description: [
                "Utviklet en Python-basert webapplikasjon (Dash-Plotly) for å automatisere håndteringen av data output fra HLA-typing, integrerte kvalitetskontroll og effektiviserte dataleveransen for immunologisk forskning.",
                "Automatiserte data-konverteringsflyter i et høytytende Linux datamiljø, fjernet flaskehalser og akselererte datatilgangen for forskningsteam.",
                "Analyserte single-cell RNA-seq data med Seurat for å tolke komplekse immunologiske datasett, direkte støttet kreftimmunoterapi-forskning.",
            ],
        },
    ];

    const projects = [
        {
            title: "Frivillig softwareutvikler – Nøytral hjelpeorganisasjon Mat til Gaza",
            description: [
                "Bygget en nettside for å fremme organisasjonens arbeid og lette donasjoner.",
                <Link href="https://mattilgaza.github.io/hjemmeside/index.html" className="text-emerald-600 underline" target="_blank"> mattilgaza.github.io (opens new tab)</Link>,
            ],
        },
        {
            title: "Masteroppgave – Amgen Research Copenhagen (ARC)",
            description: [
                "Anvendte statistiske verktøy for å skille falske positive molekyler fra potensielle medisin-kandidater i DNA-bibliotek.",
                "Sammenlignet statistiske distribusjoner av ulike datasett for å teste kompatibiliteten av forskjellige analysemetoder.",
            ],
        },
        {
            title: "Dashboard-utvikling – Studentassistent hos ARC",
            description: [
                "Utviklet og vedlikeholdt interaktive dashboards ved bruk av Python for småmolekyl-prosjekter.",
                "Overvåket bruk av sekvenseringsressurser, forbedret prosjektsporing og beslutningstaking.",
            ],
        },
    ];

    const education = [
        {
            degree: "Master i Bioinformatikk",
            institution: "Københavns Universitet (KU)",
            period: "09/21-06/24",
        },
        {
            degree: "Bachelor i Biokjemi",
            institution: "Københavns Universitet (KU)",
            period: "09/16-02/20",
        },
    ];

    const languages = ["Norsk (Morsmål)", "Engelsk (Flytende)", "Dansk (Flytende)"];

    return (
        <div className="pt-24 pb-20 max-w-6xl mx-auto px-6 animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Resume</h1>
                <Button variant="outline" className="text-sm" onClick={ResumeDownload}>
                    <Download size={16} />
                    Download PDF
                </Button>
            </div>

            {/* Main grid */}
            <div className="bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Sidebar */}
                <div className="col-span-1 space-y-8 bg-gray-100 p-4 rounded-lg">
                    <section>
                        <div className="text-2xl font-bold mb-4">Andreas Sandnes</div>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Profil</h3>
                        <p className="text-sm text-slate-700">
                            Innovativ, nysgjerrig, og løsningsorientert programvareutvikler som løser komplekse problemer og bygger effektive systemer. Samarbeider godt med team for å skape robuste og brukervennlige verktøy.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Tekniske ferdigheter</h3>
                        <ul className="space-y-2">
                            {technicalSkills.map((skill) => (
                                <li key={skill.category}>
                                    <div className="font-semibold text-sm">{skill.category}</div>
                                    <div className="text-slate-600 text-sm">{skill.items.join(", ")}</div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Kontakt</h3>
                        <ul className="space-y-1 text-sm text-slate-700">
                            <li>{contactInfo.location}</li>
                            <li>{contactInfo.phone}</li>
                            <li>{contactInfo.email}</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Språk</h3>
                        <ul className="space-y-1 text-sm text-slate-700">
                            {languages.map((lang) => (
                                <li key={lang}>{lang}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Right Content */}
                <div className="col-span-1 md:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Profesjonell Erfaring</h3>
                        {professionalExperience.map((job) => (
                            <div key={job.role} className="mb-6">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">{job.role}</h4>
                                    <span className="text-sm text-slate-500 italic">{job.period}</span>
                                </div>
                                <div className="text-emerald-600 font-medium mb-2">{job.company}</div>
                                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                                    {job.description.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Prosjekter</h3>
                        {projects.map((proj) => (
                            <div key={proj.title} className="mb-4">
                                <div className="font-bold">{proj.title}</div>
                                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                                    {proj.description.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
                            Utdanning
                        </h3>
                        <div className="flex flex-wrap gap-8">
                            {education.map((edu) => (
                                <div key={edu.degree} className="mb-4 w-64">
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="text-slate-600">{edu.institution}</div>
                                    <div className="text-sm text-slate-500 italic">{edu.period}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
