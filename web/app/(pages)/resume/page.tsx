import type { Metadata } from "next";
import { Download } from "lucide-react";
import { resume } from "@/content/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Andreas Sandnes — profile, skills, experience, projects, and education.",
};

export default function ResumePage() {
  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-6 animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Resume</h1>
        <a
          href={resume.pdfPath}
          download
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-400 hover:text-white"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>

      {/* Main grid */}
      <div className="bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-8 bg-gray-100 p-4 rounded-lg">
          <section>
            <div className="text-2xl font-bold mb-4">Andreas Sandnes</div>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Profile</h3>
            <p className="text-sm text-slate-700">{resume.profileSummary}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              Technical skills
            </h3>
            <ul className="space-y-2">
              {resume.skills.map((skill) => (
                <li key={skill.category}>
                  <div className="font-semibold text-sm">{skill.category}</div>
                  <div className="text-slate-600 text-sm">{skill.items.join(", ")}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">Contact</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>{resume.contact.location}</li>
              <li>{resume.contact.phone}</li>
              <li>{resume.contact.email}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              Languages
            </h3>
            <ul className="space-y-1 text-sm text-slate-700">
              {resume.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Content */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              Professional experience
            </h3>
            {resume.experience.map((job) => (
              <div key={`${job.company}-${job.period}`} className="mb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-lg">{job.role}</h4>
                  <span className="text-sm text-slate-500 italic">{job.period}</span>
                </div>
                <div className="text-emerald-600 font-medium mb-2">{job.company}</div>
                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                  {job.bullets.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              Projects
            </h3>
            {resume.projects.map((proj) => (
              <div key={proj.title} className="mb-4">
                <div className="font-bold">{proj.title}</div>
                <ul className="list-disc list-outside ml-4 text-slate-700 space-y-1 text-sm">
                  {proj.bullets.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                  {proj.link && (
                    <li>
                      <a
                        href={proj.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 underline"
                      >
                        {proj.link.label} (opens new tab)
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-bold uppercase border-b border-slate-300 pb-2 mb-4">
              Education
            </h3>
            <div className="flex flex-wrap gap-8">
              {resume.education.map((edu) => (
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
