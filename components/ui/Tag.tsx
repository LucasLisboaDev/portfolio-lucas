import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = {
  children: ReactNode;
  /**
   * surface: filled chip on light backgrounds (project tech tags)
   * outline: bordered chip on light backgrounds
   * dark: bordered chip inside dark sections
   */
  variant?: "surface" | "outline" | "dark";
  className?: string;
};

/** Small pill used for tech stacks, categories and related work. */
export default function Tag({ children, variant = "surface", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-meta font-medium",
        variant === "surface" && "bg-surface text-ink",
        variant === "outline" && "border border-line text-ink",
        variant === "dark" && "border border-ink-line text-canvas",
        className,
      )}
    >
      {children}
    </span>
  );
}
