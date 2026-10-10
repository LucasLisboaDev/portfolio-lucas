import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TalkToMaya from "@/components/sections/TalkToMaya";
import Portfolio from "@/components/Portfolio";
import RecentProjects from "@/components/RecentProjects";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/**
 * Home page.
 *
 * Redesigned so far: Nav, Hero and Talk to Maya (Phase 2), on the motion
 * system from Phase 1. The remaining sections below still use the previous
 * design and are rebuilt in Phases 3 to 5 (see docs/ANIMATED_PORTFOLIO_PLAN.md).
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="relative bg-canvas">
        <Hero />
        <TalkToMaya />
        <Portfolio />
        <RecentProjects />
        <About />
        <Testimonials />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
