import type { ProjectSection, ProjectTable } from "@/data/github-projects";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { pad2 } from "@/lib/projects";

/**
 * Renders a project's write-up sections from data/github-projects.ts in the
 * editorial style. Layout is chosen from the content, so new projects need
 * no extra fields:
 *
 * - Sections whose heading starts with "Key" (Key features, Key findings,
 *   Key engineering decisions) become a dark band of numbered cards.
 * - Bullet lists where every item reads "Label: value" with a short label
 *   (Stack sections) become definition rows.
 * - Everything else is a two-column row: label on the left, paragraphs,
 *   numbered bullets and tables on the right.
 */
export default function CaseSections({ sections }: { sections: ProjectSection[] }) {
  return (
    <>
      {sections.map((section, i) =>
        isFeatureSection(section) ? (
          <FeatureBand key={i} section={section} />
        ) : (
          <EditorialRow key={i} section={section} />
        ),
      )}
    </>
  );
}

const isFeatureSection = (s: ProjectSection) => /^key\b/i.test(s.heading) && Boolean(s.bullets?.length);

/** "Label: value" with a short label, for Stack-style lists. */
function splitLabel(text: string): [string, string] | null {
  const m = text.match(/^([^:]{2,28}):\s+(.+)$/);
  if (!m || m[1].split(" ").length > 4) return null;
  return [m[1], m[2]];
}

/** Capitalizes the first letter (text after a lead can start lowercase). */
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** A short lead before ":" or " — " that can be set in bold. */
function splitLead(text: string): [string, string] | null {
  const m = text.match(/^(.{3,48}?)(?::\s+| — )(.+)$/);
  return m ? [m[1], m[2]] : null;
}

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <h2
      className={
        "text-display stretch-normal text-2xl md:text-[28px] " + (dark ? "text-canvas" : "text-ink")
      }
    >
      /{children}
    </h2>
  );
}

function EditorialRow({ section }: { section: ProjectSection }) {
  const defs = section.bullets?.map(splitLabel);
  const asDefinitions = Boolean(defs?.length) && defs!.every(Boolean);

  return (
    <section className="mx-auto max-w-content px-gutter-sm pt-20 md:px-gutter md:pt-28">
      <Reveal className="grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-14">
        <SectionLabel>{section.heading}</SectionLabel>
        <div className="flex min-w-0 flex-col gap-6">
          {section.paragraphs?.map((p, i) => (
            <p key={i} className="text-lead text-ink-soft md:text-lg md:leading-[1.7]">
              {p}
            </p>
          ))}

          {section.bullets && asDefinitions && (
            <dl className="border-t border-line">
              {(defs as [string, string][]).map(([label, value], i) => (
                <div
                  key={i}
                  className="grid gap-1 border-b border-line py-5 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6"
                >
                  <dt className="text-meta font-semibold uppercase tracking-[0.08em] text-accent">{label}</dt>
                  <dd className="text-base md:text-[17px]">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {section.bullets && !asDefinitions && (
            <Stagger as="ol" className="border-t border-line">
              {section.bullets.map((b, i) => {
                const lead = splitLead(b);
                return (
                  <StaggerItem as="li" key={i} className="flex gap-5 border-b border-line py-5">
                    <span className="w-6 shrink-0 pt-0.5 text-meta font-medium text-accent" aria-hidden="true">
                      {pad2(i + 1)}
                    </span>
                    <span className="text-base leading-[1.65] text-ink-soft md:text-[17px]">
                      {lead ? (
                        <>
                          <strong className="font-semibold text-ink">{lead[0]}</strong>
                          {": "}
                          {lead[1]}
                        </>
                      ) : (
                        b
                      )}
                    </span>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}

          {section.table && <DataTable table={section.table} caption={section.heading} />}
        </div>
      </Reveal>
    </section>
  );
}

function FeatureBand({ section }: { section: ProjectSection }) {
  const items = section.bullets ?? [];
  return (
    <section className="mt-20 bg-ink py-20 text-canvas md:mt-28 md:py-28">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <Reveal className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
          <SectionLabel dark>{section.heading}</SectionLabel>
          <span className="text-sm text-ink-muted">{pad2(items.length)} points</span>
        </Reveal>
        {section.paragraphs?.map((p, i) => (
          <p key={i} className="mt-6 max-w-3xl text-lead text-ink-muted">
            {p}
          </p>
        ))}
        <Stagger as="ol" className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((b, i) => {
            const lead = splitLead(b);
            return (
              <StaggerItem
                as="li"
                key={i}
                className="flex min-h-[200px] flex-col gap-3.5 rounded-card bg-ink-surface p-7 transition-transform duration-base ease-reveal hover:-translate-y-1"
              >
                <span className="text-meta font-medium text-accent-soft" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                {lead ? (
                  <>
                    <h3 className="font-display text-lg font-bold leading-snug md:text-xl">{lead[0]}</h3>
                    <p className="text-[15px] leading-[1.6] text-ink-muted">{cap(lead[1])}</p>
                  </>
                ) : (
                  <p className="text-base leading-[1.6] text-canvas/90">{b}</p>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/** Data table in a horizontally scrollable, keyboard-focusable region on small screens. */
function DataTable({ table, caption }: { table: ProjectTable; caption: string }) {
  return (
    <div
      className="overflow-x-auto rounded-card border border-line"
      tabIndex={0}
      role="region"
      aria-label={`${caption} table`}
    >
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-surface">
            {table.headers.map((h) => (
              <th
                key={h}
                scope="col"
                className="whitespace-nowrap px-4 py-3.5 text-meta font-semibold uppercase tracking-[0.06em] text-ink-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className="border-t border-line">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-3.5 font-semibold text-ink">
                    {cell}
                  </th>
                ) : (
                  <td key={c} className="px-4 py-3.5 text-ink-soft">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
