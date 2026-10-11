import SectionHeading from "@/components/ui/SectionHeading";
import PillButton from "@/components/ui/PillButton";
import WorkGrid from "@/components/work/WorkGrid";
import { getProjectCards, pad2, projectCategories } from "@/lib/projects";

/**
 * Selected Work. A server component: it reads the full project data on the
 * server and hands the interactive grid only the small card fields, so the
 * long case study write-ups never ship to the homepage's JavaScript.
 */
export default function SelectedWork() {
  const cards = getProjectCards();

  return (
    <section id="work" aria-labelledby="work-h" className="scroll-mt-20 pb-section-sm pt-20 md:pb-section md:pt-28">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <SectionHeading
          label="Selected Work"
          ghost="Projects"
          id="work-h"
          meta={
            <span className="flex flex-wrap items-center gap-4 md:gap-5">
              <span>{pad2(cards.length)} projects</span>
              <PillButton href="https://github.com/LucasLisboaDev" variant="secondary" size="md" arrow>
                All on GitHub
              </PillButton>
            </span>
          }
        />
        <WorkGrid cards={cards} categories={projectCategories} />
      </div>
    </section>
  );
}
