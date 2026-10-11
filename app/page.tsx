import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TalkToMaya from "@/components/sections/TalkToMaya";
import SelectedWork from "@/components/sections/SelectedWork";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Home page.
 *
 * Redesigned so far: Nav, Hero and Talk to Maya (Phase 2) and Selected Work
 * with its case study pages (Phase 3). The remaining sections below still use
 * the previous design and are rebuilt in Phases 4 and 5
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
        <Portfolio />
        <About />
        <Testimonials />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
