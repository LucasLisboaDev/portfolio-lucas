import { cn } from "@/lib/cn";

type StatusPillProps = {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Small availability badge with a green dot, used in the nav and contact
 * section. The soft pulse only runs when the visitor allows motion.
 */
export default function StatusPill({
  label = "Open to opportunities",
  tone = "light",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-meta font-medium",
        tone === "light" ? "border-line text-ink" : "border-ink-line text-canvas",
        className,
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-status opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status" />
      </span>
      {label}
    </span>
  );
}
