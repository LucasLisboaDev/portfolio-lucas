import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TalkToMaya from "@/components/sections/TalkToMaya";
import SelectedWork from "@/components/sections/SelectedWork";
import Capabilities from "@/components/sections/Capabilities";
import Experience from "@/components/sections/Experience";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Home page.
 *
 * Redesigned so far: Nav, Hero and Talk to Maya (Phase 2) and Selected Work
 * with its case study pages (Phase 3), Capabilities and Experience (Phase 4).
 * The remaining sections below still use the previous design and are rebuilt
 * in Phase 5
 * (see docs/ANIMATED_PORTFOLIO_PLAN.md).
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="relative bg-canvas">
        <Hero />
        <TalkToMaya />
        <SelectedWork />
        <Capabilities />
        <Experience />
        <About />
        <Testimonials />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
