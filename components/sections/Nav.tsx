import { githubProjects } from "@/data/github-projects";
import { workExperience } from "@/data/workExperience";
import StatusPill from "@/components/ui/StatusPill";
import PillButton from "@/components/ui/PillButton";
import MobileMenu, { type NavLink } from "./MobileMenu";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Site navigation. A server component, so the project and experience data
 * used for the link counts never ships to the browser; only the small mobile
 * menu is interactive.
 *
 * The anchors point at the current section ids. They switch to the new ids as
 * each section is rebuilt (Work in Phase 3, Experience in Phase 4).
 */
export const navLinks: NavLink[] = [
  { href: "#recent-projects", label: "Work", count: pad(githubProjects.length) },
  { href: "#portfolio", label: "Experience", count: pad(workExperience.length) },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only left-4 top-4 z-[60] rounded-full bg-ink px-4 py-2 text-sm text-canvas focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="mx-auto flex h-[76px] max-w-content items-center justify-between gap-6 px-gutter-sm md:px-gutter"
      >
        <a href="#top" className="flex items-center gap-3 text-ink" aria-label="Lucas Lisboa, back to top">
          <span
            aria-hidden="true"
            className="text-display flex h-[38px] w-[38px] items-center justify-center rounded-full bg-ink text-[12px] tracking-normal text-canvas"
          >
            LL
          </span>
          <span className="text-[15px] font-semibold">Lucas Lisboa</span>
        </a>

        <ul className="hidden items-center gap-9 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-ink transition-colors duration-fast hover:text-accent">
                {link.label}
                {link.count && (
                  <sup className="ml-0.5 text-[10px] text-muted">
                    <span className="sr-only">(</span>
                    {link.count}
                    <span className="sr-only">)</span>
                  </sup>
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <StatusPill className="hidden lg:inline-flex" />
          <PillButton href="#contact" size="md" arrow className="hidden sm:inline-flex">
            Let&apos;s Talk
          </PillButton>
          <MobileMenu links={navLinks} />
        </div>
      </nav>
    </header>
  );
}
