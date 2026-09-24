import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { ArchitectureNode } from "@/app/types";

/** A very simple boxes-and-arrows sketch of a project's components. */
export default function ArchitectureDiagram({
  nodes,
  note,
}: {
  nodes: ArchitectureNode[];
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-elevated/50 p-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {nodes.map((node, i) => (
          <Fragment key={node.id}>
            <div className="flex-1 min-w-[8rem] bg-card border border-line rounded-lg px-4 py-3 text-center shadow-sm">
              <div className="text-sm font-semibold text-foreground">{node.label}</div>
              {node.description && (
                <div className="text-xs text-subtle mt-1">{node.description}</div>
              )}
            </div>
            {i < nodes.length - 1 && (
              <div className="flex justify-center text-muted shrink-0" aria-hidden="true">
                <ArrowDown size={18} className="md:hidden" />
                <ArrowRight size={18} className="hidden md:block" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      {note && <p className="text-xs text-subtle mt-4 italic">{note}</p>}
    </div>
  );
}
