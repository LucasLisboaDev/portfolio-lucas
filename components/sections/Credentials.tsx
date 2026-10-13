import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckCircle } from "@/components/ui/icons";
import { certificates } from "@/data/certificates";
import { pad2 } from "@/lib/projects";

/** Credentials as divider rows: issuer on the left, certificate on the right. */
export default function Credentials() {
  return (
    <section id="credentials" aria-labelledby="cred-h" className="pb-16 pt-section-sm md:pb-24 md:pt-[140px]">
      <div className="mx-auto max-w-content px-gutter-sm md:px-gutter">
        <SectionHeading label="Credentials" id="cred-h" meta={`${pad2(certificates.length)} certificates`} />
        <Stagger as="ul" className="mt-10 border-t border-line">
          {certificates.map((c) => (
            <StaggerItem
              as="li"
              key={c.title}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1.5 border-b border-line py-6 transition-[padding] duration-[350ms] ease-reveal hover:pl-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:py-[26px]"
            >
              <span className="text-meta font-semibold uppercase tracking-[0.08em] text-accent md:col-auto">
                {c.issuer}
              </span>
              <span className="col-start-1 row-start-2 font-display text-lg font-semibold tracking-[-0.01em] md:col-start-auto md:row-start-auto md:text-[22px]">
                {c.title}
              </span>
              <CheckCircle
                size={22}
                strokeWidth={1.6}
                className="col-start-2 row-span-2 row-start-1 md:col-start-auto md:row-span-1 md:row-start-auto"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
