import type { Metadata } from "next";
import { experience as experienceData } from "@/content/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Andreas Sandnes' professional journey — roles, responsibilities, and tech stacks.",
};

export default function Experience() {
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
                  <li
                    key={idx}
                    className="text-slate-300 flex items-start text-sm leading-relaxed"
                  >
                    <span className="mr-2 mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0"></span>
                    {desc}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-slate-900 text-emerald-400 border border-emerald-900/30"
                  >
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
}
