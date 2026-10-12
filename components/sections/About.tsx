import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const stats = [
  { value: "Black Belt", label: "Brazilian Jiu-Jitsu" },
  { value: "3.9 GPA", label: "B.S. Applied AI, Miami Dade College" },
  { value: "3 Languages", label: "Portuguese, English, Spanish" },
];

const achievements = [
  { title: "Multiple US International Opens Champion", kind: "Competition" },
  { title: "South American Champion", kind: "Competition" },
  { title: "World Ranked Competitor", kind: "Ranking" },
];

const education = [
  { title: "B.S. Applied Artificial Intelligence (AI Engineering)", detail: "Miami Dade College · 2027" },
  { title: "A.S. Computer Programming & Analysis", detail: "Miami Dade College · 2026" },
];

/**
 * About: grayscale photo (color on hover), a display headline, the story,
 * a three-stat strip, BJJ achievements and education as divider rows.
 * A server component; only the small Reveal and Stagger wrappers run in the browser.
 */
export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="py-section-sm md:py-section">
      <div className="mx-auto grid max-w-content items-start gap-12 px-gutter-sm md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-[72px] md:px-gutter">
        <Reveal className="relative md:sticky md:top-28">
          <Image
            src="/lucas-profile.jpeg"
            alt="Lucas Lisboa sitting in an armchair"
            width={1399}
            height={1786}
            sizes="(min-width: 768px) 470px, 100vw"
            className="aspect-[4/5] w-full rounded-card object-cover grayscale transition-[filter] duration-slow ease-reveal hover:grayscale-0"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-4 hidden rounded-full bg-canvas/90 px-3.5 py-2 text-meta font-medium [@media(hover:hover)]:inline-flex"
          >
            Hover to see in color
          </span>
        </Reveal>

        <div className="flex flex-col gap-7">
          <Reveal as="span" className="text-display stretch-normal text-meta tracking-[0.08em] text-accent">
            /About
          </Reveal>
          <Reveal as="h2" id="about-h" className="text-display text-[clamp(2.25rem,4.6vw,4.2rem)]">
            Engineer by trade. <span className="text-outline whitespace-nowrap">Black belt</span> by discipline.
          </Reveal>
          <Reveal className="flex flex-col gap-5 text-lead text-ink-soft">
            <p>
              I&apos;m a U.S. Permanent Resident and Software / AI Engineer with full stack experience designing,
              building, and deploying production grade applications across web, mobile, data, and intelligent
              systems.
            </p>
            <p>
              At Encountr I build production AI systems end to end, including data pipelines, NLP models, agentic
              workflows, and cloud deployed APIs. Beyond tech, I&apos;m a high level Brazilian Jiu-Jitsu black belt,
              and the discipline, resilience, and continuous learning from the mat go into every project.
            </p>
          </Reveal>

          <Stagger as="ul" className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
            {stats.map((s, i) => (
              <StaggerItem
                as="li"
                key={s.value}
                className={
                  "flex flex-col gap-1.5 py-5 sm:py-6 " +
                  (i > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-5 " : "") +
                  (i < stats.length - 1 ? "sm:pr-5" : "")
                }
              >
                <span className="text-display stretch-normal whitespace-nowrap text-[24px] md:text-[22px] lg:text-[26px]">{s.value}</span>
                <span className="text-sm text-muted">{s.label}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="flex flex-col gap-3">
            <h3 className="text-meta font-semibold uppercase tracking-[0.08em] text-muted">Brazilian Jiu-Jitsu</h3>
            <Stagger as="ul" className="border-t border-line">
              {achievements.map((a) => (
                <StaggerItem
                  as="li"
                  key={a.title}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-4 text-[15px]"
                >
                  <span className="font-medium">{a.title}</span>
                  <span className="shrink-0 text-muted">{a.kind}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-meta font-semibold uppercase tracking-[0.08em] text-muted">Education</h3>
            <Stagger as="ul" className="border-t border-line">
              {education.map((e) => (
                <StaggerItem
                  as="li"
                  key={e.title}
                  className="flex flex-col gap-1 border-b border-line py-4 text-[15px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-medium">{e.title}</span>
                  <span className="shrink-0 text-muted">{e.detail}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
