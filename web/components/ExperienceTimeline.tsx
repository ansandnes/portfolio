import type { ExperienceItem } from "@/app/types";
import { TagRow } from "@/components/ui/Tag";

export default function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <div className="relative border-l border-slate-700 ml-3 space-y-12">
      {items.map((item) => (
        <div key={item.id} className="relative pl-8 sm:pl-12 group">
          {/* Timeline dot */}
          <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-dark group-hover:ring-emerald-500/20 transition-all duration-300" />

          <div className="bg-surface rounded-xl p-6 sm:p-8 hover:bg-slate-700/50 transition-colors duration-300 border border-slate-700/50 hover:border-emerald-500/30 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {item.role}
                </h3>
                <p className="text-lg text-slate-400">{item.company}</p>
              </div>
              <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                {item.period}
              </span>
            </div>

            <ul className="space-y-2 mb-6">
              {item.description.map((desc, idx) => (
                <li
                  key={idx}
                  className="text-slate-300 flex items-start text-sm leading-relaxed"
                >
                  <span className="mr-2 mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0" />
                  {desc}
                </li>
              ))}
            </ul>

            <TagRow items={item.techStack} tone="slate" />
          </div>
        </div>
      ))}
    </div>
  );
}
