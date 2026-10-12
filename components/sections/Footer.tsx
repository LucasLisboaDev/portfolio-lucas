import { ArrowUp } from "@/components/ui/icons";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/**
 * Footer: the name as an oversized outlined wordmark sized to fill the
 * content width exactly (its measured width is 8.4em in the headline font,
 * so font-size = available width / 8.5), then copyright, links and back to top.
 */
export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line pb-10 pt-12 md:pt-14">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-gutter-sm md:px-gutter">
        <p
          aria-hidden="true"
          className="text-display text-outline whitespace-nowrap text-center text-[length:min(calc((100vw_-_2.5rem)/8.5),141px)] md:text-[length:min(calc((100vw_-_5rem)/8.5),141px)]"
        >
          Lucas Lisboa
        </p>
        <div className="flex flex-col items-start gap-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Lucas Lisboa Alves</span>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-11 items-center transition-colors duration-fast hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#top"
            className="group inline-flex min-h-11 items-center gap-2 text-ink transition-colors duration-fast hover:text-accent"
          >
            Back to top
            <ArrowUp size={14} className="transition-transform duration-fast ease-reveal group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
