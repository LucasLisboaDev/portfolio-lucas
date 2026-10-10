"use client";

import Image from "next/image";
import { MotionConfig } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import CursorPreview, { useCursorPreviewEnabled } from "@/components/motion/CursorPreview";
import SectionHeading from "@/components/ui/SectionHeading";
import PillButton from "@/components/ui/PillButton";
import StatusPill from "@/components/ui/StatusPill";
import Tag from "@/components/ui/Tag";
import { Mic } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const companies = [
  { name: "Encountr", role: "Software Engineer / AI Developer", logo: "/encountr-logo.png" },
  { name: "Spark Founders", role: "AI Developer Intern", logo: "/USChamber-OFcommerce.jpg" },
  { name: "Carnival Cruise Lines", role: "Software Engineer Intern", logo: "/carnival-emblem.png" },
  { name: "Globant", role: "Software Engineer Intern", logo: "/globant-image.png" },
];

function LabBlock({
  num,
  title,
  note,
  children,
  dark = false,
}: {
  num: string;
  title: string;
  note: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      aria-labelledby={`lab-${num}`}
      className={cn("py-20 md:py-28", dark ? "bg-ink text-canvas" : "bg-canvas text-ink")}
    >
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <div className={cn("mb-12 flex flex-col gap-2 border-b pb-6", dark ? "border-ink-line" : "border-line")}>
          <span className={cn("text-meta font-medium", dark ? "text-ink-muted" : "text-muted")}>/{num}</span>
          <h2 id={`lab-${num}`} className="font-display text-2xl font-bold">
            {title}
          </h2>
          <p className={cn("max-w-2xl text-sm leading-relaxed", dark ? "text-ink-muted" : "text-muted")}>{note}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function CursorDemo() {
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const previewEnabled = useCursorPreviewEnabled();
  const current = hovered !== null ? companies[hovered] : null;

  return (
    <ul
      ref={listRef}
      onPointerLeave={() => setHovered(null)}
      className="relative border-t border-ink-line"
    >
      {companies.map((c, i) => (
        <li
          key={c.name}
          onPointerEnter={() => setHovered(i)}
          className="group flex items-center gap-4 border-b border-ink-line px-2 py-7"
        >
          {!previewEnabled && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-canvas p-2" data-testid="inline-logo">
              <Image src={c.logo} alt="" width={40} height={40} className="h-auto max-h-full w-auto max-w-full object-contain grayscale" />
            </span>
          )}
          <span className="flex flex-col gap-1">
            <span className="font-display text-xl font-bold transition-[transform,color] duration-[350ms] ease-reveal group-hover:translate-x-3.5 group-hover:text-accent-soft md:text-2xl">
              {c.name}
            </span>
            <span className="text-sm text-ink-muted">{c.role}</span>
          </span>
        </li>
      ))}
      <CursorPreview containerRef={listRef} visible={current !== null}>
        <div className="flex h-[150px] w-[220px] items-center justify-center rounded-card bg-canvas p-6 shadow-float">
          {current && (
            <Image src={current.logo} alt="" width={170} height={100} className="h-auto max-h-full w-auto max-w-full object-contain grayscale" />
          )}
        </div>
      </CursorPreview>
    </ul>
  );
}

/**
 * Interactive test bench for every Phase 1 primitive. The toolbar can force
 * reduced motion on (as if the visitor had it enabled in their system
 * settings) and replay all entrance animations.
 */
export default function LabClient() {
  const [forceReduced, setForceReduced] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <MotionConfig reducedMotion={forceReduced ? "always" : "user"}>
      <div className="min-h-screen bg-canvas text-ink">
        <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-gutter-sm py-4 md:px-gutter">
            <div className="flex flex-col">
              <span className="text-display stretch-normal text-xl">Motion Lab</span>
              <span className="text-meta text-muted">Phase 1 building blocks. Not linked from the site.</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PillButton
                variant={forceReduced ? "primary" : "secondary"}
                size="md"
                aria-pressed={forceReduced}
                onClick={() => setForceReduced((v) => !v)}
              >
                Reduced motion: {forceReduced ? "On" : "Off"}
              </PillButton>
              <PillButton variant="secondary" size="md" onClick={() => setRun((r) => r + 1)}>
                Replay animations
              </PillButton>
            </div>
          </div>
        </header>

        <main key={run}>
          <LabBlock
            num="01"
            title="Section headings"
            note="Slash label and meta fade up on enter. The ghost word drifts slower than the page as you scroll, and stays still when reduced motion is on."
          >
            <SectionHeading label="Selected Work" ghost="Projects" meta="06 projects" id="demo-work" />
          </LabBlock>

          <LabBlock
            num="02"
            title="Section heading on a dark section"
            note="The same component with the dark tone, as used by Experience."
            dark
          >
            <SectionHeading label="Experience" ghost="Experience" meta="06 roles and builds" tone="dark" id="demo-exp" />
          </LabBlock>

          <LabBlock
            num="03"
            title="Buttons, status and tags"
            note="Hover a pill with an arrow: the arrow nudges up and right. Tab through them to check the focus ring. Every button is at least 44px tall."
          >
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap items-center gap-3">
                <PillButton href="#lab-03" arrow>
                  Let&apos;s Collaborate
                </PillButton>
                <PillButton variant="secondary">View Resume</PillButton>
                <PillButton icon={<Mic size={16} />}>Start voice conversation</PillButton>
                <PillButton href="https://github.com/LucasLisboaDev" variant="secondary" size="md" arrow>
                  All on GitHub
                </PillButton>
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-card bg-ink p-6">
                <PillButton variant="inverse" arrow>
                  Live Demo
                </PillButton>
                <PillButton variant="inverse-outline" arrow>
                  GitHub
                </PillButton>
                <StatusPill tone="dark" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill />
                <Tag>Next.js 14</Tag>
                <Tag>TypeScript</Tag>
                <Tag variant="outline">Agentic AI</Tag>
                <span className="rounded-card bg-ink p-3">
                  <Tag variant="dark">Related work</Tag>
                </span>
              </div>
            </div>
          </LabBlock>

          <LabBlock
            num="04"
            title="Reveal"
            note="Each card fades up 24px the first time it scrolls into view, 0.6s with the reveal easing. The second and third cards wait a little longer. With reduced motion on, they only fade."
          >
            <div className="grid gap-6 md:grid-cols-3">
              {["First", "Second", "Third"].map((label, i) => (
                <Reveal key={label} delay={i * 0.08} className="flex h-56 flex-col justify-between rounded-card bg-surface p-8">
                  <span className="text-meta text-muted">/0{i + 1}</span>
                  <span className="text-display stretch-normal text-3xl">{label}</span>
                </Reveal>
              ))}
            </div>
          </LabBlock>

          <LabBlock
            num="05"
            title="Stagger"
            note="Rows reveal one after another, 80ms apart, like the Experience and Credentials lists."
          >
            <Stagger as="ul" className="border-t border-line">
              {["Crash Course on Python", "App Development with Swift Associate", "App Development with Swift Certified User", "TIP101: Data Structures and Algorithms"].map((t) => (
                <StaggerItem as="li" key={t} className="border-b border-line py-6 font-display text-xl font-semibold">
                  {t}
                </StaggerItem>
              ))}
            </Stagger>
          </LabBlock>

          <LabBlock
            num="06"
            title="Cursor preview"
            note="With a mouse or trackpad, hover a row and a tilted logo card follows the pointer on a spring. On touch devices, or with reduced motion on, the logo appears inside each row instead."
            dark
          >
            <CursorDemo />
          </LabBlock>

          <div className="h-[40vh]" aria-hidden="true" />
        </main>
      </div>
    </MotionConfig>
  );
}
