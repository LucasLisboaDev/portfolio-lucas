import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseSections from "@/components/case-study/CaseSections";
import { BackToWork, NextProjectLink } from "@/components/case-study/CaseNavLinks";
import Reveal from "@/components/motion/Reveal";
import PillButton from "@/components/ui/PillButton";
import StatusPill from "@/components/ui/StatusPill";
import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { allProjectSlugs, getProject, hostOf, projectBlurb } from "@/lib/projects";
import { PROJECT_TITLE, VT_ATTR } from "@/lib/transitions";

type Params = { params: { slug: string } };

/** Every case study is generated at build time; unknown slugs return 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return allProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const data = getProject(params.slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: `${project.title} | Case Study | Lucas Lisboa`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.summary,
      type: "article",
    },
  };
}

export default function CaseStudyPage({ params }: Params) {
  const data = getProject(params.slug);
  if (!data) notFound();
  const { project, num, tone, next } = data;

  const lines = project.coverTitle.split("\n");
  const dark = tone === "dark";
  const meta = [
    { label: "Category", value: project.category },
    { label: "Type", value: project.subtitle },
    { label: "Core stack", value: project.tech.slice(0, 3).join(" · ") },
    {
      label: "Status",
      value: project.liveUrl ? `Live at ${hostOf(project.liveUrl)}` : "Code on GitHub",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
        <a
          href="#main"
          className="sr-only left-4 top-4 z-[60] rounded-full bg-ink px-4 py-2 text-sm text-canvas focus:not-sr-only focus:absolute"
        >
          Skip to content
        </a>
        <nav
          aria-label="Case study"
          className="mx-auto flex h-[76px] max-w-content items-center justify-between gap-4 px-gutter-sm md:px-gutter"
        >
          <BackToWork slug={project.id} />
          <StatusPill />
        </nav>
      </header>

      <main id="main" className="bg-canvas">
        <article>
          <section className="mx-auto flex max-w-content flex-col gap-8 px-gutter-sm pt-12 md:px-gutter md:pt-[72px]">
            <Reveal className="flex flex-wrap gap-2">
              <Tag>{project.category}</Tag>
              <Tag>{project.subtitle}</Tag>
            </Reveal>

            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:gap-6">
              <h1
                {...{ [VT_ATTR]: project.id }}
                style={{ viewTransitionName: PROJECT_TITLE }}
                className="text-display self-start text-[clamp(2.25rem,9.5vw,8.5rem)]"
              >
                <span className="sr-only">{project.title}</span>
                <span aria-hidden="true">
                  {lines.map((line, i) => (
                    <span key={i} className={cn("block", i > 0 && i === lines.length - 1 && "text-outline")}>
                      {line}
                    </span>
                  ))}
                </span>
              </h1>
              <span className="text-base text-muted md:pb-3.5">/Case Study</span>
            </div>

            <Reveal className="grid items-end gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
              <p className="text-lg leading-[1.6] text-ink-soft md:text-xl">{project.summary}</p>
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <PillButton href={project.liveUrl} arrow>
                    Live Demo
                  </PillButton>
                )}
                <PillButton href={project.githubUrl} variant="secondary" arrow>
                  GitHub
                </PillButton>
              </div>
            </Reveal>

            <Reveal>
              <dl className="mt-2 grid grid-cols-2 border-y border-line md:grid-cols-4">
                {meta.map((m, i) => (
                  <div
                    key={m.label}
                    className={cn(
                      "flex flex-col gap-1.5 py-5 pr-4 md:py-6 md:pr-5",
                      i % 2 === 1 && "border-l border-line pl-4",
                      i >= 2 && "border-t border-line md:border-t-0",
                      i > 0 && "md:border-l md:pl-5",
                    )}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{m.label}</dt>
                    <dd className="text-[15px] font-medium md:text-base">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          {/* Typographic cover: the project's one-line pitch over its outlined name */}
          <section aria-label="Project highlight" className="mx-auto max-w-content px-gutter-sm pt-12 md:px-gutter">
            <Reveal
              className={cn(
                "relative flex min-h-[320px] flex-col justify-between gap-10 overflow-hidden rounded-card p-7 md:min-h-[460px] md:p-10",
                dark ? "bg-ink text-canvas" : "bg-surface text-ink",
              )}
            >
              <div className={cn("flex justify-between gap-4 text-meta", dark ? "text-ink-muted" : "text-ink-soft")}>
                <span>
                  /{num} · {project.category}
                </span>
                <span>{project.liveUrl ? hostOf(project.liveUrl) : "GitHub"}</span>
              </div>
              <p className="relative z-10 max-w-[900px] font-display text-2xl font-semibold leading-[1.25] tracking-[-0.01em] md:text-[40px]">
                {projectBlurb(project)}
              </p>
              <span
                aria-hidden="true"
                className={cn(
                  "text-display pointer-events-none absolute -bottom-9 -left-2 select-none whitespace-nowrap text-[clamp(4rem,12vw,9rem)] opacity-[0.08] md:-bottom-12",
                  dark ? "text-outline-light" : "text-outline",
                )}
              >
                {project.coverTitle.replace("\n", " ")}
              </span>
            </Reveal>
          </section>

          <CaseSections sections={project.sections} />
        </article>

        <nav aria-label="Next project" className="mx-auto max-w-content px-gutter-sm pb-24 pt-28 md:px-gutter md:pb-32 md:pt-36">
          <NextProjectLink slug={next.slug} num={next.num} category={next.category} title={next.title} />
        </nav>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-gutter-sm py-7 text-sm text-muted md:px-gutter">
          <span>© {new Date().getFullYear()} Lucas Lisboa Alves</span>
          <BackToWork slug={project.id} />
        </div>
      </footer>
    </>
  );
}
