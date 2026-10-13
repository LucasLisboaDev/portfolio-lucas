import { cn } from "@/lib/cn";
import { VT_ATTR } from "@/lib/transitions";

type ProjectCoverProps = {
  slug: string;
  num: string;
  category: string;
  coverTitle: string;
  live: boolean;
  tone: "dark" | "light";
  className?: string;
};

/** Splits a cover title on "\n" into block lines. */
export function CoverLines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

/**
 * Typographic project cover: number and category on top, the cover title in
 * display type at the bottom, in ink or warm surface. A stand-in until real
 * screenshots or diagrams are chosen (see the plan's open questions).
 * Decorative: the card's heading carries the real project name.
 */
export default function ProjectCover({
  slug,
  num,
  category,
  coverTitle,
  live,
  tone,
  className,
}: ProjectCoverProps) {
  const dark = tone === "dark";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-card p-[22px] md:p-8",
        "h-[260px] md:h-[340px] lg:h-[380px]",
        "transition-transform duration-base ease-reveal group-hover:-translate-y-1.5",
        dark ? "bg-ink text-canvas" : "bg-surface text-ink",
        className,
      )}
    >
      <div className="flex items-center justify-between text-meta font-medium tracking-[0.04em]">
        <span>
          /{num} · {category}
        </span>
        {live && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
              dark ? "bg-canvas/[0.12]" : "bg-canvas",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-status" />
            Live
          </span>
        )}
      </div>
      <span
        {...{ [VT_ATTR]: slug }}
        className="text-display stretch-normal self-start text-[clamp(1.75rem,7.5vw,2.875rem)] md:text-[clamp(1.5rem,3.4vw,2.875rem)]"
      >
        <CoverLines text={coverTitle} />
      </span>
    </div>
  );
}
