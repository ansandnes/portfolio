import type { ReactNode } from "react";

type Tone = "emerald" | "slate";

const TONES: Record<Tone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-1 rounded-md",
  slate: "bg-elevated text-emerald-600 dark:text-emerald-400 border-line px-2 py-1 rounded",
};

export function Tag({ children, tone = "emerald" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`text-xs font-medium border ${TONES[tone]}`}>{children}</span>;
}

/** A wrapping row of tags; renders nothing when `items` is empty. */
export function TagRow({
  items,
  tone = "emerald",
  className = "",
}: {
  items: readonly string[];
  tone?: Tone;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Tag key={item} tone={tone}>
          {item}
        </Tag>
      ))}
    </div>
  );
}

export default Tag;
