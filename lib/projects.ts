import {
  githubProjects,
  type GitHubProject,
  type ProjectCategory,
} from "@/data/github-projects";

/** Display order of the filter chips. */
export const projectCategories: ProjectCategory[] = [
  "Agentic AI",
  "RAG & Search",
  "ML Research",
  "Full Stack",
];

/** Lightweight card data. Only this crosses to the browser, never the full write-ups. */
export type ProjectCardData = {
  slug: string;
  num: string;
  title: string;
  coverTitle: string;
  category: ProjectCategory;
  blurb: string;
  tags: string[];
  live: boolean;
  /** Covers alternate dark and light by position, stable across filtering. */
  tone: "dark" | "light";
};

export const pad2 = (n: number) => String(n).padStart(2, "0");

/** First sentence of a summary, used when a project has no highlight line. */
export function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

/** The project's one-line pitch: its highlight, or the first sentence of its summary. */
export function projectBlurb(p: GitHubProject): string {
  return p.highlight ?? firstSentence(p.summary);
}

export function getProjectCards(): ProjectCardData[] {
  return githubProjects.map((p, i) => ({
    slug: p.id,
    num: pad2(i + 1),
    title: p.title,
    coverTitle: p.coverTitle,
    category: p.category,
    blurb: projectBlurb(p),
    tags: p.tech.slice(0, 4),
    live: Boolean(p.liveUrl),
    tone: i % 2 === 0 ? "dark" : "light",
  }));
}

export function getProject(slug: string) {
  const index = githubProjects.findIndex((p) => p.id === slug);
  if (index === -1) return null;
  const project = githubProjects[index];
  const next = githubProjects[(index + 1) % githubProjects.length];
  return {
    project,
    index,
    num: pad2(index + 1),
    tone: (index % 2 === 0 ? "dark" : "light") as "dark" | "light",
    next: { slug: next.id, title: next.title, category: next.category, num: pad2(((index + 1) % githubProjects.length) + 1) },
  };
}

export function allProjectSlugs(): string[] {
  return githubProjects.map((p) => p.id);
}

/** Readable host for a live URL, for example "jiujitsujobs.net". */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
