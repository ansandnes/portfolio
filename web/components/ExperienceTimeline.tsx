import Image from "next/image";
import type { ExperienceItem } from "@/app/types";
import { TagRow } from "@/components/ui/Tag";

export default function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <div className="relative border-l border-line ml-3 space-y-12">
      {items.map((item) => (
        <div key={item.id} className="relative pl-8 sm:pl-12 group">
          {/* Timeline dot */}
          <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-background group-hover:ring-emerald-500/20 transition-all duration-300" />

          <div className="bg-card rounded-xl p-6 sm:p-8 hover:bg-elevated transition-colors duration-300 border border-line hover:border-emerald-500/40 shadow-lg">
            {/* Header — full card width, same for every entry so dates line up across sections */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  {item.role}
                </h3>
                <p className="text-lg text-muted">{item.company}</p>
              </div>
              <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-semibold bg-elevated text-muted border border-line whitespace-nowrap">
                {item.period}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8">
              <div className="flex-1 min-w-0">
                <ul className="space-y-2 mb-6">
                  {item.description.map((desc, idx) => (
                    <li key={idx} className="text-muted flex items-start text-sm leading-relaxed">
                      <span className="mr-2 mt-1.5 w-1 h-1 bg-emerald-500 rounded-full flex-shrink-0" />
                      {desc}
                    </li>
                  ))}
                </ul>

                <TagRow items={item.techStack} tone="slate" />
              </div>

              {item.image && (
                <div className="flex justify-center sm:justify-start shrink-0 sm:mr-6 sm:-translate-x-[100px] sm:-translate-y-[20px]">
                  <div className="relative h-[142px] w-[142px] rounded-full overflow-hidden ring-4 ring-emerald-500/20 border border-line shadow-md transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={`${item.role} — ${item.company}`}
                      fill
                      sizes="142px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
